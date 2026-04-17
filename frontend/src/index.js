import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";

// --- WAGMI & QUERY CLIENT IMPORTS ---
import { WagmiProvider, createConfig, http } from 'wagmi';
// Fix: wagmi/chains ki jagah viem/chains use kar rahe hain
import { bsc, mainnet, polygon } from 'viem/chains'; 
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// 1. Setup Config (SoltDex aur Soltcoin ke liye chains setup)
const config = createConfig({
  chains: [bsc, mainnet, polygon],
  transports: {
    [bsc.id]: http(),
    [mainnet.id]: http(),
    [polygon.id]: http(),
  },
});

// 2. Create Query Client
const queryClient = new QueryClient();

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <React.StrictMode>
    {/* WagmiProvider aur QueryClientProvider se wrap karna zaroori hai */}
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <App />
      </QueryClientProvider>
    </WagmiProvider>
  </React.StrictMode>
);