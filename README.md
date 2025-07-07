# Cre8able

## Overview

Cre8able is an AI-powered operating system for modern storytelling.  From the instant a concept pops into a creator’s mind, Cre8able shepherds it through every stage—ideation, production and distribution—inside one seamless workspace:

1. **Ideate** – An embedded language-model shapes hooks, titles and full scripts in the creator’s own voice.
2. **Produce** – Automated editing silently trims footage, adds captions and polishes assets while you focus on story.
3. **Publish** – A built-in scheduler pushes the final, platform-ready content to every major network with a single click.

By eliminating app-hopping, version confusion and repetitive busywork, Cre8able frees creators to stay laser-focused on craft and audience.

## Quick start

1. Install Docker & Docker Compose.
2. Clone the repository and start the full stack:

```bash
git clone <repo-url> cre8able
cd cre8able
# spin up Postgres, backend, frontend, mailcatcher, Traefik, etc.
docker compose up -d --build
```

3. Open your browser:
   • Frontend — http://localhost:5173  
   • API docs — http://localhost:8000/docs

That’s it — Cre8able is running locally.

## Technology Stack and Features

- ⚡ [**FastAPI**](https://fastapi.tiangolo.com) for the Python backend API.
    - 🧰 [SQLModel](https://sqlmodel.tiangolo.com) for the Python SQL database interactions (ORM).
    - 🔍 [Pydantic](https://docs.pydantic.dev), used by FastAPI, for the data validation and settings management.
    - 💾 [PostgreSQL](https://www.postgresql.org) as the SQL database.
- 🚀 [React](https://react.dev) for the frontend.
    - 💃 Using TypeScript, hooks, Vite, and other parts of a modern frontend stack.
    - 🎨 [Chakra UI](https://chakra-ui.com) for the frontend components.
    - 🤖 An automatically generated frontend client.
    - 🧪 [Playwright](https://playwright.dev) for End-to-End testing.
    - 🦇 Dark mode support.
- 🐋 [Docker Compose](https://www.docker.com) for development and production.
- 🔒 Secure password hashing by default.
- 🔑 JWT (JSON Web Token) authentication.
- 📫 Email based password recovery.
- ✅ Tests with [Pytest](https://pytest.org).
- 📞 [Traefik](https://traefik.io) as a reverse proxy / load balancer.
- 🚢 Deployment instructions using Docker Compose, including how to set up a frontend Traefik proxy to handle automatic HTTPS certificates.
- 🏭 CI (continuous integration) and CD (continuous deployment) based on GitHub Actions.

## How To Use It

You can **just fork or clone** this repository and use it as is.

✨ It just works. ✨

### Configure

You can then update configs in the `.env` files to customize your configurations.

Before deploying it, make sure you change at least the values for:

- `SECRET_KEY`
- `FIRST_SUPERUSER_PASSWORD`
- `POSTGRES_PASSWORD`

You can (and should) pass these as environment variables from secrets.

Read the [deployment.md](./deployment.md) docs for more details.

### Generate Secret Keys

Some environment variables in the `.env` file have a default value of `changethis`.

You have to change them with a secret key, to generate secret keys you can run the following command:

```bash
python -c "import secrets; print(secrets.token_urlsafe(32))"
```

## Backend Development

Backend docs: [backend/README.md](./backend/README.md).

## Frontend Development

Frontend docs: [frontend/README.md](./frontend/README.md).

## Deployment

Deployment docs: [deployment.md](./deployment.md).

## Development

General development docs: [development.md](./development.md).

This includes using Docker Compose, custom local domains, `.env` configurations, etc.


