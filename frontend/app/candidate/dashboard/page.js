"use client";

import { useEffect, useState } from "react";
import DashboardShell from "../../../components/shared/DashboardShell";
import StatCard from "../../../components/ui/StatCard";
import LoadingSpinner from "../../../components/shared/LoadingSpinner";
import {
  IconHome, IconBriefcase, IconClipboard,
  IconMail, IconCheckCircle, IconHandshake, IconChart
} from "../../../components/icons/NavIcons";
import { useAuth } from "../../../lib/authContext";
import config from "../../../lib/config";

const navItems = [
  { href: "/candidate/dashboard", label: "Dashboard", icon: <IconHome /> },
  { href: "/candidate/apply", label: "Browse Jobs", icon: <IconBriefcase /> },
  { href: "/test", label: "My Tests", icon: <IconChart /> },
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
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      if (!firebaseUser) return;
      try {
        const idToken = await firebaseUser.getIdToken();
        const headers = { Authorization: `Bearer ${idToken}` };

        const [appsRes, interviewsRes] = await Promise.all([
          fetch(`${config.api.getBaseUrl()}/api/v1/applications/mine`, { headers }),
          fetch(`${config.api.getBaseUrl()}/api/v1/assessment/interview/my`, { headers }),
        ]);

        const appsData = await appsRes.json();
        const interviewsData = await interviewsRes.json();

        if (appsRes.ok) setApplications(appsData.applications);
        if (interviewsRes.ok) setInterviews(interviewsData.interviews);
      } catch (err) {
        console.error("Failed to load data:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [firebaseUser]);

  const upcomingInterviews = interviews.filter(
    (i) => i.status === "scheduled" || i.status === "rescheduled"
  );

  return (
    <DashboardShell navItems={navItems} roleLabel="Candidate">
      <h1 className="text-2xl font-bold text-foreground mb-1">
        Welcome back{dbUser?.name ? `, ${dbUser.name.split(" ")[0]}` : ""}
      </h1>
      <p className="text-muted-foreground mb-6">
        Here's what's happening with your applications.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard label="Applications Sent" value={applications.length} icon={<IconMail className="w-5 h-5" />} />
        <StatCard label="Shortlisted" value={applications.filter((a) => a.status === "shortlisted").length} icon={<IconCheckCircle className="w-5 h-5" />} />
        <StatCard label="Interviews" value={upcomingInterviews.length} icon={<IconHandshake className="w-5 h-5" />} />
        <StatCard label="Hired" value={applications.filter((a) => a.status === "hired").length} icon={<IconChart className="w-5 h-5" />} />
      </div>

      {/* Upcoming Interviews */}
      {upcomingInterviews.length > 0 && (
        <div className="mb-6">
          <h2 className="font-semibold text-foreground mb-3">Upcoming Interviews</h2>
          <div className="space-y-3">
            {upcomingInterviews.map((interview) => {
              const dateStr = new Date(interview.interviewDate).toLocaleString("en-PK", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
                timeZone: "Asia/Karachi",
              });

              return (
                <div
                  key={interview._id}
                  className="bg-primary/5 border border-primary/30 rounded-2xl p-5"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <p className="font-semibold text-foreground">{interview.jobPostId?.title}</p>
                      <p className="text-sm text-muted-foreground">{interview.jobPostId?.department}</p>
                    </div>
                    <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                      interview.status === "rescheduled"
                        ? "bg-accent/10 text-accent"
                        : "bg-primary/10 text-primary"
                    }`}>
                      {interview.status === "rescheduled" ? "Rescheduled" : "Scheduled"}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                    <div className="flex items-center gap-2">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="text-primary flex-shrink-0">
                        <rect x="3" y="4" width="18" height="17" rx="2" stroke="currentColor" strokeWidth="1.8" />
                        <path d="M16 2v4M8 2v4M3 10h18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                      </svg>
                      <span className="text-foreground">{dateStr} (PKT)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="text-primary flex-shrink-0">
                        <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.8" />
                        <path d="M12 7v5l3 3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                      </svg>
                      <span className="text-foreground">{interview.durationMinutes} minutes</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="text-primary flex-shrink-0">
                        <path d="M15 10l4.553-2.069A1 1 0 0 1 21 8.82v6.36a1 1 0 0 1-1.447.893L15 14M3 8.5A1.5 1.5 0 0 1 4.5 7h8A1.5 1.5 0 0 1 14 8.5v7A1.5 1.5 0 0 1 12.5 17h-8A1.5 1.5 0 0 1 3 15.5v-7Z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      <span className="text-foreground">{interview.meetingPlatform}</span>
                    </div>
                     {interview.meetingLink && (
                      <div className="flex items-center gap-2">
                        <span className="text-primary text-xs font-bold flex-shrink-0">LINK</span>
                        <a
                          href={interview.meetingLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary font-medium hover:underline truncate max-w-xs"
                        >
                          Join Meeting
                        </a>
                      </div>
                    )}
                  </div>

                  {interview.notes && (
                    <div className="mt-3 pt-3 border-t border-border text-sm text-muted-foreground">
                      <span className="font-medium text-foreground">Notes from HR:</span> {interview.notes}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Applications Table */}
      <div className="bg-card border border-border rounded-2xl overflow-hidden">
        <div className="px-5 py-4 border-b border-border">
          <h2 className="font-semibold text-foreground">All Applications</h2>
        </div>

        {loading ? (
          <div className="flex justify-center py-8">
            <LoadingSpinner size={24} />
          </div>
        ) : applications.length === 0 ? (
          <p className="px-5 py-6 text-sm text-muted-foreground">
            You haven't applied to any jobs yet.
          </p>
        ) : (
          <div className="divide-y divide-border">
            {applications.map((app) => (
              <div key={app._id} className="flex items-center justify-between px-5 py-4">
                <div>
                  <p className="font-medium text-foreground">
                    {app.jobPostId?.title || "Job removed"}
                  </p>
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