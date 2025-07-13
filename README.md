# AI Code Studio - v0.dev Inspired Development Platform

> **Transform ideas into production-ready applications through conversational AI and intelligent project orchestration**

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-20232A?logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-005571?logo=fastapi)](https://fastapi.tiangolo.com/)

## 🎯 Vision

An AI-powered development studio that understands complex project requirements through conversation, creates comprehensive build plans, and executes them systematically with quality gates - transforming from "AI writes code" to "AI becomes a senior technical architect."

## ✨ Key Features

### 🏗️ **v0.dev-Inspired Architecture**
- **Workspace-First Design**: No traditional navigation - everything revolves around project context
- **Project-Centric Interface**: Brand, project selector, contextual actions in unified top bar
- **Modal-Based Settings**: Inline user preferences without separate pages
- **Floating CTAs**: v0.dev-style Generate button with hover gradient effects

### 🎨 **Professional UI/UX**
- **Tubelight Navigation**: Animated pill indicators with smooth spring transitions
- **Hover Border Gradients**: Enhanced CTAs with rotating gradient borders
- **Design System**: 4px spacing scale, semantic colors, reduced motion support
- **Responsive Layout**: Desktop/mobile optimized with proper accessibility

### 🤖 **Intelligent Code Generation**
- **Test-Driven Pipeline**: 6-stage ReAct loop (Interpret → Scaffold → Unit-Test → Execute → Repair → Report)
- **Plugin System**: Manifest-driven extensible tools (Prettier, ESLint, Tailwind JIT)
- **Real-Time Streaming**: WebSocket-based live updates with 8 coordinated message types
- **Quality Gates**: Progressive validation with compilation, testing, and security checks

### 🔄 **Advanced State Management**
- **Zustand Store**: Global state with workspace/view switching
- **File Orchestration**: Intent-based file management with modification tracking
- **Connection Monitoring**: Real-time WebSocket status with auto-reconnection
- **Session Persistence**: Project context and workspace state preservation

## 🚀 Quick Start

### Prerequisites

- **Node.js** 18+ and npm
- **Python** 3.11+ and uv
- **Docker** and Docker Compose
- **PostgreSQL** (via Docker)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/HiNala/code_editor.git
   cd code_editor
   ```

2. **Environment Setup**
   ```bash
   # Copy environment files
   cp code_editor/backend/.env.example code_editor/backend/.env
   cp code_editor/frontend/.env.example code_editor/frontend/.env
   
   # Configure your OpenAI API key in backend/.env
   OPENAI_API_KEY=your_api_key_here
   ```

3. **Start Development Environment**
   ```bash
   # Start all services with Docker Compose
   docker-compose -f code_editor/docker-compose.yml up -d
   
   # Or run frontend/backend separately for development
   cd code_editor/backend && uv run fastapi dev app/main.py
   cd code_editor/frontend && npm run dev
   ```

4. **Access the Application**
   - **Studio Interface**: http://localhost:5173/studio
   - **API Documentation**: http://localhost:8000/docs
   - **Database Admin**: http://localhost:8080 (Adminer)

## 🏛️ Architecture Overview

### Frontend Architecture
```
frontend/src/
├── components/
│   ├── studio/              # v0.dev-style workspace components
│   │   ├── StudioTopBar.tsx # Project-centric navigation
│   │   ├── WorkspaceTabs.tsx # Chat/Design + Preview/Code switching
│   │   └── UserDropdown.tsx # Modal-based settings
│   └── ui/                  # Design system components
│       ├── tubelight-navbar.tsx
│       └── hover-border-gradient.tsx
├── stores/
│   └── studioStore.ts       # Global state management
├── hooks/
│   └── useEnhancedWebSocket.ts # Real-time streaming
└── styles/
    └── globals.css          # Complete design system
```

### Backend Architecture
```
backend/app/
├── api/routes/
│   └── studio.py           # WebSocket streaming endpoints
├── services/
│   ├── test_driven_agent.py # 6-stage ReAct pipeline
│   └── plugin_system.py    # Extensible tool layer
├── models.py               # Enhanced database schema
└── crud.py                 # Database operations
```

### Technology Stack

**Frontend:**
- **React 18** + TypeScript + Vite
- **TanStack Router** + Query for routing/data
- **Zustand** for state management
- **Tailwind CSS** + **Framer Motion** for styling/animations
- **Radix UI** primitives for accessibility

**Backend:**
- **FastAPI** + SQLModel + PostgreSQL
- **WebSocket** for real-time streaming
- **OpenAI API** for code generation
- **Plugin System** with isolated execution

**Infrastructure:**
- **Docker Compose** for development
- **Traefik** reverse proxy
- **Redis** for rate limiting
- **Adminer** for database management

## 🎮 Usage Guide

### 1. **Project Creation**
- Navigate to `/studio` to start a new project
- Use the project selector in the top bar to create or switch projects
- Project context drives all UI interactions

### 2. **Workspace Navigation**
- **Chat Workspace**: Conversational interface for requirements gathering
- **Design Workspace**: Visual design tools (coming soon)
- **Preview/Code Views**: Toggle between live preview and code editor

### 3. **Code Generation**
- Use the floating Generate button (bottom-right)
- Real-time streaming shows progress through 6 pipeline stages
- Quality gates ensure code compiles and tests pass before delivery

### 4. **Plugin System**
- Access available plugins through the API
- Install new formatters/linters from Git URLs
- Automatic compatibility testing and cost estimation

## 🔧 Development

### Frontend Development
```bash
cd code_editor/frontend
npm install
npm run dev        # Start dev server
npm run build      # Production build
npm run lint       # ESLint + TypeScript check
```

### Backend Development
```bash
cd code_editor/backend
uv install         # Install dependencies
uv run fastapi dev app/main.py  # Start dev server
uv run pytest     # Run tests
```

### Database Migrations
```bash
cd code_editor/backend
uv run alembic revision --autogenerate -m "Description"
uv run alembic upgrade head
```

## 🧪 Testing

### Frontend Testing
```bash
npm run test       # Unit tests with Vitest
npm run test:e2e   # Playwright end-to-end tests
```

### Backend Testing
```bash
uv run pytest tests/           # All tests
uv run pytest tests/api/       # API tests only
uv run pytest --cov=app       # With coverage
```

## 📊 Monitoring & Observability

### Built-in Analytics
- **StudioObservation**: Tracks generation performance and quality
- **StudioInsight**: Self-healing insights with confidence scoring
- **Plugin Execution**: Tool usage analytics and cost tracking
- **WebSocket Metrics**: Connection health and message throughput

### Quality Metrics
- **Test Coverage**: Automated coverage reporting
- **Code Quality**: ESLint/Prettier integration
- **Performance**: Bundle size monitoring
- **Security**: Dependency vulnerability scanning

## 🔒 Security

### Authentication & Authorization
- **JWT-based authentication** for WebSocket connections
- **Rate limiting** (60 requests/hour) with Redis backend
- **Input sanitization** for all user-provided content
- **Plugin checksum validation** for security

### Data Protection
- **Environment variable isolation**
- **Sanitized error messages** to prevent information leakage
- **CORS configuration** for cross-origin security
- **Plugin sandboxing** for isolated execution

## 🚢 Deployment

### Production Deployment
```bash
# Build production images
docker-compose -f docker-compose.yml -f docker-compose.prod.yml build

# Deploy with environment-specific overrides
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d
```

### Environment Variables
```bash
# Backend (.env)
OPENAI_API_KEY=your_api_key_here
DATABASE_URL=postgresql://user:pass@localhost/db
REDIS_URL=redis://localhost:6379
SECRET_KEY=your_secret_key

# Frontend (.env)
VITE_API_URL=http://localhost:8000
VITE_WS_URL=ws://localhost:8000
```

## 🛣️ Roadmap

### Phase 1: Enhanced Agent Intelligence ✅
- [x] Test-driven generation pipeline
- [x] Plugin system with extensible tools
- [x] Real-time WebSocket streaming
- [x] v0.dev-inspired UI architecture

### Phase 2: Conversational Workshop (In Progress)
- [ ] Progressive discovery interface (Discover → Clarify → Commit)
- [ ] Dynamic form generation from requirements gaps
- [ ] Project charter creation and approval workflow
- [ ] Layer-by-layer enhancement system

### Phase 3: Production Orchestration
- [ ] Multi-file project generation with dependencies
- [ ] Quality gate system with compilation/testing
- [ ] Git integration with branch management
- [ ] Deployment pipeline integration

### Phase 4: Collaborative Features
- [ ] Multi-user editing with real-time collaboration
- [ ] Share links for project previews
- [ ] Team workspace management
- [ ] Advanced analytics and insights

## 🤝 Contributing

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/amazing-feature`
3. **Commit changes**: `git commit -m 'Add amazing feature'`
4. **Push to branch**: `git push origin feature/amazing-feature`
5. **Open a Pull Request**

### Development Guidelines
- Follow the existing code style and conventions
- Add tests for new functionality
- Update documentation for API changes
- Ensure all quality gates pass before submitting

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **v0.dev** for UI/UX inspiration and architectural patterns
- **Lovable.dev** for conversational development workflow concepts
- **GitHub Copilot** for AI-assisted development paradigms
- **FastAPI** and **React** communities for excellent tooling

## 📞 Support

- **Documentation**: [Project Wiki](https://github.com/HiNala/code_editor/wiki)
- **Issues**: [GitHub Issues](https://github.com/HiNala/code_editor/issues)
- **Discussions**: [GitHub Discussions](https://github.com/HiNala/code_editor/discussions)

---

**Built with ❤️ by the AI Studio Team**

*Transforming the way developers build applications through intelligent conversation and automated orchestration.*


