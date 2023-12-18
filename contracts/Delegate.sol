// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity ^0.8.20;

import "./interfaces/IDelegate.sol";
import "@openzeppelin/contracts/utils/introspection/ERC165Checker.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";

contract Delegate is IDelegate {
    mapping (bytes32 => Status) delegations;

    constructor() {}

    // This check might be too strict for our use case
    function isERC721(address _addr) private view returns (bool) {
        return ERC165Checker.supportsInterface(_addr, type(IERC721).interfaceId);
    }

    function delegate(
        address receiver,
        address asset,
        uint256 tokenId,
        bytes32 rights
    ) external override {
        require(isERC721(asset), "Receiver is not an ERC721 contract");
        require(
            IERC721(asset).ownerOf(tokenId) == msg.sender,
            "Sender is not the owner of the token"
        );
        bytes32 delegationHash;
        delegationHash = keccak256(
            abi.encodePacked(
                msg.sender,
                receiver,
                asset,
                tokenId,
                rights
            )
        );
        require(
            delegations[delegationHash] == Status.INACTIVE,
            "Receiver already has a delegation"
        );

        delegations[delegationHash] = Status.ACTIVE;

        emit Delegated(msg.sender, receiver, asset, tokenId);
    }

    function undelegate(
        address receiver,
        address asset,
        uint256 tokenId,
        bytes32 rights
    ) external override {
        bytes32 delegationHash;
        delegationHash = keccak256(
            abi.encodePacked(
                msg.sender,
                receiver,
                asset,
                tokenId,
                rights
            )
        );
        require(
            delegations[delegationHash] == Status.ACTIVE,
            "Receiver doesn't have a delegation"
        );

        delegations[delegationHash] = Status.INACTIVE;

        emit Undelegated(msg.sender, receiver, asset, tokenId);
    }

    function checkDelegate(
        address delegator,
        address receiver,
        address asset,
        uint256 tokenId,
        bytes32 rights
    ) external view override returns (bool) {
        bytes32 delegationHash;
        delegationHash = keccak256(
            abi.encodePacked(
                delegator,
                receiver,
                asset,
                tokenId,
                rights
            )
        );
        return (
            delegations[delegationHash] == Status.ACTIVE
        );
    }
}