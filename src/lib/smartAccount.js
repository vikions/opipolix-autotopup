import {
  createPublicClient,
  http,
  encodeFunctionData,
} from "viem";
import { sepolia } from "viem/chains";
import { generatePrivateKey, privateKeyToAccount } from "viem/accounts";
import {
  Implementation,
  toMetaMaskSmartAccount,
} from "@metamask/smart-accounts-kit";
import { erc7715ProviderActions } from "@metamask/smart-accounts-kit/actions";

// Sepolia Configuration
const SEPOLIA_RPC = process.env.NEXT_PUBLIC_SEPOLIA_RPC || "https://ethereum-sepolia-rpc.publicnode.com";
const SEPOLIA_CHAIN_ID = 11155111;

export const ENTRY_POINT_V07 = "0x0000000071727De22E5E9d8BAf0edAc6f37da032";

// Get or create session key from localStorage
function getSessionKey(eoaAddress) {
  if (typeof window === "undefined" || !eoaAddress) return null;
  
  let privKey = localStorage.getItem(`opipolix_session_key_${eoaAddress}`);
  if (!privKey) {
    privKey = generatePrivateKey();
    localStorage.setItem(`opipolix_session_key_${eoaAddress}`, privKey);
  }
  
  return privateKeyToAccount(privKey);
}

export async function createSessionAccount(publicClient, eoaAddress) {
  const account = getSessionKey(eoaAddress);
  if (!account) throw new Error("Failed to create session key");

  const sessionAccount = await toMetaMaskSmartAccount({
    client: publicClient,
    implementation: Implementation.Hybrid,
    deployParams: [account.address, [], [], []],
    deploySalt: "0x",
    signer: { account },
  });

  return sessionAccount;
}

export async function grantPermissions(sessionAccount, walletClient, chainId) {
  if (!sessionAccount) {
    throw new Error("Session account not found");
  }

  if (!walletClient) {
    throw new Error("Wallet client not connected");
  }

  try {
    const client = walletClient.extend(erc7715ProviderActions());
    const currentTime = Math.floor(Date.now() / 1000);
    const expiry = currentTime + 24 * 60 * 60 * 30; // 30 days

    // USDC address on Sepolia
    const USDC_ADDRESS = "0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238";

    const permissions = await client.requestExecutionPermissions([
      // ETH Permission
      {
        chainId: chainId || SEPOLIA_CHAIN_ID,
        expiry,
        signer: {
          type: "account",
          data: {
            address: sessionAccount.address,
          },
        },
        isAdjustmentAllowed: true,
        permission: {
          type: "native-token-periodic",
          data: {
            periodAmount: 100000000000000000n, // 0.1 ETH
            periodDuration: 86400, // 1 day
            justification: "OpiPoliX ETH top-ups",
          },
        },
      },
      // USDC Permission
      {
        chainId: chainId || SEPOLIA_CHAIN_ID,
        expiry,
        signer: {
          type: "account",
          data: {
            address: sessionAccount.address,
          },
        },
        isAdjustmentAllowed: true,
        permission: {
          type: "erc20-token-periodic",
          data: {
            tokenAddress: USDC_ADDRESS,
            periodAmount: 100000000n, // 100 USDC (6 decimals)
            periodDuration: 86400, // 1 day
            justification: "OpiPoliX USDC top-ups",
          },
        },
      },
    ]);
    
    return {
      eth: permissions[0],
      usdc: permissions[1],
    };
  } catch (error) {
    throw error;
  }
}

export async function initSmartAccountContext(publicClient, eoaAddress, bundlerClient, pimlicoClient) {
  const sessionAccount = await createSessionAccount(publicClient, eoaAddress);

  return {
    sessionAccount,
    bundlerClient,
    pimlicoClient,
    publicClient,
    address: sessionAccount.address,
  };
}

export async function topUpAssets(ctx, permission, { to, amount, token }) {
  const { bundlerClient, pimlicoClient, sessionAccount, publicClient } = ctx;

  if (!permission) {
    throw new Error("No permission granted");
  }

  try {
    const { context, signerMeta } = permission;

    if (!signerMeta || !context) {
      throw new Error("Invalid permission data");
    }

    const { delegationManager } = signerMeta;

    const { fast: fee } = await pimlicoClient.getUserOperationGasPrice();

    let callData = "0x";
    let targetAddress = to;
    let value = 0n;

    if (token === "ETH") {
      value = amount;
    } else {
      targetAddress = token;
      const transferAbi = [{
        name: "transfer",
        type: "function",
        inputs: [
          { name: "to", type: "address" },
          { name: "value", type: "uint256" }
        ],
      }];
      
      callData = encodeFunctionData({
        abi: transferAbi,
        functionName: "transfer",
        args: [to, amount],
      });
    }

    const hash = await bundlerClient.sendUserOperationWithDelegation({
      publicClient,
      account: sessionAccount,
      calls: [{
        to: targetAddress,
        data: callData,
        value,
        permissionsContext: context,
        delegationManager,
      }],
      ...fee,
    });

    const { receipt } = await bundlerClient.waitForUserOperationReceipt({ hash });

    return {
      hash,
      txHash: receipt.transactionHash,
    };
  } catch (error) {
    throw error;
  }
}

export function clearSessionKey(address) {
  if (address) {
    localStorage.removeItem(`opipolix_session_key_${address}`);
  }
}

export function clearPermission(address) {
  if (address) {
    localStorage.removeItem(`opipolix_permission_${address}`);
    localStorage.removeItem(`opipolix_bot_address_${address}`);
  }
}
