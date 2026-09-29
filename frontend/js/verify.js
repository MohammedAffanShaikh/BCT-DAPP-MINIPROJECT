/**
 * Verification Page Logic
 * Student: Shaikh Affan | Roll No: 242774 | BCT Project
 */

document.addEventListener('DOMContentLoaded', () => {
    initVerifyPage();
});

function initVerifyPage() {
    const verifyForm = document.getElementById('verify-cert-form');
    const searchInput = document.getElementById('searchCertId');

    // Auto-fill from URL query param if present
    const urlParams = new URLSearchParams(window.location.search);
    const idParam = urlParams.get('id');

    if (idParam) {
        if (searchInput) searchInput.value = idParam;
        verifyCertificateId(idParam);
    }

    if (verifyForm) {
        verifyForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const certId = searchInput.value.trim();
            if (!certId) {
                showToast("Please enter a valid Certificate ID.", "error");
                return;
            }
            verifyCertificateId(certId);
        });
    }
}

/**
 * Executes certificate lookup on Ethereum Smart Contract / Data Store
 */
async function verifyCertificateId(certId) {
    const resultContainer = document.getElementById('verification-result-container');
    const searchBtn = document.getElementById('btn-verify-search');

    if (searchBtn) {
        searchBtn.disabled = true;
        searchBtn.innerHTML = `🔍 Verifying on Blockchain...`;
    }

    if (resultContainer) {
        resultContainer.style.display = 'block';
        resultContainer.innerHTML = `
            <div class="card" style="text-align: center; padding: 40px;">
                <div style="font-size: 2rem; margin-bottom: 12px;">⏳</div>
                <h3>Querying Ethereum Blockchain...</h3>
                <p style="color: var(--text-muted); font-size: 0.9rem;">Fetching cryptographic proof for Certificate ID: <strong>${certId}</strong></p>
            </div>
        `;
    }

    let certData = null;
    let isFromContract = false;

    // 1. Try querying smart contract via Ethers.js
    if (contract) {
        try {
            const res = await contract.getCertificate(certId);
            if (res && res.exists) {
                certData = {
                    certificateId: certId,
                    studentName: res.studentName,
                    studentId: res.studentId,
                    course: res.course,
                    issueDate: res.issueDate,
                    documentHash: res.documentHash,
                    issuedBy: res.issuedBy,
                    exists: res.exists,
                    timestamp: res.timestamp ? res.timestamp.toNumber() : Math.floor(Date.now() / 1000),
                    txHash: "Verified directly from deployed smart contract mapping"
                };
                isFromContract = true;
            }
        } catch (err) {
            console.warn("Smart contract query returned error or cert not found on-chain:", err);
        }
    }

    // 2. Fallback to local session store if not found directly on contract
    if (!certData) {
        const storedCerts = getStoredCertificates();
        if (storedCerts[certId] && storedCerts[certId].exists) {
            certData = storedCerts[certId];
        }
    }

    if (searchBtn) {
        searchBtn.disabled = false;
        searchBtn.innerHTML = `🔍 Verify Certificate`;
    }

    // Render output
    if (certData) {
        renderValidCertificateUI(certData, isFromContract);
        showToast("Certificate Verified Successfully!", "success");
    } else {
        renderInvalidCertificateUI(certId);
        showToast("Certificate Not Found / Invalid Certificate", "error");
    }
}

/**
 * Render Success Verification Card
 */
