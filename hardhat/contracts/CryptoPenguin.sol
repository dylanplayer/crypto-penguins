// SPDX-License-Identifier: MIT
pragma solidity 0.8.9;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract CryptoPenguin is ERC721URIStorage, AccessControl {
  using Counters for Counters.Counter;
  Counters.Counter private _tokenIds;
  
  bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");
  string private _tokenBaseURI;
  
  uint256 public constant MAX_PENGUINS = 1000;
  
  constructor(string memory baseURI) ERC721("CryptoPenguin", "CP") {
    _updateBaseURI(baseURI);
    _setupRole(DEFAULT_ADMIN_ROLE, msg.sender);
    _setupRole(ADMIN_ROLE, msg.sender);
  }

  function setBaseURI(string memory baseURI) external {
    require(hasRole(ADMIN_ROLE, msg.sender), "CryptoPenguin: must have admin role to set base URI");
    _updateBaseURI(baseURI);
  }

  function getBaseURI() public view returns (string memory) {
    return _tokenBaseURI;
  }

  function _updateBaseURI(string memory baseURI) internal {
    _tokenBaseURI = baseURI;
  }

  function mint(address recipient) public returns (uint256) {
    require(_tokenIds.current() < MAX_PENGUINS, "CryptoPenguin: maximum number of penguins reached");
    _tokenIds.increment();
    uint256 newTokenId = _tokenIds.current();
    _mint(recipient, newTokenId);
    _setTokenURI(newTokenId, string(abi.encodePacked(_baseURI(), newTokenId)));
    return newTokenId;
  }

  function getTokensByOwner(address owner) public view returns (uint256[] memory) {
    uint256 tokenCount = balanceOf(owner);
    uint256[] memory tokens = new uint256[](tokenCount);
    uint256 tokenIndex = 0;
    for (uint256 i = 1; i <= _tokenIds.current(); i++) {
      if (ownerOf(i) == owner) {
        tokens[tokenIndex] = i;
        tokenIndex++;
      }
    }
    return tokens;
  }

  function transfer(address from, address to, uint256 tokenId) public {
    require(_isApprovedOrOwner(msg.sender, tokenId), "CryptoPenguin: transfer caller is not owner nor approved");
    _transfer(from, to, tokenId);
  }

  function supportsInterface(bytes4 interfaceId) public view virtual override(ERC721, AccessControl) returns (bool) {
    return super.supportsInterface(interfaceId);
  }
}
