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
