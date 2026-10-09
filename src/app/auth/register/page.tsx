"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Sparkles, Lock, Mail, User, Building, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { api } from "@/lib/api";

export default function RegisterPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    email: "",
    password: "",
    full_name: "",
    role: "CANDIDATE",
    company_name: "",
    phone_number: "",
    headline: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await api.auth.register(form);
      alert("Registration successful! Please log in.");
      router.push("/auth/login");
    } catch (err: any) {
      setError(err.message || "Failed to register account.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-4 bg-gradient-to-b from-blue-50/50 via-white to-slate-50">
      <div className="max-w-md w-full space-y-6">
        
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#1c4980] to-[#0066FF] text-white shadow-md mx-auto mb-2">
            <Sparkles className="w-6 h-6 text-yellow-300" />
          </div>
          <h1 className="text-2xl font-extrabold text-[#1c4980] tracking-tight">
            Create Your ATRP Account
          </h1>
          <p className="text-xs text-slate-500">
            Join as a Job Seeker or Register your Company as an HR Recruiter.
          </p>
        </div>

        <Card className="p-6 bg-white border-slate-200 shadow-sm">
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl font-medium">
                {error}
              </div>
            )}

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">I want to join as:</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setForm({ ...form, role: "CANDIDATE" })}
                  className={`py-2 rounded-xl text-xs font-bold border transition-all ${
                    form.role === "CANDIDATE"
                      ? "bg-blue-50 border-[#0066FF] text-[#0066FF]"
                      : "bg-white border-slate-200 text-slate-600"
                  }`}
                >
                  Job Applicant
                </button>
                <button
                  type="button"
                  onClick={() => setForm({ ...form, role: "HR_MANAGER" })}
                  className={`py-2 rounded-xl text-xs font-bold border transition-all ${
                    form.role === "HR_MANAGER"
                      ? "bg-blue-50 border-[#1c4980] text-[#1c4980]"
                      : "bg-white border-slate-200 text-slate-600"
                  }`}
                >
                  HR Recruiter
                </button>
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Full Name</label>
              <Input
                type="text"
                placeholder="Aarav Sharma"
                icon={<User className="w-4 h-4 text-slate-400" />}
                value={form.full_name}
                onChange={(e) => setForm({ ...form, full_name: e.target.value })}
                required
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Email Address</label>
              <Input
                type="email"
                placeholder="aarav@example.com"
                icon={<Mail className="w-4 h-4 text-slate-400" />}
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                required
              />
            </div>

            {form.role === "HR_MANAGER" && (
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Company / Organization Name</label>
                <Input
                  type="text"
                  placeholder="e.g. Acme Corp (requires admin approval)"
                  icon={<Building className="w-4 h-4 text-slate-400" />}
                  value={form.company_name}
                  onChange={(e) => setForm({ ...form, company_name: e.target.value })}
                  required
                />
              </div>
            )}

            {form.role === "CANDIDATE" && (
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Professional Headline</label>
                <Input
                  type="text"
                  placeholder="e.g. Full-Stack Engineer | React & Python"
                  value={form.headline}
                  onChange={(e) => setForm({ ...form, headline: e.target.value })}
                />
              </div>
            )}

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Password</label>
              <Input
                type="password"
                placeholder="••••••••"
                icon={<Lock className="w-4 h-4 text-slate-400" />}
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                required
              />
            </div>

            <Button type="submit" variant="primary" size="md" isLoading={loading} className="w-full font-bold">
              Complete Registration
            </Button>
          </form>

          <div className="mt-4 text-center text-xs text-slate-500">
            Already registered?{" "}
            <Link href="/auth/login" className="text-blue-600 font-bold hover:underline">
              Log in
            </Link>
          </div>
        </Card>

      </div>
    </div>
  );
}
