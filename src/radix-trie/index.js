const fs = require("fs");
const path = require("path");

class TrieNode {
    /*
        our key (previously path) data is now stored in the _branches array 
    */
    _branches=Array.from({length:16});
    /*
        we now can store a value
    */
    _value;

    constructor(value){
        if(value) {
            this._value = value;
        };
    }

    put(key, value){
        /* 
            from now on we will reffer to individual characters as nibbles 
            as the key (previously path) is a hex string
        */
        const nibble = key[0];
        /* we position the nibble into the branch index by its decimal representation */
        const decimal = parseInt(nibble, 16);
        const existingNode = this._branches[decimal];
        
        if(existingNode){
            key.length==1 ? existingNode._value = value : existingNode.put(key.substring(1), value);
        }else{
            this._branches[decimal] = new TrieNode(value);
            if(key.length!=1) this._branches[decimal].put(key.substring(1), value);
        }
    }
    /*
        we now can retrive value value by key
    */
    get(key){
        const nibble = key[0];
        const decimal = parseInt(nibble, 16);
        const existingNode = this._branches[decimal];

        if(existingNode) {
            return key.length==1 ? existingNode._value : existingNode.get(key.substring(1));
        } else {
            return false;
        }
    }

    findPath(key){
        const nibble = key[0];
        const decimal = parseInt(nibble, 16);
        if(key.length==1){
            return this._branches[decimal]._value && this._branches[decimal];
        }else{
            return this._branches[decimal] && this._branches[decimal].findPath(key.substring(1))
        }
    }

}


/*
    populate trie
*/


const trie = new TrieNode;
trie.put('fa105feaa8fe','ab45d78ab45f');
trie.put('45eabb6500fc','3f56cbaa3ee9');

console.log('\n');

console.log(trie.get('fa105feaa8fe'));
console.log(trie.get('45eabb6500fc'));

console.log('\n');

console.log(trie);

console.log('\n');

/* 
    Generate random entries
*/


const numberOfEntries = 20;

function addRandomHexStrings(n){
    const hexValues = [...'0123456789abcdef'], tempObject={};
    function generateHex(){
        let length = 12;
        let hexString = Array.from({length}).map(()=>hexValues[Math.floor(Math.random()*hexValues.length)]).join('');
        return  hexString;       
    }
    while(n--){
        const key = generateHex();
        const value = generateHex();
        /* 
            avoid duplicates 
            value of tempObject property is irrelevant
        */
        tempObject[key]=value;
    };
    const arrayOfEntries = [...(Object.entries(tempObject).map(([key,value])=>({key,value})))];
    return arrayOfEntries;
}


/* 
    populate linear (array) database 
*/

const linearDatabase = addRandomHexStrings(numberOfEntries);

/* 
    populate Trie database 
*/

linearDatabase.forEach(({key,value})=>trie.put(key,value));


/* 
    create our Radix Trie Databse
*/
function saveToDB(){
    const db = path.resolve(__dirname, './db');
    if (!fs.existsSync(db)){
        fs.mkdirSync(db);
    }
    fs.writeFileSync(path.resolve(db, 'linear.json'), JSON.stringify(linearDatabase));
    fs.writeFileSync(path.resolve(db, 'trie.json'), JSON.stringify(trie));
}


saveToDB();