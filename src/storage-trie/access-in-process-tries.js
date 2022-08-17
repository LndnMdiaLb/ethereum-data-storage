const hre = require("hardhat");
/* 
    accessing the hre.ethers is
    required to trigger lazy load 
*/
const { ethers } = require("hardhat");

module.exports = () => new Promise((res, rej) => {
    let internalStateManager;
    function checkForTries(){
        if(hre.network.provider?._wrapped?._wrapped?._wrapped?._node){
            internalStateManager = hre.network.provider._wrapped._wrapped._wrapped._node._stateManager;
            const {
                _trie: stateTrie,
                _storageTries: storageTries } = internalStateManager;
            res({stateTrie, storageTries});
            return
        }
        setTimeout(checkForTries, 10);
    }
    checkForTries();
});