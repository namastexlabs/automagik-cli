import { request as gaxiosRequest } from 'gaxios';
import { appConfig } from '../config/settings.js';

export interface ServerStatus {
  isRunning: boolean;
  url: string;
  health?: any;
  error?: string;
  isAuthenticated?: boolean;
  authError?: string;
}

export async function detectAPIServer(baseUrl: string): Promise<ServerStatus> {
  try {
    // First, check if server is running without authentication
    const healthResponse = await gaxiosRequest({
      url: `${baseUrl}/api/v1/health`,
      method: 'GET',
      timeout: 3000,
    });

    // Server is running, now check if we can authenticate
    if (appConfig.apiKey) {
      try {
        // Test API key with a simple authenticated endpoint
        const authResponse = await gaxiosRequest({
          url: `${baseUrl}/playground/agents`,
          method: 'GET',
          timeout: 3000,
          headers: {
            'accept': 'application/json',
            'x-api-key': appConfig.apiKey,
          },
        });

        return {
          isRunning: true,
          url: baseUrl,
          health: healthResponse.data,
          isAuthenticated: true,
        };
      } catch (authError) {
        return {
          isRunning: true,
          url: baseUrl,
          health: healthResponse.data,
          isAuthenticated: false,
          authError: authError instanceof Error ? authError.message : 'Authentication failed',
        };
      }
    } else {
      // No API key configured
      return {
        isRunning: true,
        url: baseUrl,
        health: healthResponse.data,
        isAuthenticated: false,
        authError: 'No API key configured',
      };
    }
  } catch (error) {
    return {
      isRunning: false,
      url: baseUrl,
      error: error instanceof Error ? error.message : 'Unknown error',
      isAuthenticated: false,
    };
  }
}

export function generateStartupGuide(serverStatus: ServerStatus): string {
  if (serverStatus.isRunning) {
    return `✅ **Server is running at:** ${serverStatus.url}`;
  }

  const guide = `
🚀 **Starting Automagik API Server**

📂 **Step 1:** Navigate to automagik-agents directory
\`\`\`bash
cd /path/to/automagik-agents
\`\`\`

⚡ **Step 2:** Start the server
\`\`\`bash
make dev
\`\`\`

⏳ **Step 3:** Wait for startup message
Look for: "Sistema operacional" message

🔄 **Step 4:** Restart this CLI
\`\`\`bash
./bundle/automagik-cli.js
\`\`\`

🔧 **Alternative methods:**
• Quick health check: \`curl ${serverStatus.url}/api/v1/health\`
• Check if port is in use: \`lsof -i :9888\`
• Update server URL in .env: \`API_BASE_URL=http://localhost:9888\`

❌ **Error details:** ${serverStatus.error}`;

  return guide;
}

export async function waitForServerStartup(
  baseUrl: string,
  maxAttempts: number = 30,
  intervalMs: number = 1000,
  onProgress?: (attempt: number, maxAttempts: number) => void
): Promise<ServerStatus> {
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    onProgress?.(attempt, maxAttempts);
    
    const status = await detectAPIServer(baseUrl);
    if (status.isRunning) {
      return status;
    }

    if (attempt < maxAttempts) {
      await new Promise(resolve => setTimeout(resolve, intervalMs));
    }
  }

  return {
    isRunning: false,
    url: baseUrl,
    error: `Server did not start within ${maxAttempts} seconds`,
  };
}