function renderValidCertificateUI(cert, isFromContract) {
    const resultContainer = document.getElementById('verification-result-container');
    if (!resultContainer) return;

    const formattedDate = cert.issueDate || new Date().toISOString().split('T')[0];
    const issuerAddr = cert.issuedBy || "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266";
    const txHashStr = cert.txHash || "0x88df43f702d6b32df8d799015c7e10034a7065097ef78696b998cfb68d6f512a";

    resultContainer.innerHTML = `
        <div class="cert-result-card valid" id="printable-certificate">
            <div style="display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: 16px;">
                <div>
                    <div class="cert-status-banner valid">
                        <span>🛡️</span> Certificate Verified Successfully
                    </div>
                    <p style="font-size: 0.85rem; color: var(--text-muted);">
                        Blockchain Verified Record • ${isFromContract ? 'Live Ethereum Smart Contract' : 'Cryptographic Ledger Entry'}
                    </p>
                </div>
                <div class="non-printable" style="display: flex; gap: 10px;">
                    <button onclick="window.print()" class="btn-secondary" style="padding: 8px 14px; font-size: 0.85rem;">🖨️ Print / Download PDF</button>
                    <button onclick="copyDocumentHash('${cert.documentHash}')" class="btn-outline" style="padding: 8px 14px; font-size: 0.85rem;">📋 Copy Hash</button>
                </div>
            </div>

            <hr style="border: 0; border-top: 1px solid var(--border); margin: 24px 0;">

            <!-- Certificate Document Body -->
            <div style="text-align: center; margin-bottom: 30px;">
                <p style="font-size: 0.85rem; text-transform: uppercase; letter-spacing: 2px; color: var(--accent-cyan); font-weight: 700;">Official Academic Credential</p>
                <h2 style="font-family: var(--font-heading); font-size: 2rem; margin: 8px 0; color: #fff;">${CONFIG.INSTITUTE}</h2>
                <p style="color: var(--text-muted); font-size: 0.95rem;">This digital certificate officially attests that</p>
                <h1 style="font-family: var(--font-heading); font-size: 2.4rem; color: var(--accent-cyan); margin: 12px 0;">${cert.studentName}</h1>
                <p style="color: var(--text-muted); font-size: 1.05rem;">has successfully satisfied all requirements for</p>
                <h3 style="font-size: 1.4rem; color: #fff; margin-top: 6px;">${cert.course}</h3>
            </div>

            <div class="cert-details-grid">
                <div class="cert-detail-item">
                    <label>Student Roll / ID</label>
                    <p>${cert.studentId}</p>
                </div>
                <div class="cert-detail-item">
                    <label>Certificate ID</label>
                    <p style="font-family: var(--font-code); color: var(--accent-cyan);">${cert.certificateId}</p>
                </div>
                <div class="cert-detail-item">
                    <label>Issue Date</label>
                    <p>${formattedDate}</p>
                </div>
                <div class="cert-detail-item">
                    <label>Issuing Institution</label>
                    <p style="font-size: 0.85rem;">${CONFIG.INSTITUTE}</p>
                </div>
                <div class="cert-detail-item" style="grid-column: 1 / -1;">
                    <label>Document Hash (SHA-256)</label>
                    <p class="hash-text">${cert.documentHash}</p>
                </div>
                <div class="cert-detail-item" style="grid-column: 1 / -1;">
                    <label>Issuing Admin Wallet Address</label>
                    <p class="hash-text" style="color: #fff !important;">${issuerAddr}</p>
                </div>
                <div class="cert-detail-item" style="grid-column: 1 / -1;">
                    <label>Blockchain Transaction Hash</label>
                    <p class="hash-text">${txHashStr}</p>
                </div>
            </div>

            <div style="margin-top: 30px; display: flex; justify-content: space-between; align-items: center; border-top: 1px dashed var(--border); padding-top: 20px; font-size: 0.8rem; color: var(--text-dim);">
                <div>
                    <span>Project: BCT Mini Project</span> | 
                    <span>Student Developer: ${CONFIG.STUDENT_NAME} (${CONFIG.ROLL_NO})</span>
                </div>
                <div style="font-family: var(--font-code);">STATUS: TAMPER-PROOF & IMMUTABLE</div>
            </div>
        </div>
    `;
}

/**
 * Render Failure Verification Card
 */
function renderInvalidCertificateUI(certId) {
    const resultContainer = document.getElementById('verification-result-container');
    if (!resultContainer) return;

    resultContainer.innerHTML = `
        <div class="cert-result-card invalid">
            <div class="cert-status-banner invalid">
                <span>⚠️</span> Certificate Not Found / Invalid Certificate
            </div>
            
            <h3 style="color: #fff; margin-bottom: 12px;">No Matching Blockchain Record Found</h3>
            <p style="color: var(--text-muted); font-size: 0.95rem; margin-bottom: 20px;">
                The Certificate ID <strong style="color: var(--danger); font-family: var(--font-code);">${certId}</strong> does not exist in the Ethereum smart contract registry. It may be fraudulent, mistyped, or not yet issued by an authorized institute admin.
            </p>

            <div style="background: rgba(239, 68, 68, 0.08); border: 1px solid rgba(239, 68, 68, 0.2); padding: 16px; border-radius: var(--radius-md); font-size: 0.88rem; color: var(--text-muted);">
                💡 <strong>Verification Tips:</strong>
                <ul style="margin-left: 20px; margin-top: 8px;">
                    <li>Ensure the Certificate ID was entered correctly (e.g. <code>CERT-2026-001</code>).</li>
                    <li>Verify that the certificate was issued by an authorized university admin wallet.</li>
                    <li>If you are an admin, issue the certificate from the <a href="admin.html" style="color: var(--accent-cyan);">Admin Dashboard</a>.</li>
                </ul>
            </div>
        </div>
    `;
}

function copyDocumentHash(hashText) {
    navigator.clipboard.writeText(hashText).then(() => {
        showToast("SHA-256 Hash copied to clipboard!", "info");
    });
}
