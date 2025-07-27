
'use client';
import Link from 'next/link';
import { Button } from './ui/button';
import { Home, PlusCircle, User, LogIn, LogOut } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

export default function Header() {
  const { user, signOut: logout, loading } = useAuth();
  
  return (
    <header className="bg-card shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold font-headline text-primary">
          MarketShare
        </Link>
        <nav className="flex items-center gap-1 md:gap-4">
          <Button variant="ghost" asChild>
            <Link href="/">
              <Home className="mr-0 md:mr-2 h-4 w-4" />
              <span className='hidden md:inline'>Browse</span>
            </Link>
          </Button>
          {user && (
            <Button variant="ghost" asChild>
              <Link href="/listings/new">
                <PlusCircle className="mr-0 md:mr-2 h-4 w-4" />
                <span className='hidden md:inline'>Create Listing</span>
              </Link>
            </Button>
          )}
          {user && (
             <Button variant="ghost" asChild>
                <Link href="/profile">
                  <User className="mr-0 md:mr-2 h-4 w-4" />
                  <span className='hidden md:inline'>Profile</span>
                </Link>
              </Button>
          )}

          {!loading && (
            <>
              {user ? (
                <Button variant="ghost" onClick={logout}>
                  <LogOut className="mr-0 md:mr-2 h-4 w-4" />
                  <span className='hidden md:inline'>Logout</span>
                </Button>
              ) : (
                <Button variant="ghost" asChild>
                  <Link href="/login">
                    <LogIn className="mr-0 md:mr-2 h-4 w-4" />
                    <span className='hidden md:inline'>Login</span>
                  </Link>
                </Button>
              )}
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
