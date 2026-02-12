import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "RE2 - Local Business Sales Platform",
  description: "The first sales platform built for companies selling to local businesses",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="font-sans antialiased">
        {children}
      </body>
    </html>
  );
}
