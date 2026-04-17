import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { TrendingUp, Activity, ShieldCheck, Zap } from 'lucide-react';
import './MarketNav.css';

const MarketNav = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { name: "Markets", path: "/markets", icon: TrendingUp, color: "#f59e0b", badge: "HOT" },
    { name: "Analytics", path: "/token-analytics", icon: Activity, color: "#10b981" },
    { name: "Guardian", path: "/scam-detection", icon: ShieldCheck, color: "#6366f1" },
    { name: "Signals", path: "/sniping-signals", icon: Zap, color: "#ec4899", badge: "PRO" }
  ];

  return (
    <nav className="market-nav-container">
      {navItems.map((item) => {
        const isActive = location.pathname === item.path;
        
        return (
          <div 
            key={item.path} // FIX 1: Stable key
            className={`nav-card ${isActive ? 'active' : ''}`}
            onClick={() => navigate(item.path)}
            onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && navigate(item.path)}
            role="button"
            tabIndex={0}
          >
            {/* Custom Tooltip Replacement: Pure CSS Hint */}
            <span className="custom-tooltip">Open {item.name}</span>

            {item.badge && (
              <span className="nav-badge" style={{ backgroundColor: item.color }}>
                {item.badge}
              </span>
            )}
            
            <div className="icon-wrapper" style={{ backgroundColor: `${item.color}15` }}>
              <item.icon 
                size={24} 
                color={item.color} 
                className={isActive ? 'active-icon-anim' : ''} 
              />
            </div>

            <span className="nav-label">{item.name}</span>
            {isActive && <div className="active-underline" style={{ backgroundColor: item.color }} />}
          </div>
        );
      })}
    </nav>
  );
};

export default MarketNav;