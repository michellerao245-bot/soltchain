require('dotenv').config();
const { Worker } = require('bullmq');
const supabase = require('../../shared/supabase');
const { verifyContract } = require("../../modules/verify-system/bscVerify");
const { getSourceCode } = require("../../modules/verify-system/sourceReader");
const { encodeArgs } = require("../../modules/verify-system/encoder");
const { getContractName } = require("../../modules/verify-system/contractMap"); // ✅ USE CENTRAL MAP

// 🔌 Redis Connection
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

    // ❌ Validation
    if (!token || !tokenType) {
        console.error(`⚠️ Job ${job.id} skipped: Missing token or type`);
        return { status: 'skipped' };
    }

    console.log(`\n🛠️ Processing Job [${job.id}]`);
    console.log("👉 Token:", token);
    console.log("👉 Type:", tokenType);

    try {

        // ==============================
        // 🔥 1. CONTRACT NAME (CENTRALIZED)
        // ==============================
        const contractName = getContractName(tokenType);

        console.log("✅ Contract Name:", contractName);

        // ==============================
        // 📄 2. SOURCE CODE
        // ==============================
        const source = getSourceCode(tokenType); // ✅ FIXED

        if (!source) {
            throw new Error(`❌ Source code not found for ${contractName}`);
        }

        // ==============================
        // 🔐 3. ENCODE ARGS
        // ==============================
        const encodedArgs = encodeArgs(
            contractName,
            name,
            symbol,
            totalSupply,
            decimals,
            owner,
            devWallet,
            tax
        );

        console.log("🔐 Encoded Args:", encodedArgs);

        // ==============================
        // 📡 4. VERIFY
        // ==============================
        const result = await verifyContract({
            contractAddress: token,
            contractName: contractName,
            sourceCode: source,
            constructorArgs: encodedArgs,
            compilerVersion: "v0.8.20+commit.a1b79de6"
        });

        console.log(`🔍 BscScan Result:`, result);

        // ==============================
        // 🗄️ 5. DATABASE
        // ==============================
        const isVerified =
            result.success ||
            (result.message && result.message.toLowerCase().includes("already verified"));

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
                    processed_at: new Date(),
                    guid: result.guid || null
                }
            ], { onConflict: 'address' });

        if (error) throw error;

        return {
            status: 'completed',
            token: token.toLowerCase(),
            verified: isVerified
        };

    } catch (err) {
        console.error(`❌ Worker Error (Job ${job.id}):`, err.message);
        throw err;
    }

}, {
    connection,
    concurrency: 1,
    settings: {
        backoffStrategies: {
            exponential: (attempts) => Math.pow(2, attempts) * 5000
        }
    }
});

// 📊 Logs
worker.on('completed', (job, result) => {
    console.log(`✔️ Job ${job.id} done | Token: ${result.token} | Verified: ${result.verified}`);
});

worker.on('failed', (job, err) => {
    console.log(`🆘 Job ${job.id} failed permanently: ${err.message}`);
});

console.log("🚀 Verification Worker Started...");