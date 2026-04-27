/* eslint-disable no-undef */
import React, { useState, useEffect } from 'react';
import { useWriteContract, useAccount, useWaitForTransactionReceipt } from 'wagmi';
import { parseUnits, parseAbi, decodeEventLog } from 'viem';
import FACTORY_ABI from '../contractABI.json';

const StandardTokenWizard = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({ name: '', symbol: '', supply: '' });
  const [approveHash, setApproveHash] = useState(undefined);
  const [deployHash, setDeployHash] = useState(undefined);
  const [deployedAddress, setDeployedAddress] = useState("");

  const FACTORY_ADDRESS = "0xc8fBBfa8172D3FF165889259C3a02eC5a5Cc3a18";
  const SOLT_TOKEN_ADDRESS = "0x6C8942407c65D0f038b04DD5DA3420eC826Cc8d9";

  const { isConnected } = useAccount();
  const { writeContractAsync } = useWriteContract();

  const { isSuccess: isApproveConfirmed, isLoading: isApproveWaiting } = useWaitForTransactionReceipt({ hash: approveHash });
  const { isSuccess: isDeployConfirmed, data: deployReceipt, isLoading: isDeployWaiting } = useWaitForTransactionReceipt({ hash: deployHash });

  // ==========================================
  // HARDCORE ADDRESS FETCHING LOGIC
  // ==========================================
  useEffect(() => {
    if (isDeployConfirmed && deployReceipt) {
      console.log("Full Receipt:", deployReceipt); // Debugging ke liye
      
      try {
        // Factory contract ke logs ko filter karo
        const factoryLog = deployReceipt.logs.find(
          (log) => log.address.toLowerCase() === FACTORY_ADDRESS.toLowerCase()
        );

        if (factoryLog) {
          const decoded = decodeEventLog({
            abi: FACTORY_ABI,
            data: factoryLog.data,
            topics: factoryLog.topics,
          });

          // Address nikalne ke teen tarike (jo bhi kaam kar jaye)
          const finalAddr = decoded?.args?.[0] || decoded?.args?.token || decoded?.args?.tokenAddress;
          
          if (finalAddr) {
            setDeployedAddress(finalAddr);
            setStep(3);
          }
        } else {
          // Agar direct event nahi mila, toh receipt mein se last log try karo
          const lastLog = deployReceipt.logs[deployReceipt.logs.length - 1];
          if (lastLog && lastLog.topics[1]) {
            // Kabhi-kabhi address topics mein encoded hota hai
            const rawAddr = "0x" + lastLog.topics[1].slice(26); 
            setDeployedAddress(rawAddr);
            setStep(3);
          }
        }
      } catch (err) {
        console.error("Decode Error:", err);
        setStep(3); // Error aaye tab bhi step 3 par jao taaki user fas na jaye
      }
    }
  }, [isDeployConfirmed, deployReceipt]);

  const handleApprove = async () => {
    if (!isConnected) return alert("Wallet connect karein");
    try {
      const hash = await writeContractAsync({
        address: SOLT_TOKEN_ADDRESS,
        abi: parseAbi(["function approve(address spender, uint256 amount) returns (bool)"]),
        functionName: 'approve',
        args: [FACTORY_ADDRESS, parseUnits("6000", 18)],
      });
      setApproveHash(hash);
    } catch (e) { console.error(e); }
  };

  const handleDeploy = async () => {
    try {
      const hash = await writeContractAsync({
        address: FACTORY_ADDRESS,
        abi: FACTORY_ABI,
        functionName: 'createStandardToken',
        args: [formData.name, formData.symbol, BigInt(formData.supply || "0"), 18],
      });
      setDeployHash(hash);
    } catch (e) { console.error(e); }
  };

  return (
    <div style={styles.wrapper}>
      <div style={styles.card}>
        {step === 1 && (
          <div>
            <h2 style={styles.title}>Standard Token</h2>
            <input style={styles.input} placeholder="Name" onChange={e => setFormData({...formData, name: e.target.value})} />
            <input style={styles.input} placeholder="Symbol" onChange={e => setFormData({...formData, symbol: e.target.value})} />
            <input style={styles.input} type="number" placeholder="Supply" onChange={e => setFormData({...formData, supply: e.target.value})} />
            <button style={styles.button} onClick={() => setStep(2)}>Review Details</button>
          </div>
        )}

        {step === 2 && (
          <div>
            <h3 style={styles.title}>Confirm Deploy</h3>
            <div style={styles.info}>
              <p>Token: {formData.name} ({formData.symbol})</p>
              <p>Supply: {formData.supply}</p>
            </div>
            <button 
              style={{...styles.button, background: isApproveConfirmed ? '#10b981' : 'linear-gradient(to right, #fbbf24, #d97706)'}}
              onClick={handleApprove}
              disabled={isApproveConfirmed || isApproveWaiting}
            >
              {isApproveWaiting ? "Confirming..." : isApproveConfirmed ? "Approved" : "1. Approve SOLT"}
            </button>
            <div style={{marginTop: '10px'}}></div>
            <button 
              style={{...styles.button, opacity: isApproveConfirmed ? 1 : 0.5}}
              onClick={handleDeploy}
              disabled={!isApproveConfirmed || isDeployWaiting}
            >
              {isDeployWaiting ? "Deploying..." : "2. Deploy Token"}
            </button>
          </div>
        )}

        {step === 3 && (
          <div style={{textAlign: 'center'}}>
            <h2 style={{color: '#10b981'}}>Success!</h2>
            <div style={styles.addressBox}>
              <p style={{fontSize: '12px', color: '#94a3b8'}}>Contract Address:</p>
              {deployedAddress ? (
                <p style={styles.addressText}>{deployedAddress}</p>
              ) : (
                <p style={{fontSize: '11px'}}>Address loading from blockchain...</p>
              )}
            </div>
            <button style={styles.button} onClick={() => window.location.reload()}>Create New</button>
          </div>
        )}
      </div>
    </div>
  );
};

const styles = {
  wrapper: { minHeight: '80vh', display: 'flex', justifyContent: 'center', alignItems: 'center', background: '#020617', padding: '20px' },
  card: { background: '#0f172a', padding: '30px', borderRadius: '20px', width: '100%', maxWidth: '380px', border: '1px solid #1e293b', color: '#fff' },
  title: { textAlign: 'center', marginBottom: '20px' },
  input: { width: '100%', padding: '12px', marginBottom: '15px', borderRadius: '8px', border: '1px solid #334155', background: '#020617', color: '#fff' },
  button: { width: '100%', padding: '15px', borderRadius: '10px', border: 'none', background: 'linear-gradient(to right, #fbbf24, #d97706)', color: '#000', fontWeight: 'bold', cursor: 'pointer' },
  info: { background: '#1e293b', padding: '15px', borderRadius: '10px', marginBottom: '15px', fontSize: '14px' },
  addressBox: { background: '#020617', padding: '15px', borderRadius: '10px', margin: '20px 0', border: '1px dashed #334155' },
  addressText: { color: '#fbbf24', fontSize: '13px', wordBreak: 'break-all', marginTop: '5px', fontWeight: 'bold' }
};

export default StandardTokenWizard;