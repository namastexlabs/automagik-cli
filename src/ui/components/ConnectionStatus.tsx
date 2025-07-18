import React from 'react';
import { Box, Text } from 'ink';
import Spinner from 'ink-spinner';
import { Colors } from '../colors.js';

interface ConnectionStatusProps {
  status: 'connecting' | 'connected' | 'failed' | 'configured';
  url: string;
  error?: string;
  retryCount?: number;
}

export const ConnectionStatus: React.FC<ConnectionStatusProps> = ({
  status,
  url,
  error,
  retryCount = 0,
}) => {
  const getStatusIcon = () => {
    switch (status) {
      case 'connecting':
        return <Spinner type="dots" />;
      case 'connected':
        return '✅';
      case 'failed':
        return '❌';
      case 'configured':
        return '🔧';
      default:
        return '⚡';
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case 'connecting':
        return Colors.AccentCyan;
      case 'connected':
        return Colors.AccentGreen;
      case 'failed':
        return Colors.AccentRed;
      case 'configured':
        return Colors.AccentBlue;
      default:
        return Colors.Comment;
    }
  };

  const getStatusMessage = () => {
    switch (status) {
      case 'connecting':
        return retryCount > 0 ? `Retrying connection (${retryCount}/3)...` : 'Connecting to server...';
      case 'connected':
        return 'Connected successfully!';
      case 'failed':
        return 'Connection failed';
      case 'configured':
        return 'Server configured, attempting connection...';
      default:
        return 'Checking connection...';
    }
  };

  return (
    <Box flexDirection="column" marginBottom={1}>
      <Box marginBottom={status === 'failed' ? 1 : 0}>
        <Text color={getStatusColor()}>
          {getStatusIcon()} {getStatusMessage()}
        </Text>
      </Box>
      
      <Box marginBottom={1}>
        <Text color={Colors.Comment}>
          🔗 Server: {url}
        </Text>
      </Box>
      
      {status === 'failed' && error && (
        <Box marginBottom={1}>
          <Text color={Colors.AccentRed}>
            💥 Error: {error}
          </Text>
        </Box>
      )}
      
      {status === 'failed' && (
        <Box>
          <Text color={Colors.Comment}>
            📝 This usually means:
          </Text>
        </Box>
      )}
      
      {status === 'failed' && (
        <Box marginLeft={2} flexDirection="column">
          <Text color={Colors.Comment}>
            • The API server is not running
          </Text>
          <Text color={Colors.Comment}>
            • The server URL is incorrect
          </Text>
          <Text color={Colors.Comment}>
            • Network connectivity issues
          </Text>
          <Text color={Colors.Comment}>
            • Firewall blocking the connection
          </Text>
        </Box>
      )}
    </Box>
  );
};