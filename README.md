# Starter Next/Hardhat Project
Overview: 
- Created a store management project where you can add, remove and display items from frontend with solidity contract as backend. Also used metamask wallet

Description
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

CODE:
- Contract file: ASSEMENT.sol
  
  // SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

contract Assessment {
    string public balance;
    mapping(uint => string) public items;
    uint[] public itemIds; 

    constructor(string memory initBalance) payable {
        balance = initBalance;
    }

    function getString() public view returns (string memory) {
        return balance;
    }

    function addItem(string memory _name, uint256 id) public payable {
        items[id] = _name;
        itemIds.push(id);
        balance = string(abi.encodePacked("Added item ", _name));
    }

    function removeItem(uint id) public {
        require(bytes(items[id]).length > 0, "Item does not exist");
        balance = string(abi.encodePacked("Removed item ", items[id]));

        delete items[id];

        for (uint i = 0; i < itemIds.length; i++) {
            if (itemIds[i] == id) {
                for (uint j = i; j < itemIds.length - 1; j++) {
                    itemIds[j] = itemIds[j + 1];
                }
                itemIds.pop();
                break;
            }
        }
    }

    function getItemNames() public view returns (string[] memory) {
        string[] memory result = new string[](itemIds.length);
        for (uint i = 0; i < itemIds.length; i++) {
            result[i] = items[itemIds[i]];
        }
        return result;
    }
}

- Index.js:

  import {useState, useEffect} from "react";
import {ethers} from "ethers";
import atm_abi from "../artifacts/contracts/Assessment.sol/Assessment.json";

export default function HomePage() {
  const [ethWallet, setEthWallet] = useState(undefined);
  const [account, setAccount] = useState(undefined);
  const [atm, setATM] = useState(undefined);
  const [balance, setBalance] = useState(undefined);

  const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
  const atmABI = atm_abi.abi;

  const getWallet = async() => {
    if (window.ethereum) {
      setEthWallet(window.ethereum);
    }

    if (ethWallet) {
      const account = await ethWallet.request({method: "eth_accounts"});
      handleAccount(account);
    }
  }

  const handleAccount = (account) => {
    if (account) {
      console.log ("Account connected: ", account);
      setAccount(account);
    }
    else {
      console.log("No account found");
    }
  }

  const connectAccount = async() => {
    if (!ethWallet) {
      alert('MetaMask wallet is required to connect');
      return;
    }
  
    const accounts = await ethWallet.request({ method: 'eth_requestAccounts' });
    handleAccount(accounts);
    
    // once wallet is set we can get a reference to our deployed contract
    getATMContract();
  };

  const getATMContract = () => {
    const provider = new ethers.providers.Web3Provider(ethWallet);
    const signer = provider.getSigner();
    const atmContract = new ethers.Contract(contractAddress, atmABI, signer);
 
    setATM(atmContract);
  }

  const getString = async() => {
    if (atm) {
      setBalance((await atm.getString()).toString());
    }
  }

  const addItem = async() => {
    const _item=prompt("Enter the item name");
    const _id=prompt("Enter the item ID");
    if (atm) {
      let tx = await atm.addItem(_item,_id);
      await tx.wait()
      getString();
    }
  }

  const removeItem = async() => {
    const _id=prompt("Enter the item ID you want to remove");
    if (atm) {
      let tx = await atm.removeItem(_id);
      await tx.wait()
      getString();
    }
  }
  const returnItem = async() => {
    
    if (atm) {
      setBalance((await atm.getItemNames()).toString());
    }
  }


  const initUser = () => {
    // Check to see if user has Metamask
    if (!ethWallet) {
      return <p>Please install Metamask in order to use.</p>
    }

    // Check to see if user is connected. If not, connect to their account
    if (!account) {
      return <button onClick={connectAccount}>Please connect your Metamask wallet</button>
    }

    if (balance == undefined) {
      getString();
    }

    return (
      <div>
        <p>Your Account: {account}</p>
        <p>Answer: {balance}</p>
        <button onClick={addItem}>Add Item</button>
        <button onClick={removeItem}>Remove Item</button>
        <button onClick={returnItem}>Display Items</button>
      </div>
    )
  }

  useEffect(() => {getWallet();}, []);

  return (
    <main className="container">
      <header><h1>Fruit Store Management</h1></header>
      {initUser()}
      <style jsx>{`
        .container {
          text-align: center;
          background-color:lightgray;
          
          padding:2px;
        }
      `}
      </style>
    </main>
  )
}

- Deploy.js:

  // We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const hre = require("hardhat");

async function main() {
  const initBalance = '';
  const Assessment = await hre.ethers.getContractFactory("Assessment");
  const assessment = await Assessment.deploy(initBalance);
  await assessment.deployed();

  console.log(`A contract with balance of ${initBalance} eth deployed to ${assessment.address}`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

- Execution:

After cloning the github, you will want to do the following to get the code running on your computer.

1. Inside the project directory, in the terminal type: npm i
2. Open two additional terminals in your VS code
3. In the second terminal type: npx hardhat node
4. In the third terminal, type: npx hardhat run --network localhost scripts/deploy.js
5. Back in the first terminal, type npm run dev to launch the front-end.

After this, the project will be running on your localhost. 
Typically at http://localhost:3000/


U SRIRAM
usriram186@gmail.com
