import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Apple Developer Library Archive - Real-Time Explorer',
  description: 'Real-time interactive browser and inspector for Apple Developer Archive Navigation Library (5,219 documents).',
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/icon.svg', type: 'image/svg+xml' }
    ],
    shortcut: '/favicon.ico',
    apple: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/favicon.ico" />
      </head>
      <body className="antialiased bg-[#FFFFFF] text-[#0F172A] selection:bg-[#007AFF]/20 selection:text-[#007AFF]">
        {children}
      </body>
    </html>
  );
}
