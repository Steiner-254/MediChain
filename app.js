const contractAddress = '0xe7f1725e7734ce288f8367e1bb143e90bb3f0512';
const contractABI = [
    {
       "anonymous": false,
       "inputs": [
          {
             "indexed": true,
             "internalType": "address",
             "name": "patient",
             "type": "address"
          },
          {
             "indexed": false,
             "internalType": "string",
             "name": "diagnosis",
             "type": "string"
          },
          {
             "indexed": false,
             "internalType": "string",
             "name": "treatment",
             "type": "string"
          },
          {
             "indexed": false,
             "internalType": "uint256",
             "name": "timestamp",
             "type": "uint256"
          }
       ],
       "name": "RecordAdded",
       "type": "event"
    },
    {
       "inputs": [
          {
             "internalType": "string",
             "name": "_diagnosis",
             "type": "string"
          },
          {
             "internalType": "string",
             "name": "_treatment",
             "type": "string"
          }
       ],
       "name": "addRecord",
       "outputs": [],
       "stateMutability": "nonpayable",
       "type": "function"
    },
    {
       "inputs": [
          {
             "internalType": "address",
             "name": "provider",
             "type": "address"
          }
       ],
       "name": "authorizeProvider",
       "outputs": [],
       "stateMutability": "nonpayable",
       "type": "function"
    },
    {
       "inputs": [
          {
             "internalType": "uint256",
             "name": "index",
             "type": "uint256"
          }
       ],
       "name": "getRecord",
       "outputs": [
          {
             "internalType": "string",
             "name": "diagnosis",
             "type": "string"
          },
          {
             "internalType": "string",
             "name": "treatment",
             "type": "string"
          },
          {
             "internalType": "uint256",
             "name": "timestamp",
             "type": "uint256"
          }
       ],
       "stateMutability": "view",
       "type": "function"
    },
    {
       "inputs": [],
       "name": "getRecordCount",
       "outputs": [
          {
             "internalType": "uint256",
             "name": "",
             "type": "uint256"
          }
       ],
       "stateMutability": "view",
       "type": "function"
    }
];

let web3;
let contract;
let isConnected = false;

window.addEventListener('load', async () => {
    if (window.ethereum) {
        web3 = new Web3(window.ethereum);
        try {
            await window.ethereum.enable();
            isConnected = true;
            initContract();
            updateConnectButton();
        } catch (error) {
            console.error("User denied account access");
        }
    } else if (window.web3) {
        web3 = new Web3(web3.currentProvider);
        isConnected = true;
        initContract();
        updateConnectButton();
    } else {
        console.log('No web3 provider detected');
    }
});

function initContract() {
    contract = new web3.eth.Contract(contractABI, contractAddress);
}

async function connectWallet() {
    if (!isConnected) {
        try {
            const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
            if (accounts.length > 0) {
                isConnected = true;
                updateConnectButton();
                console.log('Wallet connected');
            }
        } catch (error) {
            console.error(error);
        }
    } else {
        try {
            await web3.currentProvider.disconnect();
            isConnected = false;
            updateConnectButton();
            console.log('Wallet disconnected');
        } catch (error) {
            console.error(error);
        }
    }
}

function updateConnectButton() {
    const connectWalletBtn = document.getElementById('connectWalletBtn');
    if (isConnected) {
        connectWalletBtn.textContent = 'Connected';
        connectWalletBtn.disabled = true; // Disable button when already connected
    } else {
        connectWalletBtn.textContent = 'Connect Wallet';
        connectWalletBtn.disabled = false; // Enable button when not connected
    }
}

async function addRecord() {
    const diagnosis = document.getElementById('diagnosis').value;
    const treatment = document.getElementById('treatment').value;
    const accounts = await web3.eth.getAccounts();
    await contract.methods.addRecord(diagnosis, treatment).send({ from: accounts[0] });
    console.log('Record added');
}

async function getRecords() {
    const accounts = await web3.eth.getAccounts();
    const count = await contract.methods.getRecordCount().call({ from: accounts[0] });
    const recordsList = document.getElementById('recordsList');
    recordsList.innerHTML = '';
    for (let i = 0; i < count; i++) {
        const record = await contract.methods.getRecord(i).call({ from: accounts[0] });
        const listItem = document.createElement('li');
        listItem.textContent = `Diagnosis: ${record[0]}, Treatment: ${record[1]}, Timestamp: ${record[2]}`;
        recordsList.appendChild(listItem);
    }
}
