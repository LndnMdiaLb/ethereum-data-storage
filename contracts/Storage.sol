// SPDX-License-Identifier: MIT
pragma solidity >0.5.0 <=0.8.0;

contract Storage {
    struct StructUintS_SA {
        string s;
        string[] sa;
    }

    StructUintS_SA public S_SA;

    constructor() {
        S_SA.s = "this is a long string that has more than 32 bytes"; // length 49
        S_SA.sa.push("first string");
        S_SA.sa.push("second string");
    }
}
