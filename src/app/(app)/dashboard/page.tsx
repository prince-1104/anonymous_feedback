'use client';

import { MessageCard } from '@/components/MessageCard';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Message } from '@/lib/models/User';
import { ApiResponse } from '../../../../types/ApiResponse';
import { zodResolver } from '@hookform/resolvers/zod';
import axios, { AxiosError } from 'axios';
import {
  Check,
  Copy,
  Inbox,
  Link2,
  Loader2,
  MessageSquare,
  RefreshCcw,
  Sparkles,
} from 'lucide-react';
import { User } from 'next-auth';
import { useSession } from 'next-auth/react';
import { useCallback, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { AcceptMessageSchema } from '@/schemas/acceptMessageSchema';
import Link from 'next/link';
import { cn } from '@/lib/utils';

function UserDashboard() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSwitchLoading, setIsSwitchLoading] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState('');
  const [isError, setIsError] = useState(false);
  const [copied, setCopied] = useState(false);

  const { data: session } = useSession();

  const form = useForm({
    resolver: zodResolver(AcceptMessageSchema),
  });

  const { register, watch, setValue } = form;
  const acceptMessages = watch('acceptMessages');

  const handleDeleteMessage = (messageId: string) => {
    setMessages(messages.filter((message) => message._id !== messageId));
  };

  const fetchAcceptMessages = useCallback(async () => {
    setIsSwitchLoading(true);
    try {
      const response = await axios.get<ApiResponse>('/api/accept-messages');
      setValue('acceptMessages', response.data.isAcceptingMessages ?? false);
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      setIsError(true);
      setFeedbackMessage(
        axiosError.response?.data.message ?? 'Failed to fetch message settings'
      );
    } finally {
      setIsSwitchLoading(false);
    }
  }, [setValue]);

  const fetchMessages = useCallback(async (refresh: boolean = false) => {
    setIsLoading(true);
    try {
      const response = await axios.get<ApiResponse>('/api/get-messages');
      setMessages((response.data.messages || []) as Message[]);
      if (refresh) {
        setIsError(false);
        setFeedbackMessage('Inbox refreshed');
      }
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      setIsError(true);
      setFeedbackMessage(
        axiosError.response?.data.message ?? 'Failed to fetch messages'
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!session?.user) return;
    fetchMessages();
    fetchAcceptMessages();
  }, [session, fetchAcceptMessages, fetchMessages]);

  const handleSwitchChange = async () => {
    try {
      const response = await axios.post<ApiResponse>('/api/accept-messages', {
        acceptMessages: !acceptMessages,
      });
      setValue('acceptMessages', !acceptMessages);
      setIsError(false);
      setFeedbackMessage(response.data.message);
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      setIsError(true);
      setFeedbackMessage(
        axiosError.response?.data.message ?? 'Failed to update message settings'
      );
    }
  };

  useEffect(() => {
    if (!feedbackMessage) return;
    const timer = setTimeout(() => setFeedbackMessage(''), 4000);
    return () => clearTimeout(timer);
  }, [feedbackMessage]);

  if (!session?.user) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Loader2 className="size-8 animate-spin text-primary" />
      </div>
    );
  }

  const { username } = session.user as User;
  const baseUrl =
    typeof window !== 'undefined'
      ? `${window.location.protocol}//${window.location.host}`
      : '';
  const profileUrl = `${baseUrl}/u/${username}`;

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(profileUrl);
    setCopied(true);
    setIsError(false);
    setFeedbackMessage('Link copied to clipboard');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-10">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-medium text-primary">Dashboard</p>
          <h1 className="mt-1 text-3xl font-bold tracking-tight sm:text-4xl">
            Welcome back, <span className="gradient-text">@{username}</span>
          </h1>
          <p className="mt-2 text-muted-foreground">
            Manage your inbox and share your anonymous feedback link.
          </p>
        </div>
        <Button variant="outline" asChild className="border-white/10 w-fit">
          <Link href="/">Back to home</Link>
        </Button>
      </div>

      {feedbackMessage && (
        <div
          className={cn(
            'mb-6 rounded-xl border px-4 py-3 text-sm',
            isError
              ? 'border-destructive/30 bg-destructive/10 text-destructive'
              : 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400'
          )}
        >
          {feedbackMessage}
        </div>
      )}

      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div className="glass-panel p-5 sm:col-span-2 lg:col-span-2">
          <div className="mb-3 flex items-center gap-2 text-sm font-medium text-muted-foreground">
            <Link2 className="size-4 text-primary" />
            Your public link
          </div>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <code className="flex-1 truncate rounded-lg border border-white/10 bg-black/20 px-4 py-3 text-sm text-foreground/90">
              {profileUrl}
            </code>
            <Button onClick={copyToClipboard} className="shrink-0 gap-2 shadow-lg shadow-primary/20">
              {copied ? (
                <>
                  <Check className="size-4" />
                  Copied
                </>
              ) : (
                <>
                  <Copy className="size-4" />
                  Copy link
                </>
              )}
            </Button>
          </div>
          <p className="mt-3 text-xs text-muted-foreground">
            Share this link anywhere — messages arrive anonymously in your inbox.
          </p>
        </div>

        <div className="glass-panel flex flex-col justify-between p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Inbox status</p>
              <p className="mt-1 font-semibold">
                {acceptMessages ? 'Accepting messages' : 'Paused'}
              </p>
            </div>
            <Switch
              {...register('acceptMessages')}
              checked={acceptMessages}
              onCheckedChange={handleSwitchChange}
              disabled={isSwitchLoading}
            />
          </div>
          <p className="mt-4 text-xs text-muted-foreground">
            Turn off when you want to pause new anonymous messages.
          </p>
        </div>

        <div className="glass-panel p-5">
          <div className="flex items-center gap-2 text-muted-foreground">
            <MessageSquare className="size-4 text-primary" />
            <span className="text-sm">Total messages</span>
          </div>
          <p className="mt-2 text-3xl font-bold">{messages.length}</p>
        </div>

        <div className="glass-panel p-5 sm:col-span-2">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Sparkles className="size-4 text-primary" />
            <span className="text-sm">Tip</span>
          </div>
          <p className="mt-2 text-sm leading-relaxed text-foreground/80">
            Add your link to your bio, stories, or team channel. The more you share it,
            the more honest feedback you collect.
          </p>
        </div>
      </div>

      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold">Your messages</h2>
        <Button
          variant="outline"
          size="sm"
          className="gap-2 border-white/10"
          onClick={() => fetchMessages(true)}
          disabled={isLoading}
        >
          {isLoading ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            <RefreshCcw className="size-4" />
          )}
          Refresh
        </Button>
      </div>

      {isLoading && messages.length === 0 ? (
        <div className="flex min-h-[200px] items-center justify-center glass-panel">
          <Loader2 className="size-8 animate-spin text-primary" />
        </div>
      ) : messages.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {messages.map((message, index) => (
            <MessageCard
              key={message._id || `message-${index}`}
              message={message}
              onMessageDeleteAction={handleDeleteMessage}
            />
          ))}
        </div>
      ) : (
        <div className="glass-panel flex flex-col items-center justify-center px-6 py-16 text-center">
          <div className="mb-4 flex size-14 items-center justify-center rounded-2xl bg-primary/15 text-primary">
            <Inbox className="size-7" />
          </div>
          <h3 className="text-lg font-semibold">No messages yet</h3>
          <p className="mt-2 max-w-sm text-sm text-muted-foreground">
            Share your link to start receiving anonymous feedback. Your inbox will
            show up here instantly.
          </p>
          <Button onClick={copyToClipboard} className="mt-6 gap-2">
            <Copy className="size-4" />
            Copy your link
          </Button>
        </div>
      )}
    </div>
  );
}

export default UserDashboard;
