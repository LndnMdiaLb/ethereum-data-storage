const { Trie, LeafNode } = require("@ethereumjs/trie");

const trie = new Trie();

(async ()=>{

    /* 
        @ethereumjs/trie accepts byte data as both keys and values 
    */

    const key = Buffer.from('abcd', 'hex');
    const value = Buffer.from([1]);

    await trie.put(key, value); 

    console.log(`\nour Trie root!\n`);
    console.log(trie.root);

    /* 
        method to find a node in our trie 
        Trie Class and TrieNode Classes are seperate entities ( compared to basic radix-trie examples ) 
    */
    const trieNode =  await trie.lookupNode(trie.root);

    console.log(`\n`);
    console.log(trieNode);
    console.log(`\n`);
    
    /* 
        there are 3 types of TrieNode Classes BranchNode, ExtensionNode, LeafNode
    */
    console.log(`is our node and instance of LeafNode ? ${trieNode instanceof LeafNode}`);

    console.log(`\n`);
})();