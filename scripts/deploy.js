const { ethers } = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();

  console.log("Deploying contracts with the account:", deployer.address);

  const BlockFund = await ethers.getContractFactory("BlockFund");
  const blockFund = await BlockFund.deploy();

  await blockFund.waitForDeployment();

  console.log("BlockFund deployed to:", blockFund.target);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
