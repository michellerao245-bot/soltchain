import React from 'react';

const PriceConverter = () => {
  return (
    <div className="page-container">
      <h1>💰 Price Converter</h1>
      <div className="converter-card">
        <input type="number" placeholder="Enter Amount" />
        <select>
          <option>BNB</option>
          <option>USD</option>
          <option>SOLT</option>
        </select>
      </div>
    </div>
  );
};

export default PriceConverter;