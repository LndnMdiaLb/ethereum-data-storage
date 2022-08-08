/*
    Rule 2: 
    hex : 0x80   dec: 128 

    reserved value for "empty" bytes ( not the byte value 00 )
*/

rlp.encode(new Uint8Array);
rlp.encode(Uint8Array.from([]));
rlp.encode(Buffer.from([]));

rlp.encode('0x');
rlp.encode('');

/* is not an empty value it is covered by rule 1 */
rlp.encode('0x00');

// so what happens if you rlp code the byte hex value 80 ? (prelude to rule 2)

rlp.encode(128);
