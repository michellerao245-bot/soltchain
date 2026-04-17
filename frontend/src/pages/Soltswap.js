import React, { useState } from 'react';
import { Settings, ArrowDown } from 'lucide-react'; 

const Soltswap = () => {
  const [fromAmount, setFromAmount] = useState('');
  const [toAmount, setToAmount] = useState('');

  // Swap logic (Calculations baad mein add karenge)
  const handleFromChange = (e) => {
    setFromAmount(e.target.value);
    // Maan lo 1 BNB = 1000 SOLT
    setToAmount(e.target.value * 1000); 
  };

  return (
    <div className="home-dashboard" style={{ display: 'flex', justifyContent: 'center', paddingTop: '50px', width: '100%' }}>
      <div className="analytics-card" style={{ width: '100%', maxWidth: '450px', padding: '20px', borderRadius: '24px', background: '#1e293b' }}>
        
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h2 style={{ margin: 0, fontSize: '1.5rem', color: 'white' }}>Swap</h2>
          <Settings style={{ cursor: 'pointer', color: '#94a3b8' }} size={20} />
        </div>

        {/* Input: From */}
        <div style={{ background: '#0f172a', padding: '16px', borderRadius: '16px', marginBottom: '8px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ color: '#94a3b8', fontSize: '0.9rem' }}>From</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <input 
              type="number" 
              placeholder="0.0" 
              style={{ background: 'transparent', border: 'none', color: 'white', fontSize: '1.8rem', width: '60%', outline: 'none' }}
              value={fromAmount}
              onChange={handleFromChange}
            />
            <button className="view-chart-btn" style={{ borderRadius: '12px', padding: '8px 12px', display: 'flex', alignItems: 'center', gap: '5px', border: '1px solid #334155' }}>
              BNB
            </button>
          </div>
        </div>

        {/* Swap Arrow Icon - Fixed zIndex */}
        <div style={{ display: 'flex', justifyContent: 'center', margin: '-20px 0', position: 'relative', zIndex: 10 }}>
          <div style={{ background: '#1e293b', padding: '8px', borderRadius: '10px', border: '4px solid #0f172a' }}>
            <ArrowDown size={16} color="#f59e0b" />
          </div>
        </div>

        {/* Input: To */}
        <div style={{ background: '#0f172a', padding: '16px', borderRadius: '16px', marginTop: '8px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ color: '#94a3b8', fontSize: '0.9rem' }}>To</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <input 
              type="number" 
              placeholder="0.0" 
              style={{ background: 'transparent', border: 'none', color: 'white', fontSize: '1.8rem', width: '60%', outline: 'none' }}
              readOnly
              value={toAmount}
            />
            <button className="buy-token-btn" style={{ borderRadius: '12px', padding: '8px 12px', display: 'flex', alignItems: 'center', gap: '5px' }}>
              SOLT
            </button>
          </div>
        </div>

        {/* Details */}
        <div style={{ marginTop: '20px', padding: '0 10px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.85rem' }}>
            <span style={{ color: '#94a3b8' }}>Price Impact</span>
            <span style={{ color: '#10b981' }}>&lt;0.01%</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
            <span style={{ color: '#94a3b8' }}>Slippage Tolerance</span>
            <span style={{ color: '#f59e0b' }}>0.5%</span>
          </div>
        </div>

        {/* Connect Button */}
        <button className="buy-token-btn" style={{ width: '100%', padding: '16px', borderRadius: '16px', marginTop: '20px', fontSize: '1.1rem', fontWeight: 'bold' }}>
          Connect Wallet
        </button>
      </div>
    </div>
  );
};

export default Soltswap;