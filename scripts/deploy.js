import hre from "hardhat";

async function main() {
  const { ethers } = hre;
  const [deployer] = await ethers.getSigners();

  console.log("--------------------------------------------------");
  console.log("🚀 Deploying TokenFactory with account:", deployer.address);
  
  // SOLT Token Address & Fee Receiver
  const SOLT_TOKEN_ADDRESS = "0xF28B1d7A0A36b500b21B3081537FFC675e39A201"; 
  const FEE_RECEIVER = "0xC30050aBe984c3B3929822E3BbF33fbBE6b3C423"; 
  
  // Fees: 3,000 SOLT (Lagbhag ₹10k - 12k range)
  const CREATION_FEE = ethers.parseUnits("3000", 18); 

  console.log("📦 Deploying TokenFactory Engine...");

  const TokenFactory = await ethers.getContractFactory("TokenFactory");
  const factory = await TokenFactory.deploy(SOLT_TOKEN_ADDRESS, FEE_RECEIVER, CREATION_FEE);

  await factory.waitForDeployment();
  const factoryAddress = await factory.getAddress();

  console.log("✅ TokenFactory Live at:", factoryAddress);
  console.log("--------------------------------------------------");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});