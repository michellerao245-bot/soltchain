require('dotenv').config();
const { Worker } = require('bullmq');

const supabase = require('../../shared/supabase');
const { verifyContract } = require("../../modules/verify-system/bscVerify");
const { getSourceCode } = require("../../modules/verify-system/sourceReader");
const { encodeArgs } = require("../../modules/verify-system/encoder");
const { getContractName } = require("../../modules/verify-system/contractMap");

// ✅ Redis Config
const connection = {
  host: process.env.REDIS_HOST || '127.0.0.1',
  port: process.env.REDIS_PORT || 6379,
  password: process.env.REDIS_PASSWORD || undefined,
  maxRetriesPerRequest: null
};

// 🚀 Worker
const worker = new Worker('blockchain-events', async (job) => {
  const data = job.data || {};

  const {
    token,
    tokenType,
    owner,
    txHash,
    blockNumber,
    name,
    symbol,
    totalSupply,
    decimals,
    devWallet,
    tax
  } = data;

  // ❌ Safety check
  if (!token || !tokenType) {
    console.error(`⚠️ Job ${job.id} skipped: Missing token data`);
    return { status: 'skipped' };
  }

  console.log(`\n🛠️ Processing Job [${job.id}]: ${tokenType} -> ${token}`);

  try {
    // 🔥 1. Get Contract Name (mapping)
    const contractName = getContractName(tokenType);

    // 🔥 2. Load Source Code (flat)
    const sourceCode = getSourceCode(tokenType);

    // 🔥 3. Encode constructor args
    const encodedArgs = encodeArgs(
      tokenType,
      name,
      symbol,
      totalSupply,
      decimals,
      owner,
      devWallet,
      tax
    );

    // 🔥 4. Verify
    const result = await verifyContract({
      contractAddress: token,
      contractName,
      sourceCode,
      constructorArgs: encodedArgs,
      compilerVersion: "v0.8.20+commit.a1b79de6"
    });

    console.log(`🔍 BscScan Result:`, result);

    // ✅ Check success
    const isVerified =
      result.success ||
      (result.message && result.message.toLowerCase().includes("already verified"));

    // 💾 Save to DB
    const { error } = await supabase
      .from('verified_tokens')
      .upsert([
        {
          address: token.toLowerCase(),
          owner: owner.toLowerCase(),
          token_type: tokenType,
          tx_hash: txHash,
          block_number: blockNumber,
          is_verified: isVerified,
          guid: result.guid || null,
          processed_at: new Date()
        }
      ], { onConflict: 'address' });

    if (error) throw error;

    return { status: 'done', token, verified: isVerified };

  } catch (err) {
    console.error(`❌ Worker Error (Job ${job.id}): ${err.message}`);
    throw err;
  }

}, {
  connection,
  concurrency: 1, // safe for BscScan
});

// 📊 Logs
worker.on('completed', (job, result) => {
  console.log(`✔️ Job ${job.id} done | Verified: ${result.verified}`);
});

worker.on('failed', (job, err) => {
  console.log(`🆘 Job ${job.id} failed: ${err.message}`);
});

console.log("🚀 Worker running...");