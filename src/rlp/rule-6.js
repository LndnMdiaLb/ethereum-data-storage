/*    
    Rule 6: [0xf8 .. 0xff]     
    When encoding a list and the encoded payload in the list is greater than 55 bytes apply the following encoding rule.

    0xf7+length(length(list)) | length(list) | list 

*/

/* due to the extra bytes of the list encoding */
Buffer.from(rlp.encode([randomBytesOfLength(55)]));

Buffer.from(rlp.encode([randomBytesOfLength(255)]));

Buffer.from(rlp.encode([randomBytesOfLength(256*256)]));