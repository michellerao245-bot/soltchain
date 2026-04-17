import React, { useState } from "react";
import { useWeb3ModalAccount, useWeb3ModalProvider } from '@web3modal/ethers/react'
import { ethers } from 'ethers'

const Presale = () => {
  const [amount, setAmount] = useState("");
  const [status, setStatus] = useState("");
  const { isConnected } = useWeb3ModalAccount() 
  const { walletProvider } = useWeb3ModalProvider()

  const contractAddress = "0x186eb36aD051f6EB72cb43bd2b0ce621F93a374d";

  const handleBuy = async () => {
    if (!isConnected) {
      setStatus("❌ Please connect wallet from the top right button!");
      return;
    }
    if (!amount || isNaN(amount)) {
      setStatus("❌ Please enter a valid BNB amount!");
      return;
    }

    try {
      setStatus("Processing...");
      const ethersProvider = new ethers.BrowserProvider(walletProvider)
      const signer = await ethersProvider.getSigner()
      const abi = ["function buyTokens() payable"];
      const contract = new ethers.Contract(contractAddress, abi, signer);

      const tx = await contract.buyTokens({
        value: ethers.parseEther(amount.toString())
      });

      setStatus("Transaction Sent! Waiting...");
      await tx.wait();
      setStatus("✅ Success! Tokens Bought.");
      setAmount("");
    } catch (err) {
      console.error(err);
      // Agar balance $1.50 se kam hua toh yahan error show hoga
      setStatus("❌ Error: Check balance or gas fees.");
    }
  };

  return (
    <div style={{ 
      padding: "100px 20px", 
      textAlign: "center", 
      color: "white", 
      backgroundColor: "transparent" // Background app handle karega
    }}>
      
      {/* 1. SECTION HEADERS */}
      <h2 style={{ color: "#f59e0b", fontSize: "28px", fontWeight: "bold", marginBottom: "10px" }}>
        SOLT PUBLIC SALE
      </h2>
      <p style={{ color: "#cbd5e1", fontSize: "16px", marginBottom: "40px" }}>
        Enter BNB amount to buy SOLT
      </p>
      
      {/* 2. INPUT & BUY BUTTON ONLY */}
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
        <input
          type="number"
          step="any"
          placeholder="0.00"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          style={{
            padding: "14px",
            borderRadius: "8px",
            backgroundColor: "#1a2234",
            color: "white",
            border: "1px solid #f59e0b",
            width: "220px",
            fontSize: "18px",
            outline: "none"
          }}
        />

        <button 
          onClick={handleBuy} 
          style={{ 
            padding: "14px 30px", 
            background: "#f59e0b", 
            borderRadius: "8px", 
            fontWeight: "bold", 
            border: "none", 
            cursor: "pointer",
            color: "#000",
            fontSize: "16px"
          }}
        >
          BUY NOW
        </button>
      </div>

      {/* 3. CLEAN STATUS MESSAGE */}
      {status && (
        <p style={{ 
          marginTop: "25px", 
          color: status.includes("❌") ? "#ff4444" : "#f59e0b",
          fontSize: "14px",
          fontWeight: "500"
        }}>
          {status}
        </p>
      )}
    </div>
  );
};

export default Presale;