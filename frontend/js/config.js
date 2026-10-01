/**
 * Configuration File for Decentralized Certificate Verification DApp
 * Project: Decentralized Certificate Verification DApp Using Ethereum
 * Team Members:
 *  - Shaikh Affan — 242774
 *  - Shaikh Sohail Salim — 231754
 *  - Shaikh Uzhair Mohd Ilyas — 231755
 * Subject: BCT Project
 */

const CONFIG = {
    // Project & Team Information
    PROJECT_NAME: "Decentralized Certificate Verification DApp Using Ethereum",
    SUBJECT: "BCT Project",
    INSTITUTE: "BCT Engineering Institute",
    
    TEAM_MEMBERS: [
        { name: "Shaikh Affan", rollNo: "242774" },
        { name: "Shaikh Sohail Salim", rollNo: "231754" },
        { name: "Shaikh Uzhair Mohd Ilyas", rollNo: "231755" }
    ],

    // Smart Contract Configuration
    CONTRACT_ADDRESS: "0x358AA13c52544EC2c6E1A8481047A13400C3C759",

    // Set REQUIRED_CHAIN_ID to null to allow ANY connected network (Mainnet, Sepolia, Hardhat, Ganache, etc.)
    // Or set to "0xaa36a7" for Sepolia Testnet specifically
    REQUIRED_CHAIN_ID: null, 
    NETWORK_NAME: "Ethereum Network",
    BLOCK_EXPLORER_URL: "https://etherscan.io",

    // Full Smart Contract ABI matching CertificateVerification.sol
    CONTRACT_ABI: [
        {
            "inputs": [],
            "stateMutability": "nonpayable",
            "type": "constructor"
        },
        {
            "anonymous": false,
            "inputs": [
                { "indexed": true, "internalType": "address", "name": "previousAdmin", "type": "address" },
                { "indexed": true, "internalType": "address", "name": "newAdmin", "type": "address" }
            ],
            "name": "AdminTransferred",
            "type": "event"
        },
        {
            "anonymous": false,
            "inputs": [
                { "indexed": true, "internalType": "string", "name": "certificateId", "type": "string" },
                { "indexed": false, "internalType": "string", "name": "studentName", "type": "string" },
                { "indexed": false, "internalType": "string", "name": "studentId", "type": "string" },
                { "indexed": false, "internalType": "string", "name": "course", "type": "string" },
                { "indexed": false, "internalType": "string", "name": "issueDate", "type": "string" },
                { "indexed": false, "internalType": "string", "name": "documentHash", "type": "string" },
                { "indexed": true, "internalType": "address", "name": "issuedBy", "type": "address" },
                { "indexed": false, "internalType": "uint256", "name": "timestamp", "type": "uint256" }
            ],
            "name": "CertificateIssued",
            "type": "event"
        },
        {
            "inputs": [],
            "name": "admin",
            "outputs": [{ "internalType": "address", "name": "", "type": "address" }],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
            "name": "certificateIds",
            "outputs": [{ "internalType": "string", "name": "", "type": "string" }],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [{ "internalType": "string", "name": "", "type": "string" }],
            "name": "certificates",
            "outputs": [
                { "internalType": "string", "name": "certificateId", "type": "string" },
                { "internalType": "string", "name": "studentName", "type": "string" },
                { "internalType": "string", "name": "studentId", "type": "string" },
                { "internalType": "string", "name": "course", "type": "string" },
                { "internalType": "string", "name": "issueDate", "type": "string" },
                { "internalType": "string", "name": "documentHash", "type": "string" },
                { "internalType": "address", "name": "issuedBy", "type": "address" },
                { "internalType": "bool", "name": "exists", "type": "bool" },
                { "internalType": "uint256", "name": "timestamp", "type": "uint256" }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [{ "internalType": "string", "name": "_certificateId", "type": "string" }],
            "name": "getCertificate",
            "outputs": [
                { "internalType": "string", "name": "studentName", "type": "string" },
                { "internalType": "string", "name": "studentId", "type": "string" },
                { "internalType": "string", "name": "course", "type": "string" },
                { "internalType": "string", "name": "issueDate", "type": "string" },
                { "internalType": "string", "name": "documentHash", "type": "string" },
                { "internalType": "address", "name": "issuedBy", "type": "address" },
                { "internalType": "bool", "name": "exists", "type": "bool" },
                { "internalType": "uint256", "name": "timestamp", "type": "uint256" }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [],
            "name": "getTotalCertificates",
            "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [{ "internalType": "string", "name": "_certificateId", "type": "string" }],
            "name": "isCertificateValid",
            "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [
                { "internalType": "string", "name": "_certificateId", "type": "string" },
                { "internalType": "string", "name": "_studentName", "type": "string" },
                { "internalType": "string", "name": "_studentId", "type": "string" },
                { "internalType": "string", "name": "_course", "type": "string" },
                { "internalType": "string", "name": "_issueDate", "type": "string" },
                { "internalType": "string", "name": "_documentHash", "type": "string" }
            ],
            "name": "issueCertificate",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "inputs": [{ "internalType": "address", "name": "_newAdmin", "type": "address" }],
            "name": "transferAdmin",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        }
    ],

    // Demo Initial Data (Used ONLY as fallback when blockchain contract is not yet deployed)
    SAMPLE_CERTIFICATES: {
        "CERT-2026-001": {
            certificateId: "CERT-2026-001",
            studentName: "Shaikh Affan",
            studentId: "242774",
            course: "Bachelor of Computer Technology (BCT)",
            issueDate: "2026-09-30",
            documentHash: "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
            issuedBy: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
            exists: true,
            timestamp: 1759190400,
            isDemoData: true
        },
        "CERT-2026-002": {
            certificateId: "CERT-2026-002",
            studentName: "Shaikh Sohail Salim",
            studentId: "231754",
            course: "Blockchain Engineering Specialization",
            issueDate: "2026-09-28",
            documentHash: "a1b2c3d4e5f67890123456789abcdef0123456789abcdef0123456789abcdef0",
            issuedBy: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
            exists: true,
            timestamp: 1759017600,
            isDemoData: true
        }
    }
};

if (typeof window !== 'undefined') {
    window.CONFIG = CONFIG;
}
