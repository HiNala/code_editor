# 🚀 AI Studio - Advanced Coding Environment

A powerful, AI-assisted coding environment that enables developers to build applications using natural language. Built with React, TypeScript, FastAPI, and powered by cutting-edge AI technology.

![AI Studio Interface](img/dashboard.png)

## ✨ Features

### 🤖 AI-Powered Coding Assistant
- **Natural Language Programming**: Describe what you want to build and watch AI create it
- **Intelligent Code Generation**: Create React components, functions, and entire features with simple prompts
- **Smart Code Analysis**: Get instant code reviews, bug fixes, and optimization suggestions
- **Context-Aware Help**: AI understands your project structure and provides relevant assistance

### 🗂️ Dynamic File System
- **Real-time File Management**: Create, edit, delete, and organize files dynamically
- **Project Structure**: Intelligent project scaffolding with proper folder organization
- **File Explorer**: Beautiful, responsive file browser with search and filtering
- **Auto-save**: Never lose your work with automatic file saving

### 💻 Professional Code Editor
- **Monaco Editor Integration**: Full Visual Studio Code editing experience
- **Multi-language Support**: TypeScript, JavaScript, React, HTML, CSS, and more
- **Intelligent IntelliSense**: Auto-completion, syntax highlighting, and error detection
- **Multiple Themes**: Dark mode, light mode, and high contrast options
- **Customizable Settings**: Font size, word wrap, minimap, and line numbers

### 🔄 Live Preview System
- **Real-time Updates**: See your changes instantly as you code
- **Multi-device Preview**: Test on mobile, tablet, and desktop views
- **Error Handling**: Clear error messages and debugging information
- **Console Output**: Monitor logs and debug information in real-time

### 📱 Responsive Design
- **Mobile-First**: Optimized for all screen sizes and devices
- **Touch-Friendly**: Perfect for tablets and touch devices
- **Adaptive Layout**: Intelligent panel management and workspace optimization
- **Modern UI**: Beautiful, accessible interface following design best practices

## 🛠️ Technology Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for lightning-fast development
- **TanStack Router** for type-safe routing
- **Framer Motion** for smooth animations
- **Tailwind CSS** for styling
- **Monaco Editor** for code editing
- **Radix UI** for accessible components

### Backend
- **FastAPI** with Python 3.10+
- **SQLModel** for database operations
- **PostgreSQL** for data persistence
- **Alembic** for database migrations
- **Pydantic** for data validation
- **WebSockets** for real-time communication

### Infrastructure
- **Docker** for containerization
- **Traefik** for reverse proxy
- **PostgreSQL** database
- **Redis** for caching (optional)

## 🚀 Quick Start

### Prerequisites
- Docker and Docker Compose
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd code_editor
   ```

2. **Start the application**
   ```bash
   docker compose up --build
   ```

3. **Access the application**
   - **Frontend**: http://localhost:3000
   - **Backend API**: http://localhost:8000
   - **API Documentation**: http://localhost:8000/docs

## 💡 How to Use AI Studio

### 1. Getting Started
1. Open AI Studio in your browser
2. Click "Open Studio" to enter the coding environment
3. The AI Assistant will greet you and offer help

### 2. Creating Components with AI
Use natural language to create React components:

```
Create a responsive navigation component with logo and menu items
```

```
Build a user profile card with avatar, name, and contact information
```

```
Generate a data table component with sorting and filtering
```

### 3. AI Commands
Use these powerful commands to enhance your coding:

- `/component` - Create new React components
- `/fix` - Fix bugs and issues in your code
- `/explain` - Get detailed code explanations
- `/optimize` - Optimize code for better performance
- `/test` - Generate unit tests
- `/docs` - Create documentation

### 4. File Management
- **Create Files**: Use the file explorer or ask AI to create files
- **Edit Code**: Use the powerful Monaco editor with full IntelliSense
- **Organize**: Drag and drop files, create folders, and manage your project structure
- **Search**: Quickly find files and code across your entire project

### 5. Live Preview
- **Instant Updates**: See changes as you type
- **Device Testing**: Switch between mobile, tablet, and desktop views
- **Error Handling**: Get clear feedback on issues
- **Console Monitoring**: Track logs and debug information

## 🎯 Use Cases

### For Beginners
- **Learn by Doing**: Ask AI to explain concepts and generate examples
- **Template Generation**: Get started quickly with pre-built components
- **Error Resolution**: Get help fixing bugs and understanding error messages

### For Experienced Developers
- **Rapid Prototyping**: Quickly build and test ideas
- **Code Optimization**: Get AI-powered performance improvements
- **Documentation**: Auto-generate docs and comments
- **Testing**: Create comprehensive test suites

### For Teams
- **Consistent Code Style**: AI ensures consistent patterns
- **Knowledge Sharing**: AI can explain complex code to team members
- **Onboarding**: Help new team members understand the codebase

## 🔧 Configuration

### Environment Variables
Create a `.env` file with the following variables:

```env
# Frontend
FRONTEND_HOST=http://localhost:3000

