import React from 'react';
import { useNavigate } from 'react-router-dom';
import './CreateToken.css';

const CreateToken = () => {
  const navigate = useNavigate(); // Ye function pages switch karne mein help karega

  return (
    <div className="mint-container">
      <h1 className="mint-title">Mint your own <span className="blue-text">Token</span></h1>

      {/* --- Step 1: Network Selection --- */}
      <div className="mint-section">
        <div className="section-header">
          <span className="step-badge">1</span>
          <h3>Choose a Network</h3>
        </div>
        <div className="button-group">
          <button className="btn-active">Binance Smart Chain</button>
          {/* Ye button ab ChangeNetwork.js wali file kholega */}
          <button className="btn-outline" onClick={() => navigate('/change-network')}>
            Change Network
          </button>
        </div>
      </div>

      {/* --- Step 2: Token Type Selection --- */}
      <div className="mint-section">
        <div className="section-header">
          <span className="step-badge">2</span>
          <h3>Choose a Token Type</h3>
        </div>
        
        <div className="type-list">
          {/* Har card ab apni alag file par navigate karega */}
          <div className="type-card" onClick={() => navigate('/standard-token')}>
            <span>Standard Token</span>
            <button className="select-btn">Select</button>
          </div>

          <div className="type-card" onClick={() => navigate('/burn-token')}>
            <span>Burn Token</span>
            <button className="select-btn">Select</button>
          </div>

          <div className="type-card" onClick={() => navigate('/fee-token')}>
            <span>Fee Token</span>
            <button className="select-btn">Select</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateToken;