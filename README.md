## Merkle Patricia Tries

**Merkle Patricia Tries (MPT)** are the expected way that data will be organised when storing data on the Ethereum blockchain. They are a modification of the Patricia Trie and use 3 structures internally to more efficiently represent paths to data. These are **Extension Nodes**, **Branch Nodes** and **Leaf Nodes**. The trie is secured by the use of _merkling_ to ensure the data is authentic and cannot be falsefied.

The **Extension Node** stores a "short cut" down the trie in the form of nibbles that don't have any data branching off them. A **Branch Node** is a regular branch Node. A **Leaf node**, like and Extension Node stores a "short cut" down the trie in the form of nibbles that don't have any data branching off them.

This branch makes use of the `ethereumjs/trie` library to construct and inspect the structure of MPTs and `level` to create a a LevelDB database that stores the trie data.

### Hex Prefixing MPTs in Ethereum

An internal encoding system used by Ethereum MPTs to differentiate between the Node types Extension, Branch and Leaf. It is similar to RLP in that it prefixes data. There are 4 rules.

If a Node is an **Extension Node** whose Nibble short cut is an **even** number it will prefix the data with **00**

ex: `<nibbles abcd>` become `<bytes 00 ab cd>`

If a Node is an **Extension Node** whose Nibble short cut is an **odd** number it will prefix the data with **1**

ex: `<nibbles abc>` become `<bytes 1b cd>`

If a Node is an **Leaf Node** whose Nibble short cut is an **even** number it will prefix the data with **20**

ex: `<nibbles abcd>` become `<bytes 20 ab cd>`

If a Node is an **Leaf Node** whose Nibble short cut is an **odd** number it will prefix the data with **1**

ex: `<nibbles abc>` become `<bytes 3b cd>`

If a Node is an **Branch Node** it receives no prefix