# Database
POSTGRES_SERVER=localhost
POSTGRES_PORT=5432
POSTGRES_DB=app
POSTGRES_USER=postgres
POSTGRES_PASSWORD=changethis

# Security
SECRET_KEY=changethis
FIRST_SUPERUSER=admin@example.com
FIRST_SUPERUSER_PASSWORD=changethis

# AI Services (Optional)
OPENAI_API_KEY=your_openai_key
GEMINI_API_KEY=your_gemini_key

# AWS S3 (For file storage)
AWS_ACCESS_KEY_ID=changethis
AWS_SECRET_ACCESS_KEY=changethis
AWS_REGION=us-west-2
S3_BUCKET_NAME=changethis
```

### Development Setup

1. **Frontend Development**
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

2. **Backend Development**
   ```bash
   cd backend
   pip install -r requirements.txt
   uvicorn app.main:app --reload
   ```

## 📖 API Documentation

The API documentation is automatically generated and available at:
- **Interactive Docs**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

### Key Endpoints

- `GET /api/v1/studio/projects` - List all projects
- `POST /api/v1/studio/projects` - Create new project
- `GET /api/v1/studio/files` - List project files
- `POST /api/v1/studio/files` - Create new file
- `PUT /api/v1/studio/files/{id}` - Update file content
- `DELETE /api/v1/studio/files/{id}` - Delete file

## 🧪 Testing

### Frontend Tests
```bash
cd frontend
npm run test
```

### Backend Tests
```bash
cd backend
pytest
```

### E2E Tests
```bash
cd frontend
npm run test:e2e
```

## 🚀 Deployment

### Production Build
```bash
# Build frontend
cd frontend
npm run build

# Build and deploy with Docker
docker compose -f docker-compose.yml -f docker-compose.prod.yml up --build
```

### Environment-Specific Configs
- **Development**: `docker-compose.override.yml`
- **Production**: `docker-compose.prod.yml`
- **Testing**: `docker-compose.test.yml`

## 🔒 Security

- **Authentication**: JWT-based authentication system
- **Authorization**: Role-based access control
- **Data Validation**: Comprehensive input validation with Pydantic
- **CORS**: Properly configured cross-origin resource sharing
- **Environment Variables**: Secure configuration management

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines
- Follow TypeScript/Python best practices
- Write comprehensive tests
- Update documentation
- Follow conventional commit messages

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Monaco Editor** for the incredible code editing experience
- **React** and **FastAPI** communities for excellent frameworks
- **Tailwind CSS** for beautiful, utility-first styling
- **Docker** for simplifying deployment
- **OpenAI** and **Google Gemini** for AI capabilities

## 📞 Support

- **Documentation**: Check this README and the `/docs` endpoint
- **Issues**: Report bugs and request features on GitHub
- **Community**: Join our Discord server for discussions

---

**Built with ❤️ by the AI Studio Team**

*Empowering developers to build the future with AI assistance*


