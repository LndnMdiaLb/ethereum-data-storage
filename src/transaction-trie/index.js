const {Trie} = require("@ethereumjs/trie");
const { smallBlock, largeBlock } = require("../constants");
const rlp = require("rlp");
const ethers = require("ethers");

const trie = new Trie();
const blockHash = smallBlock;

function changeSyntax (tx){
    tx = {...tx};
    /*
        in block returned a transaction has 2 properties 'input' and 'gas'
        that are expected as 'data' and 'gasLimit' 
        modifications for ethereumjs 
    */
    tx.data = tx.input;
    delete tx.input;
    tx.gasLimit = tx.gas;
    delete tx.gas;
    return tx;
}

function formatRecursively (value) {
    /* 
        if value is an object place values in an array. 
        rlp works on byte strings and arrays of byte strings.
        rlp is agnostic of structure it is up to the consumer to interpret
        this is similar to how a transaction is transformed from an object to array 
    */
    const encodable = value instanceof Object? Object.values(value) : value;
    /*
        if item is an array (list) recursively format internal items
    */
    if(Array.isArray(encodable)){
        return [...encodable.map(element=>formatRecursively(element))]
    }else{
        /* 
            this is a bit of a hack explicitly for transforming the value 0x0 as expressed in blocks on the blockchain
            internally this value is expected to be expressed as the rlp encoding 80
        */
        if(value==="0x0") value = "0x";
    }
    return value;
}

const rulesForTxType = {
    /* 
        indicates LEGACY transaction 
    */
    '0x0' : {
        /*
            we must follow the rlp signature of a LEGACY transaction
            
            Legacy	    rlp([nonce, gasPrice, gasLimit, to, value, data, init, vrs ]) 
        */
        rlpFields : (tx) => {
            const { nonce, gasPrice, gasLimit, to, value, data, v, r, s } = tx;
            return [ nonce, gasPrice, gasLimit, to, value, data, v, r, s];
        },
        /* 
            we must take into consideration  EIP-2718 for LEGACY transaction 
        */
        txEnvelope: (buffer) => buffer
    },
    /* 
        indicates EIP-2930: "Optional access lists" transaction 
    */
    '0x1' : {
        /* 
            we must follow the rlp signature of a EIP-2930: "Optional access lists" transaction

            Type 1	    0x01 || rlp([ chainId,  nonce,  gasPrice,  gasLimit,  to,  value,  data,  accessList,  signatureYParity,  signatureR,  signatureS ])     
        */
        rlpFields : (tx) => {
            const { chainId, nonce, gasPrice, gasLimit, to, value, data, accessList, v, r, s } = tx;
            return [ chainId, nonce, gasPrice, gasLimit, to, value, data, accessList, v, r, s ];
        },
        /* 
            we must take into consideration EIP-2718 for EIP-2930: "Optional access lists" transaction

            Type 2	    0x02 || rlp([ chain_id,  nonce,  max_priority_fee_per_gas,  max_fee_per_gas,  gas_limit,  destination,  amount,  data,  access_list,  signature_y_parity,  signature_r,  signature_s ])     
        */
        txEnvelope: (buffer) => {
            const type = Buffer.from('01','hex');
            return Buffer.concat([type, buffer])
        }
    },
    /* 
        indicates EIP-1559 transaction 
    */
    '0x2' : {
        /* 
            we must follow the rlp signature of a EIP-1559 transaction 
        */
        rlpFields : (tx) => {
            const { chainId, nonce, maxPriorityFeePerGas, maxFeePerGas, gasLimit, to, value, data, accessList, v, r, s } = tx;
            return [ chainId, nonce, maxPriorityFeePerGas, maxFeePerGas, gasLimit, to, value, data, accessList, v, r, s ];
        },
        /* 
            we must take into consideration  EIP-2718 for EIP-1559 transaction 
        */
        txEnvelope: (buffer) => {
            const type = Buffer.from('02','hex');
            return Buffer.concat([type, buffer]);
        }
    }   

};

(async()=>{
    
    const provider = new ethers.providers.JsonRpcProvider();
    const block = await provider.send("eth_getBlockByHash",[ blockHash, true ]);

    await Promise.all(block.transactions.map((tx, i) => 
        (async (tx, i) => {
            /* 
                account for naming conventions 
            */
            tx = changeSyntax(tx);
            const { rlpFields, txEnvelope } = rulesForTxType[tx.type];
            /* 
                follow rlp siganture for specific tx type 
            */
            const rlpData = rlpFields(tx);
            /* 
                format data to make it rlp encodable 
            */
            const rlpEncodable = formatRecursively(rlpData);
            /* 
                complete serialisation (EIP-2718) 
            */
            const rlpBytes = Buffer.from(rlp.encode(rlpEncodable));
            const completeSerialization = txEnvelope(rlpBytes);
            
            return await trie.put( rlp.encode(i), completeSerialization );
        })(tx, i) 
    ));

    console.log(`block.transactionsRoot matches trie.root : ${block.transactionsRoot === ethers.utils.hexlify(trie.root)}`);
    
})();




