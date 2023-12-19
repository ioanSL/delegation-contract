pragma solidity ^0.8.20;

import "../interfaces/IDelegate.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";

contract LicenseCheck {
    IDelegate delegate;

    constructor(address _delegate) {
        delegate = IDelegate(_delegate);
    }

    function checkLicense(address licensor, address licensee, address asset, uint256 tokenId) external view returns (bool) {
        assert(IERC721(asset).ownerOf(tokenId) == licensor);
        return delegate.checkDelegateERC721(licensor, licensee, asset, tokenId, "USE");
    }
}