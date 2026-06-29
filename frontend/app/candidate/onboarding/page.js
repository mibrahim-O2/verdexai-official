"use client";

import DashboardShell from "../../../components/shared/DashboardShell";
import { IconHome, IconBriefcase, IconClipboard, IconCheckCircle } from "../../../components/icons/NavIcons";

const navItems = [
  { href: "/candidate/dashboard", label: "Dashboard", icon: <IconHome /> },
  { href: "/candidate/apply", label: "Browse Jobs", icon: <IconBriefcase /> },
  { href: "/candidate/onboarding", label: "Onboarding", icon: <IconClipboard /> },
];

export default function CandidateOnboardingPage() {
  return (
    <DashboardShell navItems={navItems} roleLabel="Candidate">
      <h1 className="text-2xl font-bold text-foreground mb-1">Onboarding</h1>
      <p className="text-muted-foreground mb-6">
        Once you're hired, complete the steps below to finish onboarding.
      </p>

      <div className="bg-card border border-border rounded-2xl p-8 max-w-xl text-center">
        <div className="flex justify-center mb-3">
          <IconCheckCircle className="w-12 h-12 text-muted-foreground" />
        </div>
        <p className="text-foreground font-medium mb-1">No active onboarding yet</p>
        <p className="text-sm text-muted-foreground">
          Once you're hired for a role, your onboarding checklist will appear here.
        </p>
      </div>
    </DashboardShell>
  );
}