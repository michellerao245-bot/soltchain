import React, { useState } from 'react';
import { ethers } from 'ethers';
import './CreateToken.css';
import FACTORY_ABI from '../contractABI.json';

const BurnToken = () => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    symbol: '',
    supply: '',
    burnPercent: '2', // Default 2%
    decimals: '18'
  });

  // --- CONFIGURATION ---
  const FACTORY_ADDRESS = "0xc8fBBfa8172D3FF165889259C3a02eC5a5Cc3a18";
  const SOLT_TOKEN_ADDRESS = "0x6C8942407c65D0f038b04DD5DA3420eC826Cc8d9";

  const handleDeploy = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.symbol || !formData.supply || !formData.burnPercent) {
      return alert("Bhai, saari details bharna zaroori hai!");
    }

    try {
      if (!window.ethereum) return alert("MetaMask connect karein!");
      setLoading(true);

      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();

      /* --- STEP 1: APPROVAL (DISABLED) ---
      Bhai, humne BscScan se manually approve kar diya hai.
      /*
      const soltContract = new ethers.Contract(
        SOLT_TOKEN_ADDRESS,
        ["function approve(address spender, uint256 amount) public returns (bool)"],
        signer
      );
      const feeInSolt = ethers.parseUnits("6000", 18);
      const approveTx = await soltContract.approve(FACTORY_ADDRESS, feeInSolt);
      await approveTx.wait();
      */

      // --- STEP 2: DEPLOYMENT ---
      const factoryContract = new ethers.Contract(FACTORY_ADDRESS, FACTORY_ABI, signer);
      const supplyWei = ethers.parseUnits(formData.supply, formData.decimals);

      console.log("Deploying Burnable Token...");
      // Factory contract ka wahi function call karein jo burn token banata hai
      const tx = await factoryContract.createBurnableToken(
        formData.name,
        formData.symbol,
        supplyWei,
        parseInt(formData.burnPercent),
        parseInt(formData.decimals)
      );

      console.log("Transaction Hash:", tx.hash);
      await tx.wait();
      alert("🎉 Burnable Token Live Ho Gaya!");

    } catch (err) {
      console.error(err);
      alert("Error: " + (err.reason || "Insufficient BNB for gas fees or SOLT balance issue!"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mint-container fade-in">
      <h1 className="mint-title">Deploy <span className="blue-text">Burnable Token</span></h1>
      <div className="mint-section">
        <div className="section-header">
          <span className="step-badge">🔥</span>
          <h3>Token Details (Fee: 6000 SOLT)</h3>
        </div>
        <div className="form-grid">
          <div className="input-group">
            <label>Token Name</label>
            <input type="text" placeholder="Ex: JCB Burn" onChange={(e) => setFormData({...formData, name: e.target.value})} />
          </div>
          <div className="input-group">
            <label>Symbol</label>
            <input type="text" placeholder="JCB" onChange={(e) => setFormData({...formData, symbol: e.target.value})} />
          </div>
          <div className="input-group">
            <label>Burn % (Tax)</label>
            <input type="number" value={formData.burnPercent} onChange={(e) => setFormData({...formData, burnPercent: e.target.value})} />
          </div>
          <div className="input-group">
            <label>Total Supply</label>
            <input type="number" placeholder="1000000" onChange={(e) => setFormData({...formData, supply: e.target.value})} />
          </div>
        </div>
        <button className="mint-submit-btn" onClick={handleDeploy} disabled={loading} style={{marginTop: '20px'}}>
          {loading ? "Processing..." : "Deploy Burn Token Now"}
        </button>
      </div>
    </div>
  );
};

export default BurnToken;