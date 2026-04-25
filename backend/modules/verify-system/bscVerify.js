const axios = require("axios");
const qs = require("qs");
require("dotenv").config();

const API_URL = "https://api.etherscan.io/v2/api";

// ⏳ helper
const sleep = (ms) => new Promise((res) => setTimeout(res, ms));

// 🔎 Check status
async function checkStatus(guid) {
  while (true) {
    await sleep(5000);

    const res = await axios.get(API_URL, {
      params: {
        chainid: "56",
        module: "contract",
        action: "checkverifystatus",
        guid: guid,
        apikey: process.env.ETHERSCAN_API_KEY,
      },
    });

    console.log("🔎 Status:", res.data);

    if (res.data.status === "1") {
      return { success: true, message: res.data.result };
    }

    if (
      res.data.result &&
      res.data.result.toLowerCase().includes("pending")
    ) {
      continue;
    }

    throw new Error(res.data.result);
  }
}

// 🚀 Verify contract
async function verifyContract({
  contractAddress,
  contractName,
  sourceCode,
  compilerVersion,
  constructorArgs,
}) {
  const apiKey = process.env.ETHERSCAN_API_KEY;

  if (!apiKey) {
    throw new Error("❌ ETHERSCAN_API_KEY missing in backend/.env");
  }

  const data = {
    chainId: "56",
    module: "contract",
    action: "verifysourcecode",
    apikey: apiKey,

    contractaddress: contractAddress,
    sourceCode: sourceCode,
    codeformat: "solidity-single-file",
    contractname: contractName,

    compilerversion:
      compilerVersion || "v0.8.20+commit.a1b79de6",

    optimizationUsed: "1",
    runs: "200",

    constructorArguments: constructorArgs || "",
  };

  try {
    console.log("📡 Verifying:", contractAddress);

    // DEBUG
    console.log("📤 Payload:", qs.stringify(data));

    const res = await axios.post(
      API_URL,
      qs.stringify(data),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    console.log("📨 Verify Response:", res.data);

    if (res.data.status === "0") {
      if (
        res.data.result &&
        res.data.result.toLowerCase().includes("already verified")
      ) {
        return { success: true, message: "Already Verified" };
      }

      throw new Error(res.data.result);
    }

    const guid = res.data.result;

    console.log("⏳ Waiting 10 sec...");
    await sleep(10000);

    return await checkStatus(guid);

  } catch (err) {
    console.error("❌ VERIFY ERROR:", err.message);
    throw err;
  }
}

module.exports = { verifyContract };