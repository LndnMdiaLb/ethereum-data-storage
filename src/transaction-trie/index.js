

const { Trie } = require("@ethereumjs/trie");
/* 
    2 blocks of 2 complexities
*/
const { smallBlock, largeBlock } = require("../constants");
const {
    AccessListEIP2930Transaction: EIP2930Transaction,
    FeeMarketEIP1559Transaction: EIP1559Transaction,
    Transaction: LegacyTransaction,
} = require("@ethereumjs/tx");
const rlp = require("rlp");
const ethers = require("ethers");

const trie = new Trie();
/* 
    you can use largeBlock to create more complex trie 
*/
const blockHash = smallBlock;
let provider = new ethers.providers.JsonRpcProvider();
let block;

function changeSyntax (tx){
    tx = {...tx};
    /*
        in returned block data transaction has 2 properties 'input' and 'gas'
        we modify these as they are expected as 'data' and 'gasLimit' in ethereumjs 
    */
    tx.data = tx.input;
    delete tx.input;
    tx.gasLimit = tx.gas;
    delete tx.gas;
    return tx;
}

async function recreateTransactionTrie (block, trie){
    await Promise.all(block.transactions.map((tx, i) => 
            (async (tx, i) => {
                /* modify transaction syntax */
                tx = changeSyntax(tx);
                let TransactionClass;
                switch (tx.type){
                    /*
                        ethereumjs provides individual classes to work with different transaction types
                    */
                    case '0x0': TransactionClass = LegacyTransaction; break;
                    case '0x1': TransactionClass = EIP2930Transaction; break;
                    case '0x2': TransactionClass = EIP1559Transaction; break;
                }
                const serializedTx = TransactionClass.fromTxData(tx).serialize();
                /*
                    The canonical rule for recreating a transaction trie is 
                    
                    key : rlp encode the transactionIndex ( position in the transaction array in block )
                    value : serialized transaction ( type | rlp encoded transaction ) 
                */
                return await trie.put( rlp.encode(i), serializedTx);
            })(tx, i) 
        )); 
};

(async (blockHash)=> {
    /*
        why not use :  provider.getBlock( block ) ?

        ethers getBlock method offers lots of convenince functionality (ex. turning values into BigNumbers)
        but purposefully, internally creates and returns an object with commonly useful block data.  
        we want all block data. so we use the more generic send rpc method
    */
    block = await provider.send("eth_getBlockByHash", [ blockHash, true ]);
    await recreateTransactionTrie(block, trie);
    /* 
        check the 
        block.transactionsRoot stored in the block
        matches our local trie's root hash
    */
    console.log(`block.transactionsRoot matches trie.root : ${block.transactionsRoot === ethers.utils.hexlify(trie.root)}`);
})(blockHash);