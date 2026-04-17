const { ethers } = require("ethers");
const config = require("./network");

exports.createToken = async (req, res) => {
  try {
    const { name, symbol, supply } = req.body;

    // 1. ABI (Clean and Fixed)
    const abi = [
      {
        "inputs": [
          { "internalType": "address", "name": "_launchpad", "type": "address" }
        ],
        "stateMutability": "nonpayable",
        "type": "constructor"
      },
      {
        "inputs": [
      { "internalType": "string", "name": "name", "type": "string" },
      { "internalType": "string", "name": "symbol", "type": "string" },
      { "internalType": "uint256", "name": "supply", "type": "uint256" },
      { "internalType": "address", "name": "owner", "type": "address" }
    ],
        "name": "initialize",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
      }
    ];

    // 2. Bytecode (0x se shuru)
    const bytecode = "0x60a060405234801562000010575f80fd5b506040516200276d3803806200276d83398181016040528101906200003691906200029f565b5f73";

    const provider = new ethers.JsonRpcProvider(config.rpcUrl);
    const wallet = new ethers.Wallet(config.privateKey, provider);
    const factory = new ethers.ContractFactory(abi, bytecode, wallet);

    console.log(`🚀 Deploying: ${name}`);

    // Deploy with launchpad address
    const contract = await factory.deploy("0x70BD072e24dEDE56F02e4CA24191E8C70Cf6378d");
    await contract.waitForDeployment();
    const tokenAddress = await contract.getAddress();

    // Initialize Token
    const initialSupply = ethers.parseUnits(supply.toString(), 18);
    const tx = await contract.initialize(name, symbol, initialSupply, wallet.address);
    await tx.wait();

    console.log("✅ Live at:", tokenAddress);
    res.json({ success: true, address: tokenAddress });

  } catch (err) {
    console.error("❌ Error:", err);
    res.status(500).json({ success: false, error: err.message });
  }
};