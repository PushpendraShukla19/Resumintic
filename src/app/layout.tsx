
import type {Metadata} from 'next';
import './globals.css';
import { AppHeader } from '@/components/layout/AppHeader';
import { AppFooter } from '@/components/layout/AppFooter';
import { Toaster } from "@/components/ui/toaster";

export const metadata: Metadata = {
  title: {
    default: 'Resumintic: AI-Powered ATS-Friendly Resume Builder',
    template: '%s | Resumintic',
  },
  description: 'Create a professional, ATS-friendly resume in minutes with Resumintic. Leverage AI to enhance your resume with smart suggestions, keywords, and modern templates for your career journey.',
  keywords: ['AI resume builder', 'ATS-friendly resume', 'resume creator', 'online resume maker', 'free resume builder', 'professional resume templates', 'resume optimization', 'AI resume writer'],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased flex flex-col min-h-screen" suppressHydrationWarning={true}>
        <AppHeader />
        <main className="flex-grow container mx-auto px-4 py-8">
          {children}
        </main>
        <AppFooter />
        <Toaster />
      </body>
    </html>
  );
}
