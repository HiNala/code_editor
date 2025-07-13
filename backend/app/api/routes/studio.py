import hashlib
import json
import time
import uuid
from datetime import datetime
from typing import Any, List

from fastapi import APIRouter, Depends, HTTPException, Query, WebSocket, WebSocketDisconnect
from sqlmodel import Session

# Redis for rate limiting (optional)
try:
    import redis
    REDIS_AVAILABLE = True
except ImportError:
    REDIS_AVAILABLE = False

from app.api.deps import CurrentUser, get_db
from app.crud import (
    create_project, get_project, get_projects_by_owner, update_project, delete_project,
    create_snapshot, get_snapshot, get_snapshots_by_project, update_snapshot, delete_snapshot,
    create_code_generation, get_code_generation, get_code_generations_by_project, update_code_generation, delete_code_generation
)
from app.core.config import settings
from app.models import (
    Project, ProjectCreate, ProjectUpdate, ProjectPublic, ProjectsPublic,
    Snapshot, SnapshotCreate, SnapshotUpdate, SnapshotPublic, SnapshotsPublic,
    CodeGeneration, CodeGenerationCreate, CodeGenerationPublic, CodeGenerationsPublic,
    StreamingMessage, Message, PropInspectorUpdate, PropAnnotation,
    PluginManifest, TestRun, AgentStage
)
from app.services.openai_service import OpenAIService
from app.services.test_driven_agent import TestDrivenAgent
from app.services.plugin_system import PluginSystem, initialize_default_plugins

router = APIRouter()

# Initialize services
openai_service = OpenAIService()
test_driven_agent = TestDrivenAgent()
plugin_system = PluginSystem()

# Redis client for rate limiting
if REDIS_AVAILABLE and settings.ENVIRONMENT != "local":
    redis_client = redis.Redis(host='localhost', port=6379, db=0)
else:
    redis_client = None


async def check_rate_limit(user_id: str) -> bool:
    """Check if user has exceeded rate limit (60 prompts/hour)"""
    if not redis_client:
        return True  # No rate limiting if Redis unavailable
    
    try:
        key = f"rate_limit:{user_id}"
        current = redis_client.get(key)
        
        if current is None:
            # First request
            redis_client.setex(key, 3600, 1)  # 1 hour expiry
            return True
        elif int(current) < 60:
            # Under limit
            redis_client.incr(key)
            return True
        else:
            # Over limit
            return False
    except:
        # Redis error, allow request
        return True


async def verify_websocket_token(token: str | None) -> str | None:
    """Verify WebSocket JWT token"""
    if not token:
        return None
    
    try:
        import jwt
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=["HS256"])
        return payload.get("sub")
    except:
        return None


# Project Management Routes

@router.post("/projects/", response_model=ProjectPublic)
def create_project_endpoint(
    *, session: Session = Depends(get_db), current_user: CurrentUser, project_in: ProjectCreate
) -> Any:
    """Create new project"""
    project = create_project(
        session=session, project_create=project_in, owner_id=current_user.id
    )
    return project


@router.get("/projects/", response_model=ProjectsPublic)
def get_projects(
    current_user: CurrentUser, session: Session = Depends(get_db), skip: int = 0, limit: int = 100
) -> Any:
    """Get projects for current user"""
    projects = get_projects_by_owner(
        session=session, owner_id=current_user.id, skip=skip, limit=limit
    )
    return ProjectsPublic(data=projects, count=len(projects))


@router.get("/projects/{project_id}", response_model=ProjectPublic)
def get_project_endpoint(
    *, session: Session = Depends(get_db), current_user: CurrentUser, project_id: uuid.UUID
) -> Any:
    """Get project by ID"""
    project = get_project(session=session, project_id=project_id)
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    if project.owner_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not enough permissions")
    return project


@router.put("/projects/{project_id}", response_model=ProjectPublic)
def update_project_endpoint(
    *,
    session: Session = Depends(get_db),
    current_user: CurrentUser,
    project_id: uuid.UUID,
    project_update: ProjectUpdate,
) -> Any:
    """Update project"""
    project = get_project(session=session, project_id=project_id)
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    if project.owner_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not enough permissions")
    
    project = update_project(session=session, project=project, project_update=project_update)
    return project


