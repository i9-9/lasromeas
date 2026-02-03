import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Las Romeas – Chocolate de Origen",
  description:
    "Las Romeas: chocolatería Tree & Bean to Bar. Cacao fino de aroma, trazabilidad desde fincas, sin agregados ni conservantes. Villa Crespo, Buenos Aires.",
  keywords: [
    "chocolate artesanal",
    "bean to bar",
    "tree to bar",
    "cacao fino de aroma",
    "single origin",
    "Las Romeas",
    "alfajores harina de cacao",
    "bombones",
  ],
  icons: {
    icon: "/favicon.ico",
  },
  openGraph: {
    type: "website",
    locale: "es_AR",
    url: "https://lasromeas.com",
    siteName: "Las Romeas",
    title: "Las Romeas – Del Grano a la Barra de Chocolate",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      {/* Adobe Typekit: Trajan Pro 3 (títulos) + Archivo (body) */}
      <head>
        <link rel="preconnect" href="https://use.typekit.net" crossOrigin="anonymous" />
        <link rel="stylesheet" href="https://use.typekit.net/ken7mut.css" />
      </head>
      <body>{children}</body>
    </html>
  );
}
