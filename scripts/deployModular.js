const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  
  // Addresses ko checksum error se bachane ke liye lowercase kiya hai
  const TREASURY_WALLET = "0xC30050aBe984c3B3929822E3BbF33fbBE6b3C423".toLowerCase(); 
  const SOLT_TOKEN = "0x409559c551270311f457782A740066A696956f1E".toLowerCase();

  console.log("🚀 MAINNET DEPLOYMENT STARTED...");
  console.log("👤 Deploying with account:", deployer.address);
  
  // Check balance
  const balance = await hre.ethers.provider.getBalance(deployer.address);
  console.log("💰 Balance:", hre.ethers.formatEther(balance), "BNB");

  // --- 1. DEPLOY REGISTRY ---
  console.log("⏳ Deploying Registry...");
  const Registry = await hre.ethers.getContractFactory("TokenRegistry");
  const registry = await Registry.deploy();
  await registry.waitForDeployment();
  const registryAddr = await registry.getAddress();
  console.log("✅ Registry Deployed at:", registryAddr);

  // --- 2. DEPLOY FACTORY ---
  console.log("⏳ Deploying Factory...");
  const Factory = await hre.ethers.getContractFactory("TokenFactory");
  // Constructor arguments pass kar rahe hain
  const factory = await Factory.deploy(registryAddr, SOLT_TOKEN, TREASURY_WALLET);
  await factory.waitForDeployment();
  const factoryAddr = await factory.getAddress();
  console.log("✅ Factory Deployed at:", factoryAddr);

  // --- 3. LINK & LOCK ---
  console.log("⏳ Linking Factory to Registry...");
  const tx = await registry.setFactory(factoryAddr);
  await tx.wait();
  console.log("🔒 Factory Linked and Locked in Registry!");

  console.log("\n--- 🏁 DEPLOYMENT COMPLETE ---");
  console.log("Registry Address:", registryAddr);
  console.log("Factory Address:", factoryAddr);
  console.log("------------------------------");
}

// Ye line zaroori hai async function ko run karne ke liye
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});