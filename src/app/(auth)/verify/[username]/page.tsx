'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import axios, { AxiosError } from 'axios';
import * as z from 'zod';
import { verifySchema } from '@/schemas/verifySchema';
import { ApiResponse } from '../../../../../types/ApiResponse';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { AuthShell } from '@/components/layout/AuthShell';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

export default function VerifyAccount() {
  const router = useRouter();
  const { username } = useParams<{ username: string }>();

  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof verifySchema>>({
    resolver: zodResolver(verifySchema),
    defaultValues: { code: '' },
  });

  const onSubmit = async (data: z.infer<typeof verifySchema>) => {
    if (!username) {
      setMessage('Username is missing from the URL.');
      setIsError(true);
      return;
    }

    setIsSubmitting(true);
    setMessage('');

    try {
      const response = await axios.post<ApiResponse>('/api/verify-code', {
        username,
        code: data.code,
      });

      setMessage(response.data.message);
      setIsError(false);
      setTimeout(() => router.replace('/sign-in'), 1500);
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      setMessage(
        axiosError.response?.data.message ??
          'An unexpected error occurred. Please try again.'
      );
      setIsError(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthShell
      title="Verify your email"
      subtitle={`Enter the 6-digit code we sent for @${username ?? 'your account'}`}
    >
      {message && (
        <div
          className={cn(
            'mb-5 rounded-lg border px-4 py-3 text-sm',
            isError
              ? 'border-destructive/30 bg-destructive/10 text-destructive'
              : 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400'
          )}
        >
          {message}
        </div>
      )}

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
          <FormField
            name="code"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Verification code</FormLabel>
                <Input
                  {...field}
                  type="text"
                  inputMode="numeric"
                  pattern="\d*"
                  maxLength={6}
                  placeholder="000000"
                  className="h-12 border-white/10 bg-black/20 text-center text-lg tracking-[0.4em] font-mono"
                />
                <FormMessage />
              </FormItem>
            )}
          />
          <Button
            type="submit"
            className="h-11 w-full shadow-lg shadow-primary/25"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 size-4 animate-spin" />
                Verifying...
              </>
            ) : (
              'Verify account'
            )}
          </Button>
        </form>
      </Form>
    </AuthShell>
  );
}
