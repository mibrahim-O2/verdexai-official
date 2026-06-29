"use client";

import { useEffect, useState } from "react";
import DashboardShell from "../../../components/shared/DashboardShell";
import StatCard from "../../../components/ui/StatCard";
import LoadingSpinner from "../../../components/shared/LoadingSpinner";
import { IconHome, IconBriefcase, IconClipboard, IconMail, IconCheckCircle, IconHandshake } from "../../../components/icons/NavIcons";
import { useAuth } from "../../../lib/authContext";
import config from "../../../lib/config";

const navItems = [
  { href: "/candidate/dashboard", label: "Dashboard", icon: <IconHome /> },
  { href: "/candidate/apply", label: "Browse Jobs", icon: <IconBriefcase /> },
  { href: "/candidate/onboarding", label: "Onboarding", icon: <IconClipboard /> },
];

const statusLabels = {
  submitted: "Submitted",
  under_review: "Under Review",
  shortlisted: "Shortlisted",
  interview_scheduled: "Interview Scheduled",
  rejected: "Rejected",
  hired: "Hired",
};

const statusStyles = {
  submitted: "bg-muted text-muted-foreground",
  under_review: "bg-accent/10 text-accent",
  shortlisted: "bg-primary/10 text-primary",
  interview_scheduled: "bg-primary/10 text-primary",
  rejected: "bg-destructive/10 text-destructive",
  hired: "bg-primary/10 text-primary",
};

export default function CandidateDashboard() {
  const { firebaseUser, dbUser } = useAuth();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchApplications() {
      if (!firebaseUser) return;
      try {
        const idToken = await firebaseUser.getIdToken();
        const res = await fetch(`${config.api.getBaseUrl()}/api/v1/applications/mine`, {
          headers: { Authorization: `Bearer ${idToken}` },
        });
        const data = await res.json();
        if (res.ok) setApplications(data.applications);
      } catch (err) {
        console.error("Failed to load applications:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchApplications();
  }, [firebaseUser]);

  const interviewCount = applications.filter((a) => a.status === "interview_scheduled").length;

  return (
    <DashboardShell navItems={navItems} roleLabel="Candidate">
      <h1 className="text-2xl font-bold text-foreground mb-1">
        Welcome back{dbUser?.name ? `, ${dbUser.name.split(" ")[0]}` : ""}
      </h1>
      <p className="text-muted-foreground mb-6">Here's what's happening with your applications.</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        <StatCard label="Applications Sent" value={applications.length} icon={<IconMail className="w-5 h-5" />} />
        <StatCard label="Tests Completed" value="0" icon={<IconCheckCircle className="w-5 h-5" />} />
        <StatCard label="Interviews Scheduled" value={interviewCount} icon={<IconHandshake className="w-5 h-5" />} />
      </div>

      <div className="bg-card border border-border rounded-2xl overflow-hidden">
        <div className="px-5 py-4 border-b border-border">
          <h2 className="font-semibold text-foreground">Recent Applications</h2>
        </div>

        {loading ? (
          <div className="flex justify-center py-8">
            <LoadingSpinner size={24} />
          </div>
        ) : applications.length === 0 ? (
          <p className="px-5 py-6 text-sm text-muted-foreground">
            You haven't applied to any jobs yet. Browse open positions to get started.
          </p>
        ) : (
          <div className="divide-y divide-border">
            {applications.map((app) => (
              <div key={app._id} className="flex items-center justify-between px-5 py-4">
                <div>
                  <p className="font-medium text-foreground">{app.jobPostId?.title || "Job removed"}</p>
                  <p className="text-sm text-muted-foreground">
                    {app.jobPostId?.department} · {new Date(app.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${statusStyles[app.status]}`}>
                  {statusLabels[app.status]}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardShell>
  );
}