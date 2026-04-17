import React from 'react';
import { Link } from 'react-router-dom';
import { 
  FaHome, FaPlusCircle, FaChartLine, FaExchangeAlt, 
  FaShieldAlt, FaFish, FaCrosshairs, FaChartBar, 
  FaCoins, FaCalculator, FaEllipsisH, FaUser 
} from 'react-icons/fa';
import './Sidebar.css';

// FIX 1: 'isOpen' aur 'toggleSidebar' ko yahan brackets () mein lena zaroori hai
const Sidebar = ({ isOpen, toggleSidebar }) => {
  return (
    <aside className={`sidebar ${isOpen ? 'open' : 'closed'}`}>
      
      {/* Header Section with Logo and Toggle Button */}
      <div className="sidebar-header" style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: isOpen ? 'space-between' : 'center',
        padding: '15px 20px'
      }}>
        {isOpen && <h2 className="logo" style={{ color: '#f59e0b', margin: 0 }}>SoltDex</h2>}
        
        <button 
          onClick={toggleSidebar} 
          style={{
            background: '#f59e0b',
            border: 'none',
            color: 'white',
            padding: '8px 12px',
            borderRadius: '5px',
            cursor: 'pointer'
          }}
        >
          {isOpen ? '✕' : '☰'}
        </button>
      </div>

      {/* Menu Items */}
      <nav className="menu-container">
        <Link to="/" className="menu-item"><FaHome /> {isOpen && "Home"}</Link>
        <Link to="/create" className="menu-item"><FaPlusCircle /> {isOpen && "Create"}</Link>
        <Link to="/dashboard" className="menu-item"><FaChartLine /> {isOpen && "Dashboard"}</Link>
        <Link to="/soltswap" className="menu-item"><FaExchangeAlt /> {isOpen && "Soltswap"}</Link>
        <Link to="/scam-detection" className="menu-item"><FaShieldAlt /> {isOpen && "Scam Detection"}</Link>
        <Link to="/whale-tracking" className="menu-item"><FaFish /> {isOpen && "Whale Tracking"}</Link>
        <Link to="/sniping-signals" className="menu-item"><FaCrosshairs /> {isOpen && "Sniping Signals"}</Link>
        <Link to="/token-analytics" className="menu-item"><FaChartBar /> {isOpen && "Token Analytics"}</Link>
        <Link to="/presale" className="menu-item"><FaCoins /> {isOpen && "Presale"}</Link>
        <Link to="/price-converter" className="menu-item"><FaCalculator /> {isOpen && "Price Converter"}</Link>
        <Link to="/more" className="menu-item"><FaEllipsisH /> {isOpen && "More"}</Link>
        <Link to="/profile" className="menu-item"><FaUser /> {isOpen && "Profile"}</Link>
      </nav>

      <div className="sidebar-footer">
        {isOpen && <button className="lang-btn">ENGLISH</button>}
      </div>
    </aside>
  );
};

// FIX 2: Ye line sabse important hai, warna 'Export default not found' error aayega
export default Sidebar;