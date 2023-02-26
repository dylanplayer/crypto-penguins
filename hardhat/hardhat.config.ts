require("dotenv").config();

import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";

const config: HardhatUserConfig = {
  solidity: "0.8.9",
  defaultNetwork: "hardhat",
  networks: {
    hardhat: {},
    sepolia: {
      url: `${process.env.RPC_URL}/v1/sepolia`,
      accounts: [(process.env.PRIVATE_KEY as string)],
      httpHeaders: {
        "CF-Access-Client-Id": process.env.RPC_CLIENT_ID as string,
        "CF-Access-Client-Secret": process.env.RPC_CLIENT_SECRET as string,
      },
    },
  },
  etherscan: {
    apiKey: {
      sepolia: process.env.ETHERSCAN_SEPOLIA_API_KEY as string,
    },
  },
};

export default config;
