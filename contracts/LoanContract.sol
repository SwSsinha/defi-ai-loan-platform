// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

// DeFi-AI Loan Contract for BlockDAG
// This contract handles collateral deposit and loan borrowing with AI-verified risk scoring
// Purpose: Demonstrate AI-integrated DeFi on BlockDAG with basic lending functionality

contract LoanContract {
    // Mappings to store user balances and loan amounts
    mapping(address => uint256) public collateral;
    mapping(address => uint256) public loans;
    uint256 public totalLoans;

    // Events for transparency
    event CollateralDeposited(address indexed user, uint256 amount);
    event LoanBorrowed(address indexed user, uint256 amount);
    event LoanRepaid(address indexed user, uint256 amount);

    // Deposit collateral function
    function depositCollateral(uint256 amount) external {
        // In real implementation, transfer BDAG tokens
        // For demo, just update balance
        collateral[msg.sender] += amount;
        emit CollateralDeposited(msg.sender, amount);
    }

    // Borrow loan with AI risk check
    function borrow(uint256 amount, uint8 riskScore) external {
        require(collateral[msg.sender] >= amount * 2, "Insufficient collateral");
        require(riskScore < 5, "High risk: Loan denied");

        loans[msg.sender] += amount;
        totalLoans += amount;
        emit LoanBorrowed(msg.sender, amount);
    }

    // Repay loan (bonus feature, not essential for MVP)
    function repay(uint256 amount) external {
        require(loans[msg.sender] >= amount, "No outstanding loan");
        loans[msg.sender] -= amount;
        totalLoans -= amount;
        emit LoanRepaid(msg.sender, amount);
    }

    // View functions
    function getCollateral(address user) external view returns (uint256) {
        return collateral[user];
    }

    function getLoan(address user) external view returns (uint256) {
        return loans[user];
    }
}