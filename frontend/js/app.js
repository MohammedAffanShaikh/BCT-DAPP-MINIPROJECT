/**
 * Main Application Logic & Real Blockchain Provider Helper
 * Project: Decentralized Certificate Verification DApp Using Ethereum
 * Team Members:
 *  - Shaikh Affan — 242774
 *  - Shaikh Sohail Salim — 231754
 *  - Shaikh Uzhair Mohd Ilyas — 231755
 * Subject: BCT Project
 */

let provider = null;
let signer = null;
let contract = null;
let currentAccount = null;
let currentChainId = null;

// Initialize app when window loads
window.addEventListener('DOMContentLoaded', async () => {
    updateHeaderAndFooterTeamInfo();
    initializeLocalStorageCertificates();
    await checkMetaMaskConnection();
    setupEventListeners();

    // Secondary check after 500ms in case extension injection is delayed
    setTimeout(async () => {
        if (!currentAccount && getEthereumProvider()) {
            await checkMetaMaskConnection();
        }
    }, 500);
});

// Listen for standard EIP-6963 / ethereum initialized events
window.addEventListener('ethereum#initialized', checkMetaMaskConnection, { once: true });

/**
 * Robustly resolves the Ethereum provider (handling multiple wallet extensions like MetaMask, Phantom, Brave)
 */
function getEthereumProvider() {
    if (typeof window.ethereum !== 'undefined') {
        if (window.ethereum.providers && window.ethereum.providers.length > 0) {
            const metaMaskProvider = window.ethereum.providers.find(p => p.isMetaMask);
            return metaMaskProvider || window.ethereum.providers[0];
        }
        return window.ethereum;
    }
    if (typeof window.web3 !== 'undefined' && window.web3.currentProvider) {
        return window.web3.currentProvider;
    }
    return null;
}

/**
 * Update Header and Footer team details across all pages
 */
