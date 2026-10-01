/**
 * Admin Dashboard Script - REAL Ethereum Smart Contract Issuance with Fallback
 * Project: Decentralized Certificate Verification DApp Using Ethereum
 * Team Members: Shaikh Affan (242774), Shaikh Sohail Salim (231754), Shaikh Uzhair Mohd Ilyas (231755)
 */

document.addEventListener('DOMContentLoaded', () => {
    initAdminPage();
});

function initAdminPage() {
    const issueForm = document.getElementById('issue-cert-form');
    const autoGenBtn = document.getElementById('btn-autogen-id');
    const docFileSelect = document.getElementById('doc-file-input');
    const hashDropzone = document.getElementById('hash-dropzone');
    const issueDateInput = document.getElementById('issueDate');

    // Default issue date to today's date (YYYY-MM-DD)
    if (issueDateInput && !issueDateInput.value) {
        issueDateInput.value = new Date().toISOString().split('T')[0];
    }

    // Auto-generate Certificate ID button
    if (autoGenBtn) {
        autoGenBtn.addEventListener('click', () => {
            const randomNum = Math.floor(1000 + Math.random() * 9000);
            const generatedId = `CERT-2026-${randomNum}`;
            document.getElementById('certificateId').value = generatedId;
            showToast(`Generated Certificate ID: ${generatedId}`, 'info');
        });
    }

    // SHA-256 File Hash computation
    if (docFileSelect && hashDropzone) {
        hashDropzone.addEventListener('click', () => docFileSelect.click());

        hashDropzone.addEventListener('dragover', (e) => {
            e.preventDefault();
            hashDropzone.style.borderColor = 'var(--accent-cyan)';
        });

        hashDropzone.addEventListener('dragleave', () => {
            hashDropzone.style.borderColor = 'rgba(255, 255, 255, 0.15)';
        });

        hashDropzone.addEventListener('drop', (e) => {
            e.preventDefault();
            hashDropzone.style.borderColor = 'rgba(255, 255, 255, 0.15)';
            if (e.dataTransfer.files.length > 0) {
                docFileSelect.files = e.dataTransfer.files;
                processFileHash(e.dataTransfer.files[0]);
            }
        });

        docFileSelect.addEventListener('change', (e) => {
            if (e.target.files.length > 0) {
                processFileHash(e.target.files[0]);
            }
        });
    }

    // Handle Form Submit
    if (issueForm) {
        issueForm.addEventListener('submit', handleIssueCertificateSubmit);
    }

    renderIssuedCertificatesTable();
}

/**
 * Compute SHA-256 Hash of an uploaded document using SubtleCrypto
 */
async function processFileHash(file) {
    const docHashInput = document.getElementById('documentHash');
    const dropzoneText = document.getElementById('dropzone-filename');

    try {
        if (dropzoneText) dropzoneText.innerText = `📄 Hashing Document: ${file.name}...`;

        const arrayBuffer = await file.arrayBuffer();
        const hashBuffer = await crypto.subtle.digest('SHA-256', arrayBuffer);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

        if (docHashInput) docHashInput.value = hashHex;
        if (dropzoneText) dropzoneText.innerText = `✅ SHA-256 Hash Computed for ${file.name}`;
        showToast("Document SHA-256 digital fingerprint calculated!", "success");
    } catch (err) {
        console.error("File hash error:", err);
        showToast("Failed to calculate document hash.", "error");
    }
}

/**
 * Handles Certificate Issuance via Smart Contract (or Local Demo Mode)
 */
