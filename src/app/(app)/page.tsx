'use client';

import Link from 'next/link';
import { useSession } from 'next-auth/react';
import {
  ArrowRight,
  Link2,
  Mail,
  Shield,
  Sparkles,
  Zap,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from '@/components/ui/carousel';
import { Button } from '@/components/ui/button';
import Autoplay from 'embla-carousel-autoplay';
import messages from '@/messages.json';

const features = [
  {
    icon: Shield,
    title: 'Truly anonymous',
    description: 'Senders stay hidden. You only see the message.',
  },
  {
    icon: Link2,
    title: 'One link',
    description: 'Share a single URL across social, bio, or team chats.',
  },
  {
    icon: Zap,
    title: 'Instant inbox',
    description: 'Messages land in your dashboard in real time.',
  },
];

export default function Home() {
  const { data: session } = useSession();

  return (
    <>
      <section className="relative overflow-hidden px-4 pb-20 pt-16 sm:px-6 sm:pt-24">
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute left-1/2 top-0 h-[500px] w-[800px] -translate-x-1/2 rounded-full bg-primary/20 blur-[120px]" />
        </div>

        <div className="mx-auto max-w-4xl text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-sm text-muted-foreground backdrop-blur-sm">
            <Sparkles className="size-4 text-primary" />
            Anonymous feedback, reimagined
          </div>

          <h1 className="text-4xl font-bold tracking-tight sm:text-6xl sm:leading-[1.1]">
            Hear what people{' '}
            <span className="gradient-text">really think</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground leading-relaxed">
            True Feedback gives you a beautiful link to collect honest, anonymous
            messages — without revealing anyone&apos;s identity.
          </p>

          <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
            {session ? (
              <Button size="lg" asChild className="h-12 px-8 shadow-lg shadow-primary/25">
                <Link href="/dashboard" className="gap-2">
                  Open dashboard
                  <ArrowRight className="size-4" />
                </Link>
              </Button>
            ) : (
              <>
                <Button size="lg" asChild className="h-12 px-8 shadow-lg shadow-primary/25">
                  <Link href="/sign-up" className="gap-2">
                    Create free account
                    <ArrowRight className="size-4" />
                  </Link>
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  asChild
                  className="h-12 border-white/10 px-8"
                >
                  <Link href="/sign-in">Sign in</Link>
                </Button>
              </>
            )}
          </div>
        </div>

        <div className="mx-auto mt-16 grid max-w-4xl gap-4 sm:grid-cols-3">
          {features.map(({ icon: Icon, title, description }) => (
            <div
              key={title}
              className="glass-panel p-5 text-center sm:text-left"
            >
              <div className="mx-auto mb-3 flex size-10 items-center justify-center rounded-xl bg-primary/15 text-primary sm:mx-0">
                <Icon className="size-5" />
              </div>
              <h3 className="font-semibold">{title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="border-t border-white/10 px-4 py-16 sm:px-6">
        <div className="mx-auto max-w-lg text-center mb-8">
          <h2 className="text-2xl font-bold">What people are saying</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Real anonymous messages from the community
          </p>
        </div>

        <Carousel
          plugins={[Autoplay({ delay: 3500 })]}
          className="mx-auto w-full max-w-xl"
        >
          <CarouselContent>
            {messages.map((message, index) => (
              <CarouselItem key={index} className="p-2">
                <Card className="border-white/10 bg-card/80 backdrop-blur-sm">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">{message.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="flex items-start gap-3">
                    <Mail className="mt-0.5 size-4 shrink-0 text-primary" />
                    <div className="text-left">
                      <p className="text-sm leading-relaxed text-foreground/90">
                        {message.content}
                      </p>
                      <p className="mt-2 text-xs text-muted-foreground">
                        {message.received}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </section>

      <footer className="border-t border-white/10 px-4 py-10 sm:px-6">
        <div className="mx-auto flex max-w-4xl flex-col items-center justify-center gap-4 sm:flex-row">
          <a
            href="https://feedback.doptonin.online/u/Prince"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-muted-foreground transition-colors hover:text-primary"
          >
            Send feedback to admin
          </a>
          <span className="hidden text-white/20 sm:inline">·</span>
          <a
            href="https://www.linkedin.com/in/prince1104/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-muted-foreground transition-colors hover:text-primary"
          >
            LinkedIn
          </a>
        </div>
      </footer>
    </>
  );
}
