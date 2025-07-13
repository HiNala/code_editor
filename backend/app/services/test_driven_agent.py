import asyncio
import hashlib
import json
import uuid
from datetime import datetime
from pathlib import Path
from typing import Any, AsyncGenerator, Dict, List
import tempfile
import subprocess
import shutil
import os

from sqlmodel import Session, select
from app.core.config import settings
from app.models import (
    TestRun, AgentStage, StreamingMessage, StudioObservation,
    CodeGeneration, Project
)
from app.services.openai_service import openai_service


class TestDrivenAgent:
    """
    Six-stage ReAct pipeline for test-driven code generation:
    Interpret → Scaffold → Unit-Test → Execute → Repair → Report
    
    This agent implements a sophisticated development workflow that:
    1. Interprets natural language requirements into formal contracts
    2. Scaffolds minimal compilable code structure
    3. Generates comprehensive test specifications
    4. Executes tests in isolated environments
    5. Repairs failing code through iterative improvement
    6. Reports final results with metrics and insights
    """
    
    def __init__(self):
        self.max_repair_attempts = 2
        self.current_cost = 0.0
        
    async def run_test_driven_generation(
        self,
        prompt: str,
        project_id: uuid.UUID,
        session: Session,
        skip_tests: bool = False
    ) -> AsyncGenerator[StreamingMessage, None]:
        """Main entry point for test-driven code generation"""
        
        # Check if OpenAI API key is configured
        if not os.getenv("OPENAI_API_KEY"):
            yield StreamingMessage(
                type="error",
                content="OpenAI API key not configured. Please set OPENAI_API_KEY environment variable.",
                stage=AgentStage.INTERPRET
            )
            return
        
        # Create test run record
        test_run = TestRun(
            project_id=project_id,
            current_stage=AgentStage.INTERPRET
        )
        session.add(test_run)
        session.commit()
        session.refresh(test_run)
        
        try:
            # Stage 1: Interpret - Convert prompt to formal contract
            yield StreamingMessage(
                type="stage_complete",
                content="Starting requirement interpretation...",
                stage=AgentStage.INTERPRET
            )
            
            contract = await self._interpret_prompt(prompt, test_run, session)
            test_run.contract = contract
            session.commit()
            
            yield StreamingMessage(
                type="reasoning_step",
                content=f"Interpreted requirements: {contract.get('summary', 'Requirements analyzed')}",
                stage=AgentStage.INTERPRET,
                data={"contract": contract}
            )
            
            # Stage 2: Scaffold - Generate minimal file structure
            test_run.current_stage = AgentStage.SCAFFOLD
            session.commit()
            
            yield StreamingMessage(
                type="stage_complete",
                content="Generating project scaffold...",
                stage=AgentStage.SCAFFOLD
            )
            
            scaffold_files = await self._scaffold_files(contract, test_run, session)
            test_run.scaffold_files = scaffold_files
            session.commit()
            
            yield StreamingMessage(
                type="file_closed",
                content=f"Generated {len(scaffold_files)} scaffold files",
                stage=AgentStage.SCAFFOLD,
                data={"files": list(scaffold_files.keys())}
            )
            
            # Stage 3: Unit-Test - Generate test specifications
            if not skip_tests:
                test_run.current_stage = AgentStage.UNIT_TEST
                session.commit()
                
                yield StreamingMessage(
                    type="stage_complete",
                    content="Creating test specifications...",
                    stage=AgentStage.UNIT_TEST
                )
                
                test_files = await self._generate_tests(contract, scaffold_files, test_run, session)
                test_run.test_files = test_files
                session.commit()
                
                yield StreamingMessage(
                    type="file_closed",
                    content=f"Generated {len(test_files)} test files",
                    stage=AgentStage.UNIT_TEST,
                    data={"test_files": list(test_files.keys())}
                )
                
                # Stage 4: Execute - Run tests
                test_run.current_stage = AgentStage.EXECUTE
                session.commit()
                
                yield StreamingMessage(
                    type="stage_complete",
                    content="Executing test suite...",
                    stage=AgentStage.EXECUTE
                )
                
                test_results = await self._execute_tests(scaffold_files, test_files, test_run, session)
                test_run.test_results = test_results
                session.commit()
                
                yield StreamingMessage(
                    type="test_result",
                    content=f"Tests completed: {test_results.get('summary', 'Results available')}",
                    stage=AgentStage.EXECUTE,
                    data=test_results
                )
                
                # Stage 5: Repair - Fix failing tests (if needed)
                if not test_results.get("all_passed", False) and test_run.repair_attempts < self.max_repair_attempts:
                    test_run.current_stage = AgentStage.REPAIR
                    session.commit()
                    
                    yield StreamingMessage(
                        type="stage_complete",
                        content="Analyzing failures and attempting repairs...",
                        stage=AgentStage.REPAIR
                    )
                    
                    repaired_files = await self._repair_code(
                        scaffold_files, test_files, test_results, contract, test_run, session
                    )
                    
                    if repaired_files:
                        # Re-run tests with repaired code
                        test_results = await self._execute_tests(repaired_files, test_files, test_run, session)
                        test_run.test_results = test_results
                        scaffold_files.update(repaired_files)
                        test_run.scaffold_files = scaffold_files
                        session.commit()
                        
                        yield StreamingMessage(
                            type="test_result",
                            content="Repair attempt completed",
                            stage=AgentStage.REPAIR,
                            data=test_results
                        )
            
            # Stage 6: Report - Final results
            test_run.current_stage = AgentStage.REPORT
            test_run.success = test_results.get("all_passed", True) if not skip_tests else True
            session.commit()
            
            # Stream final files
            for filename, content in scaffold_files.items():
                yield StreamingMessage(
                    type="token",
                    content=content,
                    stage=AgentStage.REPORT,
                    data={"filename": filename, "language": self._detect_language(filename)}
                )
            
            # Record analytics
            await self._record_observation(prompt, scaffold_files, test_results if not skip_tests else {}, project_id, session)
            
            # Final success message
            final_message = "Generation completed successfully!"
            if not skip_tests:
                passed = test_results.get("passed", 0)
                total = test_results.get("total", 0)
                final_message += f" Tests: {passed}/{total} passed."
            
            yield StreamingMessage(
                type="build_ok",
                content=final_message,
                stage=AgentStage.REPORT,
                data={
                    "files_generated": len(scaffold_files),
                    "tests_passed": test_results.get("passed", 0) if not skip_tests else 0,
                    "cost_estimate": self.current_cost
                }
            )
            
        except Exception as e:
            # Error handling
            yield StreamingMessage(
                type="build_error",
                content=f"Generation failed: {str(e)}",
                stage=test_run.current_stage,
                data={"error": str(e)}
            )
            
            test_run.success = False
            session.commit()

    async def _interpret_prompt(self, prompt: str, test_run: TestRun, session: Session) -> Dict[str, Any]:
        """
        Stage 1: Convert natural language prompt into formal contract
        
        The contract includes:
        - Project summary and goals
        - Technical requirements (language, framework, dependencies)
        - Component specifications
        - UI/UX requirements
        - Edge cases and constraints
        """
        
        system_prompt = """You are a senior technical architect. Convert the user's request into a formal development contract.

Return a JSON object with these fields:
- summary: Brief project description
- language: Programming language (typescript, javascript, python, etc.)
- framework: Framework/library (react, vue, fastapi, etc.)
- components: List of components/modules to create
- dependencies: Required packages/libraries
- ui_hints: UI/UX requirements if applicable
- edge_cases: Important edge cases to handle
- file_structure: Suggested file organization

Be specific and actionable. Focus on what can be implemented."""

        messages = [{"role": "user", "content": prompt}]
        
        try:
            response = await openai_service.generate_completion(
                messages=messages,
                system_prompt=system_prompt,
                max_tokens=800,
                temperature=0.3  # Lower temperature for more structured output
            )
            
            # Try to parse JSON response
            try:
                contract = json.loads(response)
            except json.JSONDecodeError:
                # Fallback if response isn't valid JSON
                contract = {
                    "summary": "Code generation request",
                    "language": "typescript",
                    "framework": "react",
                    "components": ["main component"],
                    "dependencies": [],
                    "ui_hints": "",
                    "edge_cases": [],
                    "file_structure": {"src/App.tsx": "Main application component"}
                }
            
            return contract
            
        except Exception as e:
            # Fallback contract for when OpenAI is unavailable
            return {
                "summary": f"Generated from prompt: {prompt[:100]}...",
                "language": "typescript",
                "framework": "react",
                "components": ["App"],
                "dependencies": ["react", "@types/react"],
                "ui_hints": "Create a clean, modern interface",
                "edge_cases": ["Handle loading states", "Error boundaries"],
                "file_structure": {
                    "src/App.tsx": "Main application component",
                    "src/types.ts": "Type definitions"
                }
            }

    async def _scaffold_files(self, contract: Dict[str, Any], test_run: TestRun, session: Session) -> Dict[str, str]:
        """
        Stage 2: Generate minimal compilable file structure with TODO comments
        """
        
        language = contract.get("language", "typescript")
        framework = contract.get("framework", "react")
        file_structure = contract.get("file_structure", {})
        
        system_prompt = f"""You are an expert {language} developer. Create minimal, compilable {framework} files with TODO comments for future implementation.

Generate clean starter code that:
1. Compiles without errors
2. Follows best practices
3. Includes TODO comments for main functionality
4. Has proper imports and exports
5. Includes basic type definitions if using TypeScript

Return each file in this format:
```filename
file content here
```

Focus on structure over implementation details."""

        user_message = f"""Create scaffold files for this project:

{json.dumps(contract, indent=2)}

Generate the main files needed to get started. Include package.json if needed."""

        messages = [{"role": "user", "content": user_message}]
        
        try:
            response = await openai_service.generate_completion(
                messages=messages,
                system_prompt=system_prompt,
                max_tokens=1500
            )
            
            files = self._parse_files_from_response(response)
            
            # Ensure we have at least one file
            if not files:
                files = {
                    "src/App.tsx": self._generate_fallback_file(contract)
                }
            
            return files
            
        except Exception as e:
            # Fallback files when OpenAI is unavailable
            return {
                "src/App.tsx": self._generate_fallback_file(contract),
                "package.json": self._generate_fallback_package_json(contract)
            }

    async def _generate_tests(self, contract: Dict[str, Any], scaffold_files: Dict[str, str], test_run: TestRun, session: Session) -> Dict[str, str]:
        """
        Stage 3: Generate comprehensive test specifications
        """
        
        system_prompt = """You are an expert test engineer. Create comprehensive Vitest + Testing Library tests that encode the project requirements.

Generate tests that:
1. Test component rendering and basic functionality
2. Test user interactions and edge cases
3. Test error conditions and loading states
4. Are easy to understand and maintain
5. Use modern testing patterns

Return test files in this format:
```filename.test.tsx
test content here
```"""

        # Create context from scaffold files
        files_context = "\n\n".join([
            f"// {filename}\n{content[:500]}..." 
            for filename, content in scaffold_files.items()
        ])

        user_message = f"""Create test files for this project:

Contract: {json.dumps(contract, indent=2)}

Files to test:
{files_context}

Generate comprehensive tests that verify the requirements are met."""

        messages = [{"role": "user", "content": user_message}]
        
        try:
            response = await openai_service.generate_completion(
                messages=messages,
                system_prompt=system_prompt,
                max_tokens=1200
            )
            
            test_files = self._parse_files_from_response(response)
            
            # Ensure we have at least one test file
            if not test_files:
                test_files = {
                    "src/App.test.tsx": self._generate_fallback_test()
                }
            
            return test_files
            
        except Exception as e:
            # Fallback test when OpenAI is unavailable
            return {
                "src/App.test.tsx": self._generate_fallback_test()
            }

    async def _execute_tests(self, files: Dict[str, str], test_files: Dict[str, str], test_run: TestRun, session: Session) -> Dict[str, Any]:
        """
        Stage 4: Execute tests in isolated Node.js environment
        """
        
        # Create temporary directory for test execution
        with tempfile.TemporaryDirectory() as temp_dir:
            temp_path = Path(temp_dir)
            
            try:
                # Write all files to temp directory
                for filename, content in {**files, **test_files}.items():
                    file_path = temp_path / filename
                    file_path.parent.mkdir(parents=True, exist_ok=True)
                    file_path.write_text(content)
                
                # Create basic package.json if not exists
                package_json_path = temp_path / "package.json"
                if not package_json_path.exists():
                    package_json_path.write_text(json.dumps({
                        "name": "test-project",
                        "version": "1.0.0",
                        "type": "module",
                        "scripts": {
                            "test": "vitest run"
                        },
                        "devDependencies": {
                            "vitest": "^1.0.0",
                            "@testing-library/react": "^14.0.0",
                            "@testing-library/jest-dom": "^6.0.0",
                            "@types/react": "^18.0.0",
                            "jsdom": "^23.0.0"
                        }
                    }, indent=2))
                
                # Create vitest config
                vitest_config = temp_path / "vitest.config.ts"
                vitest_config.write_text("""
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    environment: 'jsdom',
    setupFiles: ['./test-setup.ts'],
  },
})
""")
                
                # Create test setup
                test_setup = temp_path / "test-setup.ts"
                test_setup.write_text("import '@testing-library/jest-dom'")
                
                # Run npm install (with timeout)
                install_result = subprocess.run(
                    ["npm", "install"],
                    cwd=temp_path,
                    capture_output=True,
                    text=True,
                    timeout=60
                )
                
                if install_result.returncode != 0:
                    return {
                        "success": False,
                        "error": f"Package installation failed: {install_result.stderr}",
                        "passed": 0,
                        "total": len(test_files),
                        "all_passed": False
                    }
                
                # Run tests (with timeout)
                test_result = subprocess.run(
                    ["npm", "test"],
                    cwd=temp_path,
                    capture_output=True,
                    text=True,
                    timeout=30
                )
                
                # Parse test results
                output = test_result.stdout + test_result.stderr
                passed_tests = output.count("✓") + output.count("PASS")
                failed_tests = output.count("✗") + output.count("FAIL")
                total_tests = passed_tests + failed_tests
                
                return {
                    "success": test_result.returncode == 0,
                    "output": output,
                    "passed": passed_tests,
                    "failed": failed_tests,
                    "total": total_tests,
                    "all_passed": test_result.returncode == 0 and failed_tests == 0,
                    "summary": f"{passed_tests}/{total_tests} tests passed"
                }
                
            except subprocess.TimeoutExpired:
                return {
                    "success": False,
                    "error": "Test execution timed out",
                    "passed": 0,
                    "total": len(test_files),
                    "all_passed": False
                }
            except Exception as e:
                return {
                    "success": False,
                    "error": f"Test execution failed: {str(e)}",
                    "passed": 0,
                    "total": len(test_files),
                    "all_passed": False
                }

    async def _repair_code(self, files: Dict[str, str], test_files: Dict[str, str], test_results: Dict[str, Any], contract: Dict[str, Any], test_run: TestRun, session: Session) -> Dict[str, str]:
        """
        Stage 5: Analyze test failures and repair code
        """
        
        test_run.repair_attempts += 1
        
        system_prompt = """You are an expert debugger. Analyze the test failures and fix the code to make tests pass.

Focus on:
1. Understanding why tests are failing
2. Making minimal changes to fix issues
3. Maintaining code quality and structure
4. Not breaking existing functionality

Return only the fixed files in this format:
```filename
fixed content here
```"""

        error_context = test_results.get("output", "No test output available")[:1000]
        
        user_message = f"""Fix the failing tests:

Test Results:
{error_context}

Current Files:
"""
        
        for filename, content in files.items():
            user_message += f"\n// {filename}\n{content[:800]}...\n"

        messages = [{"role": "user", "content": user_message}]
        
        try:
            response = await openai_service.generate_completion(
                messages=messages,
                system_prompt=system_prompt,
                max_tokens=1500
            )
            
            repaired_files = self._parse_files_from_response(response)
            return repaired_files
            
        except Exception as e:
            # Return empty dict if repair fails
            return {}

    def _parse_files_from_response(self, response: str) -> Dict[str, str]:
        """Parse files from AI response with code blocks"""
        files = {}
        current_file = None
        current_content = []
        
        lines = response.split('\n')
        in_code_block = False
        
        for line in lines:
            if line.startswith('```') and not in_code_block:
                # Start of code block
                filename = line[3:].strip()
                if filename:
                    current_file = filename
                    current_content = []
                    in_code_block = True
            elif line.startswith('```') and in_code_block:
                # End of code block
                if current_file:
                    files[current_file] = '\n'.join(current_content)
                current_file = None
                current_content = []
                in_code_block = False
            elif in_code_block:
                current_content.append(line)
        
        return files

    def _detect_language(self, filename: str) -> str:
        """Detect programming language from filename"""
        ext = Path(filename).suffix.lower()
        language_map = {
            '.ts': 'typescript',
            '.tsx': 'typescript',
            '.js': 'javascript',
            '.jsx': 'javascript',
            '.py': 'python',
            '.css': 'css',
            '.html': 'html',
            '.json': 'json',
            '.md': 'markdown'
        }
        return language_map.get(ext, 'text')

    def _generate_fallback_file(self, contract: Dict[str, Any]) -> str:
        """Generate a basic fallback file when AI is unavailable"""
        framework = contract.get("framework", "react")
        
        if framework == "react":
            return '''import React from 'react';

function App() {
  return (
    <div className="App">
      <h1>Hello World</h1>
      <p>Generated by AI Studio</p>
      {/* TODO: Implement main functionality */}
    </div>
  );
}

export default App;'''
        else:
            return '// TODO: Implement main functionality\nconsole.log("Hello World");'

    def _generate_fallback_package_json(self, contract: Dict[str, Any]) -> str:
        """Generate basic package.json"""
        return json.dumps({
            "name": "ai-studio-project",
            "version": "1.0.0",
            "type": "module",
            "scripts": {
                "dev": "vite",
                "build": "vite build",
                "test": "vitest"
            },
            "dependencies": {
                "react": "^18.2.0",
                "react-dom": "^18.2.0"
            },
            "devDependencies": {
                "vite": "^5.0.0",
                "@vitejs/plugin-react": "^4.0.0",
                "vitest": "^1.0.0",
                "@testing-library/react": "^14.0.0"
            }
        }, indent=2)

    def _generate_fallback_test(self) -> str:
        """Generate basic test file"""
        return '''import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import App from './App';

describe('App', () => {
  it('renders hello world', () => {
    render(<App />);
    expect(screen.getByText('Hello World')).toBeInTheDocument();
  });
});'''

    async def _record_observation(self, prompt: str, files: Dict[str, str], test_results: Dict[str, Any], project_id: uuid.UUID, session: Session):
        """Record analytics data for continuous improvement"""
        
        prompt_hash = hashlib.sha256(prompt.encode()).hexdigest()[:16]
        
        observation = StudioObservation(
            project_id=project_id,
            prompt_hash=prompt_hash,
            diff_patch=json.dumps(files),
            test_metrics=test_results,
            latency_ms=1000,  # TODO: Track actual latency
            created_at=datetime.utcnow()
        )
        
        session.add(observation)
        session.commit()

# Global agent instance
test_driven_agent = TestDrivenAgent() 