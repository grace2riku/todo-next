import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "TODO リスト",
  description: "シンプルなTODOリストアプリケーション",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <body className="bg-gray-100 min-h-screen">
        {children}
      </body>
    </html>
  );
}
