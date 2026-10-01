# Ethereum Certificate Verification DApp - Deployment Guide

**BCT College Project**  
**Team Members:**  
- **Shaikh Affan** (Roll No: 242774)  
- **Shaikh Sohail Salim** (Roll No: 231754)  
- **Shaikh Uzhair Mohd Ilyas** (Roll No: 231755)  

**Project Title:** Decentralized Certificate Verification DApp Using Ethereum  

---

## Overview

This guide outlines the step-by-step procedure to deploy the **Decentralized Certificate Verification DApp** using:
1. **Solidity Smart Contract** deployed via Remix IDE on Sepolia Testnet / Local Ethereum VM.
2. **Frontend Deployment** on **Netlify Static Hosting**.

---

## Step 1: Deploy Smart Contract via Remix IDE

1. Open [Remix Ethereum IDE](https://remix.ethereum.org/).
2. Create a new file inside the `contracts/` directory named `CertificateVerification.sol`.
3. Copy and paste the contract code from `contracts/CertificateVerification.sol`.
4. Go to the **Solidity Compiler** tab:
   - Select Compiler Version: `0.8.20`.
   - Click **Compile CertificateVerification.sol**.
5. Go to the **Deploy & Run Transactions** tab:
   - **Environment:** Select **Injected Provider - MetaMask** (Sepolia Testnet) or **Remix VM**.
   - Click **Deploy**.
6. Note down the **Deployed Contract Address** and **Contract ABI**.

---

## Step 2: Configure `config.js`

1. Open `frontend/js/config.js`.
2. Update `CONTRACT_ADDRESS` with your deployed contract address:
   ```javascript
   CONTRACT_ADDRESS: "0xYOUR_DEPLOYED_CONTRACT_ADDRESS_HERE"
   ```

---

## Step 3: Test Real Web3 Flow Locally

1. Run local web server:
   ```bash
   npm start
   ```
2. Open `http://localhost:3000` in browser.
3. Click **🦊 Connect MetaMask** button.
4. Go to **Issue Certificate** (`admin.html`) and issue a certificate using MetaMask transaction signing.
5. Copy the transaction hash and view on block explorer.
6. Go to **Verify Certificate** (`verify.html`), enter Certificate ID, and confirm instant smart contract verification!

---

## Step 4: Push to GitHub & Deploy on Netlify

```bash
git add .
git commit -m "Update DApp with Real MetaMask Integration & Team Members"
git push -u origin main
```

Connect your GitHub repository `MohammedAffanShaikh/BCT-DAPP-MINIPROJECT` to Netlify. Set publish directory to `frontend`. Netlify will host your DApp automatically!
