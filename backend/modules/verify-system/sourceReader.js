const fs = require('fs'); 
const path = require('path'); 
const { getContractName } = require('./contractMap'); 
 
function getSourceCode(tokenType) { 
  const contractName = getContractName(tokenType); 
 
  // 📂 PATH FIX & DEBUG
  const filePath = path.join( 
    __dirname, 
    '../../contracts/flat', 
    `${contractName}.sol` 
  ); 
 
  // --- YE LINE ADD KI HAI ---
  console.log(`📂 Backend is searching for source code at: ${filePath}`);
 
  if (!fs.existsSync(filePath)) { 
    // Agar file nahi milti, toh ye error terminal mein exact path dikhayega
    throw new Error(`❌ Flat file NOT FOUND at: ${filePath}`); 
  } 
 
  const code = fs.readFileSync(filePath, 'utf8');

  // Check karo ki file khali toh nahi hai
  if (!code || code.trim().length === 0) {
    throw new Error(`❌ Flat file is EMPTY at: ${filePath}`);
  }

  return code;
} 
 
module.exports = { getSourceCode };