const axios = require('axios');
require('dotenv').config();

const API_URL = "https://api.bscscan.com/api";

// 🔁 STATUS CHECK FUNCTION
async function checkStatus(guid, apiKey) {
  while (true) {
    await new Promise(res => setTimeout(res, 4000)); // wait 4 sec

    const params = new URLSearchParams();
    params.append('apikey', apiKey);
    params.append('module', 'contract');
    params.append('action', 'checkverifystatus');
    params.append('guid', guid);

    const res = await axios.get(API_URL, { params });

    console.log("🔎 Status:", res.data);

    if (res.data.status === "1") {
      return { success: true, message: res.data.result };
    }

    if (res.data.result.includes("Pending")) {
      continue;
    }

    throw new Error(res.data.result);
  }
}

// 🚀 MAIN VERIFY FUNCTION
async function verifyContract({
  contractAddress,
  contractName,
  compilerVersion,
  constructorArgs,
  sourceCode
}) {
  const apiKey = process.env.BSCSCAN_API_KEY;

  const params = new URLSearchParams();

  params.append('apikey', apiKey);
  params.append('module', 'contract');
  params.append('action', 'verifysourcecode');

  params.append('chainid', '56');

  params.append('contractaddress', contractAddress);

  params.append('contractname', `${contractName}.sol:${contractName}`);

  params.append('compilerversion', compilerVersion || "v0.8.20+commit.a1b79de6");

  params.append('codeformat', 'solidity-single-file'); // ⚠️ IMPORTANT

  params.append('optimizationUsed', '0');
  params.append('runs', '200');

  params.append('constructorArguments', constructorArgs || "");

  params.append('sourceCode', sourceCode);

  try {
    console.log(`📡 Submitting verification: ${contractAddress}`);

    const res = await axios.post(API_URL, params.toString(), {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      timeout: 60000
    });

    console.log("📨 Submit Response:", res.data);

    if (res.data.status === "0") {
      throw new Error(res.data.result);
    }

    const guid = res.data.result;

    console.log("🧾 GUID:", guid);
    console.log("⏳ Waiting for verification...");

    // 🔁 CHECK STATUS LOOP
    const finalResult = await checkStatus(guid, apiKey);

    return {
      success: true,
      guid,
      message: finalResult.message
    };

  } catch (err) {
    console.error("❌ VERIFY ERROR:", err.message);
    throw err;
  }
}

module.exports = { verifyContract };