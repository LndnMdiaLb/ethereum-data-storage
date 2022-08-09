/*********************
 
    Minimal Radix Trie

*********************/



class TrieNode {

    constructor(isTerminator){
        /* 
            the first person to figure out why I chose the value 16 as the terminator value
            will win a prize
        */
        if(isTerminator) this['16'] = 1;
    }

    /* 
        accepts a path: a string of characters
        while moving through the past string character by character
        recursively build the trie structure 
    */

    put(path){
        /* we use the first key (character) of the path */
        const path_key = path[0];
        /* remove the key from rest of path */
        const path_rest = path.substring(1);

        /* 
            if the key does not exist on this TrieNode instance
        */
        if(!this[path_key]){
            /* 
                instantiate a TrieNode and store in the key prop of this TrieNode
                if no path left set isTerminator 
            */
            this[path_key] = new TrieNode(path_rest.length==0);
            /* 
                if path characters still exist in path string 
                pass to .put in TrieNode instance stored at key property just created
                this is recursive
            */
            if(path_rest.length) this[path_key].put(path_rest);

        /* if the key already exists on the TrieNode instance */
        }else{
            /* 
                if the path has been completed set terminator
                if it isn't recursively .put path 
            */
            path_rest.length ? this[path_key].put(path_rest) : this[path_key]['16'] = 1;
        }

    }

    /*
        recursively look for path till complition whithin trie structure 
    */
   
    findPath(path){
        /* we use the first key (character) of the path */
        const path_key = path[0];
        /* remove the key from rest of path */
        const path_rest = path.substring(1);
        if(path.length==1){
            return this[path_key]['16'] && this[path_key];
        }else{
            return this[path_key] && this[path_key].findPath(path_rest)
        }
    }

}


/*
    populate trie
*/


const trie = new TrieNode;
trie.put('word');
trie.put('wood');


/*
    tests trie
*/


function existsInTrie(word) {
    if (!!trie.findPath(word)){
        console.log(`found "${word}" in radix-trie`);
    } else{
        console.log(`did not find "${word}" in radix-trie`);
    }
}


console.log('\n');

existsInTrie('word');
existsInTrie('wood');
existsInTrie('woo');
existsInTrie('hi');

console.log('\n');