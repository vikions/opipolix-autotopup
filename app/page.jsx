"use client";

import { useState } from "react";
import { useAccount, useConnect } from "wagmi";
import { useNetwork } from "../src/providers/AppProvider";
import { NETWORKS } from "../src/lib/networks";
import Image from "next/image";

function HomeContent() {
  const { address, isConnected } = useAccount();
  const { connect, connectors } = useConnect();
  const { network, setNetwork, networkConfig } = useNetwork();

  function handleConnect() {
    const connector = connectors[0];
    if (connector) {
      connect({ connector });
    }
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

          <div className="flex items-center gap-4">
            <select
              value={network}
              onChange={(e) => setNetwork(e.target.value)}
              className="bg-white/10 backdrop-blur-md border border-white/30 rounded-xl px-4 py-2 text-sm font-medium hover:bg-white/20 transition cursor-pointer"
            >
              {Object.entries(NETWORKS).map(([key, net]) => (
                <option key={key} value={key} className="bg-gray-900">
                  {net.name}
                </option>
              ))}
            </select>

            {isConnected ? (
              <div className="flex items-center gap-2 bg-gradient-to-r from-emerald-500/30 to-green-500/30 backdrop-blur-md border border-emerald-400/40 rounded-xl px-4 py-2 shadow-lg">
                <div className="w-2 h-2 rounded-full bg-emerald-300 animate-pulse shadow-lg shadow-emerald-500/50"></div>
                <span className="text-sm font-mono font-semibold">
                  {address.slice(0, 6)}...{address.slice(-4)}
                </span>
              </div>
            ) : (
              <button
                onClick={handleConnect}
                className="bg-gradient-to-r from-orange-500 to-blue-600 hover:from-orange-600 hover:to-blue-700 px-6 py-2.5 rounded-xl font-bold transition shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                Connect Wallet
              </button>
            )}
          </div>
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
            <div className="relative px-8 py-4 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl hover:bg-white/20 transition overflow-hidden group">
              <div className="absolute inset-0 opacity-20 group-hover:opacity-30 transition">
                <img src="/polymarket.png" alt="Polymarket" className="w-full h-full object-cover" />
              </div>
              <div className="relative font-bold text-lg">Polymarket</div>
            </div>
            <div className="relative px-8 py-4 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl hover:bg-white/20 transition overflow-hidden group">
              <div className="absolute inset-0 opacity-20 group-hover:opacity-30 transition">
                <img src="/kalshi.png" alt="Kalshi" className="w-full h-full object-cover" />
              </div>
              <div className="relative font-bold text-lg">Kalshi</div>
            </div>
            <div className="relative px-8 py-4 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl hover:bg-white/20 transition overflow-hidden group">
              <div className="absolute inset-0 opacity-20 group-hover:opacity-30 transition">
                <img src="/opinion.png" alt="Opinion" className="w-full h-full object-cover" />
              </div>
              <div className="relative font-bold text-lg">Opinion</div>
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
                {networkConfig.name}
              </div>
            </div>
            <div className="w-px h-14 bg-white/20"></div>
            <div>
              <div className="text-sm text-white/70 mb-1">Status</div>
              <div className="flex items-center gap-2">
                <span className="inline-block w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse shadow-lg shadow-emerald-500/50"></span>
                <span className="text-sm font-bold text-emerald-300">
                  {networkConfig.gasless ? "Gasless ✨" : "Gas Required"}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-6 mb-16">
          <div className="group bg-white/5 backdrop-blur-xl border border-white/20 rounded-3xl p-8 hover:bg-white/10 hover:border-orange-400/50 transition transform hover:scale-105 hover:shadow-2xl">
            <div className="text-5xl mb-4 group-hover:scale-110 transition">⚡</div>
            <h3 className="text-2xl font-bold mb-3 text-orange-200">Smart Monitoring</h3>
            <p className="text-white/80 leading-relaxed">
              Agent continuously monitors balances across Polymarket, Kalshi, Opinion, and bot wallets. Tops up automatically when needed.
            </p>
          </div>

          <div className="group bg-white/5 backdrop-blur-xl border border-white/20 rounded-3xl p-8 hover:bg-white/10 hover:border-blue-400/50 transition transform hover:scale-105 hover:shadow-2xl">
            <div className="text-5xl mb-4 group-hover:scale-110 transition">🔐</div>
            <h3 className="text-2xl font-bold mb-3 text-blue-200">One Permission</h3>
            <p className="text-white/80 leading-relaxed">
              Grant permission once using ERC-7715 Advanced Permissions. No more constant approvals for every transaction.
            </p>
          </div>

          <div className="group bg-white/5 backdrop-blur-xl border border-white/20 rounded-3xl p-8 hover:bg-white/10 hover:border-orange-400/50 transition transform hover:scale-105 hover:shadow-2xl">
            <div className="text-5xl mb-4 group-hover:scale-110 transition">💰</div>
            <h3 className="text-2xl font-bold mb-3 text-orange-200">Zero Gas Fees</h3>
            <p className="text-white/80 leading-relaxed">
              All top-up transactions are gasless via Pimlico Paymaster. You never pay for gas on transfers.
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
              Connect your MetaMask Flask wallet and set up automated top-ups for all your prediction market accounts and bots
            </p>
            <button
              onClick={handleConnect}
              className="bg-gradient-to-r from-orange-500 to-blue-600 hover:from-orange-600 hover:to-blue-700 px-16 py-5 rounded-2xl font-black text-xl transition shadow-2xl hover:shadow-orange-500/50 transform hover:scale-105"
            >
              Connect MetaMask Flask
            </button>
            <p className="text-sm text-white/60 mt-6 flex items-center justify-center gap-2">
              <span>⚠️</span>
              <span>Requires MetaMask Flask for ERC-7715 Advanced Permissions support</span>
            </p>
          </div>
        ) : (
          <div className="text-center bg-gradient-to-br from-emerald-500/20 via-green-600/20 to-blue-600/20 backdrop-blur-xl border border-emerald-400/30 rounded-3xl p-16 shadow-2xl">
            <div className="text-6xl mb-6 animate-bounce">🎉</div>
            <h3 className="text-4xl font-black mb-4 bg-gradient-to-r from-emerald-200 to-blue-200 bg-clip-text text-transparent">
              Wallet Connected!
            </h3>
            <p className="text-xl text-white/80 mb-8 max-w-2xl mx-auto">
              You're all set to configure automated top-ups for Polymarket, Kalshi, Opinion, and bot wallets
            </p>
            <button className="bg-gradient-to-r from-emerald-500 to-blue-600 hover:from-emerald-600 hover:to-blue-700 px-16 py-5 rounded-2xl font-black text-xl transition shadow-2xl hover:shadow-emerald-500/50 transform hover:scale-105">
              Configure Auto Top-Up
            </button>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="relative border-t border-white/20 backdrop-blur-xl bg-white/5 mt-20">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            <div className="text-white/70 text-sm">
              <p className="font-semibold mb-1">Built for MetaMask </p>
              <p>Powered by ERC-7715 Advanced Permissions • Pimlico • viem • wagmi</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="px-4 py-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl">
                <span className="font-bold text-orange-300">🤖 OpiPoliX</span>
              </div>
            </div>
          </div>
        </div>
      </footer>

      <style jsx global>{`
        @keyframes blob {
          0% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
          100% {
            transform: translate(0px, 0px) scale(1);
          }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
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
