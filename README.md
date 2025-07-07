# 🐮 MetaCow — Social DeFi Trading with Identity & Rewards

MetaCow is a decentralized exchange that blends token swaps, liquidity provisioning, and social trading into a unified on-chain identity experience. Built entirely during the **MetaMask Card Dev Cook-Off hackathon**, MetaCow aims to explore real-world card use cases through **wallet-based reputation**, **USDC rewards**, and **copy trading**.

> 🔴 **Live Demo:** [https://metacow.vercel.app](https://metacow.vercel.app)  
> 🎥 **Video Demo:** [YouTube](https://youtu.be/mpHBX2n_N4s?feature=shared)  
> ⛓️ **Chain:** Sepolia Testnet  

> 🧑‍💻 **Deployer:** `0xF8A440f0c3912F42dF794983B8164cB6572fCBCC`  
> 🏗 **Pair Logic:** `0x08B31808f3E5f3B2Ce90b4067D475F92D02ceE31`  
> 🏭 **Factory Proxy:** `0x3048E6BFA6D505ad07D29284b6bA22521A80D06F`  
> 💵 **USDC (Circle Faucet):** `0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238`
>**Tokens**const tokenList = [
  { symbol: "TKA", address: "0x1e792D4c34c3d04Bd127aFEf0c1696E912c755aa" },
  { symbol: "TKB", address: "0x9e53abdDBFa9DC6A9bCD9D0e5DD7144F2701718D" },
  { symbol: "USDT", address: "0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238" },
  { symbol: "MOO", address: "0xA18938653750B70DCBbC0DF5a03D9F2e5958D8E8" },
];

---

## 🚀 What We Built

MetaCow is more than a DEX — it’s a **social finance platform** powered by on-chain activity. It transforms your wallet into your identity:

- 🔁 **Swap tokens**, including stablecoin USDC
- 💧 **Provide liquidity** and **earn rewards**
- 🧠 **Follow** and **copy** high-performing traders
- 📊 **Build reputation** based on your DeFi activity
- 🪙 **Claim test tokens** via MetaCow or Circle’s USDC faucet

---

## 🔐 Integration Highlights

- ✅ **MetaMask SDK**: Enables secure, direct wallet connection and transaction signing with minimal friction
- ✅ **Circle USDC**: Supported as a native token across swaps and LPs; USDC tokens are claimable via [faucet.circle.com](https://faucet.circle.com)
- ✅ **Upgradeable contracts**: Built with OpenZeppelin’s transparent proxy standard

---

## 🎯 Real-World Relevance

MetaCow maps directly to the MetaMask Card vision:

| Use Case | Implementation |
|----------|----------------|
| **Card-linked identity** | Profiles with history, avatar, wallet-based scores |
| **Stablecoin usage**     | Full support for USDC via Circle faucet integration |
| **DeFi-based rewards**   | LP tokens generate reward flows and build reputation |
| **Copy-trading triggers**| 1-click replicate trades from top wallets |
| **Social exploration**   | Follow wallets, view public profiles, compare stats |

---

## 🧩 Core Features

| Feature               | Description                                                                 |
|-----------------------|-----------------------------------------------------------------------------|
| 🔁 Token Swapping      | Trade any listed ERC20 pair (e.g., ETH ⇄ USDC)                              |
| 💧 Liquidity Provision | Add/remove LP and earn rewards                                              |
| 👤 Social Trading      | Follow wallets, view trades, copy recent actions                            |
| 🧠 Reputation Score     | Wallet score based on swap volume, LP, and engagement                      |
| 🪙 Faucet Integration   | Built-in token faucet + official Circle USDC faucet                        |
| 🛠 MetaMask SDK        | Seamless wallet login + transaction flow                                   |
| 🏗 Upgradeable Logic    | Transparent proxy pattern using Hardhat + OpenZeppelin                     |

---

## 🔧 Tech Stack

- **Frontend:** React, TailwindCSS, Ethers.js, MetaMask SDK
- **Smart Contracts:** Solidity, Hardhat, OpenZeppelin (ERC20, Upgradeable, Proxy)
- **Chain:** Sepolia (Ethereum testnet)
- **Backend:** Firebase + optional MongoDB cache (for stats, profiles, follow graph)

---

## 🧪 Local Setup Instructions

### 1. Install dependencies
```bash
npm install


## 🧪 How to Run Locally

1. **Install dependencies**
```bash
npm install
Setup environment variables

env
Copy
Edit
VITE_FACTORY_ADDRESS=0xYourFactory
VITE_CHAIN_ID=11155111
VITE_CIRCLE_FAUCET_URL=https://faucet.circle.com/
Start frontend

bash
Copy
Edit
npm run dev
Deploy contracts (optional)

bash
Copy
Edit
npx hardhat deploy --network sepolia
🧾 Contract Addresses (Sepolia Testnet)
Contract	Address
Factory Proxy	0x... (replace with your address)
USDC Token (Circle)	0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238
Sample Pair	0x... (optional)
```
📺 Demo Preview





🙋‍♀️ Built By
Dhruv Pancholi
Suhani Sharma





