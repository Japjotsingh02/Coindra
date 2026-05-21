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
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var theme = localStorage.getItem('theme') || 'dark';
                  document.documentElement.className = theme + ' ${inter.variable}';
                } catch (e) {}
              })();
            `,
          }}
        />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </head>
      <body className="antialiased min-h-screen text-label bg-[#050505]">
        <div
          className="fixed inset-0 -z-10 bg-[#080A0F] pointer-events-none overflow-hidden"
          aria-hidden
        >
          <div className="absolute w-[600px] h-[600px] rounded-full blur-[120px] bg-amber-500/6 -left-[10%] top-[5%]" />
          <div className="absolute w-[500px] h-[400px] rounded-full blur-[120px] bg-amber-600/4 right-0 bottom-[-15%]" />
          <div className="absolute w-[400px] h-[400px] rounded-full blur-[120px] bg-sky-500/3 top-[35%] left-[35%]" />
        </div>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
