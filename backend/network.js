require("dotenv").config();

const config = {
  rpcUrl: process.env.RPC_URL,
  privateKey: process.env.PRIVATE_KEY,

  chain: "BSC", // future use

  gasLimit: 3000000,
};

module.exports = config;