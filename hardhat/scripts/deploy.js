const { ethers } = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();

  console.log("Deploying contracts with the account:", deployer.address);

  // Deploy CryptoPenguin contract
  const CryptoPenguin = await ethers.getContractFactory("CryptoPenguin");
  const cryptoPenguin = await CryptoPenguin.deploy("http://localhost:3000/api/penguins/");

  console.log("CryptoPenguin address:", cryptoPenguin.address);
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
