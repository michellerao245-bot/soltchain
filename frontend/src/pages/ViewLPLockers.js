import React from 'react';

const ViewLPLockers = () => {
  return (
    <div className="home-dashboard">
      <div className="analytics-intro-text">
        <h1 className="analytics-main-title">LP Lockers</h1>
        <p className="analytics-sub-desc">Track and verify locked liquidity pools for safety.</p>
      </div>
      <div className="analytics-card">
        <p style={{ textAlign: 'center' }}>Search by pair address or token symbol.</p>
      </div>
    </div>
  );
};

export default ViewLPLockers;