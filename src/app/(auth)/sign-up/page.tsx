'use client';

import { ApiResponse } from '../../../../types/ApiResponse';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useDebounceValue } from 'usehooks-ts';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import axios, { AxiosError } from 'axios';
import { CheckCircle2, Loader2, XCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { signUpSchema } from '@/schemas/signUpSchema';
import { toast } from 'sonner';
import { AuthShell } from '@/components/layout/AuthShell';
import { cn } from '@/lib/utils';

export default function SignUpForm() {
  const [username, setUsername] = useState('');
  const [usernameMessage, setUsernameMessage] = useState('');
  const [isCheckingUsername, setIsCheckingUsername] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [debouncedUsername] = useDebounceValue(username, 500);

  const router = useRouter();

  const form = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      username: '',
      email: '',
      password: '',
    },
  });

  useEffect(() => {
    const checkUsernameUnique = async () => {
      if (!debouncedUsername) return;
      setIsCheckingUsername(true);
      setUsernameMessage('');
      try {
        const response = await axios.get<ApiResponse>(
          `/api/check-username-unique?username=${debouncedUsername}`
        );
        setUsernameMessage(response.data.message);
      } catch (error) {
        const axiosError = error as AxiosError<ApiResponse>;
        setUsernameMessage(
          axiosError.response?.data.message ?? 'Error checking username'
        );
      } finally {
        setIsCheckingUsername(false);
      }
    };
    checkUsernameUnique();
  }, [debouncedUsername]);

  const onSubmit = async (data: z.infer<typeof signUpSchema>) => {
    setIsSubmitting(true);
    try {
      const response = await axios.post<ApiResponse>('/api/sign-up', data);
      toast.success(response.data.message);
      router.replace(`/verify/${username}`);
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast.error(
        axiosError.response?.data.message ??
          'There was a problem with your sign-up. Please try again.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const isUsernameAvailable = usernameMessage === 'Username is unique';

  return (
    <AuthShell
      title="Create your account"
      subtitle="Get your unique link and start collecting feedback"
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
          <FormField
            name="username"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Username</FormLabel>
                <Input
                  {...field}
                  className="h-11 border-white/10 bg-black/20"
                  placeholder="cedok"
                  onChange={(e) => {
                    field.onChange(e);
                    setUsername(e.target.value);
                  }}
                />
                {isCheckingUsername && (
                  <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <Loader2 className="size-3 animate-spin" />
                    Checking availability...
                  </p>
                )}
                {!isCheckingUsername && usernameMessage && (
                  <p
                    className={cn(
                      'flex items-center gap-1.5 text-xs',
                      isUsernameAvailable ? 'text-emerald-400' : 'text-destructive'
                    )}
                  >
                    {isUsernameAvailable ? (
                      <CheckCircle2 className="size-3.5" />
                    ) : (
                      <XCircle className="size-3.5" />
                    )}
                    {usernameMessage}
                  </p>
                )}
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            name="email"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <Input
                  {...field}
                  type="email"
                  className="h-11 border-white/10 bg-black/20"
                  placeholder="you@example.com"
                />
                <p className="text-xs text-muted-foreground">
                  We&apos;ll send a verification code
                </p>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            name="password"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <Input
                  type="password"
                  {...field}
                  className="h-11 border-white/10 bg-black/20"
                  placeholder="••••••••"
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
                Creating account...
              </>
            ) : (
              'Create account'
            )}
          </Button>
        </form>
      </Form>
      <p className="mt-6 text-center text-sm text-muted-foreground">
        Already have an account?{' '}
        <Link href="/sign-in" className="font-medium text-primary hover:underline">
          Sign in
        </Link>
      </p>
    </AuthShell>
  );
}
