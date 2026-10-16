import React, { createContext, useContext, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { authApi } from "../api/authApi";

interface AuthContextTypes {
  user: any | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  loginMutation: any;
  registerMutation: any;
  logout: () => void;
}

const AuthContext = createContext<AuthContextTypes | undefined>(undefined);

export const authProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const queryClient = useQueryClient();

  const { data, isLoading, error } = useQuery({
    queryKey: ["auth-user"],
    queryFn: authApi.getMe,

    enabled: !!localStorage.getItem("auth_token"),
    retry: false,
    staleTime: 1000 * 60 * 10,
  });

  useEffect(() => {
    if (error) {
      localStorage.removeItem("auth_token");
    }
  }, [error]);

  const loginMutation = useMutation({
    mutationFn: authApi.login,
    onSuccess: (res) => {
      localStorage.setItem("auth_token", res.token);
      queryClient.invalidateQueries({ queryKey: ["auth-user"] });
    },
  });

  const registerMutation = useMutation({
    mutationFn: authApi.register,
    onSuccess: (res) => {
      localStorage.setItem("auth_token", res.token);
      queryClient.invalidateQueries({ queryKey: ["auth-user"] });
    },
  });

  const logout = () => {
    localStorage.removeItem("auth_token");
    queryClient.setQueryData(["auth-user"], null);
  };

  const user = data?.user || null;
  const isAuthenticated = !!user;

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        registerMutation,
        loginMutation,
        logout,
        isAuthenticated,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error(
      "useAuth must be executed within an explicit AuthProvider wrapper layout.",
    );
  }

  return context;
};
