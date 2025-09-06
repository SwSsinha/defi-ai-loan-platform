require("dotenv").config();
require("@nomiclabs/hardhat-ethers");

const config = {
  solidity: "0.8.28",
  networks: {
    primordial: {
      url: "https://rpc.primordial.bdagscan.com",
      chainId: 1043,
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
    },
  },
};

module.exports = config;
