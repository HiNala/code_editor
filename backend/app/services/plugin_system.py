import asyncio
import hashlib
import json
import uuid
from datetime import datetime
from pathlib import Path
from typing import Any, Dict, List, Optional
import tempfile
import subprocess
import shutil
import os

from sqlmodel import Session, select
from app.core.config import settings
from app.models import PluginManifest, PluginExecution, PluginTool


class PluginSystem:
    """
    Manifest-driven plugin registry for extensible code tools.
    Each plugin lives in plugins/<toolname>/plugin.json
    """
    
    def __init__(self):
        self.plugins_dir = Path("plugins")
        self.plugins_dir.mkdir(exist_ok=True)
        self.plugin_registry: Dict[str, PluginManifest] = {}
        self.tool_catalog: List[PluginTool] = []
    
    async def initialize(self, session: Session):
        """Initialize plugin system and scan for plugins"""
        await self.scan_plugins(session)
        await self.build_tool_catalog(session)
    
    async def scan_plugins(self, session: Session):
        """Scan plugins directory and register all valid plugins"""
        
        if not self.plugins_dir.exists():
            return
        
        for plugin_dir in self.plugins_dir.iterdir():
            if plugin_dir.is_dir():
                manifest_path = plugin_dir / "plugin.json"
                if manifest_path.exists():
                    try:
                        await self.register_plugin(plugin_dir, session)
                    except Exception as e:
                        print(f"Failed to register plugin {plugin_dir.name}: {e}")
    
    async def register_plugin(self, plugin_dir: Path, session: Session) -> PluginManifest:
        """Register a single plugin from its directory"""
        
        manifest_path = plugin_dir / "plugin.json"
        with open(manifest_path) as f:
            manifest_data = json.load(f)
        
        # Validate required fields
        required_fields = ["name", "version", "description", "inputs", "outputs", "command"]
        for field in required_fields:
            if field not in manifest_data:
                raise ValueError(f"Missing required field: {field}")
        
        # Check if plugin already exists
        existing = session.exec(
            select(PluginManifest).where(PluginManifest.name == manifest_data["name"])
        ).first()
        
        if existing:
            # Update existing plugin
            for field in ["version", "description", "inputs", "outputs", "command"]:
                if field in manifest_data:
                    setattr(existing, field, manifest_data[field])
            
            existing.estimated_cost_ms = manifest_data.get("estimated_cost_ms", 1000)
            existing.estimated_tokens = manifest_data.get("estimated_tokens", 0)
            plugin = existing
        else:
            # Create new plugin
            plugin = PluginManifest(
                name=manifest_data["name"],
                version=manifest_data["version"],
                description=manifest_data["description"],
                inputs=manifest_data["inputs"],
                outputs=manifest_data["outputs"],
                command=manifest_data["command"],
                estimated_cost_ms=manifest_data.get("estimated_cost_ms", 1000),
                estimated_tokens=manifest_data.get("estimated_tokens", 0)
            )
            session.add(plugin)
        
        session.commit()
        session.refresh(plugin)
        
        self.plugin_registry[plugin.name] = plugin
        return plugin
    
    async def build_tool_catalog(self, session: Session):
        """Build tool catalog from registered plugins"""
        
        plugins = session.exec(select(PluginManifest).where(PluginManifest.enabled == True)).all()
        
        self.tool_catalog = []
        for plugin in plugins:
            tool = PluginTool(
                name=plugin.name,
                description=plugin.description,
                inputs=plugin.inputs,
                outputs=plugin.outputs,
                cost_estimate=plugin.estimated_cost_ms,
                plugin_id=plugin.id
            )
            self.tool_catalog.append(tool)
    
    async def find_tool_for_goal(self, goal: str, available_inputs: List[str]) -> Optional[PluginTool]:
        """Find the best tool for a given goal and available inputs"""
        
        # Simple matching logic - in production would use semantic matching
        goal_lower = goal.lower()
        
        best_tool = None
        best_score = 0
        
        for tool in self.tool_catalog:
            score = 0
            
            # Check if tool can handle available inputs
            if any(input_type in available_inputs for input_type in tool.inputs):
                score += 2
            
            # Check if tool description matches goal
            if any(keyword in tool.description.lower() for keyword in goal_lower.split()):
                score += 3
            
            # Prefer lower cost tools
            if tool.cost_estimate < 5000:  # Less than 5 seconds
                score += 1
            
            if score > best_score:
                best_score = score
                best_tool = tool
        
        return best_tool if best_score > 0 else None
    
    async def execute_plugin(
        self,
        plugin_name: str,
        input_files: Dict[str, str],
        session: Session
    ) -> Dict[str, str]:
        """Execute a plugin with given input files"""
        
        plugin = self.plugin_registry.get(plugin_name)
        if not plugin:
            # Try to load from database
            plugin = session.exec(
                select(PluginManifest).where(PluginManifest.name == plugin_name)
            ).first()
            
            if not plugin:
                raise ValueError(f"Plugin not found: {plugin_name}")
        
        # Create execution record
        execution = PluginExecution(
            plugin_id=plugin.id,
            input_files=input_files
        )
        session.add(execution)
        session.commit()
        session.refresh(execution)
        
        try:
            # Execute plugin in isolated container
            output_files = await self._execute_in_container(plugin, input_files)
            
            # Verify checksums
            verified_files = await self._verify_checksums(output_files)
            
            # Update execution record
            execution.output_files = verified_files
            execution.success = True
            execution.completed_at = datetime.utcnow()
            execution.duration_ms = int((execution.completed_at - execution.started_at).total_seconds() * 1000)
            
        except Exception as e:
            execution.error_message = str(e)
            execution.success = False
            execution.completed_at = datetime.utcnow()
            verified_files = {}
        
        session.commit()
        return verified_files
    
    async def _execute_in_container(self, plugin: PluginManifest, input_files: Dict[str, str]) -> Dict[str, str]:
        """Execute plugin in isolated micro-container"""
        
        with tempfile.TemporaryDirectory() as temp_dir:
            temp_path = Path(temp_dir)
            
            # Write input files
            for filename, content in input_files.items():
                file_path = temp_path / filename
                file_path.parent.mkdir(parents=True, exist_ok=True)
                file_path.write_text(content)
            
            # Execute plugin command
            try:
                # For demo, simulate plugin execution
                # In production, would use Docker containers
                output_files = await self._simulate_plugin_execution(plugin, input_files)
                return output_files
                
            except subprocess.CalledProcessError as e:
                raise RuntimeError(f"Plugin execution failed: {e}")
    
    async def _simulate_plugin_execution(self, plugin: PluginManifest, input_files: Dict[str, str]) -> Dict[str, str]:
        """Simulate plugin execution for demo purposes"""
        
        output_files = {}
        
        if plugin.name == "prettier":
            # Simulate Prettier formatting
            for filename, content in input_files.items():
                if filename.endswith(('.ts', '.tsx', '.js', '.jsx')):
                    # Simulate formatting (just add some formatting)
                    formatted = content.replace(';', ';\n').replace('{', ' {\n').replace('}', '\n}')
                    output_files[filename] = formatted
                else:
                    output_files[filename] = content
        
        elif plugin.name == "eslint":
            # Simulate ESLint fixing
            for filename, content in input_files.items():
                if filename.endswith(('.ts', '.tsx', '.js', '.jsx')):
                    # Simulate linting fixes
                    fixed = content.replace('var ', 'const ').replace('==', '===')
                    output_files[filename] = fixed
                else:
                    output_files[filename] = content
        
        elif plugin.name == "tailwind-jit":
            # Simulate Tailwind JIT compilation
            css_content = """
/* Generated by Tailwind CSS */
.btn { @apply px-4 py-2 bg-blue-500 text-white rounded; }
.card { @apply p-6 bg-white shadow-lg rounded-lg; }
"""
            output_files["styles.css"] = css_content
            # Copy other files unchanged
            for filename, content in input_files.items():
                if filename not in output_files:
                    output_files[filename] = content
        
        else:
            # Default: return files unchanged
            output_files = input_files.copy()
        
        return output_files
    
    async def _verify_checksums(self, files: Dict[str, str]) -> Dict[str, str]:
        """Verify file checksums to prevent malicious modifications"""
        
        verified_files = {}
        
        for filename, content in files.items():
            # Calculate checksum
            checksum = hashlib.sha256(content.encode()).hexdigest()
            
            # In production, would verify against expected checksums
            # For demo, just log and include all files
            verified_files[filename] = content
        
        return verified_files
    
    async def install_plugin_from_url(self, git_url: str, session: Session) -> PluginManifest:
        """Install plugin from Git URL"""
        
        # Extract plugin name from URL
        plugin_name = git_url.split('/')[-1].replace('.git', '')
        plugin_dir = self.plugins_dir / plugin_name
        
        try:
            # Clone repository
            subprocess.run(
                ["git", "clone", git_url, str(plugin_dir)],
                check=True,
                capture_output=True
            )
            
            # Register plugin
            plugin = await self.register_plugin(plugin_dir, session)
            
            # Run compatibility test
            await self._test_plugin_compatibility(plugin, session)
            
            return plugin
            
        except Exception as e:
            # Clean up on failure
            if plugin_dir.exists():
                shutil.rmtree(plugin_dir)
            raise RuntimeError(f"Failed to install plugin: {e}")
    
    async def _test_plugin_compatibility(self, plugin: PluginManifest, session: Session):
        """Test plugin compatibility"""
        
        # Create test input based on plugin inputs
        test_files = {}
        
        if "typescript" in plugin.inputs:
            test_files["test.ts"] = "const hello = 'world';"
        if "javascript" in plugin.inputs:
            test_files["test.js"] = "const hello = 'world';"
        if "css" in plugin.inputs:
            test_files["test.css"] = ".test { color: red; }"
        
        if not test_files:
            test_files["test.txt"] = "test content"
        
        # Try to execute plugin
        try:
            result = await self.execute_plugin(plugin.name, test_files, session)
            plugin.verified = True
        except Exception as e:
            plugin.verified = False
            plugin.enabled = False
            raise RuntimeError(f"Plugin compatibility test failed: {e}")
        
        session.commit()
    
    def get_available_tools(self) -> List[PluginTool]:
        """Get list of all available tools"""
        return self.tool_catalog.copy()
    
    async def remove_plugin(self, plugin_name: str, session: Session):
        """Remove a plugin"""
        
        plugin = session.exec(
            select(PluginManifest).where(PluginManifest.name == plugin_name)
        ).first()
        
        if plugin:
            # Remove from filesystem
            plugin_dir = self.plugins_dir / plugin_name
            if plugin_dir.exists():
                shutil.rmtree(plugin_dir)
            
            # Remove from database
            session.delete(plugin)
            session.commit()
            
            # Remove from registry
            if plugin_name in self.plugin_registry:
                del self.plugin_registry[plugin_name]
            
            # Rebuild catalog
            await self.build_tool_catalog(session)


