const express = require("express");
const router = express.Router();

// 🚀 Import service layer
const {
  verifyContract,
  checkStatus
} = require("../modules/verify-system/bscVerify");


/**
 * 🚀 1. Submit verification request
 * POST /api/verify-contract
 */
router.post("/verify-contract", async (req, res) => {
  try {
    const {
      contractAddress,
      sourceCode,
      constructorArgs,
      contractName,
      compilerVersion
    } = req.body;

    // ⚠️ Validation
    if (!contractAddress || !sourceCode || !contractName || !compilerVersion) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields"
      });
    }

    const result = await verifyContract({
      contractAddress,
      sourceCode,
      constructorArgs,
      contractName,
      compilerVersion
    });

    res.json({
      success: true,
      message: "Verification request sent to BscScan",
      data: result
    });

  } catch (err) {
    console.error("❌ verify-contract error:", err.message);

    res.status(500).json({
      success: false,
      error: err.message
    });
  }
});


/**
 * 🚀 2. Check verification status (GREEN TICK TRACKER)
 * POST /api/check-status
 */
router.post("/check-status", async (req, res) => {
  try {
    const { guid } = req.body;

    if (!guid) {
      return res.status(400).json({
        success: false,
        message: "GUID is required"
      });
    }

    const result = await checkStatus(guid);

    res.json({
      success: true,
      message: "Status fetched successfully",
      data: result
    });

  } catch (err) {
    console.error("❌ check-status error:", err.message);

    res.status(500).json({
      success: false,
      error: err.message
    });
  }
});


module.exports = router;