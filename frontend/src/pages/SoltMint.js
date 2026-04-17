import React from 'react';
import { useNavigate } from 'react-router-dom';
import './CreateToken.css';

const SoltMint = () => {
  const navigate = useNavigate();

  // Token Types Data - Updated with correct Fees and Info
  const tokenTypes = [
    {
      name: "Standard Token",
      desc: "Basic BEP-20 token with fixed supply. Simple, clean, and professional.",
      path: "/standard-token",
      icon: "💎",
      fee: "6000 SOLT"
    },
    {
      name: "Burn Token",
      desc: "Every transaction burns a % of tokens. Built-in deflationary mechanism.",
      path: "/burn-token",
      icon: "🔥",
      fee: "6000 SOLT"
    },
    {
      name: "Fee Token",
      desc: "Collect transaction tax (Buy/Sell) for marketing, rewards, or liquidity.",
      path: "/fee-token",
      icon: "💰",
      fee: "6000 SOLT"
    }
  ];

  return (
    <div className="mint-container fade-in">
      {/* Title Updated to match your brand */}
      <h1 className="mint-title">Solt<span className="blue-text">Mint</span> - Token Creator</h1>
      
      <div className="mint-section">
        <h3 style={{textAlign: 'center', marginBottom: '30px', color: '#a0aec0', fontWeight: '400'}}>
          Choose your token technology
        </h3>
        
        <div className="type-list">
          {tokenTypes.map((token, index) => (
            <div
              key={index}
              className="type-card"
              onClick={() => navigate(token.path)}
              style={{ cursor: 'pointer' }}
            >
              <div className="card-icon" style={{fontSize: '40px', marginBottom: '15px'}}>{token.icon}</div>
              <div className="card-info">
                <span className="token-name" style={{fontWeight: 'bold', fontSize: '20px', color: '#fff'}}>
                  {token.name}
                </span>
                <p style={{fontSize: '13px', color: '#a0aec0', marginTop: '8px', lineHeight: '1.5'}}>
                  {token.desc}
                </p>
                {/* Updated Fee Display - Important for user trust */}
                <div style={{
                  marginTop: '15px', 
                  color: '#6366f1', // Purple/Blue tone for premium feel
                  fontSize: '14px', 
                  fontWeight: 'bold',
                  background: 'rgba(99, 102, 241, 0.1)',
                  padding: '5px 10px',
                  borderRadius: '5px',
                  display: 'inline-block'
                }}>
                  Creation Fee: {token.fee}
                </div>
              </div>
              <button className="select-btn" style={{marginTop: '20px'}}>Select</button>
            </div>
          ))}
        </div>
      </div>
      
      <div className="mint-footer" style={{textAlign: 'center', marginTop: '50px', color: '#718096'}}>
        <p>Verified Smart Contracts. Deployed on BSC Mainnet.</p>
        <p style={{fontSize: '12px', marginTop: '5px'}}>Make sure you have enough SOLT for the service fee.</p>
      </div>
    </div>
  );
};

export default SoltMint;