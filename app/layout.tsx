import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import ToasterContext from "./context/ToasterContext";
import "./globals.css";
import AuthContext from "./context/AuthContext";
import ActiveStatus from "./components/ActiveStatus";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Chat App",
  description: "Mesenger clone chat app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AuthContext>
          <ToasterContext />
          <ActiveStatus/>
          {children}
        </AuthContext>
      </body>
    </html>
  );
}
