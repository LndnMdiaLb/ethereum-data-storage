# Ethereum Data Storage

An interactive walk through of the processes through which Ethereum encodes and serializes data structures into sequences of Bytes, stores them, and retrieves them. In this repository you will find information about **Recursive Length Prefix (RLP)** encoding, **Hex Prefix** encoding, **Merkle Patricia Tries** as well as examples of **Basic Radix Tries**

You will also find working examples of reconstructed Ethereum **Transaction Trie**, **Transaction Receipt Trie** as well as an example of a reconstructed **Storage Trie** powered by the use of Hardhat's in-process network.

The Libraries used to varying degrees are:

- [rlp](https://github.com/ethereumjs/ethereumjs-monorepo/tree/master/packages/rlp)
- [@ethereumjs/trie](https://github.com/ethereumjs/ethereumjs-monorepo/tree/master/packages/trie)
- [level](https://github.com/Level/level)
- [@ethereumjs/tx](https://github.com/ethereumjs/ethereumjs-monorepo/tree/master/packages/tx)
- [ethers.js](https://github.com/ethers-io/ethers.js/)
- [hardhat](https://github.com/NomicFoundation/hardhat)

The repo is designed to accompany the DeveloperDao Workshop video recording. Branches are structured in such a way as to build up knowledge. The branch order is `rlp`, `radix-trie`, `merkle-patricia-trie`, `eth-txns-trie`, `eth-txns-receipts-trie`, `eth-storage-trie`. The complete file list is available on branch `master`. If you are follow along with the video recording you can use individual commits in each branch to follow the build up of files. Each individual branch has a README.md file specific to the subject while branch `master` contains all information.

## RLP encoding

## Radix Tries

## Merkle Patricia Tries

## Transaction Trie

## Transaction Receipt Trie

## Storage Trie
