'use client';

import React, { useState } from 'react';
import axios, { AxiosError } from 'axios';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Loader2, MessageSquareQuote, Send } from 'lucide-react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { ApiResponse } from '../../../../types/ApiResponse';
import { messageSchema } from '@/schemas/messageSchema';

export default function SendMessage() {
  const { username } = useParams<{ username: string }>();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof messageSchema>>({
    resolver: zodResolver(messageSchema),
    defaultValues: { content: '' },
  });

  const messageContent = form.watch('content');

  const onSubmit = async (data: z.infer<typeof messageSchema>) => {
    setIsLoading(true);
    try {
      const response = await axios.post<ApiResponse>('/api/send-message', {
        ...data,
        username,
      });
      toast.success(response.data.message);
      form.reset({ content: '' });
    } catch (err) {
      const axiosError = err as AxiosError<ApiResponse>;
      toast.error(axiosError.response?.data.message ?? 'Failed to send message');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mesh-bg flex min-h-screen flex-col">
      <header className="border-b border-white/10 px-4 py-4 sm:px-6">
        <Link href="/" className="mx-auto flex max-w-lg items-center gap-2.5">
          <div className="flex size-8 items-center justify-center rounded-lg bg-primary/15 text-primary">
            <MessageSquareQuote className="size-4" />
          </div>
          <span className="font-semibold tracking-tight">True Feedback</span>
        </Link>
      </header>

      <main className="flex flex-1 items-center justify-center px-4 py-12 sm:px-6">
        <div className="glass-panel glow-ring w-full max-w-lg p-8 sm:p-10">
          <div className="mb-8 text-center">
            <div className="mx-auto mb-4 flex size-14 items-center justify-center rounded-2xl bg-primary/15 text-primary">
              <MessageSquareQuote className="size-7" />
            </div>
            <p className="text-sm font-medium text-primary">Anonymous message</p>
            <h1 className="mt-2 text-2xl font-bold tracking-tight">
              Send to <span className="gradient-text">@{username}</span>
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Your identity stays completely private. Be kind and constructive.
            </p>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
              <FormField
                control={form.control}
                name="content"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="sr-only">Message</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Write your anonymous message here..."
                        className="min-h-[140px] resize-none border-white/10 bg-black/20 text-[15px] leading-relaxed"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                type="submit"
                className="h-11 w-full gap-2 shadow-lg shadow-primary/25"
                disabled={isLoading || !messageContent?.trim()}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="size-4 animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Send className="size-4" />
                    Send anonymously
                  </>
                )}
              </Button>
            </form>
          </Form>

          <div className="mt-8 rounded-xl border border-white/10 bg-white/5 p-4 text-center">
            <p className="text-sm text-muted-foreground">Want your own message board?</p>
            <Button variant="outline" asChild className="mt-3 border-white/10">
              <Link href="/sign-up">Create free account</Link>
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}
