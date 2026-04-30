const express = require("express");
const router = express.Router();

// 🚀 Service layer import (Fixed path)
const { verifyContract, checkStatus } = require("../modules/verify-system/bscVerify");

/**
 * 🚀 Submit verification
 */
router.post("/verify-contract", async (req, res) => {
  try {
    const { contractAddress, sourceCode, constructorArgs, contractName, compilerVersion } = req.body;
    if (!contractAddress || !sourceCode || !contractName || !compilerVersion) {
      return res.status(400).json({ success: false, message: "Required fields missing" });
    }
    const result = await verifyContract({ contractAddress, sourceCode, constructorArgs, contractName, compilerVersion });
    res.json({ success: true, data: result });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

/**
 * 🚀 Status check
 */
router.post("/check-status", async (req, res) => {
  try {
    const { guid } = req.body;
    if (!guid) return res.status(400).json({ success: false, message: "GUID is required" });
    const result = await checkStatus(guid);
    res.json({ success: true, data: result });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;