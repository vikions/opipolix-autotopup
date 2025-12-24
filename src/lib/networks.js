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
      // Для тестов можно использовать тестовые токены
      usdc: "0x...", // TODO: Deploy test token
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
    rpcUrl: process.env.NEXT_PUBLIC_POLYGON_RPC_URL || "https://polygon-rpc.com",
    nativeToken: {
      symbol: "MATIC",
      decimals: 18,
    },
    tokens: {
      usdc: "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174", // Native USDC
      usdce: "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174", // Bridged USDC.e (same for now)
    },
    explorer: "https://polygonscan.com",
    description: "Production network - For Opipolix Bot",
    gasless: true, // You need to top up Pimlico
  },
};

export const DEFAULT_NETWORK = "sepolia";

export function getNetwork(networkId) {
  return NETWORKS[networkId] || NETWORKS[DEFAULT_NETWORK];
}
