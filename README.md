# Genie CLI

A powerful TypeScript-based CLI chat application for interacting with multi-agent AI systems. Built with React and designed for seamless integration with local and remote APIs.

## Quick Start

```bash
# 1. Prerequisites
npm install -g pnpm    # Install pnpm package manager
# Ensure Node.js >= 20 and API server running at localhost:9888

# 2. Installation
git clone https://github.com/namastexlabs/genie-cli.git
cd genie-cli
pnpm install

# 3. Start interactive mode
pnpm run dev

# 4. Or use headless mode
pnpm run build
./bundle/genie-cli.js --prompt "Hello" --target "your-agent-id"
```

## Features

- 🎯 **Multi-Target Support**: Connect to agents, teams, and workflows
- 🔄 **Real-time Streaming**: Live response streaming with visual indicators
- 💾 **Session Management**: Persistent conversation history
- ⚙️ **Environment Configuration**: All settings via .env files
- 🎨 **Rich UI**: Beautiful terminal interface with React components
- 🔌 **Hot Reload**: Development mode with instant feedback

## Prerequisites

- Node.js >= 20
- pnpm >= 10.12.4 (package manager - install with `npm install -g pnpm`)
- Local multi-agent API server running (default: http://localhost:9888)

## Installation

```bash
# Clone the repository
git clone https://github.com/namastexlabs/genie-cli.git
cd genie-cli

# Install dependencies
pnpm install

# Copy environment configuration
cp .env.example .env

# Edit configuration as needed
nano .env
```

## Configuration

All configuration is done via environment variables in the `.env` file:

```bash
# API Server Configuration
API_BASE_URL=http://localhost:9888
API_TIMEOUT=10000
API_RETRY_ATTEMPTS=3

# CLI Configuration
CLI_NAME=genie-cli
CLI_VERSION=0.1.0
CLI_DEBUG=false

# Session Configuration
SESSION_DIR=~/.genie-cli/sessions
SESSION_MAX_HISTORY=100
SESSION_AUTO_SAVE=true

# Display Configuration
ENABLE_COLORS=true
ENABLE_SPINNER=true
MAX_DISPLAY_WIDTH=120

# Development Configuration
LOG_LEVEL=info
DISABLE_UPDATE_CHECK=false
```

## Usage

The Genie CLI provides two modes of operation:

### Interactive Mode (Default)

The default mode provides a rich terminal UI for chatting with agents, teams, and workflows.

#### Development Mode

```bash
# Start in development mode with hot reload
pnpm run dev

# Or manually
pnpm run start
```

#### Production Mode

```bash
# Build the application
pnpm run build

# Run in production mode
NODE_ENV=production pnpm run start

# Or run the bundle directly
./bundle/genie-cli.js
```

### Headless Mode (CLI)

For automation, scripting, and non-interactive usage, the CLI supports headless mode with direct command-line execution.

#### Basic Usage

```bash
# Direct execution with prompt
genie-cli --prompt "Hello, how are you?" --target "agent-id"

# Specify output format
genie-cli --prompt "Generate a report" --target "team-id" --output json

# Continue existing session
genie-cli --prompt "Follow up question" --target "agent-id" --session "session-123"
```

#### Command Reference

| Option | Description | Required | Default |
|--------|-------------|----------|---------|
| `--prompt` | Message to send to the target | Yes | - |
| `--target` | Target ID (agent, team, or workflow) | Yes | - |
| `--session` | Session ID to continue | No | New session |
| `--output` | Output format: `text`, `json`, `markdown` | No | `text` |

#### Examples

```bash
# Chat with an agent
genie-cli --prompt "Explain quantum computing" --target "science-agent"

# Execute a workflow with JSON output
genie-cli --prompt "Process user data" --target "data-workflow" --output json

# Continue a conversation
genie-cli --prompt "Can you elaborate?" --target "assistant" --session "conv-456"

# Use in scripts
RESULT=$(genie-cli --prompt "Analyze logs" --target "dev-team" --output json)
echo $RESULT | jq '.data'
```

## CLI Reference

### Interactive Mode Commands
```bash
pnpm run dev           # Start in development mode with hot reload
pnpm run start         # Start in production mode
pnpm run build         # Build for production
./bundle/genie-cli.js  # Run built executable
```

### Headless Mode Options
```bash
genie-cli [OPTIONS]

Required:
  --prompt <message>     Message to send to the target
  --target <id>          Target ID (agent, team, or workflow)

Optional:
  --session <id>         Session ID to continue (default: new session)
  --output <format>      Output format: text|json|markdown (default: text)
  --help                 Show help information
  --version              Show version information
```

### Interactive Mode Controls

- **Type messages**: Chat with the selected agent/team/workflow
- **Enter**: Send message
- **Ctrl+C or Ctrl+D** (twice): Exit
- **Tab**: Navigate between UI elements
- **Arrow keys**: Navigate message history when available

### Interactive Mode Features

- **Target Selection**: Choose between agents, teams, and workflows
- **Session Management**: Create new sessions or continue existing ones
- **Real-time Streaming**: Watch responses stream in real-time with visual indicators
- **Event Visualization**: See tool calls, memory updates, and thinking processes
- **Session Persistence**: Conversations automatically saved to `~/.genie-cli/sessions/`

## API Integration

The CLI automatically discovers and connects to:

- **Agents**: Individual AI agents at `/playground/agents`
- **Teams**: Agent teams with routing at `/playground/teams`  
- **Workflows**: Automated workflows at `/playground/workflows`

### Required API Endpoints

Your local API server should provide:

```
GET  /openapi.json                # OpenAPI schema
GET  /api/v1/health              # Health check
GET  /playground/agents          # List available agents
GET  /playground/teams           # List available teams
GET  /playground/workflows       # List available workflows

POST /playground/agents/{id}/runs    # Invoke agent
POST /playground/teams/{id}/runs     # Invoke team
POST /playground/workflows/{id}/runs # Execute workflow
```

### Response Format

Expected response format:

```json
{
  "data": "response content",
  "error": null,
  "session_id": "session-123"
}
```

### Advanced Streaming Events

The CLI supports rich real-time streaming with detailed event visualization:

#### Event Types
- **agent_start / team_start**: Target initialization
- **tool_call_start**: Tool execution begins with arguments
- **tool_call_complete**: Tool execution results
- **memory_update**: Memory state changes
- **thinking**: AI reasoning processes
- **rag_query**: Retrieval-augmented generation queries
- **content**: Response content streaming
- **run_complete**: Execution finished

#### Visual Indicators
- **Spinners**: Active processing indicators
- **Progress**: Real-time tool execution status
- **Syntax Highlighting**: Code and data formatting
- **Event Timeline**: Chronological process visualization

## Development

### Project Structure

```
src/
├── config/
│   ├── settings.ts      # Environment configuration
│   └── localClient.ts   # API client
├── ui/
│   ├── App.tsx          # Main application
│   ├── types.ts         # Type definitions
│   ├── components/      # React components
│   ├── contexts/        # React contexts
│   └── hooks/           # Custom hooks
└── index.ts             # Entry point
```

### Building

```bash
# Clean build
pnpm run clean

# TypeScript compilation
pnpm run typecheck

# Create bundle
pnpm run bundle

# Full build process
pnpm run build
```

### Key Components

- **App.tsx**: Main application with session management
- **localClient.ts**: HTTP client for API communication
- **useLocalAPIStream**: Streaming hook for real-time responses
- **SessionContext**: Persistent conversation management
- **StreamingContext**: Real-time state management

## Troubleshooting

### Common Issues

1. **Connection Failed**
   ```
   Error: Cannot connect to API server
   ```
   - **Check API server**: Ensure server is running at `http://localhost:9888` (or your configured URL)
   - **Verify endpoints**: API server must provide `/api/v1/health` and `/playground/*` endpoints
   - **Network connectivity**: Test with `curl http://localhost:9888/api/v1/health`
   - **Configuration**: Verify `API_BASE_URL` in `.env` file

2. **Package Manager Errors**
   ```
   Error: npm ERR! ENOENT: no such file or directory
   ```
   - **Use pnpm**: This project requires pnpm, not npm
   - **Install pnpm**: `npm install -g pnpm` 
   - **Clear cache**: `pnpm store prune` if installation fails

3. **Build Errors**
   ```
   Error: TypeScript compilation failed
   ```
   - **Node.js version**: Ensure Node.js >= 20 (`node --version`)
   - **Dependencies**: Run `pnpm install` to update dependencies
   - **Type checking**: `pnpm run typecheck` for detailed type errors
   - **Clean build**: `pnpm run clean && pnpm run build`

4. **Streaming Issues**
   ```
   Error: Response streaming timeout
   ```
   - **API compatibility**: Verify API supports streaming JSON responses
   - **Timeout configuration**: Increase `API_TIMEOUT` in `.env`
   - **Debug mode**: Enable `CLI_DEBUG=true` for detailed streaming logs
   - **Network**: Check for proxy or firewall issues

5. **Session Errors**
   ```
   Error: Cannot write to session directory
   ```
   - **Permissions**: Ensure write access to `~/.genie-cli/sessions/`
   - **Directory**: Create manually if needed: `mkdir -p ~/.genie-cli/sessions`
   - **Configuration**: Set custom path with `SESSION_DIR` in `.env`

### Debug Mode

Enable debug mode for detailed logging:

```bash
# In .env file
CLI_DEBUG=true

# Or via environment variable
CLI_DEBUG=true pnpm run dev
```

## Session Management

Sessions are automatically saved to `~/.genie-cli/sessions/` as JSON files:

```json
{
  "id": "session-123",
  "messages": [...],
  "createdAt": 1641234567890,
  "updatedAt": 1641234567890,
  "metadata": {
    "totalMessages": 10,
    "lastTarget": {
      "type": "agent",
      "id": "emissao"
    }
  }
}
```

## Contributing

This CLI was built by stripping down the Gemini CLI and replacing Gemini-specific functionality with local API integration. Key changes:

- Removed Google authentication
- Replaced Gemini API with local HTTP client
- Simplified command system
- Added environment-based configuration
- Preserved React-based UI framework

## License

Based on the Gemini CLI (Apache 2.0), modified for local API integration.