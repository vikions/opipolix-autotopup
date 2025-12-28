"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createConfig, http, WagmiProvider } from "wagmi";
import { sepolia, polygon } from "viem/chains";
import { metaMask } from "wagmi/connectors";
import { createContext, useContext, useState } from "react";
import { NETWORKS, DEFAULT_NETWORK } from "../lib/networks";

export const connectors = [metaMask()];

const queryClient = new QueryClient();

export const wagmiConfig = createConfig({
  chains: [sepolia, polygon],
  connectors,
  multiInjectedProviderDiscovery: false,
  transports: {
    [sepolia.id]: http(NETWORKS.sepolia.rpcUrl),
    [polygon.id]: http(NETWORKS.polygon.rpcUrl),
  },
});


const NetworkContext = createContext({
  network: DEFAULT_NETWORK,
  setNetwork: () => {},
  networkConfig: NETWORKS[DEFAULT_NETWORK],
});

export function useNetwork() {
  return useContext(NetworkContext);
}

export function AppProvider({ children }) {
  const [network, setNetwork] = useState(DEFAULT_NETWORK);
  
  const value = {
    network,
    setNetwork,
    networkConfig: NETWORKS[network],
  };

  return (
    <QueryClientProvider client={queryClient}>
      <WagmiProvider config={wagmiConfig}>
        <NetworkContext.Provider value={value}>
          {children}
        </NetworkContext.Provider>
      </WagmiProvider>
    </QueryClientProvider>
  );
}
