// DeFi-AI Loan Contract Deployment Script
// Purpose: Deploy LoanContract.sol to BlockDAG testnet using Hardhat
// Output: Contract address for frontend integration
// Usage: npx hardhat run scripts/deploy.js --network blockdag-testnet

async function main() {
    console.log("Deploying Laser Pool to BlockDAG testnet...");

    // Get the ContractFactory for LoanContract
    const LoanContract = await ethers.getContractFactory("LoanContract");

    console.log("Contract ready for deployment...");

    // Deploy the contract
    const loanContract = await LoanContract.deploy();

    // Wait for deployment to finish
    await loanContract.waitForDeployment();

    const contractAddress = await loanContract.getAddress();
    console.log(`LoanContract deployed to: ${contractAddress}`);

    // Verify contract if on supported network
    if (network.name !== "hardhat") {
        console.log("Verifying contract...");
        try {
            await run("verify:verify", {
                address: contractAddress,
                constructorArguments: [],
            });
            console.log("Contract verified!");
        } catch (error) {
            console.error("Verification failed:", error.message);
        }
    }

    // Log deployment info
    console.log("\n=== Deployment Summary ===");
    console.log(`Network: ${network.name}`);
    console.log(`Contract Address: ${contractAddress}`);
    console.log(`Block Number: ${await ethers.provider.getBlockNumber()}`);
    console.log("========================\n");

    console.log("Update your frontend script.js with the contract address:");
    console.log(`const CONTRACT_ADDRESS = '${contractAddress}';`);

    // Return deployment info for testing
    return {
        address: contractAddress,
        blockNumber: await ethers.provider.getBlockNumber()
    };
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error("Deployment failed:", error);
        process.exit(1);
    });