export const dynamic = 'force-dynamic';

import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { cn } from '@/lib/utils';
import Sidebar from '@/components/Sidebar';
import { Toaster } from 'sonner';
import ThemeProvider from '@/components/theme/Provider';
import { ChatProvider } from '@/lib/hooks/useChat';
import { AuthProvider } from '@/lib/hooks/useAuth';
import AuthModal from '@/components/AuthModal';

const inter = Inter({
  weight: ['300', '400', '500', '600'],
  subsets: ['latin'],
  display: 'swap',
  fallback: ['system-ui', 'sans-serif'],
});

export const metadata: Metadata = {
  title: 'Bokari - Journaliste IA Africain',
  description:
    'Bokari est un journaliste IA intelligent qui combat les fake news en Afrique. Recherche, verifie, informe.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html className="h-full" lang="fr" suppressHydrationWarning>
      <body className={cn('h-full antialiased', inter.className)} suppressHydrationWarning>
        <ThemeProvider>
          <AuthProvider>
            <ChatProvider>
              <Sidebar>{children}</Sidebar>
              <AuthModal />
              <Toaster
                toastOptions={{
                  unstyled: true,
                  classNames: {
                    toast:
                      'bg-light-secondary dark:bg-dark-secondary dark:text-white/70 text-black-70 rounded-lg p-4 flex flex-row items-center space-x-2',
                  },
                }}
              />
            </ChatProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