@router.delete("/projects/{project_id}", response_model=Message)
def delete_project_endpoint(
    *, session: Session = Depends(get_db), current_user: CurrentUser, project_id: uuid.UUID
) -> Any:
    """Delete project"""
    project = get_project(session=session, project_id=project_id)
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    if project.owner_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not enough permissions")
    
    delete_project(session=session, project=project)
    return Message(message="Project deleted successfully")


# Enhanced Code Generation with Test-Driven Loop

@router.post("/projects/{project_id}/generate/", response_model=CodeGenerationPublic)
def create_code_generation_endpoint(
    *,
    session: Session = Depends(get_db),
    current_user: CurrentUser,
    project_id: uuid.UUID,
    code_generation_in: CodeGenerationCreate,
) -> Any:
    """Create code generation with test-driven loop"""
    project = get_project(session=session, project_id=project_id)
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    if project.owner_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not enough permissions")
    
    code_generation = create_code_generation(
        session=session, code_generation_create=code_generation_in, project_id=project_id
    )
    return code_generation


@router.get("/projects/{project_id}/generations/", response_model=CodeGenerationsPublic)
def get_code_generations_endpoint(
    *,
    session: Session = Depends(get_db),
    current_user: CurrentUser,
    project_id: uuid.UUID,
    skip: int = 0,
    limit: int = 100,
) -> Any:
    """Get code generations for project"""
    project = get_project(session=session, project_id=project_id)
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    if project.owner_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not enough permissions")
    
    generations = get_code_generations_by_project(
        session=session, project_id=project_id, skip=skip, limit=limit
    )
    return CodeGenerationsPublic(data=generations, count=len(generations))


@router.get("/generations/{generation_id}", response_model=CodeGenerationPublic)
def get_code_generation_endpoint(
    *, session: Session = Depends(get_db), current_user: CurrentUser, generation_id: uuid.UUID
) -> Any:
    """Get code generation by ID"""
    generation = get_code_generation(session=session, code_generation_id=generation_id)
    if not generation:
        raise HTTPException(status_code=404, detail="Code generation not found")
    
    # Check project ownership
    project = get_project(session=session, project_id=generation.project_id)
    if not project or project.owner_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not enough permissions")
    
    return generation


# Enhanced WebSocket with Test-Driven Generation

@router.websocket("/projects/{project_id}/generate/stream")
async def websocket_generate_code(
    websocket: WebSocket,
    project_id: uuid.UUID,
    token: str = Query(None),
    session: Session = Depends(get_db),
):
    """WebSocket endpoint for streaming test-driven code generation"""
    
    await websocket.accept()
    
    # Verify authentication
    user_id = await verify_websocket_token(token)
    if not user_id:
        await websocket.send_json({"type": "error", "content": "Authentication failed"})
        await websocket.close()
        return
    
    # Check rate limiting
    if not await check_rate_limit(user_id):
        await websocket.send_json({"type": "error", "content": "Rate limit exceeded. Please try again later."})
        await websocket.close()
        return
    
    # Verify project access
    project = get_project(session=session, project_id=project_id)
    if not project or str(project.owner_id) != user_id:
        await websocket.send_json({"type": "error", "content": "Project not found or access denied"})
        await websocket.close()
        return
    
    try:
        while True:
            # Receive message from client
            data = await websocket.receive_json()
            
            if data.get("type") == "generate":
                prompt = data.get("prompt", "")
                skip_tests = data.get("skip_tests", False)
                use_plugins = data.get("use_plugins", [])
                
                if not prompt:
                    await websocket.send_json({"type": "error", "content": "Prompt is required"})
                    continue
                
                # Start test-driven generation
                async for message in test_driven_agent.run_test_driven_generation(
                    prompt=prompt,
                    project_id=project_id,
                    session=session,
                    skip_tests=skip_tests
                ):
                    await websocket.send_json(message.model_dump())
            
            elif data.get("type") == "improve":
                code = data.get("code", "")
                improvement_request = data.get("improvement", "")
                
                if not code or not improvement_request:
                    await websocket.send_json({"type": "error", "content": "Code and improvement request are required"})
                    continue
                
                # Stream improved code
                async for message in openai_service.improve_code(code, improvement_request):
                    await websocket.send_json(message.model_dump())
            
            elif data.get("type") == "patch_prop":
                # Handle prop inspector updates
                component_id = data.get("component_id")
                prop_name = data.get("prop_name") 
                new_value = data.get("new_value")
                
                if component_id and prop_name is not None:
                    # Apply prop patch and trigger hot reload
                    await handle_prop_patch(websocket, component_id, prop_name, new_value, session)
            
            elif data.get("type") == "use_plugin":
                # Execute plugin
                plugin_name = data.get("plugin_name")
                input_files = data.get("files", {})
                
                if plugin_name and input_files:
                    try:
                        output_files = await plugin_system.execute_plugin(plugin_name, input_files, session)
                        await websocket.send_json({
                            "type": "plugin_result",
                            "plugin_name": plugin_name,
                            "files": output_files
                        })
                    except Exception as e:
                        await websocket.send_json({
                            "type": "error",
                            "content": f"Plugin execution failed: {str(e)}"
                        })
                        
    except WebSocketDisconnect:
        pass
    except Exception as e:
        await websocket.send_json({"type": "error", "content": f"Unexpected error: {str(e)}"})
    finally:
        await websocket.close()


