import "@/app/globals.css"
import Providers from "./providers";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body style={{ backgroundColor: "#080a0b" }} className="text-gray-900">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}

