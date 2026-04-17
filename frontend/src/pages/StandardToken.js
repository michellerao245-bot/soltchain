import React, { useState } from 'react';
import { ethers } from 'ethers'; // Ethers v6 format
import './CreateToken.css';
import FACTORY_ABI from '../contractABI.json';

const StandardToken = () => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    symbol: '',
    supply: '',
    decimals: '18'
  });

  const FACTORY_ADDRESS = "0xc8fBBfa8172D3FF165889259C3a02eC5a5Cc3a18";
  const SOLT_TOKEN_ADDRESS = "0x6C8942407c65D0f038b04DD5DA3420eC826Cc8d9";

 const handleDeploy = async (e) => {
    e.preventDefault();
    try {
      if (!window.ethereum) return alert("MetaMask nahi mila!");
      setLoading(true);

      // MetaMask ko jagane ka sabse solid tareeka
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();

      // --- PART 1: APPROVAL (SOLT Fees) ---
      const soltContract = new ethers.Contract(
        SOLT_TOKEN_ADDRESS,
        ["function approve(address spender, uint256 amount) public returns (bool)"],
        signer
      );

      console.log("Approval shuru ho rahi hai...");
      const feeInSolt = ethers.parseUnits("6000", 18);
      
      // Yahan popup aana chahiye
      const approveTx = await soltContract.approve(FACTORY_ADDRESS, feeInSolt);
      await approveTx.wait();
      alert("Step 1 Clear: SOLT Approve ho gaya!");

      // --- PART 2: ACTUAL DEPLOYMENT ---
      // Check karo FACTORY_ABI aapne sahi import kiya hai na?
      const factoryContract = new ethers.Contract(FACTORY_ADDRESS, FACTORY_ABI, signer);
      
      const supplyWei = ethers.parseUnits(formData.supply.toString(), parseInt(formData.decimals));

      console.log("Token deploy popup aane wala hai...");
      const deployTx = await factoryContract.createStandardToken(
        formData.name,
        formData.symbol,
        supplyWei,
        parseInt(formData.decimals)
      );

      await deployTx.wait();
      alert("🎉 Mubarak Ho! Token Successfull Deploy ho gaya!");

    } catch (err) {
      console.error("Full Error:", err);
      // Agar "No active wallet" aa raha hai, toh code provider ko nahi dhund pa raha
      alert("Daya, error ye hai: " + (err.reason || err.message));
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="mint-container fade-in">
      <h1 className="mint-title">Deploy <span className="blue-text">Standard Token</span></h1>
      <div className="mint-section">
        <div className="form-grid">
          <div className="input-group">
            <label>Token Name</label>
            <input
              type="text"
              placeholder="Ex: JCB Coin"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
            />
          </div>
          <div className="input-group">
            <label>Symbol</label>
            <input
              type="text"
              placeholder="JCB"
              value={formData.symbol}
              onChange={(e) => setFormData({...formData, symbol: e.target.value})}
            />
          </div>
          <div className="input-group">
            <label>Decimals</label>
            <input
              type="number"
              value={formData.decimals}
              onChange={(e) => setFormData({...formData, decimals: e.target.value})}
            />
          </div>
          <div className="input-group">
            <label>Total Supply</label>
            <input
              type="number"
              placeholder="1000000"
              value={formData.supply}
              onChange={(e) => setFormData({...formData, supply: e.target.value})}
            />
          </div>
        </div>

       <button
           className="mint-submit-btn"
           type="button" 
           onClick={(e) => {
           console.log("Button click detect ho gaya!"); // Ye line console mein dikhni chahiye
           handleDeploy(e);
  }}
            disabled={loading}
>
            {loading ? "Processing..." : "Deploy Token Now"}
      </button>
        
      </div>
    </div>
  );
};

export default StandardToken;