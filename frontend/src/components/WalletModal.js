import React from 'react';

const WalletModal = ({ closeModal }) => {
  
  // Strong Connection Logic
  const connectWallet = async () => {
    if (typeof window.ethereum !== 'undefined') {
      try {
        // Ye line MetaMask popup ko force karegi
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        console.log("Connected to:", accounts[0]);
        alert("Success: SoltDex Connected!");
        closeModal();
      } catch (error) {
        // Agar user cancel kare ya wallet lock ho
        alert("Connection failed! Please unlock MetaMask and approve the request.");
      }
    } else {
      alert("No Wallet Found! Please install MetaMask extension.");
    }
  };

  // Stable Image Links (Backup added)
  const networks = [
    { name: 'BNB Chain', icon: 'https://tokens.pancakeswap.finance/images/symbol/bnb.png' },
    { name: 'Ethereum', icon: 'https://tokens.pancakeswap.finance/images/symbol/eth.png' },
    { name: 'Polygon', icon: 'https://tokens.pancakeswap.finance/images/symbol/matic.png' },
    { name: 'Base', icon: 'https://altcoinsbox.com/wp-content/uploads/2023/02/base-logo.png' }
  ];

  const wallets = [
    { name: 'MetaMask', icon: 'https://upload.wikimedia.org/wikipedia/commons/3/36/MetaMask_Fox.svg' },
    { name: 'Trust Wallet', icon: 'https://trustwallet.com/assets/images/media/assets/trust_platform.svg' },
    { name: 'TokenPocket', icon: 'https://www.tokenpocket.pro/static/images/logo.png' },
    { name: 'OKX Wallet', icon: 'https://static.okx.com/cdn/assets/imgs/221/962E3A090A093D64.png' }
  ];

  return (
    <div style={overlay}>
      <div style={modalBox}>
        <div style={header}>
          <h2 style={{ margin: 0, fontSize: '18px' }}>Connect Wallet</h2>
          <button onClick={closeModal} style={closeBtn}>✕</button>
        </div>

        <div style={contentLayout}>
          {/* Left Side: 4 Networks */}
          <div style={sidebar}>
            <p style={labelText}>SELECT NETWORK</p>
            {networks.map((net) => (
              <div key={net.name} style={net.name === 'BNB Chain' ? activeNetItem : netItem}>
                <img src={net.icon} width="18" height="18" alt={net.name} onError={(e) => e.target.src='https://via.placeholder.com/18'} />
                {net.name}
              </div>
            ))}
          </div>

          {/* Right Side: 4 Wallets */}
          <div style={walletGridArea}>
            <p style={labelText}>SELECT WALLET</p>
            <div style={grid}>
              {wallets.map((wallet) => (
                <div key={wallet.name} style={walletCard} onClick={connectWallet}>
                  <img src={wallet.icon} style={walletImg} alt={wallet.name} onError={(e) => e.target.src='https://via.placeholder.com/40'} />
                  <span style={walletTitle}>{wallet.name}</span>
                </div>
              ))}
            </div>
            <p style={footerDisclaimer}>
              By connecting, you agree to SoltDex's <span style={{color: '#3b82f6'}}>Terms of Service</span>.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- Updated Styles for 2026 Dashboard Look ---
const overlay = { position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 10000 };
const modalBox = { background: '#0d1117', width: '620px', borderRadius: '20px', border: '1px solid #30363d', color: 'white', overflow: 'hidden' };
const header = { padding: '20px', borderBottom: '1px solid #30363d', display: 'flex', justifyContent: 'space-between', alignItems: 'center' };
const closeBtn = { background: 'none', border: 'none', color: '#8b949e', cursor: 'pointer', fontSize: '20px' };
const contentLayout = { display: 'flex' };
const sidebar = { width: '180px', borderRight: '1px solid #30363d', padding: '20px', background: '#161b22' };
const walletGridArea = { flex: 1, padding: '20px' };
const labelText = { fontSize: '10px', fontWeight: 'bold', color: '#8b949e', marginBottom: '15px', letterSpacing: '1px' };
const netItem = { display: 'flex', alignItems: 'center', gap: '10px', padding: '10px', fontSize: '13px', color: '#8b949e', cursor: 'pointer' };
const activeNetItem = { ...netItem, color: '#f3ba2f', background: 'rgba(243, 186, 47, 0.1)', borderRadius: '8px' };
const grid = { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' };
const walletCard = { background: '#21262d', border: '1px solid #30363d', borderRadius: '12px', padding: '15px', textAlign: 'center', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', transition: '0.3s' };
const walletImg = { width: '40px', height: '40px', objectFit: 'contain' };
const walletTitle = { fontSize: '12px', fontWeight: '500' };
const footerDisclaimer = { marginTop: '20px', fontSize: '11px', color: '#8b949e', textAlign: 'center' };

export default WalletModal;