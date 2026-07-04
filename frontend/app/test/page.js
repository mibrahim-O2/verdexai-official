"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import DashboardShell from "../../components/shared/DashboardShell";
import LoadingSpinner from "../../components/shared/LoadingSpinner";
import { IconHome, IconBriefcase, IconClipboard, IconCheckCircle } from "../../components/icons/NavIcons";
import { useAuth } from "../../lib/authContext";
import config from "../../lib/config";

const navItems = [
  { href: "/candidate/dashboard", label: "Dashboard", icon: <IconHome /> },
  { href: "/candidate/apply", label: "Browse Jobs", icon: <IconBriefcase /> },
  { href: "/test", label: "My Tests", icon: <IconClipboard /> },
  { href: "/candidate/onboarding", label: "Onboarding", icon: <IconCheckCircle /> },
];

const statusStyles = {
  pending: "bg-accent/10 text-accent",
  completed: "bg-primary/10 text-primary",
  expired: "bg-destructive/10 text-destructive",
};

export default function MyTestsPage() {
  const { firebaseUser } = useAuth();
  const [invitations, setInvitations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchInvitations() {
      if (!firebaseUser) return;
      try {
        const idToken = await firebaseUser.getIdToken();
        const res = await fetch(`${config.api.getBaseUrl()}/api/v1/assessment/my-invitations`, {
          headers: { Authorization: `Bearer ${idToken}` },
        });
        const data = await res.json();
        if (res.ok) setInvitations(data.invitations);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchInvitations();
  }, [firebaseUser]);

  return (
    <DashboardShell navItems={navItems} roleLabel="Candidate">
      <h1 className="text-2xl font-bold text-foreground mb-1">My Tests</h1>
      <p className="text-muted-foreground mb-6">
        Assessment invitations sent by HR teams you have applied to.
      </p>

      {loading && <div className="flex justify-center py-10"><LoadingSpinner size={28} /></div>}

      {!loading && invitations.length === 0 && (
        <div className="bg-card border border-border rounded-2xl p-8 text-center text-muted-foreground">
          No test invitations yet. Apply to jobs and shortlisted candidates may receive a test invitation.
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {invitations.map((inv) => (
          <div key={inv._id} className="bg-card border border-border rounded-2xl p-5">
            <div className="flex items-start justify-between mb-2">
              <div>
                <h3 className="font-semibold text-foreground">{inv.jobPostId?.title}</h3>
                <p className="text-sm text-muted-foreground">{inv.jobPostId?.department}</p>
              </div>
              <span className={`text-xs font-medium px-2.5 py-1 rounded-full capitalize ${statusStyles[inv.status]}`}>
                {inv.status}
              </span>
            </div>
            <p className="text-sm text-muted-foreground mb-1">
              Time limit: {inv.timeLimitMinutes} minutes
            </p>
            <p className="text-sm text-muted-foreground mb-4">
              Expires: {new Date(inv.expiresAt).toLocaleDateString()}
            </p>
            {inv.status === "pending" && (
              <Link
                href={`/test/take?id=${inv._id}`}
                className="inline-block bg-primary text-primary-foreground rounded-lg px-4 py-2 text-sm font-medium hover:opacity-90 transition"
              >
                Start Test
              </Link>
            )}
            {inv.status === "completed" && (
              <Link
                href={`/test/done?id=${inv._id}`}
                className="inline-block bg-muted text-muted-foreground rounded-lg px-4 py-2 text-sm font-medium hover:opacity-90 transition"
              >
                View Results
              </Link>
            )}
          </div>
        ))}
      </div>
    </DashboardShell>
  );
}