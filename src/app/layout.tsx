import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google"; // [!code ++]
import Providers from "./providers";
import "@/styles/globals.css";

// Configure the fonts [!code ++]
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Oomaar Bank Finance & Online System",
  description: "Enterprise-level digital banking platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      {/* Apply the font variables to the body */}
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased font-sans`}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