async function handleIssueCertificateSubmit(e) {
    e.preventDefault();

    const certId = document.getElementById('certificateId').value.trim();
    const studentName = document.getElementById('studentName').value.trim();
    const studentId = document.getElementById('studentId').value.trim();
    const course = document.getElementById('course').value.trim();
    const issueDate = document.getElementById('issueDate').value.trim();
    let documentHash = document.getElementById('documentHash').value.trim();

    // Field Validation
    if (!certId || !studentName || !studentId || !course || !issueDate) {
        showToast("Please fill in all required certificate fields.", "error");
        return;
    }

    // Generate SHA-256 hash from metadata if document hash is missing
    if (!documentHash) {
        const rawString = `${certId}-${studentName}-${studentId}-${Date.now()}`;
        const encoder = new TextEncoder();
        const data = encoder.encode(rawString);
        const hashBuf = await crypto.subtle.digest('SHA-256', data);
        documentHash = Array.from(new Uint8Array(hashBuf)).map(b => b.toString(16).padStart(2, '0')).join('');
        document.getElementById('documentHash').value = documentHash;
    }

    const txStatusContainer = document.getElementById('tx-status-container');
    const submitBtn = document.getElementById('btn-submit-cert');

    try {
        if (submitBtn) {
            submitBtn.disabled = true;
            submitBtn.innerHTML = `⌛ Submitting Certificate...`;
        }

        let txHash = "";
        let blockNumber = null;
        let issuerAddress = currentAccount || "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266";
        let isRealBlockchainTx = false;

        // Try calling real smart contract if wallet is connected & contract initialized
        if (contract && signer) {
            if (txStatusContainer) {
                txStatusContainer.style.display = 'block';
                txStatusContainer.innerHTML = `
                    <div class="card" style="border-color: var(--accent-cyan);">
                        <h4 style="color: var(--accent-cyan);">🦊 Waiting for MetaMask confirmation...</h4>
                        <p style="font-size: 0.9rem; color: var(--text-muted); margin-top: 8px;">
                            Please approve the transaction in your MetaMask popup for <strong>${studentName}</strong> (${certId}).
                        </p>
                    </div>
                `;
            }

            try {
                const tx = await contract.issueCertificate(
                    certId,
                    studentName,
                    studentId,
                    course,
                    issueDate,
                    documentHash
                );

                isRealBlockchainTx = true;
                txHash = tx.hash;

                if (txStatusContainer) {
                    txStatusContainer.innerHTML = `
                        <div class="card" style="border-color: var(--accent-indigo);">
                            <h4 style="color: var(--accent-cyan);">🚀 Transaction submitted...</h4>
                            <p style="font-size: 0.9rem; margin-top: 8px;">
                                <strong>Tx Hash:</strong> <span class="hash-text">${txHash}</span>
                            </p>
                            <p style="font-size: 0.88rem; color: var(--text-muted); margin-top: 6px;">
                                ⏳ <strong>Confirming transaction on Ethereum blockchain...</strong> Please wait...
                            </p>
                        </div>
                    `;
                }

                const receipt = await tx.wait();
                blockNumber = receipt.blockNumber || null;
                issuerAddress = receipt.from || currentAccount;

            } catch (blockchainErr) {
                console.warn("Smart contract call failed or contract not deployed at address:", blockchainErr);

                if (blockchainErr.code === 4001 || (blockchainErr.message && blockchainErr.message.includes("rejected"))) {
                    showToast("Transaction rejected by user in MetaMask.", "warning");
                    if (txStatusContainer) {
                        txStatusContainer.innerHTML = `
                            <div class="card" style="border-color: var(--warning); background: var(--warning-bg);">
                                <h4 style="color: var(--warning);">⚠️ Transaction Canceled</h4>
                                <p style="font-size: 0.9rem; margin-top: 8px;">
                                    You canceled the transaction in your MetaMask wallet. No certificate was issued.
                                </p>
                            </div>
                        `;
                    }
                    return;
                }

                // Smooth Fallback to Local Session Demo Issuance when contract is not deployed
                txHash = "0x" + Array.from(crypto.getRandomValues(new Uint8Array(32))).map(b => b.toString(16).padStart(2, '0')).join('');
                showToast("Contract not found on this network. Switched to Local Demo Issuance Mode.", "info");
            }
        } else {
            // Local Demo Mode
            await new Promise(res => setTimeout(res, 600));
            txHash = "0x" + Array.from(crypto.getRandomValues(new Uint8Array(32))).map(b => b.toString(16).padStart(2, '0')).join('');
        }

        // Save Certificate Record
        const newCert = {
            certificateId: certId,
            studentName: studentName,
            studentId: studentId,
            course: course,
            issueDate: issueDate,
            documentHash: documentHash,
            issuedBy: issuerAddress,
            exists: true,
            timestamp: Math.floor(Date.now() / 1000),
            txHash: txHash,
            blockNumber: blockNumber,
            isBlockchainTx: isRealBlockchainTx
        };

        saveCertificateToStorage(newCert);

        if (txStatusContainer) {
            txStatusContainer.style.display = 'block';
            txStatusContainer.innerHTML = `
                <div class="card" style="border-color: var(--success); background: rgba(16, 185, 129, 0.08);">
                    <h4 style="color: var(--success);">🎉 Certificate Issued & Registered Successfully!</h4>
                    <div style="margin-top: 12px; font-size: 0.9rem; line-height: 1.8;">
                        <p><strong>Certificate ID:</strong> <span style="font-family: var(--font-code); color: var(--accent-cyan);">${certId}</span></p>
                        <p><strong>Student Name:</strong> ${studentName} (ID: ${studentId})</p>
                        <p><strong>Issuing Wallet:</strong> <span class="hash-text">${issuerAddress}</span></p>
                        <p><strong>Transaction Hash:</strong> <span class="hash-text">${txHash}</span></p>
                        <p><strong>Registry Mode:</strong> ${isRealBlockchainTx ? '🟢 Live Ethereum Smart Contract' : '🟡 Local Demonstration Registry'}</p>
                    </div>
                    <div style="margin-top: 16px; display: flex; gap: 10px; flex-wrap: wrap;">
                        <a href="verify.html?id=${encodeURIComponent(certId)}" class="btn-primary" style="padding: 8px 16px; font-size: 0.85rem;">🔍 Verify Certificate Now</a>
                        <button onclick="document.getElementById('issue-cert-form').reset(); document.getElementById('tx-status-container').style.display='none';" class="btn-secondary" style="padding: 8px 16px; font-size: 0.85rem;">Issue Another Certificate</button>
                    </div>
                </div>
            `;
        }

        showToast("Certificate successfully issued!", "success");
        renderIssuedCertificatesTable();
        updateNetworkStatusUI();

    } catch (err) {
        console.error("Issuance error:", err);
        showToast("An error occurred during certificate issuance.", "error");
    } finally {
        if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.innerHTML = `🎓 Issue Certificate to Blockchain`;
        }
    }
}

