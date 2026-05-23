'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { signIn } from 'next-auth/react';
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { signInSchema } from '@/schemas/signInSchemas';
import { AuthShell } from '@/components/layout/AuthShell';
import { Loader2 } from 'lucide-react';
import { useState } from 'react';

export default function SignInForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      identifier: '',
      password: '',
    },
  });

  const onSubmit = async (data: z.infer<typeof signInSchema>) => {
    setIsLoading(true);
    const result = await signIn('credentials', {
      redirect: false,
      identifier: data.identifier,
      password: data.password,
    });
    setIsLoading(false);

    if (result?.error) {
      toast.error(
        result.error === 'CredentialsSignin'
          ? 'Incorrect username or password'
          : result.error
      );
      return;
    }

    if (result?.url) {
      toast.success('Welcome back!');
      router.replace('/dashboard');
    }
  };

  return (
    <AuthShell
      title="Welcome back"
      subtitle="Sign in to manage your anonymous inbox"
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
          <FormField
            name="identifier"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email or username</FormLabel>
                <Input
                  {...field}
                  className="h-11 border-white/10 bg-black/20"
                  placeholder="you@example.com"
                />
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
            className="h-11 w-full shadow-lg shadow-primary/25"
            type="submit"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 size-4 animate-spin" />
                Signing in...
              </>
            ) : (
              'Sign in'
            )}
          </Button>
        </form>
      </Form>
      <p className="mt-6 text-center text-sm text-muted-foreground">
        Don&apos;t have an account?{' '}
        <Link href="/sign-up" className="font-medium text-primary hover:underline">
          Create one
        </Link>
      </p>
    </AuthShell>
  );
}
