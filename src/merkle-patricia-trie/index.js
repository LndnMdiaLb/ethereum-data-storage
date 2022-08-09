const { Trie } = require("@ethereumjs/trie");
const rlp = require("rlp");
const { keccak256:keccak } = require("ethereum-cryptography/keccak");

const trie = new Trie();

(async ()=>{

    /* @ethereumjs/trie accepts byte data as both keys and values */

    const key = Buffer.from('abcd', 'hex');
    const value = Buffer.from([1]);

    await trie.put(key, value); 

    console.log(`\nour Trie root!\n`);
    console.log(trie.root);

    const trieNode =  await trie.lookupNode(trie.root);

    console.log(`\n`);
    console.log(trieNode);
    console.log(`\n`);
    
    /* 
        TrieNode Classes have multiple methods that incorporate RLP & Hex Prefix encoding
    */

    console.log(`\n\nTrie Node in raw() format :\n`);

    /* 
        hex prefix serialization
        Node is expressed in it's minimal format as an array of values
    */

    console.log(trieNode.raw());

    /* 
        hex prefix serialization + RLP serializarion
        array is rlp encoded into a series of bytes
    */

    console.log(`\n`); 
    console.log(`\nTrie Node in serialize() format :\n`);

    console.log(trieNode.serialize());

    console.log(`\n`);
    /* 
        rlp.decode to return to raw format
    */ 

    // console.log(rlp.decode(trieNode.serialize()));
    // console.log(`\n`);
    
    /* 
        rlp.encode to raw format to serialize
    */ 

    // console.log(rlp.encode(trieNode.raw()));
    // console.log(`\n`);

    /* 
        keccak hash of selialised bytes
    */ 

    // console.log(Buffer.from(keccak(rlp.encode(trieNode.raw()))))
    // console.log(`\n`);
})();