"use client";

import { useState } from "react";
import DashboardShell from "../../../components/shared/DashboardShell";
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

export default function JobPostingPage() {
  const { firebaseUser } = useAuth();
  const [form, setForm] = useState({ title: "", department: "", description: "", requirements: "" });
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState(null);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

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
      if (!res.ok) {
        throw new Error(data.error || "Failed to create job posting.");
      }

      setMessage({ type: "success", text: "Job posting published successfully." });
      setForm({ title: "", department: "", description: "", requirements: "" });
    } catch (err) {
      setMessage({ type: "error", text: err.message });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <DashboardShell navItems={navItems} roleLabel="HR / Recruiter">
      <h1 className="text-2xl font-bold text-foreground mb-1">Create Job Posting</h1>
      <p className="text-muted-foreground mb-6">Post a new role for candidates to apply to.</p>

      {message && (
        <div
          className={`mb-4 px-4 py-2.5 rounded-lg text-sm max-w-2xl ${
            message.type === "success"
              ? "bg-primary/10 text-primary"
              : "bg-destructive/10 text-destructive"
          }`}
        >
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-card border border-border rounded-2xl p-6 space-y-4 max-w-2xl">
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
    </DashboardShell>
  );
}