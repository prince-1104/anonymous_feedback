import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import AuthProvider from '@/context/AuthProvider';
import { Toaster } from 'sonner'; 
import { Analytics } from "@vercel/analytics/next"

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'True Feedback',
  description: 'Real feedback from real people.',
};

interface RootLayoutProps {
  children: React.ReactNode;
}

export default async function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en" className="dark">
      <AuthProvider>
        <body className={`${inter.className} mesh-bg min-h-screen`}>
          {children}
          <Analytics/>
          <Toaster position="top-center" richColors /> 
        </body>
      </AuthProvider>
    </html>
  );
}
