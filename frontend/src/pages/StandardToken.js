import React, { useState } from 'react';
import { ethers } from 'ethers'; 
import './CreateToken.css';
import FACTORY_ABI from '../contractABI.json';

const StandardToken = () => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ name: '', symbol: '', supply: '', decimals: '18' });

  const FACTORY_ADDRESS = "0xc8fBBfa8172D3FF165889259C3a02eC5a5Cc3a18";
  const SOLT_TOKEN_ADDRESS = "0x6C8942407c65D0f038b04DD5DA3420eC826Cc8d9";

  // Input fields ki styling - Isse white strip hat jayegi
  const inputStyle = {
    background: '#121212', // Dark background
    border: '2px solid #007bff', // Blue border
    color: 'white',
    padding: '12px',
    borderRadius: '8px',
    width: '100%',
    marginBottom: '15px',
    fontSize: '16px'
  };

  const handleDeploy = async (e) => {
    e.preventDefault();
    try {
      if (!window.ethereum) return alert("MetaMask nahi mila!");
      setLoading(true);

      await window.ethereum.request({ method: 'eth_requestAccounts' });
      const provider = new ethers.BrowserProvider(window.ethereum);
      
      const network = await provider.getNetwork();
      if (network.chainId !== 56n) {
        await window.ethereum.request({ method: 'wallet_switchEthereumChain', params: [{ chainId: '0x38' }] });
      }

      const signer = await provider.getSigner();
      const soltContract = new ethers.Contract(SOLT_TOKEN_ADDRESS, ["function approve(address spender, uint256 amount) public returns (bool)"], signer);
      
      const approveTx = await soltContract.approve(FACTORY_ADDRESS, ethers.parseUnits("6000", 18));
      await approveTx.wait();

      const factoryContract = new ethers.Contract(FACTORY_ADDRESS, FACTORY_ABI, signer);
      const supplyWei = ethers.parseUnits(formData.supply.toString(), parseInt(formData.decimals));

      const deployTx = await factoryContract.createStandardToken(formData.name, formData.symbol, supplyWei, parseInt(formData.decimals));
      await deployTx.wait();
      alert("🎉 Standard Token Successfully Deployed!");
    } catch (err) {
      alert("Error: " + (err.reason || err.message));
    } finally { setLoading(false); }
  };

  return (
    <div className="mint-container fade-in">
      <h1 className="mint-title">Deploy <span className="blue-text">Standard Token</span></h1>
      <div className="mint-section">
        <form onSubmit={handleDeploy} className="form-grid">
          <div className="input-group">
            <label style={{color: '#aaa'}}>Token Name</label>
            <input 
              style={inputStyle}
              placeholder="Ex: JCB Coin" 
              value={formData.name}
              onChange={e => setFormData({...formData, name: e.target.value})} 
              required 
            />
          </div>
          <div className="input-group">
            <label style={{color: '#aaa'}}>Symbol</label>
            <input 
              style={inputStyle}
              placeholder="JCB" 
              value={formData.symbol}
              onChange={e => setFormData({...formData, symbol: e.target.value})} 
              required 
            />
          </div>
          <div className="input-group">
            <label style={{color: '#aaa'}}>Total Supply</label>
            <input 
              style={inputStyle}
              type="number" 
              placeholder="1000000" 
              value={formData.supply}
              onChange={e => setFormData({...formData, supply: e.target.value})} 
              required 
            />
          </div>
          
          <button 
            type="submit" 
            className="mint-submit-btn" 
            disabled={loading}
            style={{gridColumn: '1 / -1', background: '#007bff', color: 'white', padding: '15px', border: 'none', borderRadius: '8px', cursor: 'pointer'}}
          >
            {loading ? "Processing..." : "Deploy Token Now"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default StandardToken;