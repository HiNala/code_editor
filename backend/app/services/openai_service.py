import re
import json
import asyncio
from typing import AsyncGenerator, Dict, Any
from openai import AsyncOpenAI

from app.core.config import settings
from app.models import StreamingMessage


class OpenAIService:
    def __init__(self):
        if not settings.OPENAI_API_KEY or settings.OPENAI_API_KEY == "changethis":
            print("Warning: OPENAI_API_KEY is not configured properly. AI features will be disabled.")
            self.client = None
        else:
            self.client = AsyncOpenAI(api_key=settings.OPENAI_API_KEY)
        
    async def generate_code_stream(
        self, 
        prompt: str, 
        context: str = ""
    ) -> AsyncGenerator[StreamingMessage, None]:
        """
        Generate code based on a prompt with streaming support.
        Parses fenced code blocks and yields structured messages.
        """
        if self.client is None:
            yield StreamingMessage(
                type="error",
                content="OpenAI API key not configured. Please set OPENAI_API_KEY to use AI features.",
                stream_metadata={}
            )
            return
        
        system_prompt = """
You are an expert React/TypeScript developer. Create modern, functional React components with TypeScript.

Requirements:
- Use TypeScript with proper type definitions
- Use modern React hooks (useState, useEffect, etc.)
- Use Tailwind CSS for styling
- Make components responsive and accessible
- Include proper error handling
- Use ESLint/Prettier compatible code style

For each file, use this format:
```tsx path=src/ComponentName.tsx
// Your code here
```

Or for other file types:
```css path=src/styles.css
/* Your CSS here */
```

Always include the path attribute in the code fence.
"""
        
        user_prompt = f"""
{context}

User request: {prompt}

Generate a complete, working React component that fulfills this request.
"""
        
        try:
            response = await self.client.chat.completions.create(
                model="gpt-4o-mini",
                messages=[
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": user_prompt}
                ],
                stream=True,
                temperature=0.7,
                max_tokens=4000,
            )
            
            current_file = None
            current_content = ""
            code_block_pattern = r'```(\w+)?\s*(?:path=([^\s]+))?\s*\n'
            
            async for chunk in response:
                if chunk.choices[0].delta.content:
                    content = chunk.choices[0].delta.content
                    
                    # Check for code block start
                    match = re.search(code_block_pattern, content)
                    if match:
                        # If we were building a file, yield it first
                        if current_file and current_content.strip():
                            yield StreamingMessage(
                                type="file",
                                filename=current_file,
                                content=current_content.strip()
                            )
                        
                        # Start new file
                        current_file = match.group(2) if match.group(2) else "src/Component.tsx"
                        current_content = ""
                        
                        yield StreamingMessage(
                            type="status",
                            content=f"Generating {current_file}..."
                        )
                        continue
                    
                    # Check for code block end
                    if content.strip() == "```" and current_file:
                        # End of code block - yield the complete file
                        if current_content.strip():
                            yield StreamingMessage(
                                type="file",
                                filename=current_file,
                                content=current_content.strip()
                            )
                        current_file = None
                        current_content = ""
                        continue
                    
                    # If we're inside a code block, accumulate content
                    if current_file:
                        current_content += content
                    else:
                        # Regular streaming content
                        yield StreamingMessage(
                            type="chunk",
                            content=content
                        )
            
            # Handle any remaining file content
            if current_file and current_content.strip():
                yield StreamingMessage(
                    type="file",
                    filename=current_file,
                    content=current_content.strip()
                )
            
            yield StreamingMessage(
                type="status",
                content="Generation completed"
            )
            
        except Exception as e:
            yield StreamingMessage(
                type="error",
                content=f"Error generating code: {str(e)}"
            )
    
    async def improve_code(
        self, 
        code: str, 
        improvement_request: str
    ) -> AsyncGenerator[StreamingMessage, None]:
        """
        Improve existing code based on user request.
        """
        
        system_prompt = """
You are an expert React/TypeScript developer. Improve the provided code based on the user's request.

Requirements:
- Maintain TypeScript with proper type definitions
- Use modern React patterns and hooks
- Use Tailwind CSS for styling
- Keep components responsive and accessible
- Include proper error handling
- Use ESLint/Prettier compatible code style

For each file, use this format:
```tsx path=src/ComponentName.tsx
// Your improved code here
```

Only return the files that need to be changed or added.
"""
        
        user_prompt = f"""
Current code:
{code}

Improvement request: {improvement_request}

Please improve the code based on this request.
"""
        
        try:
            response = await self.client.chat.completions.create(
                model="gpt-4o-mini",
                messages=[
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": user_prompt}
                ],
                stream=True,
                temperature=0.7,
                max_tokens=4000,
            )
            
            current_file = None
            current_content = ""
            code_block_pattern = r'```(\w+)?\s*(?:path=([^\s]+))?\s*\n'
            
            async for chunk in response:
                if chunk.choices[0].delta.content:
                    content = chunk.choices[0].delta.content
                    
                    # Check for code block start
                    match = re.search(code_block_pattern, content)
                    if match:
                        # If we were building a file, yield it first
                        if current_file and current_content.strip():
                            yield StreamingMessage(
                                type="file",
                                filename=current_file,
                                content=current_content.strip()
                            )
                        
                        # Start new file
                        current_file = match.group(2) if match.group(2) else "src/Component.tsx"
                        current_content = ""
                        
                        yield StreamingMessage(
                            type="status",
                            content=f"Improving {current_file}..."
                        )
                        continue
                    
                    # Check for code block end
                    if content.strip() == "```" and current_file:
                        # End of code block - yield the complete file
                        if current_content.strip():
                            yield StreamingMessage(
                                type="file",
                                filename=current_file,
                                content=current_content.strip()
                            )
                        current_file = None
                        current_content = ""
                        continue
                    
                    # If we're inside a code block, accumulate content
                    if current_file:
                        current_content += content
                    else:
                        # Regular streaming content
                        yield StreamingMessage(
                            type="chunk",
                            content=content
                        )
            
            # Handle any remaining file content
            if current_file and current_content.strip():
                yield StreamingMessage(
                    type="file",
                    filename=current_file,
                    content=current_content.strip()
                )
            
            yield StreamingMessage(
                type="status",
                content="Improvement completed"
            )
            
        except Exception as e:
            yield StreamingMessage(
                type="error",
                content=f"Error improving code: {str(e)}"
            )


openai_service = OpenAIService() 