const fs = require('fs');
const path = require('path');
const { getContractName } = require('./contractMap');

function getSourceCode(tokenType) {
  const contractName = getContractName(tokenType);

  const filePath = path.join(
    __dirname,
    '../../contracts/flat',
    `${contractName}.sol`
  );

  if (!fs.existsSync(filePath)) {
    throw new Error(`❌ Flat file not found: ${filePath}`);
  }

  return fs.readFileSync(filePath, 'utf8');
}

module.exports = { getSourceCode };