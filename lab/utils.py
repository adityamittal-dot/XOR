"""PDF text extraction for uploaded lab reports."""

import logging

import pdfplumber

logger = logging.getLogger(__name__)

PDF_MAGIC = b"%PDF-"


class PdfExtractionError(Exception):
    """Raised when a PDF cannot be opened or contains no readable text."""


def looks_like_pdf(django_file) -> bool:
    """Check the file's magic bytes rather than trusting its name or MIME type."""
    position = django_file.tell()
    try:
        django_file.seek(0)
        header = django_file.read(len(PDF_MAGIC))
    finally:
        django_file.seek(position)
    return header == PDF_MAGIC


def extract_text_from_pdf(file_obj) -> str:
    """
    Return the concatenated text of every page.

    Accepts a path or any file-like object, so it works with storage backends
    that do not expose a local filesystem path.
    """
    text_parts: list[str] = []

    try:
        with pdfplumber.open(file_obj) as pdf:
            for page in pdf.pages:
                page_text = page.extract_text() or ""
                if page_text.strip():
                    text_parts.append(page_text)
    except PdfExtractionError:
        raise
    except Exception as exc:  # pdfminer raises a broad, undocumented set
        logger.warning("Could not read PDF: %s", exc)
        raise PdfExtractionError(f"Could not read the PDF: {exc}") from exc

    text = "\n\n".join(text_parts).strip()
    if not text:
        raise PdfExtractionError(
            "No selectable text found. Scanned or image-only PDFs need OCR."
        )
    return text
