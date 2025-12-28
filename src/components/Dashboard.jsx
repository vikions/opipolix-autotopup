"use client";

import { useState, useEffect } from "react";
import { topUpAssets } from "../lib/smartAccount";

export default function Dashboard({ sessionAccount, ctx, botAddress, permission, eoaAddress }) {
  const [botUsdcBalance, setBotUsdcBalance] = useState("0");
  const [yourUsdcBalance, setYourUsdcBalance] = useState("0");
  
  const [logs, setLogs] = useState([]);
  const [monitoring, setMonitoring] = useState(false);
  

  const [usdcThreshold, setUsdcThreshold] = useState("1");
  const [usdcTopUpAmount, setUsdcTopUpAmount] = useState("1");
  
  const [toppingUpUSDC, setToppingUpUSDC] = useState(false);
  const [lastTopUpTime, setLastTopUpTime] = useState(0);

  const USDC_ADDRESS = "0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238"; // Sepolia USDC

  function addLog(msg) {
    const time = new Date().toLocaleTimeString();
    setLogs((prev) => [`${time}  ${msg}`, ...prev].slice(0, 10));
  }

  
  useEffect(() => {
    if (!ctx || !botAddress) return;
    loadBalances();
  }, [ctx, botAddress]);

  async function loadBalances() {
    if (!ctx || !botAddress) return;

    try {
      
      const botUsdc = await ctx.publicClient.readContract({
        address: USDC_ADDRESS,
        abi: [{
          name: "balanceOf",
          type: "function",
          stateMutability: "view",
          inputs: [{ type: "address" }],
          outputs: [{ type: "uint256" }],
        }],
        functionName: "balanceOf",
        args: [botAddress],
      });
      setBotUsdcBalance((Number(botUsdc) / 1000000).toFixed(2));

      
      const yourUsdc = await ctx.publicClient.readContract({
        address: USDC_ADDRESS,
        abi: [{
          name: "balanceOf",
          type: "function",
          stateMutability: "view",
          inputs: [{ type: "address" }],
          outputs: [{ type: "uint256" }],
        }],
        functionName: "balanceOf",
        args: [eoaAddress],
      });
      setYourUsdcBalance((Number(yourUsdc) / 1000000).toFixed(2));
    } catch (error) {
      
    }
  }

  
  useEffect(() => {
    if (!ctx || !monitoring || !botAddress) return;

    addLog("🟢 Monitoring started");

    const interval = setInterval(async () => {
      try {
        addLog("🔍 Checking balances...");
        
        
        const botUsdc = await ctx.publicClient.readContract({
          address: USDC_ADDRESS,
          abi: [{
            name: "balanceOf",
            type: "function",
            stateMutability: "view",
            inputs: [{ type: "address" }],
            outputs: [{ type: "uint256" }],
          }],
          functionName: "balanceOf",
          args: [botAddress],
        });
        setBotUsdcBalance((Number(botUsdc) / 1000000).toFixed(2));

        
        const yourUsdc = await ctx.publicClient.readContract({
          address: USDC_ADDRESS,
          abi: [{
            name: "balanceOf",
            type: "function",
            stateMutability: "view",
            inputs: [{ type: "address" }],
            outputs: [{ type: "uint256" }],
          }],
          functionName: "balanceOf",
          args: [eoaAddress],
        });
        setYourUsdcBalance((Number(yourUsdc) / 1000000).toFixed(2));

        
        const now = Date.now();
        const cooldown = 30000; 
        
        if (now - lastTopUpTime < cooldown) {
          return;
        }

        const usdcLow = Number(botUsdc) < Number(usdcThreshold) * 1000000;

        
        if (usdcLow && !toppingUpUSDC) {
          setToppingUpUSDC(true);
          setLastTopUpTime(now);
          const topUpAmt = BigInt(Number(usdcTopUpAmount) * 1000000); 
          addLog(`⚡ Bot USDC low! Topping up ${usdcTopUpAmount} USDC...`);
          
          try {
            const result = await topUpAssets(ctx, permission.usdc, {
              to: botAddress,
              amount: topUpAmt,
              token: USDC_ADDRESS,
            });
            addLog(`✅ USDC topped up! Tx: ${result.txHash.slice(0,10)}...`);
          } catch (error) {
           
            if (error.message?.includes('insufficient')) {
              addLog('❌ Insufficient balance');
            } else if (error.message?.includes('permission') || error.message?.includes('Permission')) {
              addLog('❌ Permission error - please re-grant');
            }
           
            console.error('[OpiPoliX] Top-up error:', error);
          } finally {
            setToppingUpUSDC(false);
          }
        }
      } catch (error) {
        addLog("❌ Error checking balances");
      }
    }, 3000); 

    return () => {
      clearInterval(interval);
      addLog("⏸️ Monitoring paused");
    };
  }, [ctx, monitoring, botAddress, usdcThreshold, usdcTopUpAmount]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-500 via-blue-600 to-purple-900 text-white p-6">
      <div className="max-w-6xl mx-auto">
        
        {/* Header */}
        <div className="mb-8 bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-black bg-gradient-to-r from-orange-200 to-blue-200 bg-clip-text text-transparent mb-2">
                Auto Top-Up Dashboard
              </h1>
              <p className="text-white/70 text-sm">
                Monitoring bot: {botAddress.slice(0,6)}...{botAddress.slice(-4)}
              </p>
            </div>
            <button
              onClick={() => setMonitoring(!monitoring)}
              className={`px-8 py-3 rounded-xl font-bold transition transform hover:scale-105 shadow-lg ${
                monitoring
                  ? "bg-red-500 hover:bg-red-600"
                  : "bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700"
              }`}
            >
              {monitoring ? "PAUSE" : "START"}
            </button>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-6 mb-6">
          
          {/* Bot Balance */}
          <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-red-500 rounded-full flex items-center justify-center text-2xl">
                🤖
              </div>
              <div>
                <h2 className="text-xl font-bold">Bot Balance</h2>
                <p className="text-xs text-white/70">Polymarket • Opinion • Kalshi • OpiPoliX</p>
              </div>
            </div>
            <div className="bg-black/20 rounded-xl p-6">
              <div className="text-sm text-white/70 mb-2">USDC Balance</div>
              <div className="text-5xl font-bold text-blue-300 mb-2">{botUsdcBalance}</div>
              <div className="text-xs text-white/50">
                🚨 Alert when below {usdcThreshold} USDC
              </div>
            </div>
          </div>

          {/* Your Balance */}
          <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-2xl">
                💰
              </div>
              <div>
                <h2 className="text-xl font-bold">Your Wallet</h2>
                <p className="text-xs text-white/70">Main funding source for all bots</p>
              </div>
            </div>
            <div className="bg-black/20 rounded-xl p-6">
              <div className="text-sm text-white/70 mb-2">USDC Balance</div>
              <div className="text-5xl font-bold text-blue-300 mb-2">{yourUsdcBalance}</div>
              <div className="text-xs text-white/50">
                💸 Auto top-up source for {botAddress.slice(0,6)}...{botAddress.slice(-4)}
              </div>
            </div>
          </div>
        </div>

        {/* Settings */}
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-6 mb-6">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <span>⚙️</span>
            <span>USDC Auto Top-Up Settings</span>
          </h2>
          <div className="bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-xl p-6 space-y-4">
            <div className="text-sm text-white/80 mb-4">
              Configure when and how much USDC to automatically send to your bot wallet
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="text-sm text-white/70 block mb-2 font-semibold">
                  🚨 Trigger Threshold
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="number"
                    step="0.1"
                    value={usdcThreshold}
                    onChange={(e) => setUsdcThreshold(e.target.value)}
                    className="flex-1 bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white text-lg font-bold outline-none focus:border-blue-400"
                  />
                  <span className="text-white/70 font-semibold">USDC</span>
                </div>
                <p className="text-xs text-white/60 mt-2">
                  Trigger top-up when bot balance drops below this amount
                </p>
              </div>
              <div>
                <label className="text-sm text-white/70 block mb-2 font-semibold">
                  💰 Top-Up Amount
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="number"
                    step="0.1"
                    value={usdcTopUpAmount}
                    onChange={(e) => setUsdcTopUpAmount(e.target.value)}
                    className="flex-1 bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white text-lg font-bold outline-none focus:border-blue-400"
                  />
                  <span className="text-white/70 font-semibold">USDC</span>
                </div>
                <p className="text-xs text-white/60 mt-2">
                  Send this amount to bot when threshold is reached
                </p>
              </div>
            </div>
            <div className="bg-black/30 rounded-lg p-4 mt-4">
              <div className="text-xs text-white/70 mb-1">💡 Example:</div>
              <div className="text-sm text-white/90">
                If bot balance &lt; <span className="font-bold text-blue-300">{usdcThreshold} USDC</span> → Send <span className="font-bold text-emerald-300">{usdcTopUpAmount} USDC</span> automatically
              </div>
            </div>
          </div>
        </div>

        {/* Activity Log */}
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold">Activity Log</h2>
            {monitoring && (
              <div className="text-xs bg-orange-500/20 border border-orange-500/50 rounded-lg px-3 py-1.5 text-orange-200">
                ⚠️ Keep this tab open (background service coming soon)
              </div>
            )}
          </div>
          <div className="bg-black/30 rounded-xl p-4 font-mono text-sm max-h-64 overflow-y-auto">
            {logs.length === 0 ? (
              <div className="text-white/50 text-center py-8">
                No activity yet. Click START to begin monitoring.
              </div>
            ) : (
              logs.map((log, i) => (
                <div key={i} className="text-white/90 py-1">
                  {log}
                </div>
              ))
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
