import pathlib

import httpx
from fastapi import HTTPException

from app.core.config import settings


def generate_timestamps_from_youtube(youtube_url: str) -> dict:
    """
    Calls Google Gemini to generate timestamped JSON for the given video URL.
    """
    # Load fixed instruction
    instr_path = (
        pathlib.Path(__file__).parent.parent
        / "instructions"
        / "timestamp_instruction.txt"
    )
    instruction = instr_path.read_text(encoding="utf-8")

    headers = {
        "x-goog-api-key": settings.GEMINI_API_KEY or "",
        "Content-Type": "application/json",
    }
    # Ensure URL is a plain string for JSON serialization
    url_str = str(youtube_url)
    body = {
        "contents": [
            {
                "parts": [
                    {"text": instruction},
                    {"file_data": {"file_uri": url_str}},
                ],
            }
        ],
    }

    url = (
        "https://generativelanguage.googleapis.com/v1beta/models/"
        "gemini-2.5-flash-lite-preview-06-17:generateContent"
    )
    try:
        resp = httpx.post(
            url,
            headers=headers,
            json=body,
            timeout=settings.GEMINI_TIMEOUT_SECONDS,
        )
        resp.raise_for_status()
    except httpx.ReadTimeout:
        raise HTTPException(
            status_code=504,
            detail="Timed out waiting for Gemini response."
        )
    return resp.json()