import { useState, useEffect, useMemo, useCallback } from 'react';
import { useTerminalSize } from './useTerminalSize.js';

export type BreakpointSize = 'small' | 'medium' | 'large';

export interface ResponsiveLayout {
  width: number;
  height: number;
  breakpoint: BreakpointSize;
  isSmall: boolean;
  isMedium: boolean;
  isLarge: boolean;
  isNarrow: boolean;
  isWide: boolean;
  isShort: boolean;
  isTall: boolean;
  maxContentWidth: number;
  maxContentHeight: number;
  inputWidth: number;
  suggestionsWidth: number;
  headerHeight: number;
  footerHeight: number;
}

interface ResponsiveLayoutOptions {
  debounceMs?: number;
  minInputWidth?: number;
  widthFraction?: number;
}

// Breakpoint thresholds
const BREAKPOINTS = {
  small: 80,   // < 80 columns
  medium: 120, // 80-120 columns
  // large: > 120 columns
} as const;

const HEIGHT_THRESHOLDS = {
  short: 20,   // < 20 rows
  tall: 40,    // > 40 rows
} as const;

export const useResponsiveLayout = (options: ResponsiveLayoutOptions = {}): ResponsiveLayout => {
  const {
    debounceMs = 150,
    minInputWidth = 20,
    widthFraction = 0.9,
  } = options;

  const terminalSize = useTerminalSize();
  const [debouncedSize, setDebouncedSize] = useState(terminalSize);

  // Debounce terminal size changes for performance
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSize(terminalSize);
    }, debounceMs);

    return () => clearTimeout(timer);
  }, [terminalSize, debounceMs]);

  // Breakpoint detection
  const breakpoint: BreakpointSize = useMemo(() => {
    if (debouncedSize.columns < BREAKPOINTS.small) return 'small';
    if (debouncedSize.columns < BREAKPOINTS.medium) return 'medium';
    return 'large';
  }, [debouncedSize.columns]);

  // Responsive layout calculations
  const layout: ResponsiveLayout = useMemo(() => {
    const { columns: width, rows: height } = debouncedSize;
    
    // Breakpoint flags
    const isSmall = breakpoint === 'small';
    const isMedium = breakpoint === 'medium';
    const isLarge = breakpoint === 'large';
    const isNarrow = width < BREAKPOINTS.small;
    const isWide = width >= BREAKPOINTS.medium;
    
    // Height flags
    const isShort = height < HEIGHT_THRESHOLDS.short;
    const isTall = height > HEIGHT_THRESHOLDS.tall;
    
    // Content sizing based on breakpoint
    let maxContentWidth: number;
    let inputWidthCalc: number;
    let suggestionsWidthCalc: number;
    
    if (isSmall) {
      // Small screens: use most of the width, minimal padding
      maxContentWidth = Math.max(width - 4, 20);
      inputWidthCalc = Math.max(minInputWidth, width - 8);
      suggestionsWidthCalc = Math.max(30, width - 10);
    } else if (isMedium) {
      // Medium screens: balanced approach
      maxContentWidth = Math.floor(width * 0.85);
      inputWidthCalc = Math.max(minInputWidth, Math.floor(width * widthFraction) - 3);
      suggestionsWidthCalc = Math.max(50, Math.floor(width * 0.75));
    } else {
      // Large screens: comfortable spacing
      maxContentWidth = Math.floor(width * 0.8);
      inputWidthCalc = Math.max(minInputWidth, Math.floor(width * widthFraction) - 3);
      suggestionsWidthCalc = Math.max(60, Math.floor(width * 0.8));
    }
    
    // Height calculations
    const headerHeight = isShort ? 1 : 2;
    const footerHeight = isShort ? 1 : 2;
    const maxContentHeight = Math.max(height - headerHeight - footerHeight - 2, 5);
    
    return {
      width,
      height,
      breakpoint,
      isSmall,
      isMedium,
      isLarge,
      isNarrow,
      isWide,
      isShort,
      isTall,
      maxContentWidth,
      maxContentHeight,
      inputWidth: inputWidthCalc,
      suggestionsWidth: suggestionsWidthCalc,
      headerHeight,
      footerHeight,
    };
  }, [debouncedSize, breakpoint, minInputWidth, widthFraction]);

  return layout;
};

// Utility function for responsive text truncation
export const useResponsiveText = (text: string, maxWidth: number, suffix: string = '...'): string => {
  return useMemo(() => {
    if (text.length <= maxWidth) return text;
    const truncateAt = Math.max(maxWidth - suffix.length, 1);
    return text.slice(0, truncateAt) + suffix;
  }, [text, maxWidth, suffix]);
};

// Utility function for responsive spacing
export const useResponsiveSpacing = (layout: ResponsiveLayout) => {
  return useMemo(() => ({
    marginX: layout.isSmall ? 0 : layout.isMedium ? 1 : 2,
    marginY: layout.isShort ? 0 : 1,
    paddingX: layout.isSmall ? 1 : 2,
    paddingY: layout.isShort ? 0 : 1,
  }), [layout]);
};