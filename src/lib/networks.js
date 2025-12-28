import { sepolia, polygon } from "viem/chains";

export const NETWORKS = {
  sepolia: {
    id: "sepolia",
    chain: sepolia,
    chainId: 11155111,
    name: "Sepolia Testnet",
    rpcUrl: process.env.NEXT_PUBLIC_SEPOLIA_RPC_URL || "https://ethereum-sepolia-rpc.publicnode.com",
    nativeToken: {
      symbol: "ETH",
      decimals: 18,
    },
    tokens: {
      
      usdc: "0x...", 
    },
    explorer: "https://sepolia.etherscan.io",
    description: "Test network - Free gas via Pimlico",
    gasless: true,
  },
  polygon: {
    id: "polygon",
    chain: polygon,
    chainId: 137,
    name: "Polygon Mainnet",
    rpcUrl: process.env.NEXT_PUBLIC_POLYGON_RPC_URL || "https://polygon.drpc.org",
    nativeToken: {
      symbol: "MATIC",
      decimals: 18,
    },
    tokens: {
      usdc: "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174", 
    },
    explorer: "https://polygonscan.com",
    description: "Production network - For Polymarket Bot",
    gasless: true,
  },
};

export const DEFAULT_NETWORK = "sepolia";

export function getNetwork(networkId) {
  return NETWORKS[networkId] || NETWORKS[DEFAULT_NETWORK];
}
