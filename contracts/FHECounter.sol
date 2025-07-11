// SPDX-License-Identifier: BSD-3-Clause-Clear
pragma solidity ^0.8.20;

import "fhevm-solidity/contracts/TFHE.sol";

contract FHECounter {
    // 加密的计数器状态
    euint32 private _count;

    // 构造函数，初始化加密计数器为 0
    constructor() {
        _count = TFHE.asEuint32(0);
        TFHE.allowThis(_count);
    }

    // 增加计数器
    function increment(externalEuint32 memory inputEuint32, bytes calldata inputProof) external {
        euint32 evalue = TFHE.fromExternal(inputEuint32, inputProof);
        _count = TFHE.add(_count, evalue);
        TFHE.allowThis(_count);
        TFHE.allow(_count, msg.sender);
    }

    // 减少计数器
    function decrement(externalEuint32 memory inputEuint32, bytes calldata inputProof) external {
        euint32 evalue = TFHE.fromExternal(inputEuint32, inputProof);
        _count = TFHE.sub(_count, evalue);
        TFHE.allowThis(_count);
        TFHE.allow(_count, msg.sender);
    }

    // 获取加密计数器值（仅授权用户可解密）
    function getCount() external view returns (externalEuint32 memory) {
        return TFHE.asExternalEuint32(_count);
    }
}
