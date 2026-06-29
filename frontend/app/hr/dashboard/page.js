"use client";

import { useEffect, useState } from "react";
import DashboardShell from "../../../components/shared/DashboardShell";
import StatCard from "../../../components/ui/StatCard";
import LoadingSpinner from "../../../components/shared/LoadingSpinner";
import { IconHome, IconClipboard, IconChart, IconHandshake, IconCheckCircle, IconUsers } from "../../../components/icons/NavIcons";
import { useAuth } from "../../../lib/authContext";
import config from "../../../lib/config";

const navItems = [
  { href: "/hr/dashboard", label: "Dashboard", icon: <IconHome /> },
  { href: "/hr/job-posting", label: "Job Postings", icon: <IconClipboard /> },
  { href: "/hr/ranked-candidates", label: "Ranked Candidates", icon: <IconChart /> },
  { href: "/hr/hire-onboarding", label: "Onboarding", icon: <IconHandshake /> },
  { href: "/hr/finalize-hire", label: "Finalize Hire", icon: <IconCheckCircle /> },
];

export default function HrDashboard() {
  const { firebaseUser } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchJobs() {
      if (!firebaseUser) return;
      try {
        const idToken = await firebaseUser.getIdToken();
        const res = await fetch(`${config.api.getBaseUrl()}/api/v1/jobs/mine`, {
          headers: { Authorization: `Bearer ${idToken}` },
        });
        const data = await res.json();
        if (res.ok) setJobs(data.jobs);
      } catch (err) {
        console.error("Failed to load jobs:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchJobs();
  }, [firebaseUser]);

  const activeCount = jobs.filter((j) => j.status === "open").length;

  return (
    <DashboardShell navItems={navItems} roleLabel="HR / Recruiter">
      <h1 className="text-2xl font-bold text-foreground mb-1">HR Dashboard</h1>
      <p className="text-muted-foreground mb-6">Overview of your hiring pipeline.</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard label="Active Job Posts" value={activeCount} icon={<IconClipboard className="w-5 h-5" />} />
        <StatCard label="Total Job Posts" value={jobs.length} icon={<IconUsers className="w-5 h-5" />} />
        <StatCard label="Shortlisted" value="0" icon={<IconChart className="w-5 h-5" />} />
        <StatCard label="Hired This Month" value="0" icon={<IconCheckCircle className="w-5 h-5" />} />
      </div>

      <div className="bg-card border border-border rounded-2xl overflow-hidden">
        <div className="px-5 py-4 border-b border-border flex items-center justify-between">
          <h2 className="font-semibold text-foreground">Your Job Postings</h2>
        </div>

        {loading ? (
          <div className="flex justify-center py-8">
            <LoadingSpinner size={24} />
          </div>
        ) : jobs.length === 0 ? (
          <p className="px-5 py-6 text-sm text-muted-foreground">
            You haven't posted any jobs yet. Go to Job Postings to create one.
          </p>
        ) : (
          <div className="divide-y divide-border">
            {jobs.map((job) => (
              <div key={job._id} className="flex items-center justify-between px-5 py-4">
                <div>
                  <p className="font-medium text-foreground">{job.title}</p>
                  <p className="text-sm text-muted-foreground">{job.department}</p>
                </div>
                <span
                  className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                    job.status === "open"
                      ? "bg-primary/10 text-primary"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  {job.status === "open" ? "Open" : "Closed"}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardShell>
  );
}