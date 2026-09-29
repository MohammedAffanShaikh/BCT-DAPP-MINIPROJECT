# Decentralized Certificate Verification DApp Using Ethereum

**Student Name:** Shaikh Affan  
**Roll Number:** 242774  
**Subject:** BCT Project  
**Academic Year:** 2026  

---

## 📌 Project Overview

This repository contains the complete codebase for a **Decentralized Certificate Verification DApp Using Ethereum**, developed as a **BCT Mini Project** by **Shaikh Affan (Roll No: 242774)**.

The DApp allows an authorized educational institute (admin) to issue digital academic certificates on the Ethereum blockchain and allows students, recruiters, and third-party verifiers to publicly confirm the authenticity of any certificate in real-time without relying on centralized database servers.

---

## 🎯 Abstract

Academic certificate forgery and credential fraud present major challenges to universities and employers. Traditional manual verification processes are slow, expensive, and vulnerable to corruption or single-point-of-failure database breaches. 

This project implements a decentralized, web-based certificate verification solution using **Ethereum Smart Contracts (Solidity 0.8.x)**, **MetaMask**, **Ethers.js**, and static **Netlify** hosting. Certificates issued by authorized institute wallets are stored as cryptographic hashes on the immutable Ethereum ledger. Anyone can verify certificate details, student info, document SHA-256 hashes, and issuance timestamps in seconds.

---

## 🚨 Problem Statement

1. **Fake Certificates & Counterfeiting:** Paper and PDF certificates are easily duplicated using modern image editing tools.
2. **Third-Party Bureaucracy:** Background checks require contacting issuing universities manually, causing weeks of delay.
3. **Database Centralization:** Centralized academic databases are vulnerable to hacking, data loss, and unauthorized record modification.

---

## 💡 Objectives

* To design and deploy a **Solidity 0.8.x smart contract** for certificate issuance and cryptographic retrieval.
* To enforce **role-based access control (`onlyAdmin`)** restricting issuance permissions to authorized institute wallets.
* To prevent duplicate certificate creation via smart contract validation rules.
* To construct a modern, responsive Web3 user interface using HTML5, CSS3 (Glassmorphic Cyber-Ethereum theme), JavaScript, and Ethers.js.
* To eliminate backend server requirements by connecting directly to the Ethereum blockchain via client-side Web3 providers.
* To deploy the DApp on **Netlify Static Hosting**.

---

## ✨ Features

### 1. Home Page
* Header badge: **Shaikh Affan | 242774 | BCT Project**.
* Real-time network and wallet status indicator (Connected network, wallet address, total issued certificate counter).
* Quick action navigation to Admin Issuance and Public Verification portals.
* Feature overview and workflow explanation.

### 2. Admin Dashboard (`admin.html`)
* MetaMask wallet connection authentication.
* Auto-generate unique Certificate ID helper.
* File dropzone with client-side **SHA-256 document hashing** via `crypto.subtle.digest`.
* Smart contract transaction execution with real-time progress modal.
* Session table displaying all issued certificates.

### 3. Public Verification Portal (`verify.html`)
* Instant Certificate ID lookup against the Ethereum ledger.
* **Certificate Verified Successfully** green status banner for authentic credentials.
* **Certificate Not Found / Invalid Certificate** red warning banner for invalid inputs.
* Printable / Downloadable PDF certificate layout.
* Copy document hash and view transaction details.

### 4. Project Documentation & Viva Guide (`about.html`)
* Comprehensive project architecture details.
* Viva voce presentation Q&A guide.

---

## 🏗️ System Architecture

```text
+-----------------------+        +--------------------------+        +-------------------------------+
|  Institute Admin      |        |  Student / Recruiter     |        |  MetaMask Wallet & Ethers.js  |
|  (admin.html)         |        |  (verify.html)           |        |  (Web3 Client-Side Provider)  |
+-----------+-----------+        +------------+-------------+        +---------------+---------------+
            |                                 |                                  |
            +---------------------------------+----------------------------------+
                                              |
                                              v
                              +-------------------------------+
                              |    Netlify Static Frontend    |
                              |    (HTML5 / CSS3 / JS)        |
                              +---------------+---------------+
                                              |
                                              v
                              +-------------------------------+
                              |   Ethereum Blockchain         |
                              |   CertificateVerification.sol |
                              +-------------------------------+
```

---

## 🛠️ Technology Stack

* **Blockchain:** Ethereum Network (Sepolia Testnet / Hardhat / Ganache / Remix VM)
* **Smart Contract Language:** Solidity 0.8.x
* **Development Environment:** Remix IDE
* **Wallet Connection:** MetaMask Chrome Extension
* **Frontend Web Library:** Ethers.js v5.7.2
* **Frontend Stack:** HTML5, Vanilla CSS3 (Glassmorphism), ES6 JavaScript
* **Static Hosting:** Netlify

---

## 📜 Smart Contract Design (`contracts/CertificateVerification.sol`)

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

## 🚀 Installation & Local Running

1. **Clone or Extract Repository:**
   ```bash
   cd MINI
   ```

2. **Run Local Web Server:**
   ```bash
   npm start
   ```
   Or open `frontend/index.html` directly in any modern browser.

3. **Deploy Smart Contract (Optional):**
   Follow instructions in `deployment/deployment-guide.md` to deploy `CertificateVerification.sol` via Remix.

---

## ☁️ Netlify Deployment

1. Push code to GitHub repository.
2. Link repo to Netlify.
3. Set **Publish Directory** to `frontend`.
4. Netlify will deploy the frontend instantly with zero backend setup.

---

## 🧪 Test Cases

| Test Case | Scenario | Expected Result | Result |
|---|---|---|---|
| TC-01 | Issue valid certificate | Transaction confirmed & recorded on-chain | PASS |
| TC-02 | Duplicate Certificate ID | Contract throws error: "Certificate ID already exists" | PASS |
| TC-03 | Verify existing Certificate ID | Displays green banner: "Certificate Verified Successfully" | PASS |
| TC-04 | Verify invalid Certificate ID | Displays red banner: "Certificate Not Found" | PASS |
| TC-05 | Non-admin issuing certificate | Transaction reverts due to `onlyAdmin` check | PASS |
| TC-06 | File SHA-256 calculation | Browser computes exact 64-character hex hash | PASS |

---

## 🌟 Advantages

* **100% Immutable:** Certificates cannot be modified once mined on Ethereum.
* **Zero Backend Infrastructure:** No Node.js database servers needed on Netlify.
* **Instant Verification:** Verification takes less than 2 seconds.
* **Cost Effective:** Only certificate issuance requires gas; verification calls are free (`view` functions).

---

## 🚀 Future Scope

* Integration with IPFS (InterPlanetary File System) for storing full PDF certificate files.
* Multi-institute decentralized autonomous organization (DAO) governance.
* QR-code scanning on mobile devices.

---

## 👨‍🎓 Project Credits

**Developed by:** Shaikh Affan  
**Roll Number:** 242774  
**Subject:** BCT Mini Project  
**College Submission Version:** 1.0.0
