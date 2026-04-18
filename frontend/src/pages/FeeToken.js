import React, { useState } from 'react';
import { ethers } from 'ethers';
import FACTORY_ABI from '../contractABI.json';

const FeeToken = () => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ name: '', symbol: '', supply: '', decimals: '18', tax: '2', taxWallet: '' });

  const FACTORY_ADDRESS = "0xc8fBBfa8172D3FF165889259C3a02eC5a5Cc3a18";
  const SOLT_TOKEN_ADDRESS = "0x6C8942407c65D0f038b04DD5DA3420eC826Cc8d9";

  const handleDeploy = async (e) => {
    e.preventDefault();
    try {
      if (!window.ethereum) return alert("MetaMask nahi mila!");
      setLoading(true);

      await window.ethereum.request({ method: 'eth_requestAccounts' });
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();

      const soltContract = new ethers.Contract(SOLT_TOKEN_ADDRESS, ["function approve(address spender, uint256 amount) public returns (bool)"], signer);
      await (await soltContract.approve(FACTORY_ADDRESS, ethers.parseUnits("6000", 18))).wait();

      const factoryContract = new ethers.Contract(FACTORY_ADDRESS, FACTORY_ABI, signer);
      const supplyWei = ethers.parseUnits(formData.supply.toString(), parseInt(formData.decimals));

      // Fee Token mein Tax aur Wallet parameters zaroori hain
      const deployTx = await factoryContract.createFeeToken(
        formData.name,
        formData.symbol,
        supplyWei,
        parseInt(formData.decimals),
        parseInt(formData.tax),
        formData.taxWallet
      );
      await deployTx.wait();
      alert("🎉 Liquidity Fee Token Success!");
    } catch (err) {
      alert("Error: " + (err.reason || err.message));
    } finally { setLoading(false); }
  };

  return (
    <div className="mint-container">
      <h1>Deploy <span className="blue-text">Fee Token</span></h1>
      <form onSubmit={handleDeploy} className="form-grid">
        <input placeholder="Name" onChange={e => setFormData({...formData, name: e.target.value})} required />
        <input placeholder="Symbol" onChange={e => setFormData({...formData, symbol: e.target.value})} required />
        <input type="number" placeholder="Supply" onChange={e => setFormData({...formData, supply: e.target.value})} required />
        <input type="number" placeholder="Tax % (Ex: 2)" onChange={e => setFormData({...formData, tax: e.target.value})} required />
        <input placeholder="Tax Wallet Address" onChange={e => setFormData({...formData, taxWallet: e.target.value})} required />
        <button type="submit" disabled={loading}>{loading ? "Processing..." : "Deploy Now"}</button>
      </form>
    </div>
  );
};
export default FeeToken;