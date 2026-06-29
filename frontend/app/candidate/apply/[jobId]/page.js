"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import DashboardShell from "../../../../components/shared/DashboardShell";
import LoadingSpinner from "../../../../components/shared/LoadingSpinner";
import { IconHome, IconBriefcase, IconClipboard } from "../../../../components/icons/NavIcons";
import { useAuth } from "../../../../lib/authContext";
import config from "../../../../lib/config";

const navItems = [
  { href: "/candidate/dashboard", label: "Dashboard", icon: <IconHome /> },
  { href: "/candidate/apply", label: "Browse Jobs", icon: <IconBriefcase /> },
  { href: "/candidate/onboarding", label: "Onboarding", icon: <IconClipboard /> },
];

export default function ApplyToJobPage() {
  const { jobId } = useParams();
  const router = useRouter();
  const { firebaseUser } = useAuth();

  const [job, setJob] = useState(null);
  const [loadingJob, setLoadingJob] = useState(true);
  const [cvFile, setCvFile] = useState(null);
  const [coverLetter, setCoverLetter] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    async function fetchJob() {
      try {
        const res = await fetch(`${config.api.getBaseUrl()}/api/v1/jobs/${jobId}`);
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Job not found.");
        setJob(data.job);
      } catch (err) {
        setMessage({ type: "error", text: err.message });
      } finally {
        setLoadingJob(false);
      }
    }
    fetchJob();
  }, [jobId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);

    if (!cvFile) {
      setMessage({ type: "error", text: "Please upload your CV as a PDF." });
      return;
    }

    setSubmitting(true);

    try {
      const idToken = await firebaseUser.getIdToken();

      const formData = new FormData();
      formData.append("jobPostId", jobId);
      formData.append("coverLetter", coverLetter);
      formData.append("cv", cvFile);

      const res = await fetch(`${config.api.getBaseUrl()}/api/v1/applications`, {
        method: "POST",
        headers: { Authorization: `Bearer ${idToken}` },
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to submit application.");
      }

      setMessage({ type: "success", text: "Application submitted! Your CV is being analyzed by AI." });
      setTimeout(() => router.push("/candidate/dashboard"), 1800);
    } catch (err) {
      setMessage({ type: "error", text: err.message });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <DashboardShell navItems={navItems} roleLabel="Candidate">
      {loadingJob ? (
        <div className="flex justify-center py-10">
          <LoadingSpinner size={28} />
        </div>
      ) : job ? (
        <>
          <h1 className="text-2xl font-bold text-foreground mb-1">Apply to {job.title}</h1>
          <p className="text-muted-foreground mb-6">{job.department}</p>

          <div className="bg-card border border-border rounded-2xl p-5 mb-6 max-w-xl">
            <h3 className="font-medium text-foreground mb-2">Job Description</h3>
            <p className="text-sm text-muted-foreground mb-4">{job.description}</p>
            <h3 className="font-medium text-foreground mb-2">Requirements</h3>
            <p className="text-sm text-muted-foreground">{job.requirements}</p>
          </div>

          {message && (
            <div
              className={`mb-4 px-4 py-2.5 rounded-lg text-sm max-w-xl ${
                message.type === "success"
                  ? "bg-primary/10 text-primary"
                  : "bg-destructive/10 text-destructive"
              }`}
            >
              {message.text}
            </div>
          )}

          <form onSubmit={handleSubmit} className="bg-card border border-border rounded-2xl p-6 space-y-4 max-w-xl">
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Upload CV (PDF)</label>
              <input
                type="file"
                accept=".pdf"
                onChange={(e) => setCvFile(e.target.files?.[0] || null)}
                className="w-full text-sm text-muted-foreground"
                required
              />
              {cvFile && <p className="text-xs text-primary mt-1">Selected: {cvFile.name}</p>}
              <p className="text-xs text-muted-foreground mt-1">
                Your CV will be analyzed by AI to match you against this job's requirements.
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Cover Letter</label>
              <textarea
                value={coverLetter}
                onChange={(e) => setCoverLetter(e.target.value)}
                rows={5}
                placeholder="Tell us why you're a great fit..."
                className="w-full px-3 py-2.5 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
            <button
              type="submit"
              disabled={submitting}
              className="bg-primary text-primary-foreground rounded-lg px-6 py-2.5 font-medium hover:opacity-90 transition disabled:opacity-60"
            >
              {submitting ? "Submitting & Analyzing..." : "Submit Application"}
            </button>
          </form>
        </>
      ) : (
        <div className="px-4 py-2.5 rounded-lg bg-destructive/10 text-destructive text-sm max-w-md">
          {message?.text || "Job not found."}
        </div>
      )}
    </DashboardShell>
  );
}