/**
 * Document Prompt Auditor — Premium Local Desktop Application Scripts
 */

document.addEventListener("DOMContentLoaded", () => {
    
    // UI Navigation & View Elements
    const uploadView = document.getElementById("uploadView");
    const loadingView = document.getElementById("loadingView");
    const resultView = document.getElementById("resultView");
    const backToUploadBtn = document.getElementById("backToUploadBtn");
    
    // Upload Interaction Elements
    const dropzone = document.getElementById("dropzone");
    const fileInput = document.getElementById("fileInput");
    const browseBtn = document.getElementById("browseBtn");
    
    // Result Dashboard Elements
    const resultDocName = document.getElementById("resultDocName");
    const gaugeCircle = document.getElementById("gaugeCircle");
    const gaugeValue = document.getElementById("gaugeValue");
    const gaugeStatusText = document.getElementById("gaugeStatusText");
    
    const countCritical = document.getElementById("countCritical");
    const countHigh = document.getElementById("countHigh");
    const countMedium = document.getElementById("countMedium");
    const countLow = document.getElementById("countLow");
    
    const metaPages = document.getElementById("metaPages");
    const metaAuthor = document.getElementById("metaAuthor");
    const metaCreator = document.getElementById("metaCreator");
    const metaProducer = document.getElementById("metaProducer");
    
    // Tabs & Panels
    const tabThreatsBtn = document.getElementById("tabThreatsBtn");
    const tabTextBtn = document.getElementById("tabTextBtn");
    const panelThreats = document.getElementById("panelThreats");
    const panelText = document.getElementById("panelText");
    
    // Details Rendering
    const warningsCountText = document.getElementById("warningsCountText");
    const accordionContainer = document.getElementById("accordionContainer");
    const cleanDocPlaceholder = document.getElementById("cleanDocPlaceholder");
    
    const charCount = document.getElementById("charCount");
    const textPreBox = document.getElementById("textPreBox");
    const copyTextBtn = document.getElementById("copyTextBtn");
    const downloadTextBtn = document.getElementById("downloadTextBtn");
    
    // Loading Progress Bar
    const progressFill = document.getElementById("progressFill");
    const loadingStatusText = document.getElementById("loadingStatusText");
    
    // Toast Container
    const toastContainer = document.getElementById("toastContainer");
    
    // Local State
    let scannedText = "";
    let scannedFilename = "";
    
    /* ── View Control Helpers ────────────────────────────────────────────── */
    function showView(view) {
        uploadView.classList.remove("active");
        loadingView.classList.remove("active");
        resultView.classList.remove("active");
        
        view.classList.add("active");
    }
    
    function resetApplication() {
        scannedText = "";
        scannedFilename = "";
        fileInput.value = "";
        document.body.className = "theme-safe";
        showView(uploadView);
    }
    
    /* ── Toast Toast Toast ────────────────────────────────────────────────── */
    function showToast(message, type = "info") {
        const toast = document.createElement("div");
        toast.className = `toast toast-${type}`;
        
        let iconSvg = "";
        if (type === "error") {
            iconSvg = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>`;
        } else if (type === "success") {
            iconSvg = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>`;
        } else {
            iconSvg = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>`;
        }
        
        toast.innerHTML = `
            ${iconSvg}
            <span class="toast-message">${message}</span>
        `;
        
        toastContainer.appendChild(toast);
        
        setTimeout(() => {
            toast.style.animation = "toastIn 0.3s cubic-bezier(0.16, 1, 0.3, 1) reverse forwards";
            setTimeout(() => toast.remove(), 300);
        }, 4000);
    }
    
    /* ── Drag & Drop Handlers ────────────────────────────────────────────── */
    browseBtn.addEventListener("click", () => fileInput.click());
    
    fileInput.addEventListener("change", (e) => {
        if (e.target.files.length > 0) {
            handleFileUpload(e.target.files[0]);
        }
    });
    
    dropzone.addEventListener("dragenter", (e) => {
        e.preventDefault();
        dropzone.classList.add("dragover");
    });
    
    dropzone.addEventListener("dragover", (e) => {
        e.preventDefault();
        dropzone.classList.add("dragover");
    });
    
    dropzone.addEventListener("dragleave", () => {
        dropzone.classList.remove("dragover");
    });
    
    dropzone.addEventListener("drop", (e) => {
        e.preventDefault();
        dropzone.classList.remove("dragover");
        if (e.dataTransfer.files.length > 0) {
            handleFileUpload(e.dataTransfer.files[0]);
        }
    });
    
    /* ── Upload & Scan Handler ───────────────────────────────────────────── */
    async function handleFileUpload(file) {
        if (!file.name.toLowerCase().endsWith(".pdf")) {
            showToast("Only PDF documents are supported by the Auditor.", "error");
            return;
        }
        
        showView(loadingView);
        progressFill.style.width = "0%";
        loadingStatusText.textContent = "Analyzing document coordinates and extracting layout...";
        
        // Setup a beautiful simulated scan progress loader while backend runs
        let progressVal = 0;
        const progressInterval = setInterval(() => {
            if (progressVal < 85) {
                progressVal += Math.floor(Math.random() * 8) + 2;
                progressFill.style.width = `${progressVal}%`;
                
                if (progressVal > 60) {
                    loadingStatusText.textContent = "Running parallel security auditors (Unicode & Base64 verification)...";
                } else if (progressVal > 30) {
                    loadingStatusText.textContent = "Reconstructing page-by-page paragraph flows...";
                }
            }
        }, 300);
        
        const formData = new FormData();
        formData.append("file", file);
        
        try {
            const response = await fetch("/api/scan", {
                method: "POST",
                body: formData
            });
            
            clearInterval(progressInterval);
            
            if (!response.ok) {
                const errData = await response.json();
                throw new Error(errData.error || "Auditor encountered a processing error.");
            }
            
            progressFill.style.width = "100%";
            loadingStatusText.textContent = "Security report compiled!";
            
            const result = await response.json();
            
            setTimeout(() => {
                renderScanResults(result);
                showView(resultView);
            }, 500);
            
        } catch (error) {
            clearInterval(progressInterval);
            showToast(error.message, "error");
            resetApplication();
        }
    }
    
    /* ── Render Scan Results ─────────────────────────────────────────────── */
    function renderScanResults(data) {
        scannedText = data.reconstructed_text;
        scannedFilename = data.filename;
        
        // 1. Title/Header Info
        resultDocName.textContent = data.filename;
        
        // 2. Safety Score radial gauge
        const score = data.safety_score;
        gaugeValue.textContent = `${score}%`;
        
        // Circle stroke math (2 * PI * r) -> r=42 -> Circumference = 263.89
        const circumference = 263.89;
        const strokeOffset = circumference * (1 - score / 100);
        gaugeCircle.style.strokeDashoffset = strokeOffset;
        
        // Determine status themes
        let status = "SECURE";
        let bodyTheme = "theme-safe";
        
        if (score < 50) {
            status = "DANGEROUS";
            bodyTheme = "theme-danger";
            showToast("Risk alert: Document contains dangerous prompt injections!", "error");
        } else if (score < 100) {
            status = "RISK DETECTED";
            bodyTheme = "theme-warning";
            showToast("Warnings found: Review hidden visual or text vectors.", "info");
        } else {
            showToast("Document is 100% clean and secure!", "success");
        }
        
        document.body.className = bodyTheme;
        gaugeStatusText.textContent = status;
        
        // 3. Counts
        countCritical.textContent = data.severity_counts.CRITICAL;
        countHigh.textContent = data.severity_counts.HIGH;
        countMedium.textContent = data.severity_counts.MEDIUM;
        countLow.textContent = data.severity_counts.LOW;
        
        // 4. Metadata
        metaPages.textContent = data.total_pages;
        metaAuthor.textContent = data.metadata.Author || "-";
        metaCreator.textContent = data.metadata.Creator || "-";
        metaProducer.textContent = data.metadata.Producer || "-";
        
        // 5. Expandable threat log cards
        warningsCountText.textContent = data.warnings.length;
        accordionContainer.innerHTML = "";
        
        if (data.warnings.length === 0) {
            cleanDocPlaceholder.classList.remove("hidden");
            accordionContainer.classList.add("hidden");
        } else {
            cleanDocPlaceholder.classList.add("hidden");
            accordionContainer.classList.remove("hidden");
            
            // Sort warnings by severity (CRITICAL, HIGH, MEDIUM, LOW)
            const priority = { "CRITICAL": 0, "HIGH": 1, "MEDIUM": 2, "LOW": 3 };
            const sortedWarnings = [...data.warnings].sort((a, b) => priority[a.severity] - priority[b.severity]);
            
            sortedWarnings.forEach((w, idx) => {
                const item = document.createElement("div");
                item.className = `accordion-item ${w.severity.toLowerCase()}`;
                
                // Construct premium highlighting inside the threat context box
                let highlightedContext = escapeHtml(w.context);
                
                // Map the placeholders back to highlighted HTML tokens
                highlightedContext = highlightedContext.replace(/\[ZWSP\]/g, `<span class="token-zwsp">[ZWSP]</span>`);
                highlightedContext = highlightedContext.replace(/\[ZWNJ\]/g, `<span class="token-zwnj">[ZWNJ]</span>`);
                highlightedContext = highlightedContext.replace(/\[ZWJ\]/g, `<span class="token-zwj">[ZWJ]</span>`);
                highlightedContext = highlightedContext.replace(/\[BOM\]/g, `<span class="token-bom">[BOM]</span>`);
                
                item.innerHTML = `
                    <div class="accordion-header">
                        <div class="accordion-header-left">
                            <span class="warning-badge">${w.severity}</span>
                            <span class="warning-title-text">${w.rule}</span>
                        </div>
                        <span class="warning-page-tag">Page ${w.page}</span>
                        <svg class="accordion-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                            <polyline points="6 9 12 15 18 9"/>
                        </svg>
                    </div>
                    <div class="accordion-body">
                        <div class="accordion-content-inner">
                            <p class="threat-message">${w.message}</p>
                            <div class="threat-context-wrapper">
                                <span class="threat-context-label">Detected Context snippet</span>
                                <div class="threat-context-box">${highlightedContext}</div>
                            </div>
                        </div>
                    </div>
                `;
                
                // Add accordion expand click listener
                const header = item.querySelector(".accordion-header");
                header.addEventListener("click", () => {
                    const isOpen = item.classList.contains("open");
                    
                    // Close other items
                    document.querySelectorAll(".accordion-item").forEach(other => other.classList.remove("open"));
                    
                    if (!isOpen) {
                        item.classList.add("open");
                    }
                });
                
                accordionContainer.appendChild(item);
            });
        }
        
        // 6. Plain text preview tab
        charCount.textContent = scannedText.length;
        textPreBox.textContent = scannedText;
        
        // Default View: Activate threats tab
        switchTab(tabThreatsBtn, panelThreats);
    }
    
    /* ── Tab Switcher Logic ──────────────────────────────────────────────── */
    function switchTab(activeBtn, activePanel) {
        tabThreatsBtn.classList.remove("active");
        tabTextBtn.classList.remove("active");
        panelThreats.classList.remove("active");
        panelText.classList.remove("active");
        
        activeBtn.classList.add("active");
        activePanel.classList.add("active");
    }
    
    tabThreatsBtn.addEventListener("click", () => switchTab(tabThreatsBtn, panelThreats));
    tabTextBtn.addEventListener("click", () => switchTab(tabTextBtn, panelText));
    
    /* ── Text Utilities ──────────────────────────────────────────────────── */
    copyTextBtn.addEventListener("click", () => {
        if (!scannedText) return;
        
        navigator.clipboard.writeText(scannedText).then(() => {
            showToast("Extracted plain text copied to clipboard!", "success");
        }).catch(() => {
            showToast("Failed to copy text automatically.", "error");
        });
    });
    
    downloadTextBtn.addEventListener("click", () => {
        if (!scannedText) return;
        
        const blob = new Blob([scannedText], { type: "text/plain;charset=utf-8" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        
        // Format download name from original file
        const baseName = scannedFilename.replace(/\.pdf$/i, "");
        a.download = `${baseName}_extracted.txt`;
        
        document.body.appendChild(a);
        a.click();
        
        setTimeout(() => {
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        }, 100);
        
        showToast("Text file download started.", "success");
    });
    
    backToUploadBtn.addEventListener("click", resetApplication);
    
    // HTML Escape Helper
    function escapeHtml(text) {
        return text
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }
});
