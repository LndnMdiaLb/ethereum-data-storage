/* 
    to inspect storage and state we must run an in-process network
*/
const fs = require("fs");
const path = require("path");
const { ethers } = require("hardhat");
const rlp = require("rlp");

/* 
    access hardhat's storage instances 
*/
const accessTries = require('./access-in-process-tries');
const recreateStorageTrie = require('./storage-trie');

const contractName = 'Storage';
const getArtifactPath = (name) => path.resolve(process.cwd(),'artifacts/contracts',`${name}.sol`,`${name}.json`);
const deploymentAddressesPath = path.resolve(process.cwd(),'scripts-output','deployment-addresses.json');

const deploymentAddresses = JSON.parse(fs.readFileSync(deploymentAddressesPath));
/*
    deployedBytecode is the same as what is returned by eth_getCode
*/
const { abi, bytecode } = JSON.parse(fs.readFileSync(getArtifactPath(contractName)));

const provider = ethers.provider;
let contractAddress;

async function deployContract (){
    const signer = await provider.getSigner();    
    const factory = new ethers.ContractFactory(abi, bytecode, signer);
    const deployedContract = await factory.deploy();
    /* save address for use in other scripts */
    deploymentAddresses[contractName] = deployedContract.address;
    fs.writeFileSync(deploymentAddressesPath, JSON.stringify(deploymentAddresses));
};

async function inspectInProcessTrie(){
    const {stateTrie, storageTries} = await accessTries()
    contractAddress = deploymentAddresses[contractName].substring(2).toLowerCase();
    const storageTrie = storageTries[contractAddress];
    return {stateTrie, storageTrie}

};

(async()=>{
    await deployContract();
    const { storageTrie, stateTrie } = await inspectInProcessTrie();
    const v = await stateTrie.get(Buffer.from(contractAddress,'hex'));
    console.log('\nvalues in state trie associated to address:\n')
    /* state trie rlp([nonce, balance, storageRoot, codeHash]) */
    console.log(rlp.decode(v))
    
    console.log('\ninprocess storage trie root:\n')
    console.log(Buffer.from(storageTrie.root));
})();
