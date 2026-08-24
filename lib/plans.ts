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
    desc: "Precio de lanzamiento · 60 min.",
    features: [
      "Duración de la sesión: 60 minutos",
      "Evaluación inicial incluida",
      "Sesión uno a uno guiada en máquina Pravilo",
      "Ideal para probar el método",
    ],
  },
  {
    title: "8 Sesiones",
    price: "$240.000",
    priceNumber: 240000,
    desc: "$30.000 por sesión · Vigencia: 2 meses.",
    features: [
      "Duración por sesión: 60 minutos",
      "Evaluación y seguimiento continuo",
      "Sesiones uno a uno guiadas",
      "$30.000 por sesión · Vigencia 2 meses",
    ],
    highlight: true,
  },
  {
    title: "12 Sesiones",
    price: "$300.000",
    priceNumber: 300000,
    desc: "$25.000 por sesión · Vigencia: 3 meses.",
    features: [
      "Duración por sesión: 60 minutos",
      "Evaluación y seguimiento continuo",
      "Sesiones uno a uno guiadas",
      "$25.000 por sesión · Mayor ahorro",
    ],
  },
];

export const PLANES: Plan[] = PLANES_EXPERIENCIA;
