import Link from 'next/link';
import { Button } from './ui/button';
import { Home, PlusCircle, User } from 'lucide-react';

export default function Header() {
  return (
    <header className="bg-card shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold font-headline text-primary">
          MarketShare
        </Link>
        <nav className="flex items-center gap-4">
          <Button variant="ghost" asChild>
            <Link href="/">
              <Home className="mr-2 h-4 w-4" />
              Browse
            </Link>
          </Button>
          <Button variant="ghost" asChild>
            <Link href="/listings/new">
              <PlusCircle className="mr-2 h-4 w-4" />
              Create Listing
            </Link>
          </Button>
          <Button variant="ghost" asChild>
            <Link href="/profile">
              <User className="mr-2 h-4 w-4" />
              Profile
            </Link>
          </Button>
        </nav>
      </div>
    </header>
  );
}
