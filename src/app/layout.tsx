import '@/app/globals.css';
import Providers from './providers';
import { Inter } from 'next/font/google';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable} suppressHydrationWarning>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </head>
      <body className="antialiased min-h-screen text-label bg-background-app">
        <div
          className="fixed inset-0 -z-10 bg-background-dark pointer-events-none overflow-hidden"
          aria-hidden
        >
          <div className="absolute w-[600px] h-[600px] rounded-full blur-[120px] ambient-orb-warm -left-[10%] top-[5%]" />
          <div className="absolute w-[500px] h-[400px] rounded-full blur-[120px] ambient-orb-amber right-0 bottom-[-15%]" />
          <div className="absolute w-[400px] h-[400px] rounded-full blur-[120px] ambient-orb-sky top-[35%] left-[35%]" />
        </div>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
