// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract MedicalRecords {
    
    // Structure to represent a medical record
    struct Record {
        string diagnosis;
        string treatment;
        uint timestamp;
    }
    
    // Mapping from patient address to their medical records
    mapping(address => Record[]) private patientRecords;
    
    // Mapping from healthcare provider address to their authorized patients
    mapping(address => address[]) private providerPatients;
    
    // Event to log record creation
    event RecordAdded(address indexed patient, string diagnosis, string treatment, uint timestamp);
    
    // Modifier to check if caller is the patient or authorized healthcare provider
    modifier onlyAuthorized(address patient) {
        require(msg.sender == patient || isProviderAuthorized(patient, msg.sender), "Unauthorized");
        _;
    }
    
    // Function to add a new medical record
    function addRecord(string memory _diagnosis, string memory _treatment) public onlyAuthorized(msg.sender) {
        Record memory newRecord = Record(_diagnosis, _treatment, block.timestamp);
        patientRecords[msg.sender].push(newRecord);
        emit RecordAdded(msg.sender, _diagnosis, _treatment, block.timestamp);
    }
    
    // Function to get the number of records for a patient
    function getRecordCount() public view returns(uint) {
        return patientRecords[msg.sender].length;
    }
    
    // Function to get a specific record for a patient
    function getRecord(uint index) public view returns(string memory diagnosis, string memory treatment, uint timestamp) {
        require(index < patientRecords[msg.sender].length, "Record not found");
        Record memory record = patientRecords[msg.sender][index];
        return (record.diagnosis, record.treatment, record.timestamp);
    }
    
    // Function to authorize a healthcare provider to access patient's records
    function authorizeProvider(address provider) public {
        providerPatients[msg.sender].push(provider);
    }
    
    // Function to check if a healthcare provider is authorized to access patient's records
    function isProviderAuthorized(address patient, address provider) private view returns(bool) {
        for (uint i = 0; i < providerPatients[patient].length; i++) {
            if (providerPatients[patient][i] == provider) {
                return true;
            }
        }
        return false;
    }
}
