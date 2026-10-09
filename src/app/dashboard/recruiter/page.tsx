"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Briefcase,
  Users,
  Calendar,
  CheckCircle,
  Clock,
  Sparkles,
  ArrowRight,
  Filter,
  Search,
  Plus,
  Eye,
  Video,
  FileText,
  AlertCircle,
  X,
  ChevronRight,
  TrendingUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { api } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";

const KANBAN_STAGES = ["APPLIED", "SCREENED", "INTERVIEW", "OFFER", "HIRED"];

export default function RecruiterDashboardPage() {
  const { user } = useAuth();
  
  // Metrics & State
  const [metrics, setMetrics] = useState({
    open_jobs: 2,
    total_applicants: 5,
    interviews_scheduled: 2,
    offers_extended: 1,
  });
  const [jobs, setJobs] = useState<any[]>([]);
  const [selectedJobId, setSelectedJobId] = useState<string>("");
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Modals
  const [selectedCandidate, setSelectedCandidate] = useState<any>(null);
  const [interviewModalOpen, setInterviewModalOpen] = useState(false);
  const [createJobModalOpen, setCreateJobModalOpen] = useState(false);

  // Interview Form State
  const [interviewDate, setInterviewDate] = useState("");
  const [interviewMode, setInterviewMode] = useState("VIDEO");
  const [interviewTitle, setInterviewTitle] = useState("Technical Assessment & Problem Solving");
  const [scheduling, setScheduling] = useState(false);
  const [scheduleMsg, setScheduleMsg] = useState<string | null>(null);

  // New Job Form State
  const [newJob, setNewJob] = useState({
    title: "",
    department: "Engineering",
    location: "Bengaluru, India (Hybrid)",
    salary_range: "₹18 - ₹26 LPA",
    employment_type: "FULL_TIME",
    description: "",
    requirements: "",
    application_deadline: "",
  });
  const [creatingJob, setCreatingJob] = useState(false);

  useEffect(() => {
    loadDashboardData();
  }, [user]);

  useEffect(() => {
    if (selectedJobId) {
      loadJobApplications(selectedJobId);
    }
  }, [selectedJobId]);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      // 1. Fetch metrics
      const m = await api.analytics.hr().catch(() => null);
      if (m) setMetrics(m);

      // 2. Fetch jobs
      const jList = await api.jobs.list();
      setJobs(jList);
      if (jList.length > 0) {
        setSelectedJobId(jList[0].id);
      }
    } catch (e) {
      console.warn("Failed to load HR data, using fallback:", e);
    } finally {
      setLoading(false);
    }
  };

  const loadJobApplications = async (jobId: string) => {
    try {
      const apps = await api.applications.byJob(jobId);
      setApplications(apps);
    } catch (e) {
      console.warn("Using sample applications:", e);
      setApplications([
        {
          id: "app-1",
          candidate: {
            full_name: "Aarav Mehta",
            email: "aarav.mehta@example.com",
            phone_number: "+91 98765 43210",
            headline: "Full-Stack Engineer (React & Python)",
          },
          status: "SCREENED",
          screening_score: 88.5,
          parsed_skills: '["python", "react", "next.js", "fastapi", "postgresql", "tailwind"]',
          parsed_experience_years: 3.5,
          parsed_education: "B.TECH IN COMPUTER SCIENCE",
          screening_notes: "Strong match: 6 out of 7 required skills matched.",
        },
        {
          id: "app-2",
          candidate: {
            full_name: "Rohit Verma",
            email: "rohit.verma@example.com",
            headline: "Frontend Specialist",
          },
          status: "APPLIED",
          screening_score: 72.0,
          parsed_skills: '["react", "typescript", "tailwind", "figma"]',
          parsed_experience_years: 2.0,
          parsed_education: "BACHELOR OF SCIENCE",
          screening_notes: "Moderate match: Missing backend Python proficiency.",
        },
      ]);
    }
  };

  const handleStageTransition = async (appId: string, nextStage: string) => {
    try {
      await api.applications.updateStatus(appId, nextStage);
      // Update locally
      setApplications((prev) =>
        prev.map((a) => (a.id === appId ? { ...a, status: nextStage } : a))
      );
      if (selectedCandidate && selectedCandidate.id === appId) {
        setSelectedCandidate({ ...selectedCandidate, status: nextStage });
      }
    } catch (e: any) {
      alert(e.message || "Could not transition stage. State machine rule violated.");
    }
  };

  const handleScheduleInterview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCandidate) return;
    setScheduling(true);
    setScheduleMsg(null);

    try {
      await api.interviews.schedule({
        application_id: selectedCandidate.id,
        title: interviewTitle,
        scheduled_at: new Date(interviewDate).toISOString(),
        mode: interviewMode,
        meeting_link: "https://meet.google.com/atrp-candidate-interview",
      });
      // Transition candidate to INTERVIEW if screened
      if (selectedCandidate.status === "SCREENED") {
        setApplications((prev) =>
          prev.map((a) =>
            a.id === selectedCandidate.id ? { ...a, status: "INTERVIEW" } : a
          )
        );
      }
      setScheduleMsg("Interview scheduled and invite dispatched to candidate!");
      setTimeout(() => {
        setInterviewModalOpen(false);
        setScheduleMsg(null);
      }, 1500);
    } catch (err: any) {
      setScheduleMsg(err.message || "Failed to schedule interview. Candidate must be Screened or beyond.");
    } finally {
      setScheduling(false);
    }
  };

  const handleCreateJob = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreatingJob(true);
    try {
      const created = await api.jobs.create({
        ...newJob,
        application_deadline: new Date(newJob.application_deadline).toISOString(),
      });
      setJobs((prev) => [created, ...prev]);
      setSelectedJobId(created.id);
      setCreateJobModalOpen(false);
    } catch (e: any) {
      alert(e.message || "Failed to create job posting. Company approval required.");
    } finally {
      setCreatingJob(false);
    }
  };

  const selectedJob = jobs.find((j) => j.id === selectedJobId) || jobs[0];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full flex-1">
      
      {/* Top Header & Post Job Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
            <Link href="/" className="hover:text-blue-600">Home</Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-slate-900 font-semibold">HR Recruiter ATS</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1c4980] tracking-tight">
            Recruiter Organizer & Pipeline
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Manage job postings, review automated resume screening scores, and move candidates across stages.
          </p>
        </div>

        <Button
          variant="primary"
          size="md"
          onClick={() => setCreateJobModalOpen(true)}
          className="gap-2 font-bold shadow-md shadow-blue-500/20"
        >
          <Plus className="w-4 h-4" />
          Post New Opening
        </Button>
      </div>

      {/* Metric Cards (Unstop Recruiter Overview) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card className="p-5 border-slate-200 bg-white">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Open Jobs</span>
            <div className="p-2 rounded-xl bg-blue-50 text-[#0066FF]">
              <Briefcase className="w-5 h-5" />
            </div>
          </div>
          <p className="text-3xl font-black text-[#1c4980] mt-3">{metrics.open_jobs}</p>
          <p className="text-[11px] text-emerald-600 font-semibold mt-1">Live on career portal</p>
        </Card>

        <Card className="p-5 border-slate-200 bg-white">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Applicants</span>
            <div className="p-2 rounded-xl bg-indigo-50 text-indigo-600">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <p className="text-3xl font-black text-indigo-600 mt-3">{metrics.total_applicants}</p>
          <p className="text-[11px] text-slate-500 font-semibold mt-1">Parsed & scored</p>
        </Card>

        <Card className="p-5 border-slate-200 bg-white">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Interviews Active</span>
            <div className="p-2 rounded-xl bg-purple-50 text-purple-600">
              <Calendar className="w-5 h-5" />
            </div>
          </div>
          <p className="text-3xl font-black text-purple-600 mt-3">{metrics.interviews_scheduled}</p>
          <p className="text-[11px] text-purple-600 font-semibold mt-1">With Hiring Managers</p>
        </Card>

        <Card className="p-5 border-slate-200 bg-white">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Offers Extended</span>
            <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600">
              <CheckCircle className="w-5 h-5" />
            </div>
          </div>
          <p className="text-3xl font-black text-emerald-600 mt-3">{metrics.offers_extended}</p>
          <p className="text-[11px] text-emerald-600 font-semibold mt-1">Hired / Final stage</p>
        </Card>
      </div>

      {/* Job Selector Dropdown Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="text-xs font-bold text-slate-500 uppercase">Select Job Pipeline:</span>
          <select
            value={selectedJobId}
            onChange={(e) => setSelectedJobId(e.target.value)}
            className="text-sm font-semibold text-slate-800 bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 focus:outline-none focus:border-blue-500"
          >
            {jobs.map((j) => (
              <option key={j.id} value={j.id}>
                {j.title} ({j.department})
              </option>
            ))}
          </select>
        </div>

        {selectedJob && (
          <div className="flex items-center gap-3 text-xs text-slate-500">
            <span>Compensation: <strong className="text-slate-800">{selectedJob.salary_range}</strong></span>
            <span>•</span>
            <span>Location: <strong className="text-slate-800">{selectedJob.location}</strong></span>
          </div>
        )}
      </div>

      {/* Kanban Board (Unstop Applicant Tracking) */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 overflow-x-auto pb-4">
        {KANBAN_STAGES.map((stage) => {
          const stageApplicants = applications.filter((a) => a.status === stage);

          return (
            <div key={stage} className="bg-slate-100/80 rounded-2xl p-3 flex flex-col min-w-[220px]">
              {/* Column Header */}
              <div className="flex items-center justify-between pb-3 px-1 border-b border-slate-200 mb-3">
                <span className="font-extrabold text-xs text-[#1c4980] tracking-wide">
                  {stage}
                </span>
                <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-white text-slate-700 shadow-2xs">
                  {stageApplicants.length}
                </span>
              </div>

              {/* Cards in this column */}
              <div className="space-y-3 flex-1">
                {stageApplicants.length === 0 ? (
                  <div className="py-8 text-center text-[11px] text-slate-400 font-medium">
                    No candidates
                  </div>
                ) : (
                  stageApplicants.map((app) => (
                    <Card
                      key={app.id}
                      className="p-3.5 bg-white border border-slate-200 hover:border-blue-400 cursor-pointer shadow-2xs transition-all space-y-2.5"
                      onClick={() => setSelectedCandidate(app)}
                    >
                      <div className="flex items-start justify-between gap-1">
                        <div>
                          <p className="font-bold text-xs text-slate-900 line-clamp-1">
                            {app.candidate?.full_name || "Applicant"}
                          </p>
                          <p className="text-[10px] text-slate-500 line-clamp-1">
                            {app.candidate?.headline || app.candidate?.email}
                          </p>
                        </div>
                        {app.screening_score && (
                          <span className="text-[10px] font-extrabold px-1.5 py-0.5 rounded bg-blue-50 text-[#0066FF] border border-blue-200">
                            {app.screening_score}%
                          </span>
                        )}
                      </div>

                      {/* Stage Action Controls */}
                      <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedCandidate(app);
                          }}
                          className="text-[#0066FF] font-semibold hover:underline flex items-center gap-1"
                        >
                          <Eye className="w-3 h-3" />
                          Review
                        </button>

                        {stage === "APPLIED" && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleStageTransition(app.id, "SCREENED");
                            }}
                            className="text-indigo-600 font-bold hover:underline"
                          >
                            Pass Screen ➔
                          </button>
                        )}
                        {stage === "SCREENED" && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedCandidate(app);
                              setInterviewModalOpen(true);
                            }}
                            className="text-purple-600 font-bold hover:underline"
                          >
                            Schedule ➔
                          </button>
                        )}
                        {stage === "INTERVIEW" && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleStageTransition(app.id, "OFFER");
                            }}
                            className="text-amber-600 font-bold hover:underline"
                          >
                            Extend Offer ➔
                          </button>
                        )}
                        {stage === "OFFER" && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleStageTransition(app.id, "HIRED");
                            }}
                            className="text-emerald-600 font-bold hover:underline"
                          >
                            Mark Hired ➔
                          </button>
                        )}
                      </div>
                    </Card>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Candidate Screening Review Modal (Unstop Screening View) */}
      {selectedCandidate && !interviewModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto">
            
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#1c4980] to-[#0066FF] flex items-center justify-center text-white font-bold text-lg">
                  {selectedCandidate.candidate?.full_name?.slice(0, 2).toUpperCase()}
                </div>
                <div>
                  <h3 className="font-extrabold text-lg text-[#1c4980]">
                    {selectedCandidate.candidate?.full_name}
                  </h3>
                  <p className="text-xs text-slate-500">
                    {selectedCandidate.candidate?.email} • {selectedCandidate.candidate?.phone_number || "+91 98765 43210"}
                  </p>
                </div>
              </div>
              <button onClick={() => setSelectedCandidate(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Screening Score Banner */}
            <div className="py-4">
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl p-4 flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-blue-900 block">Automated ATS Screening Score</span>
                  <p className="text-xs text-slate-600 mt-1 max-w-md">
                    {selectedCandidate.screening_notes || "Parsed skills matched against role criteria."}
                  </p>
                </div>
                <div className="text-center px-4 py-2 bg-white rounded-xl shadow-xs border border-blue-200">
                  <span className="text-2xl font-black text-[#0066FF]">{selectedCandidate.screening_score}%</span>
                  <span className="text-[10px] text-slate-400 block font-semibold">Match Score</span>
                </div>
              </div>
            </div>

            {/* Side-by-Side: Parsed Resume vs Job Requirements */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-2 text-xs">
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                <h4 className="font-bold text-slate-800 flex items-center gap-1.5 text-xs uppercase tracking-wider">
                  <FileText className="w-4 h-4 text-blue-600" />
                  Parsed Resume Profile
                </h4>
                <div>
                  <span className="text-slate-500 font-semibold block mb-1">Extracted Skills:</span>
                  <div className="flex flex-wrap gap-1">
                    {(() => {
                      try {
                        const skills = JSON.parse(selectedCandidate.parsed_skills || "[]");
                        return skills.map((s: string) => (
                          <Badge key={s} variant="secondary" className="text-[10px]">
                            {s}
                          </Badge>
                        ));
                      } catch {
                        return <span>None extracted</span>;
                      }
                    })()}
                  </div>
                </div>
                <div>
                  <span className="text-slate-500 font-semibold">Assessed Experience: </span>
                  <span className="font-bold text-slate-800">{selectedCandidate.parsed_experience_years || 2} Years</span>
                </div>
                <div>
                  <span className="text-slate-500 font-semibold">Education: </span>
                  <span className="font-bold text-slate-800">{selectedCandidate.parsed_education || "Undergraduate Degree"}</span>
                </div>
              </div>

              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                <h4 className="font-bold text-slate-800 flex items-center gap-1.5 text-xs uppercase tracking-wider">
                  <Briefcase className="w-4 h-4 text-[#1c4980]" />
                  Job Requirements
                </h4>
                <div className="text-slate-600 leading-relaxed whitespace-pre-line">
                  {selectedJob?.requirements || "Proficiency in Next.js, FastAPI, TypeScript, React, Docker."}
                </div>
              </div>
            </div>

            {/* Action Bar */}
            <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 mt-4">
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-500">Current Stage:</span>
                <Badge variant="default">{selectedCandidate.status}</Badge>
              </div>

              <div className="flex items-center gap-2">
                {/* Rule 4: Interviews can only be scheduled for applications that are in Screened or beyond */}
                <Button
                  variant="secondary"
                  size="sm"
                  disabled={selectedCandidate.status === "APPLIED"}
                  onClick={() => setInterviewModalOpen(true)}
                  className="gap-1.5"
                >
                  <Video className="w-3.5 h-3.5" />
                  Schedule Interview
                </Button>

                {selectedCandidate.status === "APPLIED" && (
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => handleStageTransition(selectedCandidate.id, "SCREENED")}
                  >
                    Pass Screening
                  </Button>
                )}
                {selectedCandidate.status === "SCREENED" && (
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => handleStageTransition(selectedCandidate.id, "INTERVIEW")}
                  >
                    Move to Interview
                  </Button>
                )}
                {selectedCandidate.status === "INTERVIEW" && (
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => handleStageTransition(selectedCandidate.id, "OFFER")}
                  >
                    Extend Offer
                  </Button>
                )}
                {selectedCandidate.status === "OFFER" && (
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => handleStageTransition(selectedCandidate.id, "HIRED")}
                  >
                    Mark as Hired
                  </Button>
                )}
              </div>
            </div>

          </div>
        </div>
      )}

      {/* Schedule Interview Modal */}
      {interviewModalOpen && selectedCandidate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-extrabold text-base text-[#1c4980] flex items-center gap-2">
                <Calendar className="w-4 h-4 text-[#0066FF]" />
                Schedule Interview
              </h3>
              <button onClick={() => setInterviewModalOpen(false)} className="text-slate-400">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleScheduleInterview} className="space-y-4 py-4 text-xs">
              {scheduleMsg && (
                <div className="p-3 bg-blue-50 border border-blue-200 text-blue-700 rounded-xl font-medium">
                  {scheduleMsg}
                </div>
              )}

              <div>
                <label className="font-bold text-slate-700 block mb-1">Candidate</label>
                <p className="font-semibold text-slate-900">{selectedCandidate.candidate?.full_name} ({selectedCandidate.candidate?.email})</p>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Interview Round Title</label>
                <Input
                  type="text"
                  value={interviewTitle}
                  onChange={(e) => setInterviewTitle(e.target.value)}
                  required
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Date & Time</label>
                <Input
                  type="datetime-local"
                  value={interviewDate}
                  onChange={(e) => setInterviewDate(e.target.value)}
                  required
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Mode</label>
                <select
                  value={interviewMode}
                  onChange={(e) => setInterviewMode(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 text-xs focus:outline-none focus:border-blue-500"
                >
                  <option value="VIDEO">Google Meet / Video Call</option>
                  <option value="IN_PERSON">In-Person at Office</option>
                  <option value="PHONE">Telephonic Screening</option>
                </select>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <Button type="button" variant="outline" size="sm" onClick={() => setInterviewModalOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" variant="primary" size="sm" isLoading={scheduling}>
                  Send Invite
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Post New Opening Modal */}
      {createJobModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-extrabold text-base text-[#1c4980]">Post New Job Opening</h3>
              <button onClick={() => setCreateJobModalOpen(false)} className="text-slate-400">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateJob} className="space-y-4 py-4 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Job Title</label>
                <Input
                  type="text"
                  placeholder="e.g. Lead Cloud Architect"
                  value={newJob.title}
                  onChange={(e) => setNewJob({ ...newJob, title: e.target.value })}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Department</label>
                  <Input
                    type="text"
                    value={newJob.department}
                    onChange={(e) => setNewJob({ ...newJob, department: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Location</label>
                  <Input
                    type="text"
                    value={newJob.location}
                    onChange={(e) => setNewJob({ ...newJob, location: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Compensation Range</label>
                  <Input
                    type="text"
                    placeholder="e.g. ₹20 - ₹30 LPA"
                    value={newJob.salary_range}
                    onChange={(e) => setNewJob({ ...newJob, salary_range: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Application Deadline</label>
                  <Input
                    type="datetime-local"
                    value={newJob.application_deadline}
                    onChange={(e) => setNewJob({ ...newJob, application_deadline: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Role Description</label>
                <textarea
                  rows={3}
                  placeholder="Describe core responsibilities..."
                  value={newJob.description}
                  onChange={(e) => setNewJob({ ...newJob, description: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-300 text-xs focus:outline-none focus:border-blue-500"
                  required
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Requirements & Skills</label>
                <textarea
                  rows={3}
                  placeholder="Python, Next.js, React, Docker..."
                  value={newJob.requirements}
                  onChange={(e) => setNewJob({ ...newJob, requirements: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-300 text-xs focus:outline-none focus:border-blue-500"
                  required
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <Button type="button" variant="outline" size="sm" onClick={() => setCreateJobModalOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" variant="primary" size="sm" isLoading={creatingJob}>
                  Publish Opening
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
