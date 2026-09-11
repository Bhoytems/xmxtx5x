import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Desk — Account Management",
  description: "MT4/MT5 managed account operations console",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-base-900 font-sans antialiased">
        {children}
      </body>
    </html>
  );
}
