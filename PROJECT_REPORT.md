# BCT COLLEGE MINI PROJECT REPORT

# Decentralized Certificate Verification DApp Using Ethereum

---

**PROJECT TEAM MEMBERS:**  
- **Shaikh Affan** (Roll No: 242774)  
- **Shaikh Sohail Salim** (Roll No: 231754)  
- **Shaikh Uzhair Mohd Ilyas** (Roll No: 231755)  

**SUBJECT:** Bachelor of Computer Technology (BCT Project)  
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

Academic credentials and educational certificates serve as vital proof of qualification for employment, higher studies, and professional licensing. However, conventional paper and digital PDF certificates are increasingly susceptible to forgery, fraud, and unauthorized alteration. Verification of credentials traditionally involves manual correspondence with issuing institutions, leading to prolonged delays, administrative overhead, and vulnerability to centralized database tampering.

This project presents a **Decentralized Certificate Verification DApp** built on the **Ethereum blockchain**. Developed for **BCT Project** by **Shaikh Affan (242774), Shaikh Sohail Salim (231754), and Shaikh Uzhair Mohd Ilyas (231755)**, the application leverages **Solidity 0.8.x** smart contracts, **MetaMask** Web3 wallet authentication, **Ethers.js**, and client-side **HTML5/CSS3/JavaScript** hosted statically on **Netlify**. 

The smart contract provides tamper-proof storage of student metadata, certificate identifiers, and document SHA-256 hashes. Role-based access control (`onlyAdmin`) ensures that only authorized educational bodies can issue certificates via MetaMask signing. Anyone can verify certificate authenticity publicly via a web browser without paying gas fees or requiring centralized backend database servers.

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

* To design and deploy a **Solidity 0.8.x smart contract** for certificate issuance and cryptographic retrieval.
* To implement strict role-based access control (`onlyAdmin`) ensuring only authorized institute admin wallets can issue credentials.
* To integrate **MetaMask** wallet transaction signing and **Ethers.js** provider communication.
* To prevent duplicate certificate issuance through unique key mapping validation.
* To compute document **SHA-256 cryptographic hashes** on the client side using Web Crypto APIs.
* To create a modern, responsive user interface (Glassmorphism Cyber-Ethereum theme) suitable for college demonstration.
* To deploy the static frontend on **Netlify** with zero traditional backend dependencies.

---

## 7. SYSTEM ARCHITECTURE

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

## 16. CONCLUSION

The **Decentralized Certificate Verification DApp** successfully demonstrates how Ethereum blockchain technology, Ethers.js, and MetaMask can eliminate credential forgery and slow manual verification. Developed as a **BCT Project by Shaikh Affan (242774), Shaikh Sohail Salim (231754), and Shaikh Uzhair Mohd Ilyas (231755)**, the system achieves immutable certificate issuance, real transaction mining execution, instant public verification, and seamless static deployment on Netlify.
