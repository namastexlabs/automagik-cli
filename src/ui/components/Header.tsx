/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Box, Text } from 'ink';
import Gradient from 'ink-gradient';
import { Colors } from '../colors.js';
import { shortGenieAsciiLogo, longGenieAsciiLogo } from './AsciiArt.js';
import { getAsciiArtWidth } from '../utils/textUtils.js';
import { useResponsiveLayout, useResponsiveText } from '../hooks/useResponsiveLayout.js';

interface HeaderProps {
  customAsciiArt?: string; // For user-defined ASCII art
  terminalWidth: number; // For responsive logo
  version: string;
  nightly: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  customAsciiArt,
  terminalWidth,
  version,
  nightly,
}) => {
  const layout = useResponsiveLayout();
  
  let displayTitle;
  let displayVersion = version;
  const widthOfLongLogo = getAsciiArtWidth(longGenieAsciiLogo);

  if (customAsciiArt) {
    displayTitle = customAsciiArt;
  } else {
    // Enhanced responsive logo selection
    if (layout.isSmall || terminalWidth < widthOfLongLogo) {
      displayTitle = shortGenieAsciiLogo;
    } else {
      displayTitle = longGenieAsciiLogo;
    }
  }

  // Responsive version display
  if (nightly) {
    if (layout.isSmall) {
      displayVersion = useResponsiveText(`v${version}`, Math.max(terminalWidth - 10, 5));
    }
  }

  const artWidth = getAsciiArtWidth(displayTitle);
  
  // Responsive height based on terminal size
  const headerMargin = layout.isShort ? 0 : 1;

  return (
    <Box
      marginBottom={headerMargin}
      alignItems="flex-start"
      width={Math.min(artWidth, layout.maxContentWidth)}
      flexShrink={0}
      flexDirection="column"
    >
      {Colors.GradientColors ? (
        <Gradient colors={Colors.GradientColors}>
          <Text>{displayTitle}</Text>
        </Gradient>
      ) : (
        <Text>{displayTitle}</Text>
      )}
      {nightly && (
        <Box 
          width="100%" 
          flexDirection="row" 
          justifyContent={layout.isSmall ? "flex-start" : "flex-end"}
          marginTop={layout.isShort ? 0 : undefined}
        >
          <Gradient colors={Colors.GradientColors}>
            <Text>v{displayVersion}</Text>
          </Gradient>
        </Box>
      )}
    </Box>
  );
};