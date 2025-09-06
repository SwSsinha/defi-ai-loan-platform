// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

// Import ERC20 for token functionality. We'll use this for the collateral token.
// OpenZeppelin is the industry standard for secure, audited smart contracts.
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

// Define a simple mock token that can be used for the loan.
// In a real-world scenario, you would use a stablecoin like DAI or USDC.
contract MockStableCoin is ERC20, Ownable {
    constructor(uint256 initialSupply) ERC20("Mock Stable Coin", "MSC") Ownable(msg.sender) {
        _mint(msg.sender, initialSupply);
    }

    // Function to mint new tokens for our lending protocol.
    function mint(address to, uint256 amount) public onlyOwner {
        _mint(to, amount);
    }
}