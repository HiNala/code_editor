from fastapi import APIRouter

<<<<<<< HEAD
from app.api.routes import items, login, private, users, utils, chat, create
=======
from app.api.routes import login, private, users, utils, studio
>>>>>>> feature/v0-dev-transformation
from app.core.config import settings

api_router = APIRouter()
api_router.include_router(login.router)
api_router.include_router(users.router)
api_router.include_router(utils.router)
<<<<<<< HEAD
api_router.include_router(items.router)
api_router.include_router(chat.router)
api_router.include_router(create.router)
=======
api_router.include_router(studio.router, prefix="/studio", tags=["studio"])
>>>>>>> feature/v0-dev-transformation


if settings.ENVIRONMENT == "local":
    api_router.include_router(private.router)
