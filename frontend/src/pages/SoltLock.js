import React, { useState } from 'react';
import { ethers } from 'ethers';
import './CreateToken.css';

const SoltLock = () => {
  const [loading, setLoading] = useState(false);
  const handlePay = async () => {
    try {
      setLoading(true);
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const tx = await signer.sendTransaction({
        to: "YOUR_WALLET_ADDRESS_HERE",
        value: ethers.parseEther("0.1") // Lock ke liye thoda kam ₹5000 rakh sakte ho
      });
      await tx.wait();
      alert("Payment Success! Locking Token...");
    } catch (e) { alert("Payment Failed!"); } finally { setLoading(false); }
  };

  return (
    <div className="mint-container fade-in">
      <h1 className="mint-title">Solt<span className="blue-text">Lock</span> - Assets Locker</h1>
      <div className="mint-section">
        <div className="input-group"><label>Token or LP Address</label><input type="text" placeholder="0x..." /></div>
        <div className="input-group" style={{marginTop:'15px'}}><label>Lock Until (Date)</label><input type="date" /></div>
        <button className="mint-submit-btn" onClick={handlePay} disabled={loading}>
          {loading ? "Processing..." : "Pay Fee & Lock Asset"}
        </button>
      </div>
    </div>
  );
};
export default SoltLock;