"use client";

import { Suspense, useEffect, useState, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import LoadingSpinner from "../../../components/shared/LoadingSpinner";
import BrandLogo from "../../../components/shared/BrandLogo";
import { useAuth } from "../../../lib/authContext";
import config from "../../../lib/config";

function TakeTestContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const invitationId = searchParams.get("id");
  const { firebaseUser } = useAuth();

  const [invitation, setInvitation] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [currentQ, setCurrentQ] = useState(0);
  const [timeLeft, setTimeLeft] = useState(null);
  const [tabSwitches, setTabSwitches] = useState(0);
  const startTimeRef = useRef(Date.now());

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        setTabSwitches((prev) => prev + 1);
      }
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, []);

  useEffect(() => {
    async function fetchTest() {
      if (!firebaseUser || !invitationId) return;
      try {
        const idToken = await firebaseUser.getIdToken();
        const res = await fetch(
          `${config.api.getBaseUrl()}/api/v1/assessment/invitation/${invitationId}/questions`,
          { headers: { Authorization: `Bearer ${idToken}` } }
        );
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed to load test.");
        setInvitation(data.invitation);
        setQuestions(data.questions);
        setAnswers(new Array(data.questions.length).fill(-1));
        setTimeLeft(data.invitation.timeLimitMinutes * 60);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchTest();
  }, [firebaseUser, invitationId]);

  // Countdown timer
  useEffect(() => {
    if (timeLeft === null || timeLeft <= 0) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmit(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  const handleAnswer = (questionIndex, optionIndex) => {
    const updated = [...answers];
    updated[questionIndex] = optionIndex;
    setAnswers(updated);
  };

  const handleSubmit = async (autoSubmit = false) => {
    if (!autoSubmit) {
      const unanswered = answers.filter((a) => a === -1).length;
      if (unanswered > 0) {
        const confirmed = window.confirm(
          `You have ${unanswered} unanswered question(s). Submit anyway?`
        );
        if (!confirmed) return;
      }
    }

    setSubmitting(true);
    const timeTaken = Math.round((Date.now() - startTimeRef.current) / 1000);

    try {
      const idToken = await firebaseUser.getIdToken();
      const finalAnswers = answers.map((a) => (a === -1 ? 0 : a));
      const res = await fetch(`${config.api.getBaseUrl()}/api/v1/assessment/submit`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${idToken}`,
        },
        body: JSON.stringify({
          invitationId,
          answers: finalAnswers,
          timeTakenSeconds: timeTaken,
          tabSwitchCount: tabSwitches,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Submission failed.");
      router.push(`/test/done?id=${invitationId}`);
    } catch (err) {
      setError(err.message);
      setSubmitting(false);
    }
  };

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <LoadingSpinner size={32} />
    </div>
  );

  if (error) return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="text-center">
        <p className="text-destructive text-lg mb-4">{error}</p>
        <button
          onClick={() => router.push("/test")}
          className="bg-primary text-primary-foreground rounded-lg px-6 py-2.5"
        >
          Back to My Tests
        </button>
      </div>
    </div>
  );

  const q = questions[currentQ];
  const answeredCount = answers.filter((a) => a !== -1).length;
  const isTimeLow = timeLeft !== null && timeLeft < 120;

  return (
    <div className="min-h-screen bg-background">
      {/* Top bar */}
      <div className="sticky top-0 z-20 bg-background border-b border-border px-4 py-3 flex items-center justify-between">
        <BrandLogo className="h-7 w-auto" />
        <div className="flex items-center gap-4 text-sm">
          <span className="text-muted-foreground">{invitation?.jobPost?.title}</span>
          {tabSwitches > 0 && (
            <span className="text-destructive font-medium">Tab switches: {tabSwitches}</span>
          )}
          {timeLeft !== null && (
            <span className={`font-semibold px-3 py-1 rounded-lg ${
              isTimeLow
                ? "bg-destructive/10 text-destructive"
                : "bg-primary/10 text-primary"
            }`}>
              {formatTime(timeLeft)}
            </span>
          )}
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-8">
        {/* Progress */}
        <div className="mb-6">
          <div className="flex justify-between text-sm text-muted-foreground mb-2">
            <span>Question {currentQ + 1} of {questions.length}</span>
            <span>{answeredCount} answered</span>
          </div>
          <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-primary transition-all"
              style={{ width: `${((currentQ + 1) / questions.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Question */}
        <div className="bg-card border border-border rounded-2xl p-6 mb-4">
          <p className="text-foreground font-medium text-lg mb-6">{q.question}</p>
          <div className="space-y-3">
            {q.options.map((option, i) => (
              <button
                key={i}
                onClick={() => handleAnswer(currentQ, i)}
                className={`w-full text-left px-4 py-3 rounded-xl border transition ${
                  answers[currentQ] === i
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-border bg-background text-foreground hover:border-primary/40"
                }`}
              >
                <span className="font-medium mr-2">{["A", "B", "C", "D"][i]}.</span>
                {option}
              </button>
            ))}
          </div>
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => setCurrentQ((prev) => Math.max(0, prev - 1))}
            disabled={currentQ === 0}
            className="px-4 py-2 rounded-lg border border-border text-foreground disabled:opacity-40"
          >
            Previous
          </button>

          {/* Question dots */}
          <div className="flex gap-1.5 flex-wrap justify-center max-w-xs">
            {questions.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentQ(i)}
                className={`w-7 h-7 rounded-full text-xs font-medium ${
                  i === currentQ
                    ? "bg-primary text-primary-foreground"
                    : answers[i] !== -1
                    ? "bg-primary/20 text-primary"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>

          {currentQ < questions.length - 1 ? (
            <button
              onClick={() => setCurrentQ((prev) => prev + 1)}
              className="px-4 py-2 rounded-lg bg-primary text-primary-foreground"
            >
              Next
            </button>
          ) : (
            <button
              onClick={() => handleSubmit()}
              disabled={submitting}
              className="px-4 py-2 rounded-lg bg-primary text-primary-foreground disabled:opacity-60"
            >
              {submitting ? "Submitting..." : "Submit Test"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default function TakeTestPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-background">
        <LoadingSpinner size={32} />
      </div>
    }>
      <TakeTestContent />
    </Suspense>
  );
}