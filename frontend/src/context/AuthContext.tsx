import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";

import { fetchCurrentUser, login as loginRequest, register as registerRequest } from "@/api/auth";
import { setApiClientAuthToken } from "@/api/client";
import { AUTH_TOKEN_KEY } from "@/constants/auth";
import { LoginPayload, RegisterPayload, User } from "@/types/user";

interface AuthContextValue {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (credentials: LoginPayload) => Promise<void>;
  register: (payload: RegisterPayload) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const queryClient = useQueryClient();
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isBootstrapping, setIsBootstrapping] = useState(true);

  const clearSession = useCallback(() => {
    setToken(null);
    setUser(null);
    setApiClientAuthToken(null);
    queryClient.clear();
  }, [queryClient]);

  useEffect(() => {
    const storedToken = typeof window !== "undefined" ? window.localStorage.getItem(AUTH_TOKEN_KEY) : null;
    if (!storedToken) {
      setIsBootstrapping(false);
      return;
    }

    setToken(storedToken);
    setApiClientAuthToken(storedToken);

    fetchCurrentUser()
      .then((profile) => {
        setUser(profile);
      })
      .catch(() => {
        clearSession();
      })
      .finally(() => {
        setIsBootstrapping(false);
      });
  }, [clearSession]);

  const login = useCallback(async (credentials: LoginPayload) => {
    const tokenResponse = await loginRequest(credentials);
    setToken(tokenResponse.access_token);
    setApiClientAuthToken(tokenResponse.access_token);
    const profile = await fetchCurrentUser();
    setUser(profile);
  }, []);

  const registerUser = useCallback(
    async (payload: RegisterPayload) => {
      await registerRequest(payload);
      await login({ email: payload.email, password: payload.password });
    },
    [login],
  );

  const logout = useCallback(() => {
    clearSession();
  }, [clearSession]);

  const value = useMemo(
    () => ({
      user,
      token,
      isLoading: isBootstrapping,
      login,
      register: registerUser,
      logout,
    }),
    [isBootstrapping, login, logout, registerUser, token, user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth debe usarse dentro de AuthProvider");
  }
  return context;
}
