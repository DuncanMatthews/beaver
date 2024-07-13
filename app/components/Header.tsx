import Link from 'next/link';
import ThemeToggle from './ThemeToggle';

export default function Header() {
  return (
    <header className="bg-white dark:bg-neutral-800 shadow-sm">
      <nav className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold text-primary-600 dark:text-primary-400">
          Crucible
        </Link>
        <div className="flex items-center space-x-4">
          <Link href="/chat" className="text-neutral-600 dark:text-neutral-300 hover:text-primary-600 dark:hover:text-primary-400">
            Chat
          </Link>
          <Link href="/convert" className="text-neutral-600 dark:text-neutral-300 hover:text-primary-600 dark:hover:text-primary-400">
            Convert
          </Link>
          <ThemeToggle />
        </div>
      </nav>
    </header>
  );
}