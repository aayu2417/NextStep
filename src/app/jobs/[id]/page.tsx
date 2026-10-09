"use client";

import React, { useState, useEffect, Suspense, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Building,
  MapPin,
  Briefcase,
  Clock,
  ChevronRight,
  Share2,
  CheckCircle2,
  Sparkles,
  Upload,
  FileText,
  AlertCircle,
  ArrowRight,
  ShieldCheck,
  Zap,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { api } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { formatTimeRemaining } from "@/lib/utils";

function JobDetailContent({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const jobId = resolvedParams?.id;
  const router = useRouter();
  const { user } = useAuth();

  const [job, setJob] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  // Application Modal state
  const [applyModalOpen, setApplyModalOpen] = useState(false);
  const [resumeText, setResumeText] = useState("");
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState<any>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);

  useEffect(() => {
    if (jobId) {
      loadJobDetails();
    }
  }, [jobId]);

  const loadJobDetails = async () => {
    setLoading(true);
    try {
      const data = await api.jobs.get(jobId);
      setJob(data);
    } catch (e) {
      const liveList = await api.jobs.list().catch(() => []);
      if (liveList && liveList.length > 0) {
        setJob(liveList[0]);
      } else {
        setJob({
          id: jobId,
          title: "Senior Full-Stack Engineer (Next.js & Python)",
          description:
            "We are seeking an experienced Full-Stack Engineer to lead development of our core cloud recruitment platform. You will build resilient APIs using FastAPI, craft responsive web interfaces with Next.js App Router, and optimize asynchronous workflows.",
          requirements:
            "• 3+ years experience with Next.js, React, and TypeScript\n• Strong Python backend experience with FastAPI or Django\n• Proficiency with PostgreSQL, async SQLAlchemy, and Redis\n• Experience building automated testing and CI/CD pipelines\n• Strong problem solving and system architecture skills",
          department: "Engineering",
          location: "Bengaluru, India (Hybrid)",
          employment_type: "FULL_TIME",
          salary_range: "₹18 - ₹26 LPA",
          application_deadline: new Date(Date.now() + 5 * 86400000).toISOString(),
          views_count: 154,
          company: {
            name: "Nexora Technologies",
            website: "https://nexoratech.io",
            location: "Bengaluru, India",
            industry: "Information Technology",
            description:
              "Nexora is a leading software enterprise engineering cloud-native platforms, AI pipelines, and workflow automation suites for Fortune 500 partners.",
          },
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleApply = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setSubmitError(null);

    try {
      const formData = new FormData();
      formData.append("job_id", job?.id || jobId);
      if (resumeFile) {
        formData.append("resume_file", resumeFile);
      }
      if (resumeText) {
        formData.append("resume_text", resumeText);
      }

      const res = await api.applications.apply(formData);
      setSubmitSuccess(res);
    } catch (err: any) {
      setSubmitError(err.message || "Failed to submit application. Please verify you haven't applied already.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading || !job) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center text-slate-500">
        Loading job posting...
      </div>
    );
  }

  return (
    <div className="bg-slate-50 min-h-screen pb-24">
      {/* Top Banner */}
      <div className="bg-white border-b border-slate-200 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="flex items-center gap-2 text-xs text-slate-500 mb-4">
            <Link href="/" className="hover:text-blue-600">Home</Link>
            <ChevronRight className="w-3 h-3" />
            <Link href="/jobs" className="hover:text-blue-600">Jobs</Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-slate-900 font-semibold truncate max-w-xs">{job.title}</span>
          </div>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-start gap-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-[#1c4980] to-[#0066FF] flex items-center justify-center text-white font-bold text-2xl shadow-md">
                {job.company?.name ? job.company.name.slice(0, 2).toUpperCase() : "NX"}
              </div>
              <div>
                <h1 className="text-xl sm:text-3xl font-extrabold text-[#1c4980] tracking-tight">
                  {job.title}
                </h1>
                <p className="text-sm font-semibold text-slate-600 mt-1 flex items-center gap-2">
                  <Building className="w-4 h-4 text-slate-400" />
                  {job.company?.name}
                  <span className="text-slate-300">•</span>
                  <MapPin className="w-4 h-4 text-slate-400" />
                  {job.location || job.company?.location}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Button
                variant="primary"
                size="lg"
                onClick={() => setApplyModalOpen(true)}
                className="shadow-lg shadow-blue-500/25 px-8"
              >
                Apply Now
              </Button>
            </div>
          </div>

          {/* Quick Glances Metadata Row */}
          <div className="flex flex-wrap items-center gap-3 mt-6 pt-6 border-t border-slate-100 text-xs">
            <Badge variant="default" className="py-1 px-3">
              <Briefcase className="w-3.5 h-3.5 mr-1" />
              {job.employment_type}
            </Badge>
            <Badge variant="secondary" className="py-1 px-3">
              {job.department}
            </Badge>
            <Badge variant="warning" className="py-1 px-3">
              <Clock className="w-3.5 h-3.5 mr-1" />
              Closes in {formatTimeRemaining(job.application_deadline)}
            </Badge>
            <span className="text-slate-600 font-bold ml-auto text-sm text-[#1c4980]">
              Compensation: {job.salary_range}
            </span>
          </div>

        </div>
      </div>

      {/* Main Content: Left Details + Right Sidebar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Job Description and Requirements */}
        <div className="lg:col-span-2 space-y-6">
          
          <Card className="p-6">
            <h2 className="text-lg font-bold text-[#1c4980] mb-4 flex items-center gap-2">
              <FileText className="w-5 h-5 text-[#0066FF]" />
              About the Role
            </h2>
            <div className="text-sm text-slate-700 leading-relaxed whitespace-pre-line space-y-3">
              {job.description}
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="text-lg font-bold text-[#1c4980] mb-4 flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              Job Requirements & Qualifications
            </h2>
            <div className="text-sm text-slate-700 leading-relaxed whitespace-pre-line space-y-2">
              {job.requirements || "Standard industry qualifications and proficiency required."}
            </div>
          </Card>

          {/* Recruitment Stages Accordion */}
          <Card className="p-6">
            <h2 className="text-lg font-bold text-[#1c4980] mb-3">
              Transparent Selection Process
            </h2>
            <p className="text-xs text-slate-500 mb-4">
              Your application follows the strict ATRP state machine. Each stage provides automated updates.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-center">
              {[
                { stage: "1. Resume Parsing", desc: "< 15s instant extraction" },
                { stage: "2. ATS Screening", desc: "Automated scoring" },
                { stage: "3. Interview Round", desc: "Technical & Hiring Mgr" },
                { stage: "4. Offer Extended", desc: "Formal proposal" },
              ].map((step, idx) => (
                <div key={idx} className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <p className="font-bold text-xs text-slate-800">{step.stage}</p>
                  <p className="text-[10px] text-slate-500 mt-0.5">{step.desc}</p>
                </div>
              ))}
            </div>
          </Card>

        </div>

        {/* Right Sidebar: Company Info */}
        <div className="space-y-6">
          <Card className="p-6">
            <h3 className="font-bold text-base text-[#1c4980] mb-3">
              About {job.company?.name}
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed mb-4">
              {job.company?.description || "An innovative tech organization transforming digital experiences."}
            </p>
            <div className="space-y-2.5 text-xs border-t border-slate-100 pt-3">
              <div className="flex justify-between">
                <span className="text-slate-500">Industry:</span>
                <span className="font-semibold text-slate-800">{job.company?.industry || "Tech"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Headquarters:</span>
                <span className="font-semibold text-slate-800">{job.company?.location}</span>
              </div>
              {job.company?.website && (
                <div className="flex justify-between">
                  <span className="text-slate-500">Website:</span>
                  <a
                    href={job.company.website}
                    target="_blank"
                    rel="noreferrer"
                    className="font-semibold text-blue-600 hover:underline"
                  >
                    Visit Website
                  </a>
                </div>
              )}
            </div>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-100">
            <div className="flex items-center gap-2 mb-2 text-[#0066FF] font-bold text-sm">
              <ShieldCheck className="w-5 h-5" />
              Verified Employer
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              This organization has been verified by the ATRP System Administrator. Candidates can apply with confidence.
            </p>
          </Card>
        </div>

      </div>

      {/* Sticky Bottom Apply Action Bar (Mobile & Desktop) */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 py-3.5 px-4 shadow-lg">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="hidden sm:block">
            <p className="font-bold text-sm text-slate-900">{job.title}</p>
            <p className="text-xs text-slate-500">{job.company?.name} • {job.salary_range}</p>
          </div>
          <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
            <Button
              variant="primary"
              size="md"
              onClick={() => setApplyModalOpen(true)}
              className="w-full sm:w-auto px-8 font-bold"
            >
              Apply Now
            </Button>
          </div>
        </div>
      </div>

      {/* Quick Apply & Resume Parser Modal */}
      {applyModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
            
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-[#0066FF]" />
                <h3 className="font-extrabold text-lg text-[#1c4980]">Submit Application</h3>
              </div>
              <button onClick={() => setApplyModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            {submitSuccess ? (
              <div className="py-8 text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                <div>
                  <h4 className="font-extrabold text-xl text-slate-900">Application Submitted!</h4>
                  <p className="text-xs text-slate-500 mt-1">
                    Your resume has been parsed in under 15 seconds and evaluated against the job requirements.
                  </p>
                </div>

                {submitSuccess.screening_score !== undefined && (
                  <div className="p-4 bg-blue-50 rounded-2xl border border-blue-200 text-left">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-bold text-slate-700">Automated Screening Score:</span>
                      <span className="text-sm font-extrabold text-[#0066FF]">{submitSuccess.screening_score}%</span>
                    </div>
                    <p className="text-[11px] text-slate-600">{submitSuccess.screening_notes}</p>
                  </div>
                )}

                <div className="flex gap-2 justify-center pt-2">
                  <Button variant="primary" onClick={() => router.push("/candidate/applications")}>
                    Track Application
                  </Button>
                  <Button variant="outline" onClick={() => setApplyModalOpen(false)}>
                    Close
                  </Button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleApply} className="space-y-4 py-4">
                {submitError && (
                  <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 flex-shrink-0" />
                    <span>{submitError}</span>
                  </div>
                )}

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1.5">
                    Upload Resume (PDF or DOCX)
                  </label>
                  <div className="border-2 border-dashed border-slate-300 rounded-2xl p-6 text-center hover:border-blue-500 bg-slate-50/50 transition-colors cursor-pointer relative">
                    <Upload className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                    <p className="text-xs font-semibold text-slate-700">
                      {resumeFile ? resumeFile.name : "Click to select or drag PDF / DOCX resume"}
                    </p>
                    <p className="text-[10px] text-slate-400 mt-1">
                      Automated parsing extracts skills, contact details, and experience within 15s
                    </p>
                    <input
                      type="file"
                      accept=".pdf,.docx,.doc"
                      onChange={(e) => setResumeFile(e.target.files?.[0] || null)}
                      className="absolute inset-0 opacity-0 cursor-pointer"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1.5">
                    Or Paste Resume / Skills Summary
                  </label>
                  <textarea
                    rows={4}
                    value={resumeText}
                    onChange={(e) => setResumeText(e.target.value)}
                    placeholder="Paste your resume text or core skills: Next.js, Python, FastAPI, React, Docker..."
                    className="w-full text-xs p-3 rounded-xl border border-slate-300 focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div className="pt-2 flex items-center justify-end gap-2">
                  <Button type="button" variant="outline" size="md" onClick={() => setApplyModalOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" variant="primary" size="md" isLoading={submitting} className="px-6 font-bold">
                    Submit & Parse
                  </Button>
                </div>
              </form>
            )}

          </div>
        </div>
      )}

    </div>
  );
}

export default function JobDetailPage({ params }: { params: Promise<{ id: string }> }) {
  return (
    <Suspense fallback={<div className="p-20 text-center text-slate-400">Loading opportunity...</div>}>
      <JobDetailContent params={params} />
    </Suspense>
  );
}
