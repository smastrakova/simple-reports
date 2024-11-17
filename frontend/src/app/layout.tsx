import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Simple Reports App",
  description: "Tool for managing your reports",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
