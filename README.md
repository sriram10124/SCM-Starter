# FRUIT STORE MANAGEMENT

# Overview: 
- Created a store management project where you can add, remove and display items from frontend with solidity contract as backend. Metamask is connected and used for gas fees,etc. 

# Description
- State Variables:

balance: A public string variable representing the current balance. It's initially set through the constructor and can be accessed publicly.
items: A mapping that associates each item ID (uint) with its corresponding name (string). This mapping allows for efficient lookup of item names based on their IDs.
itemIds: A public array containing the IDs of all items currently stored in the contract. This array facilitates iterating through all items and is used in conjunction with the items mapping.
- Constructor:

The constructor initializes the balance variable with the provided initBalance parameter.
- Getter Function:

getString(): A public view function that returns the current balance stored in the contract.
Core Functions:

addItem(string memory _name, uint256 id): Public function for adding an item with the provided name and ID. It updates both the items mapping and the itemIds array. The balance is also updated to reflect the addition.
removeItem(uint id): Public function for removing an item based on its ID. It checks if the item exists, updates the balance, removes the item from the items mapping, and adjusts the itemIds array accordingly.
getItemNames(): Public view function that returns an array of strings containing the names of all items currently stored in the contract. It iterates through the itemIds array to fetch the names from the items mapping.

- Modifiers and Error Handling:

The removeItem function includes a require statement to ensure that the item being removed actually exists in the contract.


# Execution:

After cloning the github, you will want to do the following to get the code running on your computer.

1. Inside the project directory, in the terminal type: npm i
2. Open two additional terminals in your VS code
3. In the second terminal type: npx hardhat node
4. In the third terminal, type: npx hardhat run --network localhost scripts/deploy.js
5. Back in the first terminal, type npm run dev to launch the front-end.

After this, the project will be running on your localhost. 
Typically at http://localhost:3000/

# Metamask Connection
Connect the metamask using the hardhat network.
- rpc url : gitpod port address
- chain id: 31337

  Now import using any private key. Now you will have enough ETH to transact your gas fees.

# Author:
U SRIRAM

usriram186@gmail.com

# License:
This project is licensed under the [UNLICENSED] License - see the LICENSE.md file for details
