"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Search, Briefcase, User, Sparkles, Building2, LayoutDashboard, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";

export function Navbar() {
  const { user, switchDemoRole, logout } = useAuth();
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200/80 bg-white/95 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          
          {/* Brand Logo */}
          <div className="flex items-center gap-6">
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#1c4980] to-[#0066FF] flex items-center justify-center text-white font-bold text-lg shadow-sm shadow-blue-500/20 group-hover:scale-105 transition-transform">
                <Sparkles className="w-4.5 h-4.5 text-yellow-300" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-extrabold text-lg tracking-tight text-[#1c4980]">ATRP</span>
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-blue-50 text-[#0066FF] border border-blue-200">
                    Pro
                  </span>
                </div>
                <span className="text-[9px] text-slate-500 font-medium block -mt-1">
                  Unstop Portal
                </span>
              </div>
            </Link>

            {/* Navigation Links */}
            <nav className="hidden md:flex items-center gap-1">
              <Link
                href="/jobs"
                className={`px-3 py-1.5 rounded-xl text-xs sm:text-sm font-semibold transition-colors flex items-center gap-1.5 ${
                  pathname.startsWith("/jobs") ? "bg-blue-50 text-[#0066FF]" : "text-slate-700 hover:text-[#0066FF] hover:bg-slate-50"
                }`}
              >
                <Briefcase className="w-3.5 h-3.5 text-slate-500" />
                Find Jobs
              </Link>
              <Link
                href="/candidate/applications"
                className={`px-3 py-1.5 rounded-xl text-xs sm:text-sm font-semibold transition-colors flex items-center gap-1.5 ${
                  pathname.startsWith("/candidate") ? "bg-blue-50 text-[#0066FF]" : "text-slate-700 hover:text-[#0066FF] hover:bg-slate-50"
                }`}
              >
                <User className="w-3.5 h-3.5 text-slate-500" />
                My Tracker
              </Link>
              <Link
                href="/dashboard/recruiter"
                className={`px-3 py-1.5 rounded-xl text-xs sm:text-sm font-semibold transition-colors flex items-center gap-1.5 ${
                  pathname.startsWith("/dashboard/recruiter") ? "bg-blue-50 text-[#0066FF]" : "text-slate-700 hover:text-[#0066FF] hover:bg-slate-50"
                }`}
              >
                <LayoutDashboard className="w-3.5 h-3.5 text-slate-500" />
                Recruiter ATS
              </Link>
              <Link
                href="/dashboard/admin"
                className={`px-3 py-1.5 rounded-xl text-xs sm:text-sm font-semibold transition-colors flex items-center gap-1.5 ${
                  pathname.startsWith("/dashboard/admin") ? "bg-blue-50 text-[#0066FF]" : "text-slate-700 hover:text-[#0066FF] hover:bg-slate-50"
                }`}
              >
                <Building2 className="w-3.5 h-3.5 text-slate-500" />
                Admin
              </Link>
            </nav>
          </div>

          {/* Role Switcher for instant live testing */}
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="flex items-center bg-slate-100 p-0.5 rounded-xl text-[11px] font-semibold text-slate-600">
              <span className="hidden lg:inline-block px-2 text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                Simulate:
              </span>
              <button
                onClick={() => switchDemoRole("CANDIDATE")}
                className={`px-2 py-1 rounded-lg transition-all ${
                  user?.role === "CANDIDATE" ? "bg-white text-[#0066FF] shadow-xs font-bold" : "hover:text-slate-900"
                }`}
              >
                Candidate
              </button>
              <button
                onClick={() => switchDemoRole("HR_MANAGER")}
                className={`px-2 py-1 rounded-lg transition-all ${
                  user?.role === "HR_MANAGER" ? "bg-white text-[#1c4980] shadow-xs font-bold" : "hover:text-slate-900"
                }`}
              >
                HR Recruiter
              </button>
              <button
                onClick={() => switchDemoRole("ADMIN")}
                className={`px-2 py-1 rounded-lg transition-all ${
                  user?.role === "ADMIN" ? "bg-white text-purple-700 shadow-xs font-bold" : "hover:text-slate-900"
                }`}
              >
                Admin
              </button>
            </div>

            {user ? (
              <div className="flex items-center gap-2">
                <span className="hidden sm:inline-block text-xs font-medium text-slate-600">
                  {user.full_name.split(" ")[0]}
                </span>
                <button
                  onClick={logout}
                  title="Sign out"
                  className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <Link href="/auth/login">
                <Button variant="outline" size="sm">
                  Log In
                </Button>
              </Link>
            )}

            <Link href="/jobs">
              <Button variant="primary" size="sm" className="hidden sm:inline-flex text-xs">
                Explore Jobs
              </Button>
            </Link>
          </div>

        </div>
      </div>
    </header>
  );
}
