require("dotenv").config();
const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();

  console.log("🚀 Deploying with:", deployer.address);

  const tokenAddress = "0x6C8942407c65D0f038b04DD5DA3420eC826Cc8d9";
  const treasury = "0xC30050aBe984c3B3929822E3BbF33fbBE6b3C423";

  const hardcap = hre.ethers.parseEther("50");
  const minBuy = hre.ethers.parseUnits("1", 18);
  const maxBuy = hre.ethers.parseUnits("5000", 18);
  const durationDays = 60;

  const prices = [
    hre.ethers.parseUnits("0.03", 18),
    hre.ethers.parseUnits("0.0476", 18),
    hre.ethers.parseUnits("0.0714", 18)
  ];

  const supplies = [
    hre.ethers.parseUnits("1000000", 18),
    hre.ethers.parseUnits("2000000", 18),
    hre.ethers.parseUnits("3000000", 18)
  ];

  const Factory = await hre.ethers.getContractFactory("SoltcoinSaaS_Optimized");

  const contract = await Factory.deploy(
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
  const address = await contract.getAddress();

  console.log("✅ Deployed at:", address);

  console.log("⏳ Waiting 30 seconds...");
  await new Promise(r => setTimeout(r, 30000));

  try {
    await hre.run("verify:verify", {
      address: address,
      constructorArguments: [
        tokenAddress,
        treasury,
        hardcap,
        minBuy,
        maxBuy,
        durationDays,
        prices,
        supplies
      ]
    });

    console.log("🎉 VERIFIED SUCCESS!");
  } catch (e) {
    console.log("❌ Verify failed:", e.message);
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});