import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { WebSocketProvider } from '@app/contexts/WebSocketContext';
import { GameInfoProvider } from "./contexts/GameInfoContext";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "The swicher",
  description: "Juega gratis al juego de mesa swicher con tus amigos!",
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
        <GameInfoProvider>
          <WebSocketProvider>
            {children}
          </WebSocketProvider>
        </GameInfoProvider>
      </body>
    </html>
  );
}
