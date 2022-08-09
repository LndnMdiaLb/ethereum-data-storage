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

/* 
    Generate random entries
*/

// 100000
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


/*********************
 
    Speed test searching our Databases

*********************/


function speedTest(){

    /* random database entry */

    const randomEntry = linearDatabase[Math.floor(Math.random()*linearDatabase.length)];

    console.log(`\n`);
    console.log(`using ${linearDatabase.length} database items`);
    console.log(`\n`);

    let start, end, diff,n;

    /* test linear */

    start = new Date(); 
    n=10000;
    while(n--){
        /* 
            test array.find     
        */
        linearDatabase.find(word=>word==randomEntry)
    }
    end =  +new Date();
    diff = end - start;

    console.log(`linear search executed in: ${diff} milliseconds`);

    /* test trie */

    start = new Date(); 
    n=10000;
    while(n--){
        /* 
            test trie.find     
        */
        trie.findPath(randomEntry);
    }
    end =  +new Date();  // log end timestamp
    diff = end - start;
    console.log(`trie lookup executed in: ${diff} milliseconds`);
    console.log(`\n\n`);

}

speedTest()