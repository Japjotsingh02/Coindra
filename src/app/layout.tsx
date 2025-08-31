import "@/app/globals.css";
import Providers from "./providers";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var theme = localStorage.getItem('theme') || 'dark';
                  document.documentElement.className = theme;
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
      <body className="font-sans antialiased bg-background text-gray-900">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
