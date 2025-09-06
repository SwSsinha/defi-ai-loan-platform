"""
DeFi-AI Risk Assessment API
Purpose: Provide AI-based risk scores for loan borrowing
Technology: Flask, Hugging Face pre-trained model (mock for MVP)
Deployment: Akash Network decentralized GPU compute

Endpoint: /get-risk-score?wallet=<wallet_address>
Response: {"score": <int>, "explanation": <string>}
"""

from flask import Flask, request, jsonify
import random  # For mock scoring in MVP

app = Flask(__name__)

@app.route('/')
def home():
    return "DeFi-AI Risk Assessment API - Deployed on Akash Network"

@app.route('/get-risk-score')
def get_risk_score():
    wallet = request.args.get('wallet', '').strip()

    if not wallet:
        return jsonify({"error": "Wallet address required"}), 400

    # Mock AI risk scoring (1-10, low is better)
    # In full implementation, use ML model to analyze wallet transaction history
    risk_score = random.randint(1, 10)

    risk_category = "Low" if risk_score <= 3 else "Medium" if risk_score <= 7 else "High"
    explanation = f"Risk score: {risk_score}/10 ({risk_category})"

    return jsonify({
        "score": risk_score,
        "category": risk_category,
        "explanation": explanation,
        "wallet": wallet,
        "model_version": "mock-v1.0"
    })

@app.route('/health')
def health():
    return jsonify({
        "status": "healthy",
        "model_loaded": True,
        "akash_deployed": True
    })

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)