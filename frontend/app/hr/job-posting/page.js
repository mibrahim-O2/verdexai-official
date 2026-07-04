"use client";

import { useState, useEffect } from "react";
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

const emptyForm = { title: "", department: "", description: "", requirements: "" };

export default function JobPostingPage() {
  const { firebaseUser } = useAuth();
  const [form, setForm] = useState(emptyForm);
  const [jobs, setJobs] = useState([]);
  const [loadingJobs, setLoadingJobs] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState(null);
  const [closingId, setClosingId] = useState(null);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  async function fetchMyJobs() {
    if (!firebaseUser) return;
    try {
      const idToken = await firebaseUser.getIdToken();
      const res = await fetch(`${config.api.getBaseUrl()}/api/v1/jobs/mine`, {
        headers: { Authorization: `Bearer ${idToken}` },
      });
      const data = await res.json();
      if (res.ok) setJobs(data.jobs);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingJobs(false);
    }
  }

  useEffect(() => { fetchMyJobs(); }, [firebaseUser]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);
    setSubmitting(true);
    try {
      const idToken = await firebaseUser.getIdToken();
      const res = await fetch(`${config.api.getBaseUrl()}/api/v1/jobs`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${idToken}`,
        },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to create job posting.");
      setMessage({ type: "success", text: "Job posting published successfully." });
      setForm(emptyForm);
      fetchMyJobs();
    } catch (err) {
      setMessage({ type: "error", text: err.message });
    } finally {
      setSubmitting(false);
    }
  };

  const handleClose = async (jobId) => {
    if (!window.confirm("Close this job post? Candidates will no longer be able to apply.")) return;
    setClosingId(jobId);
    try {
      const idToken = await firebaseUser.getIdToken();
      const res = await fetch(`${config.api.getBaseUrl()}/api/v1/jobs/${jobId}/close`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${idToken}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setJobs((prev) =>
        prev.map((j) => (j._id === jobId ? { ...j, status: "closed" } : j))
      );
    } catch (err) {
      alert(err.message);
    } finally {
      setClosingId(null);
    }
  };

  return (
    <DashboardShell navItems={navItems} roleLabel="HR / Recruiter">
      <h1 className="text-2xl font-bold text-foreground mb-1">Job Postings</h1>
      <p className="text-muted-foreground mb-6">Create new positions and manage existing ones.</p>

      {/* Create form */}
      {message && (
        <div className={`mb-4 px-4 py-2.5 rounded-lg text-sm max-w-2xl ${
          message.type === "success"
            ? "bg-primary/10 text-primary"
            : "bg-destructive/10 text-destructive"
        }`}>
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-card border border-border rounded-2xl p-6 space-y-4 max-w-2xl mb-8">
        <h2 className="font-semibold text-foreground">Create New Job Post</h2>
        <div>
          <label className="block text-sm font-medium text-foreground mb-1.5">Job Title</label>
          <input
            type="text"
            name="title"
            value={form.title}
            onChange={handleChange}
            placeholder="e.g. Backend Engineer"
            className="w-full px-3 py-2.5 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-foreground mb-1.5">Department</label>
          <input
            type="text"
            name="department"
            value={form.department}
            onChange={handleChange}
            placeholder="e.g. Engineering"
            className="w-full px-3 py-2.5 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-foreground mb-1.5">Description</label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            rows={4}
            placeholder="Describe the role..."
            className="w-full px-3 py-2.5 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-foreground mb-1.5">Requirements</label>
          <textarea
            name="requirements"
            value={form.requirements}
            onChange={handleChange}
            rows={3}
            placeholder="Required skills, experience..."
            className="w-full px-3 py-2.5 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            required
          />
        </div>
        <button
          type="submit"
          disabled={submitting}
          className="bg-primary text-primary-foreground rounded-lg px-6 py-2.5 font-medium hover:opacity-90 transition disabled:opacity-60"
        >
          {submitting ? "Publishing..." : "Publish Job"}
        </button>
      </form>

      {/* Existing jobs */}
      <div className="max-w-2xl">
        <h2 className="font-semibold text-foreground mb-3">Your Job Posts</h2>
        {loadingJobs ? (
          <div className="flex justify-center py-6"><LoadingSpinner size={24} /></div>
        ) : jobs.length === 0 ? (
          <p className="text-sm text-muted-foreground">No job posts yet.</p>
        ) : (
          <div className="bg-card border border-border rounded-2xl overflow-hidden divide-y divide-border">
            {jobs.map((job) => (
              <div key={job._id} className="px-5 py-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-foreground">{job.title}</p>
                    <p className="text-sm text-muted-foreground">{job.department}</p>
                    <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                      {job.description}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                      job.status === "open"
                        ? "bg-primary/10 text-primary"
                        : "bg-muted text-muted-foreground"
                    }`}>
                      {job.status === "open" ? "Open" : "Closed"}
                    </span>
                    {job.status === "open" && (
                      <button
                        onClick={() => handleClose(job._id)}
                        disabled={closingId === job._id}
                        className="text-xs text-destructive border border-destructive/30 px-2.5 py-1 rounded-lg hover:bg-destructive/10 transition disabled:opacity-50"
                      >
                        {closingId === job._id ? "..." : "Close"}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardShell>
  );
}