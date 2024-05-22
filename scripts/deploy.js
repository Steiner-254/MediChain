async function main() {
    const MedicalRecords = await ethers.getContractFactory("MedicalRecords");
    const medicalRecords = await MedicalRecords.deploy();
    console.log("MedicalRecords deployed to:", medicalRecords.address);
}

main()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error);
        process.exit(1);
    });
