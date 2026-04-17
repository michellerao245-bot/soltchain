import React, { useState } from 'react';
import { ethers } from 'ethers';
import './CreateToken.css';

const SoltDrop = () => {
  const [loading, setLoading] = useState(false);
  const handlePay = async () => {
    try {
      setLoading(true);
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const tx = await signer.sendTransaction({ to: "YOUR_WALLET_ADDRESS_HERE", value: ethers.parseEther("0.2") });
      await tx.wait();
      alert("Payment Received! Start Airdrop.");
    } catch (e) { alert("Error!"); } finally { setLoading(false); }
  };

  return (
    <div className="mint-container fade-in">
      <h1 className="mint-title">Solt<span className="blue-text">Drop</span> - Airdrop Tool</h1>
      <div className="mint-section">
        <div className="input-group"><label>Token Address</label><input type="text" placeholder="0x..." /></div>
        <div className="input-group" style={{marginTop:'15px'}}>
          <label>Recipient List (Address, Amount)</label>
          <textarea placeholder="0x123,100&#10;0x456,200" rows="5" style={{width:'100%', background:'#0b1426', color:'white', border:'1px solid #1e2d4d', borderRadius:'8px', padding:'10px'}}></textarea>
        </div>
        <button className="mint-submit-btn" onClick={handlePay} disabled={loading}>
          {loading ? "Processing..." : "Pay ₹10,000 & Send Airdrop"}
        </button>
      </div>
    </div>
  );
};
export default SoltDrop;