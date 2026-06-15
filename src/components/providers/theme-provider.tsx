'use client';
import { useEffect, useState } from 'react';
import { useThemeStore } from '@/store/theme-store';
import { ThemeProvider as NextThemeProvider } from 'next-themes';
import React from 'react';

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const { theme } = useThemeStore();
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  return (
    <NextThemeProvider attribute="class" defaultTheme="system" enableSystem>
      {children}
    </NextThemeProvider>
  );
}

export function CaseStudyThemeProvider({
  theme,
  children,
}: {
  theme: string;
  children: React.ReactNode;
}) {
  const { theme: currentTheme, setTheme } = useThemeStore();
  const previousTheme = React.useRef(currentTheme);

  React.useEffect(() => {
    previousTheme.current = currentTheme;
    if (theme) {
      setTheme(theme as any);
    }
    return () => {
      setTheme(previousTheme.current);
    };
  }, [theme, setTheme]);

  return <>{children}</>;
}
