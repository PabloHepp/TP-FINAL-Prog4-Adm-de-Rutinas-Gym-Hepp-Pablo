// este archivo contiene funciones para interactuar con la API de rutinas utilizando React Query.
// Proporciona hooks para obtener, crear, actualizar y eliminar rutinas.
// Utiliza un cliente API configurado para realizar solicitudes HTTP.
// Importa las definiciones de tipos para las rutinas desde el archivo de tipos.
// Asegura la gestión eficiente del estado de datos relacionados con las rutinas en la aplicación React.
// Usa React Query para el manejo de caché y sincronización de datos.
// Cada función exportada es un hook personalizado que puede ser utilizado en componentes React.
// Estos hooks facilitan la integración de la lógica de datos con la interfaz de usuario.
// Permite la invalidación automática de caché tras mutaciones para mantener los datos actualizados.

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import apiClient from "@/api/client";
import {
  Rutina,
  RutinaCreatePayload,
  RutinaUpdatePayload,
} from "@/types/rutina";

const RUTINAS_KEY = ["rutinas"]; // Clave base para las consultas de rutinas

export function useRutinas(search?: string, dia_semana?: string) {
  return useQuery({
    queryKey: [RUTINAS_KEY, { search, dia_semana }],
    queryFn: async () => {
      const { data } = await apiClient.get<Rutina[]>("/rutinas/", {
        params: { search, dia_semana },
      });
      return data;
    },
  });
}

export function useRutina(id: number | null) {
  return useQuery({
    queryKey: ["rutina", id],
    queryFn: async () => {
      if (id == null) return null;
      const { data } = await apiClient.get<Rutina>(`/rutinas/${id}`);
      return data;
    },
    enabled: id != null,
  });
}

export function useCreateRutina() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: RutinaCreatePayload) => {
      const { data } = await apiClient.post<Rutina>("/rutinas/", payload);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: RUTINAS_KEY });
    },
  });
}

export function useUpdateRutina(id: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: RutinaUpdatePayload) => {
      const { data } = await apiClient.put<Rutina>(`/rutinas/${id}`, payload);
      return data;
    },
    onSuccess: (_, __, context) => {
      queryClient.invalidateQueries({ queryKey: RUTINAS_KEY });
      queryClient.invalidateQueries({ queryKey: ["rutina", id] });
      return context;
    },
  });
}

export function useDeleteRutina() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      await apiClient.delete(`/rutinas/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: RUTINAS_KEY });
    },
  });
}
