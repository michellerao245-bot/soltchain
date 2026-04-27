/* eslint-disable no-undef */
import React, { useState, useEffect } from 'react';
import { useWriteContract, useAccount, useWaitForTransactionReceipt } from 'wagmi';
import { parseUnits, parseAbi, decodeEventLog } from 'viem';
import FACTORY_ABI from '../contractABI.json';

const BurnToken = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({ name: '', symbol: '', supply: '', decimals: 18 });
  const [approveHash, setApproveHash] = useState(undefined);
  const [deployHash, setDeployHash] = useState(undefined);
  const [deployedAddress, setDeployedAddress] = useState("");

  const FACTORY_ADDRESS = "0xc8fBBfa8172D3FF165889259C3a02eC5a5Cc3a18";
  const SOLT_TOKEN_ADDRESS = "0x6C8942407c65D0f038b04DD5DA3420eC826Cc8d9";

  const { isConnected, address: userAddress } = useAccount();
  const { writeContractAsync } = useWriteContract();

  const { isSuccess: isApproveConfirmed, isLoading: isApproveWaiting } = useWaitForTransactionReceipt({ hash: approveHash });
  const { isSuccess: isDeployConfirmed, data: deployReceipt, isLoading: isDeployWaiting } = useWaitForTransactionReceipt({ hash: deployHash });

  // Address Fetching Logic
  useEffect(() => {
    if (isDeployConfirmed && deployReceipt) {
      setStep(3);
      try {
        const log = deployReceipt.logs.find(l => l.address.toLowerCase() === FACTORY_ADDRESS.toLowerCase());
        if (log) {
          const decoded = decodeEventLog({
            abi: FACTORY_ABI,
            data: log.data,
            topics: log.topics,
          });
          const addr = decoded?.args?.[0] || decoded?.args?.token;
          if (addr) setDeployedAddress(addr);
        }
      } catch (err) { console.error("Address fetch error:", err); }
    }
  }, [isDeployConfirmed, deployReceipt]);

  const handleApprove = async () => {
    if (!isConnected) return alert("Bhai, pehle wallet connect karo!");
    try {
      const hash = await writeContractAsync({
        address: SOLT_TOKEN_ADDRESS,
        abi: parseAbi(["function approve(address spender, uint256 amount) returns (bool)"]),
        functionName: 'approve',
        args: [FACTORY_ADDRESS, parseUnits("6000", 18)],
      });
      setApproveHash(hash);
    } catch (err) { alert("Approve cancelled"); }
  };

  const handleDeploy = async () => {
    if (!isConnected) return alert("Wallet disconnected!");
    try {
      const hash = await writeContractAsync({
        address: FACTORY_ADDRESS,
        abi: FACTORY_ABI,
        functionName: 'createBurnableToken',
        args: [
          formData.name,
          formData.symbol,
          BigInt(formData.supply || "0"),
          Number(formData.decimals)
        ],
      });
      setDeployHash(hash);
    } catch (err) { alert("Deployment error!"); }
  };

  return (
    <div style={styles.wrapper}>
      <div style={styles.card}>
        {step === 1 && (
          <div>
            <h3 style={styles.title}>🔥 Burnable Token</h3>
            <input style={styles.input} placeholder="Token Name" onChange={e => setFormData({...formData, name: e.target.value})} />
            <input style={styles.input} placeholder="Symbol" onChange={e => setFormData({...formData, symbol: e.target.value})} />
            <input style={styles.input} type="number" placeholder="Total Supply" onChange={e => setFormData({...formData, supply: e.target.value})} />
            <button style={styles.button} onClick={() => setStep(2)}>Next</button>
          </div>
        )}

        {step === 2 && (
          <div>
            <h3 style={styles.title}>Review & Launch</h3>
            <div style={styles.reviewBox}>
               <p>Name: {formData.name}</p>
               <p>Supply: {formData.supply}</p>
               <p style={{color: '#FF4500'}}>Type: Burnable</p>
               <p style={{color: '#FFD700', marginTop: '10px'}}>Fee: 6000 SOLT</p>
            </div>
            
            <button 
              style={{...styles.button, background: isApproveConfirmed ? '#16a34a' : '#f97316'}} 
              onClick={handleApprove} 
              disabled={isApproveConfirmed || isApproveWaiting}
            >
              {isApproveWaiting ? "⏳ Approving..." : isApproveConfirmed ? "✅ Approved" : "1. Approve SOLT"}
            </button>

            <div style={{height: '10px'}}></div>

            <button 
              style={{...styles.button, opacity: isApproveConfirmed ? 1 : 0.5}} 
              onClick={handleDeploy} 
              disabled={!isApproveConfirmed || isDeployWaiting}
            >
              {isDeployWaiting ? "⏳ Deploying..." : "2. Deploy Token"}
            </button>
          </div>
        )}

        {step === 3 && (
          <div style={{textAlign: 'center'}}>
            <h2 style={{color: '#22c55e'}}>🚀 Burn Token Live!</h2>
            {deployedAddress && (
              <div style={styles.addressBox}>
                <p style={{fontSize: '11px', color: '#94a3b8'}}>Contract Address:</p>
                <code style={{color: '#FFD700', fontSize: '12px', wordBreak: 'break-all'}}>{deployedAddress}</code>
              </div>
            )}
            <button style={styles.button} onClick={() => window.location.reload()}>Create Another</button>
          </div>
        )}
      </div>
    </div>
  );
};

const styles = {
  wrapper: { minHeight: "85vh", display: "flex", justifyContent: "center", alignItems: "center", background: "#020617", color: "#fff", padding: '20px' },
  card: { background: "#0f172a", padding: "25px", borderRadius: "20px", width: "100%", maxWidth: "360px", border: "1px solid #1e293b" },
  title: { textAlign: 'center', marginBottom: '20px' },
  input: { width: "100%", padding: "12px", marginBottom: "12px", borderRadius: "8px", border: "1px solid #334155", background: "#020617", color: "#fff", boxSizing: 'border-box' },
  button: { width: "100%", padding: "14px", background: "#f97316", border: "none", borderRadius: "8px", color: "#fff", fontWeight: "bold", cursor: "pointer" },
  reviewBox: { background: '#1e293b', padding: '15px', borderRadius: '10px', marginBottom: '20px' },
  addressBox: { background: '#020617', padding: '15px', borderRadius: '10px', margin: '20px 0', border: '1px dashed #334155', wordBreak: 'break-all' }
};

export default BurnToken;