import uuid
from datetime import datetime
from typing import Any, Literal
from enum import Enum

from pydantic import EmailStr
from sqlmodel import Field, Relationship, SQLModel, JSON, Column


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
    projects: list["Project"] = Relationship(back_populates="owner", cascade_delete=True)


# Properties to return via API, id is always required
class UserPublic(UserBase):
    id: uuid.UUID


class UsersPublic(SQLModel):
    data: list[UserPublic]
    count: int


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


# Code Generation Studio Models

# Shared properties for Project
class ProjectBase(SQLModel):
    name: str = Field(min_length=1, max_length=255)
    description: str | None = Field(default=None, max_length=1000)


# Properties to receive on project creation
class ProjectCreate(ProjectBase):
    pass


# Properties to receive on project update
class ProjectUpdate(SQLModel):
    name: str | None = Field(default=None, min_length=1, max_length=255)
    description: str | None = Field(default=None, max_length=1000)


# Database model for Project
class Project(ProjectBase, table=True):
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    owner_id: uuid.UUID = Field(foreign_key="user.id", nullable=False, ondelete="CASCADE")
    owner: User | None = Relationship(back_populates="projects")
    snapshots: list["Snapshot"] = Relationship(back_populates="project", cascade_delete=True)
    code_generations: list["CodeGeneration"] = Relationship(back_populates="project", cascade_delete=True)
    test_runs: list["TestRun"] = Relationship(back_populates="project", cascade_delete=True)


# Properties to return via API
class ProjectPublic(ProjectBase):
    id: uuid.UUID
    created_at: datetime
    updated_at: datetime
    owner_id: uuid.UUID


class ProjectsPublic(SQLModel):
    data: list[ProjectPublic]
    count: int


# Shared properties for Snapshot
class SnapshotBase(SQLModel):
    name: str = Field(min_length=1, max_length=255)
    description: str | None = Field(default=None, max_length=1000)


# Properties to receive on snapshot creation
class SnapshotCreate(SnapshotBase):
    files: dict[str, str] = Field(default_factory=dict)
    snapshot_metadata: dict[str, Any] = Field(default_factory=dict)


# Properties to receive on snapshot update
class SnapshotUpdate(SQLModel):
    name: str | None = Field(default=None, min_length=1, max_length=255)
    description: str | None = Field(default=None, max_length=1000)


# Database model for Snapshot
class Snapshot(SnapshotBase, table=True):
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    files: dict[str, str] = Field(default_factory=dict, sa_column=Column(JSON))
    snapshot_metadata: dict[str, Any] = Field(default_factory=dict, sa_column=Column(JSON))
    project_id: uuid.UUID = Field(foreign_key="project.id", nullable=False, ondelete="CASCADE")
    project: Project | None = Relationship(back_populates="snapshots")


# Properties to return via API
class SnapshotPublic(SnapshotBase):
    id: uuid.UUID
    created_at: datetime
    files: dict[str, str]
    snapshot_metadata: dict[str, Any]
    project_id: uuid.UUID


class SnapshotsPublic(SQLModel):
    data: list[SnapshotPublic]
    count: int


# Agent Stage Enum for Test-Driven Development
class AgentStage(str, Enum):
    INTERPRET = "interpret"
    SCAFFOLD = "scaffold"
    UNIT_TEST = "unit_test"
    EXECUTE = "execute"
    REPAIR = "repair"
    REPORT = "report"


# Test-Driven Agent Loop Models
class TestRun(SQLModel, table=True):
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    completed_at: datetime | None = Field(default=None)
    project_id: uuid.UUID = Field(foreign_key="project.id", nullable=False, ondelete="CASCADE")
    project: Project | None = Relationship(back_populates="test_runs")
    
    # Test-driven loop stages
    current_stage: AgentStage = Field(default=AgentStage.INTERPRET)
    contract: dict[str, Any] = Field(default_factory=dict, sa_column=Column(JSON))  # Formal interpretation
    scaffold_files: dict[str, str] = Field(default_factory=dict, sa_column=Column(JSON))
    test_files: dict[str, str] = Field(default_factory=dict, sa_column=Column(JSON))
    test_results: dict[str, Any] = Field(default_factory=dict, sa_column=Column(JSON))
    repair_attempts: int = Field(default=0)
    max_repair_attempts: int = Field(default=2)
    
    # Final results
    final_files: dict[str, str] = Field(default_factory=dict, sa_column=Column(JSON))
    success: bool = Field(default=False)
    error_message: str | None = Field(default=None, max_length=2000)


# Plugin System Models
class PluginManifest(SQLModel, table=True):
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    name: str = Field(unique=True, max_length=100)
    version: str = Field(max_length=20)
    description: str = Field(max_length=500)
    
    # Plugin configuration
    inputs: list[str] = Field(default_factory=list, sa_column=Column(JSON))
    outputs: list[str] = Field(default_factory=list, sa_column=Column(JSON))
    command: str = Field(max_length=500)
    estimated_cost_ms: int = Field(default=1000)
    estimated_tokens: int = Field(default=0)
    
    # Plugin status
    installed_at: datetime = Field(default_factory=datetime.utcnow)
    enabled: bool = Field(default=True)
    verified: bool = Field(default=False)
    
    # Plugin execution stats
    executions: list["PluginExecution"] = Relationship(back_populates="plugin", cascade_delete=True)


