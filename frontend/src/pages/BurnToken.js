import React, { useState } from 'react';
import { ethers } from 'ethers';
import './CreateToken.css';
import FACTORY_ABI from '../contractABI.json';

const BurnableToken = () => {
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

      // 1. Wallet Connection & Network Check (BSC Mainnet)
      await window.ethereum.request({ method: 'eth_requestAccounts' });
      const provider = new ethers.BrowserProvider(window.ethereum);
      
      const network = await provider.getNetwork();
      if (network.chainId !== 56n) {
        try {
          await window.ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: '0x38' }], // 56 in Hex
          });
        } catch (switchError) {
          alert("Please MetaMask mein Binance Smart Chain select karein.");
          setLoading(false);
          return;
        }
      }

      const signer = await provider.getSigner();

      // --- PART 1: APPROVAL (6000 SOLT Fees) ---
      const soltContract = new ethers.Contract(
        SOLT_TOKEN_ADDRESS,
        ["function approve(address spender, uint256 amount) public returns (bool)"],
        signer
      );

      console.log("Approving SOLT for Burnable Token...");
      const feeInSolt = ethers.parseUnits("6000", 18);
      
      const approveTx = await soltContract.approve(FACTORY_ADDRESS, feeInSolt);
      await approveTx.wait();
      alert("Step 1 Clear: SOLT Approved!");

      // --- PART 2: BURNABLE TOKEN DEPLOYMENT ---
      const factoryContract = new ethers.Contract(FACTORY_ADDRESS, FACTORY_ABI, signer);
      const supplyWei = ethers.parseUnits(formData.supply.toString(), parseInt(formData.decimals));

      console.log("Deploying Burnable Token...");
      const deployTx = await factoryContract.createBurnableToken(
        formData.name,
        formData.symbol,
        supplyWei,
        parseInt(formData.decimals)
      );

      await deployTx.wait();
      alert(`🎉 Mubarak Ho! ${formData.name} (Burnable) successfully deploy ho gaya!`);
      
      setFormData({ name: '', symbol: '', supply: '', decimals: '18' });

    } catch (err) {
      console.error("Full Error:", err);
      if (err.code === 4001) {
        alert("Transaction cancel kar di gayi.");
      } else {
        alert("Daya, error ye hai: " + (err.reason || err.message));
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mint-container fade-in">
      <h1 className="mint-title">Deploy <span className="blue-text">Burnable Token</span></h1>
      <div className="mint-section">
        <form className="form-grid" onSubmit={handleDeploy}>
          <div className="input-group">
            <label>Token Name</label>
            <input
              type="text"
              placeholder="Ex: Solt Burn"
              required
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
            />
          </div>
          <div className="input-group">
            <label>Symbol</label>
            <input
              type="text"
              placeholder="BURN"
              required
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
              required
              value={formData.supply}
              onChange={(e) => setFormData({...formData, supply: e.target.value})}
            />
          </div>

          <button
            className="mint-submit-btn"
            type="submit"
            disabled={loading}
            style={{ gridColumn: "1 / -1", marginTop: "20px" }}
          >
            {loading ? "Processing..." : "Deploy Burnable Token"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default BurnableToken;