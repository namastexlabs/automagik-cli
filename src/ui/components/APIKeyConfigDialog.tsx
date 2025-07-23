import React, { useState } from 'react';
import { Box, Text } from 'ink';
import TextInput from 'ink-text-input';
import { Colors } from '../colors.js';

interface APIKeyConfigDialogProps {
  currentApiKey?: string;
  authError?: string;
  onSubmit: (apiKey: string) => void;
  onCancel: () => void;
}

export const APIKeyConfigDialog: React.FC<APIKeyConfigDialogProps> = ({
  currentApiKey = '',
  authError,
  onSubmit,
  onCancel,
}) => {
  const [apiKey, setApiKey] = useState(currentApiKey);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!apiKey.trim()) {
      return;
    }

    setIsSubmitting(true);
    onSubmit(apiKey.trim());
  };

  return (
    <Box flexDirection="column" padding={1}>
      <Box marginBottom={1}>
        <Text color={Colors.AccentBlue}>
          🔑 API Key Configuration
        </Text>
      </Box>
      
      <Box marginBottom={1}>
        <Text>
          {authError === 'No API key configured' 
            ? 'No API key is configured. Please enter your API key to continue:'
            : 'Authentication failed. Please check and update your API key:'
          }
        </Text>
      </Box>
      
      {authError && authError !== 'No API key configured' && (
        <Box marginBottom={1}>
          <Text color={Colors.AccentRed}>
            ❌ Error: {authError}
          </Text>
        </Box>
      )}
      
      <Box marginBottom={1}>
        <Text color={Colors.Comment}>
          Your API key should look like: hive_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
        </Text>
      </Box>
      
      <Box marginBottom={1}>
        <Text color={Colors.AccentCyan}>API Key: </Text>
        <TextInput
          value={apiKey}
          onChange={setApiKey}
          onSubmit={handleSubmit}
          placeholder="Enter your API key..."
          mask="*"
        />
      </Box>
      
      <Box marginBottom={1}>
        <Text color={Colors.Comment}>
          Press Enter to save and continue, or Ctrl+C to cancel
        </Text>
      </Box>
      
      <Box marginBottom={1}>
        <Text color={Colors.Comment}>
          💡 Your API key will be saved to the .env file for future use
        </Text>
      </Box>
      
      {isSubmitting && (
        <Box>
          <Text color={Colors.AccentGreen}>
            🔄 Validating API key...
          </Text>
        </Box>
      )}
    </Box>
  );
};