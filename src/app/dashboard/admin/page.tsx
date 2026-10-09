"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Shield,
  Building,
  Users,
  Briefcase,
  FileCheck,
  CheckCircle,
  XCircle,
  Clock,
  Search,
  Filter,
  AlertTriangle,
  History,
  Lock,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { api } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";

export default function AdminDashboardPage() {
  const { user } = useAuth();
  const [metrics, setMetrics] = useState({
    total_users: 5,
    total_companies: 3,
    pending_company_approvals: 1,
    total_jobs: 2,
    total_applications: 3,
    audit_events_logged: 12,
  });
  const [companies, setCompanies] = useState<any[]>([]);
  const [auditLogs, setAuditLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAdminData();
  }, [user]);

  const loadAdminData = async () => {
    setLoading(true);
    try {
      const [m, comps, audits] = await Promise.all([
        api.analytics.admin().catch(() => null),
        api.companies.list().catch(() => []),
        api.audit.list(30).catch(() => []),
      ]);

      if (m) setMetrics(m);
      if (comps) setCompanies(comps);
      if (audits) setAuditLogs(audits);
    } catch (e) {
      console.warn("Could not load admin data, using demo state:", e);
    } finally {
      setLoading(false);
    }
  };

  const handleCompanyStatus = async (companyId: string, status: "APPROVED" | "REJECTED") => {
    try {
      await api.companies.updateStatus(companyId, status);
      setCompanies((prev) =>
        prev.map((c) => (c.id === companyId ? { ...c, status } : c))
      );
      loadAdminData();
    } catch (e: any) {
      alert(e.message || "Failed to update company status.");
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full flex-1">
      
      {/* Admin Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 text-xs text-slate-500 mb-2">
          <Link href="/" className="hover:text-blue-600">Home</Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-slate-900 font-semibold">System Administration</span>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1c4980] tracking-tight flex items-center gap-2.5">
              <Shield className="w-7 h-7 text-[#0066FF]" />
              Platform Administration & Audit
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Organization verifications, platform usage metrics, and cryptographically logged sensitive audit events.
            </p>
          </div>
          <Badge variant="purple" className="py-1 px-3 text-xs self-start sm:self-auto">
            SuperAdmin RBAC Active
          </Badge>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mb-8">
        <Card className="p-4 bg-white border-slate-200">
          <span className="text-[10px] font-bold text-slate-500 uppercase">Users</span>
          <p className="text-2xl font-black text-slate-900 mt-1">{metrics.total_users}</p>
        </Card>
        <Card className="p-4 bg-white border-slate-200">
          <span className="text-[10px] font-bold text-slate-500 uppercase">Companies</span>
          <p className="text-2xl font-black text-slate-900 mt-1">{metrics.total_companies}</p>
        </Card>
        <Card className="p-4 bg-white border-slate-200">
          <span className="text-[10px] font-bold text-amber-600 uppercase">Pending Review</span>
          <p className="text-2xl font-black text-amber-600 mt-1">{metrics.pending_company_approvals}</p>
        </Card>
        <Card className="p-4 bg-white border-slate-200">
          <span className="text-[10px] font-bold text-slate-500 uppercase">Live Jobs</span>
          <p className="text-2xl font-black text-blue-600 mt-1">{metrics.total_jobs}</p>
        </Card>
        <Card className="p-4 bg-white border-slate-200">
          <span className="text-[10px] font-bold text-slate-500 uppercase">Applications</span>
          <p className="text-2xl font-black text-indigo-600 mt-1">{metrics.total_applications}</p>
        </Card>
        <Card className="p-4 bg-white border-slate-200">
          <span className="text-[10px] font-bold text-slate-500 uppercase">Audit Events</span>
          <p className="text-2xl font-black text-purple-600 mt-1">{metrics.audit_events_logged}</p>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Company Approvals Queue */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-[#1c4980] flex items-center gap-2">
              <Building className="w-4 h-4 text-[#0066FF]" />
              Company Verification Queue
            </h2>
            <span className="text-xs text-slate-500">
              Rule: Only approved companies may publish jobs
            </span>
          </div>

          <div className="space-y-3">
            {companies.length === 0 ? (
              <Card className="p-8 text-center text-xs text-slate-400">
                No registered companies found.
              </Card>
            ) : (
              companies.map((comp) => (
                <Card key={comp.id} className="p-4 bg-white border border-slate-200 space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-bold text-sm text-slate-900">{comp.name}</h4>
                      <p className="text-xs text-slate-500">{comp.location} • {comp.industry || "Software"}</p>
                      {comp.website && (
                        <a href={comp.website} target="_blank" className="text-[11px] text-blue-600 hover:underline">
                          {comp.website}
                        </a>
                      )}
                    </div>
                    <Badge
                      variant={
                        comp.status === "APPROVED"
                          ? "success"
                          : comp.status === "PENDING"
                          ? "warning"
                          : "destructive"
                      }
                    >
                      {comp.status}
                    </Badge>
                  </div>

                  <p className="text-xs text-slate-600 line-clamp-2">
                    {comp.description || "Tech employer seeking candidate applications."}
                  </p>

                  {comp.status === "PENDING" && (
                    <div className="pt-2 border-t border-slate-100 flex items-center justify-end gap-2">
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleCompanyStatus(comp.id, "REJECTED")}
                      >
                        Reject
                      </Button>
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => handleCompanyStatus(comp.id, "APPROVED")}
                      >
                        Approve Organization
                      </Button>
                    </div>
                  )}
                </Card>
              ))
            )}
          </div>
        </div>

        {/* Audit Log Stream */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-[#1c4980] flex items-center gap-2">
              <History className="w-4 h-4 text-purple-600" />
              Security & Audit Log Stream
            </h2>
            <span className="text-xs text-slate-500">
              Immutable Records
            </span>
          </div>

          <div className="space-y-2.5 max-h-[600px] overflow-y-auto pr-1">
            {auditLogs.length === 0 ? (
              <Card className="p-8 text-center text-xs text-slate-400">
                No audit events recorded yet.
              </Card>
            ) : (
              auditLogs.map((log) => (
                <div
                  key={log.id}
                  className="p-3 bg-white rounded-xl border border-slate-200 text-xs space-y-1 hover:border-slate-300 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-extrabold text-slate-900 text-xs">
                      {log.action}
                    </span>
                    <Badge
                      variant={log.outcome === "SUCCESS" ? "success" : "destructive"}
                      className="text-[10px] py-0"
                    >
                      {log.outcome}
                    </Badge>
                  </div>
                  <p className="text-[11px] text-slate-600">{log.details}</p>
                  <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1 border-t border-slate-50">
                    <span>Target: {log.target_type || "N/A"}</span>
                    <span>{new Date(log.created_at).toLocaleTimeString()}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

      </div>

    </div>
  );
}
