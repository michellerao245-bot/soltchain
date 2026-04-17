import React, { useState, useEffect } from 'react'; 
import { useNavigate } from 'react-router-dom'; 
import SoltcoinSwap from '../components/SoltcoinSwap'; 
import { supabase } from '../supabaseClient'; 
import { useAccount } from 'wagmi'; // 👈 Ye add karo wallet address pakadne ke liye

const Dashboard = () => { 
  const { address: userAddress, isConnected } = useAccount(); // 👈 Direct address yahan se lo
  const navigate = useNavigate(); 
  const [referralLogs, setReferralLogs] = useState([]); 
  const [copyText, setCopyText] = useState("Copy Link"); 
 
  useEffect(() => { 
    const fetchHistory = async () => { 
      if (!userAddress) return; 
      const { data, error } = await supabase 
        .from('refill_logs') 
        .select('*') 
        .eq('user_address', userAddress) 
        .order('created_at', { ascending: false }); 
 
      if (!error) setReferralLogs(data); 
    }; 
    fetchHistory(); 
  }, [userAddress]); 
 
  const handleCopy = () => { 
    if(!userAddress) return;
    // Pura link copy karne ke liye substring mat use karna copy mein
    const link = `${window.location.origin}/?ref=${userAddress}`; 
    navigator.clipboard.writeText(link); 
    setCopyText("Copied! ✅"); 
    setTimeout(() => setCopyText("Copy Link"), 2000); 
  }; 
 
  return ( 
    <div className="home-dashboard" style={{ width: '100%' }}> 
      <div style={{ textAlign: 'center', marginBottom: '40px' }}> 
        <h1 style={{ color: 'white', fontSize: '2.5rem', fontWeight: '800' }}>Welcome to SoltDex</h1> 
        <p style={{ color: '#8b949e', fontSize: '1.1rem' }}>Trade Soltcoin (SOLT) safely on PancakeSwap</p> 
      </div> 
 
      <div style={{  
        background: 'linear-gradient(145deg, #1e1e3f, #11112b)',  
        padding: '25px',  
        borderRadius: '15px',  
        border: '1px solid #ffd700',  
        marginBottom: '40px', 
        textAlign: 'center'  
      }}> 
        <h2 style={{ color: '#ffd700', marginBottom: '10px' }}>📢 Earn 5% Referral Rewards</h2> 
        <p style={{ color: '#ccc', marginBottom: '20px' }}>Invite friends and get SOLT tokens instantly on their purchase.</p> 
         
        <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', flexWrap: 'wrap' }}> 
          <input  
            readOnly  
            value={isConnected ? `${window.location.origin}/?ref=${userAddress.substring(0,10)}...` : "Connect Wallet to get link"}  
            style={{  
              background: '#0d1117', border: '1px solid #30363d', color: '#fff',  
              padding: '10px 15px', borderRadius: '8px', width: '300px'  
            }} 
          /> 
          <button  
            onClick={handleCopy} 
            disabled={!isConnected} 
            style={{  
              background: isConnected ? '#ffd700' : '#444', color: '#000', fontWeight: 'bold',  
              padding: '10px 25px', borderRadius: '8px', cursor: isConnected ? 'pointer' : 'not-allowed', border: 'none'  
            }} 
          > 
            {copyText} 
          </button> 
        </div> 

        {/* History Table niche waali same rahegi... */}
      </div>
      {/* Baki ka pura Dashboard UI niche... */}
    </div>
  );
};

export default Dashboard;