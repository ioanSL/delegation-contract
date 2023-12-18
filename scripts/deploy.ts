import { ethers } from "hardhat";

async function deployDelegate() {
  const delegate = await ethers.deployContract("Delegate");

  await delegate.waitForDeployment();

  console.log(`Delegate deployed to ${delegate.target}`);
}

async function deployERC721() {
  const erc721 = await ethers.deployContract("MockERC721");

  await erc721.waitForDeployment();

  console.log(`Mock ERC721 deployed to ${erc721.target}`);
}

async function main() {
  await deployERC721();
  await deployDelegate();
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
