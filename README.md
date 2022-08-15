## The Ethereum Transaction Trie

Transactions are the way through which to action change on the blockchain and specifically it's database. Maintaing a historic list of transaction can be important to a variety of applications, for example Light Clients. A Light client is an ethereum node that doesn't store transaction data but may need it for some implementation. Constructing a transaction trie at every block and commiting the transaction root to said block allows for nodes that don't have access to all the data to be able to ASK for it without worrying about it's validity, AS LONG as they have access to a trusted source of block data.

### Transaction Types

What is [EIP-2718](https://blog.mycrypto.com/new-transaction-types-on-ethereum)? The EIP concatenates Transaction Type to the rlp encoded transaction data as a way to allow for an ever increasing number of transaction types to be added to Ethereum. This makes decoding data easier by indicating what signature is needed to decode the rlp encoded data when reading the serialised bytes. The byte is appended to the rlp encoded information.
