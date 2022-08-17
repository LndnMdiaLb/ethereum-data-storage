const hre = require("hardhat");
const { ethers } = require("hardhat");
const {hexStripZeros, hexZeroPad, hexConcat, keccak256, arrayify, hexlify} = ethers.utils;

// console.log(hre.ethers.provider)
const fs = require("fs");
const path = require("path");
const rlp = require("rlp"); 
const {SecureTrie} = require("@ethereumjs/trie"); 

const deploymentAddressesPath = path.resolve(process.cwd(),'scripts-output','deployment-addresses.json');
const contractName = 'Storage'
const deploymentAddresses = JSON.parse(fs.readFileSync(deploymentAddressesPath));
const address = deploymentAddresses[contractName];

const provider = ethers.provider;

/* 
    storage tries and state tries use SecureTrie as a way to prevent DoS attacks
*/
const trie = new SecureTrie();

/* 
    ensure that we are dealing with an even number of nibbles 
*/
function makeDataHex(hex){
    return hexZeroPad(hex, Math.ceil(hex.substring(2).length/2))
};

/*
    pad a value to 32 bytes
*/
function hex32bytes(n){
    if(n.length == 66) return n;
    return hexZeroPad([Number(n)], 32)
};

/* 
    get the next consecutive hex value 
*/
function incrementHex(hex, by=1){
    return ethers.BigNumber.from(hex).add(by).toHexString()
};

/*
    determine slot key: 
    
    either by index in smart contract
    or hashed value of index of smart contract for dynamic values
*/
function slotKey(n, hashed=false){
    return hashed ? keccak256(hex32bytes(n)) : hex32bytes(n)
};

/* 
    retrieve storage slot from blockchain
    re format it and place in a custom trie
*/
async function addStorage(key){
    const value = await provider.send("eth_getStorageAt", [ address, key, "latest" ]);
    /* 
        in the database the VALUE (not key) is stored without unecssary zeros 
    */
    const binaryValue = makeDataHex(hexStripZeros(value));

    console.log('\n\nstorage slot');
    console.log('\nkey:', key);
    console.log('\nvalue:', binaryValue);

    // SecureTrie does keccak key hashing automatically
    
    await trie.put(arrayify(key), rlp.encode(arrayify(binaryValue)));
    
    // console.log('\nnode instance:\n')
    // console.log((await trie.lookupNode(trie.root)))
}

async function recreateTransactionTrie(){
    /* 
        first struct item (string - dynamic): value is length * 2 +1 
    */
    await addStorage(slotKey(0));
    /* 
        first struct item content (as much as fits in 32 bytes) 
    */
    await addStorage(slotKey(0, 'hashed'));
    /* 
        first struct item content continued (as much as fits in 32 bytes) 
    */
    let nextHexValue = incrementHex(slotKey(0, 'hashed'));
    await addStorage(nextHexValue);
    /* 
        second struct item (array - dynamic): value is length of array 
    */
    await addStorage(slotKey(1));
    /* 
        second struct item content (as much as fits in 32 bytes) 
    */
    await addStorage(slotKey(1, 'hashed'));
    /* 
        second struct item content (as much as fits in 32 bytes) 
    */
    nextHexValue = incrementHex(slotKey(1, 'hashed'));
    await addStorage(nextHexValue);

    console.log('\ncustom storage trie root:\n');
    console.log(Buffer.from(trie.root));
};

module.exports = recreateTransactionTrie;
