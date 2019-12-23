pragma solidity ^0.5.0;

import "./ERC721.sol";
import "./PixTAccessControl.sol";

contract PixT is ERC721, PixTAccessControl {
    
    struct Picture {
        string metadatas;          // Picture's metadatas in a single string separated by commas
        bool copyrightInfrigement; // Is the picture under a copyright infrigement ? yes = TRUE, else FALSE
        bool isAllowedToPrint;     // TRUE = the news reader can clicks the picture for print sale and is redirected to the print eCommerce site and order
    }
    
    struct PhotoOwner {
        uint8 accesLevel;           // Define access / limitation / embargo / between Photo owner / agency’s system and Pix.T solution
        uint256 sales;              // Track sales
        uint256 revenues;           // Track revenues
    }
    
    struct PhotoBuyer {
        uint8 shippingOptions; // Shipping options
        uint256 format;        // Photo format
    }
    
    // mapping from token ID to authorize Pix.T (if TRUE) to manage its photos commercialization as prints, else FALSE
    mapping (uint256 => bool) _givePermission; 
    
    // Identifier for each picture
    uint256 private tokenID;
    
    // Mapping from token ID to owner
    mapping (uint256 => address) _tokenOwner;

    // Mapping from owner to number of owned token
    mapping (address => uint256) _ownedTokensCount;
    
    // Mapping from token ID to their corresponding Picture's datas
    mapping (uint256 => Picture) _pics;
    
    // Mapping from address to their corresponding photo owner
    mapping (address => PhotoOwner) _photosOwners;
    
    // Mapping from address to their corresponding photo buyer
    mapping (address => PhotoBuyer) _photoBuyers;
    
    // Mapping from address to the list of owned tokens
    mapping (address => uint256[]) _tokenToOwnerList;
    
    constructor () public {
        contractOwner = msg.sender; // the creator of the contract is the initial owner
    }
    
    /**
     * @dev Buying a picture
     * @param _tokenID uint256 ID of the token
     * @param amount uint256 amount paid to buy the picture
     * @param shipping uint8 shipping options value
     * @param format uint256 format of the picture the photo buyer wants
     */
    function buyPics(uint256 _tokenID, uint256 amount, uint8 shipping, uint256 format) public payable {
        require(msg.value >= amount, "The amount you paid is too low.");
        require(_exists(_tokenID), "This token doesn't exists.");
        require(_pics[_tokenID].copyrightInfrigement == false, "This token is under copyright infrigement.");
        require(_pics[_tokenID].isAllowedToPrint == true, "This token is not allowed to be printed.");
        
        _photoBuyers[msg.sender].shippingOptions = shipping;
        _photoBuyers[msg.sender].format = format;
        
        address owner = ownerOf(_tokenID);
        _photosOwners[owner].sales++;
        _photosOwners[owner].revenues += amount;
    }
    
    /**
     * @dev Create a new picture with all its metadatas. Only available to the current owner
     * @param _datas string all metadatas of the picture in a single string
     * @param _permission bool authorize Pix.T to manage its photos commercialization as prints
     */
    function createNewPicture(string memory _datas, bool _permission) onlyRLevel public {
        require(!_exists(tokenID), "This token already exists.");
        
        _pics[tokenID] = Picture(_datas, false, true);
        _mint(msg.sender, tokenID);
        _tokenToOwnerList[msg.sender].push(tokenID);
        _givePermission[tokenID] = _permission;
        
        tokenID++; // Increment tokenID for the next token
    }
    
    /**
     * @dev Set if the picture is printable or not
     * @param _tokenID uint256 ID of the token
     * @param value bool True if the picture is printable, else False
     */
    function setPrintable(uint256 _tokenID, bool value) public {
        require(ownerOf(_tokenID) == msg.sender, "Not token's owner.");
        require(_exists(_tokenID), "This token doesn't exists.");
        _pics[_tokenID].isAllowedToPrint = value;
    }
    
    /**
     * @dev Set if PixT is allowed to manage its photos commercialization as prints
     * @param _tokenID uint256 ID of the token
     * @param value bool True if PixT is allowed to manage the picture as print, else False
     */
    function setPermission(uint256 _tokenID, bool value) public {
        require(ownerOf(_tokenID) == msg.sender, "Not token's owner.");
        require(_exists(_tokenID), "This token doesn't exists.");
        _givePermission[_tokenID] = value;
    }
    
    /**
     * @dev Set the access level of a photo owner
     * @param _tokenID uint256 ID of the token
     * @param _level uint8 Access level of the photo's owner
     */
    function setAccessLevel(uint256 _tokenID, uint8 _level) public onlyRLevel {
        require(_exists(_tokenID), "This token doesn't exists.");
        require(_level >= 0 && _level <= 255, "Level value out of range.");
        
        address theOwner = ownerOf(_tokenID);
        _photosOwners[theOwner].accesLevel = _level;
    }
    
    /**
     * @dev Get the list of tokens owned by an address 
     * @param _address address Address we want to have the list of tokens
     * @return uint256[] List of owned tokens
     */
    function getListToken(address _address) public view returns (uint256[] memory) {
        require(_tokenToOwnerList[_address].length > 0, "No token owned.");
        require(_address != address(0), "Invalid address.");
        return _tokenToOwnerList[_address];
    }
    
    /**
     * @dev Get the current tokenID value
     * @return uint256 Id of the current tokenID
     */
    function getTokenID() public view returns (uint256) {
        return tokenID;
    }
    
    /**
     * @dev get all informations of a tokenID
     * @param _tokenID uint256 ID of the token
     * @return datas string representing all the metadatas of the Picture
     * @return copyright bool is the picture under a copyright infrigement ? yes = TRUE, else FALSE
     * @return printable bool TRUE = the news reader can clicks the picture for print sale and is redirected to the print eCommerce site and order
     */
    function getPicInfos(uint256 _tokenID) public view returns (string memory datas, bool copyright, bool printable ) {
        require(_exists(_tokenID), "This token doesn't exists.");
        
        return (_pics[_tokenID].metadatas, _pics[_tokenID].copyrightInfrigement, _pics[_tokenID].isAllowedToPrint);
    }
    
    /**
     * @dev Gets the balance of the Smart contract. Only available to the current owner
     * return uint256 representing the amount of ETH owned by the contract
     */
    function balanceOfSC() public view onlyOwner returns (uint256 balance) {
        return address(this).balance;
    }
    
    /**
     * @dev Gets the balance of the specified address.
     * @param owner address to query the balance of
     * @return uint256 representing the amount owned by the passed address
     */
    function balanceOf(address owner) public view returns (uint256) {
        require(owner != address(0), "ERC721: balance query for the zero address");

        return _ownedTokensCount[owner];
    }

    /**
     * @dev Gets the owner of the specified token ID.
     * @param tokenId uint256 ID of the token to query the owner of
     * @return address currently marked as the owner of the given token ID
     */
    function ownerOf(uint256 tokenId) public view returns (address) {
        address owner = _tokenOwner[tokenId];
        require(owner != address(0), "ERC721: owner query for nonexistent token");

        return owner;
    }

    /**
     * @dev Transfers the ownership of a given token ID to another address.
     * Usage of this method is discouraged, use {safeTransferFrom} whenever possible.
     * Requires the msg.sender to be the owner.
     * @param from current owner of the token
     * @param to address to receive the ownership of the given token ID
     * @param tokenId uint256 ID of the token to be transferred
     */
    function transferFrom(address from, address to, uint256 tokenId) public {
        //solhint-disable-next-line max-line-length
        require(ownerOf(tokenId) == msg.sender, "ERC721: transfer caller is not owner");

        _transferFrom(from, to, tokenId);
    }

    /**
     * @dev Returns whether the specified token exists.
     * @param tokenId uint256 ID of the token to query the existence of
     * @return bool whether the token exists
     */
    function _exists(uint256 tokenId) internal view returns (bool) {
        address owner = _tokenOwner[tokenId];
        return owner != address(0);
    }

    /**
     * @dev Internal function to mint a new token.
     * Reverts if the given token ID already exists.
     * @param to The address that will own the minted token
     * @param tokenId uint256 ID of the token to be minted
     */
    function _mint(address to, uint256 tokenId) internal {
        require(to != address(0), "ERC721: mint to the zero address");
        require(!_exists(tokenId), "ERC721: token already minted");

        _tokenOwner[tokenId] = to;
        _ownedTokensCount[to]++;

        emit Transfer(address(0), to, tokenId);
    }

    /**
     * @dev Internal function to transfer ownership of a given token ID to another address.
     * As opposed to {transferFrom}, this imposes no restrictions on msg.sender.
     * @param from current owner of the token
     * @param to address to receive the ownership of the given token ID
     * @param tokenId uint256 ID of the token to be transferred
     */
    function _transferFrom(address from, address to, uint256 tokenId) internal {
        require(ownerOf(tokenId) == from, "ERC721: transfer of token that is not own");
        require(to != address(0), "ERC721: transfer to the zero address");

        _ownedTokensCount[from]--;
        _ownedTokensCount[to]++;

        _tokenOwner[tokenId] = to;

        emit Transfer(from, to, tokenId);
    }
}