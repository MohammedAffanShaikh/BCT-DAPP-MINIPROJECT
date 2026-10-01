# Decentralized Certificate Verification DApp Using Ethereum

**Subject:** BCT Project  
**Academic Year:** 2026  

### 🎓 Project Team Members
* **Shaikh Affan** — Roll No: 242774
* **Shaikh Sohail Salim** — Roll No: 231754
* **Shaikh Uzhair Mohd Ilyas** — Roll No: 231755

---

## 📌 Project Overview

This repository contains the complete codebase for a **Decentralized Certificate Verification DApp Using Ethereum**, developed as a **BCT College Project** by **Shaikh Affan (242774), Shaikh Sohail Salim (231754), and Shaikh Uzhair Mohd Ilyas (231755)**.

The DApp enables an authorized educational institute (admin) to issue digital academic certificates directly onto the Ethereum blockchain via **MetaMask** wallet transaction signing. Students, recruiters, and third-party verifiers can publicly verify certificate authenticity in real-time without relying on centralized database servers.

---

## 🎯 Abstract

Academic certificate forgery and credential fraud present major challenges to universities and employers. Traditional manual verification processes are slow, expensive, and vulnerable to corruption or single-point-of-failure database breaches. 

This project implements a decentralized, web-based certificate verification solution using **Ethereum Smart Contracts (Solidity 0.8.x)**, **MetaMask**, **Ethers.js**, and static **Netlify** hosting. Certificates issued by authorized institute wallets are stored as cryptographic hashes on the immutable Ethereum ledger. Anyone can verify certificate details, student info, document SHA-256 hashes, and issuance timestamps in seconds.

---

## 🏗️ Web3 Architecture & Workflow

```text
                 ADMIN
                   │
                   ▼
          WEB APPLICATION
        HTML/CSS/JavaScript
                   │
                   ▼
              Ethers.js
                   │
                   ▼
              MetaMask
                   │
             Transaction
                   │
                   ▼
       ETHEREUM SMART CONTRACT
              Solidity
                   │
                   ▼
         ETHEREUM BLOCKCHAIN
                   │
                   ▼
          Certificate Record


                USER
                  │
                  ▼
       Certificate ID
                  │
                  ▼
          Web Application
                  │
                  ▼
             Ethers.js
                  │
                  ▼
       Smart Contract Read
                  │
                  ▼
      Certificate Verification
```

---

## ✨ Features & Capabilities

### 1. Header & Team Details
* Top header bar displaying: **Shaikh Affan (242774) • Shaikh Sohail Salim (231754) • Shaikh Uzhair Mohd Ilyas (231755) | BCT Project**.
* Real-time network and wallet status indicator (**🟢 MetaMask Connected** / **⚠️ Wrong Network** / **🔴 Not Connected**).
* Connected wallet format: `0x12AB...89CD`.

### 2. REAL MetaMask Wallet Integration
* Prominent **🦊 Connect MetaMask** button with Web3 account detection.
* Ethers.js integration via `window.ethereum` browser provider.
* Multi-step real transaction status tracker:
  1. *Waiting for MetaMask confirmation...*
  2. *Transaction submitted... (Tx: 0x...)*
  3. *Confirming transaction on Ethereum...*
  4. *Certificate successfully issued on Ethereum.*
* Real block explorer link generation for transaction hashes on Ethereum testnets (Sepolia).

### 3. Public Verification Portal (`verify.html`)
* Instant Certificate ID lookup against the Ethereum smart contract registry.
* **🟢 Connected to Ethereum Smart Contract** badge when retrieved directly from the live ledger.
* **🔴 Certificate Not Found / Invalid Certificate** warning banner for unissued/invalid IDs.
* Printable / Downloadable PDF certificate view.
* Document SHA-256 hash copy button.

---

## 🛠️ Technology Stack

* **Blockchain:** Ethereum Network (Sepolia Testnet / Hardhat / Remix VM)
* **Smart Contract Language:** Solidity 0.8.x
* **Development Environment:** Remix IDE
* **Wallet Authentication:** MetaMask Chrome Extension
* **Web3 Frontend Library:** Ethers.js (v5 / v6)
* **Frontend Stack:** HTML5, Vanilla CSS3 (Glassmorphism Cyber-Ethereum theme), ES6 JavaScript
* **Static Hosting:** Netlify

---

## 📜 Smart Contract (`contracts/CertificateVerification.sol`)

```solidity
struct Certificate {
    string certificateId;
    string studentName;
    string studentId;
    string course;
    string issueDate;
    string documentHash;
    address issuedBy;
    bool exists;
    uint256 timestamp;
}
```

* **State Variables:** `address public admin;`, `mapping(string => Certificate) public certificates;`
* **Access Control:** `modifier onlyAdmin()` enforces that only the contract deployer can call `issueCertificate()`.
* **Duplicate Protection:** `require(!certificates[_certificateId].exists, "Error: Certificate with this ID already exists.");`

---

## 🚀 Running Locally

1. **Clone/Navigate to Project:**
   ```bash
   cd MINI
   ```

2. **Start Local Server:**
   ```bash
   npm start
   ```
   Open `http://localhost:3000` in your web browser.

---

## ☁️ Netlify Deployment

1. Push code to GitHub repository `MohammedAffanShaikh/BCT-DAPP-MINIPROJECT`.
2. Connect repo to Netlify.
3. Set **Publish Directory** to `frontend`.
4. Netlify will deploy the static frontend instantly with zero backend setup.

---

## 👨‍🎓 Project Credits

**BCT College Project Developed By:**
* **Shaikh Affan** (Roll No: 242774)
* **Shaikh Sohail Salim** (Roll No: 231754)
* **Shaikh Uzhair Mohd Ilyas** (Roll No: 231755)

**Subject:** BCT Project • Smart Contracts & Web3 Technology
