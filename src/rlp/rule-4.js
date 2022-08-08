/*
    Rule 4: [0xb8 .. 0xbf]    
    When encoding a string (in byte array) greater than 55 bytes apply the following rule.

    0xb7+length(length(string)) | length(string) | string
*/


/* helper function to generate random bytes of a decided length */

function randomBytesOfLength (length) {
    return Uint8Array.from( Array.from({length}).map(()=>parseInt(Math.random()*256)))
};


/* value within the range of rule 2 */
Buffer.from(rlp.encode(randomBytesOfLength(55)));
/* value within the range of rule 3 */
Buffer.from(rlp.encode(randomBytesOfLength(56)));
Buffer.from(rlp.encode(randomBytesOfLength(56))).length; 
parseInt('38', 16);



Buffer.from(rlp.encode(randomBytesOfLength(255)));
/* */
Buffer.from(rlp.encode(randomBytesOfLength(256)));
/* */
Buffer.from(rlp.encode(randomBytesOfLength(256*256))); // 256 * 256 == 0x10000 ; expressed in bytes is 01 00 00
/* */
Buffer.from(rlp.encode(randomBytesOfLength(256*256*256)));
/* 
    byte values in the prefix range can encode up to 256^8 bytes 
*/