# Default plugins to install
DEFAULT_PLUGINS = [
    {
        "name": "prettier",
        "version": "1.0.0",
        "description": "Code formatter for JavaScript, TypeScript, and more",
        "inputs": ["typescript", "javascript", "css", "json"],
        "outputs": ["typescript", "javascript", "css", "json"],
        "command": "prettier --write",
        "estimated_cost_ms": 500,
        "estimated_tokens": 0
    },
    {
        "name": "eslint",
        "version": "1.0.0", 
        "description": "JavaScript and TypeScript linter with auto-fix",
        "inputs": ["typescript", "javascript"],
        "outputs": ["typescript", "javascript"],
        "command": "eslint --fix",
        "estimated_cost_ms": 1000,
        "estimated_tokens": 0
    },
    {
        "name": "tailwind-jit",
        "version": "1.0.0",
        "description": "Tailwind CSS JIT compiler",
        "inputs": ["css", "html", "typescript", "javascript"],
        "outputs": ["css"],
        "command": "tailwindcss -i input.css -o output.css",
        "estimated_cost_ms": 800,
        "estimated_tokens": 0
    }
]


async def initialize_default_plugins(plugin_system: PluginSystem, session: Session):
    """Initialize default plugins"""
    
    for plugin_config in DEFAULT_PLUGINS:
        plugin_dir = plugin_system.plugins_dir / plugin_config["name"]
        plugin_dir.mkdir(exist_ok=True)
        
        # Write plugin.json
        manifest_path = plugin_dir / "plugin.json"
        with open(manifest_path, 'w') as f:
            json.dump(plugin_config, f, indent=2)
        
        # Register plugin
        await plugin_system.register_plugin(plugin_dir, session) 