import uuid

from fastapi import APIRouter, HTTPException
from openai import OpenAI
from sqlmodel import Session

from app.api.deps import CurrentUser, SessionDep
from app.core.config import settings
from app.models import Item
from sqlmodel import SQLModel


class ChatRequest(SQLModel):
    message: str


class ChatResponse(SQLModel):
    assistant: str
    history: list[dict]


router = APIRouter(prefix="/items", tags=["chat"])


@router.post("/{item_id}/chat", response_model=ChatResponse)
def chat_item(
    *,
    item_id: uuid.UUID,
    chat_in: ChatRequest,
    current_user: CurrentUser,
    session: SessionDep,
):
    item = session.get(Item, item_id)
    if not item:
        raise HTTPException(status_code=404, detail="Item not found")
    if not current_user.is_superuser and item.owner_id != current_user.id:
        raise HTTPException(status_code=400, detail="Not enough permissions")

    # Build prompt
    prompt = (
        f"Item Title: {item.title}\nDescription: {item.description}\n"
        f"User message: {chat_in.message}"
    )

    assistant_reply = "(no reply)"
    if settings.OPENAI_API_KEY:
        client = OpenAI(api_key=settings.OPENAI_API_KEY)
        completion = client.responses.create(model="gpt-4.1", input=prompt)
        assistant_reply = completion.output_text.strip()
    else:
        assistant_reply = "This is a dummy assistant reply."

    item.chat_history.append({"role": "user", "content": chat_in.message})
    item.chat_history.append({"role": "assistant", "content": assistant_reply})
    session.add(item)
    session.commit()
    session.refresh(item)

    return ChatResponse(assistant=assistant_reply, history=item.chat_history)
