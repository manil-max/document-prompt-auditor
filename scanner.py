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

def extract_text_with_metadata(doc):
    """
    Extracts text blocks from the document, retaining metadata like font size, color, 
    coordinates (bbox), and page numbers.
    Returns a list of dictionaries containing span details.
    """
    spans_metadata = []
    for page_num, page in enumerate(doc):
        page_dict = page.get_text("dict")
        for block in page_dict.get("blocks", []):
            if block.get("type") == 0:  # Text block
                for line in block.get("lines", []):
                    for span in line.get("spans", []):
                        spans_metadata.append({
                            "page": page_num + 1,
                            "text": span.get("text", ""),
                            "size": span.get("size", 0.0),
                            "font": span.get("font", ""),
                            "color": span.get("color", 0),
                            "bbox": span.get("bbox", (0, 0, 0, 0)),
                            "origin": span.get("origin", (0, 0)),
                        })
    return spans_metadata

def reconstruct_text(doc):
    """
    Reconstructs the full text of the PDF page-by-page, retaining paragraph structure.
    Blocks are separated by a double newline, and lines within blocks are joined.
    """
    full_text_pages = []
    for page_num, page in enumerate(doc):
        page_text = []
        page_dict = page.get_text("dict")
        for block in page_dict.get("blocks", []):
            if block.get("type") == 0:  # Text block
                block_lines = []
                for line in block.get("lines", []):
                    line_text = "".join(span.get("text", "") for span in line.get("spans", []))
                    if line_text.strip():
                        block_lines.append(line_text)
                if block_lines:
                    # Join lines within the block with newline to preserve lists and basic layout
                    page_text.append("\n".join(block_lines))
        
        # Combine blocks on the page
        full_text_pages.append(f"--- Page {page_num + 1} ---\n" + "\n\n".join(page_text))
        
    return "\n\n".join(full_text_pages)

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
        
        print("\nExtracting text spans...")
        spans = extract_text_with_metadata(doc)
        print(f"Extracted {len(spans)} text spans.")
        if spans:
            print("Preview of first 3 spans:")
            for i, span in enumerate(spans[:3]):
                print(f"  Span {i+1} [Page {span['page']} | Size {span['size']:.1f}pt | Color {span['color']}]: {repr(span['text'])}")
        
        print("\nReconstructing original text layout...")
        reconstructed = reconstruct_text(doc)
        output_file = "extracted_content.txt"
        with open(output_file, "w", encoding="utf-8") as f:
            f.write(reconstructed)
        print(f"Saved cleanly reconstructed text to '{output_file}'")
        
    except Exception as e:
        print(e)
        exit(1)

if __name__ == "__main__":
    main()
