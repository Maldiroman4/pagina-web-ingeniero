import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Metalúrgica JOR-CIT | Ingeniería de Engranajes Premium",
  description: "Diseño, fabricación y reconstrucción de engranajes y piezas industriales de alta precisión. Innovación metalmecánica con los más altos estándares de calidad.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className="h-full antialiased scroll-smooth">
      <body className="min-h-full flex flex-col bg-[#060b16] text-[#f8fafc]">
        {children}
      </body>
    </html>
  );
}
