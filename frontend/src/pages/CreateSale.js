import React, { useState } from "react";

const CreateSale = () => {
  const [launchType, setLaunchType] = useState("Presale");

  const launchTypes = [
    { id: "Presale", name: "Presale", icon: "🚀", desc: "Standard presale with hardcap/softcap." },
    { id: "Fairlaunch", name: "Fairlaunch", icon: "📈", desc: "No hardcap, price discovered by demand." },
    { id: "Overflow", name: "Overflow", icon: "📊", desc: "Users get tokens proportional to their contribution." },
    { id: "Private", name: "Private Sale", icon: "🔒", desc: "Whitelist only sale for early investors." },
  ];

  return (
    <div style={containerStyle}>
      <h1 style={titleStyle}>Create a <span style={{ color: "#60a5fa" }}>SoltSale</span></h1>

      {/* --- STEP 1: SELECT LAUNCH TYPE --- */}
      <div style={stepCard}>
        <div style={stepHeader}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <span style={stepNum}>1</span>
            <h3 style={{ margin: 0 }}>Select Launch Type</h3>
          </div>
          <span style={{ color: "#4ade80" }}>✔</span>
        </div>

        <div style={{ padding: "10px" }}>
          {launchTypes.map((type) => (
            <div 
              key={type.id} 
              style={{ 
                ...typeRow, 
                border: launchType === type.id ? "1px solid #60a5fa" : "1px solid #1e2d4d",
                background: launchType === type.id ? "rgba(96, 165, 250, 0.05)" : "transparent"
              }}
              onClick={() => setLaunchType(type.id)}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
                <span style={{ fontSize: "20px" }}>{type.icon}</span>
                <div>
                  <h4 style={{ margin: 0, color: "#fff" }}>{type.name}</h4>
                </div>
              </div>
              
              <button style={launchType === type.id ? selectedBtn : selectBtn}>
                {launchType === type.id ? "Selected" : "Select"}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* --- STEP 2: TOKEN INFORMATION (Collapsed for now) --- */}
      <div style={{ ...stepCard, opacity: 0.6 }}>
        <div style={stepHeader}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <span style={stepNum}>2</span>
            <h3 style={{ margin: 0 }}>Token Information</h3>
          </div>
          <span style={{ color: "#94a3b8" }}>▼</span>
        </div>
      </div>

      {/* --- NEXT BUTTON --- */}
      <button style={continueBtn}>Continue to Next Step</button>
    </div>
  );
};

// --- Styles (DxSale Premium Look) ---
const containerStyle = { maxWidth: "700px", margin: "40px auto", padding: "0 20px" };
const titleStyle = { textAlign: "center", fontSize: "36px", marginBottom: "40px", fontWeight: "bold" };

const stepCard = { 
  background: "#111b33", 
  borderRadius: "12px", 
  overflow: "hidden", 
  marginBottom: "15px",
  border: "1px solid #1e2d4d"
};

const stepHeader = { 
  background: "#1e2d4d", 
  padding: "15px 20px", 
  display: "flex", 
  justifyContent: "space-between", 
  alignItems: "center" 
};

const stepNum = { 
  background: "#60a5fa", 
  color: "#000", 
  width: "24px", 
  height: "24px", 
  borderRadius: "50%", 
  display: "flex", 
  justifyContent: "center", 
  alignItems: "center", 
  fontSize: "14px",
  fontWeight: "bold" 
};

const typeRow = { 
  display: "flex", 
  justifyContent: "space-between", 
  alignItems: "center", 
  padding: "15px 20px", 
  margin: "10px", 
  borderRadius: "10px", 
  cursor: "pointer",
  transition: "0.2s"
};

const selectBtn = { background: "transparent", border: "1px solid #334155", color: "#60a5fa", padding: "6px 18px", borderRadius: "20px", cursor: "pointer" };
const selectedBtn = { background: "transparent", border: "1px solid #4ade80", color: "#4ade80", padding: "6px 18px", borderRadius: "20px", fontWeight: "bold" };
const continueBtn = { width: "100%", background: "#60a5fa", color: "#000", border: "none", padding: "15px", borderRadius: "10px", fontWeight: "bold", fontSize: "16px", marginTop: "20px", cursor: "pointer" };

export default CreateSale;