import React from 'react';

const SoltcoinSwap = () => {
  // eslint-disable-next-line no-unused-vars
  const SOLTCOIN_ADDRESS = "0x1b1E802A07105251D8e273835C06a4C85eaF6abb";
  // eslint-disable-next-line no-unused-vars
  // BNB ka official wrapper address (WBNB) pair banane ke liye
  const BNB_ADDRESS = "0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c";

 const handleBuyClick = () => {
  // bsc chain specify karne se token turant select hota hai
  const pancakeLink = `https://pancakeswap.finance/swap?inputCurrency=BNB&outputCurrency=0x1b1E802A07105251D8e273835C06a4C85eaF6abb&chain=bsc`;
  window.open(pancakeLink, '_blank');
};

  return (
    <div style={containerStyle}>
      <h2 style={titleStyle}>Trade Soltcoin (SOLT)</h2>
      <p style={descStyle}>Safe & Secure trading via PancakeSwap Official Exchange</p>
      
      <button onClick={handleBuyClick} style={buyButtonStyle}>
        <img 
          src="https://tokens.pancakeswap.finance/images/symbol/bnb.png" 
          width="20" 
          style={{marginRight: '10px'}} 
          alt="BNB" 
        />
        Buy on PancakeSwap
      </button>

      <div style={trustBadge}>
        <span>✓ Audited</span>
        <span>✓ Liquidity Locked</span>
      </div>
    </div>
  );
};

// ... (Styles same as before)
const containerStyle = { background: '#161b22', padding: '30px', borderRadius: '20px', border: '1px solid #30363d', maxWidth: '450px', margin: '20px auto', textAlign: 'center' };
const titleStyle = { color: '#f3ba2f', marginBottom: '10px' };
const descStyle = { color: '#8b949e', fontSize: '14px', marginBottom: '25px' };
const buyButtonStyle = { background: 'linear-gradient(135deg, #f3ba2f 0%, #d49a00 100%)', color: '#000', border: 'none', padding: '15px 40px', borderRadius: '12px', fontSize: '18px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%' };
const trustBadge = { display: 'flex', justifyContent: 'center', gap: '15px', marginTop: '20px', fontSize: '12px', color: '#3fb950' };

export default SoltcoinSwap;