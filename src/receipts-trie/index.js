// https://blog.mycrypto.com/new-transaction-types-on-ethereum

const {Trie, LeafNode, ExtensionNode, BranchNode} = require("@ethereumjs/trie");
const { smallBlock } = require("../constants");
const rlp = require("rlp");
const ethers = require("ethers");

const trie = new Trie();
const blockHash = smallBlock;
let provider = new ethers.providers.JsonRpcProvider();
let block;



function formatRecursively (value) {
    /* 
        if value is an object place values in an array. 
        rlp works on byte strings and arrays of byte strings.
        rlp is agnostic of structure it is up to the consumer to interpret
        this is similar to how a transaction is transformed from an object to array 
    */
    let encodable = value instanceof Object? Object.values(value) : value;
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
        if(encodable==="0x0") encodable = "0x";
    }
    return encodable;
}


async function recreateTransactionReceiptsTrie (){
    await Promise.all(block.transactions.map((tx, i) => 
        (async (tx, i) => {
            const receipt = await provider.send("eth_getTransactionReceipt",[tx.hash]);

            /*
                the rlp signature is rlp([status,cumulativeGasUsed,logsBloom,logs])
            */
           
            const receiptData = [
                receipt.status,
                receipt.cumulativeGasUsed,
                receipt.logsBloom,
                receipt.logs
            ];
            
            const rlpEncodable = formatRecursively(receiptData);

            /* 
                no extra serialization necessary (ex: transaction trie "type prefix") 
            */

            return await trie.put( rlp.encode(i), rlp.encode(rlpEncodable));
        })(tx, i) 
    )); 
};

(async (blockHash)=> {
    block = await provider.send("eth_getBlockByHash",[ blockHash, true ]);

    await recreateTransactionReceiptsTrie();

    console.log(`block.receiptsRoot matches trie.root : ${block.receiptsRoot === ethers.utils.hexlify(trie.root)}`)
    inspectTrie(trie)
    
})(blockHash);

async function inspectTrie(trie){
    await trie.walkTrie(trie.root, 
        async (nodeRef, node, keyProgress, walkController) => {
            
            walkController.allChildren(node)

            if (node instanceof LeafNode) {
                console.log("LeafNode");
                return 
            }

            if (node instanceof ExtensionNode) {
                console.log("ExtensionNode");
                return 
            }
            
            if (node instanceof BranchNode) {
                console.log("BranchNode");
                return 
            } 

        });
}
