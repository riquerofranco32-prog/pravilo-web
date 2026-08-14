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
    desc: "Precio de lanzamiento.",
    features: [
      "Precio de lanzamiento",
      "Evaluación incluida",
      "Ideal para probar el método",
    ],
  },
  {
    title: "8 Sesiones",
    price: "$240.000",
    priceNumber: 240000,
    desc: "$30.000 por sesión. Vigencia: 2 meses.",
    features: ["$30.000 por sesión", "Vigencia: 2 meses", "Recomendado"],
    highlight: true,
  },
  {
    title: "12 Sesiones",
    price: "$300.000",
    priceNumber: 300000,
    desc: "$25.000 por sesión. Vigencia: 3 meses.",
    features: ["$25.000 por sesión", "Vigencia: 3 meses", "Mayor ahorro"],
  },
];

export const PLANES_FUNCIONAL: Plan[] = [
  {
    title: "Funcional 2x semana",
    price: "$55.000/mes",
    priceNumber: 55000,
    desc: "Entrenamiento funcional, dos sesiones semanales.",
    features: [
      "Dos sesiones semanales",
      "Grupos reducidos",
      "Complementa cualquier deporte",
    ],
  },
  {
    title: "Funcional 3x semana",
    price: "$70.000/mes",
    priceNumber: 70000,
    desc: "Entrenamiento funcional, tres sesiones semanales.",
    features: [
      "Tres sesiones semanales",
      "Mayor progresión",
      "Seguimiento más cercano",
    ],
  },
];

export const PLANES: Plan[] = [...PLANES_EXPERIENCIA, ...PLANES_FUNCIONAL];
