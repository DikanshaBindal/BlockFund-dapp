import React, { useEffect, useState } from "react";
import { ethers } from "ethers"; // ethers v6 uses native bigint internally
import BlockFundABI from "./BlockFund.json";
import "./App.css";

const CONTRACT_ADDRESS = "0x3807461C6c4A111404B8408463786F51fa827a5a";

function App() {
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [contract, setContract] = useState(null);
  const [account, setAccount] = useState(null);

  const [projectCount, setProjectCount] = useState(0);
  const [projects, setProjects] = useState([]);

  const [newProject, setNewProject] = useState({
    name: "",
    summary: "",
    goal: "",
    durationDays: "",
  });

  const [backingAmount, setBackingAmount] = useState("");
  const [selectedProjectId, setSelectedProjectId] = useState(null);

  const [phaseInput, setPhaseInput] = useState({
    note: "",
    goal: "",
  });

  const [voteInput, setVoteInput] = useState({
    projectId: "",
    phaseId: "",
    support: true,
  });

  // Format BigInt wei to ETH string safely
  function formatEth(value) {
    try {
      if (value === undefined || value === null) return "0";
      // ethers v6 formatEther accepts bigint or string
      return ethers.formatEther(value);
    } catch {
      return "0";
    }
  }

  // Connect wallet using ethers v6 BrowserProvider
  const connectWallet = async () => {
    if (!window.ethereum) {
      alert("MetaMask not detected");
      return;
    }
    try {
      const prov = new ethers.BrowserProvider(window.ethereum);
      await window.ethereum.request({ method: "eth_requestAccounts" });
      const signer = await prov.getSigner();
      const contract = new ethers.Contract(CONTRACT_ADDRESS, BlockFundABI.abi, signer);
      setProvider(prov);
      setSigner(signer);
      setAccount(await signer.getAddress());
      setContract(contract);
    } catch (err) {
      console.error("Wallet connection error:", err);
    }
  };

  const loadProjectCount = async () => {
    if (!contract) return;
    try {
      const count = await contract.getProjectCount();
      setProjectCount(Number(count));
    } catch (err) {
      console.error("Error fetching project count:", err);
    }
  };

  const loadProjects = async () => {
    if (!contract || projectCount === 0) {
      setProjects([]);
      return;
    }
    try {
      const loadedProjects = [];
      for (let i = 1; i <= projectCount; i++) {
        try {
          const p = await contract.fetchProject(i);
          loadedProjects.push({
            id: i,
            initiator: p[0],
            name: p[1],
            summary: p[2],
            goalAmount: p[3],
            raisedAmount: p[4],
            expiry: Number(p[5]),
            active: p[6],
            phaseCount: Number(p[7]),
          });
        } catch {
          // Project may have been removed, skip silently
        }
      }
      setProjects(loadedProjects);
    } catch (err) {
      console.error("Error loading projects:", err);
    }
  };

  useEffect(() => {
    loadProjectCount();
  }, [contract]);

  useEffect(() => {
    loadProjects();
  }, [projectCount, contract]);

  useEffect(() => {
    connectWallet();
  }, []);

  // Helper: safely parse ETH input to BigInt wei
  const parseEth = (value) => {
    try {
      return ethers.parseEther(value || "0");
    } catch {
      return ethers.parseEther("0");
    }
  };

  // Launch new project
  const handleLaunchProject = async (e) => {
    e.preventDefault();
    if (!contract || !signer) return alert("Connect wallet first");
    if (
      !newProject.name.trim() ||
      !newProject.summary.trim() ||
      !newProject.goal ||
      !newProject.durationDays
    )
      return alert("Fill all fields");

    try {
      const tx = await contract.launchProject(
        newProject.name,
        newProject.summary,
        parseEth(newProject.goal),
        parseInt(newProject.durationDays, 10)
      );
      await tx.wait();
      alert("Project launched!");
      setNewProject({ name: "", summary: "", goal: "", durationDays: "" });
      loadProjectCount();
    } catch (err) {
      console.error("Launch project error:", err);
      alert("Error launching project");
    }
  };

  // Back project
  const handleBackProject = async (e) => {
    e.preventDefault();
    if (!contract || !signer) return alert("Connect wallet first");
    if (!selectedProjectId) return alert("Select a project");
    if (!backingAmount || parseFloat(backingAmount) <= 0) return alert("Enter valid amount");

    try {
      const tx = await contract.backProject(selectedProjectId, {
        value: parseEth(backingAmount),
      });
      await tx.wait();
      alert("Backing successful!");
      setBackingAmount("");
      loadProjects();
    } catch (err) {
      console.error("Backing error:", err);
      alert("Error backing project");
    }
  };

  // Propose phase
  const handleProposePhase = async (e) => {
    e.preventDefault();
    if (!contract || !signer) return alert("Connect wallet first");
    if (!selectedProjectId) return alert("Select a project");
    if (!phaseInput.note.trim() || !phaseInput.goal) return alert("Fill phase note and goal");

    try {
      const tx = await contract.proposePhase(selectedProjectId, phaseInput.note, parseEth(phaseInput.goal));
      await tx.wait();
      alert("Phase proposed!");
      setPhaseInput({ note: "", goal: "" });
      loadProjects();
    } catch (err) {
      console.error("Propose phase error:", err);
      alert("Error proposing phase");
    }
  };

  // Cast vote
  const handleCastVote = async (e) => {
    e.preventDefault();
    if (!contract || !signer) return alert("Connect wallet first");
    if (!voteInput.projectId || !voteInput.phaseId) return alert("Select project and phase");

    try {
      const tx = await contract.castVote(voteInput.projectId, voteInput.phaseId, voteInput.support);
      await tx.wait();
      alert("Vote casted!");
      setVoteInput({ projectId: "", phaseId: "", support: true });
      loadProjects();
    } catch (err) {
      console.error("Vote error:", err);
      alert("Error casting vote");
    }
  };

  // Release payment
  const handleReleasePayment = async (projectId, phaseId) => {
    if (!contract || !signer) return alert("Connect wallet first");

    try {
      const tx = await contract.releasePayment(projectId, phaseId);
      await tx.wait();
      alert("Payment released!");
      loadProjects();
    } catch (err) {
      console.error("Release payment error:", err);
      alert("Error releasing payment");
    }
  };

  // Withdraw refund
  const handleWithdrawRefund = async (projectId) => {
    if (!contract || !signer) return alert("Connect wallet first");

    try {
      const tx = await contract.withdrawRefund(projectId);
      await tx.wait();
      alert("Refund withdrawn!");
      loadProjects();
    } catch (err) {
      console.error("Withdraw refund error:", err);
      alert("Error withdrawing refund");
    }
  };

  // Archive project
  const handleArchiveProject = async (projectId) => {
    if (!contract || !signer) return alert("Connect wallet first");

    try {
      const tx = await contract.archive(projectId);
      await tx.wait();
      alert("Project archived!");
      loadProjects();
    } catch (err) {
      console.error("Archive project error:", err);
      alert("Error archiving project");
    }
  };

  // Remove project
  const handleRemoveProject = async (projectId) => {
    if (!contract || !signer) return alert("Connect wallet first");

    try {
      const tx = await contract.remove(projectId);
      await tx.wait();
      alert("Project removed!");
      loadProjects();
    } catch (err) {
      console.error("Remove project error:", err);
      alert("Error removing project");
    }
  };

  // Phases loading & storage
  const [phases, setPhases] = useState({});
  const loadPhases = async (projectId) => {
    if (!contract || !projectId) return;

    try {
      const p = projects.find((p) => p.id === projectId);
      if (!p) return;
      const phaseCount = p.phaseCount;
      const phasesArr = [];
      for (let i = 1; i <= phaseCount; i++) {
        try {
          const ph = await contract.fetchPhase(projectId, i);
          phasesArr.push({
            id: i,
            note: ph[0],
            goal: ph[1],
            approved: ph[2],
            withdrawn: ph[3],
            approvals: Number(ph[4]),
            rejections: Number(ph[5]),
          });
        } catch {
          // ignore errors per phase
        }
      }
      setPhases((prev) => ({ ...prev, [projectId]: phasesArr }));
    } catch (err) {
      console.error("Load phases error:", err);
    }
  };

  useEffect(() => {
    if (selectedProjectId) loadPhases(selectedProjectId);
  }, [selectedProjectId, projects]);

  // Fix for vote form select default value
  const voteSupportStr = voteInput.support ? "true" : "false";

  return (
    <div className="container">
      <h1>BlockFund Crowdfunding DApp</h1>

      {!account ? (
        <button onClick={connectWallet} className="btn-primary">
          Connect Wallet
        </button>
      ) : (
        <p className="text-center">Connected as: {account}</p>
      )}

      {/* Launch Project Form */}
      <section>
        <h2>Launch New Project</h2>
        <form onSubmit={handleLaunchProject}>
          <input
            type="text"
            placeholder="Project Name"
            value={newProject.name}
            onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}
            required
          />
          <textarea
            placeholder="Project Summary"
            value={newProject.summary}
            onChange={(e) => setNewProject({ ...newProject, summary: e.target.value })}
            rows={3}
            required
          />
          <input
            type="number"
            min="0"
            step="0.01"
            placeholder="Funding Goal (ETH)"
            value={newProject.goal}
            onChange={(e) => setNewProject({ ...newProject, goal: e.target.value })}
            required
          />
          <input
            type="number"
            min="1"
            step="1"
            placeholder="Duration (Days)"
            value={newProject.durationDays}
            onChange={(e) => setNewProject({ ...newProject, durationDays: e.target.value })}
            required
          />
          <button type="submit">Launch Project</button>
        </form>
      </section>

      {/* Projects List */}
      <section>
        <h2>Projects</h2>
        <div className="project-list">
          {projects.length === 0 && <p>No projects found</p>}
          {projects.map((project) => {
            const isOwner = account?.toLowerCase() === project.initiator.toLowerCase();

            // Check raisedAmount and goalAmount type safely (ethers v6 uses bigint)
            const raised = typeof project.raisedAmount === "bigint" ? project.raisedAmount : BigInt(project.raisedAmount || "0");
            const goal = typeof project.goalAmount === "bigint" ? project.goalAmount : BigInt(project.goalAmount || "0");

            return (
              <div className="project-card" key={project.id}>
                <h3>{project.name}</h3>
                <p><strong>Summary:</strong> {project.summary}</p>
                <p><strong>Goal:</strong> {formatEth(goal)} ETH</p>
                <p><strong>Raised:</strong> {formatEth(raised)} ETH</p>
                <p>
                  <strong>Status:</strong>{" "}
                  {project.active ? (
                    <span className="status-tag active">Active</span>
                  ) : (
                    <span className="status-tag inactive">Inactive</span>
                  )}
                </p>
                <p><strong>Expires:</strong> {new Date(project.expiry * 1000).toLocaleString()}</p>
                <p><strong>Phases:</strong> {project.phaseCount}</p>
                <p><strong>Initiator:</strong> {project.initiator}</p>

                {/* Back project */}
                {project.active && !isOwner && (
                  <form
                    onSubmit={handleBackProject}
                    className="back-project-form"
                    // Removed onClick on form: use input onFocus or button onClick instead
                  >
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      placeholder="ETH to Back"
                      value={selectedProjectId === project.id ? backingAmount : ""}
                      onChange={(e) => {
                        setSelectedProjectId(project.id);
                        setBackingAmount(e.target.value);
                      }}
                      onFocus={() => setSelectedProjectId(project.id)}
                      required
                    />
                    <button type="submit">Back Project</button>
                  </form>
                )}

                {/* Initiator Controls */}
                {isOwner && (
                  <div className="owner-controls">
                    {/* Propose Phase */}
                    <form onSubmit={handleProposePhase} className="phase-form">
                      <input
                        type="text"
                        placeholder="Phase Note"
                        value={selectedProjectId === project.id ? phaseInput.note : ""}
                        onChange={(e) => {
                          setSelectedProjectId(project.id);
                          setPhaseInput({ ...phaseInput, note: e.target.value });
                        }}
                        required
                      />
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        placeholder="Phase Goal (ETH)"
                        value={selectedProjectId === project.id ? phaseInput.goal : ""}
                        onChange={(e) => {
                          setSelectedProjectId(project.id);
                          setPhaseInput({ ...phaseInput, goal: e.target.value });
                        }}
                        required
                      />
                      <button type="submit">Propose Phase</button>
                    </form>

                    {/* Archive & Remove */}
                    {!project.active && (
                      <>
                        <button
                          onClick={() => handleArchiveProject(project.id)}
                          className="btn-secondary"
                        >
                          Archive Project
                        </button>
                        <button
                          onClick={() => handleRemoveProject(project.id)}
                          className="btn-danger"
                        >
                          Remove Project
                        </button>
                      </>
                    )}
                  </div>
                )}

                {/* Phases List */}
                {phases[project.id] && phases[project.id].length > 0 && (
                  <div className="phases-list">
                    <h4>Phases</h4>
                    {phases[project.id].map((ph) => (
                      <div key={ph.id} className="phase-card">
                        <p><strong>Note:</strong> {ph.note}</p>
                        <p><strong>Goal:</strong> {formatEth(ph.goal)} ETH</p>
                        <p><strong>Approved:</strong> {ph.approved ? "Yes" : "No"}</p>
                        <p><strong>Withdrawn:</strong> {ph.withdrawn ? "Yes" : "No"}</p>
                        <p>
                          <strong>Approvals:</strong> {ph.approvals} | <strong>Rejections:</strong>{" "}
                          {ph.rejections}
                        </p>

                        {/* Voting */}
                        {account && !ph.withdrawn && (
                          <form
                            onSubmit={handleCastVote}
                            className="vote-form"
                            style={{ marginTop: 8 }}
                          >
                            <select
                              value={
                                voteInput.projectId === project.id && voteInput.phaseId === ph.id
                                  ? voteSupportStr
                                  : "true"
                              }
                              onChange={(e) => {
                                setVoteInput({
                                  projectId: project.id,
                                  phaseId: ph.id,
                                  support: e.target.value === "true",
                                });
                              }}
                            >
                              <option value="true">Support</option>
                              <option value="false">Reject</option>
                            </select>
                            <button type="submit">Cast Vote</button>
                          </form>
                        )}

                        {/* Release payment button */}
                        {isOwner && ph.approved && !ph.withdrawn && (
                          <button
                            onClick={() => handleReleasePayment(project.id, ph.id)}
                            className="btn-primary"
                            style={{ marginTop: 10 }}
                          >
                            Release Payment
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {/* Refund Button */}
                {!project.active &&
                  raised < goal &&
                  !isOwner && (
                    <button
                      onClick={() => handleWithdrawRefund(project.id)}
                      className="btn-danger"
                    >
                      Withdraw Refund
                    </button>
                  )}
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}

export default App;
