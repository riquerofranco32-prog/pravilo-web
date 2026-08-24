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

export const PLANES: Plan[] = PLANES_EXPERIENCIA;

