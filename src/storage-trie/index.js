/* 
    to inspect storage and state we must run an in-process network
*/
const fs = require("fs");
const path = require("path");
const { ethers } = require("hardhat");

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
    const contractAddress = deploymentAddresses[contractName].substring(2).toLowerCase();
    const storageTrie = storageTries[contractAddress];
    return {stateTrie, storageTrie}

};

(async()=>{
    await deployContract();
    const { storageTrie } = await inspectInProcessTrie();
    console.log('\ninprocess storage trie root\n')
    console.log(Buffer.from(storageTrie.root));
    recreateStorageTrie();
})();
