import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";

export const metadata: Metadata = {
  title: "PlayerEval – Youth Soccer Development",
  description:
    "Quick coach evaluations. Clear parent progress. Better player development.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="en">
        <head>
          <link
            href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600&display=swap"
            rel="stylesheet"
          />
        </head>
        <body className="font-sans antialiased bg-gray-50 text-gray-900">
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
