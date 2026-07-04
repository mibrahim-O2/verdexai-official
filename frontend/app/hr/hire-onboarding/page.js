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

const stepLabels = {
  offerLetterSent: "Offer Letter Sent",
  offerAccepted: "Offer Accepted",
  documentsSubmitted: "Documents Submitted",
  itAccountSetup: "IT Account Setup",
  firstDayScheduled: "First Day Scheduled",
};

export default function HireOnboardingPage() {
  const { firebaseUser } = useAuth();
  const [pipelines, setPipelines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [togglingId, setTogglingId] = useState(null);

  async function fetchOnboarding() {
    if (!firebaseUser) return;
    try {
      const idToken = await firebaseUser.getIdToken();
      const res = await fetch(`${config.api.getBaseUrl()}/api/v1/pipeline/onboarding`, {
        headers: { Authorization: `Bearer ${idToken}` },
      });
      const data = await res.json();
      if (res.ok) setPipelines(data.pipelines);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { fetchOnboarding(); }, [firebaseUser]);

  const toggleStep = async (pipelineId, step, currentValue) => {
    if (!firebaseUser) return;
    setTogglingId(`${pipelineId}-${step}`);
    try {
      const idToken = await firebaseUser.getIdToken();
      const res = await fetch(`${config.api.getBaseUrl()}/api/v1/pipeline/${pipelineId}/step`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${idToken}`,
        },
        body: JSON.stringify({ step, value: !currentValue }),
      });
      const data = await res.json();
      if (res.ok) {
        setPipelines((prev) =>
          prev.map((p) => (p._id === pipelineId ? data.pipeline : p))
        );
      }
    } catch (err) {
      console.error(err);
    } finally {
      setTogglingId(null);
    }
  };

  return (
    <DashboardShell navItems={navItems} roleLabel="HR / Recruiter">
      <h1 className="text-2xl font-bold text-foreground mb-1">Hire Onboarding</h1>
      <p className="text-muted-foreground mb-6">
        Track onboarding progress for each hired candidate. Click a step to toggle its completion.
      </p>

      {loading && <div className="flex justify-center py-10"><LoadingSpinner size={28} /></div>}

      {!loading && pipelines.length === 0 && (
        <div className="bg-card border border-border rounded-2xl p-8 text-center text-muted-foreground">
          No onboarding entries yet. Finalize a hire first to create an onboarding record.
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {pipelines.map((pipeline) => {
          const completedCount = Object.values(pipeline.steps).filter(Boolean).length;
          const totalCount = Object.keys(pipeline.steps).length;

          return (
            <div key={pipeline._id} className="bg-card border border-border rounded-2xl p-5">
              <div className="flex items-start justify-between mb-1">
                <h2 className="font-semibold text-foreground">
                  {pipeline.candidateId?.name || "Unknown Candidate"}
                </h2>
                <span className="text-xs text-primary font-medium">
                  {completedCount}/{totalCount} done
                </span>
              </div>
              <p className="text-sm text-muted-foreground mb-1">{pipeline.jobPostId?.title}</p>
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
                  const isToggling = togglingId === `${pipeline._id}-${key}`;
                  return (
                    <button
                      key={key}
                      onClick={() => toggleStep(pipeline._id, key, done)}
                      disabled={isToggling}
                      className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg border text-sm text-left transition ${
                        done
                          ? "border-primary/40 bg-primary/8 text-primary"
                          : "border-border bg-background text-muted-foreground"
                      } ${isToggling ? "opacity-50" : "hover:border-primary/60"}`}
                    >
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                        done ? "border-primary bg-primary" : "border-muted-foreground"
                      }`}>
                        {done && (
                          <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                            <path d="M2 5l2 2 4-4" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        )}
                      </div>
                      {label}
                    </button>
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