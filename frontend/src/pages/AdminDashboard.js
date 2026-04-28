import React, { useState, useEffect } from 'react';
import { useAccount, useReadContract, useWriteContract, useChainId, useWaitForTransactionReceipt } from 'wagmi';
import { parseUnits, formatUnits } from 'viem';
import { supabase } from '../supabaseClient';

// --- CONFIG ---
const FACTORY_ADDRESS = "0x5Fe240e87900bE26B64887754b2d4177b949987f";
const BSC_MAINNET = 56;
const SOLT_DECIMALS = 18;
const ADMIN_WALLET = "0xC30050aBe984c3B3929822E3BbF33fbBE6b3C423";

const FACTORY_ABI = [
  {"inputs":[],"name":"totalTokens","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},
  {"inputs":[],"name":"deploymentFee","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},
  {"inputs":[{"internalType":"uint256","name":"_newFee","type":"uint256"}],"name":"setFee","outputs":[],"stateMutability":"nonpayable","type":"function"},
  {"inputs":[],"name":"withdraw","outputs":[],"stateMutability":"nonpayable","type":"function"}
];

const AdminDashboard = () => {
  const { address, isConnected } = useAccount();
  const chainId = useChainId();
  const [newFee, setNewFee] = useState("");
  const [activeTxs, setActiveTxs] = useState([]);
  const [tokens, setTokens] = useState([]); // Supabase Tokens State

  const { writeContractAsync } = useWriteContract();

  // 1. DATA READING (Blockchain)
  const { data: totalTokens, refetch: refetchTokens } = useReadContract({
    address: FACTORY_ADDRESS, abi: FACTORY_ABI, functionName: 'totalTokens',
  });

  const { data: currentFee, refetch: refetchFee } = useReadContract({
    address: FACTORY_ADDRESS, abi: FACTORY_ABI, functionName: 'deploymentFee',
  });

  // 2. DATA FETCHING (Supabase)
  const fetchTokens = async () => {
    const { data, error } = await supabase
      .from('deployed_tokens')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) console.error("Supabase Error:", error.message);
    else setTokens(data || []);
  };

  useEffect(() => {
    if (isConnected) {
      fetchTokens();
    }
  }, [isConnected]);

  // 3. ACTION HANDLERS
  const handleAction = async (type, fnName, args = []) => {
    try {
      const hash = await writeContractAsync({
        address: FACTORY_ADDRESS,
        abi: FACTORY_ABI,
        functionName: fnName,
        args: args,
      });

      setActiveTxs(prev => [{ hash, type, status: 'pending' }, ...prev]);
    } catch (e) {
      console.error(e);
      alert(e.shortMessage || "Transaction Failed ❌");
    }
  };

  // 4. SECURITY & NETWORK CHECKS
  if (chainId !== BSC_MAINNET) return <div style={errStyle}>⚠️ Switch to BSC Mainnet</div>;
  if (!isConnected || address?.toLowerCase() !== ADMIN_WALLET.toLowerCase()) {
    return <div style={errStyle}>🛑 ACCESS DENIED: Owner Only</div>;
  }

  return (
    <div style={{ padding: '40px', color: 'white', background: '#050505', minHeight: '100vh', fontFamily: 'sans-serif' }}>
      <h1 style={{ borderBottom: '2px solid #FFD700', paddingBottom: '10px' }}>🛡️ SOLT COMMAND CENTER</h1>

      {/* Stats Section */}
      <div style={gridStyle}>
        <div style={cardStyle}>
          <h3 style={labelStyle}>TOTAL TOKENS (ON-CHAIN)</h3>
          <p style={valStyle}>{totalTokens ? totalTokens.toString() : "0"}</p>
        </div>
        <div style={cardStyle}>
          <h3 style={labelStyle}>CURRENT FEE</h3>
          <p style={valStyle}>
            {currentFee ? formatUnits(currentFee, SOLT_DECIMALS) : "6000"} SOLT
          </p>
        </div>
      </div>

      {/* Admin Controls Section */}
      <div style={controlBox}>
        <h3 style={{marginTop: 0, color: '#FFD700'}}>Management Actions</h3>
        <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap', marginBottom: '20px' }}>
          <div style={{display: 'flex', gap: '10px'}}>
            <input
              type="number"
              placeholder="New Fee"
              value={newFee}
              onChange={(e) => setNewFee(e.target.value)}
              style={inputStyle}
            />
            <button
              onClick={() => handleAction('Update Fee', 'setFee', [parseUnits(newFee, SOLT_DECIMALS)])}
              style={btnStyle}
            >Update Fee</button>
          </div>
          <button
            onClick={() => { if(window.confirm("Withdraw all?")) handleAction('Withdraw', 'withdraw') }}
            style={{...btnStyle, background: '#ff4444', color: 'white'}}
          >Withdraw Revenue</button>
        </div>

        {/* Active Transactions List */}
        {activeTxs.length > 0 && (
          <div style={{ marginTop: '20px' }}>
            <h4 style={{color: '#888', marginBottom: '10px'}}>Live Transaction Status</h4>
            {activeTxs.map((tx) => (
              <TxRow
                key={tx.hash}
                tx={tx}
                onComplete={() => { refetchFee(); refetchTokens(); fetchTokens(); }}
              />
            ))}
          </div>
        )}
      </div>

      {/* Supabase Token Table Section */}
      <div style={{marginTop: '40px', background: '#111', padding: '25px', borderRadius: '15px', border: '1px solid #222'}}>
        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
           <h3 style={{margin: 0, color: '#FFD700'}}>Recently Deployed Tokens (Database)</h3>
           <button onClick={fetchTokens} style={{background: 'none', border: '1px solid #444', color: '#aaa', cursor: 'pointer', padding: '5px 10px', borderRadius: '5px'}}>Refresh List</button>
        </div>
        
        <div style={{overflowX: 'auto'}}>
          <table style={{width: '100%', borderCollapse: 'collapse', marginTop: '20px', textAlign: 'left'}}>
            <thead style={{borderBottom: '2px solid #222', color: '#888', fontSize: '14px'}}>
              <tr>
                <th style={{padding: '12px'}}>Token Name</th>
                <th style={{padding: '12px'}}>Address</th>
                <th style={{padding: '12px'}}>Owner</th>
                <th style={{padding: '12px'}}>Date</th>
              </tr>
            </thead>
            <tbody style={{fontSize: '14px'}}>
              {tokens.length > 0 ? tokens.map(t => (
                <tr key={t.id} style={{borderBottom: '1px solid #1a1a1a'}}>
                  <td style={{padding: '12px'}}>{t.token_name} <span style={{color: '#555'}}>({t.token_symbol})</span></td>
                  <td style={{padding: '12px'}}>
                    <a href={`https://bscscan.com/address/${t.token_address}`} target="_blank" rel="noreferrer" style={{color: '#FFD700', textDecoration: 'none'}}>
                      {t.token_address.slice(0,6)}...{t.token_address.slice(-4)}
                    </a>
                  </td>
                  <td style={{padding: '12px', color: '#aaa'}}>{t.owner_address.slice(0,6)}...</td>
                  <td style={{padding: '12px', color: '#666'}}>{new Date(t.created_at).toLocaleDateString()}</td>
                </tr>
              )) : (
                <tr><td colSpan="4" style={{padding: '20px', textAlign: 'center', color: '#444'}}>No tokens found in database.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// --- Transaction Row Component ---
const TxRow = ({ tx, onComplete }) => {
  const { isLoading, isSuccess, isError } = useWaitForTransactionReceipt({ hash: tx.hash });

  useEffect(() => {
    if (isSuccess) onComplete();
  }, [isSuccess]);

  return (
    <div style={statusBox}>
      <span style={{fontWeight: 'bold', marginRight: '10px'}}>{tx.type}:</span>
      <a href={`https://bscscan.com/tx/${tx.hash}`} target="_blank" rel="noreferrer" style={{color: '#FFD700', marginRight: '10px'}}>
        {tx.hash.slice(0, 10)}...{tx.hash.slice(-4)}
      </a>
      {isLoading && <span style={{color: '#aaa'}}>⏳ Processing...</span>}
      {isSuccess && <span style={{color: '#4ade80'}}>✅ Success</span>}
      {isError && <span style={{color: '#ff4444'}}>❌ Reverted</span>}
    </div>
  );
};

// --- Styles ---
const gridStyle = { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px', margin: '30px 0' };
const cardStyle = { background: '#111', padding: '25px', borderRadius: '15px', border: '1px solid #222', boxShadow: '0 4px 20px rgba(0,0,0,0.4)' };
const labelStyle = { color: '#888', fontSize: '12px', margin: '0 0 10px 0', letterSpacing: '1px' };
const valStyle = { fontSize: '32px', color: '#FFD700', fontWeight: 'bold', margin: 0 };
const controlBox = { background: '#111', padding: '30px', borderRadius: '15px', border: '1px solid #333' };
const inputStyle = { padding: '12px', borderRadius: '8px', border: '1px solid #444', background: '#000', color: 'white', width: '150px', outline: 'none' };
const btnStyle = { padding: '12px 25px', background: '#FFD700', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', color: 'black', transition: '0.2s' };
const statusBox = { marginTop: '10px', padding: '12px', borderRadius: '8px', background: '#000', fontSize: '13px', border: '1px solid #222', display: 'flex', alignItems: 'center' };
const errStyle = { height: '80vh', display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '22px', color: '#ff4444', fontWeight: 'bold', background: '#050505' };

export default AdminDashboard;