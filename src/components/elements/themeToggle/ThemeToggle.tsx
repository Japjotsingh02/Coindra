'use client';
import { cn } from '@/lib/utils';

import { Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const isDark = theme === 'dark';

  useEffect(() => {
    setMounted(true);
  }, []);

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  return (
    <>
      {mounted ? (
        <button
          onClick={toggleTheme}
          className={cn(
            'w-7 h-7 2xl:h-8 2xl:w-8 rounded-md hover:bg-background-mode',
            'transition-colors cursor-pointer flex items-center',
            'justify-center'
          )}
          title={`Switch to ${isDark ? 'light' : 'dark'} theme`}
        >
          <Sun
            className={`h-4 w-4 text-ash transition-all ${isDark ? 'rotate-0 scale-100' : 'rotate-90 scale-0'}`}
          />
          <Moon
            className={`absolute h-4 w-4 text-ash transition-all ${isDark ? 'rotate-90 scale-0' : 'rotate-0 scale-100'}`}
          />
          <span className="sr-only">Toggle theme</span>
        </button>
      ) : null}
    </>
  );
}
