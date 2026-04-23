const { ethers } = require("hardhat");

async function main() {
    const [deployer] = await ethers.getSigners();

    console.log("--------------------------------------------------");
    console.log("🚀 FINAL MAINNET DEPLOYMENT");
    console.log("Deployer:", deployer.address);
    console.log("--------------------------------------------------");

    // --- CONFIGURATION SET ---
    const tokenAddress = "0x6C8942407c65D0f038b04DD5DA3420eC826Cc8d9"; // Tera Verified Token
    const treasury = "0xC30050aBe984c3B3929822E3BbF33fbBE6b3C423";      // Tera Treasury Wallet
    
    const hardcap = ethers.parseEther("50");       
    const minBuy = ethers.parseUnits("1", 18);     // ✅ $1 Minimum Buy
    const maxBuy = ethers.parseUnits("5000", 18);  
    const durationDays = 60;                       // ✅ 60 Din ki Duration

    // --- PRICES (INR Target: ₹2.52, ₹4.00, ₹6.00) ---
    const prices = [
        ethers.parseUnits("0.03", 18),   
        ethers.parseUnits("0.0476", 18), 
        ethers.parseUnits("0.0714", 18)  
    ];

    // --- SUPPLIES (10L, 20L, 30L) ---
    const supplies = [
        ethers.parseUnits("1000000", 18), 
        ethers.parseUnits("2000000", 18), 
        ethers.parseUnits("3000000", 18)  
    ];

    const SoltFactory = await ethers.getContractFactory("SoltcoinSaaS_Optimized");
    
    console.log("📦 Deploying Presale Contract...");
    
    const contract = await SoltFactory.deploy(
        tokenAddress, 
        treasury, 
        hardcap, 
        minBuy, 
        maxBuy, 
        durationDays, 
        prices, 
        supplies
    );

    await contract.waitForDeployment();
    const deployedAddress = await contract.getAddress();

    console.log("--------------------------------------------------");
    console.log("✅ PRESALE CONTRACT DEPLOYED!");
    console.log("Address:", deployedAddress);
    console.log("--------------------------------------------------");
    console.log("\n⚠️ IMPORTANT NEXT STEPS:");
    console.log(`1. Send 6,000,000 SOLT tokens to: ${deployedAddress}`);
    console.log("2. Verify this contract on BscScan.");
}

main().catch((error) => {
    console.error(error);
    process.exit(1);
});