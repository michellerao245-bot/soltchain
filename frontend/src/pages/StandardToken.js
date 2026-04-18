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
      const approveTx = await soltContract.approve(FACTORY_ADDRESS, ethers.parseUnits("6000", 18));
      
      // wait() ka intezar karne ke bajaye, alert de kar manually trigger karwao
      alert("Approval Sent! Ab 5-10 second rukiye, Deployment popup apne aap aayega...");

      // Thoda bada delay (3-5 seconds) taaki BSC network transaction register kar le
      setTimeout(async () => {
        try {
          const factoryContract = new ethers.Contract(FACTORY_ADDRESS, FACTORY_ABI, signer);
          const supplyWei = ethers.parseUnits(formData.supply.toString(), parseInt(formData.decimals));

          const deployTx = await factoryContract.createStandardToken(
            formData.name,
            formData.symbol,
            supplyWei,
            parseInt(formData.decimals)
          );

          await deployTx.wait();
          alert("🎉 Mubarak Ho! JCB Token Deploy ho gaya!");
        } catch (err) {
          console.error(err);
          // Agar gas ka issue aaye toh yahan dikhega
          alert("Step 2 Error: " + (err.reason || "Transaction Cancelled/Failed"));
        } finally {
          setLoading(false);
        }
      }, 5000); // 5 second ka solid delay

  
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