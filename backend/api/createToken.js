const express = require("express");
const router = express.Router();
const { ethers } = require("ethers");
const fs = require("fs");
const path = require("path");
const { tokenDB } = require("../modules/listeners/tokenListener");

// ⚠️ Provider aur Wallet setup
const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);
const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

const factoryAddress = "0xc8fBBfa8172D3FF165889259C3a02eC5a5Cc3a18";

const factoryAbi = [
  "function createStandardToken(string,string,uint256,uint8)",
  "function createBurnableToken(string,string,uint256,uint8)",
  "function createFeeToken(string,string,uint256,uint8,uint256)"
];

const factory = new ethers.Contract(factoryAddress, factoryAbi, wallet);

// 📂 Function to read Solidity source code
function GET_SOURCE_CODE(type) {
  try {
    let fileName = "";
    if (type === "Standard") fileName = "StandardToken.sol";
    if (type === "Burnable") fileName = "BurnableToken.sol";
    if (type === "FeeToken") fileName = "FeeToken.sol";

    // ✅ Path check: backend/contracts/tokens/..
    const filePath = path.join(__dirname, "../../contracts/tokens", fileName);
    return fs.readFileSync(filePath, "utf8");
  } catch (err) {
    console.error("❌ Source code file not found:", err.message);
    return "";
  }
}

// 🚀 CREATE TOKEN API
router.post("/create-token", async (req, res) => {
  try {
    const { name, symbol, supply, decimals, type, tax, userWallet } = req.body;
    
    if (!userWallet) throw new Error("Wallet address is required");

    const abiCoder = ethers.AbiCoder.defaultAbiCoder();
    let tx;
    let encodedArgs;
    let contractName;

    // 🔥 TYPE HANDLE & ENCODING
    if (type === "Standard") {
      tx = await factory.createStandardToken(name, symbol, supply, decimals);
      encodedArgs = abiCoder.encode(
        ["string", "string", "uint256", "uint8", "address"],
        [name, symbol, supply, decimals, userWallet]
      ).slice(2);
      contractName = "StandardToken";
    } 
    else if (type === "Burnable") {
      tx = await factory.createBurnableToken(name, symbol, supply, decimals);
      encodedArgs = abiCoder.encode(
        ["string", "string", "uint256", "uint8", "address"],
        [name, symbol, supply, decimals, userWallet]
      ).slice(2);
      contractName = "BurnableToken";
    } 
    else if (type === "FeeToken") {
      tx = await factory.createFeeToken(name, symbol, supply, decimals, tax);
      encodedArgs = abiCoder.encode(
        ["string", "string", "uint256", "uint8", "uint256", "address", "address"],
        [name, symbol, supply, decimals, tax, wallet.address, userWallet]
      ).slice(2);
      contractName = "FeeToken";
    }

    // 💣 FIX: Save data BEFORE waiting for transaction
    const cacheKey = userWallet.toLowerCase();
    tokenDB[cacheKey] = {
      encodedArgs,
      contractName,
      sourceCode: GET_SOURCE_CODE(type)
    };

    console.log(`✅ Verification data cached for: ${cacheKey}`);

    // 🔥 Confirm transaction
    const receipt = await tx.wait();
    
    // Token address nikalo
    const tokenAddress = receipt.logs[0].address;

    res.json({
      success: true,
      token: tokenAddress
    });

  } catch (err) {
    console.error("❌ API Error:", err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;