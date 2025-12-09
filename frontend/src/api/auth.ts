// este archivo maneja las llamadas a la API relacionadas con la autenticación de usuarios.
// Proporciona funciones para iniciar sesión, registrarse y obtener información del usuario actual.
// Utiliza el cliente API configurado en api/client.ts para realizar solicitudes HTTP.
// Facilita la interacción con los endpoints de autenticación del backend.

import apiClient from "@/api/client";
import { LoginPayload, RegisterPayload, TokenResponse, User } from "@/types/user";

export async function login(payload: LoginPayload): Promise<TokenResponse> {
  const { data } = await apiClient.post<TokenResponse>("/auth/login", payload);
  return data;
}

export async function register(payload: RegisterPayload): Promise<User> {
  const { data } = await apiClient.post<User>("/auth/register", payload);
  return data;
}

export async function fetchCurrentUser(): Promise<User> {
  const { data } = await apiClient.get<User>("/auth/me");
  return data;
}
