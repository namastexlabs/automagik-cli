import React, { createContext, useContext, ReactNode } from 'react';
import { useResponsiveLayout, ResponsiveLayout } from '../hooks/useResponsiveLayout.js';

interface ResponsiveContextType {
  layout: ResponsiveLayout;
}

const ResponsiveContext = createContext<ResponsiveContextType | undefined>(undefined);

interface ResponsiveProviderProps {
  children: ReactNode;
}

export const ResponsiveProvider: React.FC<ResponsiveProviderProps> = ({ children }) => {
  const layout = useResponsiveLayout({
    debounceMs: 150,
    minInputWidth: 20,
    widthFraction: 0.9,
  });

  return (
    <ResponsiveContext.Provider value={{ layout }}>
      {children}
    </ResponsiveContext.Provider>
  );
};

export const useResponsive = (): ResponsiveContextType => {
  const context = useContext(ResponsiveContext);
  if (context === undefined) {
    throw new Error('useResponsive must be used within a ResponsiveProvider');
  }
  return context;
};