# OpiPoliX AutoTopUp 🚀

**Automated balance management for Polymarket, Kalshi, Opinion, and Telegram bots using ERC-7715 Advanced Permissions**

[![Built with Next.js](https://img.shields.io/badge/Next.js-15-black)](https://nextjs.org/)
[![MetaMask](https://img.shields.io/badge/MetaMask-Flask-orange)](https://metamask.io/flask/)
[![ERC-7715](https://img.shields.io/badge/ERC--7715-Advanced%20Permissions-blue)](https://eips.ethereum.org/EIPS/eip-7715)
[![Pimlico](https://img.shields.io/badge/Pimlico-Paymaster-green)](https://pimlico.io/)

---

## Advanced Permissions Usage: src/lib/smartAccount.js (Lines 48-117) src/lib/smartAccount.js (Lines 127-193) app/page.jsx (Lines 108-128)
Social Media: https://x.com/opipolixbot/status/2005055793163554845?s=20
---

## 📋 **Overview**

OpiPoliX AutoTopUp is an automated balance management system that monitors your prediction market bots and wallets, automatically topping them up when balances run low. Built on ERC-7715 Advanced Permissions, it enables gasless, autonomous top-ups with a single permission grant.

### **Key Features**

- ⚡ **Smart Monitoring**: Automatically monitors bot balances every 3 seconds
- 🔐 **One Permission**: Grant once, automate forever (30-day permissions)
- 💰 **Zero Gas Fees**: All top-ups are gasless via Pimlico Paymaster
- 🤖 **Multi-Platform**: Supports Polymarket, Kalshi, Opinion, and Telegram bots
- 🔄 **USDC-Only**: Focused on USDC transfers (ETH support available)
- ⚙️ **Configurable**: Set custom thresholds and top-up amounts

---

## 🛠️ **Tech Stack**

- **Frontend**: Next.js 15, React, Tailwind CSS
- **Blockchain**: Ethereum Sepolia (testnet)
- **Smart Accounts**: MetaMask Smart Accounts Kit (Hybrid Implementation)
- **Permissions**: ERC-7715 Advanced Permissions
- **Wallet**: wagmi, viem
- **Gasless Transactions**: Pimlico Paymaster & Bundler
- **Account Abstraction**: ERC-4337 UserOperations

---

## 🚀 **Quick Start**

### **Prerequisites**

- **MetaMask Flask** (required for ERC-7715 support)
  - Download: [metamask.io/flask](https://metamask.io/flask/)
- **Node.js 18+** and **npm**

### **Installation**

```bash
# Clone repository
git clone https://github.com/yourusername/opipolix-autotopup.git
cd opipolix-autotopup

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local

# Add your Pimlico API key to .env.local
NEXT_PUBLIC_PIMLICO_API_KEY=your_key_here

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## 📖 **How It Works**

### **1. Session Account Creation**

When you connect, OpiPoliX creates a **session account** (Hybrid Smart Account). This session account will execute top-ups on your behalf.

### **2. Grant Permissions**

You grant the session account two permissions using ERC-7715:

- **ETH Permission**: 0.1 ETH per day
- **USDC Permission**: 100 USDC per day

These permissions allow the session account to transfer tokens **without requiring approval for each transaction**.

### **3. Monitoring**

The dashboard monitors your bot's balance every 3 seconds. When the balance drops below your configured threshold, it automatically triggers a top-up.

### **4. Gasless Top-Ups**

Top-ups are executed as **UserOperations** with delegation:
- The session account sends the operation
- Pimlico Paymaster sponsors the gas
- Your bot receives USDC instantly

---

## 🔧 **Configuration**

### **Environment Variables**

```env
# Pimlico API Key (required)
NEXT_PUBLIC_PIMLICO_API_KEY=pim_xxxxx

# RPC URLs (optional, has defaults)
NEXT_PUBLIC_SEPOLIA_RPC_URL=https://ethereum-sepolia-rpc.publicnode.com
```

### **Dashboard Settings**

- **USDC Threshold**: Minimum balance before top-up triggers (default: 1 USDC)
- **USDC Top-Up Amount**: Amount to send per top-up (default: 1 USDC)
- **Cooldown**: 30 seconds between top-ups (prevents spam)

---

## 📂 **Project Structure**

```
opipolix-autotopup/
├── app/
│   └── page.jsx                 # Landing page + config modal
├── src/
│   ├── components/
│   │   └── Dashboard.jsx        # Monitoring dashboard
│   ├── lib/
│   │   ├── smartAccount.js      # Session accounts & permissions
│   │   └── networks.js          # Network configurations
│   ├── services/
│   │   ├── bundlerClient.js     # Pimlico bundler
│   │   └── pimlicoClient.js     # Pimlico paymaster
│   └── providers/
│       └── AppProvider.jsx      # wagmi configuration
├── .env.local                   # Environment variables
└── package.json
```

---


### **Best Practices**

✅ Only grant permissions on Sepolia testnet for testing  
✅ Use small amounts for production testing  
✅ Monitor the Activity Log for all operations  
✅ Revoke permissions when not in use  

---

## 🧪 **Testing**

### **Test Flow**

1. **Connect MetaMask Flask** to Sepolia
2. **Configure bot address** (use a test wallet)
3. **Grant permissions** (approve in MetaMask Flask)
4. **Fund your main wallet** with Sepolia USDC
5. **Set threshold** to trigger top-up
6. **Start monitoring** and watch Activity Log

### **Test USDC Address (Sepolia)**

```
0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238
```

Get test USDC from [Sepolia faucets](https://faucets.chain.link/)

---


## 🚧 **Roadmap**

- [ ] **Polygon Mainnet**: Production deployment with real USDC
- [ ] **Multi-Token Support**: Add support for other ERC-20 tokens
- [ ] **Email/Telegram Alerts**: Notifications for top-ups and low balance
- [ ] **Historical Analytics**: Charts and stats for top-up history
- [ ] **Mobile App**: React Native version

---

## 🤝 **Contributing**

Contributions welcome! Please:

1. Fork the repo
2. Create a feature branch (`git checkout -b feature/amazing`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing`)
5. Open a Pull Request

---

## 📄 **License**

MIT License - see [LICENSE](LICENSE) file

---

## 🙏 **Acknowledgments**

- **MetaMask** for ERC-7715 Advanced Permissions support
- **Pimlico** for gasless transaction infrastructure
- **viem** and **wagmi** for excellent developer tools

---

## 📞 **Contact**

- **Project**: [github.com/yourusername/opipolix-autotopup](https://github.com/vikions/opipolix-autotopup)
- **Demo**: [opipolix-autotopup.vercel.app](https://opipolix-autotopup.vercel.app)
- **Twitter**: [@OpiPoliX](https://x.com/opipolixbot)




