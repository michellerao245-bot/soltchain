import React, { useState, useRef } from 'react';
import { FaShieldAlt, FaSearch, FaExclamationTriangle, FaCheckCircle, FaExternalLinkAlt, FaLock, FaCopy, FaHistory } from 'react-icons/fa';

const SoltGuard = () => {
  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [history, setHistory] = useState([]);

  // ❌ Fix 2 & 3: Refs for stable timeouts and preventing race conditions
  const timeoutRef = useRef(null);
  const latestRequest = useRef(0);

  const handleScan = async (overrideAddr) => {
    const targetAddr = overrideAddr || address;
    if (!targetAddr || targetAddr.length !== 42) return;

    setLoading(true);
    setResult(null);

    // Track latest request ID
    const requestId = ++latestRequest.current;

    try {
      const res = await fetch(`https://api.gopluslabs.io/api/v1/token_security/56?contract_addresses=${targetAddr}`);
      const data = await res.json();

      // ❌ Fix 3: Race Condition Protection
      if (requestId !== latestRequest.current) return;

      const token = data?.result?.[targetAddr.toLowerCase()];
      if (!token) {
        setResult({ error: true, msg: "Token not found on BSC." });
        setLoading(false);
        return;
      }

      // Safe Tax & Logic
      const rawBuy = Number(token.buy_tax || 0);
      const rawSell = Number(token.sell_tax || 0);
      const buyTax = rawBuy <= 1 ? rawBuy * 100 : rawBuy;
      const sellTax = rawSell <= 1 ? rawSell * 100 : rawSell;
      
      const isHoneypot = token.is_honeypot === "1";
      const mintable = token.is_mintable === "1";
      const isProxy = token.is_proxy === "1";
      const isRenounced = token.owner_address === "0x0000000000000000000000000000000000000000";
      const lpHolders = parseInt(token.lp_holder_count || "0");

      // ❌ Fix 4: Stronger Liquidity Logic (Dev-only LP check)
      const noLiquidity = token.is_in_dex !== "1" || lpHolders < 2;

      let risk = "Low Risk";
      let riskColor = "#10b981";

      if (isHoneypot || buyTax > 25 || sellTax > 25 || noLiquidity) {
        risk = noLiquidity ? "High Risk (Liquidity Issue)" : "High Risk (STAY AWAY)";
        riskColor = "#ef4444";
      } else if (buyTax > 10 || sellTax > 10 || mintable || !isRenounced || isProxy) {
        risk = "Medium Risk";
        riskColor = "#f59e0b";
      }

      const finalResult = {
        contract: targetAddr,
        isHoneypot,
        buyTax: buyTax.toFixed(2) + "%",
        sellTax: sellTax.toFixed(2) + "%",
        mintDisabled: !mintable,
        isRenounced,
        isProxy,
        noLiquidity,
        riskLevel: risk,
        riskColor: riskColor
      };

      setResult(finalResult);
      
      // ❌ Fix 5: Scan History (Sticky Feature)
      setHistory(prev => {
        const filtered = prev.filter(a => a !== targetAddr);
        return [targetAddr, ...filtered].slice(0, 5);
      });

      setAddress(""); 

    } catch (err) {
      if (requestId === latestRequest.current) {
        setResult({ error: true, msg: "Network error. Try again." });
      }
    }
    setLoading(false);
  };

  // ❌ Fix 2: Debounced Input using useRef
  const onInputChange = (e) => {
    const val = e.target.value;
    setAddress(val);

    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    
    if (val.length === 42) {
      timeoutRef.current = setTimeout(() => {
        handleScan(val);
      }, 600);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    alert("Copied!");
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}><FaShieldAlt style={{color: '#f59e0b'}} /> SoltGuard AI 🛡️</h2>
      <p style={styles.subtitle}>Institutional-grade Smart Contract Security</p>

      <div style={styles.searchBox}>
        <input 
          style={styles.input}
          placeholder="Paste BSC Address..."
          value={address}
          onChange={onInputChange}
        />
        <button style={styles.scanBtn} onClick={() => handleScan()}>
          {loading ? "..." : <FaSearch />}
        </button>
      </div>

      {loading && <div style={styles.loader}>🔍 Analyzing Latest Blockchain State...</div>}

      {result?.error && <div style={styles.errorCard}>{result.msg}</div>}

      {result && !result.error && (
        <div style={{...styles.resultCard, borderColor: result.riskColor}}>
          <div style={styles.cardHeader}>
            <h3 style={{color: result.riskColor, margin: 0}}>{result.riskLevel}</h3>
            {result.isRenounced && <span style={styles.badge}><FaLock size={10}/> Renounced</span>}
          </div>

          <div style={styles.statsGrid}>
            <div style={styles.statItem}><span>Honeypot:</span> <strong>{result.isHoneypot ? "YES" : "NO"}</strong></div>
            <div style={styles.statItem}><span>Liquidity:</span> <strong>{result.noLiquidity ? "DANGER ❌" : "OK ✅"}</strong></div>
            <div style={styles.statItem}><span>Buy Tax:</span> <strong>{result.buyTax}</strong></div>
            <div style={styles.statItem}><span>Sell Tax:</span> <strong>{result.sellTax}</strong></div>
            
            {/* ❌ Fix 1: Duplicate style bug removed */}
            <div 
              onClick={() => copyToClipboard(result.contract)} 
              style={{...styles.statItem, cursor: 'pointer', border: '1px solid #334155'}}
            >
              <span>Address:</span> <strong>{result.contract.slice(0,6)}... <FaCopy size={10}/></strong>
            </div>
            <div style={styles.statItem}><span>Proxy:</span> <strong>{result.isProxy ? "YES ⚠️" : "NO"}</strong></div>
          </div>
        </div>
      )}

      {/* ❌ Fix 5: Recent Scan History UI */}
      {history.length > 0 && (
        <div style={styles.historySection}>
          <h4 style={{display: 'flex', alignItems: 'center', gap: '8px', color: '#94a3b8'}}>
            <FaHistory size={14}/> Recent Scans
          </h4>
          <div style={styles.historyList}>
            {history.map((addr, i) => (
              <div key={i} onClick={() => handleScan(addr)} style={styles.historyChip}>
                {addr.slice(0, 10)}...{addr.slice(-6)}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const styles = {
  container: { padding: '40px', color: '#fff', minHeight: '100vh', background: '#020617' },
  title: { fontSize: '28px', display: 'flex', alignItems: 'center', gap: '10px' },
  subtitle: { color: '#94a3b8', marginBottom: '30px' },
  searchBox: { display: 'flex', gap: '10px', maxWidth: '600px' },
  input: { flex: 1, padding: '15px', borderRadius: '10px', background: '#0f172a', border: '1px solid #1e293b', color: '#fff' },
  scanBtn: { padding: '15px 30px', borderRadius: '10px', background: '#f59e0b', border: 'none', cursor: 'pointer', fontWeight: 'bold' },
  loader: { marginTop: '15px', color: '#f59e0b', fontSize: '14px' },
  errorCard: { background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', padding: '15px', borderRadius: '10px', marginTop: '20px', maxWidth: '600px' },
  resultCard: { background: '#0f172a', padding: '25px', borderRadius: '15px', border: '2px solid', maxWidth: '600px', marginTop: '20px' },
  cardHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' },
  statsGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' },
  statItem: { background: '#1e293b', padding: '12px', borderRadius: '8px', fontSize: '13px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  badge: { background: '#10b981', padding: '4px 8px', borderRadius: '5px', fontSize: '10px', display: 'flex', alignItems: 'center', gap: '5px' },
  historySection: { marginTop: '40px', maxWidth: '600px' },
  historyList: { display: 'flex', flexWrap: 'wrap', gap: '10px', marginTop: '10px' },
  historyChip: { background: '#0f172a', padding: '8px 12px', borderRadius: '20px', fontSize: '12px', color: '#f59e0b', border: '1px solid #1e293b', cursor: 'pointer' }
};

export default SoltGuard;