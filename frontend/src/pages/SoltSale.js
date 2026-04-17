import React, { useState } from 'react';
import { ethers } from 'ethers';
import './CreateToken.css';

const SoltSale = () => {
  const [loading, setLoading] = useState(false);
  const handlePay = async () => {
    try {
      setLoading(true);
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const tx = await signer.sendTransaction({
        to: "YOUR_WALLET_ADDRESS_HERE",
        value: ethers.parseEther("0.2")
      });
      await tx.wait();
      alert("Payment Success! Launchpad creation started.");
    } catch (e) { alert("Payment Failed!"); } finally { setLoading(false); }
  };

  return (
    <div className="mint-container fade-in">
      <h1 className="mint-title">Solt<span className="blue-text">Sale</span> - Launchpad</h1>
      <div className="mint-section">
        <div className="input-group"><label>Token Address</label><input type="text" placeholder="0x..." /></div>
        <div className="form-grid" style={{marginTop:'15px'}}>
          <div className="input-group"><label>Presale Rate</label><input type="number" placeholder="100" /></div>
          <div className="input-group"><label>Soft Cap (BNB)</label><input type="number" placeholder="10" /></div>
        </div>
        <button className="mint-submit-btn" onClick={handlePay} disabled={loading}>
          {loading ? "Processing..." : "Pay ₹10,000 & Create Sale"}
        </button>
      </div>
    </div>
  );
};
export default SoltSale;