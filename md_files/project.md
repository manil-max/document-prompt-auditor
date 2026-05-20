# Project Name: Document Prompt Auditor (DPA) v3.0

## 1. Project Overview
The Document Prompt Auditor (DPA) is a Python-based CLI security scanner. Instead of aggressively modifying or deleting text, it acts as a passive auditor. It scans PDF documents for hidden prompt injection attacks, extracts the readable text, and generates a detailed security warning report.

## 2. Core Objective
To safely extract text from university documents while alerting the user to potential AI traps. It prevents "False Positives" (accidentally deleting legitimate course notes) by putting the final decision in the user's hands through a Security Report.

## 3. Tech Stack
* **Language:** Python 3.10+
* **Core Library:** `PyMuPDF` (`fitz`) - For high-speed text and layout extraction.
* **Interface:** Command Line Interface (CLI) using `argparse`.
* **Regex Engine:** Standard `re` module for detecting Unicode and Base64.

## 4. System Architecture & Data Flow
1.  **Input:** User runs the CLI command: `python scanner.py --file input.pdf`.
2.  **Scanning Engine (The Rules):**
    * **Rule A (Unicode/Base64):** Scans for zero-width characters (e.g., `\u200B`) and suspicious Base64 strings.
    * **Rule B (Visuals):** Flags text blocks where font size is `< 6pt` or text color matches the background.
    * **Rule C (Layout):** Flags text placed outside standard printable margins.
3.  **Logging Mechanism:** Instead of deleting the flagged text, the system records the exact Page Number, Line, and Trap Type.
4.  **Output Stage:** The tool generates two distinct files:
    * `extracted_content.txt`: The full text of the PDF with original paragraph structures intact.
    * `security_report.txt`: A detailed log of all detected warnings and their locations.