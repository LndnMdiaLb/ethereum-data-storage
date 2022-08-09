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

    const key = Buffer.from('abcd', 'hex');
    const value = Buffer.from([1]);

    await trie.put(key, value); 

    const trieNode = await trie.lookupNode(trie.root);


    console.log(`\nTrie Node in serialize() format :\n`);

    console.log(trieNode.serialize());

    console.log(`\nKeccak hash of selialised bytes :\n`);

    console.log(Buffer.from(keccak(trieNode.serialize())))

    console.log('\n\nLevelDB database entries:\n');

    const entries = await db.iterator({ limit: 100 }).all()

    /* 
        the level db database stores the serialised data using the hash of the serialised data as a key 
    */
    for (const [key, value] of entries) {
        console.log(`key:\n\n`,key,'\n\nvalue:\n\n',value);
    }

    console.log('\n');
})();