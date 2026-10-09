import type { Metadata } from "next";
import { Suspense } from "react";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layout/navbar";
import { AuthProvider } from "@/context/AuthContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ATRP | Applicant Tracking & Recruitment Portal",
  description:
    "An Unstop-inspired modern recruitment platform uniting job seekers and employers with automated resume parsing, screening scores, and intuitive applicant tracking pipelines.",
  keywords: [
    "Recruitment Portal",
    "Applicant Tracking System",
    "Jobs",
    "Internships",
    "Unstop",
    "Resume Screening",
    "Interview Scheduling",
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-slate-50 text-slate-900 selection:bg-blue-100 selection:text-blue-900">
        <AuthProvider>
          <Suspense fallback={<div className="h-16 border-b border-slate-200 bg-white" />}>
            <Navbar />
          </Suspense>
          <main className="flex-1 flex flex-col">{children}</main>
          <footer className="border-t border-slate-200 bg-white py-8 text-center text-xs text-slate-500">
            <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
              <p>© 2026 ATRP - Applicant Tracking & Recruitment Portal. Inspired by Unstop.</p>
              <div className="flex items-center gap-6 text-slate-500">
                <span className="hover:text-blue-600 cursor-pointer">Security & RBAC</span>
                <span className="hover:text-blue-600 cursor-pointer">State Machine</span>
                <span className="hover:text-blue-600 cursor-pointer">Audit Logs</span>
              </div>
            </div>
          </footer>
        </AuthProvider>
      </body>
    </html>
  );
}
