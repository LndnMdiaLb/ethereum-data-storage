# Ethereum Data Storage

An interactive walk through of the processes through which Ethereum encodes and serializes data structures into sequences of Bytes, stores them, and retrieves them. In this repository you will find information about **Recursive Length Prefix (RLP)** encoding, **Hex Prefix** encoding, **Merkle Patricia Tries** as well as examples of **Basic Radix Tries**. You will also find working examples of reconstructed Ethereum **Transaction Trie**, **Transaction Receipt Trie** as well as an example of a reconstructed **Storage Trie** powered by the use of Hardhat's in-process network.

The github repo is designed to accompany the DeveloperDao Workshop recordings [part 1](https://www.youtube.com/watch?v=4WwbiFR71nA) and [part 2](https://www.youtube.com/watch?v=QvSl8B1j-yY).

### Part 1 ([link](https://www.youtube.com/watch?v=4WwbiFR71nA))

Intro & Concept Review [timecode 6:40](https://www.youtube.com/watch?v=4WwbiFR71nA&t=6m40s)

RLP [timecode 13:02](https://www.youtube.com/watch?v=4WwbiFR71nA&t=13m2s)

Trie, Radix Trie, Patricia Trie [timecode 51:30](https://www.youtube.com/watch?v=4WwbiFR71nA&t=51m30s)

Merkle Patricia Trie [timecode 1:11:30](https://www.youtube.com/watch?v=4WwbiFR71nA&t=1h11m30s)

### part 2 ([link](https://www.youtube.com/watch?v=QvSl8B1j-yY))

Review & Elaboration of Part 1 Concepts [timecode 5:58](https://www.youtube.com/watch?v=QvSl8B1j-yY&t=5m57s)

Tries used by Ethereum [timecode 34:57](https://www.youtube.com/watch?v=QvSl8B1j-yY&t=34m52s)

The Transaction Trie [timecode 41:36](https://www.youtube.com/watch?v=QvSl8B1j-yY&t=41m36s)

The Transaction Receipts Trie [timecode 1:07:00](https://www.youtube.com/watch?v=QvSl8B1j-yY&t=1h7m00s)

The State and Storage Tries [timecode 1:08:35](https://www.youtube.com/watch?v=QvSl8B1j-yY&t=1h8m45s)

Branches are structured in such a way as to build up knowledge. The branch order is the following.[`rlp`](https://github.com/LndnMdiaLb/ethereum-data-storage/tree/rlp), [`radix-trie`](https://github.com/LndnMdiaLb/ethereum-data-storage/tree/radix-trie), [`merkle-patricia-trie`](https://github.com/LndnMdiaLb/ethereum-data-storage/tree/merkle-patricia-trie), [`eth-txns-trie`](https://github.com/LndnMdiaLb/ethereum-data-storage/tree/eth-txns-trie), [`eth-txns-receipts-trie`](https://github.com/LndnMdiaLb/ethereum-data-storage/tree/eth-txns-receipts-trie), [`eth-storage-trie`](https://github.com/LndnMdiaLb/ethereum-data-storage/tree/eth-storage-trie). If you follow along with the video recording you can use individual commits in each branch to follow the build up of files. Each individual branch has a README.md file specific to the subject.

The Libraries used to varying degrees are:

[rlp](https://github.com/ethereumjs/ethereumjs-monorepo/tree/master/packages/rlp), [@ethereumjs/trie](https://github.com/ethereumjs/ethereumjs-monorepo/tree/master/packages/trie), [level](https://github.com/Level/level), [@ethereumjs/tx](https://github.com/ethereumjs/ethereumjs-monorepo/tree/master/packages/tx), [ethers.js](https://github.com/ethers-io/ethers.js/), [hardhat](https://github.com/NomicFoundation/hardhat)

Reference material can be found [here](./REFERENCE.md)

## Fundamental Concepts Review

A quick review of some fundamentals that will help us navigate the information ahead.

### Hexadecimal and Decimal Conversion

    parseInt('ff', 16);     // 255
    (255).toString(16);     // 'ff'

### Nibbles

half a Byte expressed in hex as `0 - f` and `0 - 15` in decimal

### Expressing Bytes

When dealing with blockchain data we are continuously reading and manipulating series of bytes. The bytes. What follows is a quick review of ways will will encounter Bytes expressed in the various libraries.

NodeJS Buffer

    /* Bytes expressed as nodejs Buffer */

    Buffer.from([255]);                     // <Buffer ff>
    Buffer.from('ff', 'hex');               // <Buffer ff>

Javascript Uint8Array

    /* Bytes expressed as Uint8Array */

    Uint8Array.from([255]);                 // Uint8Array(1) [ 255 ]
    Uint8Array.from(['0xff']);              // Uint8Array(1) [ 255 ]

DataHex - '0x' prefixed string of an even number of Nibbles

    '0xff'
    '0x' // is a valid value and represents an empty byte

### Recursion

Functions that call themselves. A very powerful pattern at the heart of the _Composite Pattern_. Recursive functions can create a wide range of nested objects as well as help traverse nested objects.

#### Building a Nested Structure

    const nestedObject = (depth, parent={}, i=1) => {
        parent.child = depth >= i+1 ? nestedObject(depth, parent.child, ++i ) : {end:1} ;
        return parent;
    };


    nestedObject(3)

results in:

    {
        child: {
            child: {
                child:{
                    end: 1
                }
            }
        }
    }

#### Serialising an existing Nested Structure

    function encode(item) {
        let output;
        if (Array.isArray(item)){
            const innerOutput = item.reduce((output, inner)=>{
                return output+encode(inner);
            }, '');
            output = `A${item.length}${innerOutput}`
        } else {
            output = `S${item}`
        }
        return output
    };

encoding the following nested array

    const nestedArray = [  'a','b','c', [ 'd','e', [ 'f' ] ], 'g' ];
    encode(nestedArray);

results in:

    'A5SaSbScA3SdSeA1SfSg'

A recursive function can be written to decode this string back into its original format