/**
 * Render issued certificates history table in admin panel
 */
function renderIssuedCertificatesTable() {
    const tableBody = document.getElementById('issued-certs-tbody');
    if (!tableBody) return;

    const certsMap = getStoredCertificates();
    const certList = Object.values(certsMap);

    if (certList.length === 0) {
        tableBody.innerHTML = `<tr><td colspan="6" style="text-align:center; color: var(--text-dim);">No certificates issued yet.</td></tr>`;
        return;
    }

    tableBody.innerHTML = certList.map(cert => `
        <tr>
            <td><strong style="color: var(--accent-cyan); font-family: var(--font-code);">${cert.certificateId}</strong></td>
            <td><strong>${cert.studentName}</strong> <br><small style="color:var(--text-dim);">ID: ${cert.studentId}</small></td>
            <td>${cert.course}</td>
            <td>${cert.issueDate}</td>
            <td><span class="hash-text" title="${cert.documentHash}">${cert.documentHash.substring(0, 10)}...${cert.documentHash.substring(cert.documentHash.length - 6)}</span></td>
            <td>
                <a href="verify.html?id=${encodeURIComponent(cert.certificateId)}" class="btn-outline" style="text-decoration:none; padding:4px 10px;">Verify</a>
            </td>
        </tr>
    `).join('');
}
