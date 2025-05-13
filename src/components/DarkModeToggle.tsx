import React, { useEffect, useState } from 'react';
import { SunIcon, MoonIcon } from '@heroicons/react/24/solid';

const DarkModeToggle: React.FC = () => {
  const [dark, setDark] = useState(() => localStorage.theme === 'dark');
  useEffect(() => {
    const root = window.document.documentElement;
    if (dark) { root.classList.add('dark'); localStorage.theme = 'dark'; }
    else { root.classList.remove('dark'); localStorage.theme = 'light'; }
  }, [dark]);

  return (
    <button onClick={() => setDark(!dark)} className="p-2 rounded bg-gray-200 dark:bg-gray-700">
      {dark ? <SunIcon className="h-5 w-5 text-yellow-400" /> : <MoonIcon className="h-5 w-5 text-gray-800" />}
    </button>
  );
};

export default DarkModeToggle;
