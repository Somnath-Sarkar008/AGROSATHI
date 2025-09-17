// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

/**
 * @title AgriTracker
 * @dev A smart contract for tracking agricultural produce items with ownership transfer and status updates
 * @author AGROSATHI Team
 */
contract AgriTracker {
    
    // Struct to represent a produce item
    struct ProduceItem {
        uint256 id;
        string name;
        string location;
        uint256 price;
        uint256 quantity;
        string unit;
        string status;
        address owner;
        string imageUrl;
        string priceHash;
        uint256 timestamp;
        bool isActive;
    }
    
    // State variables
    uint256 private itemCounter;
    address private owner;
    mapping(uint256 => ProduceItem) private items;
    mapping(uint256 => string[]) private itemHistory;
    mapping(address => uint256) private gasFeeRebates;
    uint256[] private allItemIds;
    
    // Events
    event ItemUploaded(uint256 indexed itemId, address indexed owner);
    event ItemHistoryUpdated(uint256 indexed itemId, string status);
    event OwnershipTransferred(uint256 indexed itemId, address indexed from, address indexed to);
    event ItemBought(uint256 indexed itemId, address indexed buyer, uint256 price);
    event GasFeeRebated(address indexed user, uint256 amount);
    
    // Modifiers
    modifier onlyOwner() {
        require(msg.sender == owner, "Only contract owner can call this function");
        _;
    }
    
    modifier itemExists(uint256 _itemId) {
        require(_itemId > 0 && _itemId <= itemCounter, "Item does not exist");
        require(items[_itemId].isActive, "Item is not active");
        _;
    }
    
    modifier onlyItemOwner(uint256 _itemId) {
        require(items[_itemId].owner == msg.sender, "Only item owner can perform this action");
        _;
    }
    
    modifier validPrice(uint256 _price) {
        require(_price > 0, "Price must be greater than zero");
        _;
    }
    
    modifier validQuantity(uint256 _quantity) {
        require(_quantity > 0, "Quantity must be greater than zero");
        _;
    }
    
    // Constructor
    constructor() {
        owner = msg.sender;
        itemCounter = 0;
    }
    
    /**
     * @dev Add a new produce item to the system
     * @param _name Name of the produce item
     * @param _location Location where the item is produced
     * @param _price Price of the item in wei
     * @param _quantity Quantity available
     * @param _unit Unit of measurement
     * @param _imageUrl URL of the item image
     * @param _priceHash Hash of the price for verification
     * @return The ID of the newly created item
     */
    function addProduceItem(
        string memory _name,
        string memory _location,
        uint256 _price,
        uint256 _quantity,
        string memory _unit,
        string memory _imageUrl,
        string memory _priceHash
    ) 
        external 
        validPrice(_price) 
        validQuantity(_quantity) 
        returns (uint256) 
    {
        require(bytes(_name).length > 0, "Name cannot be empty");
        require(bytes(_location).length > 0, "Location cannot be empty");
        require(bytes(_unit).length > 0, "Unit cannot be empty");
        
        itemCounter++;
        
        items[itemCounter] = ProduceItem({
            id: itemCounter,
            name: _name,
            location: _location,
            price: _price,
            quantity: _quantity,
            unit: _unit,
            status: "Available",
            owner: msg.sender,
            imageUrl: _imageUrl,
            priceHash: _priceHash,
            timestamp: block.timestamp,
            isActive: true
        });
        
        allItemIds.push(itemCounter);
        itemHistory[itemCounter].push("Item created and uploaded");
        
        emit ItemUploaded(itemCounter, msg.sender);
        
        return itemCounter;
    }
    
    /**
     * @dev Update the status of an item
     * @param _itemId ID of the item to update
     * @param _status New status of the item
     * @param _location New location (optional)
     */
    function updateItemStatus(
        uint256 _itemId,
        string memory _status,
        string memory _location
    ) 
        external 
        itemExists(_itemId) 
        onlyItemOwner(_itemId) 
    {
        require(bytes(_status).length > 0, "Status cannot be empty");
        
        items[_itemId].status = _status;
        
        if (bytes(_location).length > 0) {
            items[_itemId].location = _location;
        }
        
        itemHistory[_itemId].push(_status);
        
        emit ItemHistoryUpdated(_itemId, _status);
    }
    
    /**
     * @dev Transfer ownership of an item to another address
     * @param _itemId ID of the item to transfer
     * @param _newOwner Address of the new owner
     */
    function transferOwnership(
        uint256 _itemId,
        address _newOwner
    ) 
        external 
        itemExists(_itemId) 
        onlyItemOwner(_itemId) 
    {
        require(_newOwner != address(0), "New owner cannot be zero address");
        require(_newOwner != items[_itemId].owner, "New owner must be different from current owner");
        
        address previousOwner = items[_itemId].owner;
        items[_itemId].owner = _newOwner;
        
        itemHistory[_itemId].push(string(abi.encodePacked("Ownership transferred to ", _addressToString(_newOwner))));
        
        emit OwnershipTransferred(_itemId, previousOwner, _newOwner);
    }
    
    /**
     * @dev Buy an item by sending the required payment
     * @param _itemId ID of the item to buy
     */
    function buyItem(uint256 _itemId) 
        external 
        payable 
        itemExists(_itemId) 
    {
        ProduceItem storage item = items[_itemId];
        
        require(msg.sender != item.owner, "Cannot buy your own item");
        require(msg.value >= item.price, "Insufficient payment");
        require(keccak256(bytes(item.status)) == keccak256(bytes("Available")), "Item is not available for purchase");
        
        // Transfer ownership
        address previousOwner = item.owner;
        item.owner = msg.sender;
        item.status = "Sold";
        
        // Add to history
        itemHistory[_itemId].push(string(abi.encodePacked("Item sold to ", _addressToString(msg.sender))));
        
        // Transfer payment to previous owner
        if (previousOwner != address(0)) {
            payable(previousOwner).transfer(item.price);
        }
        
        // Refund excess payment
        if (msg.value > item.price) {
            payable(msg.sender).transfer(msg.value - item.price);
        }
        
        emit ItemBought(_itemId, msg.sender, item.price);
        emit OwnershipTransferred(_itemId, previousOwner, msg.sender);
    }
    
    /**
     * @dev Rebate gas fees to users (only owner can call)
     */
    function rebateGasFees() external onlyOwner {
        require(address(this).balance > 0, "No funds available for rebate");
        
        uint256 totalRebate = address(this).balance;
        uint256 userCount = 0;
        
        // Count active users (simplified - in production, you might want a more sophisticated distribution)
        for (uint256 i = 0; i < allItemIds.length; i++) {
            if (items[allItemIds[i]].isActive) {
                userCount++;
            }
        }
        
        if (userCount > 0) {
            uint256 rebatePerUser = totalRebate / userCount;
            
            for (uint256 i = 0; i < allItemIds.length; i++) {
                if (items[allItemIds[i]].isActive) {
                    address user = items[allItemIds[i]].owner;
                    gasFeeRebates[user] += rebatePerUser;
                    payable(user).transfer(rebatePerUser);
                    emit GasFeeRebated(user, rebatePerUser);
                }
            }
        }
    }
    
    /**
     * @dev Get details of a specific item
     * @param _itemId ID of the item
     * @return The complete item details
     */
    function getItemDetails(uint256 _itemId) 
        external 
        view 
        itemExists(_itemId) 
        returns (ProduceItem memory) 
    {
        return items[_itemId];
    }
    
    /**
     * @dev Get all item IDs in the system
     * @return Array of all item IDs
     */
    function getAllItems() external view returns (uint256[] memory) {
        return allItemIds;
    }
    
    /**
     * @dev Get the history of an item
     * @param _itemId ID of the item
     * @return Array of status history
     */
    function getItemHistory(uint256 _itemId) 
        external 
        view 
        itemExists(_itemId) 
        returns (string[] memory) 
    {
        return itemHistory[_itemId];
    }
    
    /**
     * @dev Get gas fee rebate amount for a user
     * @param _user Address of the user
     * @return Total rebate amount received
     */
    function getGasFeeRebate(address _user) external view returns (uint256) {
        return gasFeeRebates[_user];
    }
    
    /**
     * @dev Get total number of items
     * @return Total item count
     */
    function getTotalItems() external view returns (uint256) {
        return itemCounter;
    }
    
    /**
     * @dev Get contract owner
     * @return Address of the contract owner
     */
    function getOwner() external view returns (address) {
        return owner;
    }
    
    /**
     * @dev Deactivate an item (only item owner)
     * @param _itemId ID of the item to deactivate
     */
    function deactivateItem(uint256 _itemId) 
        external 
        itemExists(_itemId) 
        onlyItemOwner(_itemId) 
    {
        items[_itemId].isActive = false;
        items[_itemId].status = "Deactivated";
        itemHistory[_itemId].push("Item deactivated");
        
        emit ItemHistoryUpdated(_itemId, "Deactivated");
    }
    
    /**
     * @dev Reactivate an item (only item owner)
     * @param _itemId ID of the item to reactivate
     */
    function reactivateItem(uint256 _itemId) 
        external 
        itemExists(_itemId) 
        onlyItemOwner(_itemId) 
    {
        items[_itemId].isActive = true;
        items[_itemId].status = "Available";
        itemHistory[_itemId].push("Item reactivated");
        
        emit ItemHistoryUpdated(_itemId, "Available");
    }
    
    /**
     * @dev Update item price (only item owner)
     * @param _itemId ID of the item
     * @param _newPrice New price for the item
     */
    function updateItemPrice(uint256 _itemId, uint256 _newPrice) 
        external 
        itemExists(_itemId) 
        onlyItemOwner(_itemId) 
        validPrice(_newPrice) 
    {
        items[_itemId].price = _newPrice;
        itemHistory[_itemId].push(string(abi.encodePacked("Price updated to ", _uintToString(_newPrice), " wei")));
        
        emit ItemHistoryUpdated(_itemId, string(abi.encodePacked("Price updated to ", _uintToString(_newPrice))));
    }
    
    /**
     * @dev Update item quantity (only item owner)
     * @param _itemId ID of the item
     * @param _newQuantity New quantity for the item
     */
    function updateItemQuantity(uint256 _itemId, uint256 _newQuantity) 
        external 
        itemExists(_itemId) 
        onlyItemOwner(_itemId) 
        validQuantity(_newQuantity) 
    {
        items[_itemId].quantity = _newQuantity;
        itemHistory[_itemId].push(string(abi.encodePacked("Quantity updated to ", _uintToString(_newQuantity))));
        
        emit ItemHistoryUpdated(_itemId, string(abi.encodePacked("Quantity updated to ", _uintToString(_newQuantity))));
    }
    
    /**
     * @dev Withdraw contract balance (only owner)
     */
    function withdrawBalance() external onlyOwner {
        uint256 balance = address(this).balance;
        require(balance > 0, "No balance to withdraw");
        
        payable(owner).transfer(balance);
    }
    
    /**
     * @dev Emergency function to pause contract (only owner)
     */
    function emergencyPause() external view onlyOwner {
        // This is a placeholder for emergency pause functionality
        // In a production contract, you would implement a pause mechanism
        require(false, "Emergency pause activated");
    }
    
    // Helper functions
    function _addressToString(address _addr) private pure returns (string memory) {
        bytes32 value = bytes32(uint256(uint160(_addr)));
        bytes memory alphabet = "0123456789abcdef";
        bytes memory str = new bytes(42);
        str[0] = '0';
        str[1] = 'x';
        for (uint256 i = 0; i < 20; i++) {
            str[2 + i * 2] = alphabet[uint8(value[i + 12] >> 4)];
            str[3 + i * 2] = alphabet[uint8(value[i + 12] & 0x0f)];
        }
        return string(str);
    }
    
    function _uintToString(uint256 _value) private pure returns (string memory) {
        if (_value == 0) {
            return "0";
        }
        uint256 temp = _value;
        uint256 digits;
        while (temp != 0) {
            digits++;
            temp /= 10;
        }
        bytes memory buffer = new bytes(digits);
        while (_value != 0) {
            digits -= 1;
            buffer[digits] = bytes1(uint8(48 + uint256(_value % 10)));
            _value /= 10;
        }
        return string(buffer);
    }
    
    // Fallback function to receive Ether
    receive() external payable {}
    
    // Fallback function for any other calls
    fallback() external payable {}
}
