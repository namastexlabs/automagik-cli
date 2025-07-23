import { config } from 'dotenv';

// Load environment variables from .env file
config();

export interface AppConfig {
  // API Configuration
  apiBaseUrl: string;
  apiKey: string;
  apiTimeout: number;
  apiRetryAttempts: number;
  
  // CLI Configuration
  cliDebug: boolean;
  
  // Session Configuration
  sessionDir: string;
  sessionMaxHistory: number;
  sessionAutoSave: boolean;
  
  // Display Configuration
  enableColors: boolean;
  enableSpinner: boolean;
  maxDisplayWidth: number;
  
  // Development Configuration
  nodeEnv: string;
  logLevel: string;
}

function getEnvString(key: string, defaultValue: string): string {
  return process.env[key] || defaultValue;
}

function getEnvNumber(key: string, defaultValue: number): number {
  const value = process.env[key];
  return value ? parseInt(value, 10) : defaultValue;
}

function getEnvBoolean(key: string, defaultValue: boolean): boolean {
  const value = process.env[key];
  return value ? value.toLowerCase() === 'true' : defaultValue;
}

function createAppConfig(): AppConfig {
  return {
    // API Configuration
    apiBaseUrl: getEnvString('API_BASE_URL', ''), // No default - must be provided
    apiKey: getEnvString('API_KEY', ''), // No default - must be provided
    apiTimeout: getEnvNumber('API_TIMEOUT', 30000), // Increased to 30 seconds
    apiRetryAttempts: getEnvNumber('API_RETRY_ATTEMPTS', 3),
    
    // CLI Configuration
    cliDebug: getEnvBoolean('CLI_DEBUG', false),
    
    // Session Configuration
    sessionDir: getEnvString('SESSION_DIR', '~/.automagik-cli/sessions'),
    sessionMaxHistory: getEnvNumber('SESSION_MAX_HISTORY', 100),
    sessionAutoSave: getEnvBoolean('SESSION_AUTO_SAVE', true),
    
    // Display Configuration
    enableColors: getEnvBoolean('ENABLE_COLORS', true),
    enableSpinner: getEnvBoolean('ENABLE_SPINNER', true),
    maxDisplayWidth: getEnvNumber('MAX_DISPLAY_WIDTH', 200),
    
    // Development Configuration
    nodeEnv: getEnvString('NODE_ENV', 'production'),
    logLevel: getEnvString('LOG_LEVEL', 'error'),
  };
}

export let appConfig: AppConfig = createAppConfig();

export function reloadAppConfig(): void {
  // Reload environment variables from .env file
  config();
  // Recreate the config object
  appConfig = createAppConfig();
}

export default appConfig;