export interface User {
  id: number;
  nombre: string;
  email: string;
  created_at: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload extends LoginPayload {
  nombre: string;
}

export interface TokenResponse {
  access_token: string;
  token_type: string;
}
