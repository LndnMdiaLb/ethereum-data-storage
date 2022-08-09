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
