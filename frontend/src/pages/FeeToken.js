import React, { useState } from 'react';
import { ethers } from 'ethers';
import './CreateToken.css';
import FACTORY_ABI from '../contractABI.json';

const FeeToken = () => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    symbol: '',
    supply: '',
    buyFee: '3', // Default 3% tax
    decimals: '18'
  });

  // --- CONFIGURATION ---
  const FACTORY_ADDRESS = "0xc8fBBfa8172D3FF165889259C3a02eC5a5Cc3a18";
  const SOLT_TOKEN_ADDRESS = "0x6C8942407c65D0f038b04DD5DA3420eC826Cc8d9";

  const deployFeeToken = async (e) => {
    if (e) e.preventDefault();
    
    if (!formData.name || !formData.symbol || !formData.supply) {
      return alert("Bhai, details bharna zaroori hai!");
    }

    try {
      if (!window.ethereum) return alert("MetaMask Connect Karein!");
      setLoading(true);

      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const userAddress = await signer.getAddress();

      /* --- STEP 1: APPROVAL (DISABLED) --- 
         Kyunki humne BscScan se manually kar diya hai
      */

      // --- STEP 2: FACTORY INSTANCE ---
      const factoryContract = new ethers.Contract(FACTORY_ADDRESS, FACTORY_ABI, signer);

      // --- STEP 3: DATA FORMATTING ---
      const supplyWei = ethers.parseUnits(formData.supply, 18);
      const taxFeeFormatted = parseInt(formData.buyFee || 0) * 100;

      console.log("Deploying Fee Token...");
      
      // --- STEP 4: DEPLOYMENT ---
      const tx = await factoryContract.createFeeToken(
        formData.name,
        formData.symbol,
        supplyWei,
        18,               
        taxFeeFormatted,  
        userAddress,      
        userAddress       
      );

      console.log("Processing Transaction:", tx.hash);
      await tx.wait();
      
      alert("🎉 Mubarak Ho! Fee Token successfully deployed!");

    } catch (err) {
      console.error(err);
      alert("Error: " + (err.reason || "Transaction Failed! Please check your BNB gas balance."));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mint-container fade-in">
      <h1 className="mint-title">Deploy <span className="blue-text">Fee Token</span></h1>
      <div className="mint-section">
        <div className="section-header">
          <span className="step-badge">💰</span>
          <h3>Token Details (Fee: 6000 SOLT)</h3>
        </div>
        <div className="form-grid">
          <div className="input-group">
            <label>Token Name</label>
            <input type="text" placeholder="Ex: JCB Fee Coin" onChange={(e) => setFormData({...formData, name: e.target.value})} />
          </div>
          <div className="input-group">
            <label>Symbol</label>
            <input type="text" placeholder="JCB" onChange={(e) => setFormData({...formData, symbol: e.target.value})} />
          </div>
          <div className="input-group">
            <label>Transaction Fee %</label>
            <input type="number" value={formData.buyFee} onChange={(e) => setFormData({...formData, buyFee: e.target.value})} />
          </div>
          <div className="input-group">
            <label>Total Supply</label>
            <input type="number" placeholder="1000000" onChange={(e) => setFormData({...formData, supply: e.target.value})} />
          </div>
        </div>
        <button className="mint-submit-btn" onClick={deployFeeToken} disabled={loading} style={{marginTop: '20px'}}>
          {loading ? "Processing..." : "Deploy Fee Token Now"}
        </button>
      </div>
    </div>
  );
};

export default FeeToken;