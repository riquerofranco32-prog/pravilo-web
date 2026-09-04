import type { Metadata } from "next";
import { Barlow_Condensed, Barlow } from "next/font/google";
import "./globals.css";
import {
  GOOGLE_REVIEWS_URL,
  INSTAGRAM_URL,
  SITE_URL,
  WHATSAPP_DISPLAY_NUMBER,
} from "@/lib/constants";
import { GOOGLE_REVIEWS } from "@/lib/reviews";
import GoogleAnalytics from "@/components/GoogleAnalytics";
import WhatsAppFloat from "@/components/WhatsAppFloat";

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

// Único bloque JSON-LD de negocio del sitio (antes había uno acá y otro
// distinto en app/page.tsx, con @type, teléfono, coordenadas y reviewCount
// contradictorios entre sí — Google podía interpretarlos como dos negocios
// distintos). Rating y reseñas se calculan desde lib/reviews.ts para que
// nunca queden desactualizados a mano.
const avgRating = (
  GOOGLE_REVIEWS.reduce((sum, r) => sum + r.rating, 0) / GOOGLE_REVIEWS.length
).toFixed(1);

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "HealthClub",
  name: "PRAVILO ARG",
  description:
    "Primer centro de descompresión vertebral, tracción y reeducación miofascial con el método Pravilo en Argentina.",
  url: SITE_URL,
  // TODO(negocio): confirmar el teléfono oficial a publicar en Google — se
  // usa el mismo número del botón de WhatsApp por ser el único confirmado.
  telephone: WHATSAPP_DISPLAY_NUMBER,
  address: {
    "@type": "PostalAddress",
    addressLocality: "Plottier",
    addressRegion: "Neuquén",
    addressCountry: "AR",
  },
  geo: {
    "@type": "GeoCoordinates",
    latitude: -38.944887,
    longitude: -68.2206435,
  },
  priceRange: "$$$",
  sameAs: [INSTAGRAM_URL, GOOGLE_REVIEWS_URL],
  aggregateRating: {
    "@type": "AggregateRating",
    ratingValue: avgRating,
    reviewCount: String(GOOGLE_REVIEWS.length),
    bestRating: "5",
    worstRating: "1",
  },
  review: GOOGLE_REVIEWS.map((r) => ({
    "@type": "Review",
    author: {
      "@type": "Person",
      name: r.author,
    },
    reviewRating: {
      "@type": "Rating",
      ratingValue: String(r.rating),
      bestRating: "5",
    },
    reviewBody: r.content,
  })),
  openingHoursSpecification: [
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      opens: "09:00",
      closes: "20:30",
    },
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Saturday"],
      opens: "09:30",
      closes: "17:30",
    },
  ],
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="es-AR"
      className={`${condensed.variable} ${body.variable} h-full antialiased`}
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-full flex flex-col bg-background text-foreground">
        {children}
        <WhatsAppFloat />
        <GoogleAnalytics />
      </body>
    </html>
  );
}

