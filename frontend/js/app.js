/**
 * Main Application Logic & Blockchain Provider Helper
 * Student: Shaikh Affan | Roll No: 242774 | BCT Project
 */

let provider = null;
let signer = null;
let contract = null;
let currentAccount = null;

// Initialize app when window loads
window.addEventListener('DOMContentLoaded', async () => {
    updateStudentHeader();
    initializeLocalStorageCertificates();
    await checkMetaMaskConnection();
    updateNetworkStatusUI();
    setupEventListeners();
});

/**
 * Ensures student badge is populated across all pages
 */
function updateStudentHeader() {
    const studentHeaderEl = document.getElementById('student-header-info');
    if (studentHeaderEl) {
        studentHeaderEl.innerHTML = `
            <span>🎓 Student: <strong>${CONFIG.STUDENT_NAME}</strong></span>
            <span class="student-badge-pill">Roll No: ${CONFIG.ROLL_NO}</span>
            <span>Subject: ${CONFIG.SUBJECT}</span>
        `;
    }
}

/**
 * Initialize sample certificates in local storage if not already present
 */
function initializeLocalStorageCertificates() {
    if (!localStorage.getItem('dapp_certificates')) {
        localStorage.setItem('dapp_certificates', JSON.stringify(CONFIG.SAMPLE_CERTIFICATES));
    }
}

/**
 * Helper to retrieve certificate storage object
 */
function getStoredCertificates() {
    try {
        return JSON.parse(localStorage.getItem('dapp_certificates')) || {};
    } catch (e) {
        return CONFIG.SAMPLE_CERTIFICATES;
    }
}

/**
 * Helper to save a certificate into local storage
 */
function saveCertificateToStorage(certObj) {
    const certs = getStoredCertificates();
    certs[certObj.certificateId] = certObj;
    localStorage.setItem('dapp_certificates', JSON.stringify(certs));
}

/**
 * Checks for window.ethereum (MetaMask) availability
 */
async function checkMetaMaskConnection() {
    const walletBtn = document.getElementById('connect-wallet-btn');

    if (typeof window.ethereum !== 'undefined') {
        try {
            // Ethers v5 / v6 compatibility
            if (window.ethers) {
                provider = new ethers.providers.Web3Provider(window.ethereum);
            }

            const accounts = await window.ethereum.request({ method: 'eth_accounts' });
            if (accounts.length > 0) {
                currentAccount = accounts[0];
                if (provider) {
                    signer = provider.getSigner();
                    if (CONFIG.CONTRACT_ADDRESS && CONFIG.CONTRACT_ABI.length > 0) {
                        contract = new ethers.Contract(CONFIG.CONTRACT_ADDRESS, CONFIG.CONTRACT_ABI, signer);
                    }
                }
                onWalletConnected(currentAccount);
            }
        } catch (err) {
            console.warn("MetaMask connection check error:", err);
        }

        // Listen for account changes
        window.ethereum.on('accountsChanged', (accounts) => {
            if (accounts.length === 0) {
                onWalletDisconnected();
            } else {
                currentAccount = accounts[0];
                onWalletConnected(currentAccount);
                window.location.reload();
            }
        });

        // Listen for chain changes
        window.ethereum.on('chainChanged', () => {
            window.location.reload();
        });
    } else {
        if (walletBtn) {
            walletBtn.innerHTML = `🦊 Install MetaMask`;
            walletBtn.onclick = () => window.open('https://metamask.io/download/', '_blank');
        }
    }
}

/**
 * Connect wallet trigger
 */
async function connectWallet() {
    if (typeof window.ethereum === 'undefined') {
        showToast("MetaMask is not installed! Running in preview/demo mode.", "warning");
        return;
    }

    try {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        currentAccount = accounts[0];
        if (window.ethers) {
            provider = new ethers.providers.Web3Provider(window.ethereum);
            signer = provider.getSigner();
            if (CONFIG.CONTRACT_ADDRESS && CONFIG.CONTRACT_ABI.length > 0) {
                contract = new ethers.Contract(CONFIG.CONTRACT_ADDRESS, CONFIG.CONTRACT_ABI, signer);
            }
        }
        onWalletConnected(currentAccount);
        showToast("Wallet connected successfully!", "success");
    } catch (err) {
        console.error("Wallet connection error:", err);
        showToast("User rejected wallet connection or error occurred.", "error");
    }
}

function onWalletConnected(account) {
    const walletBtn = document.getElementById('connect-wallet-btn');
    if (walletBtn) {
        const shortAddr = account.substring(0, 6) + "..." + account.substring(account.length - 4);
        walletBtn.innerHTML = `🟢 ${shortAddr}`;
        walletBtn.classList.add('connected');
    }
    updateNetworkStatusUI();
}

function onWalletDisconnected() {
    currentAccount = null;
    signer = null;
    contract = null;
    const walletBtn = document.getElementById('connect-wallet-btn');
    if (walletBtn) {
        walletBtn.innerHTML = `🦊 Connect MetaMask`;
        walletBtn.classList.remove('connected');
    }
    updateNetworkStatusUI();
}

/**
 * Updates status bar UI (Connected Network, Admin status, Total cert count)
 */
async function updateNetworkStatusUI() {
    const netNameEl = document.getElementById('network-name-val');
    const accountEl = document.getElementById('account-address-val');
    const certCountEl = document.getElementById('total-certs-val');
    const netIndicator = document.getElementById('network-indicator');

    const certsMap = getStoredCertificates();
    const certCount = Object.keys(certsMap).length;

    if (certCountEl) certCountEl.innerText = certCount;

    if (currentAccount) {
        if (accountEl) {
            accountEl.innerText = currentAccount.substring(0, 8) + "..." + currentAccount.substring(currentAccount.length - 6);
        }
        if (netIndicator) netIndicator.classList.add('online');

        if (provider) {
            try {
                const network = await provider.getNetwork();
                if (netNameEl) netNameEl.innerText = network.name === 'unknown' ? 'Local RPC / Sepolia' : network.name.toUpperCase();
            } catch (e) {
                if (netNameEl) netNameEl.innerText = "MetaMask Connected";
            }
        } else {
            if (netNameEl) netNameEl.innerText = "Ethereum Provider Active";
        }
    } else {
        if (accountEl) accountEl.innerText = "Not Connected";
        if (netNameEl) netNameEl.innerText = "Browser Demo Mode";
        if (netIndicator) netIndicator.classList.remove('online');
    }
}

/**
 * Toast Notification System
 */
function showToast(message, type = 'info') {
    let container = document.getElementById('toast-container');
    if (!container) {
        container = document.createElement('div');
        container.id = 'toast-container';
        document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    
    let icon = 'ℹ️';
    if (type === 'success') icon = '✅';
    if (type === 'error') icon = '❌';
    if (type === 'warning') icon = '⚠️';

    toast.innerHTML = `<span>${icon}</span> <div>${message}</div>`;
    container.appendChild(toast);

    setTimeout(() => {
        toast.remove();
    }, 4500);
}

function setupEventListeners() {
    const walletBtn = document.getElementById('connect-wallet-btn');
    if (walletBtn && (!walletBtn.onclick || walletBtn.onclick.toString().includes('metamask'))) {
        walletBtn.addEventListener('click', connectWallet);
    }
}
