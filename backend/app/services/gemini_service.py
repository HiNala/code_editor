import logging
import base64
import pathlib
import mimetypes
import time

import httpx
from fastapi import HTTPException

from app.core.config import settings

logger = logging.getLogger(__name__)


def generate_timestamps_from_youtube(youtube_url: str) -> dict:
    """
    Uploads the video at youtube_url to the Gemini Files API and then
    calls Gemini generateContent to produce timestamped JSON for the video.
    """
    # Load fixed instruction text
    instr_path = (
        pathlib.Path(__file__).parent.parent
        / "instructions"
        / "timestamp_instruction.txt"
    )
    instruction = instr_path.read_text(encoding="utf-8")

    # Download the video bytes from the given URL (e.g., S3 presigned URL)
    try:
        video_resp = httpx.get(youtube_url, timeout=settings.GEMINI_TIMEOUT_SECONDS)
        video_resp.raise_for_status()
    except httpx.RequestError as exc:
        raise HTTPException(status_code=502, detail=f"Failed to fetch video: {exc}")
    data = video_resp.content
    size = len(data)

    # Determine MIME type
    mime_type, _ = mimetypes.guess_type(str(youtube_url))
    if not mime_type:
        mime_type = "video/mp4"

    # Prepare generateContent endpoint info
    gen_url = (
        "https://generativelanguage.googleapis.com/v1beta/models/"
        "gemini-2.0-flash:generateContent"
    )
    gen_headers = {
        "x-goog-api-key": settings.GEMINI_API_KEY or "",
        "Content-Type": "application/json",
    }

    # For small videos (< threshold), send as inline_data and skip Files API polling
    if size <= settings.GEMINI_INLINE_VIDEO_SIZE_LIMIT:
        logger.info(
            f"Using inline_data for small video ({size} bytes <= {settings.GEMINI_INLINE_VIDEO_SIZE_LIMIT})"
        )
        inline_b64 = base64.b64encode(data).decode()
        inline_body = {
            "contents": [
                {
                    "parts": [
                        {"inline_data": {"mime_type": mime_type, "data": inline_b64}},
                        {"text": instruction},
                    ],
                }
            ],
        }
        try:
            resp = httpx.post(
                gen_url,
                headers=gen_headers,
                json=inline_body,
                timeout=settings.GEMINI_TIMEOUT_SECONDS,
            )
            resp.raise_for_status()
        except httpx.ReadTimeout:
            raise HTTPException(
                status_code=504, detail="Timed out waiting for Gemini response."
            )
        except httpx.HTTPError as exc:
            status_code = exc.response.status_code if exc.response is not None else "n/a"
            body = exc.response.text if exc.response is not None else str(exc)
            raise HTTPException(
                status_code=502,
                detail=f"Gemini generateContent failed ({status_code}): {body}",
            )
        return resp.json()

    # Start a resumable upload session using the Files API
    upload_start_url = "https://generativelanguage.googleapis.com/upload/v1beta/files"
    start_headers = {
        "x-goog-api-key": settings.GEMINI_API_KEY or "",
        "Content-Type": "application/json",
        "X-Goog-Upload-Protocol": "resumable",
        "X-Goog-Upload-Command": "start",
        "X-Goog-Upload-Header-Content-Length": str(size),
        "X-Goog-Upload-Header-Content-Type": mime_type,
    }
    meta = {"file": {"display_name": pathlib.Path(str(youtube_url)).name}}
    try:
        sess = httpx.post(
            upload_start_url,
            headers=start_headers,
            json=meta,
            timeout=settings.GEMINI_TIMEOUT_SECONDS,
        )
        sess.raise_for_status()
    except httpx.HTTPError as exc:
        raise HTTPException(status_code=502, detail=f"Gemini file upload start failed: {exc}")
    upload_url = sess.headers.get("x-goog-upload-url")
    if not upload_url:
        raise HTTPException(status_code=502, detail="Missing upload session URL from Gemini Files API")

    # Upload the video data and finalize
    upload_headers = {
        "X-Goog-Upload-Command": "upload, finalize",
        "X-Goog-Upload-Offset": "0",
        "Content-Length": str(size),
    }
    try:
        fin = httpx.put(upload_url, headers=upload_headers, content=data, timeout=settings.GEMINI_TIMEOUT_SECONDS)
        fin.raise_for_status()
    except httpx.HTTPError as exc:
        raise HTTPException(status_code=502, detail=f"Gemini file upload data failed: {exc}")
    info = fin.json()
    file_info = info.get("file", {})
    file_uri = file_info.get("uri")
    file_name = file_info.get("name")
    if not file_uri or not file_name:
        raise HTTPException(
            status_code=502,
            detail="Missing file URI or name from Gemini Files API response",
        )
    # Build metadata URL for polling; file_name may already include the 'files/' prefix
    if file_name.startswith("files/"):
        metadata_path = file_name
    else:
        metadata_path = f"files/{file_name}"
    metadata_url = f"https://generativelanguage.googleapis.com/v1beta/{metadata_path}"

    # Poll file metadata until the file is ACTIVE before generateContent
    for attempt in range(settings.GEMINI_FILE_POLL_MAX_RETRIES):
        logger.info(f"Polling file status, attempt {attempt+1}/{settings.GEMINI_FILE_POLL_MAX_RETRIES}")
        try:
            meta_resp = httpx.get(
                metadata_url,
                headers={"x-goog-api-key": settings.GEMINI_API_KEY or ""},
                timeout=settings.GEMINI_TIMEOUT_SECONDS,
            )
            meta_resp.raise_for_status()
            meta_json = meta_resp.json()
            status = meta_json.get("file", {}).get("status", "").upper()
            logger.info(f"File metadata response: {meta_json}")
            logger.info(f"File {file_name} status = {status}")
        except httpx.RequestError as exc:
            logger.debug(f"Error polling file status (attempt {attempt+1}): {exc}")
            status = None
        if status == "ACTIVE":
            logger.info(f"File {file_name} is ACTIVE, proceeding to generateContent")
            break
        time.sleep(settings.GEMINI_FILE_POLL_INTERVAL_SECONDS)
    else:
        raise HTTPException(
            status_code=504,
            detail=(
                f"File {file_name} was not ACTIVE after "
                f"{settings.GEMINI_FILE_POLL_MAX_RETRIES} attempts"
            ),
        )

    # Call generateContent with the uploaded file reference
    gen_url = (
        "https://generativelanguage.googleapis.com/v1beta/models/"
        "gemini-2.0-flash:generateContent"
    )
    gen_headers = {
        "x-goog-api-key": settings.GEMINI_API_KEY or "",
        "Content-Type": "application/json",
    }
    body = {
        "contents": [
            {
                "parts": [
                    {"file_data": {"mime_type": mime_type, "file_uri": file_uri}},
                    {"text": instruction},
                ],
            }
        ],
    }
    try:
        resp = httpx.post(
            gen_url,
            headers=gen_headers,
            json=body,
            timeout=settings.GEMINI_TIMEOUT_SECONDS,
        )
        resp.raise_for_status()
    except httpx.ReadTimeout:
        raise HTTPException(status_code=504, detail="Timed out waiting for Gemini response.")
    except httpx.HTTPError as exc:
        status_code = exc.response.status_code if exc.response is not None else "n/a"
        body = exc.response.text if exc.response is not None else str(exc)
        raise HTTPException(
            status_code=502,
            detail=f"Gemini generateContent failed ({status_code}): {body}",
        )
    result = resp.json()

    # Delete the uploaded file to clean up
    try:
        httpx.delete(
            metadata_url,
            headers={"x-goog-api-key": settings.GEMINI_API_KEY or ""},
            timeout=settings.GEMINI_TIMEOUT_SECONDS,
        )
    except httpx.RequestError as exc:
        logger.warning(f"Failed to delete Gemini file {file_name}: {exc}")
    return result