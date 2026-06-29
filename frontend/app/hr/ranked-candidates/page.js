"use client";

import { useEffect, useState } from "react";
import DashboardShell from "../../../components/shared/DashboardShell";
import LoadingSpinner from "../../../components/shared/LoadingSpinner";
import { IconHome, IconClipboard, IconChart, IconHandshake, IconCheckCircle } from "../../../components/icons/NavIcons";
import { useAuth } from "../../../lib/authContext";
import config from "../../../lib/config";

const navItems = [
  { href: "/hr/dashboard", label: "Dashboard", icon: <IconHome /> },
  { href: "/hr/job-posting", label: "Job Postings", icon: <IconClipboard /> },
  { href: "/hr/ranked-candidates", label: "Ranked Candidates", icon: <IconChart /> },
  { href: "/hr/hire-onboarding", label: "Onboarding", icon: <IconHandshake /> },
  { href: "/hr/finalize-hire", label: "Finalize Hire", icon: <IconCheckCircle /> },
];

export default function RankedCandidatesPage() {
  const { firebaseUser } = useAuth();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedId, setExpandedId] = useState(null);

  useEffect(() => {
    async function fetchRanked() {
      if (!firebaseUser) return;
      try {
        const idToken = await firebaseUser.getIdToken();
        const res = await fetch(`${config.api.getBaseUrl()}/api/v1/applications/ranked`, {
          headers: { Authorization: `Bearer ${idToken}` },
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed to load candidates.");
        setApplications(data.applications);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchRanked();
  }, [firebaseUser]);

  return (
    <DashboardShell navItems={navItems} roleLabel="HR / Recruiter">
      <h1 className="text-2xl font-bold text-foreground mb-1">Ranked Candidates</h1>
      <p className="text-muted-foreground mb-6">
        AI-generated ranking based on resume match score, across all your job postings.
      </p>

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

      {!loading && !error && applications.length === 0 && (
        <div className="bg-card border border-border rounded-2xl p-8 text-center text-muted-foreground">
          No applications yet. Once candidates apply to your job posts, they'll be ranked here.
        </div>
      )}

      <div className="bg-card border border-border rounded-2xl overflow-hidden">
        <div className="divide-y divide-border">
          {applications.map((app) => {
            const isExpanded = expandedId === app._id;
            const score = app.aiScore ?? 0;

            return (
              <div key={app._id}>
                <button
                  onClick={() => setExpandedId(isExpanded ? null : app._id)}
                  className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-muted/50 transition"
                >
                  <div>
                    <p className="font-medium text-foreground">
                      {app.parsedCv?.name || app.candidateId?.name || "Unknown Candidate"}
                    </p>
                    <p className="text-sm text-muted-foreground">{app.jobPostId?.title}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    {app.aiScore === null ? (
                      <span className="text-xs text-muted-foreground italic">AI analysis pending</span>
                    ) : (
                      <>
                        <div className="w-28 h-2 rounded-full bg-muted overflow-hidden">
                          <div className="h-full bg-primary" style={{ width: `${score}%` }} />
                        </div>
                        <span className="text-sm font-semibold text-primary w-10 text-right">{score}%</span>
                      </>
                    )}
                  </div>
                </button>

                {isExpanded && (
                  <div className="px-5 pb-4 text-sm text-muted-foreground space-y-2 bg-muted/30">
                    {app.aiReasoning && (
                      <p><span className="font-medium text-foreground">AI Reasoning:</span> {app.aiReasoning}</p>
                    )}
                    {app.parsedCv?.skills?.length > 0 && (
                      <p><span className="font-medium text-foreground">Skills:</span> {app.parsedCv.skills.join(", ")}</p>
                    )}
                    {app.parsedCv?.experienceYears !== undefined && (
                      <p><span className="font-medium text-foreground">Experience:</span> {app.parsedCv.experienceYears} years</p>
                    )}
                    {app.parsedCv?.education && (
                      <p><span className="font-medium text-foreground">Education:</span> {app.parsedCv.education}</p>
                    )}
                    {app.coverLetter && (
                      <p><span className="font-medium text-foreground">Cover Letter:</span> {app.coverLetter}</p>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </DashboardShell>
  );
}