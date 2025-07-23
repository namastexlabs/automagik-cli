import React, { useState } from 'react';
import { Box, Text } from 'ink';
import TextInput from 'ink-text-input';
import { Colors } from '../colors.js';

interface ServerConfigDialogProps {
  currentUrl?: string;
  onSubmit: (url: string) => void;
  onCancel: () => void;
}

export const ServerConfigDialog: React.FC<ServerConfigDialogProps> = ({
  currentUrl = 'http://localhost:8886',
  onSubmit,
  onCancel,
}) => {
  const [url, setUrl] = useState(currentUrl);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!url.trim()) {
      return;
    }

    // Validate URL format
    try {
      new URL(url);
    } catch {
      // If URL is invalid, try adding http:// prefix
      if (!url.startsWith('http://') && !url.startsWith('https://')) {
        try {
          new URL(`http://${url}`);
          setUrl(`http://${url}`);
        } catch {
          return; // Invalid URL format
        }
      } else {
        return; // Invalid URL format
      }
    }

    setIsSubmitting(true);
    onSubmit(url);
  };

  return (
    <Box flexDirection="column" padding={1}>
      <Box marginBottom={1}>
        <Text color={Colors.AccentBlue}>
          🔧 Server Configuration
        </Text>
      </Box>
      
      <Box marginBottom={1}>
        <Text>
          Unable to connect to the API server. Please enter the server URL:
        </Text>
      </Box>
      
      <Box marginBottom={1}>
        <Text color={Colors.Comment}>
          Examples: http://localhost:8886, https://api.example.com, 192.168.1.100:8080
        </Text>
      </Box>
      
      <Box marginBottom={1}>
        <Text color={Colors.AccentCyan}>Server URL: </Text>
        <TextInput
          value={url}
          onChange={setUrl}
          onSubmit={handleSubmit}
          placeholder="Enter server URL..."
        />
      </Box>
      
      <Box marginBottom={1}>
        <Text color={Colors.Comment}>
          Press Enter to save and continue, or Ctrl+C to cancel
        </Text>
      </Box>
      
      {isSubmitting && (
        <Box>
          <Text color={Colors.AccentGreen}>
            💾 Saving configuration...
          </Text>
        </Box>
      )}
    </Box>
  );
};