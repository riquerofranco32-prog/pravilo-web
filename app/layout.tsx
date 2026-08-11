import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { SITE_URL } from "@/lib/constants";
import GoogleAnalytics from "@/components/GoogleAnalytics";
import WhatsAppFloat from "@/components/WhatsAppFloat";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const title = "PRAVILO ARG | Primer Centro Pravilo de Argentina — Neuquén";
const description =
  "Entrenamiento y terapia de movilidad con el método Pravilo. Sesiones individuales y personalizadas, adaptadas a todas las edades y niveles, en Neuquén.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title,
  description,
  keywords: [
    "Pravilo",
    "Pravilo Argentina",
    "Pravilo Neuquén",
    "movilidad",
    "fascia",
    "entrenamiento personalizado",
    "terapia de movimiento",
  ],
  openGraph: {
    title,
    description,
    url: SITE_URL,
    siteName: "PRAVILO ARG",
    locale: "es_AR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="es-AR"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">
        {children}
        <WhatsAppFloat />
        <GoogleAnalytics />
      </body>
    </html>
  );
}
