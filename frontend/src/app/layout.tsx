import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "AI Resume Customizer | ATS-Optimized Resume Tailoring",
  description:
    "Tailor your resume for any Job Description in seconds. Powered by AI with ATS scoring, keyword alignment, match metrics, and multi-format export.",
  keywords: ["resume customizer", "AI resume", "ATS optimizer", "job application", "cover letter generator"],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} min-h-screen antialiased bg-slate-950 text-slate-100`}>
        {children}
      </body>
    </html>
  );
}
