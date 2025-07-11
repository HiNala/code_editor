import uuid
import datetime

from fastapi import APIRouter, HTTPException, BackgroundTasks, File, UploadFile
import logging
from sqlmodel import SQLModel, select

from app.api.deps import CurrentUser, SessionDep
from app.core.config import settings
from app.models import Creation, Message
from app.services.s3_service import s3_client
from fastapi.responses import StreamingResponse
from app.core.config import settings


class CreationRequest(SQLModel):
    item_id: uuid.UUID | None = None

class CreationResponse(SQLModel):
    id: uuid.UUID
    item_id: uuid.UUID | None
    # optional legacy YouTube URL
    youtube_url: str | None
    timestamp_data: dict
    # keys of user‑uploaded videos in S3
    input_video_keys: list[str]
    # keys of user‑uploaded audio in S3
    input_audio_keys: list[str]
    # processing lifecycle: pending, processing, completed, or failed
    status: str
    # S3 key of the final edited video, if available
    output_video_key: str | None
    # presigned URL to download the output video
    output_url: str | None = None
    # presigned URLs for raw input videos
    input_video_urls: list[str] = []
    # presigned URLs for raw input audio tracks
    input_audio_urls: list[str] = []
    created_at: datetime.datetime


router = APIRouter(prefix="/create", tags=["create"])
logger = logging.getLogger(__name__)


@router.post("", response_model=CreationResponse)
def run_creation(
    *,
    background_tasks: BackgroundTasks,
    current_user: CurrentUser,
    session: SessionDep,
    create_req: CreationRequest,
) -> CreationResponse:
    """
    Initialize a new Creation record (empty), no body required for MVP.
    """
    logger.info(f"Initializing Creation for user {current_user.id}")
    creation = Creation(owner_id=current_user.id, item_id=create_req.item_id)
    session.add(creation)
    session.commit()
    session.refresh(creation)
    return creation


class CreationsResponse(SQLModel):
    data: list[CreationResponse]
    count: int


@router.get("", response_model=CreationsResponse)
def list_creations(
    current_user: CurrentUser,
    session: SessionDep,
) -> CreationsResponse:
    # Fetch all creations for current user
    creations = session.exec(
        select(Creation).where(Creation.owner_id == current_user.id)
    ).all()

    results: list[CreationResponse] = []
    for c in creations:
        # generate presigned URL for final output video
        output_url: str | None = None
        if c.output_video_key:
            try:
                output_url = s3_client.generate_presigned_url(
                    ClientMethod="get_object",
                    Params={
                        "Bucket": settings.S3_BUCKET_NAME,
                        "Key": c.output_video_key,
                    },
                    ExpiresIn=3600,
                )
            except Exception:
                output_url = None

        # generate presigned URLs for input videos and audio
        video_urls: list[str] = []
        for key in c.input_video_keys:
            try:
                url = s3_client.generate_presigned_url(
                    ClientMethod="get_object",
                    Params={"Bucket": settings.S3_BUCKET_NAME, "Key": key},
                    ExpiresIn=3600,
                )
                video_urls.append(url)
            except Exception:
                continue

        audio_urls: list[str] = []
        for key in c.input_audio_keys:
            try:
                url = s3_client.generate_presigned_url(
                    ClientMethod="get_object",
                    Params={"Bucket": settings.S3_BUCKET_NAME, "Key": key},
                    ExpiresIn=3600,
                )
                audio_urls.append(url)
            except Exception:
                continue

        results.append(
            CreationResponse(
                id=c.id,
                item_id=c.item_id,
                youtube_url=c.youtube_url,
                timestamp_data=c.timestamp_data,
                input_video_keys=c.input_video_keys,
                input_audio_keys=c.input_audio_keys,
                input_video_urls=video_urls,
                input_audio_urls=audio_urls,
                status=c.status,
                output_video_key=c.output_video_key,
                output_url=output_url,
                created_at=c.created_at,
            )
        )
    return CreationsResponse(data=results, count=len(results))


@router.get("/{creation_id}/output")
def download_output(
    creation_id: uuid.UUID,
    current_user: CurrentUser,
    session: SessionDep,
) -> StreamingResponse:
    creation = session.get(Creation, creation_id)
    if not creation or creation.owner_id != current_user.id:
        raise HTTPException(status_code=404, detail="Creation not found")
    if not creation.output_video_key:
        raise HTTPException(status_code=404, detail="No output video available")

    s3_obj = s3_client.get_object(
        Bucket=settings.S3_BUCKET_NAME, Key=creation.output_video_key
    )
    return StreamingResponse(
        s3_obj['Body'], media_type='video/mp4'
    )


@router.post("/{creation_id}/media", response_model=CreationResponse)
def upload_media(
    creation_id: uuid.UUID,
    background_tasks: BackgroundTasks,
    current_user: CurrentUser,
    session: SessionDep,
    video_files: list[UploadFile] = File(None),
    audio_files: list[UploadFile] = File(None),
) -> CreationResponse:
    creation = session.get(Creation, creation_id)
    if not creation or creation.owner_id != current_user.id:
        raise HTTPException(status_code=404, detail="Creation not found")

    # Upload videos to S3
    for video in video_files or []:
        ext = video.filename.rsplit(".", 1)[-1]
        key = f"{current_user.id}/videos/{uuid.uuid4()}.{ext}"
        logger.info(f"Uploading video {video.filename} to S3 key {key}")
        s3_client.upload_fileobj(video.file, settings.S3_BUCKET_NAME, key)
        creation.input_video_keys.append(key)

    # Upload audio tracks to S3
    for audio in audio_files or []:
        ext = audio.filename.rsplit(".", 1)[-1]
        key = f"{current_user.id}/audio/{uuid.uuid4()}.{ext}"
        logger.info(f"Uploading audio {audio.filename} to S3 key {key}")
        s3_client.upload_fileobj(audio.file, settings.S3_BUCKET_NAME, key)
        creation.input_audio_keys.append(key)

    session.add(creation)
    session.commit()
    session.refresh(creation)

    # Trigger background processing
    from app.tasks.video_tasks import process_uploaded_media

    logger.info(f"Scheduling background task for Creation {creation.id}")
    background_tasks.add_task(process_uploaded_media, str(creation.id))

    return creation


@router.delete("/{creation_id}", response_model=Message)
def delete_creation(
    creation_id: uuid.UUID,
    current_user: CurrentUser,
    session: SessionDep,
) -> Message:
    """
    Delete a Creation and all associated media files (videos, audio, output) from S3.
    """
    creation = session.get(Creation, creation_id)
    if not creation or creation.owner_id != current_user.id:
        raise HTTPException(status_code=404, detail="Creation not found")
    bucket = settings.S3_BUCKET_NAME
    for key in creation.input_video_keys or []:
        try:
            s3_client.delete_object(Bucket=bucket, Key=key)
        except Exception:
            pass
    for key in creation.input_audio_keys or []:
        try:
            s3_client.delete_object(Bucket=bucket, Key=key)
        except Exception:
            pass
    if creation.output_video_key:
        try:
            s3_client.delete_object(Bucket=bucket, Key=creation.output_video_key)
        except Exception:
            pass
    session.delete(creation)
    session.commit()
    return Message(message="Creation deleted successfully")