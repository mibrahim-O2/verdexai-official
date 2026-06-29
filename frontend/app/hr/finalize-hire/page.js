"use client";

import DashboardShell from "../../../components/shared/DashboardShell";
import { IconHome, IconClipboard, IconChart, IconHandshake, IconCheckCircle } from "../../../components/icons/NavIcons";

const navItems = [
  { href: "/hr/dashboard", label: "Dashboard", icon: <IconHome /> },
  { href: "/hr/job-posting", label: "Job Postings", icon: <IconClipboard /> },
  { href: "/hr/ranked-candidates", label: "Ranked Candidates", icon: <IconChart /> },
  { href: "/hr/hire-onboarding", label: "Onboarding", icon: <IconHandshake /> },
  { href: "/hr/finalize-hire", label: "Finalize Hire", icon: <IconCheckCircle /> },
];

export default function FinalizeHirePage() {
  const handleFinalize = (e) => {
    e.preventDefault();
    alert("Finalize hire backend isn't connected yet — coming in Phase 8.");
  };

  return (
    <DashboardShell navItems={navItems} roleLabel="HR / Recruiter">
      <h1 className="text-2xl font-bold text-foreground mb-1">Finalize Hire</h1>
      <p className="text-muted-foreground mb-6">Confirm offer details and mark the candidate as hired.</p>

      <form onSubmit={handleFinalize} className="bg-card border border-border rounded-2xl p-6 space-y-4 max-w-xl">
        <div>
          <label className="block text-sm font-medium text-foreground mb-1.5">Candidate</label>
          <input
            type="text"
            defaultValue="Sana Malik"
            disabled
            className="w-full px-3 py-2.5 rounded-lg border border-border bg-muted text-muted-foreground"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-foreground mb-1.5">Position</label>
          <input
            type="text"
            defaultValue="Backend Engineer"
            disabled
            className="w-full px-3 py-2.5 rounded-lg border border-border bg-muted text-muted-foreground"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-foreground mb-1.5">Start Date</label>
          <input
            type="date"
            className="w-full px-3 py-2.5 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            required
          />
        </div>
        <button
          type="submit"
          className="bg-primary text-primary-foreground rounded-lg px-6 py-2.5 font-medium hover:opacity-90 transition"
        >
          Confirm Hire
        </button>
      </form>
    </DashboardShell>
  );
}