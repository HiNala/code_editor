import uuid
from typing import Any

from sqlmodel import Session, select

from app.core.security import get_password_hash, verify_password
from app.models import (
    User, UserCreate, UserUpdate,
    Project, ProjectCreate, ProjectUpdate,
    Snapshot, SnapshotCreate, SnapshotUpdate,
    CodeGeneration, CodeGenerationCreate,
    TestRun, PluginManifest, PluginExecution, StudioObservation, StudioInsight
)


def create_user(*, session: Session, user_create: UserCreate) -> User:
    db_obj = User.model_validate(
        user_create, update={"hashed_password": get_password_hash(user_create.password)}
    )
    session.add(db_obj)
    session.commit()
    session.refresh(db_obj)
    return db_obj


def update_user(*, session: Session, db_user: User, user_in: UserUpdate) -> Any:
    user_data = user_in.model_dump(exclude_unset=True)
    extra_data = {}
    if "password" in user_data:
        password = user_data["password"]
        hashed_password = get_password_hash(password)
        extra_data["hashed_password"] = hashed_password
    db_user.sqlmodel_update(user_data, update=extra_data)
    session.add(db_user)
    session.commit()
    session.refresh(db_user)
    return db_user


def get_user_by_email(*, session: Session, email: str) -> User | None:
    statement = select(User).where(User.email == email)
    session_user = session.exec(statement).first()
    return session_user


def authenticate(*, session: Session, email: str, password: str) -> User | None:
    db_user = get_user_by_email(session=session, email=email)
    if not db_user:
        return None
    if not verify_password(password, db_user.hashed_password):
        return None
    return db_user


# Project CRUD operations
def create_project(*, session: Session, project_create: ProjectCreate, owner_id: uuid.UUID) -> Project:
    db_project = Project.model_validate(project_create, update={"owner_id": owner_id})
    session.add(db_project)
    session.commit()
    session.refresh(db_project)
    return db_project


def get_project(*, session: Session, project_id: uuid.UUID) -> Project | None:
    return session.get(Project, project_id)


def get_projects_by_owner(*, session: Session, owner_id: uuid.UUID, skip: int = 0, limit: int = 100) -> list[Project]:
    statement = select(Project).where(Project.owner_id == owner_id).offset(skip).limit(limit)
    return list(session.exec(statement).all())


def update_project(*, session: Session, project: Project, project_update: ProjectUpdate) -> Project:
    project_data = project_update.model_dump(exclude_unset=True)
    project.sqlmodel_update(project_data)
    session.add(project)
    session.commit()
    session.refresh(project)
    return project


def delete_project(*, session: Session, project: Project) -> None:
    session.delete(project)
    session.commit()


# Snapshot CRUD operations
def create_snapshot(*, session: Session, snapshot_create: SnapshotCreate, project_id: uuid.UUID) -> Snapshot:
    db_snapshot = Snapshot.model_validate(snapshot_create, update={"project_id": project_id})
    session.add(db_snapshot)
    session.commit()
    session.refresh(db_snapshot)
    return db_snapshot


def get_snapshot(*, session: Session, snapshot_id: uuid.UUID) -> Snapshot | None:
    return session.get(Snapshot, snapshot_id)


def get_snapshots_by_project(*, session: Session, project_id: uuid.UUID, skip: int = 0, limit: int = 100) -> list[Snapshot]:
    statement = select(Snapshot).where(Snapshot.project_id == project_id).offset(skip).limit(limit)
    return list(session.exec(statement).all())


def update_snapshot(*, session: Session, snapshot: Snapshot, snapshot_update: SnapshotUpdate) -> Snapshot:
    snapshot_data = snapshot_update.model_dump(exclude_unset=True)
    snapshot.sqlmodel_update(snapshot_data)
    session.add(snapshot)
    session.commit()
    session.refresh(snapshot)
    return snapshot


def delete_snapshot(*, session: Session, snapshot: Snapshot) -> None:
    session.delete(snapshot)
    session.commit()


# Code Generation CRUD operations
def create_code_generation(*, session: Session, code_generation_create: CodeGenerationCreate, project_id: uuid.UUID) -> CodeGeneration:
    db_code_generation = CodeGeneration.model_validate(code_generation_create, update={"project_id": project_id})
    session.add(db_code_generation)
    session.commit()
    session.refresh(db_code_generation)
    return db_code_generation


def get_code_generation(*, session: Session, code_generation_id: uuid.UUID) -> CodeGeneration | None:
    return session.get(CodeGeneration, code_generation_id)


def get_code_generations_by_project(*, session: Session, project_id: uuid.UUID, skip: int = 0, limit: int = 100) -> list[CodeGeneration]:
    statement = select(CodeGeneration).where(CodeGeneration.project_id == project_id).offset(skip).limit(limit)
    return list(session.exec(statement).all())


def update_code_generation(*, session: Session, code_generation: CodeGeneration, **kwargs) -> CodeGeneration:
    for field, value in kwargs.items():
        if hasattr(code_generation, field):
            setattr(code_generation, field, value)
    session.add(code_generation)
    session.commit()
    session.refresh(code_generation)
    return code_generation


def delete_code_generation(*, session: Session, code_generation: CodeGeneration) -> None:
    session.delete(code_generation)
    session.commit()


