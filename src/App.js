import React, { useState } from "react";
import { ethers } from "ethers";
import contractABI from "./abi.json";
import "./App.css";

function App() {
  const [message, setMessage] = useState(null);
  const [newMessage, setNewMessage] = useState("");
  const [owner, setOwner] = useState("");
  const [newOwner, setNewOwner] = useState("");

  //address
  const contractAddress = "0x5A9490068bDe668b4c6523d0fE2ae5805826Ae92";

  // async function for accessing metamask in our browser
  async function requestAccount() {
    await window.ethereum.request({ method: "eth_requestAccounts" });
  }

  //getMessage function using ethers
  async function getMessage() {
    if (typeof window.ethereum !== "undefined") {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(
        contractAddress,
        contractABI,
        signer
      );

      try {
        const getMsg = await contract.getMessage();
        setMessage(getMsg);
      } catch (err) {
        console.error("Error:", err);
      }
    } else {
      await requestAccount();
    }
  }

  // async function to get the owner
  async function getOwner() {
    if (typeof window.ethereum !== "undefined") {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(
        contractAddress,
        contractABI,
        signer
      );

      try {
        setOwner(await contract.owner());
      } catch (error) {
        console.error(error);
      }
    }
  }

  // async function to transfer ownership
  async function transferOwnership(newOwner) {
    if (typeof window.ethereum !== "undefined") {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(
        contractAddress,
        contractABI,
        signer
      );

      try {
        await contract.transferOwnership(newOwner);
        const owner = contract.owner();
        setNewOwner(owner);
      } catch (error) {
        console.error(error);
      }
    }
  }

  const handleSubmit = async () => {
    await updateMessage(newMessage);

    await getMessage();

    setNewMessage("");
  };

  const handleTransferOwnership = async () => {
    await transferOwnership(newOwner);
    setNewOwner("");
  };

  //set message function using ethers
  async function updateMessage(data) {
    if (typeof window.ethereum !== "undefined") {
      // await requestAccount();
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(
        contractAddress,
        contractABI,
        signer
      );

      try {
        await contract.setMessage(data);
        const getMsg = await contract.getMessage();
        setMessage(getMsg);
        await getMessage();
      } catch (err) {
        console.error("Error:", err);
      }
    } else {
      await requestAccount();
    }
  }

  //useEffect(() => {
  // getMessage();
  //}, []);
  return (
    <div className="App">
      <button onClick={requestAccount}>Connect Wallet</button>
      <h1>Message Retrieval DApp</h1>

      <form>
        <h2>
          <span>Message:</span> {message}
        </h2>
        <h2>
          <span>Owner:</span> {owner}
        </h2>

        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Enter new message"
        />

        <input
          type="text"
          value={newOwner}
          onChange={(e) => setNewOwner(e.target.value)}
          placeholder="Transfer Ownership"
        />

        <div className="btns">
          <button type="button" onClick={getMessage}>
            Get New Message
          </button>
          <button type="button" onClick={handleSubmit}>
            Set Message
          </button>
          <button type="button" onClick={getOwner}>
            See Owner Address
          </button>
          <button type="button" onClick={handleTransferOwnership}>
            Change Ownership
          </button>
        </div>
      </form>
    </div>
  );
}

export default App;
