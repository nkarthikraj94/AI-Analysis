import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";

export const metadata: Metadata = {
  title: "AI Complaint Analyzer",
  description: "Advanced AI-powered complaint management system",
  icons: {
    icon: "/favicon.png",
  }
};

import Providers from "@/components/Providers";
import { Toaster } from "sonner";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className="antialiased min-h-screen flex flex-col font-sans"
      >
        <Providers>
          <Navbar />
          <main className="flex-1">
            {children}
          </main>
          <Footer />
          <Toaster position="top-center" richColors />
        </Providers>
      </body>
    </html>
  );
}

function Footer() {
  return (
    <footer className="border-t py-8 bg-zinc-50 dark:bg-zinc-950">
      <div className="container mx-auto px-4 flex flex-col items-center justify-center gap-2 text-sm text-muted-foreground">
        <p>AI Complaint Analyzer System</p>
        <div className="flex gap-4">
          <span>Karthik Raj</span>
          <a href="https://github.com/nkarthikraj94/" target="_blank" rel="noopener noreferrer" className="hover:underline">GitHub</a>
          <a href="https://www.linkedin.com/in/karthik-raj-058a87145/" target="_blank" rel="noopener noreferrer" className="hover:underline">LinkedIn</a>
        </div>
      </div>
    </footer>
  );
}
