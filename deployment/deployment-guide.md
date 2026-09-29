# Ethereum Certificate Verification DApp - Deployment Guide

**BCT College Project**  
**Student Name:** Shaikh Affan  
**Roll Number:** 242774  
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
3. Copy and paste the contract code from `contracts/CertificateVerification.sol`:

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;
// (Paste full contract content from contracts/CertificateVerification.sol)
```

4. Go to the **Solidity Compiler** tab (left side panel):
   - Select Compiler Version: `0.8.20` or `0.8.24`.
   - Click **Compile CertificateVerification.sol**.

5. Go to the **Deploy & Run Transactions** tab:
   - **Environment:**
     - Select **Injected Provider - MetaMask** (to deploy on Sepolia Testnet or local network) OR **Remix VM (Cancun)** for instant testing.
   - **Account:** Ensure your administrative wallet address is selected.
   - Click **Deploy**.

6. Confirm the deployment transaction in MetaMask.
7. Once deployed, note down:
   - **Deployed Contract Address** (e.g., `0x358AA13c52544EC2c6E1A8481047A13400C3C759`).
   - **Contract ABI** (Copy ABI from Compiler tab).

---

## Step 2: Configure Frontend Configuration (`config.js`)

1. Open `frontend/js/config.js` in your text editor.
2. Update `CONTRACT_ADDRESS` with your newly deployed contract address:

```javascript
const CONFIG = {
    // ...
    CONTRACT_ADDRESS: "0xYOUR_DEPLOYED_CONTRACT_ADDRESS_HERE",
    // ...
};
```

3. Ensure `CONTRACT_ABI` matches your compiled contract ABI.

---

## Step 3: Test DApp Locally

1. Open your terminal in the project directory:
   ```bash
   npm start
   ```
2. Open your browser at `http://localhost:3000`.
3. Test the flow:
   - Click **Connect Wallet** (MetaMask).
   - Go to **Issue Certificate** (`admin.html`) and submit a test certificate (e.g., `CERT-2026-001`).
   - Go to **Verify Certificate** (`verify.html`), enter `CERT-2026-001`, and click **Verify Certificate**.
   - Verify that **Certificate Verified Successfully** is displayed.

---

## Step 4: Netlify Deployment (Step-by-Step)

### Option A: Deploy via GitHub (Recommended)

1. **Initialize Git & Commit:**
   ```bash
   git init
   git add .
   git commit -m "Initial commit - Shaikh Affan Roll 242774 BCT Project"
   ```

2. **Push to GitHub:**
   - Create a public or private repository named `certificate-verification-dapp` on GitHub.
   - Link and push code:
     ```bash
     git remote add origin https://github.com/YOUR_USERNAME/certificate-verification-dapp.git
     git branch -M main
     git push -u origin main
     ```

3. **Deploy on Netlify:**
   - Log into [Netlify](https://www.netlify.com/).
   - Click **Add new site** > **Import an existing project**.
   - Choose **GitHub** and select repository `certificate-verification-dapp`.
   - Netlify will automatically read `netlify.toml`:
     - **Publish Directory:** `frontend`
     - **Build Command:** *(leave empty)*
   - Click **Deploy Site**.

4. Your live URL will be generated instantly (e.g., `https://shaikh-affan-bct-dapp.netlify.app`).

---

### Option B: Direct Drag-and-Drop Deployment on Netlify

1. Log into Netlify.
2. Navigate to **Sites** > **Add new site** > **Deploy manually**.
3. Drag and drop the `frontend` folder directly onto the upload area.
4. Netlify will publish your site in seconds!

---

## Step 5: Final Viva & Demonstration Checklist

- [x] Student Name & Roll Number displayed on top banner: **Shaikh Affan | 242774 | BCT Project**.
- [x] Wallet status indicator updates on MetaMask connection.
- [x] Admin can issue certificates and view transaction hash.
- [x] Public user can enter Certificate ID and view official credential.
- [x] Print / Save PDF certificate function working.
- [x] Mobile responsive layout tested.
