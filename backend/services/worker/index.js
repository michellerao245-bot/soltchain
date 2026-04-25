require("dotenv").config();

const { Worker } = require("bullmq");
const redisConnection = require("./redis");

const { verifyContract } = require("../../modules/verify-system/bscVerify");
const { getSourceCode } = require("../../modules/verify-system/sourceReader");
const { encodeArgs } = require("../../modules/verify-system/encoder");
const { getContractName } = require("../../modules/verify-system/contractMap");

const { ethers } = require("ethers");
const supabase = require("../../shared/supabase");

const worker = new Worker(
  "blockchain-events",
  async (job) => {
    const data = job.data || {};

    const {
      tokenAddress,
      tokenType,
      owner,
      txHash,
      blockNumber,
      name,
      symbol,
      totalSupply,
      decimals,
      devWallet,
      tax,
    } = data;

    if (!tokenAddress || !tokenType) {
      console.log(`⚠️ Skipping job ${job.id}`);
      return;
    }

    console.log("\n-----------------------------");
    console.log(`🛠️ Job ${job.id}`);
    console.log(`👉 ${name} (${symbol})`);
    console.log("-----------------------------");

    try {
      // 🔥 1. Contract Name
      const contractName = getContractName(tokenType);

      // 🔥 2. Source Code
      const source = getSourceCode(tokenType);
      if (!source) throw new Error("Source code missing");

      // 🔥 3. FIX SUPPLY (CRITICAL)
      const parsedSupply = ethers.parseUnits(
        totalSupply.toString(),
        Number(decimals)
      );

      // 🔥 4. Encode Args
      const encodedArgs = encodeArgs(
        contractName,
        name,
        symbol,
        parsedSupply.toString(),
        Number(decimals),
        owner,
        devWallet,
        tax
      );

      console.log("🔐 Args ready");

      // 🔥 5. Verify
      const result = await verifyContract({
        contractAddress: tokenAddress,
        contractName: contractName,
        sourceCode: source,
        constructorArgs: encodedArgs,
      });

      console.log("🔍 Verify:", result.message);

      const isVerified =
        result.success ||
        (result.message &&
          result.message.toLowerCase().includes("already verified"));

      // 🔥 6. DB update
      await supabase.from("verified_tokens").upsert(
        [
          {
            address: tokenAddress.toLowerCase(),
            owner: owner.toLowerCase(),
            token_type: tokenType,
            tx_hash: txHash,
            block_number: blockNumber,
            is_verified: isVerified,
            processed_at: new Date(),
          },
        ],
        { onConflict: "address" }
      );

      console.log(
        isVerified ? "⭐ VERIFIED" : "⚠️ Pending (will retry)"
      );

      return { verified: isVerified };

    } catch (err) {
      console.error(`❌ Job ${job.id}:`, err.message);
      throw err; // retry
    }
  },
  {
    connection: redisConnection,
    concurrency: 1,
  }
);

// EVENTS
worker.on("completed", (job, res) => {
  console.log(`✔️ Done Job ${job.id} | Verified: ${res?.verified}`);
});

worker.on("failed", (job, err) => {
  console.log(`🆘 Failed Job ${job?.id}: ${err.message}`);
});

console.log("🚀 WORKER RUNNING...");