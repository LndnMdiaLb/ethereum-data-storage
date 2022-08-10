const path = require("path");
const { Trie } = require("@ethereumjs/trie");
const rlp = require("rlp");
/*
    LevelDb is a key value storage.  Its a look up table think excel sheet with 2 columns
*/
const {Level} = require("level");
const { keccak256:keccak } = require("ethereum-cryptography/keccak");

const dbPath = path.resolve(__dirname,"db");
const db = new Level(dbPath, { keyEncoding: 'buffer', valueEncoding: 'buffer' });

const trie = new Trie({db});

(async ()=>{
    
    await trie.put(Buffer.from('abcd', 'hex'),  Buffer.from([1])); 
    await trie.put(Buffer.from('ab', 'hex'), Buffer.from([2])); 
    await trie.put(Buffer.from('bb', 'hex'), Buffer.from([3])); 
    await trie.put(Buffer.from('abce', 'hex'),  Buffer.from([1])); 

    /* 
        looking for the root node instance by doing a look up of the merkle root 
    */
    const trieNode = await trie.lookupNode(trie.root);
    /* 
        node instance in raw hex prefix encoded format 
        (not rlp encoded yet. can be done manually or generated using trieNode.serialize()) 
    */
    // console.log(trieNode);
    console.log(trieNode.raw());
    /* 
        value at branch position 10 is hash 
    */
    console.log(trieNode._branches[10]);

    console.log('\n');
    /* 
        look up hash key on db and retrieve rlp encoded value 
    */
    const dbValue = await db.get(trieNode._branches[10]);
    
    /* 
        the key of database value is the hash of value
        and is equal to value stored at trieNode._branches[10]
    */
    console.log(Buffer.from(keccak(dbValue)));
    
    /* 
        or create the hash from the db value
        let nodeOfInterest = await trie.lookupNode(keccak(dbValue)); 
    */
    let nodeInstance = await trie.lookupNode(trieNode._branches[10]);
    console.log(nodeInstance);
    
    console.log('\nThe serialised instance of the node is equal to the value staored in the  database\n');
    console.log(nodeInstance.serialize());
    console.log(dbValue);
    /* 
        the above process repeated only this time nodeInstance is an extension node so we read _value 
    */
    nodeInstance = await trie.lookupNode(nodeInstance._value);
    /* 
        the nodes that are represented without needing to be hashed.  
        Their length is more then 32 bytes thus triggering the hashing 
    */
    console.log(nodeInstance);
    console.log(nodeInstance._branches[12]);
})();