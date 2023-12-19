import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "hardhat-gas-reporter"

const COINMARKETCAP_API_KEY = process.env.COINMARKETCAP_API_KEY || ""

const config: HardhatUserConfig = {
  networks: {
    hardhat: {
    },
    sepolia: {
      url: process.env.ALCHEMY_SEPOLIA_RPC || "",
      accounts: [process.env.PRIVATE_KEY || ""]
    },
  },
  solidity: {
    version: "0.8.20", 
    settings: {
      optimizer: {
        enabled: true, runs: 2000
      }
    }
  },
  gasReporter: {
    enabled: (process.env.REPORT_GAS) ? true : false,
    currency: 'USD',
    coinmarketcap: COINMARKETCAP_API_KEY,
    token: "ETH"
  },
};

export default config;
