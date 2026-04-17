const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  console.log("🚀 Deploying SOLT Ecosystem with account:", deployer.address);

  // 1. CONSTANTS (BSC MAINNET)
  const PANCAKE_ROUTER = "0x10ED43C718714eb63d5aA57B78B54704E256024E";
  const TREASURY_WALLET = "0xC30050aBe984c3B3929822E3BbF33fbBE6b3C423"; // <-- Apna address yahan dalo

  // 2. DEPLOY SOLTCOIN
  const Soltcoin = await hre.ethers.getContractFactory("Soltcoin");
  const token = await Soltcoin.deploy(PANCAKE_ROUTER);
  await token.waitForDeployment();
  const tokenAddr = await token.getAddress();
  console.log("✅ SOLT Token deployed at:", tokenAddr);

  // 3. DEPLOY STAKING
  const SoltStaking = await hre.ethers.getContractFactory("SoltStaking");
  const staking = await SoltStaking.deploy(tokenAddr);
  await staking.waitForDeployment();
  const stakingAddr = await staking.getAddress();
  console.log("✅ Staking deployed at:", stakingAddr);

  // 4. DEPLOY FEE ENGINE
  const SoltFeeEngine = await hre.ethers.getContractFactory("SoltFeeEngine");
  const feeEngine = await SoltFeeEngine.deploy(tokenAddr, stakingAddr, TREASURY_WALLET);
  await feeEngine.waitForDeployment();
  const feeEngineAddr = await feeEngine.getAddress();
  console.log("✅ Fee Engine deployed at:", feeEngineAddr);

  // 5. AUTO-CONFIGURATION
  console.log("⚙️  Configuring permissions...");
  
  // Staking reward distributor set karna
  const setDistTx = await staking.setDistributor(feeEngineAddr, true);
  await setDistTx.wait();
  
  // Deployer ko Keeper set karna (Fees trigger karne ke liye)
  const setKeeperTx = await feeEngine.setKeeper(deployer.address, true);
  await setKeeperTx.wait();

  console.log("\n--- 🏁 DEPLOYMENT SUCCESSFUL ---");
  console.log("Next Steps:");
  console.log("1. Add Liquidity on PancakeSwap");
  console.log("2. Verify contracts on BscScan");
  console.log("3. Call enableTrading() on Soltcoin contract");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});