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

export default function FinalizeHirePage() {
  const { firebaseUser } = useAuth();
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedId, setSelectedId] = useState("");
  const [startDate, setStartDate] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState(null);

  async function fetchReady() {
    if (!firebaseUser) return;
    try {
      const idToken = await firebaseUser.getIdToken();
      const res = await fetch(`${config.api.getBaseUrl()}/api/v1/pipeline/ready-to-hire`, {
        headers: { Authorization: `Bearer ${idToken}` },
      });
      const data = await res.json();
      if (res.ok) setCandidates(data.applications);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { fetchReady(); }, [firebaseUser]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedId) {
      setMessage({ type: "error", text: "Please select a candidate." });
      return;
    }
    setMessage(null);
    setSubmitting(true);
    try {
      const idToken = await firebaseUser.getIdToken();
      const res = await fetch(`${config.api.getBaseUrl()}/api/v1/pipeline/finalize`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${idToken}`,
        },
        body: JSON.stringify({ applicationId: selectedId, startDate }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to finalize hire.");
      setMessage({ type: "success", text: "Candidate successfully hired. Onboarding entry created." });
      setCandidates((prev) => prev.filter((c) => c._id !== selectedId));
      setSelectedId("");
      setStartDate("");
    } catch (err) {
      setMessage({ type: "error", text: err.message });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <DashboardShell navItems={navItems} roleLabel="HR / Recruiter">
      <h1 className="text-2xl font-bold text-foreground mb-1">Finalize Hire</h1>
      <p className="text-muted-foreground mb-6">
        Confirm offer details and mark a shortlisted or interview-scheduled candidate as hired.
      </p>

      {loading && <div className="flex justify-center py-10"><LoadingSpinner size={28} /></div>}

      {!loading && candidates.length === 0 && !message && (
        <div className="bg-card border border-border rounded-2xl p-8 text-center text-muted-foreground">
          No candidates ready to hire yet. Shortlist or schedule interviews on the Ranked Candidates page first.
        </div>
      )}

      {!loading && candidates.length > 0 && (
        <>
          {message && (
            <div className={`mb-4 px-4 py-2.5 rounded-lg text-sm max-w-xl ${
              message.type === "success" ? "bg-primary/10 text-primary" : "bg-destructive/10 text-destructive"
            }`}>
              {message.text}
            </div>
          )}

          <form onSubmit={handleSubmit} className="bg-card border border-border rounded-2xl p-6 space-y-4 max-w-xl">
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Select Candidate</label>
              <select
                value={selectedId}
                onChange={(e) => setSelectedId(e.target.value)}
                className="w-full px-3 py-2.5 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                required
              >
                <option value="">— Select a candidate —</option>
                {candidates.map((app) => (
                  <option key={app._id} value={app._id}>
                    {app.candidateId?.name} — {app.jobPostId?.title} ({app.status.replace("_", " ")})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Start Date</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full px-3 py-2.5 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="bg-primary text-primary-foreground rounded-lg px-6 py-2.5 font-medium hover:opacity-90 transition disabled:opacity-60"
            >
              {submitting ? "Confirming..." : "Confirm Hire"}
            </button>
          </form>
        </>
      )}
    </DashboardShell>
  );
}