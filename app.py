import os
import tempfile
import shutil
import webbrowser
import threading
import socket
import sys
import time
import subprocess
import traceback
from flask import Flask, render_template, request, jsonify, send_from_directory
from werkzeug.utils import secure_filename

# Import existing scanning engine logic
from scanner import load_pdf, extract_text_with_metadata, reconstruct_text
from security_auditor import SecurityAuditor

app = Flask(__name__)

# Ensure upload/temp folders are structured safely
UPLOAD_FOLDER = os.path.join(tempfile.gettempdir(), 'dpa_uploads')
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/api/scan', methods=['POST'])
def api_scan():
    if 'file' not in request.files:
        return jsonify({"error": "No file uploaded."}), 400
        
    file = request.files['file']
    if file.filename == '':
        return jsonify({"error": "No file selected."}), 400
        
    if not file.filename.lower().endswith('.pdf'):
        return jsonify({"error": "Only PDF documents are supported."}), 400
        
    # Save the file securely to a temporary directory
    filename = secure_filename(file.filename)
    temp_dir = tempfile.mkdtemp()
    file_path = os.path.join(temp_dir, filename)
    file.save(file_path)
    
    try:
        # Load and scan the PDF
        doc = load_pdf(file_path)
        
        # Get document metadata
        metadata = {}
        for k, v in doc.metadata.items():
            if v:
                metadata[k] = str(v)
                
        # Reconstruct the original text
        reconstructed = reconstruct_text(doc)
        
        # Extract spans and run the security audit
        spans = extract_text_with_metadata(doc)
        auditor = SecurityAuditor()
        for span in spans:
            auditor.scan_visuals(span, span['page'])
            auditor.scan_unicode(span['text'], span['page'])
            auditor.scan_base64(span['text'], span['page'])
            
        warnings = auditor.warnings
        
        # Calculate severity counts and safety score
        severity_counts = {"CRITICAL": 0, "HIGH": 0, "MEDIUM": 0, "LOW": 0}
        for w in warnings:
            sev = w.get("severity", "LOW")
            if sev in severity_counts:
                severity_counts[sev] += 1
                
        # Calculate a nice safety score from 0 to 100
        # Start at 100, subtract points based on severity of vulnerabilities
        score = 100
        score -= (severity_counts["CRITICAL"] * 30)
        score -= (severity_counts["HIGH"] * 15)
        score -= (severity_counts["MEDIUM"] * 10)
        score -= (severity_counts["LOW"] * 5)
        score = max(0, score)
        
        # Clean up temporary file & directory
        total_pages = len(doc)
        doc.close()
        shutil.rmtree(temp_dir, ignore_errors=True)
        
        return jsonify({
            "filename": filename,
            "metadata": metadata,
            "reconstructed_text": reconstructed,
            "warnings": warnings,
            "severity_counts": severity_counts,
            "safety_score": score,
            "total_pages": total_pages
        })
        
    except Exception as e:
        traceback.print_exc()
        shutil.rmtree(temp_dir, ignore_errors=True)
        return jsonify({"error": f"Error scanning PDF: {str(e)}"}), 500

def is_port_available(port: int) -> bool:
    with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as sock:
        sock.settimeout(0.5)
        return sock.connect_ex(("127.0.0.1", port)) != 0

def find_available_port(start_port: int = 5050) -> int:
    for port in range(start_port, start_port + 50):
        if is_port_available(port):
            return port
    raise RuntimeError("No available local port found for Document Prompt Auditor.")

def open_app_window(url: str) -> None:
    time.sleep(1.5)
    
    # Try opening MS Edge in App Mode (hides address bar/tabs for a premium app feel)
    edge_commands = [
        ["msedge", f"--app={url}"],
        [
            r"C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe",
            f"--app={url}",
        ],
        [
            r"C:\Program Files\Microsoft\Edge\Application\msedge.exe",
            f"--app={url}",
        ],
    ]
    
    for command in edge_commands:
        try:
            subprocess.Popen(command, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
            return
        except OSError:
            continue
            
    # Fallback to standard web browser if Edge app mode isn't launched
    webbrowser.open(url)

if __name__ == '__main__':
    port = find_available_port(5050)
    url = f"http://127.0.0.1:{port}"
    
    print(f"Launching Document Prompt Auditor Local UI on {url}...")
    threading.Thread(target=open_app_window, args=(url,), daemon=True).start()
    
    # Run the server in secure local mode, silent thread
    app.run(debug=False, port=port)
