"use client";

import { useEffect, useState } from "react";
import DashboardShell from "../../../components/shared/DashboardShell";
import LoadingSpinner from "../../../components/shared/LoadingSpinner";
import {
  IconHome, IconClipboard, IconChart,
  IconHandshake, IconCheckCircle
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

const validStatuses = ["submitted", "under_review", "shortlisted", "interview_scheduled", "rejected"];

const platforms = ["Google Meet", "Zoom", "Microsoft Teams", "Other"];

const emptyForm = {
  interviewDate: "",
  durationMinutes: 30,
  meetingLink: "",
  meetingPlatform: "Google Meet",
  notes: "",
};

function TestResultBadge({ candidateId, jobId, firebaseUser }) {
  const [result, setResult] = useState(null);

  useEffect(() => {
    if (!candidateId || !jobId || !firebaseUser) return;
    async function fetchResults() {
      try {
        const idToken = await firebaseUser.getIdToken();
        const res = await fetch(
          `${config.api.getBaseUrl()}/api/v1/assessment/job-results/${jobId}`,
          { headers: { Authorization: `Bearer ${idToken}` } }
        );
        const data = await res.json();
        if (res.ok && data.attempts?.length > 0) {
          const match = data.attempts.find(
            (a) => a.candidateId?._id === candidateId || a.candidateId === candidateId
          );
          if (match) setResult(match);
        }
      } catch (err) {
        console.error(err);
      }
    }
    fetchResults();
  }, [candidateId, jobId, firebaseUser]);

  if (!result) return null;

  const passed = result.percentage >= 60;

  return (
    <div className={`mt-1 inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium ${
      passed ? "bg-primary/10 text-primary" : "bg-destructive/10 text-destructive"
    }`}>
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
        {passed
          ? <path d="M5 13l4 4L19 7" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          : <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
        }
      </svg>
      Test Score: {result.percentage}% ({result.score}/{result.totalQuestions} correct)
      {result.tabSwitchCount > 0 && (
        <span className="text-destructive ml-1">· {result.tabSwitchCount} tab switch{result.tabSwitchCount !== 1 ? "es" : ""}</span>
      )}
    </div>
  );
}

export default function RankedCandidatesPage() {
  const { firebaseUser } = useAuth();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedId, setExpandedId] = useState(null);
  const [updatingId, setUpdatingId] = useState(null);

  // Interview scheduling modal state
  const [interviewModal, setInterviewModal] = useState(null); // holds applicationId
  const [interviewForm, setInterviewForm] = useState(emptyForm);
  const [schedulingInterview, setSchedulingInterview] = useState(false);
  const [interviewMessage, setInterviewMessage] = useState(null);

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

  useEffect(() => { fetchRanked(); }, [firebaseUser]);

  const handleStatusChange = async (appId, newStatus) => {
    if (!firebaseUser) return;
    setUpdatingId(appId);
    try {
      const idToken = await firebaseUser.getIdToken();
      const res = await fetch(
        `${config.api.getBaseUrl()}/api/v1/applications/${appId}/status`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${idToken}`,
          },
          body: JSON.stringify({ status: newStatus }),
        }
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setApplications((prev) =>
        prev.map((a) => (a._id === appId ? { ...a, status: newStatus } : a))
      );
    } catch (err) {
      alert(err.message);
    } finally {
      setUpdatingId(null);
    }
  };

  const sendTestInvite = async (applicationId) => {
    if (!firebaseUser) return;
    try {
      const idToken = await firebaseUser.getIdToken();
      const res = await fetch(`${config.api.getBaseUrl()}/api/v1/assessment/invite`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${idToken}`,
        },
        body: JSON.stringify({ applicationId, timeLimitMinutes: 30 }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      alert("Assessment test invitation sent. The candidate will see it in their Tests section.");
    } catch (err) {
      alert(err.message);
    }
  };

  const openInterviewModal = (appId) => {
    setInterviewModal(appId);
    setInterviewForm(emptyForm);
    setInterviewMessage(null);
  };

  const handleScheduleInterview = async (e) => {
    e.preventDefault();
    if (!firebaseUser || !interviewModal) return;
    setSchedulingInterview(true);
    setInterviewMessage(null);

    try {
      const idToken = await firebaseUser.getIdToken();
      const res = await fetch(`${config.api.getBaseUrl()}/api/v1/assessment/interview/schedule`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${idToken}`,
        },
        body: JSON.stringify({
          applicationId: interviewModal,
          ...interviewForm,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setInterviewMessage({
        type: "success",
        text: data.rescheduled
          ? "Interview rescheduled. Candidate notified by email."
          : "Interview scheduled. Candidate notified by email.",
      });

      // Update local status
      setApplications((prev) =>
        prev.map((a) =>
          a._id === interviewModal ? { ...a, status: "interview_scheduled" } : a
        )
      );

      setTimeout(() => setInterviewModal(null), 2000);
    } catch (err) {
      setInterviewMessage({ type: "error", text: err.message });
    } finally {
      setSchedulingInterview(false);
    }
  };

  return (
    <DashboardShell navItems={navItems} roleLabel="HR / Recruiter">
      <h1 className="text-2xl font-bold text-foreground mb-1">Ranked Candidates</h1>
      <p className="text-muted-foreground mb-6">
        AI-generated ranking across all your job postings.
      </p>

      {loading && <div className="flex justify-center py-10"><LoadingSpinner size={28} /></div>}
      {error && (
        <div className="px-4 py-2.5 rounded-lg bg-destructive/10 text-destructive text-sm max-w-md mb-4">
          {error}
        </div>
      )}

      {!loading && !error && applications.length === 0 && (
        <div className="bg-card border border-border rounded-2xl p-8 text-center text-muted-foreground">
          No applications yet.
        </div>
      )}

      <div className="bg-card border border-border rounded-2xl overflow-hidden">
        <div className="divide-y divide-border">
          {applications.map((app) => {
            const isExpanded = expandedId === app._id;
            const score = app.aiScore ?? 0;

            return (
              <div key={app._id}>
                <div className="flex items-center justify-between px-5 py-4 gap-4">
                  <button
                    onClick={() => setExpandedId(isExpanded ? null : app._id)}
                    className="flex-1 flex items-start gap-3 text-left"
                  >
                    <div>
                      <p className="font-medium text-foreground">
                        {app.parsedCv?.name || app.candidateId?.name || "Unknown"}
                      </p>
                      <p className="text-sm text-muted-foreground">{app.jobPostId?.title}</p>
                    </div>
                  </button>

                  <div className="flex items-center gap-3 flex-shrink-0">
                    {app.aiScore === null ? (
                      <span className="text-xs text-muted-foreground italic">AI pending</span>
                    ) : (
                      <>
                        <div className="w-20 h-2 rounded-full bg-muted overflow-hidden">
                          <div className="h-full bg-primary" style={{ width: `${score}%` }} />
                        </div>
                        <span className="text-sm font-semibold text-primary w-8 text-right">
                          {score}%
                        </span>
                      </>
                    )}

                    {app.status !== "hired" && (
                      <select
                        value={app.status}
                        disabled={updatingId === app._id}
                        onChange={(e) => handleStatusChange(app._id, e.target.value)}
                        className={`text-xs px-2 py-1 rounded-lg border border-border bg-background text-foreground focus:outline-none ${
                          updatingId === app._id ? "opacity-50" : ""
                        }`}
                      >
                        {validStatuses.map((s) => (
                          <option key={s} value={s}>{statusLabels[s]}</option>
                        ))}
                      </select>
                    )}

                    {app.status === "hired" && (
                      <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-primary/10 text-primary">
                        Hired
                      </span>
                    )}
                  </div>
                </div>

                {isExpanded && (
                  <div className="px-5 pb-5 space-y-2 bg-muted/30 text-sm text-muted-foreground">
                    <p><span className="font-medium text-foreground">Email:</span> {app.candidateId?.email}</p>
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

                    <TestResultBadge
                      candidateId={app.candidateId?._id}
                      jobId={app.jobPostId?._id}
                      firebaseUser={firebaseUser}
                    />

                    {app.status !== "hired" && (
                      <div className="flex gap-2 pt-2 flex-wrap">
                        <button
                          onClick={() => sendTestInvite(app._id)}
                          className="text-xs bg-primary text-primary-foreground px-3 py-1.5 rounded-lg hover:opacity-90 transition"
                        >
                          Send Assessment Test
                        </button>
                        <button
                          onClick={() => openInterviewModal(app._id)}
                          className="text-xs bg-card text-foreground border border-border px-3 py-1.5 rounded-lg hover:border-primary/60 transition"
                        >
                          Schedule Interview
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Interview Scheduling Modal */}
      {interviewModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
          <div className="bg-card border border-border rounded-2xl p-6 w-full max-w-md shadow-xl">
            <h2 className="text-lg font-bold text-foreground mb-4">Schedule Interview</h2>

            {interviewMessage && (
              <div className={`mb-4 px-3 py-2 rounded-lg text-sm ${
                interviewMessage.type === "success"
                  ? "bg-primary/10 text-primary"
                  : "bg-destructive/10 text-destructive"
              }`}>
                {interviewMessage.text}
              </div>
            )}

            <form onSubmit={handleScheduleInterview} className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">
                  Date & Time
                </label>
                <input
                  type="datetime-local"
                  value={interviewForm.interviewDate}
                  onChange={(e) => setInterviewForm({ ...interviewForm, interviewDate: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-1">
                  Duration (minutes)
                </label>
                <input
                  type="number"
                  min="15"
                  max="120"
                  value={interviewForm.durationMinutes}
                  onChange={(e) => setInterviewForm({ ...interviewForm, durationMinutes: parseInt(e.target.value) })}
                  className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-1">
                  Platform
                </label>
                <select
                  value={interviewForm.meetingPlatform}
                  onChange={(e) => setInterviewForm({ ...interviewForm, meetingPlatform: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  {platforms.map((p) => (
                    <option key={p} value={p}>{p}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-1">
                  Meeting Link
                </label>
                <input
                  type="url"
                  value={interviewForm.meetingLink}
                  onChange={(e) => setInterviewForm({ ...interviewForm, meetingLink: e.target.value })}
                  placeholder="https://meet.google.com/xxx-yyyy-zzz"
                  className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-1">
                  Notes for Candidate
                </label>
                <textarea
                  value={interviewForm.notes}
                  onChange={(e) => setInterviewForm({ ...interviewForm, notes: e.target.value })}
                  rows={2}
                  placeholder="e.g. Please prepare to discuss your projects..."
                  className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  disabled={schedulingInterview}
                  className="flex-1 bg-primary text-primary-foreground rounded-lg py-2.5 font-medium hover:opacity-90 transition disabled:opacity-60"
                >
                  {schedulingInterview ? "Scheduling..." : "Schedule & Notify Candidate"}
                </button>
                <button
                  type="button"
                  onClick={() => setInterviewModal(null)}
                  className="px-4 py-2.5 rounded-lg border border-border text-foreground"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </DashboardShell>
  );
}