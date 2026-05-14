'use client';
import { useEffect, useState } from 'react';
import { Sun, Moon } from 'lucide-react';

export default function ThemeToggle() {
  const [theme, setTheme] = useState<'light' | 'dark' | null>(null);

  useEffect(() => {
    const root = document.documentElement;
    // Check explicit storage or class, otherwise match system
    if (root.classList.contains('light')) {
      setTheme('light');
    } else if (root.classList.contains('dark')) {
      setTheme('dark');
    } else {
      const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setTheme(systemPrefersDark ? 'dark' : 'light');
    }
  }, []);

  const toggleTheme = () => {
    const root = document.documentElement;
    const nextTheme = theme === 'light' ? 'dark' : 'light';

    if (nextTheme === 'dark') {
      root.classList.remove('light');
      root.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      root.classList.remove('dark');
      root.classList.add('light');
      localStorage.setItem('theme', 'light');
    }
    setTheme(nextTheme);
  };

  if (theme === null) {
    return <div className="w-9 h-9" />; // Avoid layout shift during mounting
  }

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-md hover:bg-bg-surface-2 border border-subtle text-text-secondary hover:text-text-primary transition-all focus:outline-none focus:ring-1 focus:ring-accent-violet/30"
      aria-label="Toggle theme"
    >
      {theme === 'light' ? (
        <Sun className="w-4 h-4" />
      ) : (
        <Moon className="w-4 h-4" />
      )}
    </button>
  );
}
