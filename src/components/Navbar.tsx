'use client';

import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { User } from 'next-auth';
import { LayoutDashboard, LogOut, MessageSquareQuote } from 'lucide-react';
import { Button } from './ui/button';

function Navbar() {
  const { data: session } = useSession();
  const user = session?.user as User | undefined;

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-background/70 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="flex size-8 items-center justify-center rounded-lg bg-primary/15 text-primary transition-colors group-hover:bg-primary/25">
            <MessageSquareQuote className="size-4" />
          </div>
          <span className="font-semibold tracking-tight">True Feedback</span>
        </Link>

        <nav className="flex items-center gap-2 sm:gap-3">
          {session ? (
            <>
              <span className="hidden text-sm text-muted-foreground sm:inline">
                @{user?.username}
              </span>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/dashboard" className="gap-1.5">
                  <LayoutDashboard className="size-4" />
                  Dashboard
                </Link>
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => signOut()}
                className="gap-1.5 border-white/10"
              >
                <LogOut className="size-4" />
                <span className="hidden sm:inline">Logout</span>
              </Button>
            </>
          ) : (
            <>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/sign-in">Sign in</Link>
              </Button>
              <Button size="sm" asChild className="shadow-lg shadow-primary/25">
                <Link href="/sign-up">Get started</Link>
              </Button>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}

export default Navbar;
