import React, { useState } from 'react';

const ViewSales = () => {
  const [filter, setFilter] = useState('all');

  // Dummy Sales Data
  const salesData = [
    { id: 1, name: "Soltcoin Presale", status: "Live", progress: "75%", hardcap: "500 BNB" },
    { id: 2, name: "Aurion Token Sale", status: "Upcoming", progress: "0%", hardcap: "200 BNB" }
  ];

  return (
    <div className="home-dashboard">
      <div className="analytics-intro-text">
        <h1 className="analytics-main-title">Current Presales</h1>
        <p className="analytics-sub-desc">Discover and join the best upcoming projects on SoltDex.</p>
      </div>

      {/* Filter Tabs - UI consistent with Dashboard */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '15px', marginBottom: '40px' }}>
        <button className="view-chart-btn" onClick={() => setFilter('all')}>All Sales</button>
        <button className="view-chart-btn" onClick={() => setFilter('live')}>Live</button>
        <button className="view-chart-btn" onClick={() => setFilter('upcoming')}>Upcoming</button>
      </div>

      {/* Sales Grid */}
      <div className="stats-container">
        {salesData.map((sale) => (
          <div key={sale.id} className="stat-card" style={{ textAlign: 'left' }}>
            <div className="stat-label" style={{ 
              color: sale.status === 'Live' ? '#10b981' : '#f59e0b',
              fontWeight: 'bold' 
            }}>
              {sale.status}
            </div>
            <h2 style={{ fontSize: '1.4rem', margin: '10px 0' }}>{sale.name}</h2>
            <p style={{ color: '#94a3b8', fontSize: '0.9rem' }}>Hardcap: {sale.hardcap}</p>
            
            {/* Progress Bar */}
            <div style={{ background: '#1e293b', height: '8px', borderRadius: '4px', margin: '15px 0' }}>
              <div style={{ background: '#f59e0b', width: sale.progress, height: '100%', borderRadius: '4px' }}></div>
            </div>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.8rem' }}>Progress: {sale.progress}</span>
              <button className="buy-token-btn" style={{ padding: '5px 15px', fontSize: '0.8rem' }}>View Sale</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ViewSales; // Ye export hona bahut zaroori hai!