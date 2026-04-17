import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaCoins, FaRocket, FaLock, FaParachuteBox } from 'react-icons/fa';
import './Create.css';

const Create = () => {
  const navigate = useNavigate();

  const options = [
    { title: "Create Tokens", desc: "Mint your own BEP-20 tokens instantly.", icon: <FaCoins />, path: "/create-tokens" },
    { title: "Create Sale", desc: "Launch a professional presale with vesting.", icon: <FaRocket />, path: "/create-sales" },
    { title: "Create Locks", desc: "Secure liquidity and team tokens.", icon: <FaLock />, path: "/create-locks" },
    { title: "Airdrop Tokens", desc: "Distribute tokens to multiple wallets.", icon: <FaParachuteBox />, path: "/airdrop-tokens" }
  ];

  return (
    <div className="create-container">
      <div className="create-hero">
        <h1>All the DAPPs you Need to <span>Launch</span> a Successful Project</h1>
        <p>No coding required! Launch your project with the most secure tools in DeFi.</p>
      </div>

      <div className="options-grid">
        {options.map((item, index) => (
          <div key={index} className="option-card" onClick={() => navigate(item.path)}>
            <div className="icon-box">{item.icon}</div>
            <h3>{item.title}</h3>
            <p>{item.desc}</p>
            <button className="option-btn">Get Started</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Create;