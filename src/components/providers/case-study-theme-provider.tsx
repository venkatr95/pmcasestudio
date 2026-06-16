'use client';

import { useEffect, useRef } from 'react';
import { useThemeStore } from '@/store/theme-store';
import type { ThemeType } from '@/types';

export function CaseStudyThemeProvider({
  theme,
  children,
}: {
  theme: string;
  children: React.ReactNode;
}) {
  const { theme: currentTheme, setTheme } = useThemeStore();
  const previousTheme = useRef(currentTheme);

  useEffect(() => {
    // Save the theme we had before entering the case study
    previousTheme.current = currentTheme;
    // Set the case study's specific theme
    if (theme) {
      setTheme(theme as ThemeType);
    }

    return () => {
      // Revert back when leaving the case study pages
      setTheme(previousTheme.current);
    };
  }, [theme, setTheme]);

  return <>{children}</>;
}
