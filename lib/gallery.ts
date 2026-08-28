export interface GalleryImageItem {
  id: string;
  src: string;
  alt: string;
  priority?: boolean;
  visible?: boolean;
}

export const DEFAULT_GALLERY_IMAGES: GalleryImageItem[] = [
  {
    id: "gal-1",
    src: "/images/pravilo-prioridad-asistencia-extension.jpg",
    alt: "Asistencia e inducción biomecánica en arco invertido en suspensión",
    priority: true,
    visible: true,
  },
  {
    id: "gal-2",
    src: "/images/pravilo-prioridad-inversion-total.jpg",
    alt: "Inversión total vertical asistida con tracción en tobillos",
    priority: true,
    visible: true,
  },
  {
    id: "gal-3",
    src: "/images/pravilo-prioridad-suspension-barras.jpg",
    alt: "Tracción en 4 puntos con sistema de barras tensoras PRAVILO",
    priority: true,
    visible: true,
  },
  {
    id: "gal-4",
    src: "/images/pravilo-practica-alumna-suspension.jpg",
    alt: "Alumna en suspensión total y extensión miofascial en PRAVILO",
    priority: false,
    visible: true,
  },
  {
    id: "gal-5",
    src: "/images/pravilo-practica-traccion-horizontal.jpg",
    alt: "Descompresión y tracción prona frente al cartel oficial",
    priority: false,
    visible: true,
  },
  {
    id: "gal-6",
    src: "/images/pravilo-practica-plancha-lateral.jpg",
    alt: "Trabajo de estabilidad, fuerza y control articular en suspensión",
    priority: false,
    visible: true,
  },
  {
    id: "gal-7",
    src: "/images/pravilo-practica-traccion-vertical.jpg",
    alt: "Elongación axial y apertura de hombros en el sistema de poleas",
    priority: false,
    visible: true,
  },
  {
    id: "gal-8",
    src: "/images/pravilo-practica-descompresion-zenital.jpg",
    alt: "Alineación y tracción progresiva en 4 puntos desde ángulo cenital",
    priority: false,
    visible: true,
  },
  {
    id: "gal-9",
    src: "/images/espacio-completo.jpg",
    alt: "Vista panorámica del estudio PRAVILO ARG y estructura central",
    priority: false,
    visible: true,
  },
  {
    id: "gal-10",
    src: "/images/pravilo-sign-suspension.jpg",
    alt: "Sesión de descompresión en suspensión frente al cartel PRAVILO",
    priority: false,
    visible: true,
  },
  {
    id: "gal-11",
    src: "/images/foto-img-3399.jpg",
    alt: "El aparato PRAVILO — estructura de cuerdas y poleas",
    priority: false,
    visible: true,
  },
  {
    id: "gal-12",
    src: "/images/pravilo-neon-suspension.jpg",
    alt: "Sesión de suspensión con iluminación neón en el estudio",
    priority: false,
    visible: true,
  },
  {
    id: "gal-13",
    src: "/images/pravilo-mirror-suspension.jpg",
    alt: "Ejercicio de suspensión reflejado en el espejo del estudio",
    priority: false,
    visible: true,
  },
];
