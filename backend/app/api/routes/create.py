import uuid
import datetime

from fastapi import APIRouter, HTTPException
from pydantic import HttpUrl
from sqlmodel import SQLModel, select

from app.api.deps import CurrentUser, SessionDep
from app.core.config import settings
from app.models import Creation
from app.services.gemini_service import generate_timestamps_from_youtube
from sqlmodel import select


class CreateRequest(SQLModel):
    youtube_url: HttpUrl


class CreationResponse(SQLModel):
    id: uuid.UUID
    youtube_url: str
    timestamp_data: dict
    created_at: datetime.datetime


router = APIRouter(prefix="/create", tags=["create"])


@router.post("", response_model=CreationResponse)
def run_creation(
    *,
    create_in: CreateRequest,
    current_user: CurrentUser,
    session: SessionDep,
) -> CreationResponse:
    if not settings.GEMINI_API_KEY:
        raise HTTPException(status_code=500, detail="GEMINI_API_KEY not configured")

    # Call Gemini service
    gemini_output = generate_timestamps_from_youtube(create_in.youtube_url)

    # Persist to DB
    creation = Creation(
        owner_id=current_user.id,
        youtube_url=str(create_in.youtube_url),
        timestamp_data=gemini_output,
    )
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
    creations = session.exec(
        select(Creation).where(Creation.owner_id == current_user.id)
    ).all()
    return CreationsResponse(data=creations, count=len(creations))