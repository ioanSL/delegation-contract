// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity ^0.8.20;

import "./interfaces/IDelegate.sol";
import "@openzeppelin/contracts/utils/introspection/ERC165Checker.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/token/ERC1155/IERC1155.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract Delegate is IDelegate {
    mapping (bytes32 => Status) delegations;

    constructor() {}

    // This check might be too strict for our use case
    function isERC721(address _addr) private view returns (bool) {
        return ERC165Checker.supportsInterface(_addr, type(IERC721).interfaceId);
    }

    function isERC1155(address _addr) private view returns (bool) {
        return ERC165Checker.supportsInterface(_addr, type(IERC1155).interfaceId);
    }

    function _delegate(
        address receiver,
        address asset,
        bytes memory data,
        bytes32 rights,
        bool enable
    ) private {

        bytes32 delegationHash = keccak256(
            abi.encodePacked(
                msg.sender,
                receiver,
                asset,
                data,
                rights
            )
        );
        
        if (enable) {
            require(
                delegations[delegationHash] == Status.INACTIVE,
                "Receiver already has a delegation"
            );
            delegations[delegationHash] = Status.ACTIVE;
        } else {
            require(
                delegations[delegationHash] == Status.ACTIVE,
                "Sender does not have a delegation"
            );
            delegations[delegationHash] = Status.INACTIVE;
        }
    }

    function delegateERC721(
        address receiver,
        address asset,
        uint256 tokenId,
        bytes32 rights,
        bool enable
    ) external override {
        require(isERC721(asset), "Asset is not an ERC721 contract");
        require(
            IERC721(asset).ownerOf(tokenId) == msg.sender,
            "Sender is not the owner of the token"
        );
        bytes memory data = abi.encode(tokenId);
        _delegate(receiver, asset, data, rights, enable);

        emit DelegatedERC721(msg.sender, receiver, asset, tokenId, enable);
    }

    function delegateERC20(
        address receiver,
        address asset,
        uint256 amount,
        bytes32 rights,
        bool enable
    ) external override {
        require(
            IERC20(asset).balanceOf(msg.sender) >= amount,
            "Sender does not have enough balance"
        );

        bytes memory data = abi.encode(amount);
        _delegate(receiver, asset, data, rights, enable);
        
        emit DelegatedERC20(msg.sender, receiver, asset, amount, enable);
    }

    function delegateERC1155(
        address receiver,
        address asset,
        uint256 tokenId,
        uint256 amount,
        bytes32 rights,
        bool enable
    ) external override {
        require(isERC1155(asset), "Asset is not an ERC1155 contract");
        require(
            IERC1155(asset).balanceOf(msg.sender, tokenId) >= amount,
            "Sender does not have enough balance or is not the owner of the token"
        );
        bytes memory data = abi.encode(tokenId, amount);
        _delegate(receiver, asset, data, rights, enable);
        
        emit DelegatedERC1155(msg.sender, receiver, asset, tokenId, amount, enable);
    }

    function checkDelegateERC721(
        address delegator,
        address receiver,
        address asset,
        uint256 tokenId,
        bytes32 rights
    ) external view override returns (bool) {
        bytes memory data = abi.encode(tokenId);
        bytes32 delegationHash = keccak256(
            abi.encodePacked(
                delegator,
                receiver,
                asset,
                data,
                rights
            )
        );
        return (
            delegations[delegationHash] == Status.ACTIVE
        );
    }

    function checkDelegateERC1155(
        address delegator,
        address receiver,
        address asset,
        uint256 tokenId,
        uint256 amount,
        bytes32 rights
    ) external view override returns (bool) {
        bytes memory data = abi.encode(tokenId, amount);
        bytes32 delegationHash = keccak256(
            abi.encodePacked(
                delegator,
                receiver,
                asset,
                data,
                rights
            )
        );
        return (
            delegations[delegationHash] == Status.ACTIVE
        );
    }

    function checkDelegateERC20(
        address delegator,
        address receiver,
        address asset,
        uint256 amount,
        bytes32 rights
    ) external view override returns (bool) {
        bytes memory data = abi.encode(amount);
        bytes32 delegationHash = keccak256(
            abi.encodePacked(
                delegator,
                receiver,
                asset,
                data,
                rights
            )
        );
        return (
            delegations[delegationHash] == Status.ACTIVE
        );
    }
}