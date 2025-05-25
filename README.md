# 🚀 BlockFund - Decentralized Crowdfunding Platform

BlockFund is a decentralized crowdfunding DApp built on Ethereum using smart contracts. Campaign creators can raise funds securely, and contributors fund campaigns using MetaMask. Funds are only transferred if goals are met.

---

## 🧱 Tech Stack

- **Solidity** – Smart Contract Language  
- **React.js** – Frontend Framework  
- **Hardhat** – Ethereum Development Environment  
- **Ethers.js** – Ethereum JavaScript Library  
- **MetaMask** – Wallet Integration

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



