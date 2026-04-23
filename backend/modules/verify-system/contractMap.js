const CONTRACT_MAP = {
  Standard: "StandardToken",
  Burnable: "BurnableToken",
  FeeToken: "FeeToken"
};

function getContractName(tokenType) {
  const name = CONTRACT_MAP[tokenType];
  if (!name) {
    throw new Error(`❌ Unknown token type: ${tokenType}`);
  }
  return name;
}

module.exports = { getContractName };