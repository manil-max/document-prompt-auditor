# Development Progress Tracker v3.0

## Phase 1: Environment & Test Suite Setup
- [x] 1.1 Create Git repository and Python virtual environment (`venv`).
- [x] 1.2 Install dependencies: `pip install PyMuPDF`.
- [x] 1.3 Create the Test Suite PDFs:
    - [x] Control PDF (normal text to check paragraph structure).
    - [x] Trap PDF 1 (Zero-width Unicode characters).
    - [x] Trap PDF 2 (Suspicious Base64 strings).
    - [x] Trap PDF 3 (White text on white background, 1px font).

## Phase 2: Core Engine & Safe Extraction
- [ ] 2.1 Set up `scanner.py` and `PyMuPDF` document loader.
- [ ] 2.2 Write the text extraction loop (`page.get_text("dict")`).
- [ ] 2.3 Develop the reconstruction algorithm to save the raw text cleanly into `extracted_content.txt`.

## Phase 3: The Auditor Logic (Detection, Not Deletion)
- [ ] 3.1 Create `security_auditor.py`.
- [ ] 3.2 Write `scan_unicode(text)`: Returns warning if invisible markers exist.
- [ ] 3.3 Write `scan_base64(text)`: Returns warning if Base64 blocks are detected.
- [ ] 3.4 Write `scan_visuals(text_block)`: Returns warning if text is too small or matches background color.

## Phase 4: The Alert System & Reporting
- [ ] 4.1 Connect the Auditor logic to the main extraction loop.
- [ ] 4.2 Create a logging system that records warnings into a Python list/dictionary.
- [ ] 4.3 Write a function to format and export these warnings into a readable `security_report.txt`.

## Phase 5: CLI Polish & GitHub Deployment
- [ ] 5.1 Implement `argparse` for CLI commands.
- [ ] 5.2 Format terminal output to print a summary (e.g., "Scan Complete: 3 Warnings Found. Check security_report.txt").
- [ ] 5.3 Write a professional `README.md` explaining the "Auditor" philosophy.
- [ ] 5.4 Push the initial commit to GitHub.