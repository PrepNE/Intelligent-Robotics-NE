/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useContext, useEffect, useState } from "react";
import { IUser } from "@/types";
import { createContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "@/lib/axios.config";
import { deleteCookie, getCookie, setCookie } from "@/lib/utils";
import { notification } from "antd";

interface AuthContextType {
  user: IUser | null;
  login: (email: string, password: string) => void;
  loggingIn: boolean;
  register: (
    user: Omit<IUser, "id" | "role" | "createdAt" | "updatedAt"> & {
      password: string;
    }
  ) => void;
  registering: boolean;
  logout: () => void;
  loggingOut: boolean;
  initialLoading: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [loggingIn, setLoggingIn] = useState(false);
  const [registering, setRegistering] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [user, setUser] = useState<IUser | null>(null);
  console.log("Here is the user: ", user);

  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      const token = getCookie("token");
      console.log("Here is the token: ", token)
      if (token) {
        try {
          const { data } = await axios.get("/auth/me");
          setUser(data.body);
        } catch (error) {
          setUser(null);
          deleteCookie("token");
        }
      }
      setInitialLoading(false);
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string) => {
    setLoggingIn(true);
    try {
      const { data } = await axios.post("/auth/login", { email, password });
      if (data.success) {
        setUser(data.body);
        setCookie("token", data.token, 7);
        notification.success({
          message: data.message,
        });
        navigate("/dashboard");
      } else {
        notification.error({
          message: data?.message,
        });
      }
    } catch (error: any) {
      console.log("Here is the erorr: ", error)
      notification.error({
        message: error?.message,
      });
    } finally {
      setLoggingIn(false);
    }
  };

  const register = async (
    user: Omit<IUser, "id" | "role"> & {
      password: string;
    }
  ) => {
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
      notification.error({
        message: error?.message,
      });
    } finally {
      setLoggingIn(false);
    }
  };

  const logout = async () => {
    setLoggingOut(true)
    try {
      setUser(null);
      deleteCookie("token")
      notification.success({
        message: "Logout successfully"
      })
      navigate("/login")
    } catch (error: any) {
      notification.error({
        message: error?.message,
      });
    } finally {
      setLoggingOut(false)
    }
  }

  return (
    <AuthContext.Provider value={{ user, login, loggingIn, register, registering, logout, loggingOut, initialLoading }}>
      {children}
    </AuthContext.Provider>
  )
};

export default function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}