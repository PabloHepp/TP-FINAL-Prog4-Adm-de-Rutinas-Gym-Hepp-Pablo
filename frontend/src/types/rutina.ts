// este archivo define los tipos TypeScript para las rutinas y ejercicios en la aplicación.
// Proporciona interfaces para las estructuras de datos utilizadas en la gestión de rutinas.
// Incluye tipos para la creación y actualización de rutinas y ejercicios.

export type DiaSemana =
  | "lunes"
  | "martes"
  | "miercoles"
  | "jueves"
  | "viernes"
  | "sabado"
  | "domingo";

  // Definición de la interfaz Ejercicio y Rutina
export interface Ejercicio {
  id: number;
  rutina_id: number;
  nombre: string;
  dia_semana: DiaSemana;
  series: number;
  repeticiones: number;
  peso: number | null;
  notas: string | null;
  orden: number;
}

export interface Rutina {
  id: number;
  nombre: string;
  descripcion: string | null;
  fecha_creacion: string;
  ejercicios: Ejercicio[];
}

// Definición de los payloads para creación y actualización
export interface EjercicioPayload
  extends Omit<Ejercicio, "id" | "rutina_id"> {}

export interface RutinaCreatePayload {
  nombre: string;
  descripcion?: string | null;
  ejercicios: EjercicioPayload[];
}

export interface RutinaUpdatePayload {
  nombre?: string;
  descripcion?: string | null;
  ejercicios?: EjercicioPayload[];
}
