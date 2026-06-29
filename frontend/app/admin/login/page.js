"use client";

import { useState } from "react";
import BrandLogo from "../../../components/shared/BrandLogo";
import PasswordField from "../../../components/shared/PasswordField";

export default function AdminLoginPage() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    // TODO Phase 7: wire to admin auth backend
    await new Promise((r) => setTimeout(r, 600));
    setSubmitting(false);
    setError("Admin login backend isn't connected yet — coming in Phase 7.");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-md bg-card border border-border rounded-2xl p-8 shadow-sm">
        <div className="flex justify-center mb-6">
          <BrandLogo />
        </div>
        <h1 className="text-2xl font-bold text-center text-foreground mb-1">Admin Access</h1>
        <p className="text-center text-muted-foreground text-sm mb-6">
          Restricted area — authorized personnel only
        </p>

        {error && (
          <div className="mb-4 px-3 py-2 rounded-lg bg-destructive/10 text-destructive text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">Admin Email</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="admin@verdexai.com"
              className="w-full px-3 py-2.5 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">Password</label>
            <PasswordField
              id="password"
              name="password"
              value={form.password}
              onChange={handleChange}
            />
          </div>
          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-primary text-primary-foreground rounded-lg py-2.5 font-medium hover:opacity-90 transition disabled:opacity-60"
          >
            {submitting ? "Verifying..." : "Sign In as Admin"}
          </button>
        </form>
      </div>
    </div>
  );
}