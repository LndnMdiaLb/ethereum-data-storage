const {Trie, LeafNode, ExtensionNode, BranchNode} = require("@ethereumjs/trie");
const { smallBlock, largeBlock } = require("../constants");
const {
    AccessListEIP2930Transaction: EIP2930Transaction,
    FeeMarketEIP1559Transaction: EIP1559Transaction,
    Transaction: LegacyTransaction,
} = require("@ethereumjs/tx");
const rlp = require("rlp");
const ethers = require("ethers");
const { keccak256 } = require("ethers/lib/utils");

const trie = new Trie();
const blockHash = smallBlock;
let provider = new ethers.providers.JsonRpcProvider();
let block;

function changeSyntax (tx){
    tx = {...tx};
    tx.data = tx.input;
    delete tx.input;
    tx.gasLimit = tx.gas;
    delete tx.gas;
    return tx;
}

async function recreateTransactionTrie (block, trie){
    await Promise.all(block.transactions.map((tx, i) => 
            (async (tx, i) => {
                tx = changeSyntax(tx);
                let TransactionClass;
                switch (tx.type){
                    case '0x0': TransactionClass = LegacyTransaction; break;
                    case '0x1': TransactionClass = EIP2930Transaction; break;
                    case '0x2': TransactionClass = EIP1559Transaction; break;
                }
                const serializedTx = TransactionClass.fromTxData(tx).serialize();
                /* 
                    something strange ...
                    the blockchain stores values 0x0 expecting them to be interpreted as 0x80 in rlp! (infura ?)
                    
                     ¯\_(ツ)_/¯

                     rlp.encode("0x0")  === Uint8Array(1) [ 0 ]
                     rlp.encode(0)      === Uint8Array(1) [ 128 ]
                */
                console.log('\n\ntransaction:\n');
                console.log(`key: rlp encoded transaction index: ${tx.transactionIndex}\n`);
                console.log(Buffer.from(rlp.encode(i)));
                console.log('\nvalue: rlp encoded transaction \n')
                console.log(serializedTx);
                console.log(`\n\nis keccak hash of serialised transaction equal to hash in block: ${tx.hash ==keccak256(serializedTx)}`);
                return await trie.put( rlp.encode(i), serializedTx);
            })(tx, i) 
        )); 
};

(async (blockHash)=> {
    block = await provider.send("eth_getBlockByHash", [ blockHash, true ]);
    await recreateTransactionTrie(block, trie);
    console.log('\n\nStructure of our Trie\n')
    await inspectTrie(trie);

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