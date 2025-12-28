"use client";

import { useState, useEffect, useCallback } from "react";
import { useAccount, useConnect, usePublicClient, useWalletClient, useChainId, useSwitchChain } from "wagmi";
import { createSessionAccount, grantPermissions, initSmartAccountContext } from "../src/lib/smartAccount";
import { bundlerClientFactory } from "../src/services/bundlerClient";
import { pimlicoClientFactory } from "../src/services/pimlicoClient";
import Dashboard from "../src/components/Dashboard";

const SEPOLIA_CHAIN_ID = 11155111;

function HomeContent() {
  const [sessionAccount, setSessionAccount] = useState(null);
  const [ctx, setCtx] = useState(null);
  const [permission, setPermission] = useState(null);
  const [botAddress, setBotAddress] = useState("");
  const [loading, setLoading] = useState(false);
  const [switchingChain, setSwitchingChain] = useState(false);
  const [showConfigModal, setShowConfigModal] = useState(false);

  const { address, isConnected, connector } = useAccount();
  const { connect, connectors } = useConnect();
  const publicClient = usePublicClient();
  const chainId = useChainId();
  const { switchChainAsync } = useSwitchChain();
  const { data: walletClient, error: walletError, isLoading: walletLoading, refetch: refetchWallet } = useWalletClient();

 
  useEffect(() => {
    if (!address) return;
    
    const savedPermission = localStorage.getItem(`opipolix_permission_${address}`);
    if (savedPermission) {
      try {
        const parsed = JSON.parse(savedPermission);
        setPermission(parsed);
      } catch (e) {
        
      }
    } else {
      setPermission(null);
    }
    
    const savedBot = localStorage.getItem(`opipolix_bot_address_${address}`);
    setBotAddress(savedBot || "");
  }, [address]);

  
  const handleChainSwitch = useCallback(async () => {
    if (!isConnected || !switchChainAsync || switchingChain) return;
    
    if (walletError?.message?.includes("chain") || walletError?.message?.includes("Chain")) {
      setSwitchingChain(true);
      
      try {
        await switchChainAsync({ chainId: SEPOLIA_CHAIN_ID });
        setTimeout(() => refetchWallet?.(), 500);
      } catch (error) {
        alert("Please manually switch to Sepolia network!");
      } finally {
        setSwitchingChain(false);
      }
    }
  }, [isConnected, switchChainAsync, switchingChain, walletError, refetchWallet]);

  useEffect(() => {
    if (walletError && isConnected) {
      handleChainSwitch();
    }
  }, [walletError, isConnected, handleChainSwitch]);

  
  useEffect(() => {
    async function setup() {
      if (!isConnected || !publicClient || sessionAccount || !address) return;
      
      try {
        const bundlerClient = bundlerClientFactory(SEPOLIA_CHAIN_ID);
        const pimlicoClient = pimlicoClientFactory(SEPOLIA_CHAIN_ID);
        
        const context = await initSmartAccountContext(publicClient, address, bundlerClient, pimlicoClient);
        setSessionAccount(context.sessionAccount);
        setCtx(context);
      } catch (e) {
        
      }
    }
    
    setup();
  }, [isConnected, publicClient, sessionAccount, address]);

  async function handleConnect() {
    const connector = connectors[0];
    if (connector) {
      connect({ connector });
    }
  }

  async function handleGrantPermissions() {
    if (!sessionAccount || !walletClient || !botAddress) {
      alert("Missing required data!");
      return;
    }

    if (!/^0x[a-fA-F0-9]{40}$/.test(botAddress)) {
      alert("Invalid bot address format!");
      return;
    }

    try {
      setLoading(true);
      
      const perm = await grantPermissions(sessionAccount, walletClient, chainId);
      setPermission(perm);
      
      localStorage.setItem(`opipolix_permission_${address}`, JSON.stringify(perm));
      localStorage.setItem(`opipolix_bot_address_${address}`, botAddress);
      
      setShowConfigModal(false);
    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  }

  const ready = isConnected && sessionAccount;
  const walletReady = !!walletClient;
  const hasChainError = walletError?.message?.includes("chain") || walletError?.message?.includes("Chain");

  // Show Dashboard if permission granted
  if (permission && botAddress && ready) {
    return (
      <Dashboard
        sessionAccount={sessionAccount}
        ctx={ctx}
        botAddress={botAddress}
        permission={permission}
        eoaAddress={address}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-500 via-blue-600 to-blue-900 text-white relative overflow-hidden">
      {/* Animated background orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 -left-4 w-96 h-96 bg-orange-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute top-0 -right-4 w-96 h-96 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-96 h-96 bg-orange-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      {/* Header */}
      <header className="relative border-b border-white/20 backdrop-blur-xl bg-white/5">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-blue-500 rounded-full flex items-center justify-center shadow-lg">
              <span className="text-2xl">🚀</span>
            </div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-orange-300 to-blue-300 bg-clip-text text-transparent">
                OpiPoliX AutoTopUp
              </h1>
              <p className="text-xs text-white/70">Powered by ERC-7715</p>
            </div>
          </div>

          {isConnected ? (
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 bg-gradient-to-r from-emerald-500/30 to-green-500/30 backdrop-blur-md border border-emerald-400/40 rounded-xl px-4 py-2 shadow-lg">
                <div className="w-2 h-2 rounded-full bg-emerald-300 animate-pulse"></div>
                <span className="text-sm font-mono font-semibold">
                  {address.slice(0, 6)}...{address.slice(-4)}
                </span>
              </div>
              <button
                onClick={() => {
                  connector?.disconnect?.();
                  window.location.reload();
                }}
                className="text-xs border border-white/30 hover:border-red-500 px-4 py-2 rounded-xl transition"
              >
                DISCONNECT
              </button>
            </div>
          ) : (
            <button
              onClick={handleConnect}
              className="bg-gradient-to-r from-orange-500 to-blue-600 hover:from-orange-600 hover:to-blue-700 px-6 py-2.5 rounded-xl font-bold transition shadow-lg"
            >
              Connect Wallet
            </button>
          )}
        </div>
      </header>

      <main className="relative max-w-7xl mx-auto px-6 py-12">
        {/* Hero */}
        <div className="text-center mb-16">
          <div className="inline-block mb-6">
            <div className="px-6 py-2 bg-white/10 backdrop-blur-md border border-white/30 rounded-full text-sm font-semibold">
              ✨ Automated Balance Management with ERC-7715
            </div>
          </div>
          
          <h2 className="text-6xl font-black mb-6 bg-gradient-to-r from-orange-200 via-white to-blue-200 bg-clip-text text-transparent leading-tight">
            Never Run Out of Balance
            <br />
            <span className="text-5xl">On Any Platform</span>
          </h2>
          
          <p className="text-xl text-white/90 max-w-3xl mx-auto mb-8 leading-relaxed">
            Set up automated top-ups for <span className="font-bold text-orange-300">Polymarket</span>, <span className="font-bold text-blue-300">Kalshi</span>, <span className="font-bold text-orange-300">Opinion</span>, Telegram bots, and any wallet address.
            <br />
            <span className="text-white/70">One permission. Unlimited automation. Zero hassle.</span>
          </p>

          {/* Supported Platforms */}
          <div className="flex items-center justify-center gap-6 mb-12 flex-wrap">
            <div className="px-8 py-4 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl hover:bg-white/20 transition">
              <div className="font-bold text-lg">Polymarket</div>
            </div>
            <div className="px-8 py-4 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl hover:bg-white/20 transition">
              <div className="font-bold text-lg">Kalshi</div>
            </div>
            <div className="px-8 py-4 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl hover:bg-white/20 transition">
              <div className="font-bold text-lg">Opinion</div>
            </div>
            <div className="px-8 py-4 bg-gradient-to-br from-blue-500/20 to-purple-500/20 backdrop-blur-md border border-white/20 rounded-2xl hover:bg-white/20 transition">
              <div className="font-bold text-lg">🤖 Telegram Bots</div>
            </div>
          </div>

          {/* Network Badge */}
          <div className="inline-flex items-center gap-6 bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl px-10 py-5 shadow-2xl">
            <div>
              <div className="text-sm text-white/70 mb-1">Active Network</div>
              <div className="font-bold text-xl bg-gradient-to-r from-orange-300 to-blue-300 bg-clip-text text-transparent">
                Sepolia Testnet
              </div>
            </div>
            <div className="w-px h-14 bg-white/20"></div>
            <div>
              <div className="text-sm text-white/70 mb-1">Status</div>
              <div className="flex items-center gap-2">
                <span className="inline-block w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse shadow-lg shadow-emerald-500/50"></span>
                <span className="text-sm font-bold text-emerald-300">Gasless ✨</span>
              </div>
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-6 mb-16">
          <div className="group bg-white/5 backdrop-blur-xl border border-white/20 rounded-3xl p-8 hover:bg-white/10 hover:border-orange-400/50 transition transform hover:scale-105">
            <div className="text-5xl mb-4 group-hover:scale-110 transition">⚡</div>
            <h3 className="text-2xl font-bold mb-3 text-orange-200">Smart Monitoring</h3>
            <p className="text-white/80 leading-relaxed">
              Agent continuously monitors balances across platforms. Tops up automatically when needed.
            </p>
          </div>

          <div className="group bg-white/5 backdrop-blur-xl border border-white/20 rounded-3xl p-8 hover:bg-white/10 hover:border-blue-400/50 transition transform hover:scale-105">
            <div className="text-5xl mb-4 group-hover:scale-110 transition">🔐</div>
            <h3 className="text-2xl font-bold mb-3 text-blue-200">One Permission</h3>
            <p className="text-white/80 leading-relaxed">
              Grant permission once using ERC-7715. No more constant approvals.
            </p>
          </div>

          <div className="group bg-white/5 backdrop-blur-xl border border-white/20 rounded-3xl p-8 hover:bg-white/10 hover:border-orange-400/50 transition transform hover:scale-105">
            <div className="text-5xl mb-4 group-hover:scale-110 transition">💰</div>
            <h3 className="text-2xl font-bold mb-3 text-orange-200">Zero Gas Fees</h3>
            <p className="text-white/80 leading-relaxed">
              All transactions are gasless via Pimlico Paymaster.
            </p>
          </div>
        </div>

        {/* CTA */}
        {!isConnected ? (
          <div className="text-center bg-gradient-to-br from-orange-500/20 via-blue-600/20 to-purple-600/20 backdrop-blur-xl border border-white/20 rounded-3xl p-16 shadow-2xl">
            <div className="text-6xl mb-6">🚀</div>
            <h3 className="text-4xl font-black mb-4 bg-gradient-to-r from-orange-200 to-blue-200 bg-clip-text text-transparent">
              Ready to Automate?
            </h3>
            <p className="text-xl text-white/80 mb-8 max-w-2xl mx-auto">
              Connect MetaMask Flask and set up automated top-ups
            </p>
            <button
              onClick={handleConnect}
              className="bg-gradient-to-r from-orange-500 to-blue-600 hover:from-orange-600 hover:to-blue-700 px-16 py-5 rounded-2xl font-black text-xl transition shadow-2xl transform hover:scale-105"
            >
              Connect MetaMask Flask
            </button>
          </div>
        ) : (
          <div className="text-center bg-gradient-to-br from-emerald-500/20 via-green-600/20 to-blue-600/20 backdrop-blur-xl border border-emerald-400/30 rounded-3xl p-16 shadow-2xl">
            <div className="text-6xl mb-6 animate-bounce">🎉</div>
            <h3 className="text-4xl font-black mb-4 bg-gradient-to-r from-emerald-200 to-blue-200 bg-clip-text text-transparent">
              Wallet Connected!
            </h3>
            <p className="text-xl text-white/80 mb-8 max-w-2xl mx-auto">
              Configure automated top-ups for your bots and wallets
            </p>
            <button 
              onClick={() => setShowConfigModal(true)}
              disabled={!ready}
              className="bg-gradient-to-r from-emerald-500 to-blue-600 hover:from-emerald-600 hover:to-blue-700 px-16 py-5 rounded-2xl font-black text-xl transition shadow-2xl transform hover:scale-105 disabled:opacity-50"
            >
              {ready ? "Configure Auto Top-Up" : "Initializing..."}
            </button>
          </div>
        )}
      </main>

      {/* Config Modal */}
      {showConfigModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-6">
          <div className="bg-gradient-to-br from-gray-900 to-gray-800 border border-white/20 rounded-3xl p-8 max-w-2xl w-full shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-3xl font-bold bg-gradient-to-r from-orange-200 to-blue-200 bg-clip-text text-transparent">
                Configure Auto Top-Up
              </h3>
              <button 
                onClick={() => setShowConfigModal(false)}
                className="text-white/70 hover:text-white text-2xl"
              >
                ×
              </button>
            </div>

            <div className="bg-black/20 border border-white/20 rounded-2xl p-6 mb-6">
              <div className="text-sm text-white/70 mb-2">Your Wallet</div>
              <div className="text-lg font-mono text-emerald-300 mb-4">
                {address?.slice(0, 8)}...{address?.slice(-6)}
              </div>
              
              <div className="text-sm text-white/70 mb-2">Session Account</div>
              <div className="text-lg font-mono text-blue-300 mb-4">
                {sessionAccount?.address.slice(0, 8)}...{sessionAccount?.address.slice(-6)}
              </div>

              <div className="flex items-center gap-2 text-sm">
                <span className={`w-2 h-2 rounded-full ${walletReady ? 'bg-emerald-400' : 'bg-orange-400'} animate-pulse`}></span>
                <span className="text-white/70">
                  Wallet: {walletReady ? "Ready ✅" : hasChainError ? "Wrong Network ⚠️" : "Loading..."}
                </span>
              </div>

              {hasChainError && (
                <button
                  onClick={handleChainSwitch}
                  disabled={switchingChain}
                  className="mt-4 w-full bg-orange-500 hover:bg-orange-600 px-4 py-2 rounded-xl transition"
                >
                  {switchingChain ? "Switching..." : "Switch to Sepolia"}
                </button>
              )}
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm text-white/70 mb-2 font-semibold">
                  Bot Wallet Address (to top-up)
                </label>
                <input
                  type="text"
                  value={botAddress}
                  onChange={(e) => {
                    const addr = e.target.value;
                    setBotAddress(addr);
                    if (address) {
                      localStorage.setItem(`opipolix_bot_address_${address}`, addr);
                    }
                  }}
                  placeholder="0x..."
                  className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white font-mono outline-none focus:border-orange-400 transition"
                />
                <p className="text-xs text-white/50 mt-2">
                  Enter your Polymarket bot, Opinion bot, or any wallet address
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-black/20 rounded-xl p-4">
                  <div className="text-xs text-white/60 mb-1">ETH Permission</div>
                  <div className="font-mono text-sm text-orange-300">0.1 ETH/day</div>
                </div>
                <div className="bg-black/20 rounded-xl p-4">
                  <div className="text-xs text-white/60 mb-1">USDC Permission</div>
                  <div className="font-mono text-sm text-blue-300">100 USDC/day</div>
                </div>
              </div>

              <button
                onClick={handleGrantPermissions}
                disabled={loading || !botAddress || !walletReady}
                className="w-full bg-gradient-to-r from-orange-500 to-blue-600 hover:from-orange-600 hover:to-blue-700 px-8 py-4 rounded-xl font-bold transition shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "AUTHORIZING..." : !walletReady ? "WAITING..." : "GRANT PERMISSIONS"}
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx global>{`
        @keyframes blob {
          0%, 100% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
        }
        .animate-blob { animation: blob 7s infinite; }
        .animation-delay-2000 { animation-delay: 2s; }
        .animation-delay-4000 { animation-delay: 4s; }
      `}</style>
    </div>
  );
}

import { AppProvider } from "../src/providers/AppProvider";

export default function HomePage() {
  return (
    <AppProvider>
      <HomeContent />
    </AppProvider>
  );
}
