const express = require("express");
const router = express.Router();
const { getSnipingSignals } = require("../controllers/signalController");

router.get("/signals", getSnipingSignals);

module.exports = router;