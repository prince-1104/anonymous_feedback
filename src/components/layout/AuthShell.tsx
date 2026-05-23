import { MessageSquareQuote } from 'lucide-react';
import Link from 'next/link';

type AuthShellProps = {
  title: string;
  subtitle: string;
  children: React.ReactNode;
};

export function AuthShell({ title, subtitle, children }: AuthShellProps) {
  return (
    <div className="mesh-bg relative flex min-h-screen">
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-between p-12 border-r border-white/10">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="flex size-9 items-center justify-center rounded-xl bg-primary/20 text-primary">
            <MessageSquareQuote className="size-5" />
          </div>
          <span className="text-lg font-semibold tracking-tight">True Feedback</span>
        </Link>

        <div className="space-y-6 max-w-md">
          <h2 className="text-4xl font-bold leading-tight tracking-tight">
            Honest feedback,{' '}
            <span className="gradient-text">zero identity.</span>
          </h2>
          <p className="text-muted-foreground text-lg leading-relaxed">
            Share your link, collect anonymous messages, and manage everything from
            one beautiful dashboard.
          </p>
          <ul className="space-y-3 text-sm text-muted-foreground">
            <li className="flex items-center gap-2">
              <span className="size-1.5 rounded-full bg-primary" />
              End-to-end anonymous messaging
            </li>
            <li className="flex items-center gap-2">
              <span className="size-1.5 rounded-full bg-primary" />
              Toggle inbox on or off anytime
            </li>
            <li className="flex items-center gap-2">
              <span className="size-1.5 rounded-full bg-primary" />
              Your unique shareable link
            </li>
          </ul>
        </div>

        <p className="text-xs text-muted-foreground">
          © {new Date().getFullYear()} True Feedback
        </p>
      </div>

      <div className="flex flex-1 items-center justify-center p-6 sm:p-10">
        <div className="glass-panel glow-ring w-full max-w-md p-8 sm:p-10">
          <div className="mb-8 text-center lg:text-left">
            <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">{title}</h1>
            <p className="mt-2 text-sm text-muted-foreground">{subtitle}</p>
          </div>
          {children}
        </div>
      </div>
    </div>
  );
}
