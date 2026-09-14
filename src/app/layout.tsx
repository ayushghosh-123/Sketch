import type { Metadata } from "next";
import { Manrope, Anton } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
});

const anton = Anton({
  variable: "--font-anton",
  weight: "400",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Sketch | Describe it. Research it. Sketch it.",
  description:
    "Turn your idea into an intelligent, editable software architecture. You bring the idea. Bring your research if you have it. Sketch figures out the rest.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html
        lang="en"
        className={`${manrope.variable} ${anton.variable} dark h-full antialiased`}
      >
        <body className="min-h-screen bg-black text-neutral-100 flex flex-col selection:bg-orange-500/30 selection:text-orange-200 font-sans">
          <Navbar />
          <main className="flex-1 flex flex-col">{children}</main>
          <Footer />
        </body>
      </html>
    </ClerkProvider>
  );
}