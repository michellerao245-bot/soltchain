const express = require("express");
const router = express.Router();

// 🚀 Import service layer (Fixed Syntax)
const { verifyContract, checkStatus } = require("../modules/verify-system/bscVerify");

/**
 * 🚀 1. Submit verification request
 */
router.post("/verify-contract", async (req, res) => {
  try {
    const { contractAddress, sourceCode, constructorArgs, contractName, compilerVersion } = req.body;

    if (!contractAddress || !sourceCode || !contractName || !compilerVersion) {
      return res.status(400).json({ success: false, message: "Missing required fields" });
    }

    const result = await verifyContract({ contractAddress, sourceCode, constructorArgs, contractName, compilerVersion });
    res.json({ success: true, message: "Verification request sent", data: result });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;