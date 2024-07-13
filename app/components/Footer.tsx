export default function Footer() {
    return (
      <footer className="bg-neutral-100 dark:bg-neutral-800 border-t border-neutral-200 dark:border-neutral-700">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 text-center text-neutral-600 dark:text-neutral-400">
          © {new Date().getFullYear()} Crucible. All rights reserved.
        </div>
      </footer>
    );
  }