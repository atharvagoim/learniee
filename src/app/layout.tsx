import type { Metadata } from "next";
import "./globals.css";
import { ToastProvider } from "@/components/ui/toast";

export const metadata: Metadata = {
  title: "Learniee — Find courses your child will love",
  description:
    "Learniee helps parents discover, compare and enrol in courses across every subject their child is curious about.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-bg text-ink font-sans">
        <ToastProvider>{children}</ToastProvider>
      </body>
    </html>
  );
}
