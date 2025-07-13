import uuid
from typing import Any

from sqlmodel import Session, select
from app.models import (
    Project, ProjectCreate, ProjectUpdate,
    Snapshot, SnapshotCreate, SnapshotUpdate,
    CodeGeneration, CodeGenerationCreate,
    User
)


def create_project(*, session: Session, project_create: ProjectCreate, owner_id: uuid.UUID) -> Project:
    """Create a new project."""
    project = Project(
        name=project_create.name,
        description=project_create.description,
        owner_id=owner_id
    )
    session.add(project)
    session.commit()
    session.refresh(project)
    return project


def get_project(*, session: Session, project_id: uuid.UUID) -> Project | None:
    """Get a project by ID."""
    return session.get(Project, project_id)


def get_projects_by_owner(
    *, session: Session, owner_id: uuid.UUID, skip: int = 0, limit: int = 100
) -> list[Project]:
    """Get all projects for a specific owner."""
    statement = select(Project).where(Project.owner_id == owner_id).offset(skip).limit(limit)
    return session.exec(statement).all()


def update_project(
    *, session: Session, project: Project, project_update: ProjectUpdate
) -> Project:
    """Update a project."""
    project_data = project_update.model_dump(exclude_unset=True)
    for field, value in project_data.items():
        setattr(project, field, value)
    
    session.add(project)
    session.commit()
    session.refresh(project)
    return project


def delete_project(*, session: Session, project: Project) -> None:
    """Delete a project."""
    session.delete(project)
    session.commit()


def create_snapshot(
    *, session: Session, snapshot_create: SnapshotCreate, project_id: uuid.UUID
) -> Snapshot:
    """Create a new snapshot."""
    snapshot = Snapshot(
        name=snapshot_create.name,
        description=snapshot_create.description,
        files=snapshot_create.files,
        metadata=snapshot_create.metadata,
        project_id=project_id
    )
    session.add(snapshot)
    session.commit()
    session.refresh(snapshot)
    return snapshot


def get_snapshot(*, session: Session, snapshot_id: uuid.UUID) -> Snapshot | None:
    """Get a snapshot by ID."""
    return session.get(Snapshot, snapshot_id)


def get_snapshots_by_project(
    *, session: Session, project_id: uuid.UUID, skip: int = 0, limit: int = 100
) -> list[Snapshot]:
    """Get all snapshots for a specific project."""
    statement = select(Snapshot).where(Snapshot.project_id == project_id).offset(skip).limit(limit)
    return session.exec(statement).all()


def update_snapshot(
    *, session: Session, snapshot: Snapshot, snapshot_update: SnapshotUpdate
) -> Snapshot:
    """Update a snapshot."""
    snapshot_data = snapshot_update.model_dump(exclude_unset=True)
    for field, value in snapshot_data.items():
        setattr(snapshot, field, value)
    
    session.add(snapshot)
    session.commit()
    session.refresh(snapshot)
    return snapshot


def delete_snapshot(*, session: Session, snapshot: Snapshot) -> None:
    """Delete a snapshot."""
    session.delete(snapshot)
    session.commit()


def create_code_generation(
    *, session: Session, code_generation_create: CodeGenerationCreate, project_id: uuid.UUID
) -> CodeGeneration:
    """Create a new code generation."""
    code_generation = CodeGeneration(
        prompt=code_generation_create.prompt,
        status=code_generation_create.status,
        project_id=project_id
    )
    session.add(code_generation)
    session.commit()
    session.refresh(code_generation)
    return code_generation


def get_code_generation(*, session: Session, code_generation_id: uuid.UUID) -> CodeGeneration | None:
    """Get a code generation by ID."""
    return session.get(CodeGeneration, code_generation_id)


def get_code_generations_by_project(
    *, session: Session, project_id: uuid.UUID, skip: int = 0, limit: int = 100
) -> list[CodeGeneration]:
    """Get all code generations for a specific project."""
    statement = select(CodeGeneration).where(CodeGeneration.project_id == project_id).offset(skip).limit(limit)
    return session.exec(statement).all()


def update_code_generation(
    *, session: Session, code_generation: CodeGeneration, **kwargs: Any
) -> CodeGeneration:
    """Update a code generation."""
    for field, value in kwargs.items():
        if hasattr(code_generation, field):
            setattr(code_generation, field, value)
    
    session.add(code_generation)
    session.commit()
    session.refresh(code_generation)
    return code_generation


def delete_code_generation(*, session: Session, code_generation: CodeGeneration) -> None:
    """Delete a code generation."""
    session.delete(code_generation)
    session.commit() 