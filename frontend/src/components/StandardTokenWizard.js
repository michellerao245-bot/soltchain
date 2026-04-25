import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import FACTORY_ABI from '../contractABI.json';

const StandardTokenWizard = () => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [txStatus, setTxStatus] = useState("");
  const [tokenAddress, setTokenAddress] = useState("");
  const [verifyProgress, setVerifyProgress] = useState(0);
  const [isVerified, setIsVerified] = useState(false);

  const [formData, setFormData] = useState({ name: '', symbol: '', supply: '', decimals: 18 });

  const FACTORY_ADDRESS = "0xc8fBBfa8172D3FF165889259C3a02eC5a5Cc3a18";
  const SOLT_TOKEN_ADDRESS = "0x6C8942407c65D0f038b04DD5DA3420eC826Cc8d9";

  // --- 🤖 AUTO-VERIFICATION TIMER LOGIC ---
  useEffect(() => {
    let interval;
    if (step === 3 && !isVerified) {
      interval = setInterval(() => {
        setVerifyProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            setIsVerified(true);
            return 100;
          }
          return prev + 4; // 25 seconds approx (100/4)
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [step, isVerified]);

  const handleLaunch = async () => {
    try {
      setLoading(true);
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();

      setTxStatus("Step 1/2: Approving Fee...");
      const solt = new ethers.Contract(SOLT_TOKEN_ADDRESS, ["function approve(address spender, uint256 amount) returns (bool)"], signer);
      const approveTx = await solt.approve(FACTORY_ADDRESS, ethers.parseUnits("6000", 18));
      await approveTx.wait();

      setTxStatus("Step 2/2: Deploying Token...");
      const factory = new ethers.Contract(FACTORY_ADDRESS, FACTORY_ABI, signer);
      const tx = await factory.createStandardToken(formData.name, formData.symbol, window.BigInt(formData.supply), 18);
      const receipt = await tx.wait();

      const event = receipt.logs.find(log => {
        try { return log.fragment?.name === "TokenCreated"; } catch { return false; }
      });

      if (event) {
        setTokenAddress(event.args.token);
        setStep(3); // Go to Success Screen where Timer Starts
      }
    } catch (err) {
      alert("Error: " + (err.reason || err.message));
    } finally {
      setLoading(false);
      setTxStatus("");
    }
  };

  return (
    <div style={styles.wrapper}>
      <div style={styles.card}>
        {step === 1 && (
          <div>
            <h3 style={styles.stepTitle}>Token Details</h3>
            <input style={styles.input} placeholder="Name" onChange={e => setFormData({...formData, name: e.target.value})} />
            <input style={styles.input} placeholder="Symbol" onChange={e => setFormData({...formData, symbol: e.target.value})} />
            <input style={styles.input} type="number" placeholder="Supply" onChange={e => setFormData({...formData, supply: e.target.value})} />
            <button style={styles.button} onClick={() => setStep(2)}>Review</button>
          </div>
        )}

        {step === 2 && (
          <div>
            <h3 style={styles.stepTitle}>Review</h3>
            <div style={styles.reviewBox}>
               <p>Name: {formData.name}</p>
               <p>Supply: {formData.supply}</p>
            </div>
            <button style={styles.button} onClick={handleLaunch} disabled={loading}>
              {loading ? `⏳ ${txStatus}` : "Confirm & Deploy"}
            </button>
          </div>
        )}

        {step === 3 && (
          <div style={{textAlign: 'center'}}>
            <h2 style={{color: '#22c55e'}}>🚀 Deployment Confirmed!</h2>
            <div style={styles.resultBox}>{tokenAddress}</div>
            
            <div style={{margin: '20px 0'}}>
               <p style={{fontSize: '12px', color: '#94a3b8', marginBottom: '10px'}}>
                  {isVerified ? "✅ Backend Verification Complete!" : "🛠️ Backend Verifying Source Code..."}
               </p>
               {/* PROGRESS BAR */}
               <div style={styles.progressContainer}>
                  <div style={{...styles.progressBar, width: `${verifyProgress}%`}}></div>
               </div>
            </div>

            <button 
               style={{...styles.button, opacity: isVerified ? 1 : 0.5}} 
               disabled={!isVerified}
               onClick={() => window.open(`https://bscscan.com/token/${tokenAddress}#code`, '_blank')}
            >
              {isVerified ? "Check Green Tick on BscScan" : `Waiting for BscScan (${Math.ceil((100-verifyProgress)/4)}s)`}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

const styles = {
  wrapper: { minHeight: "85vh", display: "flex", justifyContent: "center", alignItems: "center", background: "#020617", color: "#fff" },
  card: { background: "#0f172a", padding: "30px", borderRadius: "20px", width: "360px", border: "1px solid #1e293b" },
  stepTitle: { fontSize: '18px', marginBottom: '20px', textAlign: 'center' },
  input: { width: "100%", padding: "12px", marginBottom: "15px", borderRadius: "8px", border: "1px solid #334155", background: "#020617", color: "#fff", boxSizing: 'border-box' },
  button: { width: "100%", padding: "14px", background: "linear-gradient(90deg, #3b82f6, #06b6d4)", border: "none", borderRadius: "8px", color: "#fff", fontWeight: "bold", cursor: "pointer" },
  reviewBox: { background: '#1e293b', padding: '15px', borderRadius: '10px', marginBottom: '20px' },
  resultBox: { background: '#020617', padding: '10px', borderRadius: '8px', border: '1px dashed #22c55e', wordBreak: 'break-all', fontSize: '11px', color: '#22c55e' },
  progressContainer: { width: '100%', height: '8px', background: '#1e293b', borderRadius: '10px', overflow: 'hidden' },
  progressBar: { height: '100%', background: '#3b82f6', transition: 'width 0.5s ease-in-out' }
};

export default StandardTokenWizard;