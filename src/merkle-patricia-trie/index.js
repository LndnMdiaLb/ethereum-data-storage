const path = require("path");
const { Trie } = require("@ethereumjs/trie");
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
    /*
        adding a second entry into the trie. Note the first nibble is different from the last entry
    */ 
    await trie.put(Buffer.from('bb', 'hex'), Buffer.from([2])); 

    const trieNode = await trie.lookupNode(trie.root);

    console.log(trieNode);

    console.log(`\nTrie Node in serialize() format :\n`);

    console.log(trieNode.serialize());

    console.log(`\nKeccak hash of selialised bytes :\n`);

    console.log(Buffer.from(keccak(trieNode.serialize())));

    console.log('\n\nLevelDB database entries:\n');

    const entries = await db.iterator({ limit: 100 }).all()

    for (const [key, value] of entries) {
        console.log(key,' | ',value);
    }

    console.log('\n');
})();