# Test Run CRUD operations
def create_test_run(*, session: Session, project_id: uuid.UUID, **kwargs) -> TestRun:
    db_test_run = TestRun(project_id=project_id, **kwargs)
    session.add(db_test_run)
    session.commit()
    session.refresh(db_test_run)
    return db_test_run


def get_test_run(*, session: Session, test_run_id: uuid.UUID) -> TestRun | None:
    return session.get(TestRun, test_run_id)


def get_test_runs_by_project(*, session: Session, project_id: uuid.UUID, skip: int = 0, limit: int = 100) -> list[TestRun]:
    statement = select(TestRun).where(TestRun.project_id == project_id).offset(skip).limit(limit).order_by(TestRun.created_at.desc())
    return list(session.exec(statement).all())


def update_test_run(*, session: Session, test_run: TestRun, **kwargs) -> TestRun:
    for field, value in kwargs.items():
        if hasattr(test_run, field):
            setattr(test_run, field, value)
    session.add(test_run)
    session.commit()
    session.refresh(test_run)
    return test_run


# Plugin CRUD operations
def create_plugin_manifest(*, session: Session, **kwargs) -> PluginManifest:
    db_plugin = PluginManifest(**kwargs)
    session.add(db_plugin)
    session.commit()
    session.refresh(db_plugin)
    return db_plugin


def get_plugin_manifest(*, session: Session, plugin_id: uuid.UUID) -> PluginManifest | None:
    return session.get(PluginManifest, plugin_id)


def get_plugin_manifest_by_name(*, session: Session, name: str) -> PluginManifest | None:
    statement = select(PluginManifest).where(PluginManifest.name == name)
    return session.exec(statement).first()


def get_plugin_manifests(*, session: Session, enabled_only: bool = False, skip: int = 0, limit: int = 100) -> list[PluginManifest]:
    statement = select(PluginManifest)
    if enabled_only:
        statement = statement.where(PluginManifest.enabled == True)
    statement = statement.offset(skip).limit(limit)
    return list(session.exec(statement).all())


def update_plugin_manifest(*, session: Session, plugin: PluginManifest, **kwargs) -> PluginManifest:
    for field, value in kwargs.items():
        if hasattr(plugin, field):
            setattr(plugin, field, value)
    session.add(plugin)
    session.commit()
    session.refresh(plugin)
    return plugin


def delete_plugin_manifest(*, session: Session, plugin: PluginManifest) -> None:
    session.delete(plugin)
    session.commit()


# Plugin Execution CRUD operations
def create_plugin_execution(*, session: Session, plugin_id: uuid.UUID, **kwargs) -> PluginExecution:
    db_execution = PluginExecution(plugin_id=plugin_id, **kwargs)
    session.add(db_execution)
    session.commit()
    session.refresh(db_execution)
    return db_execution


def get_plugin_execution(*, session: Session, execution_id: uuid.UUID) -> PluginExecution | None:
    return session.get(PluginExecution, execution_id)


def get_plugin_executions_by_plugin(*, session: Session, plugin_id: uuid.UUID, skip: int = 0, limit: int = 100) -> list[PluginExecution]:
    statement = select(PluginExecution).where(PluginExecution.plugin_id == plugin_id).offset(skip).limit(limit).order_by(PluginExecution.started_at.desc())
    return list(session.exec(statement).all())


def update_plugin_execution(*, session: Session, execution: PluginExecution, **kwargs) -> PluginExecution:
    for field, value in kwargs.items():
        if hasattr(execution, field):
            setattr(execution, field, value)
    session.add(execution)
    session.commit()
    session.refresh(execution)
    return execution


# Observability CRUD operations
def create_studio_observation(*, session: Session, **kwargs) -> StudioObservation:
    db_observation = StudioObservation(**kwargs)
    session.add(db_observation)
    session.commit()
    session.refresh(db_observation)
    return db_observation


def get_studio_observations(*, session: Session, skip: int = 0, limit: int = 100, **filters) -> list[StudioObservation]:
    statement = select(StudioObservation)
    
    # Apply filters
    if 'prompt_hash' in filters:
        statement = statement.where(StudioObservation.prompt_hash == filters['prompt_hash'])
    if 'project_id' in filters:
        statement = statement.where(StudioObservation.project_id == filters['project_id'])
    if 'user_id' in filters:
        statement = statement.where(StudioObservation.user_id == filters['user_id'])
    
    statement = statement.offset(skip).limit(limit).order_by(StudioObservation.created_at.desc())
    return list(session.exec(statement).all())


def create_studio_insight(*, session: Session, **kwargs) -> StudioInsight:
    db_insight = StudioInsight(**kwargs)
    session.add(db_insight)
    session.commit()
    session.refresh(db_insight)
    return db_insight


def get_studio_insights(*, session: Session, skip: int = 0, limit: int = 100) -> list[StudioInsight]:
    statement = select(StudioInsight).offset(skip).limit(limit).order_by(StudioInsight.created_at.desc())
    return list(session.exec(statement).all())


def get_studio_insights_by_pattern(*, session: Session, pattern_name: str) -> list[StudioInsight]:
    statement = select(StudioInsight).where(StudioInsight.pattern_name == pattern_name)
    return list(session.exec(statement).all())
