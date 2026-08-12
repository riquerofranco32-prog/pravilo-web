import type { Metadata } from "next";
import { Bebas_Neue, Barlow_Condensed, Barlow } from "next/font/google";
import "./globals.css";
import { SITE_URL } from "@/lib/constants";
import GoogleAnalytics from "@/components/GoogleAnalytics";
import WhatsAppFloat from "@/components/WhatsAppFloat";

const display = Bebas_Neue({
  variable: "--font-display",
  weight: "400",
  subsets: ["latin"],
});

const condensed = Barlow_Condensed({
  variable: "--font-condensed",
  weight: ["500", "600", "700", "800"],
  subsets: ["latin"],
});

const body = Barlow({
  variable: "--font-body",
  weight: ["400", "500", "600"],
  subsets: ["latin"],
});

const title =
  "PRAVILO ARG | Primer Centro Pravilo de Argentina — Plottier, Neuquén";
const description =
  "Entrenamiento y terapia de movilidad con el método Pravilo. Sesiones individuales y personalizadas, adaptadas a todas las edades y niveles, en Plottier, Neuquén.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title,
  description,
  alternates: { canonical: SITE_URL },
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
      className={`${display.variable} ${condensed.variable} ${body.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">
        {children}
        <WhatsAppFloat />
        <GoogleAnalytics />
      </body>
    </html>
  );
}
