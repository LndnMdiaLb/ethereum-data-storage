## RLP encoding / decoding

Recursive Length Prefix is a custom Ethereum encoding system that accepts nested structures and expresses them in a series of bytes that can then be decoded back into the original structure. RLP only recongines **2 types of "items"**. A **_"byte string"_**, a series of bytes of length 1+ and a **_list_**, an a array of any combination of _byte strings_ and/or _lists_. RLP is agnostic of the data you encode. It has no knoweledge of the content. It's up to the consumer of the decoded content to interpret it.

It _prefixes_ items with a byte, or multiple bytes, that describe the item and its length. Hence _Length Prefix_. It is _Recursive_ in that _lists_ can contain _lists_ and every depth is itself encoded. When encoding parent items, the _length prefix_ of the parent will take into account the _length prefix_ bytes of the child when calculating its own prefix.

It will take a structure such as :

    [ <Buffer ab cd ef>,
        [ <Buffer aa bb cc>, <Buffer 01>, <Buffer ff>,
            [ <Buffer 01 02 03> ]
        ],
        <Buffer 89 45 ef >
    ]

And express it like :

    <Buffer d5 83 ab cd ef cc 83 aa bb cc 01 81 ff c4 83 01 02 03 83 89 45 ef>

### Encoding Rules

RLP encoding relies on **6 Rules**

#### Single Byte Rules

- **Rule 1** : A single Byte whose value is in the ASCII range does not require a _length prefix_

- **Rule 2** : Empty values are encoded as the byte 80 (example: null, '', an empty byte). 0 is **not** an empty value

#### Multiple Byte Rules (byte string)

- **Rule 3** : To encode a _byte string_ of length <= 55. we start from the hex value **80** & add the length of the byte string
  you may encounter this rule expressed as :

  - `0x80+length(string) , string`

- **Rule 4** : To encode a _byte string_ of > 55. We take the length of the byte string. we start from the hex value **b7** & add the length of the length of the string and then concatenate that length in bytes.
  you may encounter this rule expressed as :

  - `0xb7+length(length(string)) , length(string) , string`

#### List Rules (array)

- **Rule 5** : To encode a _list_ of length <= 55. we first apply RLP encoding on it's list items, then start from the hex value **c0** & add the length of all the bytes in the list
  you may encounter this rule expressed as :

  - `0xc0+length(list) , list`

- **Rule 6** : To encode a _list_ of length > 55. we first apply RLP encoding on it's list items, then. We then take the length of the list string. we start from the hex value **f7** & add the length of the length of the string and then concatenate that length in bytes.
  you may encounter this rule expressed as :

  - `0xf7+length(length(list)) , length(list) , list`

A useful function for calculating prefix information

    function calculatePrefix (ruleStart, numberOfBytes){
      return (parseInt(ruleStart, 16) + numberOfBytes).toString(16)
    }

    function calculateByteLength (prefix, ruleStart){
      return (parseInt(prefix, 16) - parseInt(ruleStart, 16))
    }

The encoded bytes for each rule fall in the following range (what rlp prefixes mean when decoding).

- rule 1: `[ 0x00 ... 0x7f ]` - **128** possible byte values
- rule 2: `0x80` - **1** possible byte value
- rule 3: `[ 0x81 ... 0xb7 ]` - **55** possible byte values
- rule 4: `[ 0xb8 ... 0xbf ]` - **8** possible byte values
- rule 5: `[ 0xc0 ... 0xf7 ]` - **55** possible byte values
- rule 6: `[ 0xf8 ... 0xff ]` - **8** possible byte values

### How RLP is used for different Data Structures

Examples of how RLP is agnostic of the data you encode:

RLP encodes transactions. Example of signatures of an rlp encoded transactions

    Legacy :	[ nonce, gasPrice, gasLimit, to, value, data, init, v,r,s ]

    Type 1 :    [ chainId, nonce, gasPrice, gasLimit, to, value, data, accessList, signatureYParity, signatureR, signatureS ]

    Type 2 :    [ chain_id, nonce, max_priority_fee_per_gas, max_fee_per_gas, gas_limit, destination, amount, data, access_list, signature_y_parity, signature_r, signature_s ]

    receipt:    [ status, cumulativeGasUsed, logsBloom, logs ]

RLP is also used to encode Trie Structures whose information can look like this :

    [ <Buffer 20 cd ef>,
        [ <Buffer,
          <Buffer,
          <Buffer,
          <Buffer,
          <Buffer,
          <Buffer,
          <Buffer,
          ...
          [  <Buffer 1b e2 03> ]
        ],
        <Buffer 04 >
    ]
