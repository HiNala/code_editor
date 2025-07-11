import uuid
import datetime

from pydantic import EmailStr
from sqlmodel import Field, Relationship, SQLModel
from sqlalchemy import Column
from sqlalchemy.dialects.postgresql import JSONB as JSON
from sqlalchemy.ext.mutable import MutableList, MutableDict


# Shared properties
class UserBase(SQLModel):
    email: EmailStr = Field(unique=True, index=True, max_length=255)
    is_active: bool = True
    is_superuser: bool = False
    full_name: str | None = Field(default=None, max_length=255)


# Properties to receive via API on creation
class UserCreate(UserBase):
    password: str = Field(min_length=8, max_length=40)


class UserRegister(SQLModel):
    email: EmailStr = Field(max_length=255)
    password: str = Field(min_length=8, max_length=40)
    full_name: str | None = Field(default=None, max_length=255)


# Properties to receive via API on update, all are optional
class UserUpdate(UserBase):
    email: EmailStr | None = Field(default=None, max_length=255)  # type: ignore
    password: str | None = Field(default=None, min_length=8, max_length=40)


class UserUpdateMe(SQLModel):
    full_name: str | None = Field(default=None, max_length=255)
    email: EmailStr | None = Field(default=None, max_length=255)


class UpdatePassword(SQLModel):
    current_password: str = Field(min_length=8, max_length=40)
    new_password: str = Field(min_length=8, max_length=40)


# Database model, database table inferred from class name
class User(UserBase, table=True):
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    hashed_password: str
    items: list["Item"] = Relationship(back_populates="owner", cascade_delete=True)


# Properties to return via API, id is always required
class UserPublic(UserBase):
    id: uuid.UUID


class UsersPublic(SQLModel):
    data: list[UserPublic]
    count: int


# Shared properties
class ItemBase(SQLModel):
    title: str = Field(min_length=1, max_length=255)
    description: str | None = Field(default=None, max_length=255)


# Properties to receive on item creation
class ItemCreate(ItemBase):
    pass


# Properties to receive on item update
class ItemUpdate(ItemBase):
    title: str | None = Field(default=None, min_length=1, max_length=255)  # type: ignore


# Database model, database table inferred from class name
class Item(ItemBase, table=True):
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    owner_id: uuid.UUID = Field(
        foreign_key="user.id", nullable=False, ondelete="CASCADE"
    )
    owner: User | None = Relationship(back_populates="items")

    # store chat history as list of {role, content}
    chat_history: list[dict] = Field(
        default_factory=list,
        sa_column=Column(MutableList.as_mutable(JSON), nullable=False, server_default="[]"),
    )


# Properties to return via API, id is always required
class ItemPublic(ItemBase):
    id: uuid.UUID
    owner_id: uuid.UUID

    # store chat history as list of {role, content}
    chat_history: list[dict] = Field(
        default_factory=list,
        sa_column=Column(MutableList.as_mutable(JSON), nullable=False, server_default="[]"),
    )


class ItemsPublic(SQLModel):
    data: list[ItemPublic]
    count: int


# Stores each AI‑generated timestamp run.
class Creation(SQLModel, table=True):
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    owner_id: uuid.UUID = Field(foreign_key="user.id", nullable=False)
    # (legacy) YouTube URL and raw timestamps (Gemini output) if used
    youtube_url: str | None = None
    timestamp_data: dict = Field(
        sa_column=Column(MutableDict.as_mutable(JSON), nullable=False), default={}
    )

    # S3 keys for user‑uploaded videos and audio tracks
    input_video_keys: list[str] = Field(
        default_factory=list,
        sa_column=Column(MutableList.as_mutable(JSON), nullable=False, server_default="[]"),
    )
    input_audio_keys: list[str] = Field(
        default_factory=list,
        sa_column=Column(MutableList.as_mutable(JSON), nullable=False, server_default="[]"),
    )

    # processing status: pending -> processing -> completed -> failed
    status: str = Field(default="pending")

    # S3 key for the final edited video
    output_video_key: str | None = None

    created_at: datetime.datetime = Field(default_factory=datetime.datetime.utcnow)


# Generic message
class Message(SQLModel):
    message: str


# JSON payload containing access token
class Token(SQLModel):
    access_token: str
    token_type: str = "bearer"


# Contents of JWT token
class TokenPayload(SQLModel):
    sub: str | None = None


class NewPassword(SQLModel):
    token: str
    new_password: str = Field(min_length=8, max_length=40)
