# BlockFund - Decentralized Crowdfunding dApp

## 📝 Introduction

BlockFund is a decentralized crowdfunding platform that leverages blockchain technology to ensure transparency, security, and trust between fundraisers and donors. Unlike traditional crowdfunding platforms that act as centralized authorities, BlockFund eliminates intermediaries and empowers users to directly contribute to causes and startups with complete visibility over fund utilization.

By integrating smart contracts on the Ethereum blockchain, the system automates the funding process, milestone-based fund release, and dispute resolution mechanisms. The platform includes a user-friendly frontend interface, a robust smart contract backend, wallet connectivity (MetaMask integration), and features like campaign creation, fund tracking, balance monitoring, and a secure dashboard for users.

BlockFund aims to bring a shift in the way funding ecosystems function — from being opaque and authority-driven to transparent and community-governed.

## 🚀 Project Vision

Our vision for BlockFund is to create a globally accessible, tamper-proof, and fair crowdfunding ecosystem where innovation and social causes thrive without barriers. We envision a platform where:

Creators, innovators, and NGOs can raise funds globally without relying on third-party intermediaries.

Every transaction is traceable and verifiable, enhancing donor trust.

Fund release is governed by smart contracts, ensuring accountability.

A community-driven reputation system rewards honesty and innovation.

Cross-border donations and funding become seamless and gas-efficient.

Through BlockFund, we aim to democratize access to funding and create a world where ideas flourish because of collective trust, not centralized control.


## 🎯 Features

* Create and manage fundraising campaigns.
* Contribute to campaigns using Ethereum.
* Smart contract ensures goal-based fund release.
* Integrated with MetaMask for secure wallet interactions.

---
## 📁 Project Structure

blockfund/
├── contracts/ # Smart contract files (Solidity)
├── scripts/ # Deployment scripts
├── frontend/ # React frontend
│ └── src/
│ ├── App.js
│ ├── components/
│ └── contractABI.js
├── hardhat.config.js # Hardhat configuration
└── README.md

## 🔭 Future Scope
BlockFund is designed with scalability and extensibility in mind. In future releases, the platform could evolve into a full-fledged Web3 fundraising ecosystem with the following features:

Multi-chain Support: Integrate other EVM-compatible blockchains like Polygon, Binance Smart Chain, and Aptos for lower gas fees and faster transactions.

DAO Integration: Implement a decentralized governance model where the community votes on campaigns, funding decisions, and platform rules.

KYC & Compliance Module: Onboard verifiable ID processes for campaigns that require legal compliance (especially for NGOs and health-related fundraisers).

Mobile App Development: A fully responsive mobile application for real-time campaign monitoring and fund contribution.

NFT Rewards: Introduce campaign-specific NFTs as rewards for donors, which can also hold real-world benefits or resale value.

Analytics Dashboard: Advanced visual analytics to track funding trends, campaign success rates, and donor behavior.

AI-Powered Campaign Recommendations: Suggest trending and verified campaigns to users based on donation history and preferences.

Integration with UPI/Crypto Onramps: Make it easy for non-crypto users to donate using fiat currency through payment gateways.

## 🛠 Tech Stack

* **Solidity**: Smart contract language.
* **Hardhat**: Ethereum development framework.
* **React.js**: Frontend library for user interface.
* **Ethers.js**: Ethereum wallet and blockchain interaction library.
* **MetaMask**: Wallet integration.

---

## ⚙️ Prerequisites

Make sure you have the following installed:

* [Node.js](https://nodejs.org/)
* [npm](https://www.npmjs.com/)
* [MetaMask](https://metamask.io/)
* Text Editor (e.g., VS Code)

---

## 📦 Project Setup

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/blockfund.git
cd blockfund
```

### 2. Install Dependencies

#### For Smart Contract (Hardhat)

```bash
npm install
```

#### For Frontend (React)

```bash
cd frontend
npm install
```

### 3. Compile & Deploy Contract

```bash
npx hardhat compile
npx hardhat run scripts/deploy.js --network testnet
```

> After deployment, note the contract address and update it in the frontend.

---

## 🔗 Configure Frontend

### 4. Set Up ABI and Address

* Copy the `ABI` from `artifacts/contracts/YourContract.sol/YourContract.json`.
* Create a new file `contract.js` inside `frontend/src`:

```javascript
export const contractABI = [/* paste your ABI here */];
export const contractAddress = "0xYourDeployedContractAddress";
```

### 5. Start Frontend

```bash
cd frontend
npm start
```

The app will run at `http://localhost:3000`

---

## 🌐 MetaMask Testnet Configuration

To interact with your contract, switch MetaMask to the test network (e.g., Goerli or Core Testnet).

## 🧪 Testing

You can write your contract tests inside the `/test` folder and run them using:

```bash
npx hardhat test
```

---

## 🤝 Contributing

We welcome contributions! Please fork the repository and open a pull request with your changes.

---


## 📞 Contact

* Project Lead: Dikansha Bindal
* GitHub: DikanshaBindal
* Email: dikanshabindal@gmail.com

---

Happy building with BlockFund! ✨



