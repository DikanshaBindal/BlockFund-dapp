import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import blockfundAbi from "./BlockFund.json"; // adjust path if needed

const CONTRACT_ADDRESS = "0x46B5703DD667359E9B1DfBA5EA60C8b4337405b9";

let provider;
let signer;
let contract;

// Helpers
function parseEth(amount) {
  try {
    return ethers.parseEther(amount.toString());
  } catch {
    throw new Error("Invalid ETH amount");
  }
}

function formatEth(amount) {
  try {
    return ethers.formatEther(amount);
  } catch {
    return "0";
  }
}

// Contract interaction functions
async function init() {
  if (!window.ethereum) {
    alert("MetaMask not detected! Please install MetaMask.");
    return null;
  }

  provider = new ethers.BrowserProvider(window.ethereum);
  await provider.send("eth_requestAccounts", []);
  signer = await provider.getSigner();

  contract = new ethers.Contract(CONTRACT_ADDRESS, blockfundAbi, signer);

  console.log("Connected with account:", await signer.getAddress());
  return await signer.getAddress();
}

async function createCampaign(title, description, goalEth, durationSeconds) {
  const goal = parseEth(goalEth);
  const tx = await contract.createCampaign(title, description, goal, durationSeconds);
  await tx.wait();
}

async function fundCampaign(id, amountEth) {
  const amount = parseEth(amountEth);
  const tx = await contract.fundCampaign(id, { value: amount });
  await tx.wait();
}

async function getCampaign(id) {
  const campaign = await contract.getCampaign(id);
  return {
    creator: campaign.creator,
    title: campaign.title,
    description: campaign.description,
    goal: formatEth(campaign.goal),
    raised: formatEth(campaign.raised),
    deadline: new Date(Number(campaign.deadline) * 1000).toLocaleString(),
    status: campaign.status,
    completed: campaign.completed,
  };
}

// React Component
export default function App() {
  const [account, setAccount] = useState(null);
  const [campaignId, setCampaignId] = useState("");
  const [campaign, setCampaign] = useState(null);

  const [newTitle, setNewTitle] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [newGoal, setNewGoal] = useState("");
  const [newDuration, setNewDuration] = useState("");

  const [fundId, setFundId] = useState("");
  const [fundAmount, setFundAmount] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    async function connect() {
      try {
        const acc = await init();
        setAccount(acc);
      } catch (err) {
        setError("Failed to connect wallet: " + err.message);
      }
    }
    connect();
  }, []);

  async function handleCreateCampaign() {
    if (!newTitle || !newDesc || !newGoal || !newDuration) {
      alert("Please fill all campaign fields");
      return;
    }
    setLoading(true);
    setError("");
    try {
      await createCampaign(newTitle, newDesc, newGoal, Number(newDuration));
      alert("Campaign created!");
      setNewTitle("");
      setNewDesc("");
      setNewGoal("");
      setNewDuration("");
    } catch (err) {
      setError("Error creating campaign: " + err.message);
    }
    setLoading(false);
  }

  async function handleLoadCampaign() {
    if (!campaignId) {
      alert("Enter campaign ID");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const c = await getCampaign(Number(campaignId));
      setCampaign(c);
    } catch (err) {
      setError("Error loading campaign: " + err.message);
      setCampaign(null);
    }
    setLoading(false);
  }

  async function handleFundCampaign() {
    if (!fundId || !fundAmount) {
      alert("Enter funding campaign ID and amount");
      return;
    }
    setLoading(true);
    setError("");
    try {
      await fundCampaign(Number(fundId), fundAmount);
      alert("Funded campaign!");
      setFundId("");
      setFundAmount("");
    } catch (err) {
      setError("Error funding campaign: " + err.message);
    }
    setLoading(false);
  }

  return (
    <div style={{ padding: 20, fontFamily: "Arial, sans-serif", maxWidth: 600, margin: "auto" }}>
      <h1>BlockFund DApp</h1>
      <p><b>Connected account:</b> {account ?? "Not connected"}</p>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <hr />

      <h2>Create Campaign</h2>
      <input
        placeholder="Title"
        value={newTitle}
        onChange={(e) => setNewTitle(e.target.value)}
        style={{ width: "100%", marginBottom: 5 }}
        disabled={loading}
      />
      <textarea
        placeholder="Description"
        value={newDesc}
        onChange={(e) => setNewDesc(e.target.value)}
        style={{ width: "100%", marginBottom: 5 }}
        disabled={loading}
      />
      <input
        placeholder="Goal (ETH)"
        value={newGoal}
        onChange={(e) => setNewGoal(e.target.value)}
        style={{ width: "100%", marginBottom: 5 }}
        type="number"
        min="0"
        step="any"
        disabled={loading}
      />
      <input
        placeholder="Duration (seconds)"
        value={newDuration}
        onChange={(e) => setNewDuration(e.target.value)}
        style={{ width: "100%", marginBottom: 5 }}
        type="number"
        min="1"
        disabled={loading}
      />
      <button onClick={handleCreateCampaign} style={{ width: "100%", padding: 10 }} disabled={loading}>
        {loading ? "Processing..." : "Create Campaign"}
      </button>

      <hr />

      <h2>Load Campaign</h2>
      <input
        placeholder="Campaign ID"
        value={campaignId}
        onChange={(e) => setCampaignId(e.target.value)}
        style={{ width: "100%", marginBottom: 5 }}
        type="number"
        min="0"
        disabled={loading}
      />
      <button onClick={handleLoadCampaign} style={{ width: "100%", padding: 10 }} disabled={loading}>
        {loading ? "Loading..." : "Load Campaign"}
      </button>

      {campaign && (
        <div style={{ marginTop: 20, padding: 10, border: "1px solid #ccc", borderRadius: 4 }}>
          <h3>{campaign.title}</h3>
          <p><b>Description:</b> {campaign.description}</p>
          <p><b>Creator:</b> {campaign.creator}</p>
          <p><b>Goal:</b> {campaign.goal} ETH</p>
          <p><b>Raised:</b> {campaign.raised} ETH</p>
          <p><b>Deadline:</b> {campaign.deadline}</p>
          <p><b>Status:</b> {["Active", "Successful", "Failed", "Withdrawn"][campaign.status]}</p>
          <p><b>Completed:</b> {campaign.completed ? "Yes" : "No"}</p>
        </div>
      )}

      <hr />

      <h2>Fund Campaign</h2>
      <input
        placeholder="Campaign ID"
        value={fundId}
        onChange={(e) => setFundId(e.target.value)}
        style={{ width: "100%", marginBottom: 5 }}
        type="number"
        min="0"
        disabled={loading}
      />
      <input
        placeholder="Amount (ETH)"
        value={fundAmount}
        onChange={(e) => setFundAmount(e.target.value)}
        style={{ width: "100%", marginBottom: 5 }}
        type="number"
        min="0"
        step="any"
        disabled={loading}
      />
      <button onClick={handleFundCampaign} style={{ width: "100%", padding: 10 }} disabled={loading}>
        {loading ? "Processing..." : "Fund Campaign"}
      </button>
    </div>
  );
};


