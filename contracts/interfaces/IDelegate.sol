// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

interface IDelegate {
    enum Status {
        INACTIVE,
        ACTIVE
    }

    // EVENTS
    event DelegatedERC721(
        address indexed delegator,
        address indexed receiver,
        address indexed asset,
        uint256 tokenId,
        bool enable
    );

    event DelegatedERC20(
        address indexed delegator,
        address indexed receiver,
        address indexed asset,
        uint256 value,
        bool enable
    );

    event DelegatedERC1155(
        address indexed delegator,
        address indexed receiver,
        address indexed asset,
        uint256 tokenId,
        uint256 value,
        bool enable
    );

    // FUNCTIONS
    function delegateERC721(
        address receiver,
        address asset,
        uint256 tokenId,
        bytes32 rights,
        bool enable
    ) external;

    function delegateERC1155(
        address receiver,
        address asset,
        uint256 tokenId,
        uint256 amount,
        bytes32 rights,
        bool enable
    ) external;

    function delegateERC20(
        address receiver,
        address asset,
        uint256 amount,
        bytes32 rights,
        bool enable
    ) external;

    function checkDelegateERC721(
        address delegator,
        address receiver,
        address asset,
        uint256 tokenId,
        bytes32 rights
    ) external view returns (bool);

    function checkDelegateERC1155(
        address delegator,
        address receiver,
        address asset,
        uint256 tokenId,
        uint256 amount,
        bytes32 rights
    ) external view returns (bool);

    function checkDelegateERC20(
        address delegator,
        address receiver,
        address asset,
        uint256 amount,
        bytes32 rights
    ) external view returns (bool);
}