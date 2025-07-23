# Quick Start Guide

## 🚀 Get Started in 3 Steps

### 1. Install & Configure
```bash
cd /home/namastex/workspace/automagik-agents/chat/automagik-local-cli
npm install
cp .env.example .env
```

### 2. Start Your API Server
Make sure your Automagik Hive instance is running at `http://localhost:8886`

### 3. Run the CLI
```bash
# Development mode (with hot reload)
npm run dev

# Or production mode
npm run build
./bundle/automagik-cli.js
```

## 🎯 Basic Usage

- **Start chatting**: Type your message and press Enter
- **Help**: Press Ctrl+H
- **Clear screen**: Press Ctrl+L  
- **Exit**: Press Ctrl+C or Ctrl+D twice

## ⚙️ Configuration

Edit `.env` to change settings:
```bash
API_BASE_URL=http://localhost:8886  # Your Automagik Hive instance
CLI_DEBUG=true                      # Enable debug mode
SESSION_DIR=~/.automagik-cli/sessions   # Session storage
```

## 🎨 Features

✅ **Multi-target support** - Connect to agents, teams, workflows  
✅ **Real-time streaming** - Live response display  
✅ **Session persistence** - Conversation history saved  
✅ **Environment config** - All settings via .env  
✅ **Rich terminal UI** - Beautiful interface with React  

## 📁 Project Structure

```
chat/automagik-local-cli/
├── .env                    # Your configuration
├── src/                    # Source code
├── bundle/automagik-cli.js     # Built executable  
└── README.md              # Full documentation
```

## 🔧 Development

```bash
npm run dev        # Development with hot reload
npm run build      # Build for production
npm run typecheck  # Check TypeScript
npm run clean      # Clean build files
```

## 🐛 Troubleshooting

**Connection issues?**
- Check API server is running
- Verify `.env` configuration  
- Enable debug mode: `CLI_DEBUG=true`

**Build problems?**
- Ensure Node.js >= 20
- Run `npm install` again
- Check `npm run typecheck`

Ready to chat with your multi-agent system! 🤖✨