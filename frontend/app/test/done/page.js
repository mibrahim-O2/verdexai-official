"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import BrandLogo from "../../../components/shared/BrandLogo";
import LoadingSpinner from "../../../components/shared/LoadingSpinner";
import { useAuth } from "../../../lib/authContext";
import config from "../../../lib/config";

function TestDoneContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const invitationId = searchParams.get("id");
  const { firebaseUser } = useAuth();

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showReview, setShowReview] = useState(false);

  useEffect(() => {
    async function fetchResult() {
      if (!firebaseUser || !invitationId) return;
      try {
        const idToken = await firebaseUser.getIdToken();
        const res = await fetch(
          `${config.api.getBaseUrl()}/api/v1/assessment/results/${invitationId}`,
          { headers: { Authorization: `Bearer ${idToken}` } }
        );
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed to load results.");
        setResult(data.result);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchResult();
  }, [firebaseUser, invitationId]);

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}m ${s}s`;
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <LoadingSpinner size={32} />
    </div>
  );

  if (error) return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="text-center">
        <p className="text-destructive mb-4">{error}</p>
        <Link href="/test" className="bg-primary text-primary-foreground rounded-lg px-6 py-2.5">
          Back to Tests
        </Link>
      </div>
    </div>
  );

  const passed = result.percentage >= 60;

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b border-border px-4 py-3 flex items-center">
        <BrandLogo className="h-7 w-auto" />
      </div>

      <div className="max-w-2xl mx-auto px-4 py-10">
        <div className="bg-card border border-border rounded-2xl p-8 text-center mb-6">
          <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 ${
            passed ? "bg-primary/10" : "bg-destructive/10"
          }`}>
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none">
              {passed
                ? <path d="M5 13l4 4L19 7" stroke="var(--color-primary)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                : <path d="M6 6l12 12M18 6L6 18" stroke="var(--color-destructive)" strokeWidth="2.5" strokeLinecap="round" />
              }
            </svg>
          </div>

          <h1 className="text-2xl font-bold text-foreground mb-1">
            {passed ? "Test Passed" : "Test Completed"}
          </h1>
          <p className="text-muted-foreground mb-6">{result.jobTitle}</p>

          <div
            className="text-6xl font-bold mb-2"
            style={{ color: passed ? "var(--color-primary)" : "var(--color-destructive)" }}
          >
            {result.percentage}%
          </div>
          <p className="text-muted-foreground mb-6">
            {result.score} out of {result.totalQuestions} correct
          </p>

          <div className="grid grid-cols-2 gap-4 text-sm text-left max-w-xs mx-auto mb-6">
            <div className="bg-muted rounded-lg p-3">
              <p className="text-muted-foreground text-xs mb-1">Time Taken</p>
              <p className="font-medium text-foreground">{formatTime(result.timeTakenSeconds)}</p>
            </div>
            <div className="bg-muted rounded-lg p-3">
              <p className="text-muted-foreground text-xs mb-1">Tab Switches</p>
              <p className={`font-medium ${result.tabSwitchCount > 0 ? "text-destructive" : "text-foreground"}`}>
                {result.tabSwitchCount}
              </p>
            </div>
          </div>

          <div className="flex gap-3 justify-center">
            <button
              onClick={() => setShowReview(!showReview)}
              className="px-4 py-2 rounded-lg border border-border text-foreground text-sm"
            >
              {showReview ? "Hide Review" : "Review Answers"}
            </button>
            <Link
              href="/candidate/dashboard"
              className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm"
            >
              Back to Dashboard
            </Link>
          </div>
        </div>

        {showReview && (
          <div className="space-y-4">
            {result.review.map((item, i) => (
              <div
                key={i}
                className={`bg-card border rounded-2xl p-5 ${
                  item.correct ? "border-primary/30" : "border-destructive/30"
                }`}
              >
                <p className="font-medium text-foreground mb-3">
                  <span className="text-muted-foreground mr-2">Q{i + 1}.</span>
                  {item.question}
                </p>
                <div className="space-y-2 mb-3">
                  {item.options.map((opt, j) => (
                    <div
                      key={j}
                      className={`px-3 py-2 rounded-lg text-sm ${
                        j === item.correctAnswer
                          ? "bg-primary/10 text-primary font-medium"
                          : j === item.candidateAnswer && !item.correct
                          ? "bg-destructive/10 text-destructive"
                          : "text-muted-foreground"
                      }`}
                    >
                      <span className="font-medium mr-2">{["A", "B", "C", "D"][j]}.</span>
                      {opt}
                      {j === item.correctAnswer && " (Correct)"}
                      {j === item.candidateAnswer && !item.correct && " (Your answer)"}
                    </div>
                  ))}
                </div>
                {item.explanation && (
                  <p className="text-xs text-muted-foreground border-t border-border pt-2">
                    {item.explanation}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function TestDonePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-background">
        <LoadingSpinner size={32} />
      </div>
    }>
      <TestDoneContent />
    </Suspense>
  );
}