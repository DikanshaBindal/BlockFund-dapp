BlockFund - Decentralized Crowdfunding dApp

🚀 Introduction

BlockFund is a decentralized crowdfunding platform built on the Ethereum blockchain. It enables project creators to raise funds transparently, while backers can contribute safely via their wallets (MetaMask). Funds are transferred only when the campaign goals are met.

🎯 Features

Create and manage fundraising campaigns.

Contribute to campaigns using Ethereum.

Smart contract ensures goal-based fund release.

Integrated with MetaMask for secure wallet interactions.

🛠 Tech Stack

Solidity: Smart contract language.

Hardhat: Ethereum development framework.

React.js: Frontend library for user interface.

Ethers.js: Ethereum wallet and blockchain interaction library.

MetaMask: Wallet integration.

⚙️ Prerequisites

Make sure you have the following installed:

Node.js

npm

MetaMask

Text Editor (e.g., VS Code)


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


---

## ⚙️ Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/blockfund.git
cd blockfund

2. Install Dependencies & Compile Contracts
npm install
npx hardhat compile

3. Deploy the Contract
npx hardhat run scripts/deploy.js --network <network-name>

4. Set Up the Frontend
cd frontend
npm install
npm start

💡 Features
✅ Create & fund campaigns using ETH

🕒 Deadline & goal-based fund release

🔒 Secure transaction history

👛 MetaMask wallet integration

📌 Future Improvements
Campaign images via IPFS

Contributor analytics

Admin dashboard



