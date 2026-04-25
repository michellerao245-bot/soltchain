const { ethers } = require('ethers');
require('dotenv').config();

// Sab kuch ek hi jagah import kar rahe hain
const supabase = require('../../shared/supabase');
const { verifyContract } = require("../../modules/verify-system/bscVerify");
const { getSourceCode } = require("../../modules/verify-system/sourceReader");
const { encodeArgs } = require("../../modules/verify-system/encoder");
const { getContractName } = require("../../modules/verify-system/contractMap");

// 1. Provider & Factory Setup
const provider = new ethers.JsonRpcProvider(process.env.BSC_RPC_URL);
const factoryAddress = process.env.FACTORY_CONTRACT_ADDRESS;

const factoryAbi = ["event TokenCreated(address indexed owner, address indexed token, string tokenType)"];
const tokenAbi = [
    "function name() view returns (string)",
    "function symbol() view returns (string)",
    "function totalSupply() view returns (uint256)",
    "function decimals() view returns (uint8)"
];

async function startSystem() {
    try {
        const network = await provider.getNetwork();
        console.log(`🌐 Connected to BSC (ChainID: ${network.chainId})`);
        console.log(`🏠 Monitoring Factory: ${factoryAddress}`);
    } catch (error) {
        console.error("💀 Connection Error:", error.message);
        process.exit(1);
    }

    const factoryContract = new ethers.Contract(factoryAddress, factoryAbi, provider);

    console.log("📡 SOLTDEX DIRECT SYSTEM ONLINE...");

    factoryContract.on("TokenCreated", async (owner, tokenAddress, tokenType, event) => {
        console.log(`\n🆕 NEW TOKEN: ${tokenType} | Address: ${tokenAddress}`);

        try {
            const tokenContract = new ethers.Contract(tokenAddress, tokenAbi, provider);

            // 1. Fetch Details
            const [name, symbol, totalSupply, decimals] = await Promise.all([
                tokenContract.name(),
                tokenContract.symbol(),
                tokenContract.totalSupply(),
                tokenContract.decimals()
            ]);

            const formattedSupply = ethers.formatUnits(totalSupply, decimals);
            console.log(`📋 Details: ${name} (${symbol}) | Supply: ${formattedSupply}`);

            // 2. Prepare for Verification
            const contractName = getContractName(tokenType);
            const source = getSourceCode(tokenType);
            
            const encodedArgs = encodeArgs(
                contractName, name, symbol, formattedSupply, 
                Number(decimals), owner, (process.env.DEV_WALLET || owner), 
                (tokenType === 'FeeToken' ? 1000 : 0)
            );

            // 3. DIRECT VERIFICATION (No Redis!)
            console.log("⏳ Submitting to BscScan Directly...");
            const result = await verifyContract({
                contractAddress: tokenAddress,
                contractName: contractName,
                sourceCode: source,
                constructorArgs: encodedArgs,
                compilerVersion: "v0.8.20+commit.a1b79de6"
            });

            console.log(`🔍 BscScan Result: ${result.message}`);

            // 4. Update Database
            const isVerified = result.success || result.message.toLowerCase().includes("already verified");
            
            await supabase.from('verified_tokens').upsert([{
                address: tokenAddress.toLowerCase(),
                owner: owner.toLowerCase(),
                token_type: tokenType,
                is_verified: isVerified,
                processed_at: new Date()
            }], { onConflict: 'address' });

            console.log(isVerified ? "⭐ SUCCESS: VERIFIED!" : "⚠️ FAILED TO VERIFY");

        } catch (err) {
            console.error("❌ Process Error:", err.message);
        }
    });

    provider.on("block", (b) => { if(b % 10 === 0) console.log(`⛓️ Block: ${b}`); });
}

startSystem();