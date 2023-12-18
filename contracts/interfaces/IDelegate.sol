// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

interface IDelegate {
    enum Status {
        INACTIVE,
        ACTIVE
    }

    event Delegated(
        address indexed delegator,
        address indexed receiver,
        address indexed asset,
        uint256 tokenId
    );

    event Undelegated(
        address indexed delegator,
        address indexed receiver,
        address indexed asset,
        uint256 tokenId
    );

    function delegate(
        address receiver,
        address asset,
        uint256 tokenId,
        bytes32 rights
    ) external;

    function undelegate(
        address receiver,
        address asset,
        uint256 tokenId,
        bytes32 rights
    ) external;

    function checkDelegate(
        address delegator,
        address receiver,
        address asset,
        uint256 tokenId,
        bytes32 rights
    ) external view returns (bool);
}