async def handle_prop_patch(websocket: WebSocket, component_id: str, prop_name: str, new_value: Any, session: Session):
    """Handle prop inspector updates with hot reload"""
    
    # Send hot reload message
    await websocket.send_json({
        "type": "hot_reload",
        "component_id": component_id,
        "prop_name": prop_name,
        "new_value": new_value
    })


# Plugin Management Routes

@router.get("/plugins/", response_model=List[dict])
async def get_plugins(session: Session = Depends(get_db)):
    """Get all available plugins"""
    
    # Initialize plugin system if needed
    await plugin_system.initialize(session)
    
    plugins = session.query(PluginManifest).all()
    return [
        {
            "id": str(plugin.id),
            "name": plugin.name,
            "version": plugin.version,
            "description": plugin.description,
            "enabled": plugin.enabled,
            "verified": plugin.verified,
            "inputs": plugin.inputs,
            "outputs": plugin.outputs,
            "estimated_cost_ms": plugin.estimated_cost_ms
        }
        for plugin in plugins
    ]


@router.post("/plugins/install")
async def install_plugin(
    *,
    session: Session = Depends(get_db),
    current_user: CurrentUser,
    git_url: str
):
    """Install plugin from Git URL"""
    
    if not current_user.is_superuser:
        raise HTTPException(status_code=403, detail="Only administrators can install plugins")
    
    try:
        plugin = await plugin_system.install_plugin_from_url(git_url, session)
        return {
            "message": f"Plugin {plugin.name} installed successfully",
            "plugin": {
                "name": plugin.name,
                "version": plugin.version,
                "verified": plugin.verified
            }
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.delete("/plugins/{plugin_name}")
async def remove_plugin(
    *,
    session: Session = Depends(get_db),
    current_user: CurrentUser,
    plugin_name: str
):
    """Remove a plugin"""
    
    if not current_user.is_superuser:
        raise HTTPException(status_code=403, detail="Only administrators can remove plugins")
    
    try:
        await plugin_system.remove_plugin(plugin_name, session)
        return {"message": f"Plugin {plugin_name} removed successfully"}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.get("/plugins/tools")
async def get_available_tools(session: Session = Depends(get_db)):
    """Get available plugin tools"""
    
    await plugin_system.initialize(session)
    tools = plugin_system.get_available_tools()
    
    return [
        {
            "name": tool.name,
            "description": tool.description,
            "inputs": tool.inputs,
            "outputs": tool.outputs,
            "cost_estimate": tool.cost_estimate
        }
        for tool in tools
    ]


# Test Run Management

@router.get("/projects/{project_id}/test-runs/")
async def get_test_runs(
    *,
    session: Session = Depends(get_db),
    current_user: CurrentUser,
    project_id: uuid.UUID,
    skip: int = 0,
    limit: int = 100
):
    """Get test runs for project"""
    
    project = get_project(session=session, project_id=project_id)
    if not project or project.owner_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not enough permissions")
    
    from sqlmodel import select
    test_runs = session.exec(
        select(TestRun)
        .where(TestRun.project_id == project_id)
        .offset(skip)
        .limit(limit)
        .order_by(TestRun.created_at.desc())
    ).all()
    
    return [
        {
            "id": str(run.id),
            "created_at": run.created_at.isoformat(),
            "completed_at": run.completed_at.isoformat() if run.completed_at else None,
            "current_stage": run.current_stage,
            "success": run.success,
            "repair_attempts": run.repair_attempts,
            "test_results": run.test_results
        }
        for run in test_runs
    ]


@router.get("/test-runs/{test_run_id}")
async def get_test_run_details(
    *,
    session: Session = Depends(get_db),
    current_user: CurrentUser,
    test_run_id: uuid.UUID
):
    """Get detailed test run information"""
    
    test_run = session.get(TestRun, test_run_id)
    if not test_run:
        raise HTTPException(status_code=404, detail="Test run not found")
    
    # Check project ownership
    project = get_project(session=session, project_id=test_run.project_id)
    if not project or project.owner_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not enough permissions")
    
    return {
        "id": str(test_run.id),
        "created_at": test_run.created_at.isoformat(),
        "completed_at": test_run.completed_at.isoformat() if test_run.completed_at else None,
        "current_stage": test_run.current_stage,
        "contract": test_run.contract,
        "scaffold_files": test_run.scaffold_files,
        "test_files": test_run.test_files,
        "test_results": test_run.test_results,
        "final_files": test_run.final_files,
        "success": test_run.success,
        "repair_attempts": test_run.repair_attempts,
        "error_message": test_run.error_message
    }


# Initialize plugin system on startup
@router.on_event("startup")
async def initialize_plugins():
    """Initialize plugin system and default plugins"""
    
    # This would be called during app startup
    # For now, we'll initialize when first accessed
    pass


# Snapshot management (existing routes)
@router.post("/projects/{project_id}/snapshots/", response_model=SnapshotPublic)
def create_snapshot_endpoint(
    *,
    session: Session = Depends(get_db),
    current_user: CurrentUser,
    project_id: uuid.UUID,
    snapshot_in: SnapshotCreate,
) -> Any:
    """Create snapshot"""
    project = get_project(session=session, project_id=project_id)
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    if project.owner_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not enough permissions")
    
    snapshot = create_snapshot(
        session=session, snapshot_create=snapshot_in, project_id=project_id
    )
    return snapshot


@router.get("/projects/{project_id}/snapshots/", response_model=SnapshotsPublic)
def get_snapshots_endpoint(
    *,
    session: Session = Depends(get_db),
    current_user: CurrentUser,
    project_id: uuid.UUID,
    skip: int = 0,
    limit: int = 100,
) -> Any:
    """Get snapshots for project"""
    project = get_project(session=session, project_id=project_id)
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    if project.owner_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not enough permissions")
    
    snapshots = get_snapshots_by_project(
        session=session, project_id=project_id, skip=skip, limit=limit
    )
    return SnapshotsPublic(data=snapshots, count=len(snapshots))


@router.get("/snapshots/{snapshot_id}", response_model=SnapshotPublic)
def get_snapshot_endpoint(
    *, session: Session = Depends(get_db), current_user: CurrentUser, snapshot_id: uuid.UUID
) -> Any:
    """Get snapshot by ID"""
    snapshot = get_snapshot(session=session, snapshot_id=snapshot_id)
    if not snapshot:
        raise HTTPException(status_code=404, detail="Snapshot not found")
    
    # Check project ownership
    project = get_project(session=session, project_id=snapshot.project_id)
    if not project or project.owner_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not enough permissions")
    
    return snapshot


@router.put("/snapshots/{snapshot_id}", response_model=SnapshotPublic)
def update_snapshot_endpoint(
    *,
    session: Session = Depends(get_db),
    current_user: CurrentUser,
    snapshot_id: uuid.UUID,
    snapshot_update: SnapshotUpdate,
) -> Any:
    """Update snapshot"""
    snapshot = get_snapshot(session=session, snapshot_id=snapshot_id)
    if not snapshot:
        raise HTTPException(status_code=404, detail="Snapshot not found")
    
    # Check project ownership
    project = get_project(session=session, project_id=snapshot.project_id)
    if not project or project.owner_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not enough permissions")
    
    snapshot = update_snapshot(session=session, snapshot=snapshot, snapshot_update=snapshot_update)
    return snapshot


@router.delete("/snapshots/{snapshot_id}", response_model=Message)
def delete_snapshot_endpoint(
    *, session: Session = Depends(get_db), current_user: CurrentUser, snapshot_id: uuid.UUID
) -> Any:
    """Delete snapshot"""
    snapshot = get_snapshot(session=session, snapshot_id=snapshot_id)
    if not snapshot:
        raise HTTPException(status_code=404, detail="Snapshot not found")
    
    # Check project ownership  
    project = get_project(session=session, project_id=snapshot.project_id)
    if not project or project.owner_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not enough permissions")
    
    delete_snapshot(session=session, snapshot=snapshot)
    return Message(message="Snapshot deleted successfully") 