import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaCoins, FaRocket, FaLock, FaParachuteBox } from 'react-icons/fa';
import './Create.css';

const Create = () => {
  const navigate = useNavigate();

  const options = [
    {
      title: "Create Tokens",
      desc: "Deploy your own BEP-20 or ERC-20 tokens instantly.",
      icon: <FaCoins />,
      path: "/create-tokens"
    },
    {
      title: "Create Sale",
      desc: "Launch a presale for your project with custom vesting.",
      icon: <FaRocket />,
      path: "/create-sales"
    },
    {
      title: "Create Locks",
      desc: "Lock your Liquidity or Team tokens for investor trust.",
      icon: <FaLock />,
      path: "/create-locks"
    },
    {
      title: "Airdrop Tokens",
      desc: "Send tokens to thousands of addresses in one click.",
      icon: <FaParachuteBox />,
      path: "/airdrop-tokens"
    }
  ];

  return (
    <div className="create-page-container">
      <div className="create-header">
        <h1>What do you want to <span>Launch</span>?</h1>
        <p>Select a service to start building on Soltchain.</p>
      </div>

      <div className="options-grid">
        {options.map((item, index) => (
          <div 
            key={index} 
            className="option-card" 
            onClick={() => navigate(item.path)}
          >
            <div className="option-icon">{item.icon}</div>
            <h3>{item.title}</h3>
            <p>{item.desc}</p>
            <button className="start-btn">Start Building</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Create;