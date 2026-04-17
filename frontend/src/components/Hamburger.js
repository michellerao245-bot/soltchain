import React from 'react';
import { FaBars, FaTimes } from 'react-icons/fa';
import './Sidebar.css'; // Styling ke liye purani file use kar sakte hain

const Hamburger = ({ isOpen, toggle }) => {
  return (
    <button 
      className="hamburger-btn" 
      onClick={toggle} 
      type="button"
      style={{ border: 'none', background: 'transparent', cursor: 'pointer' }}
    >
      {isOpen ? (
        <FaTimes style={{ color: 'white', fontSize: '1.5rem' }} />
      ) : (
        <FaBars style={{ color: 'white', fontSize: '1.5rem' }} />
      )}
    </button>
  );
};

export default Hamburger;