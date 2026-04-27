import React, { useState, useEffect } from 'react';  
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';              
             
// --- RAINBOWKIT & WAGMI IMPORTS ---
import '@rainbow-me/rainbowkit/styles.css';
import { getDefaultConfig, RainbowKitProvider, darkTheme } from '@rainbow-me/rainbowkit';
import { WagmiProvider } from 'wagmi';
import { bsc } from 'wagmi/chains';
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";

// Layout Components              
import Sidebar from './components/Sidebar';              
import { ConnectButton } from '@rainbow-me/rainbowkit';         
    
// Pages (Saare Imports Fix kar diye hain)
import Home from './pages/Home';              
import Dashboard from './pages/Dashboard';        
import ViewSales from './pages/ViewSales';        
import ViewTokenLockers from './pages/ViewTokenLockers';        
import ViewLPLockers from './pages/ViewLPLockers';        
import Leaderboard from './pages/Leaderboard';        
import Soltswap from './pages/Soltswap';       
import Create from './pages/Create';           
import CreateToken from './pages/SoltMint';           
import StandardTokenWizard from './components/StandardTokenWizard';  
import BurnToken from './pages/BurnToken';          
import FeeToken from './pages/FeeToken';            
import CreateSale from './pages/CreateSale';           
import CreateLock from './pages/CreateLock';           
import ScamDetection from './pages/ScamDetection';       
import WhaleTracking from './pages/WhaleTracking';       
import SnipingSignals from './pages/SnipingSignals';       
import MarketsPage from './pages/MarketsPage';       
import Presale from './pages/Presale';             
import './App.css';              

// 1. Setup Query Client
const queryClient = new QueryClient();

// 2. RainbowKit Config (Dx.app jaisa mobile flow)
const config = getDefaultConfig({
  appName: 'SoltDex',
  projectId: 'cf3a0865a89faf1b05a2a0779195ba6d', // 👈 Bhai yahan apni Reown Project ID dalo
  chains: [bsc],
  ssr: false, 
});
             
function App() {              
  const [isOpen, setIsOpen] = useState(true);   
  const [userAccount, setUserAccount] = useState(null);   
   
  const toggleSidebar = () => setIsOpen(!isOpen);              
  const sidebarWidth = isOpen ? '260px' : '80px';         
   
  useEffect(() => {   
    const urlParams = new URLSearchParams(window.location.search);   
    const ref = urlParams.get('ref');   
    if (ref) {   
      localStorage.setItem('soltdex_referrer', ref);   
    }   
  }, []);   
        
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider 
          theme={darkTheme({
            accentColor: '#FFD700', // Regal Gold
            accentColorForeground: 'black',
            borderRadius: 'medium',
          })}
          modalSize="compact" // Dx.app jaisa chota popup
        >
          <Router>              
            <div className="app-layout">              
              <Sidebar isOpen={isOpen} toggleSidebar={toggleSidebar} />              
                            
              <main              
                className="main-area"              
                style={{              
                  marginLeft: sidebarWidth,              
                  transition: 'all 0.3s ease',             
                  width: `calc(100% - ${sidebarWidth})`,         
                  display: 'flex',           
                  flexDirection: 'column',           
                  minHeight: '100vh',        
                  overflowX: 'hidden'         
                }}             
              >              
                <header className="nav-container">                
                  <div className="nav-right" style={{ padding: '15px' }}>           
                    {/* RainbowKit Connect Button */}
                    <ConnectButton 
                      showBalance={false} 
                      chainStatus="icon" 
                      accountStatus="address"
                    />           
                  </div>           
                </header>                
                      
                <div className="content-wrapper">     
                  <div className="main-content">                
                    <Routes>                
                      <Route path="/" element={<Home />} />                
                      <Route path="/dashboard" element={<Dashboard userAddress={userAccount} />} />          
                      <Route path="/view-sales" element={<ViewSales />} />          
                      <Route path="/view-token-lockers" element={<ViewTokenLockers />} />          
                      <Route path="/view-lp-lockers" element={<ViewLPLockers />} />          
                      <Route path="/leaderboard" element={<Leaderboard />} />          
                      <Route path="/scam-detection" element={<ScamDetection />} />        
                      <Route path="/whale-tracking" element={<WhaleTracking />} />        
                      <Route path="/token-analytics" element={<WhaleTracking />} />        
                      <Route path="/sniping-signals" element={<SnipingSignals />} />        
                      <Route path="/markets" element={<MarketsPage />} />        
                      <Route path="/presale" element={<Presale />} />        
                      <Route path="/soltswap" element={<Soltswap />} />          
                      <Route path="/create" element={<Create />} />              
                      <Route path="/create-tokens" element={<CreateToken />} />              
                      <Route path="/standard-token" element={<StandardTokenWizard />} />              
                      <Route path="/burn-token" element={<BurnToken />} />              
                      <Route path="/fee-token" element={<FeeToken />} />              
                      <Route path="/create-sales" element={<CreateSale />} />              
                      <Route path="/create-locks" element={<CreateLock />} />              
                    </Routes>                
                  </div>      
                         
                  <footer className="site-footer">             
                    <div className="footer-content">             
                      <div className="footer-column">             
                        <h4>Products</h4>             
                        <ul>             
                          <li><a href="/soltswap">Soltswap</a></li>             
                          <li><a href="/scam-detection">SoltGuardian</a></li>             
                          <li><a href="/whale-tracking">Whale Watch</a></li>             
                          <li><a href="/create-locks">SoltLock</a></li>             
                          <li><a href="/create-tokens">SoltMint</a></li>             
                        </ul>             
                      </div>             
                      <div className="footer-column">             
                        <h4>Company</h4>             
                        <ul>             
                          <li><a href="#story">Our Story</a></li>             
                          <li><a href="#terms">Terms</a></li>             
                        </ul>             
                      </div>             
                    </div>             
                    <div className="footer-bottom">             
                      <p>© 2026 Soltchain Technologies</p>             
                    </div>             
                  </footer>             
                </div>      
              </main>              
            </div>              
          </Router>
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );              
}              
             
export default App;