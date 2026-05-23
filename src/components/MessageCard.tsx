'use client';

import React, { useState } from 'react';
import axios, { AxiosError } from 'axios';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { MessageSquareQuote, Trash2 } from 'lucide-react';
import { Message } from '@/lib/models/User';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from './ui/button';
import { ApiResponse } from '../../types/ApiResponse';
import { cn } from '@/lib/utils';

dayjs.extend(relativeTime);

type MessageCardProps = {
  message: Message;
  onMessageDeleteAction: (messageId: string) => void;
};

export function MessageCard({ message, onMessageDeleteAction }: MessageCardProps) {
  const [feedback, setFeedback] = useState('');
  const [isError, setIsError] = useState(false);

  const handleDeleteConfirm = async () => {
    try {
      const response = await axios.delete<ApiResponse>(
        `/api/delete-message/${message._id}`
      );
      setIsError(false);
      setFeedback(response.data.message);
      onMessageDeleteAction(message._id);
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      setIsError(true);
      setFeedback(axiosError.response?.data.message ?? 'Failed to delete message');
    }
    setTimeout(() => setFeedback(''), 4000);
  };

  return (
    <Card className="group border-white/10 bg-card/60 transition-all hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex gap-3">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/15 text-primary">
              <MessageSquareQuote className="size-5" />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Anonymous
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                {dayjs(message.createdAt).fromNow()} ·{' '}
                {dayjs(message.createdAt).format('MMM D, YYYY')}
              </p>
            </div>
          </div>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="size-8 shrink-0 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100 hover:bg-destructive/10 hover:text-destructive"
              >
                <Trash2 className="size-4" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent className="border-white/10 bg-card">
              <AlertDialogHeader>
                <AlertDialogTitle>Delete this message?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. The message will be permanently
                  removed from your inbox.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel className="border-white/10">Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleDeleteConfirm}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                >
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <p className="text-[15px] leading-relaxed text-foreground/90">{message.content}</p>
        {feedback && (
          <p
            className={cn(
              'mt-3 text-xs',
              isError ? 'text-destructive' : 'text-emerald-400'
            )}
          >
            {feedback}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
