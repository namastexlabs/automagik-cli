# Automagik CLI - AI Assistant Context

## Project Overview

Automagik CLI is a sophisticated TypeScript-based command-line interface for interacting with [Automagik Hive](https://github.com/namastexlabs/automagik-hive) multi-agent AI systems. It provides both interactive terminal UI and headless execution modes for seamless integration with Automagik Hive agents, teams, and workflows.

## Architecture

### Core Framework
- **Language**: TypeScript with strict type checking
- **UI Framework**: React + Ink (terminal UI framework)
- **Package Manager**: pnpm (required, not npm)
- **Build System**: ESBuild for fast bundling
- **Node.js**: Version 20+ required

### Project Structure
```
src/
├── index.ts              # Main entry point
├── headless.ts           # CLI headless mode implementation
├── config/
│   ├── settings.ts       # Environment configuration management
│   ├── localClient.ts    # HTTP API client (primary)
│   ├── streamingClient.ts # Streaming API client
│   └── optimizedClient.ts # Performance-optimized client
├── ui/                   # React-based terminal UI
│   ├── App.tsx           # Main interactive application
│   ├── GeminiApp.tsx     # Alternative UI implementation
│   ├── components/       # Reusable UI components
│   ├── contexts/         # React context providers
│   ├── hooks/            # Custom React hooks
│   ├── themes/           # Terminal color themes
│   └── utils/            # UI utilities
└── utils/
    └── serverDetection.ts # API server discovery
```

## Key Components

### 1. Dual Interface Architecture
- **Interactive Mode**: React-based terminal UI using Ink framework
- **Headless Mode**: Direct CLI execution for automation and scripting

### 2. API Client Architecture
- **Primary Client**: `localClient.ts` - Main HTTP client using gaxios
- **Streaming Client**: Real-time event streaming with JSON parsing
- **Multi-endpoint Support**: Agents, teams, workflows via `/playground/*` endpoints

### 3. Configuration System
Environment-based configuration via `.env` files:
```bash
# All settings are optional with sensible defaults
API_BASE_URL=http://localhost:8886    # API server location
API_TIMEOUT=10000                     # 10 second timeout
SESSION_DIR=~/.automagik-cli/sessions     # Session storage location
CLI_DEBUG=false                       # Debug logging
```

## API Integration

### Endpoint Structure
The CLI expects a multi-agent API server with these endpoints:
```
GET  /api/v1/health                    # Health check
GET  /playground/agents                # List available agents
GET  /playground/teams                 # List available teams  
GET  /playground/workflows             # List available workflows
POST /playground/agents/{id}/runs      # Execute agent
POST /playground/teams/{id}/runs       # Execute team
POST /playground/workflows/{id}/runs   # Execute workflow
```

### Request Format
- Uses FormData for requests (not JSON)
- Supports streaming responses with real-time events
- Handles complex event types: tool calls, memory updates, thinking processes

### Response Handling
- Streaming JSON events parsed in real-time
- Event types: agent_start, tool_call_start, tool_call_complete, memory_update, thinking, content, run_complete
- Rich visualization of AI process states

## Development Workflow

### Build System
1. **TypeScript Compilation**: `pnpm run typecheck` - Type checking
2. **ESBuild Bundling**: `pnpm run bundle` - Creates standalone executable
3. **Development Mode**: `pnpm run dev` - Hot reload with tsx

### Testing and Quality
- **Linting**: ESLint configuration for TypeScript/React
- **Formatting**: Prettier for code formatting
- **Type Safety**: Strict TypeScript with full type coverage

### Session Management
- **Local Storage**: JSON files in `~/.automagik-cli/sessions/`
- **Auto-save**: Configurable automatic session persistence
- **Session Format**: Structured JSON with metadata, message history, timestamps

## Usage Patterns

### Interactive Mode
1. Target type selection (agent/team/workflow)
2. Specific target selection from available options
3. Session management (new/continue)
4. Real-time chat with streaming responses

### Headless Mode
```bash
automagik-cli --prompt "message" --target "id" [--session "id"] [--output format]
```

### Common Tasks
- **Development**: `pnpm run dev` for hot reload development
- **Building**: `pnpm run build` for production bundle
- **Debugging**: Set `CLI_DEBUG=true` for verbose logging
- **API Testing**: Use headless mode for automated testing

## Key Design Patterns

### 1. React Hooks for State Management
- `useLocalAPIStream`: Streaming API communication
- `useSessionContext`: Session persistence and management
- `useTerminalSize`: Responsive terminal UI

### 2. Context Providers
- `SessionContext`: Global session state management
- `StreamingContext`: Real-time streaming state

### 3. Component Architecture
- Modular React components for terminal UI
- Reusable input prompts and display components
- Theme system for customizable terminal appearance

## Environment Configuration

### Required Environment
- Node.js 20+
- pnpm package manager (not npm)
- API server running at configured URL

### Optional Configuration
All environment variables have sensible defaults and are optional:
- API connection settings (URL, timeout, retries)
- Session management (directory, auto-save, history limit)
- UI preferences (colors, spinners, display width)
- Debug and logging options

## Common Development Tasks

### Adding New Features
1. Follow React/TypeScript patterns in existing components
2. Use existing hooks for API communication and session management
3. Maintain type safety throughout
4. Update CLI argument parsing in headless.ts if needed

### Debugging Issues
1. Enable debug mode: `CLI_DEBUG=true pnpm run dev`
2. Check API server connectivity and endpoints
3. Verify session file integrity in `~/.automagik-cli/sessions/`
4. Use TypeScript compiler for type-related issues

### API Integration Changes
1. Update endpoint URLs in `localClient.ts`
2. Modify request/response handling for new event types
3. Update streaming logic in `streamingClient.ts`
4. Test both interactive and headless modes

## Dependencies

### Production Dependencies
- **Ink ecosystem**: Terminal UI framework (ink, ink-*)
- **React 19**: Component architecture
- **gaxios**: HTTP client for API communication
- **marked + highlight.js**: Markdown rendering and syntax highlighting
- **yargs**: CLI argument parsing
- **chalk**: Terminal styling

### Development Dependencies
- **TypeScript**: Language and type checking
- **ESBuild**: Fast bundling and compilation
- **ESLint + Prettier**: Code quality and formatting

This CLI represents a production-ready tool with sophisticated architecture, comprehensive error handling, and modern development practices. It successfully bridges the gap between interactive AI chat experiences and programmatic AI system integration.