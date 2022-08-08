/*
    Rule 3: [0x81 .. 0xb7]    
    When encoding a string (of bytes) that falls between 1 and 55 bytes apply the following logic.
    if 1 byte must be above the ASCII range

    0x80+length(string),string
*/

Buffer.from(rlp.encode(128));

Buffer.from(rlp.encode('0xaabbccddee'));

Buffer.from(rlp.encode("hello world"));
/* ethereum js will translate escaped characters to ascii for you */
Buffer.from(rlp.encode("\nhello"));
/* 
    you can rlp encode code snippets. 
    this is another example of how rlp is agnostic 
    it is up to the consumer of the encoded data to KNOW its code 
*/
Buffer.from(rlp.encode(JSON.stringify({a:'0'})));

/* helper function to generate random bytes of a decided length */

function randomBytesOfLength (length) {
    return Uint8Array.from( Array.from({length}).map(()=>parseInt(Math.random()*256)))
};

Buffer.from(rlp.encode(randomBytesOfLength(2)));

Buffer.from(rlp.encode(randomBytesOfLength(10)));

Buffer.from(rlp.encode(randomBytesOfLength(55)));








