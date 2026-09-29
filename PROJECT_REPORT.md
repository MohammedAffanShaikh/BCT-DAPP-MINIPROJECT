# BCT COLLEGE MINI PROJECT REPORT

# Decentralized Certificate Verification DApp Using Ethereum

---

**STUDENT NAME:** Shaikh Affan  
**ROLL NUMBER:** 242774  
**SUBJECT:** Bachelor of Computer Technology (BCT)  
**PROJECT TITLE:** Decentralized Certificate Verification DApp Using Ethereum  
**SUBMISSION YEAR:** 2026  

---

## TABLE OF CONTENTS

1. Abstract
2. Introduction
3. Problem Statement
4. Objectives
5. Existing System
6. Proposed System
7. System Architecture
8. Methodology
9. Smart Contract Design
10. DApp Workflow
11. Implementation
12. Results & Demonstration
13. Advantages
14. Limitations
15. Future Scope
16. Conclusion
17. References

---

## 1. ABSTRACT

Educational credentials and academic certificates serve as vital proof of qualification for employment, higher studies, and licensing. However, conventional paper and digital PDF certificates are increasingly susceptible to forgery, fraud, and unauthorized alteration. Verification of credentials traditionally involves manual correspondence with issuing institutions, leading to prolonged delays, administrative overhead, and vulnerability to centralized database tampering.

This mini project presents a **Decentralized Certificate Verification DApp** built on the **Ethereum blockchain**. Developed for **BCT** by **Shaikh Affan (Roll No: 242774)**, the application leverages **Solidity 0.8.x** smart contracts, **MetaMask** wallet authentication, **Ethers.js**, and client-side **HTML5/CSS3/JavaScript** hosted statically on **Netlify**. 

The smart contract provides tamper-proof storage of student metadata, certificate identifiers, and document SHA-256 hashes. Role-based access control (`onlyAdmin`) ensures that only authorized educational bodies can issue certificates. Anyone can verify certificate authenticity publicly via a web browser without paying gas fees or requiring centralized backend database servers.

---

## 2. INTRODUCTION

The rapid expansion of online education and global workforce mobility has highlighted the urgent need for tamper-evident, globally accessible academic credential verification systems. Blockchain technology provides a decentralized, append-only, cryptographic ledger that offers immutability, transparency, and high availability.

By deploying smart contracts on the Ethereum network, educational institutions can record certificate issuance on a decentralized ledger. Once written, the record cannot be altered, deleted, or backdated by any entity. This project implements an end-to-end decentralized application (DApp) that demonstrates how Web3 technologies solve certificate verification challenges effectively.

---

## 3. PROBLEM STATEMENT

1. **Certificate Forgery:** Traditional paper and digital PDF certificates are easily modified using graphic editing tools.
2. **Slow Verification Process:** Verification currently requires contacting university registrars manually, taking days or weeks.
3. **Single Point of Failure:** Centralized university databases can suffer server downtime, data corruption, or malicious data manipulation.
4. **Lack of Standardized Public Verification:** Employers lack a unified, instant method to verify degree authenticity without third-party fees.

---

## 4. OBJECTIVES

* To design and code an Ethereum smart contract in **Solidity 0.8.x** containing certificate structures, state mappings, and events.
* To implement strict role-based access control (`onlyAdmin`) ensuring only authorized institute admin wallets can issue credentials.
* To prevent duplicate certificate issuance through unique key mapping validation.
* To compute document **SHA-256 cryptographic hashes** on the client side using Web Crypto APIs.
* To create a modern, responsive user interface (Glassmorphism Cyber-Ethereum theme) suitable for college demonstration.
* To connect the frontend directly to Ethereum nodes using **Ethers.js** and **MetaMask**.
* To deploy the static frontend on **Netlify** with zero traditional backend dependencies.

---

## 5. EXISTING SYSTEM

In the existing credential verification model:
* Educational institutions issue physical degrees or email digital PDFs.
* Recruiters manually contact institutions via email/phone or hire third-party background verification agencies.
* Verification depends on manual human verification and centralized SQL databases.

### Disadvantages of Existing System:
* High operational cost and long turnaround times.
* Risk of insider database manipulation or corruption.
* Susceptible to counterfeit diploma mills.

---

## 6. PROPOSED SYSTEM

The proposed **Decentralized Certificate Verification DApp**:
* Uses Ethereum smart contracts as a tamper-proof public registry.
* Generates a cryptographic SHA-256 hash of student credentials and document files.
* Allows authorized institute administrators to mint certificates directly to the blockchain.
* Enables instant, zero-cost public verification for recruiters and verifiers worldwide.

---

## 7. SYSTEM ARCHITECTURE

```text
+-------------------------------------------------------------------------+
|                        INSTITUTE ADMIN (admin.html)                      |
|  1. Fills Student Details & Document Hash                               |
|  2. Connects MetaMask Wallet                                            |
|  3. Signs Transaction & Calls issueCertificate()                       |
+------------------------------------+------------------------------------+
                                     |
                                     v
+------------------------------------+------------------------------------+
|                   ETHEREUM SMART CONTRACT                               |
|               (CertificateVerification.sol)                             |
|  - checks onlyAdmin modifier                                            |
|  - verifies !certificates[id].exists                                    |
|  - updates mapping(string => Certificate)                               |
|  - emits CertificateIssued event                                        |
+------------------------------------+------------------------------------+
                                     |
                                     v
+------------------------------------+------------------------------------+
|                      PUBLIC VERIFIER (verify.html)                       |
|  1. Inputs Certificate ID                                               |
|  2. Calls getCertificate() via Ethers.js                                |
|  3. Displays "Certificate Verified Successfully" Banner                 |
+-------------------------------------------------------------------------+
```

---

