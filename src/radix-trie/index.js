const fs = require("fs");
const path = require("path");

class TrieNode {

    constructor(isTerminator){
        if(isTerminator) this['16'] = 1;
    }

    put(path){
        const path_key = path[0];
        const path_rest = path.substring(1);
        if(!this[path_key]){
            this[path_key] = new TrieNode(path_rest.length==0);
            if(path_rest.length) this[path_key].put(path_rest);
        }else{
            path_rest.length ? this[path_key].put(path_rest) : this[path_key]['16'] = 1;
        }

    }
   
    findPath(path){
        const path_key = path[0];
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
    create our Radix Trie Databse
*/

function saveToDB(){
    const db = path.resolve(__dirname, './db');
    if (!fs.existsSync(db)){
        fs.mkdirSync(db);
    }
    fs.writeFileSync(path.resolve(db, 'trie.json'), JSON.stringify(trie));
}

console.log('\n');

console.log(trie);

console.log('\n');

saveToDB();