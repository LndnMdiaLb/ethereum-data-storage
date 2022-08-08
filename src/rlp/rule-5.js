/*
    Rule 5: [0xc1 .. 0xf7]     
    When encoding a list and the encoded payload in the list is between 0–55 bytes apply the following encoding rule.

    0xc0+length of (list  (with individual rlp encoding))) | list items (with individual rlp encoding)
*/

function randomBytesOfLength (length) {
    return Uint8Array.from( Array.from({length}).map(()=>parseInt(Math.random()*256)))
};

/* c0 is similar to the rlp value 80 in that it represents an empty item */
Buffer.from(rlp.encode([]));

Buffer.from(rlp.encode([ "0xff" ]));
Buffer.from(rlp.encode([ "0xff", [ "0xff" ] ]));
Buffer.from(rlp.encode([ "0xff", [ "0xff", [ "0xff" ]] ]));

/* you can't fit the maximum value of rule 2 in this rule it forces encoding into range of rule 6 */
Buffer.from(rlp.encode([randomBytesOfLength(55)]));
Buffer.from(rlp.encode([randomBytesOfLength(54)]));