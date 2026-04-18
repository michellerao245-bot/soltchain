import React, { useState } from 'react';
import { ethers } from 'ethers'; // Ethers v6 
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

      // 1. Wallet Connection & Network Sync
      await window.ethereum.request({ method: 'eth_requestAccounts' });
      const provider = new ethers.BrowserProvider(window.ethereum);
      
      // BSC Network Check (Optional but recommended)
      const network = await provider.getNetwork();
      if (network.chainId !== 56n) {
          try {
              await window.ethereum.request({
                  method: 'wallet_switchEthereumChain',
                  params: [{ chainId: '0x38' }],
              });
          } catch (err) {
              console.log("Network switch rejected");
          }
      }

      const signer = await provider.getSigner();

      // --- PART 1: APPROVAL ---
      console.log("Approving SOLT...");
      const approveTx = await soltContract.approve(FACTORY_ADDRESS, ethers.parseUnits("6000", 18));
      
      // Mobile ke liye wait mechanism ko thoda behtar karte hain
      const receipt = await approveTx.wait();
      console.log("Approval Receipt mil gayi:", receipt);

      // --- PART 2: DEPLOYMENT (Thoda gap dekar call karte hain) ---
      setTimeout(async () => {
        try {
          const factoryContract = new ethers.Contract(FACTORY_ADDRESS, FACTORY_ABI, signer);
          const supplyWei = ethers.parseUnits(formData.supply.toString(), parseInt(formData.decimals));

          console.log("Ab Deploy popup aana chahiye...");
          const deployTx = await factoryContract.createStandardToken(
            formData.name,
            formData.symbol,
            supplyWei,
            parseInt(formData.decimals)
          );

          await deployTx.wait();
          alert("🎉 Mubarak Ho! Token Successfull Deploy ho gaya!");
        } catch (innerErr) {
          console.error("Deploy Error:", innerErr);
          alert("Step 2 Fail: " + (innerErr.reason || innerErr.message));
        } finally {
          setLoading(false);
        }
      }, 1000); // 1 second ka delay taaki wallet ready ho jaye

  // Niche ka pura Return block wahi hai jo aapne manga tha
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
            console.log("Button click detect ho gaya!");
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