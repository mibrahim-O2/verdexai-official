"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import DashboardShell from "../../../components/shared/DashboardShell";
import LoadingSpinner from "../../../components/shared/LoadingSpinner";
import { IconHome, IconBriefcase, IconClipboard } from "../../../components/icons/NavIcons";
import config from "../../../lib/config";

const navItems = [
  { href: "/candidate/dashboard", label: "Dashboard", icon: <IconHome /> },
  { href: "/candidate/apply", label: "Browse Jobs", icon: <IconBriefcase /> },
  { href: "/candidate/onboarding", label: "Onboarding", icon: <IconClipboard /> },
];

export default function BrowseJobsPage() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchJobs() {
      try {
        const res = await fetch(`${config.api.getBaseUrl()}/api/v1/jobs`);
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed to load jobs.");
        setJobs(data.jobs);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchJobs();
  }, []);

  return (
    <DashboardShell navItems={navItems} roleLabel="Candidate">
      <h1 className="text-2xl font-bold text-foreground mb-1">Browse Jobs</h1>
      <p className="text-muted-foreground mb-6">Open positions available right now.</p>

      {loading && (
        <div className="flex justify-center py-10">
          <LoadingSpinner size={28} />
        </div>
      )}

      {error && (
        <div className="px-4 py-2.5 rounded-lg bg-destructive/10 text-destructive text-sm max-w-md">
          {error}
        </div>
      )}

      {!loading && !error && jobs.length === 0 && (
        <div className="bg-card border border-border rounded-2xl p-8 text-center text-muted-foreground">
          No open positions right now. Check back soon.
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {jobs.map((job) => (
          <div key={job._id} className="bg-card border border-border rounded-2xl p-5">
            <h3 className="font-semibold text-foreground">{job.title}</h3>
            <p className="text-sm text-muted-foreground mb-3">{job.department}</p>
            <p className="text-sm text-foreground/80 mb-4 line-clamp-2">{job.description}</p>
            <Link
              href={`/candidate/apply/${job._id}`}
              className="inline-block bg-primary text-primary-foreground rounded-lg px-4 py-2 text-sm font-medium hover:opacity-90 transition"
            >
              Apply Now
            </Link>
          </div>
        ))}
      </div>
    </DashboardShell>
  );
}