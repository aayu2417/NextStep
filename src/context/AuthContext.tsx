"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { api, setAuthToken, clearAuthToken } from "@/lib/api";

export interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  role: "CANDIDATE" | "HR_MANAGER" | "HIRING_MANAGER" | "ADMIN";
  company_id?: string;
  headline?: string;
  skills?: string;
}

interface AuthContextType {
  user: UserProfile | null;
  isLoading: boolean;
  login: (email: string, pass: string) => Promise<void>;
  logout: () => void;
  switchDemoRole: (role: "CANDIDATE" | "HR_MANAGER" | "HIRING_MANAGER" | "ADMIN") => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const DEMO_CREDENTIALS = {
  CANDIDATE: { email: "candidate@atrp.com", pass: "candidate123" },
  HR_MANAGER: { email: "recruiter@nexora.com", pass: "recruiter123" },
  HIRING_MANAGER: { email: "hiringmgr@nexora.com", pass: "hiring123" },
  ADMIN: { email: "admin@atrp.com", pass: "admin123" },
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check cached session
    const cached = localStorage.getItem("atrp_user");
    if (cached) {
      try {
        setUser(JSON.parse(cached));
      } catch (e) {
        // ignore
      }
    } else {
      // Auto-login as candidate by default for instant interactivity
      switchDemoRole("CANDIDATE").catch(() => {});
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, pass: string) => {
    setIsLoading(true);
    try {
      const res = await api.auth.login(email, pass);
      setUser(res.user);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    clearAuthToken();
    setUser(null);
  };

  const switchDemoRole = async (role: "CANDIDATE" | "HR_MANAGER" | "HIRING_MANAGER" | "ADMIN") => {
    setIsLoading(true);
    try {
      const creds = DEMO_CREDENTIALS[role];
      const res = await api.auth.login(creds.email, creds.pass);
      setUser(res.user);
    } catch (e) {
      console.warn("Could not login with credentials, falling back to mock user state:", e);
      // Fallback mock profile so UI never breaks
      const mockProfiles: Record<string, UserProfile> = {
        CANDIDATE: {
          id: "cand-demo-1",
          email: "candidate@atrp.com",
          full_name: "Aarav Mehta",
          role: "CANDIDATE",
          headline: "Full-Stack Engineer | React & Python",
          skills: "react, next.js, python, fastapi, tailwind",
        },
        HR_MANAGER: {
          id: "recruiter-demo-1",
          email: "recruiter@nexora.com",
          full_name: "Priya Sharma",
          role: "HR_MANAGER",
          company_id: "comp-1",
        },
        HIRING_MANAGER: {
          id: "hiring-demo-1",
          email: "hiringmgr@nexora.com",
          full_name: "Vikramaditya Roy",
          role: "HIRING_MANAGER",
          company_id: "comp-1",
        },
        ADMIN: {
          id: "admin-demo-1",
          email: "admin@atrp.com",
          full_name: "System Administrator",
          role: "ADMIN",
        },
      };
      setUser(mockProfiles[role]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout, switchDemoRole }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
