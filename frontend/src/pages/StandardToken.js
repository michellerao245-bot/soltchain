import React, { useState } from 'react';
import { ethers } from 'ethers';

// Apne Factory aur SOLT ke details yahan check kar lena
const FACTORY_ADDRESS = "0xc8fBBfa8172d3ff165889259c3a02ec5a5cc3a18"; //
const SOLT_TOKEN_ADDRESS = "0x6C8942407c65D0f038b04DD5DA3420eC826Cc8d9"; //

const StandardToken = ({ signer, FACTORY_ABI, SOLT_ABI }) => {
  const [formData, setFormData] = useState({
    name: '',
    symbol: '',
    decimals: '18',
    supply: ''
  });
  const [loading, setLoading] = useState(false);

  const handleDeploy = async (e) => {
    e.preventDefault();
    if (!signer) return alert("Pehle Wallet Connect karo!");
    setLoading(true);

    try {
      const soltContract = new ethers.Contract(SOLT_TOKEN_ADDRESS, SOLT_ABI, signer);
      const feeInSolt = ethers.parseUnits("6000", 18);

      // --- STEP 1: APPROVAL ---
      console.log("Approving SOLT...");
      const approveTx = await soltContract.approve(FACTORY_ADDRESS, feeInSolt);
      
      alert("Approval Sent! 5 second rukiye, Deployment popup apne aap aayega...");

      // --- STEP 2: DEPLOYMENT (5 Sec Delay for Mobile) ---
      setTimeout(async () => {
        try {
          const factoryContract = new ethers.Contract(FACTORY_ADDRESS, FACTORY_ABI, signer);
          const supplyWei = ethers.parseUnits(formData.supply.toString(), parseInt(formData.decimals));

          console.log("Deploying Token...");
          const deployTx = await factoryContract.createStandardToken(
            formData.name,
            formData.symbol,
            supplyWei,
            parseInt(formData.decimals)
          );

          await deployTx.wait();
          alert("🎉 Mubarak Ho! " + formData.name + " Token Deploy ho gaya!");
        } catch (innerErr) {
          console.error("Step 2 Error:", innerErr);
          alert("Deployment Fail: " + (innerErr.reason || innerErr.message));
        } finally {
          setLoading(false);
        }
      }, 5000);

    } catch (err) {
      console.error("Step 1 Error:", err);
      alert("Approval Fail: " + (err.reason || err.message));
      setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-dark-card rounded-lg shadow-lg">
      <h2 className="text-xl font-bold mb-4 text-white">Deploy Standard Token</h2>
      <form onSubmit={handleDeploy} className="space-y-4">
        <input
          type="text"
          placeholder="Token Name (e.g. JCB)"
          className="w-full p-2 rounded bg-gray-800 text-white border border-gray-700"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
        />
        <input
          type="text"
          placeholder="Symbol (e.g. JCB)"
          className="w-full p-2 rounded bg-gray-800 text-white border border-gray-700"
          value={formData.symbol}
          onChange={(e) => setFormData({ ...formData, symbol: e.target.value })}
          required
        />
        <input
          type="number"
          placeholder="Total Supply"
          className="w-full p-2 rounded bg-gray-800 text-white border border-gray-700"
          value={formData.supply}
          onChange={(e) => setFormData({ ...formData, supply: e.target.value })}
          required
        />
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition duration-200"
        >
          {loading ? "Processing..." : "Deploy Token Now"}
        </button>
      </form>
    </div>
  );
};

export default StandardToken;