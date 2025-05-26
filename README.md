# BlockFund - Decentralized Crowdfunding dApp

## 🚀 Introduction

BlockFund is a decentralized crowdfunding platform built on the Ethereum blockchain. It enables project creators to raise funds transparently, while backers can contribute safely via their wallets (MetaMask). Funds are transferred only when the campaign goals are met.

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

## 📃 License

This project is licensed under the MIT License.

---

## 📞 Contact

* Project Lead: Dikansha Bindal
* GitHub: DikanshaBindal
* Email: dikanshabindal@gmail.com

---

Happy building with BlockFund! ✨



