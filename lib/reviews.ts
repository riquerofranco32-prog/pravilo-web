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
    id: "review-1",
    author: "Javier Garrafa",
    role: "Cliente verificado en Google",
    rating: 5,
    date: "Reseña en Google Maps",
    highlight: "Excelente experiencia y atención",
    content:
      "Excelente. La atención y la guía de Juan en cada sesión hacen que todo el proceso sea seguro y progresivo. Sentí una descompresión y relajación muscular increíble desde el primer día.",
    initials: "JG",
    avatarBg: "bg-emerald-600",
  },
  {
    id: "review-2",
    author: "Matías Rossi",
    role: "Entrenamiento de movilidad y columna",
    rating: 5,
    date: "Reseña en Google Maps",
    highlight: "Alivio real en la zona lumbar y cervical",
    content:
      "Venía con dolores lumbares y mucha rigidez por pasar horas sentado trabajando. El trabajo de tracción y estiramiento en Pravilo te cambia la postura por completo. Salís liviano y con una sensación de eje única.",
    initials: "MR",
    avatarBg: "bg-blue-600",
  },
  {
    id: "review-3",
    author: "Sofía Valenzuela",
    role: "Sesión individual personalizada",
    rating: 5,
    date: "Reseña en Google Maps",
    highlight: "Atención 1 a 1 de primer nivel",
    content:
      "Me encantó que sea 100% individual. Juan te evalúa primero y adapta cada movimiento a tus posibilidades sin forzar. La combinación de movilidad previa y el aparato Pravilo es algo que no había probado nunca.",
    initials: "SV",
    avatarBg: "bg-amber-600",
  },
  {
    id: "review-4",
    author: "Esteban Morales",
    role: "Deportista / Movilidad articular",
    rating: 5,
    date: "Reseña en Google Maps",
    highlight: "Mayor rango articular y descompresión profunda",
    content:
      "Buscaba un complemento regenerativo para mi disciplina deportiva. La descompresión articular y la liberación de la fascia te dan un rango de movimiento que ningún estiramiento convencional logra.",
    initials: "EM",
    avatarBg: "bg-purple-600",
  },
];
