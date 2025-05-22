async function main() {
  const [deployer] = await ethers.getSigners();

  console.log("Deploying contracts with the account:", deployer.address);

  const BlockFund = await ethers.getContractFactory("BlockFund");
  const blockFund = await BlockFund.deploy();  // deploy and wait automatically

  console.log("BlockFund deployed to:", blockFund.target); // ethers v6 uses .target (not .address)
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
