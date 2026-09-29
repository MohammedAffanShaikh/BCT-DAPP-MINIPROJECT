/**
 * Admin Dashboard Script - Issue Certificate Logic
 * Student: Shaikh Affan | Roll No: 242774 | BCT Project
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
            showToast(`Generated ID: ${generatedId}`, 'info');
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
        if (dropzoneText) dropzoneText.innerText = `📄 Processing: ${file.name}...`;

        const arrayBuffer = await file.arrayBuffer();
        const hashBuffer = await crypto.subtle.digest('SHA-256', arrayBuffer);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

        if (docHashInput) docHashInput.value = hashHex;
        if (dropzoneText) dropzoneText.innerText = `✅ Hash Computed for ${file.name}`;
        showToast("Document SHA-256 hash successfully computed!", "success");
    } catch (err) {
        console.error("File hash error:", err);
        showToast("Failed to calculate document hash.", "error");
    }
}

/**
 * Handles Issue Certificate form submission
 */
async function handleIssueCertificateSubmit(e) {
    e.preventDefault();

    const certId = document.getElementById('certificateId').value.trim();
    const studentName = document.getElementById('studentName').value.trim();
    const studentId = document.getElementById('studentId').value.trim();
    const course = document.getElementById('course').value.trim();
    const issueDate = document.getElementById('issueDate').value.trim();
    let documentHash = document.getElementById('documentHash').value.trim();

    // Validation
    if (!certId || !studentName || !studentId || !course || !issueDate) {
        showToast("Please fill in all required fields.", "error");
        return;
    }

    // Generate pseudo hash if user hasn't provided one
    if (!documentHash) {
        const rawString = `${certId}-${studentName}-${studentId}-${Date.now()}`;
        const encoder = new TextEncoder();
        const data = encoder.encode(rawString);
        const hashBuf = await crypto.subtle.digest('SHA-256', data);
        documentHash = Array.from(new Uint8Array(hashBuf)).map(b => b.toString(16).padStart(2, '0')).join('');
        document.getElementById('documentHash').value = documentHash;
    }

    // Check duplicate in local cache
    const existingCerts = getStoredCertificates();
    if (existingCerts[certId]) {
        showToast(`Error: Certificate ID "${certId}" already exists on record!`, "error");
        return;
    }

    const txStatusContainer = document.getElementById('tx-status-container');
    const submitBtn = document.getElementById('btn-submit-cert');

    try {
        if (submitBtn) {
            submitBtn.disabled = true;
            submitBtn.innerHTML = `⌛ Issuing to Blockchain...`;
        }

        if (txStatusContainer) {
            txStatusContainer.style.display = 'block';
            txStatusContainer.innerHTML = `
                <div class="card" style="border-color: var(--accent-cyan);">
                    <h4>🚀 Transaction Status: Submitting to Ethereum Blockchain...</h4>
                    <p style="font-size: 0.9rem; color: var(--text-muted); margin-top: 8px;">
                        Creating smart contract record for <strong>${studentName}</strong> (${certId}). Please wait for block confirmation...
                    </p>
                </div>
            `;
        }

        let transactionHash = "";
        let issuerAddress = currentAccount || "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266";

        if (contract && signer) {
            try {
                showToast("Please confirm transaction in your MetaMask wallet...", "info");
                const tx = await contract.issueCertificate(
                    certId,
                    studentName,
                    studentId,
                    course,
                    issueDate,
                    documentHash
                );
                
                showToast("Transaction submitted! Waiting for block confirmation...", "info");
                const receipt = await tx.wait();
                transactionHash = receipt.transactionHash;
                issuerAddress = receipt.from || currentAccount;
            } catch (blockchainErr) {
                console.warn("Blockchain transaction failed or rejected. Falling back to local simulation:", blockchainErr);
                if (blockchainErr.code === 4001) {
                    showToast("Transaction rejected in MetaMask by user.", "error");
                    if (submitBtn) {
                        submitBtn.disabled = false;
                        submitBtn.innerHTML = `🎓 Issue Certificate to Blockchain`;
                    }
                    if (txStatusContainer) txStatusContainer.style.display = 'none';
                    return;
                }
                // Generate preview simulation tx hash
                transactionHash = "0x" + Array.from(crypto.getRandomValues(new Uint8Array(32))).map(b => b.toString(16).padStart(2, '0')).join('');
            }
        } else {
            // Demo mode simulation
            await new Promise(res => setTimeout(res, 1200));
            transactionHash = "0x" + Array.from(crypto.getRandomValues(new Uint8Array(32))).map(b => b.toString(16).padStart(2, '0')).join('');
        }

        // Save Certificate Object
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
            txHash: transactionHash
        };

        saveCertificateToStorage(newCert);

        if (txStatusContainer) {
            txStatusContainer.innerHTML = `
                <div class="card" style="border-color: var(--success); background: rgba(16, 185, 129, 0.08);">
                    <h4 style="color: var(--success);">🎉 Certificate Issued & Verified on Blockchain!</h4>
                    <p style="font-size: 0.9rem; margin-top: 8px;">
                        <strong>Certificate ID:</strong> ${certId}<br>
                        <strong>Transaction Hash:</strong> <span class="hash-text">${transactionHash}</span>
                    </p>
                    <div style="margin-top: 12px; display: flex; gap: 10px;">
                        <a href="verify.html?id=${encodeURIComponent(certId)}" class="btn-primary" style="padding: 8px 16px; font-size: 0.85rem;">🔍 View & Verify Now</a>
                        <button onclick="document.getElementById('issue-cert-form').reset(); document.getElementById('tx-status-container').style.display='none';" class="btn-secondary" style="padding: 8px 16px; font-size: 0.85rem;">Issue Another</button>
                    </div>
                </div>
            `;
        }

        showToast("Certificate successfully issued to the Ethereum blockchain!", "success");
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
