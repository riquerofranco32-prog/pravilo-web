export type Plan = {
  title: string;
  price: string;
  priceNumber: number;
  desc: string;
  highlight?: boolean;
};

export const PLANES: Plan[] = [
  {
    title: "Experiencia Individual",
    price: "$45.000",
    priceNumber: 45000,
    desc: "Evaluación integral + sesión completa (1h 30m).",
  },
  {
    title: "Plan Esencial",
    price: "$280.000",
    priceNumber: 280000,
    desc: "Paquete de 8 experiencias ($35.000 c/u).",
    highlight: true,
  },
  {
    title: "Plan Evolución",
    price: "$360.000",
    priceNumber: 360000,
    desc: "Paquete de 12 experiencias ($30.000 c/u).",
  },
  {
    title: "Funcional 2x semana",
    price: "$55.000/mes",
    priceNumber: 55000,
    desc: "Entrenamiento funcional, dos sesiones semanales.",
  },
  {
    title: "Funcional 3x semana",
    price: "$70.000/mes",
    priceNumber: 70000,
    desc: "Entrenamiento funcional, tres sesiones semanales.",
  },
];
