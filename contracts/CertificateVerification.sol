// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title CertificateVerification
 * @dev Decentralized Certificate Verification DApp Smart Contract
 * @author Shaikh Affan (Roll No: 242774) - BCT Project
 * @notice Allows an authorized institute (admin) to issue digital certificates
 *         and enables anyone to verify their authenticity on the Ethereum blockchain.
 */
contract CertificateVerification {

    // Structure representing a digital certificate
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

    // Owner / Admin address (Authorized Educational Institution)
    address public admin;

    // Mapping from Certificate ID => Certificate Details
    mapping(string => Certificate) public certificates;

    // Array to store all issued Certificate IDs for iteration & statistics
    string[] public certificateIds;

    // Events
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

    event AdminTransferred(address indexed previousAdmin, address indexed newAdmin);

    // Modifiers
    modifier onlyAdmin() {
        require(msg.sender == admin, "Error: Only authorized institute admin can perform this action.");
        _;
    }

    /**
     * @dev Contract constructor sets the deployer as the initial institute admin
     */
    constructor() {
        admin = msg.sender;
    }

    /**
     * @notice Issue a new tamper-proof certificate on the blockchain
     * @param _certificateId Unique identifier for the certificate (e.g., CERT-2026-001)
     * @param _studentName Full name of the student
     * @param _studentId Student roll number or registration ID
     * @param _course Name of the degree / program / course
     * @param _issueDate Date of certificate issuance (YYYY-MM-DD)
     * @param _documentHash SHA-256 hash of the original document/pdf
     */
    function issueCertificate(
        string memory _certificateId,
        string memory _studentName,
        string memory _studentId,
        string memory _course,
        string memory _issueDate,
        string memory _documentHash
    ) public onlyAdmin {
        // Validation checks
        require(bytes(_certificateId).length > 0, "Error: Certificate ID cannot be empty.");
        require(bytes(_studentName).length > 0, "Error: Student Name cannot be empty.");
        require(bytes(_studentId).length > 0, "Error: Student ID cannot be empty.");
        require(bytes(_course).length > 0, "Error: Course cannot be empty.");
        require(bytes(_issueDate).length > 0, "Error: Issue Date cannot be empty.");
        require(bytes(_documentHash).length > 0, "Error: Document Hash cannot be empty.");
        
        // Prevent duplicate certificate IDs
        require(!certificates[_certificateId].exists, "Error: Certificate with this ID already exists.");

        // Store certificate in mapping
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

        // Add ID to tracking list
        certificateIds.push(_certificateId);

        // Emit event
        emit CertificateIssued(
            _certificateId,
            _studentName,
            _studentId,
            _course,
            _issueDate,
            _documentHash,
            msg.sender,
            block.timestamp
        );
    }

    /**
     * @notice Retrieve certificate details using Certificate ID
     * @param _certificateId Unique identifier of the certificate
     */
    function getCertificate(string memory _certificateId)
        external
        view
        returns (
            string memory studentName,
            string memory studentId,
            string memory course,
            string memory issueDate,
            string memory documentHash,
            address issuedBy,
            bool exists,
            uint256 timestamp
        )
    {
        Certificate memory cert = certificates[_certificateId];
        require(cert.exists, "Error: Certificate ID does not exist.");

        return (
            cert.studentName,
            cert.studentId,
            cert.course,
            cert.issueDate,
            cert.documentHash,
            cert.issuedBy,
            cert.exists,
            cert.timestamp
        );
    }

    /**
     * @notice Quickly check if a certificate ID exists
     * @param _certificateId Unique identifier to verify
     * @return bool True if valid certificate exists
     */
    function isCertificateValid(string memory _certificateId) external view returns (bool) {
        return certificates[_certificateId].exists;
    }

    /**
     * @notice Get total number of certificates issued by the smart contract
     * @return uint256 Count of certificates
     */
    function getTotalCertificates() external view returns (uint256) {
        return certificateIds.length;
    }

    /**
     * @notice Transfer admin ownership to another authorized institute address
     * @param _newAdmin Address of the new admin
     */
    function transferAdmin(address _newAdmin) external onlyAdmin {
        require(_newAdmin != address(0), "Error: Invalid admin address.");
        address oldAdmin = admin;
        admin = _newAdmin;
        emit AdminTransferred(oldAdmin, _newAdmin);
    }
}
