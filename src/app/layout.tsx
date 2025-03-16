import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import AuthProvider from '@/components/AuthProvider'
import { Toaster } from 'sonner'

const inter = Inter({
  subsets: ["latin"],
  display: 'swap',
  preload: true,
});

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL(process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000'),
  title: "Link in Bio | Your Digital Identity",
  description: "A modern, customizable link-in-bio solution for your social media presence.",
  keywords: ['link in bio', 'social media', 'profile links', 'digital identity'],
  authors: [{ name: 'Your Name' }],
  openGraph: {
    title: 'Link in Bio | Your Digital Identity',
    description: 'A modern, customizable link-in-bio solution for your social media presence.',
    type: 'website',
    siteName: 'Link in Bio',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Link in Bio | Your Digital Identity',
    description: 'A modern, customizable link-in-bio solution for your social media presence.',
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className} suppressHydrationWarning>
        <AuthProvider>
          {children}
          <Toaster position="top-center" />
        </AuthProvider>
      </body>
    </html>
  );
}
