"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Briefcase,
  Building,
  MapPin,
  Calendar,
  CheckCircle2,
  Clock,
  Video,
  FileText,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  ChevronRight,
  TrendingUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { api } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";

const PIPELINE_STAGES = ["APPLIED", "SCREENED", "INTERVIEW", "OFFER", "HIRED"];

export default function CandidateDashboardPage() {
  const { user } = useAuth();
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMyApplications();
  }, [user]);

  const loadMyApplications = async () => {
    setLoading(true);
    try {
      const data = await api.applications.my();
      setApplications(data);
    } catch (e) {
      console.warn("Could not load candidate applications, using demo data:", e);
      setApplications([
        {
          id: "app-1",
          job: {
            id: "1",
            title: "Senior Full-Stack Engineer (Next.js & Python)",
            salary_range: "₹18 - ₹26 LPA",
            location: "Bengaluru, India (Hybrid)",
            company: { name: "Nexora Technologies" },
          },
          status: "SCREENED",
          screening_score: 88.5,
          screening_notes: "Strong match: 6 out of 7 required skills matched. 3.5 years experience.",
          created_at: new Date(Date.now() - 2 * 86400000).toISOString(),
        },
        {
          id: "app-2",
          job: {
            id: "2",
            title: "AI / ML Systems Engineer",
            salary_range: "₹24 - ₹35 LPA",
            location: "Remote",
            company: { name: "DeepMind Alpha Labs" },
          },
          status: "APPLIED",
          screening_score: 76.0,
          screening_notes: "Resume parsed successfully. Awaiting recruiter review.",
          created_at: new Date(Date.now() - 5 * 86400000).toISOString(),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const getStageIndex = (status: string) => {
    if (status === "REJECTED" || status === "WITHDRAWN") return -1;
    return PIPELINE_STAGES.indexOf(status);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full flex-1">
      
      {/* Header Banner */}
      <div className="mb-8">
        <div className="flex items-center gap-2 text-xs text-slate-500 mb-2">
          <Link href="/" className="hover:text-blue-600">Home</Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-slate-900 font-semibold">Candidate Dashboard</span>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1c4980] tracking-tight">
              My Active Applications
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Live recruitment pipeline tracker with stage progression and feedback transparency.
            </p>
          </div>
          <Link href="/jobs">
            <Button variant="outline" size="sm" className="gap-1.5">
              Explore More Jobs
              <ArrowRight className="w-3.5 h-3.5" />
            </Button>
          </Link>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        <Card className="p-4 bg-white border border-slate-200">
          <p className="text-xs font-semibold text-slate-500">Submitted</p>
          <p className="text-2xl font-black text-[#1c4980] mt-1">{applications.length}</p>
        </Card>
        <Card className="p-4 bg-white border border-slate-200">
          <p className="text-xs font-semibold text-slate-500">Screened & Passed</p>
          <p className="text-2xl font-black text-indigo-600 mt-1">
            {applications.filter((a) => a.status !== "APPLIED").length}
          </p>
        </Card>
        <Card className="p-4 bg-white border border-slate-200">
          <p className="text-xs font-semibold text-slate-500">Interviews Active</p>
          <p className="text-2xl font-black text-purple-600 mt-1">
            {applications.filter((a) => a.status === "INTERVIEW").length}
          </p>
        </Card>
        <Card className="p-4 bg-white border border-slate-200">
          <p className="text-xs font-semibold text-slate-500">Offers Received</p>
          <p className="text-2xl font-black text-emerald-600 mt-1">
            {applications.filter((a) => a.status === "OFFER" || a.status === "HIRED").length}
          </p>
        </Card>
      </div>

      {/* Application Cards with Pipeline Steppers */}
      {loading ? (
        <div className="text-center py-20 text-slate-400">Loading your applications...</div>
      ) : applications.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center border border-slate-200">
          <Briefcase className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="font-bold text-slate-800 text-base">No Applications Yet</h3>
          <p className="text-xs text-slate-500 mt-1 mb-4">
            Discover open positions on the career portal and apply in under 15 seconds.
          </p>
          <Link href="/jobs">
            <Button variant="primary" size="md">
              Browse Open Jobs
            </Button>
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {applications.map((app) => {
            const currentStageIdx = getStageIndex(app.status);

            return (
              <Card key={app.id} className="p-6 bg-white border border-slate-200 shadow-xs hover:border-blue-200 transition-colors">
                
                {/* Header row */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                  <div className="flex items-start gap-3.5">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100 flex items-center justify-center font-bold text-[#1c4980] text-base">
                      {app.job?.company?.name ? app.job.company.name.slice(0, 2).toUpperCase() : "AP"}
                    </div>
                    <div>
                      <h3 className="font-extrabold text-base text-slate-900">{app.job?.title}</h3>
                      <p className="text-xs font-medium text-slate-500 flex items-center gap-2 mt-0.5">
                        <Building className="w-3.5 h-3.5 text-slate-400" />
                        {app.job?.company?.name}
                        <span>•</span>
                        <MapPin className="w-3.5 h-3.5 text-slate-400" />
                        {app.job?.location}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {app.screening_score && (
                      <Badge variant="purple" className="py-1 px-2.5">
                        <Sparkles className="w-3 h-3 mr-1" />
                        Screening Score: {app.screening_score}%
                      </Badge>
                    )}
                    <Badge
                      variant={
                        app.status === "HIRED"
                          ? "success"
                          : app.status === "OFFER"
                          ? "warning"
                          : app.status === "REJECTED"
                          ? "destructive"
                          : "default"
                      }
                      className="py-1 px-3"
                    >
                      {app.status}
                    </Badge>
                  </div>
                </div>

                {/* Progress Tracker Stepper (Unstop Design Guideline 2) */}
                <div className="py-6">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">
                    Recruitment Stage Pipeline
                  </p>

                  <div className="relative flex items-center justify-between">
                    {/* Connecting line */}
                    <div className="absolute top-1/2 left-0 right-0 h-1 bg-slate-100 -translate-y-1/2 z-0" />
                    <div
                      className="absolute top-1/2 left-0 h-1 bg-[#0066FF] -translate-y-1/2 z-0 transition-all duration-500"
                      style={{
                        width: `${Math.max(0, (currentStageIdx / (PIPELINE_STAGES.length - 1)) * 100)}%`,
                      }}
                    />

                    {PIPELINE_STAGES.map((stage, idx) => {
                      const isCompleted = idx < currentStageIdx;
                      const isCurrent = idx === currentStageIdx;

                      return (
                        <div key={stage} className="relative z-10 flex flex-col items-center">
                          <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs transition-all ${
                              isCompleted
                                ? "bg-[#0066FF] text-white shadow-xs"
                                : isCurrent
                                ? "bg-white border-2 border-[#0066FF] text-[#0066FF] ring-4 ring-blue-100 font-extrabold"
                                : "bg-white border-2 border-slate-200 text-slate-400"
                            }`}
                          >
                            {isCompleted ? <CheckCircle2 className="w-4 h-4" /> : idx + 1}
                          </div>
                          <span
                            className={`text-[10px] sm:text-xs mt-2 font-semibold ${
                              isCurrent
                                ? "text-[#0066FF] font-bold"
                                : isCompleted
                                ? "text-slate-700"
                                : "text-slate-400"
                            }`}
                          >
                            {stage}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Status & Feedback Notes */}
                {app.screening_notes && (
                  <div className="bg-slate-50 rounded-xl p-3.5 border border-slate-100 text-xs text-slate-600 flex items-start gap-2">
                    <Sparkles className="w-4 h-4 text-[#0066FF] flex-shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-slate-800">Automated ATS Analysis: </span>
                      {app.screening_notes}
                    </div>
                  </div>
                )}

              </Card>
            );
          })}
        </div>
      )}

    </div>
  );
}