function updateHeaderAndFooterTeamInfo() {
    const studentHeaderEl = document.getElementById('student-header-info');
    if (studentHeaderEl) {
        studentHeaderEl.innerHTML = `
            <div style="display: flex; align-items: center; gap: 10px; flex-wrap: wrap;">
                <span>🎓 <strong>Shaikh Affan</strong> (242774)</span>
                <span>• <strong>Shaikh Sohail Salim</strong> (231754)</span>
                <span>• <strong>Shaikh Uzhair Mohd Ilyas</strong> (231755)</span>
                <span class="student-badge-pill">BCT Project</span>
            </div>
        `;
    }

    // Update all footers
    const footerCredits = document.querySelectorAll('.footer-credits');
    footerCredits.forEach(el => {
        el.innerHTML = `Developed by Shaikh Affan (242774), Shaikh Sohail Salim (231754), Shaikh Uzhair Mohd Ilyas (231755)`;
    });
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
 * Checks for window.ethereum (MetaMask) availability and initializes Ethers.js
 */
async function checkMetaMaskConnection() {
    const walletBtn = document.getElementById('connect-wallet-btn');
    const ethProvider = getEthereumProvider();

    if (ethProvider) {
        try {
            // Ethers.js v5 / v6 BrowserProvider initialization
            if (window.ethers) {
                if (window.ethers.BrowserProvider) {
                    provider = new window.ethers.BrowserProvider(ethProvider);
                } else if (window.ethers.providers && window.ethers.providers.Web3Provider) {
                    provider = new window.ethers.providers.Web3Provider(ethProvider);
                }
            }

            // Request currently connected accounts without prompting popup unless requested
            const accounts = await ethProvider.request({ method: 'eth_accounts' });
            currentChainId = await ethProvider.request({ method: 'eth_chainId' });

            if (accounts && accounts.length > 0) {
                currentAccount = accounts[0];
                await setupContractSigner();
                onWalletConnected(currentAccount);
            } else {
                onWalletDisconnected(ethProvider);
            }
        } catch (err) {
            console.warn("MetaMask connection check error:", err);
            onWalletDisconnected(ethProvider);
        }

        // Listen for MetaMask account changes
        ethProvider.on('accountsChanged', (accounts) => {
            if (!accounts || accounts.length === 0) {
                onWalletDisconnected(ethProvider);
                showToast("Wallet disconnected", "info");
            } else {
                currentAccount = accounts[0];
                setupContractSigner().then(() => {
                    onWalletConnected(currentAccount);
                    showToast(`Account changed to: ${shortenAddress(currentAccount)}`, "info");
                });
            }
        });

        // Listen for MetaMask chain/network changes
        ethProvider.on('chainChanged', (newChainId) => {
            currentChainId = newChainId;
            showToast("Ethereum network changed. Reloading...", "warning");
            setTimeout(() => window.location.reload(), 800);
        });
    } else {
        onMetaMaskNotInstalled(walletBtn);
    }
}

/**
 * Initialize Contract Instance with Ethers Signer
 */
async function setupContractSigner() {
    if (!provider || !currentAccount) return;
    try {
        if (provider.getSigner) {
            signer = await provider.getSigner();
        }
        if (CONFIG.CONTRACT_ADDRESS && CONFIG.CONTRACT_ABI && CONFIG.CONTRACT_ABI.length > 0 && signer) {
            contract = new ethers.Contract(CONFIG.CONTRACT_ADDRESS, CONFIG.CONTRACT_ABI, signer);
        }
    } catch (e) {
        console.warn("Could not create signed contract instance:", e);
    }
}

/**
 * Prompt user to connect MetaMask wallet
 */
async function connectWallet() {
    let ethProvider = getEthereumProvider();

    // Quick retry if ethProvider wasn't ready earlier
    if (!ethProvider) {
        await new Promise(r => setTimeout(r, 200));
        ethProvider = getEthereumProvider();
    }

    if (!ethProvider) {
        showToast("MetaMask is not detected in browser. Please make sure the extension is enabled and reload.", "error");
        alert("MetaMask is not detected in your browser window.\n\nTips:\n1. Ensure the MetaMask extension is enabled in your browser extensions.\n2. Allow MetaMask access on localhost:3000.\n3. Reload the webpage (F5).");
        return;
    }

    try {
        showToast("Requesting MetaMask wallet connection...", "info");
        const accounts = await ethProvider.request({
            method: "eth_requestAccounts"
        });

        if (accounts && accounts.length > 0) {
            currentAccount = accounts[0];
            currentChainId = await ethProvider.request({ method: 'eth_chainId' });

            if (window.ethers) {
                if (window.ethers.BrowserProvider) {
                    provider = new window.ethers.BrowserProvider(ethProvider);
                } else if (window.ethers.providers && window.ethers.providers.Web3Provider) {
                    provider = new window.ethers.providers.Web3Provider(ethProvider);
                }
            }

            await setupContractSigner();
            onWalletConnected(currentAccount);
            showToast("🟢 MetaMask Connected successfully!", "success");
        }
    } catch (err) {
        console.error("MetaMask connect error:", err);
        if (err.code === 4001) {
            showToast("Connection request rejected by user in MetaMask.", "warning");
        } else {
            showToast("Failed to connect MetaMask: " + (err.message || err), "error");
        }
    }
}

function onWalletConnected(account) {
    const walletBtn = document.getElementById('connect-wallet-btn');
    if (walletBtn) {
        const shortAddr = shortenAddress(account);
        walletBtn.innerHTML = `🟢 ${shortAddr}`;
        walletBtn.classList.add('connected');
        walletBtn.title = `Connected: ${account}. Click to switch/disconnect.`;
    }
    updateNetworkStatusUI();
}

function onWalletDisconnected(ethProvider) {
    currentAccount = null;
    signer = null;
    contract = null;
    const walletBtn = document.getElementById('connect-wallet-btn');
    if (walletBtn) {
        if (ethProvider) {
            walletBtn.innerHTML = `🦊 Connect MetaMask`;
            walletBtn.classList.remove('connected');
            walletBtn.onclick = () => connectWallet();
        } else {
            onMetaMaskNotInstalled(walletBtn);
        }
    }
    updateNetworkStatusUI();
}

function onMetaMaskNotInstalled(walletBtn) {
    if (walletBtn) {
        walletBtn.innerHTML = `🦊 Install MetaMask`;
        walletBtn.classList.remove('connected');
        walletBtn.onclick = () => window.open('https://metamask.io/download/', '_blank');
    }
    updateNetworkStatusUI();
}

/**
 * Formats address into 0x12AB...89CD
 */
function shortenAddress(addr) {
    if (!addr) return "Not Connected";
    return addr.substring(0, 6) + "..." + addr.substring(addr.length - 4);
}

/**
 * Updates status bar UI (Connected Network, Admin status, Total cert count)
 */
async function updateNetworkStatusUI() {
    const netNameEl = document.getElementById('network-name-val');
    const accountEl = document.getElementById('account-address-val');
    const certCountEl = document.getElementById('total-certs-val');
    const netIndicator = document.getElementById('network-indicator');
    const walletCardStatus = document.getElementById('wallet-card-status');

    const certsMap = getStoredCertificates();
    const certCount = Object.keys(certsMap).length;

    if (certCountEl) certCountEl.innerText = certCount;

    const ethProvider = getEthereumProvider();

    if (!ethProvider) {
        if (netNameEl) netNameEl.innerHTML = `<span style="color:var(--danger);">🔴 MetaMask Not Installed / Reload Page</span>`;
        if (accountEl) accountEl.innerText = "No Web3 Wallet";
        if (netIndicator) netIndicator.className = 'status-indicator';
        if (walletCardStatus) walletCardStatus.innerHTML = `<span style="color:var(--danger);">🔴 MetaMask Not Installed</span>`;
        return;
    }

    if (currentAccount) {
        if (accountEl) accountEl.innerText = shortenAddress(currentAccount);
        if (walletCardStatus) walletCardStatus.innerHTML = `<span style="color:var(--success);">🟢 MetaMask Connected</span> (${shortenAddress(currentAccount)})`;

        // Check Network Match
        let networkNameStr = "Ethereum Network";
        let isWrongNetwork = false;

        if (currentChainId) {
            if (currentChainId === '0xaa36a7' || currentChainId === 11155111) {
                networkNameStr = "Sepolia Testnet";
            } else if (currentChainId === '0x1') {
                networkNameStr = "Ethereum Mainnet";
            } else if (currentChainId === '0x7a69' || currentChainId === 31337 || currentChainId === 1337) {
                networkNameStr = "Hardhat / Localhost";
            } else {
                networkNameStr = `Chain ID (${parseInt(currentChainId, 16) || currentChainId})`;
            }

            if (CONFIG.REQUIRED_CHAIN_ID && currentChainId !== CONFIG.REQUIRED_CHAIN_ID) {
                isWrongNetwork = true;
            }
        }

        if (isWrongNetwork) {
            if (netNameEl) netNameEl.innerHTML = `<span style="color: var(--warning);">⚠️ Wrong Network (${networkNameStr})</span>`;
            if (netIndicator) netIndicator.className = 'status-indicator warning';
        } else {
            if (netNameEl) netNameEl.innerText = networkNameStr;
            if (netIndicator) netIndicator.className = 'status-indicator online';
        }
    } else {
        if (accountEl) accountEl.innerText = "Not Connected";
        if (netNameEl) netNameEl.innerText = "MetaMask Detected (Ready to Connect)";
        if (netIndicator) netIndicator.className = 'status-indicator online';
        if (walletCardStatus) walletCardStatus.innerHTML = `<span style="color:var(--text-dim);">🔴 Not Connected</span>`;
        
        // Ensure wallet button shows "Connect MetaMask"
        const walletBtn = document.getElementById('connect-wallet-btn');
        if (walletBtn) {
            walletBtn.innerHTML = `🦊 Connect MetaMask`;
            walletBtn.classList.remove('connected');
        }
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
    if (walletBtn) {
        walletBtn.addEventListener('click', () => {
            if (currentAccount) {
                if (confirm(`Currently connected as ${currentAccount}.\nDo you want to request account change in MetaMask?`)) {
                    connectWallet();
                }
            } else {
                connectWallet();
            }
        });
    }
}
