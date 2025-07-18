import { promises as fs } from 'fs';
import { join } from 'path';
import { homedir } from 'os';

export interface EnvConfig {
  API_BASE_URL?: string;
  API_TIMEOUT?: string;
  API_RETRY_ATTEMPTS?: string;
  CLI_DEBUG?: string;
  SESSION_DIR?: string;
  SESSION_MAX_HISTORY?: string;
  SESSION_AUTO_SAVE?: string;
  ENABLE_COLORS?: string;
  ENABLE_SPINNER?: string;
  MAX_DISPLAY_WIDTH?: string;
  NODE_ENV?: string;
  LOG_LEVEL?: string;
  NPM_TOKEN?: string;
}

export class EnvManager {
  private envPath: string;

  constructor(envPath?: string) {
    this.envPath = envPath || join(process.cwd(), '.env');
  }

  async readEnvFile(): Promise<EnvConfig> {
    try {
      const content = await fs.readFile(this.envPath, 'utf-8');
      const config: EnvConfig = {};
      
      content.split('\n').forEach(line => {
        const trimmed = line.trim();
        if (trimmed && !trimmed.startsWith('#')) {
          const [key, ...valueParts] = trimmed.split('=');
          if (key && valueParts.length > 0) {
            config[key as keyof EnvConfig] = valueParts.join('=');
          }
        }
      });
      
      return config;
    } catch (error) {
      // If file doesn't exist, return empty config
      return {};
    }
  }

  async writeEnvFile(config: EnvConfig): Promise<void> {
    const lines = [
      '# API Server Configuration',
      `API_BASE_URL=${config.API_BASE_URL || ''}`,
      `API_TIMEOUT=${config.API_TIMEOUT || '30000'}`,
      `API_RETRY_ATTEMPTS=${config.API_RETRY_ATTEMPTS || '3'}`,
      '',
      '# CLI Configuration',
      `CLI_DEBUG=${config.CLI_DEBUG || 'false'}`,
      '',
      '# Session Configuration',
      `SESSION_DIR=${config.SESSION_DIR || '~/.automagik-cli/sessions'}`,
      `SESSION_MAX_HISTORY=${config.SESSION_MAX_HISTORY || '100'}`,
      `SESSION_AUTO_SAVE=${config.SESSION_AUTO_SAVE || 'true'}`,
      '',
      '# Display Configuration',
      `ENABLE_COLORS=${config.ENABLE_COLORS || 'true'}`,
      `ENABLE_SPINNER=${config.ENABLE_SPINNER || 'true'}`,
      `MAX_DISPLAY_WIDTH=${config.MAX_DISPLAY_WIDTH || '200'}`,
      '',
      '# Development Configuration',
      `NODE_ENV=${config.NODE_ENV || 'production'}`,
      `LOG_LEVEL=${config.LOG_LEVEL || 'error'}`,
    ];

    if (config.NPM_TOKEN) {
      lines.push('');
      lines.push('# NPM Publishing Configuration');
      lines.push(`NPM_TOKEN=${config.NPM_TOKEN}`);
    }

    await fs.writeFile(this.envPath, lines.join('\n') + '\n', 'utf-8');
  }

  async updateEnvFile(updates: Partial<EnvConfig>): Promise<void> {
    const existing = await this.readEnvFile();
    const merged = { ...existing, ...updates };
    await this.writeEnvFile(merged);
  }

  async ensureEnvFile(): Promise<void> {
    try {
      await fs.access(this.envPath);
    } catch {
      // File doesn't exist, create it with defaults
      await this.writeEnvFile({});
    }
  }

  getGlobalEnvPath(): string {
    return join(homedir(), '.automagik-cli', '.env');
  }

  async ensureGlobalEnvFile(): Promise<void> {
    const globalPath = this.getGlobalEnvPath();
    const globalDir = join(homedir(), '.automagik-cli');
    
    try {
      await fs.mkdir(globalDir, { recursive: true });
    } catch {
      // Directory already exists
    }

    try {
      await fs.access(globalPath);
    } catch {
      // File doesn't exist, create it with defaults
      const globalManager = new EnvManager(globalPath);
      await globalManager.writeEnvFile({});
    }
  }
}

export const envManager = new EnvManager();