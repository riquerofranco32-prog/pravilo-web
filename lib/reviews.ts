export interface GoogleReviewItem {
  id: string;
  author: string;
  role?: string;
  rating: number;
  date: string;
  content: string;
  highlight?: string;
  initials: string;
  avatarBg: string;
}

export const GOOGLE_REVIEWS: GoogleReviewItem[] = [
  {
    id: "review-rocio",
    author: "Rocío Ríos",
    role: "Cliente verificado en Google Maps",
    rating: 5,
    date: "Hace 1 día",
    highlight: "Sentí como mi columna se descomprimía",
    content:
      "Increíble lugar y práctica, sentí como mi columna se descomprimía mientras mejoraba mi movilidad, súper divertido y seguro. Lo mega recomiendo",
    initials: "RR",
    avatarBg: "bg-rose-600",
  },
  {
    id: "review-cg",
    author: "Servicio C&G Welding",
    role: "Cliente verificado en Google Maps",
    rating: 5,
    date: "Hace 3 días",
    highlight: "Llegué con dolor de ciático y me fui sin dolor",
    content:
      "Experiencia increíble mucho dolor de ciatico con el que llegue y despues de la sección me fui sin dolor. recomiendo es algo único gracias profe.",
    initials: "CG",
    avatarBg: "bg-blue-600",
  },
  {
    id: "review-jonas",
    author: "Jona -Jonas-",
    role: "Cliente verificado en Google Maps",
    rating: 5,
    date: "Hace 1 semana",
    highlight: "Muy bueno el lugar y la atención",
    content:
      "Muy bueno el lugar en Plottier! la atención. Me encantó la práctica. Recomiendooo 💪",
    initials: "JJ",
    avatarBg: "bg-amber-600",
  },
  {
    id: "review-javier",
    author: "Javier Garrafa",
    role: "Cliente verificado en Google Maps",
    rating: 5,
    date: "Hace 2 semanas",
    highlight: "Exelente",
    content: "Exelente",
    initials: "JG",
    avatarBg: "bg-emerald-600",
  },
];
