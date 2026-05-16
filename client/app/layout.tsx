import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "LeadFlow",
  description:
    "LeadFlow is a powerful lead management system designed to help you capture, organize, and nurture your leads effectively. With our intuitive interface and robust features, you can streamline your sales process and boost your conversion rates. Start managing your leads with LeadFlow today!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