## 8. METHODOLOGY

1. **Smart Contract Development:** Standardized data model created in Solidity using Remix IDE.
2. **Access Control:** Contract constructor records `msg.sender` as `admin`.
3. **Frontend Architecture:** Static HTML5, Vanilla CSS3 (Glassmorphism), and ES6 JavaScript.
4. **Blockchain Integration:** Ethers.js Web3Provider listens to MetaMask events and invokes contract methods.
5. **Static Hosting Deployment:** Configured `netlify.toml` publishing the `frontend` directory on Netlify.

---

## 9. SMART CONTRACT DESIGN

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract CertificateVerification {
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

    address public admin;
    mapping(string => Certificate) public certificates;
    string[] public certificateIds;

    event CertificateIssued(
        string indexed certificateId,
        string studentName,
        string studentId,
        string course,
        string issueDate,
        string documentHash,
        address indexed issuedBy,
        uint256 timestamp
    );

    modifier onlyAdmin() {
        require(msg.sender == admin, "Error: Only authorized institute admin can perform this action.");
        _;
    }

    constructor() {
        admin = msg.sender;
    }

    function issueCertificate(
        string memory _certificateId,
        string memory _studentName,
        string memory _studentId,
        string memory _course,
        string memory _issueDate,
        string memory _documentHash
    ) public onlyAdmin {
        require(bytes(_certificateId).length > 0, "Error: Certificate ID cannot be empty.");
        require(!certificates[_certificateId].exists, "Error: Certificate with this ID already exists.");

        certificates[_certificateId] = Certificate({
            certificateId: _certificateId,
            studentName: _studentName,
            studentId: _studentId,
            course: _course,
            issueDate: _issueDate,
            documentHash: _documentHash,
            issuedBy: msg.sender,
            exists: true,
            timestamp: block.timestamp
        });

        certificateIds.push(_certificateId);
        emit CertificateIssued(_certificateId, _studentName, _studentId, _course, _issueDate, _documentHash, msg.sender, block.timestamp);
    }

    function getCertificate(string memory _certificateId) external view returns (
        string memory studentName,
        string memory studentId,
        string memory course,
        string memory issueDate,
        string memory documentHash,
        address issuedBy,
        bool exists,
        uint256 timestamp
    ) {
        Certificate memory cert = certificates[_certificateId];
        require(cert.exists, "Error: Certificate ID does not exist.");
        return (cert.studentName, cert.studentId, cert.course, cert.issueDate, cert.documentHash, cert.issuedBy, cert.exists, cert.timestamp);
    }
}
```

---

## 10. DAPP WORKFLOW

1. **Admin Wallet Connection:** Admin opens `admin.html` and connects MetaMask.
2. **Form Input & Hashing:** Admin enters student details or uploads certificate file to generate SHA-256 hash.
3. **Transaction Execution:** Form submission calls `contract.issueCertificate()`.
4. **Block Mining:** Ethereum network validates and mines the block.
5. **Verification Lookup:** Verifier opens `verify.html`, submits Certificate ID, and reads data via free `view` call.

---

## 11. IMPLEMENTATION

The file structure is organized as follows:
```text
certificate-verification-dapp/
│
├── contracts/
│   └── CertificateVerification.sol
├── frontend/
│   ├── index.html
│   ├── admin.html
│   ├── verify.html
│   ├── about.html
│   ├── css/
│   │   └── style.css
│   └── js/
│       ├── app.js
│       ├── admin.js
│       ├── verify.js
│       └── config.js
├── README.md
├── PROJECT_REPORT.md
├── netlify.toml
└── deployment/
    └── deployment-guide.md
```

---

## 12. RESULTS & DEMONSTRATION

* **Header Banner:** Displays **Shaikh Affan | 242774 | BCT Project** on all pages.
* **Issuance Confirmation:** Generates real-time transaction hash upon mining.
* **Verification Output:** Displays green status badge **Certificate Verified Successfully** with official certificate layout.
* **Invalid Input Output:** Displays red status banner **Certificate Not Found / Invalid Certificate**.

---

## 13. ADVANTAGES

1. **Immutability:** Records cannot be deleted or altered once mined.
2. **Decentralization:** No single point of server failure.
3. **Instant Verification:** Verification completed in under 2 seconds.
4. **Netlify Compatible:** Runs on static web hosting with zero server setup cost.

---

## 14. LIMITATIONS

1. **Gas Cost:** Issuing certificates requires Ethereum gas fees on live mainnet (mitigated by using testnets like Sepolia).
2. **MetaMask Dependency:** Admin issuance requires MetaMask browser extension.

---

## 15. FUTURE SCOPE

1. **IPFS Integration:** Storing full PDF documents on InterPlanetary File System.
2. **Multi-Signatory Support:** Requiring approval from dean and department head before certificate activation.
3. **QR Code Scanning:** Quick mobile camera verification.

---

## 16. CONCLUSION

The **Decentralized Certificate Verification DApp** successfully demonstrates how Ethereum blockchain technology and Web3 tools can solve credential forgery and slow verification. Developed as a **BCT Mini Project by Shaikh Affan (Roll No: 242774)**, the system achieves immutable certificate issuance, instant public verification, and seamless static deployment on Netlify.

---

## 17. REFERENCES

1. Antonopoulos, A. M., & Wood, G. (2018). *Mastering Ethereum: Building Smart Contracts and DApps*. O'Reilly Media.
2. Ethereum Foundation. (2026). *Solidity Documentation v0.8.x*. https://docs.soliditylang.org/
3. Ethers.js Documentation. (2026). *Complete Web3 Provider Interface*. https://docs.ethers.org/
4. MetaMask Developer Docs. (2026). *Ethereum Provider API*. https://docs.metamask.io/
