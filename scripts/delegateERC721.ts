import { ethers } from 'ethers';
import * as dotenv from 'dotenv';
import  delegateContractABI from '../artifacts/contracts/Delegate.sol/Delegate.json';

// Load environment variables from .env file
dotenv.config({path: '../.env'});

// Define the Delegate contract address and ABI
const delegateContractAddress = process.env.DELEGATE_TARGET as string;

// Define the provider and signer
const provider = new ethers.JsonRpcProvider(process.env.ALCHEMY_SEPOLIA_RPC as string);
const signer = new ethers.Wallet(process.env.PRIVATE_KEY as string, provider);

// Create a new instance of the Delegate contract
console.log("ddddd", delegateContractAddress);
const delegateContract = new ethers.Contract(delegateContractAddress, delegateContractABI.abi, signer);
// Delegate the ERC721 token
async function delegateERC721(asset: string, tokenId: number, delegateToAddress: string, rights: string, enable: boolean) {
    const tx = await delegateContract.delegateERC721(asset, delegateToAddress, tokenId, ethers.encodeBytes32String(rights), enable);
    await tx.wait();

    console.log(`Token ${tokenId} delegated to ${delegateToAddress}`);
}

async function main() {
    const args = process.argv.slice(2);
    const asset = args[0] as string;
    const tokenId = parseInt(args[1]);
    const delegateToAddress = args[2] as string;
    const rights = args[3] as string;
    const enable = args[4] === 'true';
    delegateERC721(asset, tokenId, delegateToAddress, rights, enable);

}

main();
