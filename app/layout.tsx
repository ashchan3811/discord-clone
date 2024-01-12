import React from "react";
import type { Metadata } from "next";
import { Open_Sans } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";

import "./globals.css";
import { cn } from "@/lib/utils";

import ToastrProvider from "@/components/providers/ToastrProvider";
import ModalProvider from "@/components/providers/ModalProvider";
import ThemeProvider from "@/components/providers/ThemeProvider";
import SocketProvider from "@/components/providers/SocketProvider";

const font = Open_Sans({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Discord Clone App",
  description: "Discord Clone App",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning={true}>
        <body className={cn(font.className, "bg-gray-100 dark:bg-[#313338]")}>
          <ThemeProvider
            attribute={"class"}
            defaultTheme={"dark"}
            enableSystem={true}
            disableTransitionOnChange={true}
            storageKey={"discord-clone-theme"}
          >
            <SocketProvider>
              <ToastrProvider />
              <ModalProvider />
              {children}
            </SocketProvider>
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
