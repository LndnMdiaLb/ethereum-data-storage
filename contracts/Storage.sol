// SPDX-License-Identifier: MIT
pragma solidity >0.5.0 <=0.8.0;

contract Storage {
    /* 
        fixed array that can fit in 32 bytes 
    */
    uint32[3] array32 = [1, 2, 3];

    /* 
        add for dynamic array that can fit in 32 bytes 
    */
    // uint32[] dynamicArray32 = [1, 2, 3];

    /* 
        add for dynamic array that doesn't fit in 32 bytes 
    */
    // uint128[] array128 = [1, 2, 3, 4];
}
