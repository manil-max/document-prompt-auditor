import argparse
import os
import fitz  # PyMuPDF

def load_pdf(file_path):
    """Loads a PDF file and returns the fitz Document object."""
    if not os.path.exists(file_path):
        raise FileNotFoundError(f"Error: The file '{file_path}' does not exist.")
    
    if not file_path.lower().endswith(".pdf"):
        raise ValueError("Error: The file must be a PDF document.")

    try:
        doc = fitz.open(file_path)
        return doc
    except Exception as e:
        raise RuntimeError(f"Error opening PDF: {e}")

def main():
    parser = argparse.ArgumentParser(
        description="Document Prompt Auditor (DPA) - Passive Security Scan for PDF prompt injections."
    )
    parser.add_argument(
        "--file", "-f",
        required=True,
        help="Path to the target PDF document to scan."
    )
    
    args = parser.parse_args()
    
    try:
        print(f"Loading document: {args.file}")
        doc = load_pdf(args.file)
        print(f"Successfully loaded '{args.file}'")
        print(f"Total Pages: {len(doc)}")
        print("Metadata:")
        for key, value in doc.metadata.items():
            if value:
                print(f"  - {key}: {value}")
        
    except Exception as e:
        print(e)
        exit(1)

if __name__ == "__main__":
    main()
