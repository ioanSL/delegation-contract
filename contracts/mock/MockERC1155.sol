// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";

contract MockERC1155 is ERC1155 {
    mapping(uint256 => address) public _owners;

    constructor() ERC1155("MockERC1155") {}

    function mint(address to, uint256 tokenId, uint256 value, bytes memory data) external {
        _mint(to, tokenId, value, data);
        _owners[tokenId] = to;
    }

    function ownerOf(uint256 tokenId) public view returns (address) {
        return _owners[tokenId];
    }
}