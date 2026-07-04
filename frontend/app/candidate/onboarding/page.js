"use client";

import { useEffect, useState } from "react";
import DashboardShell from "../../../components/shared/DashboardShell";
import LoadingSpinner from "../../../components/shared/LoadingSpinner";
import {
  IconHome,
  IconBriefcase,
  IconClipboard,
  IconCheckCircle,
} from "../../../components/icons/NavIcons";
import { useAuth } from "../../../lib/authContext";
import config from "../../../lib/config";

const navItems = [
  { href: "/candidate/dashboard", label: "Dashboard", icon: <IconHome /> },
  { href: "/candidate/apply", label: "Browse Jobs", icon: <IconBriefcase /> },
  { href: "/test", label: "My Tests", icon: <IconClipboard /> },
  { href: "/candidate/onboarding", label: "Onboarding", icon: <IconCheckCircle /> },
];

const stepLabels = {
  offerLetterSent: "Offer Letter Sent",
  offerAccepted: "Offer Accepted",
  documentsSubmitted: "Documents Submitted",
  itAccountSetup: "IT Account Setup",
  firstDayScheduled: "First Day Scheduled",
};

export default function CandidateOnboardingPage() {
  const { firebaseUser } = useAuth();
  const [pipelines, setPipelines] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchMyOnboarding() {
      if (!firebaseUser) return;
      try {
        const idToken = await firebaseUser.getIdToken();
        const res = await fetch(
          `${config.api.getBaseUrl()}/api/v1/pipeline/my-onboarding`,
          { headers: { Authorization: `Bearer ${idToken}` } }
        );
        const data = await res.json();
        if (res.ok) setPipelines(data.pipelines);
      } catch (err) {
        console.error("Failed to load onboarding:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchMyOnboarding();
  }, [firebaseUser]);

  return (
    <DashboardShell navItems={navItems} roleLabel="Candidate">
      <h1 className="text-2xl font-bold text-foreground mb-1">Onboarding</h1>
      <p className="text-muted-foreground mb-6">
        Track your onboarding progress after being hired.
      </p>

      {loading && (
        <div className="flex justify-center py-10">
          <LoadingSpinner size={28} />
        </div>
      )}

      {!loading && pipelines.length === 0 && (
        <div className="bg-card border border-border rounded-2xl p-8 max-w-xl text-center">
          <div className="flex justify-center mb-3">
            <IconCheckCircle className="w-12 h-12 text-muted-foreground" />
          </div>
          <p className="text-foreground font-medium mb-1">No active onboarding yet</p>
          <p className="text-sm text-muted-foreground">
            Once you are hired for a role, your onboarding checklist will appear here.
          </p>
        </div>
      )}

      <div className="space-y-4 max-w-xl">
        {pipelines.map((pipeline) => {
          const completedCount = Object.values(pipeline.steps).filter(Boolean).length;
          const totalCount = Object.keys(pipeline.steps).length;

          return (
            <div key={pipeline._id} className="bg-card border border-border rounded-2xl p-5">
              <div className="flex items-start justify-between mb-1">
                <h2 className="font-semibold text-foreground">
                  {pipeline.jobPostId?.title}
                </h2>
                <span className="text-xs text-primary font-medium">
                  {completedCount}/{totalCount} done
                </span>
              </div>
              <p className="text-sm text-muted-foreground mb-1">
                {pipeline.jobPostId?.department}
              </p>
              {pipeline.startDate && (
                <p className="text-xs text-muted-foreground mb-3">
                  Start date: {new Date(pipeline.startDate).toLocaleDateString()}
                </p>
              )}

              <div className="w-full h-1.5 bg-muted rounded-full mb-4 overflow-hidden">
                <div
                  className="h-full bg-primary transition-all"
                  style={{ width: `${(completedCount / totalCount) * 100}%` }}
                />
              </div>

              <div className="space-y-2">
                {Object.entries(stepLabels).map(([key, label]) => {
                  const done = pipeline.steps[key];
                  return (
                    <div
                      key={key}
                      className={`flex items-center gap-3 px-3 py-2 rounded-lg border text-sm ${
                        done
                          ? "border-primary/40 bg-primary/5 text-primary"
                          : "border-border bg-background text-muted-foreground"
                      }`}
                    >
                      <div
                        className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                          done ? "border-primary bg-primary" : "border-muted-foreground"
                        }`}
                      >
                        {done && (
                          <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                            <path
                              d="M2 5l2 2 4-4"
                              stroke="white"
                              strokeWidth="1.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        )}
                      </div>
                      {label}
                      {done && (
                        <span className="ml-auto text-xs text-primary font-medium">
                          Completed
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </DashboardShell>
  );
}