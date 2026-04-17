import React from 'react';

const CreateLock = () => {
  return (
    <div style={{ padding: "40px", color: "white", textAlign: "center" }}>
      <h1 style={{ fontSize: "36px" }}>Solt<span style={{ color: "#fbbf24" }}>Lock</span></h1>
      <p style={{ color: "#94a3b8" }}>Lock your Liquidity or Team Tokens safely.</p>
      
      <div style={{ 
        background: "#111b33", 
        padding: "30px", 
        borderRadius: "15px", 
        border: "1px solid #1e2d4d",
        marginTop: "30px",
        maxWidth: "600px",
        margin: "30px auto"
      }}>
        <h3 style={{ marginBottom: "20px" }}>Coming Soon...</h3>
        <p>We are building the most secure locking protocol for the SoltDex ecosystem.</p>
      </div>
    </div>
  );
};

export default CreateLock;