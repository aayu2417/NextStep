"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Search,
  MapPin,
  Briefcase,
  Clock,
  Building,
  Filter,
  Sparkles,
  ArrowRight,
  ChevronRight,
  CheckCircle2,
  X,
  Layers,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { api } from "@/lib/api";
import { formatTimeRemaining } from "@/lib/utils";

export default function JobsDiscoveryPage() {
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Filter States
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDept, setSelectedDept] = useState("All");
  const [selectedLocation, setSelectedLocation] = useState("All");
  const [selectedType, setSelectedType] = useState("All");
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  useEffect(() => {
    loadJobs();
  }, [selectedDept, selectedType]);

  const loadJobs = async () => {
    setLoading(true);
    try {
      const data = await api.jobs.list({
        q: searchQuery,
        department: selectedDept !== "All" ? selectedDept : undefined,
        employment_type: selectedType !== "All" ? selectedType : undefined,
      });
      setJobs(data);
    } catch (e) {
      console.warn("Could not load from API, using demo jobs:", e);
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
    } finally {
      setLoading(false);
    }
  };

  const departments = [
    "All",
    "Engineering",
    "Artificial Intelligence",
    "Design",
    "Infrastructure",
    "Human Resources",
  ];

  const locations = ["All", "Bengaluru", "Mumbai", "Remote", "Hyderabad", "Gurugram"];
  const employmentTypes = [
    { label: "All Types", value: "All" },
    { label: "Full-Time", value: "FULL_TIME" },
    { label: "Part-Time", value: "PART_TIME" },
    { label: "Internship", value: "INTERNSHIP" },
    { label: "Remote", value: "REMOTE" },
  ];

  const filteredJobs = jobs.filter((j) => {
    const matchesSearch =
      !searchQuery ||
      j.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      j.company?.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      j.location?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesLoc =
      selectedLocation === "All" ||
      (j.location || j.company?.location || "").toLowerCase().includes(selectedLocation.toLowerCase());

    return matchesSearch && matchesLoc;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full flex-1">
      
      {/* Top Breadcrumb & Header */}
      <div className="mb-6">
        <div className="flex items-center gap-2 text-xs text-slate-500 mb-2">
          <Link href="/" className="hover:text-blue-600">Home</Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-slate-900 font-semibold">Explore Jobs</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1c4980] tracking-tight">
          Find Your Next Career Move
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Discover verified opportunities with real-time application state tracking and instant resume screening.
        </p>
      </div>

      {/* Prominent Unstop Search Bar */}
      <div className="bg-white p-2.5 rounded-2xl shadow-sm border border-slate-200 mb-8 flex flex-col sm:flex-row gap-2">
        <div className="flex-1">
          <Input
            type="text"
            placeholder="Search by job title, skill (e.g. Next.js, Python), or company..."
            icon={<Search className="w-4 h-4 text-slate-400" />}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="border-0 bg-transparent shadow-none"
          />
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="md"
            className="lg:hidden flex items-center gap-1.5"
            onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
          >
            <Filter className="w-4 h-4" />
            Filters
          </Button>
          <Button variant="primary" size="md" onClick={loadJobs} className="px-6">
            Search
          </Button>
        </div>
      </div>

      {/* Layout Grid: Left Sidebar Filters + Right Job Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Left Persistent Filter Sidebar (Desktop) */}
        <aside className={`lg:block ${mobileFilterOpen ? "block fixed inset-0 z-50 bg-white p-6 overflow-y-auto" : "hidden"} lg:relative lg:p-0`}>
          {mobileFilterOpen && (
            <div className="flex items-center justify-between pb-4 border-b border-slate-200 mb-4 lg:hidden">
              <h3 className="font-bold text-lg text-slate-900">Filter Jobs</h3>
              <button onClick={() => setMobileFilterOpen(false)} className="p-1 text-slate-500">
                <X className="w-5 h-5" />
              </button>
            </div>
          )}

          <div className="bg-white rounded-2xl p-5 border border-slate-200 space-y-6 shadow-sm sticky top-20">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                <Filter className="w-4 h-4 text-[#0066FF]" />
                Filters
              </h3>
              <button
                onClick={() => {
                  setSelectedDept("All");
                  setSelectedLocation("All");
                  setSelectedType("All");
                  setSearchQuery("");
                }}
                className="text-xs text-blue-600 hover:underline font-semibold"
              >
                Clear all
              </button>
            </div>

            {/* Department Filter */}
            <div>
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-2.5">
                Department
              </label>
              <div className="space-y-1.5">
                {departments.map((dept) => (
                  <button
                    key={dept}
                    onClick={() => setSelectedDept(dept)}
                    className={`w-full text-left px-3 py-1.5 rounded-xl text-xs font-medium transition-colors ${
                      selectedDept === dept
                        ? "bg-blue-50 text-[#0066FF] font-bold"
                        : "text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    {dept}
                  </button>
                ))}
              </div>
            </div>

            {/* Employment Type */}
            <div>
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-2.5">
                Employment Type
              </label>
              <div className="space-y-1.5">
                {employmentTypes.map((type) => (
                  <button
                    key={type.value}
                    onClick={() => setSelectedType(type.value)}
                    className={`w-full text-left px-3 py-1.5 rounded-xl text-xs font-medium transition-colors ${
                      selectedType === type.value
                        ? "bg-blue-50 text-[#0066FF] font-bold"
                        : "text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    {type.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Location Filter */}
            <div>
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-2.5">
                Location
              </label>
              <div className="space-y-1.5">
                {locations.map((loc) => (
                  <button
                    key={loc}
                    onClick={() => setSelectedLocation(loc)}
                    className={`w-full text-left px-3 py-1.5 rounded-xl text-xs font-medium transition-colors ${
                      selectedLocation === loc
                        ? "bg-blue-50 text-[#0066FF] font-bold"
                        : "text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    {loc}
                  </button>
                ))}
              </div>
            </div>

            {mobileFilterOpen && (
              <Button
                variant="primary"
                size="md"
                className="w-full mt-4"
                onClick={() => setMobileFilterOpen(false)}
              >
                Apply Filters
              </Button>
            )}
          </div>
        </aside>

        {/* Right Job Cards Grid */}
        <main className="lg:col-span-3 space-y-4">
          <div className="flex items-center justify-between text-xs text-slate-500 font-semibold mb-2">
            <span>Showing {filteredJobs.length} active opportunities</span>
            <span className="flex items-center gap-1 text-emerald-600">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Direct Employer Hiring
            </span>
          </div>

          {loading ? (
            <div className="p-12 text-center text-slate-400">Loading opportunities...</div>
          ) : filteredJobs.length === 0 ? (
            <div className="bg-white rounded-2xl p-12 text-center border border-slate-200">
              <Layers className="w-10 h-10 text-slate-300 mx-auto mb-3" />
              <h3 className="font-bold text-slate-700">No jobs match your filter criteria</h3>
              <p className="text-xs text-slate-500 mt-1">Try clearing filters or searching another keyword.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {filteredJobs.map((job) => (
                <Card key={job.id} interactive className="flex flex-col justify-between group">
                  <CardHeader className="p-5 pb-3">
                    <div className="flex items-start justify-between gap-3">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100 flex items-center justify-center text-[#1c4980] font-bold text-base group-hover:scale-105 transition-transform">
                        {job.company?.name ? job.company.name.slice(0, 2).toUpperCase() : "AP"}
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
                      <Badge variant="default" className="font-normal">
                        {job.department}
                      </Badge>
                    </div>

                    <div className="pt-2 flex items-center justify-between text-xs font-semibold text-slate-700">
                      <span className="text-slate-500">Compensation:</span>
                      <span className="text-[#1c4980] font-bold">{job.salary_range || "Competitive"}</span>
                    </div>
                  </CardContent>

                  <CardFooter className="p-5 pt-3 border-t border-slate-100 flex items-center justify-between gap-2 mt-auto">
                    <Link href={`/jobs/${job.id}`} className="w-full">
                      <Button variant="primary" size="sm" className="w-full gap-1.5">
                        View & Apply
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Button>
                    </Link>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </main>

      </div>
    </div>
  );
}
