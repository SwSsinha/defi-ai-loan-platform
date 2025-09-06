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

// This is the core Lending Protocol contract.
// It will be the "backend" of our LendrAI application.
contract LendrAI is Ownable {
    // We'll use a mapping to keep track of collateral deposited by each user.
    // The key is the user's address, and the value is the amount of collateral they have.
    mapping(address => uint256) public userCollateral;

    // We'll need the addresses of our collateral and stablecoin tokens.
    // These will be set when the contract is deployed.
    address public collateralToken;
    address public lendingToken;

    // The maximum loan-to-value (LTV) ratio.
    // This is the percentage of collateral a user can borrow against.
    // 150 means a 150% over-collateralization.
    uint256 public constant LTV_RATIO = 150;

    // The address of our mock AI oracle. We'll use this to get the risk score.
    address public aiOracle;

    // An event is a log on the blockchain. It's crucial for front-end applications
    // to listen to these events to know what's happening.
    event CollateralDeposited(address indexed user, uint256 amount);
    event LoanBorrowed(address indexed user, uint256 amount);
    event LoanRepaid(address indexed user, uint256 amount);

    constructor(address _collateralToken, address _lendingToken) Ownable(msg.sender) {
        collateralToken = _collateralToken;
        lendingToken = _lendingToken;
        // In a real project, you would set the AI oracle address here.
        // For our MVP, we can assume it's just a local function.
        aiOracle = msg.sender;
    }

    // Function to allow users to deposit collateral.
    // They must first approve this contract to spend their tokens.
    function depositCollateral(uint256 _amount) public {
        require(_amount > 0, "Amount must be greater than 0");

        // This is a common pattern for interacting with ERC20 tokens.
        // We use transferFrom to pull the tokens from the user.
        bool success = ERC20(collateralToken).transferFrom(msg.sender, address(this), _amount);
        require(success, "Token transfer failed");

        userCollateral[msg.sender] += _amount;

        emit CollateralDeposited(msg.sender, _amount);
    }

    // Function to allow users to borrow against their collateral.
    // This is where we'll integrate our AI risk score.
    function borrow(uint256 _borrowAmount, uint256 _riskScore) public {
        require(userCollateral[msg.sender] > 0, "No collateral deposited");

        // The core logic of your project's innovation.
        // Here, we check if the AI risk score is low enough (e.g., < 80).
        // This is a placeholder; you would replace it with your actual logic.
        require(_riskScore < 5, "AI risk score is too high to borrow");

        // Calculate the maximum amount the user can borrow based on their collateral and the LTV.
        uint256 maxBorrowAmount = (userCollateral[msg.sender] * 100) / LTV_RATIO;
        require(_borrowAmount <= maxBorrowAmount, "Borrow amount exceeds max limit");

        // Transfer the lending token from this contract to the user.
        bool success = ERC20(lendingToken).transfer(msg.sender, _borrowAmount);
        require(success, "Lending token transfer failed");

        emit LoanBorrowed(msg.sender, _borrowAmount);
    }
}