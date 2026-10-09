"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Search,
  MapPin,
  Briefcase,
  Clock,
  Building,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  TrendingUp,
  ShieldCheck,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { api } from "@/lib/api";
import { formatTimeRemaining } from "@/lib/utils";

export default function HomePage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDept, setSelectedDept] = useState("All");
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchLiveJobs() {
      try {
        const liveJobs = await api.jobs.list();
        if (liveJobs && liveJobs.length > 0) {
          setJobs(liveJobs);
        } else {
          fallbackJobs();
        }
      } catch (e) {
        fallbackJobs();
      } finally {
        setLoading(false);
      }
    }

    function fallbackJobs() {
      setJobs([
        {
          id: "1",
          title: "Senior Full-Stack Engineer (Next.js & Python)",
          company: { name: "Nexora Technologies", location: "Bengaluru, India (Hybrid)" },
          department: "Engineering",
          employment_type: "FULL_TIME",
          salary_range: "₹18 - ₹26 LPA",
          application_deadline: new Date(Date.now() + 4 * 86400000).toISOString(),
          views_count: 142,
        },
        {
          id: "2",
          title: "AI / ML Systems Engineer",
          company: { name: "DeepMind Alpha Labs", location: "Remote" },
          department: "Artificial Intelligence",
          employment_type: "FULL_TIME",
          salary_range: "₹24 - ₹35 LPA",
          application_deadline: new Date(Date.now() + 2 * 86400000).toISOString(),
          views_count: 320,
        },
      ]);
    }

    fetchLiveJobs();
  }, []);

  const filteredJobs = jobs.filter((job) => {
    const titleMatch = job.title?.toLowerCase().includes(searchTerm.toLowerCase());
    const compMatch = (job.company?.name || "").toLowerCase().includes(searchTerm.toLowerCase());
    const locMatch = (job.location || job.company?.location || "").toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSearch = !searchTerm || titleMatch || compMatch || locMatch;
    const matchesDept = selectedDept === "All" || job.department === selectedDept;
    return matchesSearch && matchesDept;
  });

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section inspired by Unstop */}
      <section className="relative overflow-hidden bg-gradient-to-b from-blue-50/70 via-white to-slate-50 py-12 md:py-16 border-b border-slate-200/70">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-4">
            
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-100/80 text-[#0066FF] text-xs font-bold tracking-wide uppercase">
              <Sparkles className="w-3.5 h-3.5 text-[#0066FF]" />
              Unified Talent & Recruitment Ecosystem
            </div>

            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-[#1c4980]">
              Unlock Your Potential. <br />
              <span className="text-[#0066FF] bg-clip-text text-transparent bg-gradient-to-r from-[#0066FF] to-blue-600">
                Land Opportunities Faster.
              </span>
            </h1>

            <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto">
              Connecting proactive talent with industry-leading companies. Powered by 15-second resume parsing, transparent application state machines, and streamlined interview scheduling.
            </p>

            {/* Prominent Unstop Search Box */}
            <div className="pt-4 max-w-2xl mx-auto">
              <div className="p-2 bg-white rounded-2xl shadow-xl shadow-blue-500/5 border border-slate-200/90 flex flex-col sm:flex-row gap-2">
                <div className="flex-1">
                  <Input
                    type="text"
                    placeholder="Search by job title, skills, or company..."
                    icon={<Search className="w-5 h-5 text-slate-400" />}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="border-0 shadow-none focus:ring-0 bg-transparent text-sm"
                  />
                </div>
                <div className="flex gap-2">
                  <Link href={`/jobs?q=${encodeURIComponent(searchTerm)}`}>
                    <Button variant="primary" size="md" className="w-full sm:w-auto px-6">
                      Find Opportunities
                    </Button>
                  </Link>
                </div>
              </div>
            </div>

            {/* Quick Metrics Pills */}
            <div className="flex flex-wrap items-center justify-center gap-6 pt-4 text-xs font-medium text-slate-500">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                Verified Employers Only
              </span>
              <span className="flex items-center gap-1.5">
                <Zap className="w-4 h-4 text-amber-500" />
                Instant Resume Screening
              </span>
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-blue-500" />
                Transparent State Tracking
              </span>
            </div>

          </div>
        </div>
      </section>

      {/* Main Dual-View Portal Area */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full flex-1">
        
        {/* Category Filters Bar */}
        <div className="flex items-center justify-between gap-4 mb-8 overflow-x-auto pb-2">
          <div className="flex items-center gap-2">
            {["All", "Engineering", "Artificial Intelligence", "Design", "Infrastructure", "Human Resources"].map((dept) => (
              <button
                key={dept}
                onClick={() => setSelectedDept(dept)}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap ${
                  selectedDept === dept
                    ? "bg-[#1c4980] text-white shadow-sm"
                    : "bg-white text-slate-600 border border-slate-200 hover:border-slate-300 hover:bg-slate-50"
                }`}
              >
                {dept}
              </button>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-2 text-xs text-slate-500 font-semibold">
            <TrendingUp className="w-4 h-4 text-[#0066FF]" />
            Showing {filteredJobs.length} Live Openings
          </div>
        </div>

        {/* Job Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredJobs.map((job) => (
            <Card key={job.id} interactive className="flex flex-col justify-between group">
              <CardHeader className="p-5 pb-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100 flex items-center justify-center text-[#1c4980] font-bold text-base shadow-2xs group-hover:scale-105 transition-transform">
                    {job.company?.name ? job.company.name.slice(0, 2).toUpperCase() : "NX"}
                  </div>

                  <div className="flex flex-col items-end gap-1">
                    <Badge variant="warning">
                      <Clock className="w-3 h-3 mr-1" />
                      {formatTimeRemaining(job.application_deadline)}
                    </Badge>
                  </div>
                </div>

                <div className="mt-3">
                  <CardTitle className="text-base group-hover:text-[#0066FF] transition-colors line-clamp-1">
                    {job.title}
                  </CardTitle>
                  <p className="text-xs font-medium text-slate-600 mt-1 flex items-center gap-1">
                    <Building className="w-3.5 h-3.5 text-slate-400" />
                    {job.company?.name || "Verified Partner"}
                  </p>
                </div>
              </CardHeader>

              <CardContent className="p-5 py-2 space-y-3">
                <div className="flex flex-wrap gap-1.5 text-xs">
                  <Badge variant="secondary" className="font-normal">
                    <MapPin className="w-3 h-3 mr-1 text-slate-400" />
                    {job.location || job.company?.location || "Remote"}
                  </Badge>
                  <Badge variant="secondary" className="font-normal">
                    <Briefcase className="w-3 h-3 mr-1 text-slate-400" />
                    {job.employment_type}
                  </Badge>
                </div>

                <div className="pt-2 flex items-center justify-between text-xs font-semibold text-slate-700">
                  <span className="text-slate-500">Compensation:</span>
                  <span className="text-[#1c4980] font-bold">{job.salary_range}</span>
                </div>
              </CardContent>

              <CardFooter className="p-5 pt-3 border-t border-slate-100 flex items-center justify-between gap-2 mt-auto">
                <Link href={`/jobs/${job.id}`} className="w-full">
                  <Button variant="primary" size="sm" className="w-full gap-1.5">
                    Apply Now
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>

        {/* State Machine Pipeline Banner */}
        <div className="mt-16 bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm">
          <div className="text-center max-w-2xl mx-auto mb-8">
            <h2 className="text-xl sm:text-2xl font-bold text-[#1c4980]">
              Transparent Application State Machine
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Never get ghosted. ATRP guarantees full visibility through every phase of your recruitment journey.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-center">
            {[
              { step: "1. Applied", desc: "Resume parsed in <15s", color: "border-blue-500 text-blue-700 bg-blue-50/50" },
              { step: "2. Screened", desc: "Criteria & Skill scoring", color: "border-indigo-500 text-indigo-700 bg-indigo-50/50" },
              { step: "3. Interview", desc: "Scheduled with Hiring Mgr", color: "border-purple-500 text-purple-700 bg-purple-50/50" },
              { step: "4. Offer", desc: "Admin & Manager approved", color: "border-amber-500 text-amber-700 bg-amber-50/50" },
              { step: "5. Hired", desc: "Welcome to the team!", color: "border-emerald-500 text-emerald-700 bg-emerald-50/50" },
            ].map((s, idx) => (
              <div
                key={idx}
                className={`p-4 rounded-xl border-2 ${s.color} transition-all hover:scale-[1.02] flex flex-col justify-center`}
              >
                <p className="font-bold text-sm">{s.step}</p>
                <p className="text-[11px] text-slate-600 mt-1 font-medium">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>

      </section>
    </div>
  );
}
