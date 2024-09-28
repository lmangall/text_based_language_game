import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Learn while playing",
  description: "Text based game for language learning",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
