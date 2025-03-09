// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract CertificateVerification {
    struct Certificate {
        string certificateNumber;
        address issuer;
        uint256 timestamp;
        bool isValid;
        bytes32 dataHash;
    }

    mapping(string => Certificate) public certificates;
    address public owner;

    event CertificateIssued(string certificateNumber, bytes32 dataHash, uint256 timestamp);
    event CertificateRevoked(string certificateNumber, uint256 timestamp);

    constructor() {
        owner = msg.sender;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can perform this action");
        _;
    }

    function issueCertificate(string memory certificateNumber, bytes32 dataHash) public onlyOwner {
        require(!certificates[certificateNumber].isValid, "Certificate already exists");
        
        certificates[certificateNumber] = Certificate({
            certificateNumber: certificateNumber,
            issuer: msg.sender,
            timestamp: block.timestamp,
            isValid: true,
            dataHash: dataHash
        });

        emit CertificateIssued(certificateNumber, dataHash, block.timestamp);
    }

    function revokeCertificate(string memory certificateNumber) public onlyOwner {
        require(certificates[certificateNumber].isValid, "Certificate does not exist or is already revoked");
        
        certificates[certificateNumber].isValid = false;
        emit CertificateRevoked(certificateNumber, block.timestamp);
    }

    function verifyCertificate(string memory certificateNumber, bytes32 dataHash) public view returns (bool) {
        Certificate memory cert = certificates[certificateNumber];
        return cert.isValid && cert.dataHash == dataHash;
    }

    function getCertificateDetails(string memory certificateNumber) public view returns (
        address issuer,
        uint256 timestamp,
        bool isValid,
        bytes32 dataHash
    ) {
        Certificate memory cert = certificates[certificateNumber];
        return (cert.issuer, cert.timestamp, cert.isValid, cert.dataHash);
    }
} 