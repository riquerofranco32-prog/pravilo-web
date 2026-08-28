export type Plan = {
  title: string;
  price: string;
  priceNumber: number;
  desc: string;
  features: string[];
  highlight?: boolean;
};

export const PLANES_EXPERIENCIA: Plan[] = [
  {
    title: "1 Sesión Individual",
    price: "$35.000",
    priceNumber: 35000,
    desc: "Sesión 1 a 1 guiada · Duración completa: 60 min.",
    features: [
      "Duración de la sesión: 60 minutos completos",
      "Evaluación inicial postural y biomecánica",
      "Sesión 1 a 1 guiada exclusivamente por Juan en máquina PRAVILO",
      "Descompresión vertebral integral y apertura fascial 360°",
      "Calibración personalizada de arneses y tensión progresiva",
      "Seguimiento y recomendaciones de integración post-sesión",
    ],
    highlight: true,
  },
];

export const PLANES: Plan[] = PLANES_EXPERIENCIA;
