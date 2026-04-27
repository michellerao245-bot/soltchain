import React from 'react';


const Home = () => {
 

  // Token Stats Data
  const tokenStats = [
    { label: "Token Name", value: "SOLTCOIN", color: "#f59e0b" },
    { label: "Token Symbol", value: "$SOLT", color: "#3b82f6" },
    { label: "Total Supply", value: "5,000,000,000", color: "#10b981" },
    { label: "Network", value: "BSC (BEP-20)", color: "#8b5cf6" }
  ];

  // Analytics Platforms Data
  const analyticsPlatforms = [
    {
      name: "DexScreener",
      icon: "📊",
      desc: "Track SOLTCOIN Live View the latest price chart 24h volume liquidity depth recent trades and holder insights directly on DexScreener. Transparency first all data pulled straight from the blockchain."
    },
    {
      name: "Apespace",
      icon: "🦍",
      desc: "Real Time Token Stats on ApeSpace Dive into SOLTCOIN current price 24h changes liquidity depth trades and more on ApeSpace a trusted BSC analytics platform. Transparent on chain data to help you stay informed and trade confidently"
    }
  ];

  return (
    <div className="home-dashboard">
      
      {/* --- HERO SECTION --- */}
      <div className="hero-token-section">
        <h1>SOLTCOIN – A Secure & Community-Driven crypto Asset</h1>
        <p className="hero-subtext">
          A decentralized BEP-20 token on BSC with a fixed total supply of 50,000,000 SOLTCOIN, built for transparency, security, and long-term value.
        </p>
        
        {/* Placeholder for Token Emblem */}
        <div className="token-emblem" style={{ height: '100px' }}></div>

        <button className="buy-token-btn">
          BUY SOLTCOIN
        </button>

        <p className="protocol-subtitle">Leading Decentralized Launchpad and Token Services Protocol</p>
      </div>

      {/* --- TOKEN STATS GRID --- */}
      <div className="stats-container">
        {tokenStats.map((stat, index) => (
          <div key={index} className="stat-card">
            <span className="stat-label">{stat.label}</span>
            <h2 style={{ color: stat.color }}>{stat.value}</h2>
          </div>
        ))}
      </div>

      {/* --- NEW MATTER SECTION --- */}
      <div className="hero-cta-paragraph">
        <h1>All the DAPPs you Need to <span style={{ color: '#3b82f6' }}>Launch</span> a Successful Project</h1>
        <p>
          No coding required! Launch your project with the most secure and advanced project tools in the DeFi Space!
        </p>
      </div>

      {/* --- ANALYTICS HUB --- */}
      <div className="analytics-section">
        <div className="analytics-grid">
          {analyticsPlatforms.map((platform, index) => (
            <div key={index} className="analytics-card">
              <span className="platform-icon">{platform.icon}</span>
              <h3>{platform.name}</h3>
              <p>{platform.desc}</p>
              <button className="view-chart-btn">
                View Chart
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;