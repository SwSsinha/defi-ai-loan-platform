// DeFi-AI Loan Frontend JavaScript - Verbwire API Integration
// Purpose: Handle wallet connection, collateral deposit, and loan borrowing with AI check
// Flow: Connect wallet -> Deposit NAHAN -> Get AI risk score -> Borrow USDC

const API_KEY = 'YOUR_VERBWIRE_API_KEY'; // Replace with actual key
const CONTRACT_ADDRESS = '0xCA75c49B1f10D1dc577da030fD4c6f0220376de0'; // Deployed LendrAI contract on BlockDAG testnet
const AI_ENDPOINT = 'AKASH_AI_API_URL'; // Replace with Akash URL e.g. https://akash-url.com/api/risk-score

let provider;
let signer;
let contract;

// Wallet connection status element
const statusElement = document.getElementById('status');
const connectBtn = document.getElementById('connectWallet');
const depositBtn = document.getElementById('deposit');
const borrowBtn = document.getElementById('borrow');
const collateralDisplay = document.getElementById('collateral');
const loanDisplay = document.getElementById('loan');

// Connect wallet using Verbwire API
async function connectWallet() {
    try {
        // Use Verbwire to connect MetaMask
        const response = await fetch(`https://api.verbwire.com/v1/wallet/connect?ewccApiKey=${API_KEY}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${API_KEY}`
            }
        });

        const data = await response.json();

        if (data.success) {
            statusElement.textContent = `Connected: ${data.walletAddress}`;
            connectBtn.style.display = 'none';
            depositBtn.style.display = 'inline-block';
            borrowBtn.style.display = 'inline-block';
        } else {
            statusElement.textContent = 'Connection failed';
        }
    } catch (error) {
        console.error('Wallet connection error:', error);
        statusElement.textContent = 'Connection error';
    }
}

// Deposit collateral using Verbwire transaction API
async function depositCollateral() {
    const depositAmount = prompt('Amount to deposit (BDAG):');

    if (!depositAmount) return;

    try {
        // Verbwire API to send transaction to deposit function
        const response = await fetch('https://api.verbwire.com/v1/transaction/send', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${API_KEY}`
            },
            body: JSON.stringify({
                contractAddress: CONTRACT_ADDRESS,
                functionName: 'depositCollateral(uint256)',
                functionArgs: [depositAmount],
                ewccApiKey: API_KEY
            })
        });

        const data = await response.json();

        if (data.success) {
            statusElement.textContent = `Deposit successful: ${depositAmount} BDAG`;
            updateCollateral();
        } else {
            statusElement.textContent = 'Deposit failed';
        }
    } catch (error) {
        console.error('Deposit error:', error);
        statusElement.textContent = 'Deposit error';
    }
}

// Borrow loan with AI check using Verbwire and Akash
async function borrowLoan() {
    const borrowAmount = prompt('Amount to borrow (USDC):');

    if (!borrowAmount) return;

    try {
        // First, get AI risk score from Akash API
        const riskResponse = await fetch(`${AI_ENDPOINT}/get-risk-score?wallet=0x123456789abcdef`);
        const riskData = await riskResponse.json();

        const riskScore = riskData.score || 3; // Default to 3 if API fails
        statusElement.textContent = `Risk Score: ${riskScore}/10`;

        // If risk is acceptable, proceed with borrow
        if (riskScore <= 5) {
            // Verbwire API to call borrow function
            const response = await fetch('https://api.verbwire.com/v1/transaction/send', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${API_KEY}`
                },
                body: JSON.stringify({
                    contractAddress: CONTRACT_ADDRESS,
                    functionName: 'borrow(uint256,uint8)',
                    functionArgs: [borrowAmount, riskScore],
                    ewccApiKey: API_KEY
                })
            });

            const data = await response.json();

            if (data.success) {
                statusElement.textContent = `Loan approved: ${borrowAmount} USDC`;
                updateLoan();
            } else {
                statusElement.textContent = 'Loan denied';
            }
        } else {
            statusElement.textContent = 'High risk: Loan denied';
        }
    } catch (error) {
        console.error('Borrow error:', error);
        statusElement.textContent = 'Borrow error';
    }
}

// Update collateral display
async function updateCollateral() {
    // Query contract for collateral
    collateralDisplay.textContent = 'Query in progress...';
    // This would normally read from the contract
    collateralDisplay.textContent = '100'; // Placeholder
}

// Update loan display
async function updateLoan() {
    loanDisplay.textContent = '200'; // Placeholder
}

// Event listeners
connectBtn.addEventListener('click', connectWallet);
depositBtn.addEventListener('click', depositCollateral);
borrowBtn.addEventListener('click', borrowLoan);

// Initialize deposit and borrow buttons as hidden
depositBtn.style.display = 'none';
borrowBtn.style.display = 'none';