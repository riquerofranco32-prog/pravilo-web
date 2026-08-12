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
    title: "Experiencia Individual",
    price: "$45.000",
    priceNumber: 45000,
    desc: "Evaluación integral + sesión completa (1h 30m).",
    features: [
      "Evaluación integral incluida",
      "Sesión de 1h 30m",
      "Ideal para probar el método",
    ],
  },
  {
    title: "Plan Esencial",
    price: "$280.000",
    priceNumber: 280000,
    desc: "Paquete de 8 experiencias ($35.000 c/u).",
    features: [
      "8 experiencias ($35.000 c/u)",
      "Ahorrás vs. la individual",
      "El más elegido",
    ],
    highlight: true,
  },
  {
    title: "Plan Evolución",
    price: "$360.000",
    priceNumber: 360000,
    desc: "Paquete de 12 experiencias ($30.000 c/u).",
    features: [
      "12 experiencias ($30.000 c/u)",
      "El mejor precio por sesión",
      "Para un proceso más profundo",
    ],
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
