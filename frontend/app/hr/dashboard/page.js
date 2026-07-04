"use client";

import { useEffect, useState } from "react";
import DashboardShell from "../../../components/shared/DashboardShell";
import StatCard from "../../../components/ui/StatCard";
import LoadingSpinner from "../../../components/shared/LoadingSpinner";
import {
  IconHome, IconClipboard, IconChart,
  IconHandshake, IconCheckCircle, IconUsers
} from "../../../components/icons/NavIcons";
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
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      if (!firebaseUser) return;
      try {
        const idToken = await firebaseUser.getIdToken();
        const headers = { Authorization: `Bearer ${idToken}` };

        const [jobsRes, rankedRes] = await Promise.all([
          fetch(`${config.api.getBaseUrl()}/api/v1/jobs/mine`, { headers }),
          fetch(`${config.api.getBaseUrl()}/api/v1/applications/ranked`, { headers }),
        ]);

        const jobsData = await jobsRes.json();
        const rankedData = await rankedRes.json();

        if (jobsRes.ok) setJobs(jobsData.jobs);
        if (rankedRes.ok) setApplications(rankedData.applications);
      } catch (err) {
        console.error("Failed to load HR dashboard:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [firebaseUser]);

  const activeJobs = jobs.filter((j) => j.status === "open").length;
  const totalApplicants = applications.length;
  const shortlisted = applications.filter((a) =>
    ["shortlisted", "interview_scheduled"].includes(a.status)
  ).length;
  const hired = applications.filter((a) => a.status === "hired").length;

  return (
    <DashboardShell navItems={navItems} roleLabel="HR / Recruiter">
      <h1 className="text-2xl font-bold text-foreground mb-1">HR Dashboard</h1>
      <p className="text-muted-foreground mb-6">Overview of your hiring pipeline.</p>

      {loading ? (
        <div className="flex justify-center py-10"><LoadingSpinner size={28} /></div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <StatCard label="Active Job Posts" value={activeJobs} icon={<IconClipboard className="w-5 h-5" />} />
            <StatCard label="Total Applicants" value={totalApplicants} icon={<IconUsers className="w-5 h-5" />} />
            <StatCard label="Shortlisted" value={shortlisted} icon={<IconChart className="w-5 h-5" />} />
            <StatCard label="Hired" value={hired} icon={<IconCheckCircle className="w-5 h-5" />} />
          </div>

          <div className="bg-card border border-border rounded-2xl overflow-hidden">
            <div className="px-5 py-4 border-b border-border">
              <h2 className="font-semibold text-foreground">Your Job Postings</h2>
            </div>

            {jobs.length === 0 ? (
              <p className="px-5 py-6 text-sm text-muted-foreground">
                No jobs posted yet. Go to Job Postings to create one.
              </p>
            ) : (
              <div className="divide-y divide-border">
                {jobs.map((job) => {
                  const jobApplicants = applications.filter(
                    (a) => a.jobPostId?._id === job._id || a.jobPostId === job._id
                  ).length;
                  return (
                    <div key={job._id} className="flex items-center justify-between px-5 py-4">
                      <div>
                        <p className="font-medium text-foreground">{job.title}</p>
                        <p className="text-sm text-muted-foreground">
                          {job.department} · {jobApplicants} applicant{jobApplicants !== 1 ? "s" : ""}
                        </p>
                      </div>
                      <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                        job.status === "open"
                          ? "bg-primary/10 text-primary"
                          : "bg-muted text-muted-foreground"
                      }`}>
                        {job.status === "open" ? "Open" : "Closed"}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </>
      )}
    </DashboardShell>
  );
}