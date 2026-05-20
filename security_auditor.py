import re

class SecurityAuditor:
    """
    Security Auditor engine that passive-scans extracted PDF elements 
    for hidden prompt injections, invisible characters, base64 payloads, 
    and suspicious visual layouts.
    """
    
    def __init__(self):
        # We will keep a list of found warnings/logs.
        self.warnings = []

    def scan_unicode(self, text, page_num):
        """Scans for zero-width Unicode characters (invisible tokens)."""
        # Match invisible and bidirectional formatting characters
        invisible_chars = re.findall(r'[\u200b\u200c\u200d\ufeff\u200e\u200f\u202a-\u202e]', text)
        if invisible_chars:
            # Create a highlightable representation for previewing
            highlighted = text
            replacements = {
                '\u200b': '[ZWSP]',
                '\u200c': '[ZWNJ]',
                '\u200d': '[ZWJ]',
                '\ufeff': '[BOM]',
                '\u200e': '[LRM]',
                '\u200f': '[RLM]',
            }
            for char, placeholder in replacements.items():
                highlighted = highlighted.replace(char, placeholder)
            
            # Catch remaining bidi characters if any
            for code in range(0x202a, 0x202f):
                char = chr(code)
                highlighted = highlighted.replace(char, f"[BIDI_0x{code:x}]")

            warning = {
                "page": page_num,
                "rule": "Unicode Invisible Characters",
                "severity": "HIGH",
                "message": f"Detected {len(invisible_chars)} invisible zero-width or formatting characters.",
                "context": highlighted.strip()
            }
            self.warnings.append(warning)
            return warning
        return None

    def scan_base64(self, text, page_num):
        """Scans for suspicious Base64 encoded string blocks."""
        pass

    def scan_visuals(self, span, page_num):
        """Flags text blocks where font size is too small or matches background color."""
        pass
