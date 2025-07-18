/**
 * Footer component adapted from gemini-cli for automagik context
 */

import React from 'react';
import { Box, Text } from 'ink';
import { Colors } from '../colors.js';
import { shortenPath, tildeifyPath } from '../utils/textUtils.js';
import Gradient from 'ink-gradient';
import { useResponsiveLayout, useResponsiveText } from '../hooks/useResponsiveLayout.js';

interface FooterProps {
  model?: string;
  targetDir?: string;
  debugMode: boolean;
  debugMessage: string;
  sessionId: string;
  apiUrl: string;
  branchName?: string;
  nightly?: boolean;
  selectedTarget?: {
    type: 'agent' | 'team' | 'workflow';
    id: string;
    name: string;
  };
}

export const Footer: React.FC<FooterProps> = ({
  model,
  targetDir,
  debugMode,
  debugMessage,
  sessionId,
  apiUrl,
  branchName,
  nightly = false,
  selectedTarget,
}) => {
  const layout = useResponsiveLayout();
  
  const formatSessionId = (id: string): string => {
    return id.slice(-8); // Show last 8 characters
  };

  // Responsive text calculations
  const leftSectionWidth = Math.floor(layout.width * 0.3);
  const middleSectionWidth = Math.floor(layout.width * 0.4);
  const rightSectionWidth = Math.floor(layout.width * 0.3);

  // Responsive target directory display
  const displayTargetDir = targetDir ? 
    useResponsiveText(shortenPath(tildeifyPath(targetDir), leftSectionWidth), leftSectionWidth) : 
    null;

  // Responsive session ID
  const displaySessionId = useResponsiveText(`Session: ${formatSessionId(sessionId)}`, leftSectionWidth);

  // Responsive target name
  const targetDisplayText = selectedTarget ? 
    `🎯 ${selectedTarget.name} (${selectedTarget.type})` : 
    '🎯 automagik-local-cli';
  const displayTargetText = useResponsiveText(targetDisplayText, middleSectionWidth);

  // Responsive API/model display
  const apiDisplayText = model ? model : `API: ${apiUrl.replace(/^https?:\/\//, '')}`;
  const displayApiText = useResponsiveText(apiDisplayText, rightSectionWidth);

  // Responsive debug message
  const truncatedDebugMessage = useResponsiveText(
    debugMessage || '--debug', 
    Math.max(leftSectionWidth - 10, 10)
  );
  const displayDebugMessage = debugMessage ? truncatedDebugMessage : '--debug';

  // Responsive layout: stack vertically on very small screens
  if (layout.isSmall && layout.width < 60) {
    return (
      <Box marginTop={layout.isShort ? 0 : 1} flexDirection="column" width="100%">
        {/* First row: Session/Directory info */}
        <Box marginBottom={layout.isShort ? 0 : 1}>
          {displayTargetDir ? (
            nightly ? (
              <Gradient colors={Colors.GradientColors}>
                <Text>
                  {displayTargetDir}
                  {branchName && <Text> ({branchName}*)</Text>}
                </Text>
              </Gradient>
            ) : (
              <Text color={Colors.LightBlue}>
                {displayTargetDir}
                {branchName && <Text color={Colors.Gray}> ({branchName}*)</Text>}
              </Text>
            )
          ) : (
            <Text color={Colors.LightBlue}>
              {displaySessionId}
            </Text>
          )}
          {debugMode && (
            <Text color={Colors.AccentRed}>
              {' ' + displayDebugMessage}
            </Text>
          )}
        </Box>

        {/* Second row: Target and API info */}
        <Box justifyContent="space-between">
          <Text color={Colors.AccentPurple}>
            {displayTargetText}
          </Text>
          <Text color={Colors.AccentBlue}>
            {displayApiText}
          </Text>
        </Box>
      </Box>
    );
  }

  // Normal horizontal layout for medium/large screens
  return (
    <Box marginTop={layout.isShort ? 0 : 1} justifyContent="space-between" width="100%">
      <Box flexShrink={1} minWidth={0}>
        {displayTargetDir ? (
          nightly ? (
            <Gradient colors={Colors.GradientColors}>
              <Text>
                {displayTargetDir}
                {branchName && <Text> ({branchName}*)</Text>}
              </Text>
            </Gradient>
          ) : (
            <Text color={Colors.LightBlue}>
              {displayTargetDir}
              {branchName && <Text color={Colors.Gray}> ({branchName}*)</Text>}
            </Text>
          )
        ) : (
          <Text color={Colors.LightBlue}>
            {displaySessionId}
          </Text>
        )}
        {debugMode && (
          <Text color={Colors.AccentRed}>
            {' ' + displayDebugMessage}
          </Text>
        )}
      </Box>

      {/* Middle Section: Automagik Target Info - hide on small screens */}
      {!layout.isSmall && (
        <Box
          flexGrow={1}
          alignItems="center"
          justifyContent="center"
          display="flex"
          flexShrink={1}
          minWidth={0}
        >
          <Text color={Colors.AccentPurple}>
            {displayTargetText}
          </Text>
        </Box>
      )}

      {/* Right Section: Model/API Info */}
      <Box alignItems="center" flexShrink={1} minWidth={0}>
        <Text color={Colors.AccentBlue}>
          {displayApiText}
        </Text>
      </Box>
    </Box>
  );
};