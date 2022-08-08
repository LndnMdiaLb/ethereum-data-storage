const rlp = require("rlp");
const ethers = require("ethers");

/* 
    ethereumjs rlp implementation and ethers js implementation both adhere to the RLP rules.
    They differ in what they will accept as input & the   
    
    Ethers js is stricter and requires for a user to format information in a specific way.

    Ethereum js is more forgiving & will apply more formatting for you.
*/

/* 
    ethereumjs

    return rlp formatted as Uint8Array
*/

/* single byte */
rlp.encode(127);  
rlp.encode('0x11');

/* byte string */                       
rlp.encode(Uint8Array.from([1,1,3]));                  
rlp.encode(Buffer.from([1,2,3]))                             

/* list */
rlp.encode([1,2,3]);   
rlp.encode(["0x00","0x","0xab"]);

/* convenience functionality */
rlp.encode("0x1");                                  // will encode even though its not a datahex (even nibbles)
rlp.encode("hello world");                          // will internally convert to ascii and then byte string


/* 
    ethers js
     
    returns rlp formatted as hex prefixed strings ( DataHex )
*/

ethers.utils.RLP.encode("0x");   
ethers.utils.RLP.encode(new Uint8Array);            
ethers.utils.RLP.encode(Uint8Array.from([01]));      
ethers.utils.RLP.encode(Buffer.from([01]));  
ethers.utils.RLP.encode(["0x00","0x","0xab"]);

/* 
    errors 
*/

ethers.utils.RLP.encode(127);                       // will not automatically interpret as a uint8 value
ethers.utils.RLP.encode([1,1]);                     // will not automatically interpret list item as a uint8 value
ethers.utils.RLP.encode("0x0");                     // does not accept odd nibbles needs to be a datahex
ethers.utils.RLP.encode("hello world");             // will not automatically convert to ascii
