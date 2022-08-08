/*
    Rule 1: 
    hex : [0x00, 0x7f]    
    dec: [0, 127]    
    * his deliberately equates to ASCII values *
    
    a single byte who's value falls within this range it will be encoded as its own value without prefixing.
*/

parseInt('7f', 16); // 127

const rlp = require("rlp");
const ethers = require("ethers");

rlp.encode('a');
rlp.encode('1');  // the string 1 as opposed to the number 1

rlp.encode('0x7f');
rlp.encode(Uint8Array.from([127]));

/* convert text string into array of ascii values */
const ascii = [...'hello'].map(letter=>letter.charCodeAt(0))
/* convert to Byte string */
const asciiByteString = Uint8Array.from(ascii);
rlp.encode(asciiByteString);

Buffer.from(rlp.encode(asciiByteString));
ethers.utils.RLP.encode(asciiByteString);

/* outside of rule 1 */

rlp.encode('0xaabbccddee');

/* A further example of Rule 1 in anction notice how the 2 array (List) of bytes are rlp encoded */

Buffer.from(rlp.encode(ascii));
Buffer.from(rlp.encode(['0xaa', '0xbb', '0xcc', '0xdd', '0xee']));

/* convenience functionality */
rlp.encode('hello world'); 

/*
    example of how utf8 / ascii is practically used ?
    PolyNetwork Exploiter

    https://etherscan.io/tx/0x4c102e972301b999318df70e3d3a067994dcc83951f07f7f37c45ff7e922beec

*/