// DeFi-AI Loan Contract Deployment Script
// Purpose: Deploy MockStableCoin and LendrAI to BlockDAG testnet using Hardhat
// Output: Contract addresses for frontend integration
// Usage: npx hardhat run scripts/deploy.js --network primordial-testnet

const hre = require("hardhat");

async function main() {
    console.log("Deploying DeFi-AI contracts to BlockDAG testnet...");

    // Deploy MockStableCoin first
    const MockStableCoin = await hre.ethers.getContractFactory("MockStableCoin");
    console.log("Deploying MockStableCoin...");
    const initialSupply = hre.ethers.utils.parseEther("1000000"); // 1M tokens
    const stableCoin = await MockStableCoin.deploy(initialSupply);
    await stableCoin.deployed();
    const stableCoinAddress = stableCoin.address;
    console.log(`MockStableCoin deployed to: ${stableCoinAddress}`);

    // Deploy LendrAI with collateral and lending token addresses
    const LendrAI = await hre.ethers.getContractFactory("LendrAI");
    console.log("Deploying LendrAI...");
    const lendrAI = await LendrAI.deploy(stableCoinAddress, stableCoinAddress);
    await lendrAI.deployed();
    const lendrAIAddress = lendrAI.address;
    console.log(`LendrAI deployed to: ${lendrAIAddress}`);

    // Mint some tokens to deployer for testing
    await stableCoin.mint(await hre.ethers.getSigner().getAddress(), hre.ethers.utils.parseEther("100000"));
    console.log("Minted 100k tokens for testing");

    // Log deployment info
    console.log("\n=== Deployment Summary ===");
    console.log(`Network: ${network.name}`);
    console.log(`MockStableCoin Address: ${stableCoinAddress}`);
    console.log(`LendrAI Address: ${lendrAIAddress}`);
    console.log(`Block Number: ${await ethers.provider.getBlockNumber()}`);
    console.log("========================\n");

    console.log("Update your frontend script.js with the contract addresses:");
    console.log(`const STABLE_COIN_ADDRESS = '${stableCoinAddress}';`);
    console.log(`const CONTRACT_ADDRESS = '${lendrAIAddress}';`);

    // Return deployment info for testing
    return {
        stableCoinAddress,
        lendrAIAddress,
        blockNumber: await ethers.provider.getBlockNumber()
    };
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error("Deployment failed:", error);
        process.exit(1);
    });