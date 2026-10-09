"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Sparkles, Lock, Mail, ArrowRight, ShieldCheck, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { useAuth } from "@/context/AuthContext";

export default function LoginPage() {
  const router = useRouter();
  const { login, switchDemoRole } = useAuth();
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await login(email, password);
      router.push("/jobs");
    } catch (err: any) {
      setError(err.message || "Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = async (role: "CANDIDATE" | "HR_MANAGER" | "ADMIN") => {
    await switchDemoRole(role);
    if (role === "CANDIDATE") router.push("/jobs");
    else if (role === "HR_MANAGER") router.push("/dashboard/recruiter");
    else router.push("/dashboard/admin");
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-4 bg-gradient-to-b from-blue-50/50 via-white to-slate-50">
      <div className="max-w-md w-full space-y-6">
        
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#1c4980] to-[#0066FF] text-white shadow-md mx-auto mb-2">
            <Sparkles className="w-6 h-6 text-yellow-300" />
          </div>
          <h1 className="text-2xl font-extrabold text-[#1c4980] tracking-tight">
            Welcome to ATRP Pro
          </h1>
          <p className="text-xs text-slate-500">
            Sign in to access your recruitment pipeline, applications, or candidate dashboard.
          </p>
        </div>

        {/* 1-Click Demo Profiles */}
        <div className="bg-blue-50/70 border border-blue-200/80 rounded-2xl p-4 text-xs space-y-2.5">
          <p className="font-bold text-blue-900 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-[#0066FF]" />
            Quick 1-Click Role Login:
          </p>
          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={() => handleDemoLogin("CANDIDATE")}
              className="py-2 px-2.5 bg-white text-slate-800 rounded-xl font-bold border border-blue-100 hover:border-blue-300 hover:shadow-xs transition-all text-center"
            >
              Candidate
            </button>
            <button
              onClick={() => handleDemoLogin("HR_MANAGER")}
              className="py-2 px-2.5 bg-white text-[#1c4980] rounded-xl font-bold border border-blue-100 hover:border-blue-300 hover:shadow-xs transition-all text-center"
            >
              Recruiter
            </button>
            <button
              onClick={() => handleDemoLogin("ADMIN")}
              className="py-2 px-2.5 bg-white text-purple-700 rounded-xl font-bold border border-blue-100 hover:border-blue-300 hover:shadow-xs transition-all text-center"
            >
              Admin
            </button>
          </div>
        </div>

        <Card className="p-6 bg-white border-slate-200 shadow-sm">
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl font-medium">
                {error}
              </div>
            )}

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Email Address</label>
              <Input
                type="email"
                placeholder="candidate@atrp.com"
                icon={<Mail className="w-4 h-4 text-slate-400" />}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Password</label>
              <Input
                type="password"
                placeholder="••••••••"
                icon={<Lock className="w-4 h-4 text-slate-400" />}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <Button type="submit" variant="primary" size="md" isLoading={loading} className="w-full font-bold">
              Sign In
            </Button>
          </form>

          <div className="mt-4 text-center text-xs text-slate-500">
            Don&apos;t have an account?{" "}
            <Link href="/auth/register" className="text-blue-600 font-bold hover:underline">
              Create an account
            </Link>
          </div>
        </Card>

      </div>
    </div>
  );
}
