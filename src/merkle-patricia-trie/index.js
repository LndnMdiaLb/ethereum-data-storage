const path = require("path");
const { Trie, LeafNode, ExtensionNode, BranchNode, WalkController, LevelDB } = require("@ethereumjs/trie");

const {Level} = require("level");
const dbPath = path.resolve(__dirname,"db");
const db = new LevelDB(new Level(dbPath, { keyEncoding: 'buffer', valueEncoding: 'buffer' }));

const trie = new Trie();

async function trieMethods(){
    
    await trie.put(Buffer.from('abcd', 'hex'),  Buffer.from([1])); 
    await trie.put(Buffer.from('ab', 'hex'), Buffer.from([2])); 
    await trie.put(Buffer.from('bb', 'hex'), Buffer.from([3])); 
    await trie.put(Buffer.from('abce', 'hex'),  Buffer.from([1])); 

    /* 
        looking for the root node instance by doing a look up of the merkle root on db
    */
    const trieNode = await trie.lookupNode(trie.root);
    /*  
        get value associated to key
    */
    console.log(await trie.get(Buffer.from('abcd', 'hex')))
    /*  
        find Path down trie to key, will return a stack amongst other things of nodes traversed
    */
    console.log(await trie.findPath(Buffer.from('abcd', 'hex')));
    

    /* 
        using trie.walkTrie method that instantiates WalkController 
    */
    // await inspectTrie(trie)
    /* 
        instantiate WalkController directly 
    */
    // await walkTrie(trie);
    /* */
}


async function inspectTrie(trie){
    await trie.walkTrie(trie.root, 
        async (nodeRef, node, keyProgress, walkController) => {
            
            /* 
                nodeRef : how the node is referenced within the parent
                can be the equivalent of node.raw() ouput or a hash if  longer than 32 bytes
            */  

            /* 
                node instance with .raw() .serialize() methods
            */  

            /*
                keyProgress: the nibbles traversed so far in the key (at time of node)
            */

            /*
                walkController : class that allows you to traverse trie. note: walkTrie only steps down through trie
                when prompted too you need to recursively traverse trie ex using: walkController.allChildren(node)
            */

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

/*
    alternatively to using trie.walkTrie you can instantiate WalkController directly
*/

async function walkTrie(trie){
    const wController = new WalkController(async( nodeRef, node, keyProgress) => {
        console.log(node);
        await wController.allChildren(node)
    }, trie, 500);
    await wController.startWalk(trie.root) 
}


async function dbTrie (){

    const databaseBackedTrie = new Trie({db});
    
    await databaseBackedTrie.put(Buffer.from('abcd', 'hex'),  Buffer.from([1])); 
    await databaseBackedTrie.put(Buffer.from('abcd', 'hex'), Buffer.from([2])); 
    await databaseBackedTrie.put(Buffer.from('abcd', 'hex'), Buffer.from([3])); 
    await databaseBackedTrie.put(Buffer.from('abcd', 'hex'),  Buffer.from([4])); 

    /* 
        the level db database stores the serialised data using the hash of the serialised data as a key 
    */
    const entries = await db._leveldb.iterator({ limit: 100 }).all()
    const dbKeys=[];

    for (const [key, value] of entries) {
        console.log(key,' | ', value);
    }

    for (const [key, value] of entries) {
        dbKeys.push(key);
        const newTrie = databaseBackedTrie.copy();
        newTrie.root = key;
        console.log(await newTrie.get(Buffer.from('abcd', 'hex')));
    }
   
};

// trieMethods();
dbTrie();