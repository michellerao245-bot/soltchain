import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";

// --- WAGMI & QUERY CLIENT IMPORTS ---
import { WagmiProvider, createConfig, http } from 'wagmi';
import { bsc, mainnet, polygon } from 'wagmi/chains';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// 1. Setup Config (Saare chains yahan add honge)
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
    {/* Wagmi aur QueryClient se Wrap karna zaroori hai */}
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <App />
      </QueryClientProvider>
    </WagmiProvider>
  </React.StrictMode>
);