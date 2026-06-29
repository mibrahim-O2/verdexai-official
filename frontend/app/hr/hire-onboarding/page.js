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

const steps = [
  { label: "Offer Letter Sent", done: true },
  { label: "Offer Accepted", done: true },
  { label: "Documents Submitted", done: false },
  { label: "IT Account Setup", done: false },
  { label: "First Day Scheduled", done: false },
];

export default function HireOnboardingPage() {
  return (
    <DashboardShell navItems={navItems} roleLabel="HR / Recruiter">
      <h1 className="text-2xl font-bold text-foreground mb-1">Hire Onboarding</h1>
      <p className="text-muted-foreground mb-6">Track onboarding progress for newly hired candidates.</p>

      <div className="bg-card border border-border rounded-2xl p-6 max-w-xl">
        <h2 className="font-semibold text-foreground mb-4">Sana Malik — Backend Engineer</h2>
        <div className="space-y-4">
          {steps.map((step, i) => (
            <div key={i} className="flex items-center gap-3">
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                  step.done
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                {step.done ? "✓" : i + 1}
              </div>
              <span className={step.done ? "text-foreground" : "text-muted-foreground"}>
                {step.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </DashboardShell>
  );
}