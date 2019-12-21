pragma solidity ^0.5.0;

contract PixTAccessControl {
    // The addresses of the accounts (or contracts) that can execute actions within each roles.
    address public role1; // role has to be defined
    address public role2; // role has to be defined
    address public role3; // role has to be defined
    address public contractOwner;
    
    // @dev Access modifier for Owner-only functionality
    modifier onlyOwner() {
        require(msg.sender == contractOwner);
        _;
    }
    
    // @dev Assigns a new address to act as the Owner. Only available to the current Owner.
    // @param _newOwner The address of the new Owner
    function setOwner(address _newOwner) external onlyOwner {
        require(_newOwner != address(0));

        contractOwner = _newOwner;
    }
    
    // @dev Access modifier for restricted functionality
    modifier onlyRLevel() {
        require(
            msg.sender == role1 ||
            msg.sender == role2 ||
            msg.sender == role3 ||
            msg.sender == contractOwner
        );
        _;
    }
    
    // @dev Set adresses of each role
    function setRolesAddress(address _role1, address _role2, address _role3) public onlyOwner {
        role1 = _role1;
        role2 = _role2;
        role3 = _role3;
    }
}