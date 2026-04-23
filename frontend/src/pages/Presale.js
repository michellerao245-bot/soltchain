import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import './Presale.css';

const PRESALE_ADDRESS = "0xD4Ca789015c7C5fe19E1cF947C09dbA2b0520b3E";
const PRESALE_ABI = [
    "function currentStage() public view returns (uint256)",
    "function stages(uint256) public view returns (uint256 priceUSD, uint256 supply, uint256 sold)",
    "function buyTokens(address _referrer) public payable"
];

const Presale = () => {
    const [amountBNB, setAmountBNB] = useState("");
    const [status, setStatus] = useState("");
    const [stageInfo, setStageInfo] = useState({ stage: "1", price: "0.030", inrPrice: "2.52" });

    // 1. Data Fetching (Using Public Provider)
    useEffect(() => {
        const fetchData = async () => {
            try {
                const provider = new ethers.JsonRpcProvider("https://bsc-dataseed.binance.org/");
                const contract = new ethers.Contract(PRESALE_ADDRESS, PRESALE_ABI, provider);
                const stageIndex = await contract.currentStage();
                const stageDetails = await contract.stages(stageIndex);
                const usdPrice = ethers.formatUnits(stageDetails.priceUSD, 18);
                setStageInfo({
                    stage: (Number(stageIndex) + 1).toString(),
                    price: parseFloat(usdPrice).toFixed(3),
                    inrPrice: (parseFloat(usdPrice) * 84).toFixed(2)
                });
            } catch (err) { console.error(err); }
        };
        fetchData();
    }, []);

    // 2. The "Bulletproof" Buy Function
    const handleBuy = async () => {
        if (typeof window.ethereum === 'undefined') {
            alert("Please Install MetaMask First!");
            return;
        }

        try {
            setStatus("Please Wait For MetaMask Popup .....");

            // --- CRITICAL STEP: Ye line har project (Standard/Burn/Fee) ke liye popup layegi ---
            await window.ethereum.request({
                method: 'wallet_requestPermissions',
                params: [{ eth_accounts: {} }]
            });

            // Ab naye accounts ki request
            const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
            console.log("Active Account:", accounts[0]);

            const provider = new ethers.BrowserProvider(window.ethereum);
            const signer = await provider.getSigner();
            const contract = new ethers.Contract(PRESALE_ADDRESS, PRESALE_ABI, signer);

            const referrer = "0x0000000000000000000000000000000000000000";
            const val = ethers.parseEther(amountBNB);

            setStatus("Please Confirm Transaction.....");

            const tx = await contract.buyTokens(referrer, { value: val });

            setStatus("Confirming on Blockchain...");
            await tx.wait();
            
           setStatus("Successfully! Tokens Purchased 🚀");
           alert("Congratulations! SOLT tokens have been successfully received in your wallet.");
           setAmountBNB("");

        } catch (err) {
            console.error("Final Error:", err);
            if (err.code === 4001) {
                setStatus("Transaction cancel kar di gayi.");
            } else {
                setStatus("Error: " + (err.reason || "Wallet issue, please try again."));
            }
        }
    };

    return (
        <div className="presale-container">
            <div className="presale-card">
                <h2>Soltcoin (SOLT) Presale</h2>
                <div className="stage-badge">Live: Stage {stageInfo.stage}</div>
                <div className="price-box">
                    <p>Current Price: <strong>${stageInfo.price}</strong></p>
                    <p className="inr-text">≈ ₹{stageInfo.inrPrice}</p>
                </div>
                <div className="input-group">
                    <label>Amount in BNB</label>
                    <input 
                        type="number" 
                        step="0.0001" 
                        value={amountBNB} 
                        onChange={(e) => setAmountBNB(e.target.value)} 
                        placeholder="e.g. 0.002" 
                    />
                </div>
                <button className="buy-btn" onClick={handleBuy}>Buy SOLT Tokens</button>
                {status && <p className="status-msg" style={{color: '#f59e0b', marginTop: '10px'}}>{status}</p>}
            </div>
        </div>
    );
};

export default Presale;