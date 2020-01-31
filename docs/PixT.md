# PixT


## constructor - read
_No parameters_
function Object() { [native code] }

## Transfer - read
|name |type |description
|-----|-----|-----------
|from|address|
|to|address|
|tokenId|uint256|
Event emitted when a token is transfered

## balanceOf - view
|name |type |description
|-----|-----|-----------
|owner|address|address to query the balance of
Gets the balance of the specified address.
Return : uint256 representing the amount owned by the passed address

## balanceOfSC - view
_No parameters_
Gets the balance of the Smart contract. Only available to the current owner return uint256 representing the amount of ETH owned by the contract

## buyPics - read
|name |type |description
|-----|-----|-----------
|_tokenID|uint256|uint256 ID of the token
|amount|uint256|uint256 amount paid to buy the picture
|shipping|uint8|uint8 shipping options value
|format|uint256|uint256 format of the picture the photo buyer wants
Buying a picture

## contractOwner - view
_No parameters_
Address of the current contract owner

## createNewPicture - read
|name |type |description
|-----|-----|-----------
|_datas|string|string all metadatas of the picture in a single string
|_permission|bool|bool authorize Pix.T to manage its photos commercialization as prints
Create a new picture with all its metadatas. Only available to the current owner

## getListToken - view
|name |type |description
|-----|-----|-----------
|_address|address|address Address we want to have the list of tokens
Get the list of tokens owned by an address 
Return : uint256[] List of owned tokens

## getPhotoOwnerInfos - view
|name |type |description
|-----|-----|-----------
|_addr|address|address Address from which we want to obtain informations
Get PhotoOwner's informations like the value of all revenues and number of sales
Return : uint256 sales Number of sales for this addressuint256 revenues All revenues made from saling pictures return uint8 accessLevel Define access / limitation / embargo / between Photo owner / agency’s system and Pix.T solution

## getPicInfos - view
|name |type |description
|-----|-----|-----------
|_tokenID|uint256|uint256 ID of the token
get all informations of a tokenID
Return : datas string representing all the metadatas of the Picturecopyright bool is the picture under a copyright infrigement ? yes = TRUE, else FALSEprintable bool TRUE = the news reader can clicks the picture for print sale and is redirected to the print eCommerce site and order

## getTokenID - view
_No parameters_
Get the current tokenID value
Return : uint256 Id of the current tokenID

## ownerOf - view
|name |type |description
|-----|-----|-----------
|tokenId|uint256|uint256 ID of the token to query the owner of
Gets the owner of the specified token ID.
Return : address currently marked as the owner of the given token ID

## role1 - view
_No parameters_
Role has to be defined

## role2 - view
_No parameters_
Role has to be defined

## role3 - view
_No parameters_
Role has to be defined

## setAccessLevel - read
|name |type |description
|-----|-----|-----------
|_tokenID|uint256|uint256 ID of the token
|_level|uint8|uint8 Access level of the photo's owner
Set the access level of a photo owner

## setOwner - read
|name |type |description
|-----|-----|-----------
|_newOwner|address|
Assigns a new address to act as the Owner. Only available to the current Owner

## setPermission - read
|name |type |description
|-----|-----|-----------
|_tokenID|uint256|uint256 ID of the token
|value|bool|bool True if PixT is allowed to manage the picture as print, else False
Set if PixT is allowed to manage its photos commercialization as prints

## setPrintable - read
|name |type |description
|-----|-----|-----------
|_tokenID|uint256|uint256 ID of the token
|value|bool|bool True if the picture is printable, else False
Set if the picture is printable or not

## setRolesAddress - read
|name |type |description
|-----|-----|-----------
|_role1|address|
|_role2|address|
|_role3|address|
Set adresses of each role

## transferFrom - read
|name |type |description
|-----|-----|-----------
|from|address|current owner of the token
|to|address|address to receive the ownership of the given token ID
|tokenId|uint256|uint256 ID of the token to be transferred
Transfers the ownership of a given token ID to another address. Usage of this method is discouraged, use {safeTransferFrom} whenever possible. Requires the msg.sender to be the owner.