class PluginExecution(SQLModel, table=True):
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    plugin_id: uuid.UUID = Field(foreign_key="pluginmanifest.id", nullable=False, ondelete="CASCADE")
    plugin: PluginManifest | None = Relationship(back_populates="executions")
    
    started_at: datetime = Field(default_factory=datetime.utcnow)
    completed_at: datetime | None = Field(default=None)
    duration_ms: int | None = Field(default=None)
    
    # Execution details
    input_files: dict[str, str] = Field(default_factory=dict, sa_column=Column(JSON))
    output_files: dict[str, str] = Field(default_factory=dict, sa_column=Column(JSON))
    success: bool = Field(default=False)
    error_message: str | None = Field(default=None, max_length=1000)
    checksum: str | None = Field(default=None, max_length=64)


# Observability Models
class StudioObservation(SQLModel, table=True):
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    
    # Prompt analysis
    prompt_hash: str = Field(max_length=64, index=True)
    prompt_text: str = Field(max_length=5000)
    
    # Generation results
    diff_patch: str = Field(default="", max_length=10000)  # Git-style diff
    tests_passed: int = Field(default=0)
    tests_failed: int = Field(default=0)
    latency_ms: int = Field(default=0)
    
    # Context
    project_id: uuid.UUID | None = Field(default=None)
    user_id: uuid.UUID | None = Field(default=None)
    model_used: str = Field(default="", max_length=50)


class StudioInsight(SQLModel, table=True):
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    
    # Insight details
    pattern_name: str = Field(max_length=100)
    description: str = Field(max_length=500)
    confidence_score: float = Field(ge=0.0, le=1.0)
    
    # Metrics
    flake_rate: float = Field(default=0.0, ge=0.0, le=1.0)
    avg_latency_ms: int = Field(default=0)
    sample_size: int = Field(default=0)
    
    # Recommendations
    recommended_action: str = Field(default="", max_length=500)
    alternate_template: str | None = Field(default=None, max_length=100)


# Enhanced Code Generation Models
class CodeGenerationBase(SQLModel):
    prompt: str = Field(min_length=1, max_length=5000)
    status: str = Field(default="pending", max_length=50)  # pending, streaming, completed, failed


# Properties to receive on code generation creation
class CodeGenerationCreate(CodeGenerationBase):
    skip_tests: bool = Field(default=False)  # For rapid prototyping
    use_plugins: list[str] = Field(default_factory=list)  # Plugin names to use


# Database model for Code Generation
class CodeGeneration(CodeGenerationBase, table=True):
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    completed_at: datetime | None = Field(default=None)
    generated_code: str | None = Field(default=None, max_length=50000)
    files: dict[str, str] = Field(default_factory=dict, sa_column=Column(JSON))
    generation_metadata: dict[str, Any] = Field(default_factory=dict, sa_column=Column(JSON))
    project_id: uuid.UUID = Field(foreign_key="project.id", nullable=False, ondelete="CASCADE")
    project: Project | None = Relationship(back_populates="code_generations")
    
    # Test-driven enhancements
    test_run_id: uuid.UUID | None = Field(default=None)
    reasoning_steps: list[dict[str, Any]] = Field(default_factory=list, sa_column=Column(JSON))
    prop_annotations: dict[str, Any] = Field(default_factory=dict, sa_column=Column(JSON))


# Properties to return via API
class CodeGenerationPublic(CodeGenerationBase):
    id: uuid.UUID
    created_at: datetime
    completed_at: datetime | None
    generated_code: str | None
    files: dict[str, str]
    generation_metadata: dict[str, Any]
    project_id: uuid.UUID
    reasoning_steps: list[dict[str, Any]]
    prop_annotations: dict[str, Any]


class CodeGenerationsPublic(SQLModel):
    data: list[CodeGenerationPublic]
    count: int


# Enhanced WebSocket message types
class StreamingMessage(SQLModel):
    type: Literal["token", "file_closed", "build_progress", "build_ok", "build_error", "stage_complete", "test_result", "reasoning_step"] 
    content: str | None = None
    filename: str | None = None
    stage: AgentStage | None = None
    progress_pct: int | None = None
    test_results: dict[str, Any] | None = None
    reasoning_data: dict[str, Any] | None = None
    stream_metadata: dict[str, Any] = Field(default_factory=dict)


# Prop Inspector Models
class PropAnnotation(SQLModel):
    prop_name: str
    prop_type: Literal["enum", "range", "boolean", "string", "number"]
    description: str
    options: list[Any] | None = None  # For enum types
    min_value: float | None = None    # For range types
    max_value: float | None = None    # For range types
    default_value: Any | None = None


class PropInspectorUpdate(SQLModel):
    component_id: str
    prop_name: str
    new_value: Any


# Plugin Tool Registry
class PluginTool(SQLModel):
    name: str
    description: str
    inputs: list[str]
    outputs: list[str]
    cost_estimate: int  # milliseconds
    plugin_id: uuid.UUID
