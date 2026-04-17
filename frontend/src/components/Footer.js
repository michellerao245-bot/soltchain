import React from 'react';

const Footer = () => {
  return (
    <footer style={footerContainer}>
      <div style={footerContent}>
        
        {/* Products Column */}
        <div style={columnStyle}>
          <h4 style={headingStyle}>Products</h4>
          <p style={linkStyle}>SoltMint</p>
          <p style={linkStyle}>SoltSale</p>
          <p style={linkStyle}>SoltLock</p>
          <p style={linkStyle}>SoltDrop</p>
        </div>

        {/* Company Column */}
        <div style={columnStyle}>
          <h4 style={headingStyle}>Company</h4>
          <p style={linkStyle}>Our Story</p>
          <p style={linkStyle}>Press Kit</p>
          <p style={linkStyle}>Terms of Use</p>
          <p style={linkStyle}>Private Policy</p>
          <p style={linkStyle}>$SOLT</p>
        </div>

        {/* Resources Column */}
        <div style={columnStyle}>
          <h4 style={headingStyle}>Resources</h4>
          <p style={linkStyle}>Documentation</p>
          <p style={linkStyle}>Support Chat</p>
          <p style={linkStyle}>Marketing Service</p>
        </div>

      </div>

      <hr style={dividerStyle} />

      {/* Social Icons & Copyright */}
      <div style={bottomSection}>
        <div style={socialIcons}>
          <span>📄</span> <span>🎬</span> <span>✈️</span> <span>𝕏</span> <span>👾</span>
        </div>
        <p style={{ fontSize: "14px", color: "#94a3b8", marginTop: "15px" }}>
          © 2026 SoltDex Technologies. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

// --- Styles ---
const footerContainer = { background: "#0b1426", padding: "60px 20px 30px 20px", borderTop: "1px solid #1e2d4d", marginTop: "auto" };
const footerContent = { display: "flex", justifyContent: "space-around", flexWrap: "wrap", maxWidth: "1000px", margin: "0 auto", textAlign: "left" };
const columnStyle = { minWidth: "150px", marginBottom: "30px" };
const headingStyle = { fontSize: "18px", color: "#fff", marginBottom: "20px", fontWeight: "bold" };
const linkStyle = { fontSize: "14px", color: "#94a3b8", marginBottom: "12px", cursor: "pointer" };
const dividerStyle = { border: "0", borderTop: "1px solid #1e2d4d", margin: "30px 0" };
const bottomSection = { textAlign: "center" };
const socialIcons = { display: "flex", justifyContent: "center", gap: "25px", fontSize: "20px", color: "#fff" };

export default Footer;