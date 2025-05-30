import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { FileText } from 'lucide-react';

export function AppHeader() {
  return (
    <header className="bg-card border-b border-border shadow-sm">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/" className="text-2xl font-headline font-bold text-primary flex items-center">
          <FileText className="mr-2 h-7 w-7" />
          Resumintic
        </Link>
        <nav>
          <Button variant="ghost" asChild>
            <Link href="/">Home</Link>
          </Button>
          <Button variant="default" asChild className="ml-2">
            <Link href="/build">Build Resume</Link>
          </Button>
          {/* TODO: Add Auth buttons (Login/Logout/Profile) */}
        </nav>
      </div>
    </header>
  );
}
