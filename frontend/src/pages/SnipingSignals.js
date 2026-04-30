import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const SnipingSignals = () => {
  const [pairs, setPairs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fetching, setFetching] = useState(false);
  const [error, setError] = useState(false);
  
  const fetchingRef = useRef(false);
  const navigate = useNavigate();

  const fetchAlphaSignals = useCallback(async () => {
    if (fetchingRef.current) return;
    fetchingRef.current = true;
    setFetching(true);
    setError(false);

    try {
     
      const API = import.meta.env.VITE_API_URL;

      const res = await axios.get(`${API}/signals`);

        if (res.data && res.data.success) {
      const finalPairs = res.data.data;
}
        // Step 2: Optimized State Update
        setPairs(prev => {
          if (JSON.stringify(prev) !== JSON.stringify(finalPairs)) {
            return finalPairs;
          }
          return prev;
        });
      }
    } catch (err) {
      console.error("Alpha System Critical Error:", err);
      setError(true);
    } finally {
      fetchingRef.current = false;
      setFetching(false);
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAlphaSignals();
    // Har 30-40 seconds mein refresh
    const interval = setInterval(fetchAlphaSignals, 35000);
    return () => clearInterval(interval);
  }, [fetchAlphaSignals]);

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div>
          <h2 style={styles.title}>🛡️ SoltGuard Alpha Sniper</h2>
          <p style={styles.subtitle}>Powered by SoltAI Engine • Live BSC Feed</p>
        </div>
        <div style={{...styles.liveIndicator, color: fetching ? '#f59e0b' : '#22c55e'}}>
           {fetching ? "● SYNCING" : "● LIVE FEED"}
        </div>
      </div>

      <div style={styles.tableWrapper}>
        {error && <div style={styles.error}>⚠️ Backend Connection Lost. Check server.js</div>}
        
        <table style={styles.table}>
          <thead>
            <tr style={styles.tableHeaderRow}>
              <th style={styles.th}>Alpha Token</th>
              <th style={styles.th}>Liq / Vol</th>
              <th style={styles.th}>Signal</th>
              <th style={styles.th}>Score</th>
              <th style={styles.th}>Audit</th>
            </tr>
          </thead>
          <tbody>
            {!loading && pairs.length > 0 ? (
              pairs.map((pair) => (
                <tr key={pair.address} style={styles.row}>
                  <td style={styles.td}>
                    <div style={{fontWeight: 'bold', color: '#38bdf8'}}>{pair.symbol}</div>
                    <div style={styles.ageBadge}>{pair.age}</div>
                  </td>
                  <td style={styles.td}>
                    <div style={{color: '#22c55e', fontWeight: 'bold'}}>${pair.liquidity.toLocaleString()}</div>
                    <div style={{fontSize: '9px', color: '#64748b'}}>V: ${pair.volume.toLocaleString()}</div>
                  </td>
                  <td style={styles.td}>
                    <div style={{fontSize: '11px', fontWeight: 'bold', color: pair.isRisky ? '#ef4444' : '#f59e0b'}}>
                        {pair.signal}
                    </div>
                    {pair.isRisky && <div style={{fontSize: '8px', color: '#ef4444'}}>High Risk ⚠️</div>}
                  </td>
                  <td style={styles.td}>
                    <span style={{
                        ...styles.scoreBadge, 
                        background: pair.score > 80 ? '#22c55e' : pair.score > 40 ? '#f59e0b' : '#ef4444'
                    }}>
                        {pair.score}
                    </span>
                  </td>
                  <td style={styles.td}>
                    <button 
                        style={styles.scanBtn} 
                        onClick={() => navigate(`/scanner?addr=${pair.address}`)}
                    >
                        AUDIT
                    </button>
                  </td>
                </tr>
              ))
            ) : !loading && (
                <tr>
                    <td colSpan="5" style={{textAlign: 'center', padding: '40px', color: '#64748b'}}>
                        Searching for Alpha Gems... 💎
                    </td>
                </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const styles = {
  container: { background: '#0a0f1e', padding: '20px', borderRadius: '15px', border: '1px solid #1e293b', minHeight: '400px' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' },
  title: { color: '#fff', fontSize: '18px', margin: 0, fontWeight: '900' },
  subtitle: { color: '#64748b', fontSize: '10px' },
  liveIndicator: { fontSize: '10px', fontWeight: 'bold', letterSpacing: '1px' },
  table: { width: '100%', borderCollapse: 'collapse' },
  th: { padding: '10px', fontSize: '10px', color: '#64748b', textAlign: 'left', borderBottom: '1px solid #1e293b' },
  td: { padding: '15px 10px', borderBottom: '1px solid #111827', fontSize: '13px', color: '#fff' },
  ageBadge: { fontSize: '9px', color: '#38bdf8', background: 'rgba(56, 189, 248, 0.1)', padding: '2px 4px', borderRadius: '3px', marginTop: '4px', display: 'inline-block' },
  scoreBadge: { color: '#fff', padding: '4px 8px', borderRadius: '5px', fontWeight: 'bold', fontSize: '12px' },
  scanBtn: { background: 'transparent', border: '1px solid #38bdf8', color: '#38bdf8', padding: '6px 10px', borderRadius: '5px', cursor: 'pointer', fontSize: '10px', transition: '0.3s' },
  error: { background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', padding: '10px', borderRadius: '8px', fontSize: '12px', marginBottom: '10px', textAlign: 'center' }
};

export default SnipingSignals;