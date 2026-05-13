import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SDR Support Bot",
  description: "Udemy Business APAC · Internal SDR Knowledge Base",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body className="h-full">{children}</body>
    </html>
  );
}
