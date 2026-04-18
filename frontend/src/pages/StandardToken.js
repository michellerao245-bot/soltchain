import React, { useState } from 'react';
import { ethers } from 'ethers'; 
import './CreateToken.css';
import FACTORY_ABI from '../contractABI.json';

const StandardToken = () => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ name: '', symbol: '', supply: '', decimals: '18' });

  const FACTORY_ADDRESS = "0xc8fBBfa8172D3FF165889259C3a02eC5a5Cc3a18";
  const SOLT_TOKEN_ADDRESS = "0x6C8942407c65D0f038b04DD5DA3420eC826Cc8d9";

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
      alert("🎉 Standard Token Success!");
    } catch (err) {
      alert("Error: " + (err.reason || err.message));
    } finally { setLoading(false); }
  };

  return (
    <div className="mint-container">
      <h1>Deploy <span className="blue-text">Standard Token</span></h1>
      <form onSubmit={handleDeploy} className="form-grid">
        <input placeholder="Name" onChange={e => setFormData({...formData, name: e.target.value})} required />
        <input placeholder="Symbol" onChange={e => setFormData({...formData, symbol: e.target.value})} required />
        <input type="number" placeholder="Supply" onChange={e => setFormData({...formData, supply: e.target.value})} required />
        <button type="submit" disabled={loading}>{loading ? "Processing..." : "Deploy Now"}</button>
      </form>
    </div>
  );
};
export default StandardToken;