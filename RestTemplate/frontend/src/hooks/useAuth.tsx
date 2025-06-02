/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "@/lib/axios.config";
import { deleteCookie, getCookie, setCookie } from "@/lib/utils";
import { IUser } from "@/types";
import { notification } from "antd";
import React, { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

interface AuthContextProvider {
  user: IUser | null;
  login: (email: string, password: string) => void;
  loggingIn: boolean;
  register: (
    user: Omit<IUser, "id"> & {
      password: string;
    }
  ) => void;
  registering: boolean;
  logout: () => void;
  loggingOut: boolean;
  initialLoading: boolean;
}

const AuthContext = createContext<AuthContextProvider | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<IUser | null>(null);
  const [registering, setRegistering] = useState<boolean>(false);
  const [loggingIn, setLoggingIn] = useState<boolean>(false);
  const [initialLoading, setInitialLoading] = useState<boolean>(true);
  const [loggingOut, setLoggingOut] = useState<boolean>(false);

  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      const token = await getCookie("token");
      try {
        if (token) {
          const { data } = await axios.get("/auth/me");
          setUser(data.body);
        }
      } catch (error) {
        setUser(null);
        deleteCookie("token");
      }

      setInitialLoading(false);
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string) => {
    setLoggingIn(true);
    try {
      const { data } = await axios.post("/auth/login", { email, password });
      setUser(data.body);
      notification.success({ message: data.message });
      navigate("/dashboard");
    } catch (error: any) {
      console.error("Login error: ", error);
      notification.error({
        message: error?.response?.data?.message || "Login failed",
      });
    } finally {
      setLoggingIn(false);
    }
  };

  const register = async (
    user: Omit<IUser, "id"> & {
      password: string;
    }
  ) => {
    setRegistering(true);
    try {
      const { data } = await axios.post("/auth/register", user);

      if (data.success) {
        notification.success({
          message: data.message,
        });
        navigate("/login");
      } else {
        notification.error({
          message: "Something went wrong",
        });
      }
    } catch (error: any) {
      console.error("Error while registering: ", error?.message);
      notification.error({
        message: error?.message,
      });
    }
  };

  const logout = async () => {
    setLoggingOut(true);
    try {
      await axios.post("/auth/logout");
      setUser(null);
      notification.success({ message: "Logged out successfully" });
      navigate("/login");
    } catch (err: any) {
      notification.error({
        message: err?.response?.data?.message || "Logout failed",
      });
    } finally {
      setLoggingOut(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        loggingIn,
        register,
        registering,
        logout,
        loggingOut,
        initialLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
