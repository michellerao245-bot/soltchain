import React from "react";
import { 
  createWeb3Modal, 
  defaultConfig, 
  useWeb3Modal,
  useWeb3ModalAccount // Address aur status lene ke liye ye hook zaroori hai
} from "@web3modal/ethers/react"; 

const projectId = "36ab9bad9a38e511fd10489d2f947ceb"; 

const bsc = { 
  chainId: 56, 
  name: "Binance Smart Chain", 
  currency: "BNB", 
  explorerUrl: "https://bscscan.com", 
  rpcUrl: "https://bsc-dataseed.binance.org/" 
}; 

createWeb3Modal({ 
  ethersConfig: defaultConfig({ 
    metadata: { 
      name: "SoltSwap", 
      description: "DEX", 
      url: "https://soltdex-frontend.vercel.app", 
      icons: ["https://avatars.githubusercontent.com/u/37784886"] 
    } 
  }), 
  chains: [bsc], 
  projectId 
}); 

const ConnectWallet = () => { 
  const { open } = useWeb3Modal(); 
  // address: user ka wallet address | isConnected: true/false status
  const { address, isConnected } = useWeb3ModalAccount(); 

  const handleConnect = async () => { 
    try { 
      // Ye function modal open karega aur connection handle karega
      await open(); 
    } catch (err) { 
      console.error("Connection Error:", err); 
    } 
  }; 

  return ( 
    <button 
      onClick={handleConnect} 
      className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:scale-105 text-white px-6 py-2 rounded-xl font-bold shadow-lg transition" 
    > 
      {/* Agar connected hai toh address dikhao, nahi toh default text */}
      {isConnected && address 
        ? `${address.slice(0, 6)}...${address.slice(-4)}` 
        : "Connect Wallet"} 
    </button> 
  ); 
}; 

export default ConnectWallet;