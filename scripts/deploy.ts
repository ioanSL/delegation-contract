import { ethers } from "hardhat";
import fs from "fs";

async function deployContract(contractName: string) {
  const contract = await ethers.deployContract(contractName);

  await contract.waitForDeployment();

  console.log(`Delegate deployed to ${contract.target}`);

  // Save delegate.target to .env file
  fs.writeFileSync(
    ".env", 
    `\n${contractName.toUpperCase()}_TARGET=${contract.target}`, 
    { flag: "a" }
  );
}


async function main() {
  await deployContract("Delegate");
  await deployContract("LicenseCheck");

  console.log("Done! Check .env file for deployed contract addresses.");
}


main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
