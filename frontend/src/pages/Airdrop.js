import React, { useState } from "react";

const Airdrop = () => {
  const [dropType, setDropType] = useState("Native");

  return (
    <div style={containerStyle}>
      <h1 style={titleStyle}>Welcome to <span style={{ color: "#a855f7" }}>SoltDrop</span></h1>

      {/* --- STEP 1: SELECT TYPE --- */}
      <div style={stepCard}>
        <div style={stepHeader}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <span style={stepNum}>1</span>
            <h3 style={{ margin: 0 }}>Select the Airdrop Type</h3>
          </div>
          <span style={{ color: "#4ade80" }}>✔</span>
        </div>

        <div style={{ padding: "15px" }}>
          <div 
            style={{ ...typeRow, border: dropType === "Native" ? "1px solid #a855f7" : "1px solid #1e2d4d" }}
            onClick={() => setDropType("Native")}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <span style={{ fontSize: "20px" }}>🌐</span>
              <h4 style={{ margin: 0 }}>Airdrop <span style={{ color: "#60a5fa" }}>Native Tokens</span></h4>
            </div>
            <button style={dropType === "Native" ? selectedBtn : selectBtn}>
              {dropType === "Native" ? "Selected" : "Select"}
            </button>
          </div>

          <div 
            style={{ ...typeRow, border: dropType === "Custom" ? "1px solid #a855f7" : "1px solid #1e2d4d" }}
            onClick={() => setDropType("Custom")}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <span style={{ fontSize: "20px" }}>💎</span>
              <h4 style={{ margin: 0 }}>Airdrop <span style={{ color: "#60a5fa" }}>Custom Tokens</span></h4>
            </div>
            <button style={dropType === "Custom" ? selectedBtn : selectBtn}>
              {dropType === "Custom" ? "Selected" : "Select"}
            </button>
          </div>
        </div>
      </div>

      {/* --- INSTRUCTIONS SECTION --- */}
      <h3 style={{ textAlign: "center", marginTop: "30px" }}>Airdrop Instructions</h3>
      <div style={instructionGrid}>
        <div style={instItem}>✔ Airdrop tokens to as many users as desired</div>
        <div style={instItem}>✔ Enter your token address first</div>
        <div style={instItem}>✔ Make sure you have enough tokens</div>
        <div style={instItem}>✔ Recommended max 250 addresses at a time</div>
      </div>

      {/* --- STEP 2: ADDRESS INPUT --- */}
      <div style={stepCard}>
        <div style={stepHeader}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <span style={stepNum}>2</span>
            <h3 style={{ margin: 0 }}>Set up the Airdrop Options</h3>
          </div>
        </div>
        <div style={{ padding: "20px" }}>
          <p style={{ fontSize: "14px", color: "#94a3b8" }}>Enter a list of users followed by amount (comma separated)</p>
          <textarea 
            placeholder="Ex: 0x000...000, 100"
            style={textAreaStyle}
          />
          <div style={amountBox}>Total Amount being airdropped: <span style={{ color: "#60a5fa" }}>0</span></div>
          <button style={dropBtn}>AIRDROP TOKENS</button>
        </div>
      </div>
    </div>
  );
};

// --- Styles (DxDrop Style) ---
const containerStyle = { maxWidth: "800px", margin: "40px auto", padding: "0 20px", color: "white" };
const titleStyle = { textAlign: "center", fontSize: "36px", marginBottom: "40px" };

const stepCard = { background: "#111b33", borderRadius: "12px", marginBottom: "20px", border: "1px solid #1e2d4d", overflow: "hidden" };
const stepHeader = { background: "#1e2d4d", padding: "15px 20px", display: "flex", justifyContent: "space-between", alignItems: "center" };
const stepNum = { background: "#60a5fa", color: "#000", width: "24px", height: "24px", borderRadius: "50%", display: "flex", justifyContent: "center", alignItems: "center", fontWeight: "bold", fontSize: "14px" };

const typeRow = { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "15px", borderRadius: "10px", marginBottom: "10px", cursor: "pointer" };
const selectBtn = { background: "transparent", border: "1px solid #334155", color: "#60a5fa", padding: "6px 15px", borderRadius: "20px", cursor: "pointer" };
const selectedBtn = { background: "transparent", border: "1px solid #4ade80", color: "#4ade80", padding: "6px 15px", borderRadius: "20px" };

const instructionGrid = { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", margin: "20px 0", fontSize: "13px", color: "#94a3b8" };
const instItem = { background: "rgba(255,255,255,0.02)", padding: "10px", borderRadius: "5px" };

const textAreaStyle = { width: "100%", height: "120px", background: "#0b1426", border: "1px solid #1e2d4d", borderRadius: "8px", color: "#fff", padding: "10px", marginTop: "10px", outline: "none" };
const amountBox = { background: "#1e2d4d", padding: "12px", borderRadius: "8px", marginTop: "15px", textAlign: "center", fontSize: "14px" };
const dropBtn = { width: "100%", background: "#334155", color: "#94a3b8", border: "none", padding: "15px", borderRadius: "8px", fontWeight: "bold", marginTop: "20px", cursor: "not-allowed" };

export default Airdrop;