import React, { useState } from 'react';
import { ethers } from 'ethers';
import FACTORY_ABI from '../contractABI.json';

const StandardToken = () => {
  const [loading, setLoading] = useState(false);
  const [tokenAddress, setTokenAddress] = useState("");

  const [formData, setFormData] = useState({
    name: '',
    symbol: '',
    supply: '',
    decimals: 18
  });

  const FACTORY_ADDRESS = "0xc8fBBfa8172D3FF165889259C3a02eC5a5Cc3a18";
  const SOLT_TOKEN_ADDRESS = "0x6C8942407c65D0f038b04DD5DA3420eC826Cc8d9";

  const handleDeploy = async (e) => {
    e.preventDefault();

    if (!window.ethereum) {
      return alert("Install MetaMask first");
    }

    try {
      setLoading(true);

      // =========================
      // CONNECT WALLET
      // =========================
      await window.ethereum.request({ method: 'eth_requestAccounts' });

      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();

      // =========================
      // NETWORK SWITCH (BSC)
      // =========================
      const network = await provider.getNetwork();
      if (network.chainId !== 56n) {
        await window.ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: '0x38' }],
        });
      }

      // =========================
      // APPROVE SOLT
      // =========================
      const solt = new ethers.Contract(
        SOLT_TOKEN_ADDRESS,
        ["function approve(address spender, uint256 amount) returns (bool)"],
        signer
      );

      const approveTx = await solt.approve(
        FACTORY_ADDRESS,
        ethers.parseUnits("6000", 18)
      );

      await approveTx.wait();

      // =========================
      // DEPLOY TOKEN
      // =========================
      const factory = new ethers.Contract(
        FACTORY_ADDRESS,
        FACTORY_ABI,
        signer
      );

      const supply = Number(formData.supply);
      const decimals = Number(formData.decimals || 18);

      if (supply <= 0) {
        return alert("Supply must be greater than 0");
      }

      console.log("🚀 Deploying Standard Token...");

      const tx = await factory.createStandardToken(
        formData.name,
        formData.symbol,
        supply,
        decimals
      );

      console.log("TX:", tx.hash);

      const receipt = await tx.wait();

      // =========================
      // TOKEN ADDRESS EXTRACT + BSC OPEN
      // =========================
      const event = receipt.logs.find(log => {
        try {
          return log.fragment?.name === "TokenCreated";
        } catch {
          return false;
        }
      });

      let deployedAddress = "";

      if (event) {
        deployedAddress = event.args.token;
        setTokenAddress(deployedAddress);

        // 🔥 OPEN BSC VERIFY PAGE
        window.open(
          `https://bscscan.com/verifyContract?a=${deployedAddress}`,
          "_blank"
        );
      }

      alert("🎉 Token Deployed:\n" + deployedAddress);

      // RESET
      setFormData({
        name: '',
        symbol: '',
        supply: '',
        decimals: 18
      });

    } catch (err) {
      console.error(err);

      if (err.code === 4001) {
        alert("Transaction cancelled");
      } else {
        alert(err.reason || err.message);
      }

    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>

        <h2 style={styles.title}>🚀 Standard Token Deploy</h2>

        <form onSubmit={handleDeploy}>

          <input
            style={styles.input}
            placeholder="Token Name"
            value={formData.name}
            onChange={e => setFormData({ ...formData, name: e.target.value })}
            required
          />

          <input
            style={styles.input}
            placeholder="Symbol"
            value={formData.symbol}
            onChange={e => setFormData({ ...formData, symbol: e.target.value })}
            required
          />

          <input
            style={styles.input}
            type="number"
            placeholder="Supply (e.g. 10, 1000)"
            value={formData.supply}
            onChange={e => setFormData({ ...formData, supply: e.target.value })}
            required
          />

          <input
            style={styles.input}
            type="number"
            placeholder="Decimals (18)"
            value={formData.decimals}
            onChange={e => setFormData({ ...formData, decimals: e.target.value })}
          />

          <button style={styles.button} disabled={loading}>
            {loading ? "Deploying..." : "Deploy Token"}
          </button>

        </form>

        {tokenAddress && (
          <div style={styles.result}>
            <p>✅ Token Successfully Deployed:</p>
            <p style={{ wordBreak: "break-all", color: "#22c55e" }}>
              {tokenAddress}
            </p>
          </div>
        )}

      </div>
    </div>
  );
};

// 🎨 UI
const styles = {
  container: {
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "linear-gradient(135deg, #020617, #0f172a)",
    color: "#fff"
  },
  card: {
    background: "#0f172a",
    padding: "30px",
    borderRadius: "16px",
    width: "380px"
  },
  title: {
    textAlign: "center",
    marginBottom: "20px"
  },
  input: {
    width: "100%",
    padding: "12px",
    marginBottom: "15px",
    borderRadius: "8px",
    border: "1px solid #334155",
    background: "#020617",
    color: "#fff"
  },
  button: {
    width: "100%",
    padding: "12px",
    background: "linear-gradient(90deg,#3b82f6,#06b6d4)",
    border: "none",
    borderRadius: "8px",
    color: "#fff",
    fontWeight: "bold"
  },
  result: {
    marginTop: "20px",
    padding: "10px",
    border: "1px solid #334155",
    borderRadius: "8px"
  }
};

export default StandardToken;