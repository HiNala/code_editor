import os
import subprocess
import uuid
import logging

from sqlmodel import Session

from app.core.config import settings
from app.core.db import engine
from app.models import Creation
from app.services.s3_service import s3_client
from app.services.gemini_service import generate_timestamps_from_youtube

# set up logger
logger = logging.getLogger(__name__)


def process_uploaded_media(creation_id: str) -> None:
    """
    Background task to process uploaded media:
    - Download videos and audio from S3 to /tmp.
    - Generate timestamps via Gemini using presigned URLs.
    - Perform simple ffmpeg editing.
    - Upload result back to S3 and update the Creation record.
    """
    logger.info(f"Start processing media for Creation {creation_id}")
    with Session(engine) as session:
        creation = session.get(Creation, creation_id)
        if not creation:
            logger.error(f"Creation {creation_id} not found, aborting")
            return

        # mark as processing
        creation.status = "processing"
        session.add(creation)
        session.commit()
        logger.debug(f"Marked Creation {creation_id} as processing")

        # prepare temporary directory
        tmp_dir = "/tmp/cre8able"
        os.makedirs(tmp_dir, exist_ok=True)

        # download input videos
        local_videos = []
        for key in creation.input_video_keys:
            local_path = os.path.join(tmp_dir, f"{uuid.uuid4()}_{os.path.basename(key)}")
            logger.info(f"Downloading video from S3://{settings.S3_BUCKET_NAME}/{key} to {local_path}")
            s3_client.download_file(settings.S3_BUCKET_NAME, key, local_path)
            local_videos.append(local_path)

        # download input audio
        local_audios = []
        for key in creation.input_audio_keys:
            local_path = os.path.join(tmp_dir, f"{uuid.uuid4()}_{os.path.basename(key)}")
            logger.info(f"Downloading audio from S3://{settings.S3_BUCKET_NAME}/{key} to {local_path}")
            s3_client.download_file(settings.S3_BUCKET_NAME, key, local_path)
            local_audios.append(local_path)

        # generate timestamps using Gemini for each uploaded video
        timestamp_data = {"videos": []}
        for key in creation.input_video_keys or []:
            presigned_url = s3_client.generate_presigned_url(
                ClientMethod="get_object",
                Params={"Bucket": settings.S3_BUCKET_NAME, "Key": key},
                ExpiresIn=3600,
            )
            logger.info(f"Generating timestamps via Gemini for video {key}")
            try:
                timestamps = generate_timestamps_from_youtube(presigned_url)
                timestamp_data["videos"].append({"key": key, "timestamps": timestamps})
            except Exception as exc:
                logger.error(f"Gemini timestamp generation failed for video {key}: {exc}")
                creation.status = "failed"
                session.add(creation)
                session.commit()
                return
        creation.timestamp_data = timestamp_data
        session.add(creation)
        session.commit()
        logger.debug(f"Saved timestamp_data for Creation {creation_id}")

        # proof‑of‑concept: concatenate all videos (ignore audio)
        output_path = os.path.join(tmp_dir, f"out_{creation.id}.mp4")
        if local_videos:
            list_videos = os.path.join(tmp_dir, f"videos_{creation.id}.txt")
            with open(list_videos, "w") as fv:
                for v in local_videos:
                    fv.write(f"file '{v}'\n")
            tmp_video = os.path.join(tmp_dir, f"concat_{creation.id}.mp4")
            logger.info(f"Concatenating {len(local_videos)} videos into {tmp_video}")
            subprocess.run([
                "ffmpeg", "-y", "-f", "concat", "-safe", "0", "-i", list_videos,
                "-c", "copy", tmp_video
            ], check=False)
            os.replace(tmp_video, output_path)

        # upload the edited video
        output_key = f"{creation.owner_id}/outputs/{creation.id}.mp4"
        if os.path.exists(output_path):
            logger.info(f"Uploading edited video to S3://{settings.S3_BUCKET_NAME}/{output_key}")
            s3_client.upload_file(output_path, settings.S3_BUCKET_NAME, output_key)
            creation.output_video_key = output_key
            creation.status = "completed"
            logger.info(f"Marked Creation {creation_id} as completed")
        else:
            creation.status = "failed"
            logger.error(f"ffmpeg output missing for Creation {creation_id}, marked failed")

        session.add(creation)
        session.commit()