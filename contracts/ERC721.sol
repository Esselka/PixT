/// @title Interface for contracts conforming to ERC-721: Non-Fungible Tokens

pragma solidity ^0.5.0;

contract ERC721 {
    // Required methods
    function balanceOf(address _owner) public view returns (uint256 balance);
    function ownerOf(uint256 _tokenId) external view returns (address owner);
    function transferFrom(address _from, address _to, uint256 _tokenId) external;

    // Events
    event Transfer(address from, address to, uint256 tokenId);
}