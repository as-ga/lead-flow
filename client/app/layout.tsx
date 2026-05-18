import type { Metadata } from "next";
import "./globals.css";
import { Geist } from "next/font/google";
import { cn } from "@/lib/utils";
import { Providers } from "@/components/Providers";

const geist = Geist({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: "LeadFlow - Smart Leads Dashboard",
  description:
    "LeadFlow is a powerful lead management system designed to help you capture, organize, and nurture your leads effectively. With our intuitive interface and robust features, you can streamline your sales process and boost your conversion rates. Start managing your leads with LeadFlow today!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={cn("font-sans", geist.variable)}>
      <body className="min-h-full flex flex-col">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
