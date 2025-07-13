"""
OpenAI API Service for AI Studio

Provides a centralized interface for all OpenAI API interactions with
cost optimization and error handling.
"""

import os
import json
import asyncio
from typing import Dict, List, Optional, AsyncGenerator, Any
from openai import AsyncOpenAI
from pydantic import BaseModel
import logging

from ..core.config import settings

logger = logging.getLogger(__name__)

class OpenAIConfig(BaseModel):
    """OpenAI configuration with cost optimization"""
    model: str = "gpt-3.5-turbo"  # Cost-effective default
    max_tokens: int = 2000
    temperature: float = 0.7
    stream: bool = True

class OpenAIService:
    """Centralized OpenAI API service with cost optimization"""
    
    def __init__(self):
        self.client = AsyncOpenAI(
            api_key=os.getenv("OPENAI_API_KEY")
        )
        
        # Load configuration from environment with cost-effective defaults
        self.config = OpenAIConfig(
            model=os.getenv("OPENAI_MODEL", "gpt-3.5-turbo"),
            max_tokens=int(os.getenv("OPENAI_MAX_TOKENS", "2000")),
            temperature=float(os.getenv("OPENAI_TEMPERATURE", "0.7"))
        )
        
        # Test mode configuration for even lower costs
        if os.getenv("ENVIRONMENT") == "test":
            self.config.max_tokens = int(os.getenv("TEST_MAX_TOKENS", "500"))
            self.config.model = "gpt-3.5-turbo"  # Force cheapest model in test
        
        logger.info(f"OpenAI Service initialized with model: {self.config.model}")

    async def generate_completion(
        self,
        messages: List[Dict[str, str]],
        system_prompt: Optional[str] = None,
        max_tokens: Optional[int] = None,
        temperature: Optional[float] = None,
        stream: bool = False
    ) -> str:
        """Generate a single completion response"""
        
        # Prepare messages
        formatted_messages = []
        if system_prompt:
            formatted_messages.append({"role": "system", "content": system_prompt})
        formatted_messages.extend(messages)
        
        # Use provided parameters or defaults
        request_config = {
            "model": self.config.model,
            "messages": formatted_messages,
            "max_tokens": max_tokens or self.config.max_tokens,
            "temperature": temperature or self.config.temperature,
            "stream": stream
        }
        
        try:
            if stream:
                # For streaming responses
                response_chunks = []
                async for chunk in await self.client.chat.completions.create(**request_config):
                    if chunk.choices[0].delta.content:
                        response_chunks.append(chunk.choices[0].delta.content)
                return "".join(response_chunks)
            else:
                # For single responses
                response = await self.client.chat.completions.create(**request_config)
                return response.choices[0].message.content
                
        except Exception as e:
            logger.error(f"OpenAI API error: {str(e)}")
            raise

    async def stream_completion(
        self,
        messages: List[Dict[str, str]],
        system_prompt: Optional[str] = None,
        max_tokens: Optional[int] = None,
        temperature: Optional[float] = None
    ) -> AsyncGenerator[str, None]:
        """Stream completion response chunk by chunk"""
        
        # Prepare messages
        formatted_messages = []
        if system_prompt:
            formatted_messages.append({"role": "system", "content": system_prompt})
        formatted_messages.extend(messages)
        
        request_config = {
            "model": self.config.model,
            "messages": formatted_messages,
            "max_tokens": max_tokens or self.config.max_tokens,
            "temperature": temperature or self.config.temperature,
            "stream": True
        }
        
        try:
            stream = await self.client.chat.completions.create(**request_config)
            async for chunk in stream:
                if chunk.choices[0].delta.content:
                    yield chunk.choices[0].delta.content
                    
        except Exception as e:
            logger.error(f"OpenAI streaming error: {str(e)}")
            yield f"Error: {str(e)}"

    async def generate_code(
        self,
        prompt: str,
        language: str = "typescript",
        framework: str = "react",
        context: Optional[str] = None
    ) -> str:
        """Generate code with optimized prompting for cost efficiency"""
        
        system_prompt = f"""You are an expert {language} developer specializing in {framework}.
Generate clean, production-ready code that follows best practices.
Be concise but complete. Focus on the essential functionality.
"""

        user_message = f"""Generate {language} code for: {prompt}

Framework: {framework}
"""
        
        if context:
            user_message += f"\nExisting context:\n{context}"

        messages = [{"role": "user", "content": user_message}]
        
        return await self.generate_completion(
            messages=messages,
            system_prompt=system_prompt,
            max_tokens=min(self.config.max_tokens, 1500)  # Limit for code generation
        )

    async def generate_tests(
        self,
        code: str,
        framework: str = "vitest",
        language: str = "typescript"
    ) -> str:
        """Generate test cases for given code"""
        
        system_prompt = f"""You are an expert test engineer specializing in {framework}.
Generate comprehensive but concise test cases that cover the main functionality.
Focus on edge cases and error conditions.
"""

        user_message = f"""Generate {framework} tests for this {language} code:

{code}

Generate tests that:
1. Test main functionality
2. Cover edge cases
3. Test error conditions
4. Are easy to understand and maintain
"""

        messages = [{"role": "user", "content": user_message}]
        
        return await self.generate_completion(
            messages=messages,
            system_prompt=system_prompt,
            max_tokens=min(self.config.max_tokens, 1000)  # Limit for test generation
        )

    async def analyze_error(
        self,
        error_message: str,
        code: str,
        context: Optional[str] = None
    ) -> str:
        """Analyze error and suggest fixes"""
        
        system_prompt = """You are an expert debugging assistant.
Analyze the error and provide a concise explanation and fix.
Focus on the most likely cause and solution.
"""

        user_message = f"""Error: {error_message}

Code:
{code}
"""
        
        if context:
            user_message += f"\nContext: {context}"

        messages = [{"role": "user", "content": user_message}]
        
        return await self.generate_completion(
            messages=messages,
            system_prompt=system_prompt,
            max_tokens=min(self.config.max_tokens, 800)  # Limit for error analysis
        )

    async def estimate_cost(
        self,
        prompt_tokens: int,
        completion_tokens: int
    ) -> float:
        """Estimate cost for the request (approximate)"""
        
        # Approximate pricing for gpt-3.5-turbo (as of 2024)
        # These are rough estimates - actual pricing may vary
        pricing = {
            "gpt-3.5-turbo": {
                "input": 0.0015 / 1000,   # $0.0015 per 1K tokens
                "output": 0.002 / 1000    # $0.002 per 1K tokens
            },
            "gpt-4o-mini": {
                "input": 0.00015 / 1000,  # $0.00015 per 1K tokens
                "output": 0.0006 / 1000   # $0.0006 per 1K tokens
            }
        }
        
        model_pricing = pricing.get(self.config.model, pricing["gpt-3.5-turbo"])
        
        input_cost = prompt_tokens * model_pricing["input"]
        output_cost = completion_tokens * model_pricing["output"]
        
        return input_cost + output_cost

    def get_model_info(self) -> Dict[str, Any]:
        """Get current model configuration"""
        return {
            "model": self.config.model,
            "max_tokens": self.config.max_tokens,
            "temperature": self.config.temperature,
            "cost_optimized": self.config.model in ["gpt-3.5-turbo", "gpt-4o-mini"]
        }

# Global service instance
openai_service = OpenAIService()

# Convenience functions for backward compatibility
async def generate_code(prompt: str, **kwargs) -> str:
    """Generate code using the global OpenAI service"""
    return await openai_service.generate_code(prompt, **kwargs)

async def stream_code_generation(prompt: str, **kwargs) -> AsyncGenerator[str, None]:
    """Stream code generation using the global OpenAI service"""
    messages = [{"role": "user", "content": prompt}]
    async for chunk in openai_service.stream_completion(messages, **kwargs):
        yield chunk 