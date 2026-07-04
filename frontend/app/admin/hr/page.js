"use client";

import { useEffect, useState } from "react";
import DashboardShell from "../../../components/shared/DashboardShell";
import StatCard from "../../../components/ui/StatCard";
import LoadingSpinner from "../../../components/shared/LoadingSpinner";
import { IconHome, IconUser, IconSettings, IconUsers, IconClipboard } from "../../../components/icons/NavIcons";
import { useAuth } from "../../../lib/authContext";
import config from "../../../lib/config";

const navItems = [
  { href: "/admin/hr", label: "Dashboard", icon: <IconHome /> },
  { href: "/admin/hr#accounts", label: "HR Accounts", icon: <IconUser /> },
  { href: "/admin/hr#settings", label: "System Settings", icon: <IconSettings /> },
];

export default function AdminDashboard() {
  const { firebaseUser } = useAuth();
  const [stats, setStats] = useState(null);
  const [hrAccounts, setHrAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [togglingId, setTogglingId] = useState(null);

  async function fetchData() {
    if (!firebaseUser) return;
    try {
      const idToken = await firebaseUser.getIdToken();
      const headers = { Authorization: `Bearer ${idToken}` };

      const [statsRes, hrRes] = await Promise.all([
        fetch(`${config.api.getBaseUrl()}/api/v1/admin/stats`, { headers }),
        fetch(`${config.api.getBaseUrl()}/api/v1/admin/hr-accounts`, { headers }),
      ]);

      const statsData = await statsRes.json();
      const hrData = await hrRes.json();

      if (statsRes.ok) setStats(statsData.stats);
      if (hrRes.ok) setHrAccounts(hrData.users);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { fetchData(); }, [firebaseUser]);

  const toggleSuspend = async (userId) => {
    if (!firebaseUser) return;
    setTogglingId(userId);
    try {
      const idToken = await firebaseUser.getIdToken();
      const res = await fetch(`${config.api.getBaseUrl()}/api/v1/admin/users/${userId}/suspend`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${idToken}` },
      });
      const data = await res.json();
      if (res.ok) {
        setHrAccounts((prev) => prev.map((u) => (u._id === userId ? data.user : u)));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setTogglingId(null);
    }
  };

  return (
    <DashboardShell navItems={navItems} roleLabel="Admin">
      <h1 className="text-2xl font-bold text-foreground mb-1">Admin Dashboard</h1>
      <p className="text-muted-foreground mb-6">Platform-wide overview and HR account management.</p>

      {loading && <div className="flex justify-center py-10"><LoadingSpinner size={28} /></div>}

      {stats && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard label="Total HR Accounts" value={stats.totalHr} icon={<IconUser className="w-5 h-5" />} />
          <StatCard label="Total Candidates" value={stats.totalCandidates} icon={<IconUsers className="w-5 h-5" />} />
          <StatCard label="Total Job Posts" value={stats.totalJobs} icon={<IconClipboard className="w-5 h-5" />} />
          <StatCard label="Total Applications" value={stats.totalApplications} icon={<IconClipboard className="w-5 h-5" />} />
        </div>
      )}

      <div className="bg-card border border-border rounded-2xl overflow-hidden">
        <div className="px-5 py-4 border-b border-border">
          <h2 className="font-semibold text-foreground">HR Accounts</h2>
        </div>

        {hrAccounts.length === 0 && !loading && (
          <p className="px-5 py-6 text-sm text-muted-foreground">No HR accounts yet.</p>
        )}

        <div className="divide-y divide-border">
          {hrAccounts.map((acc) => (
            <div key={acc._id} className="flex items-center justify-between px-5 py-4">
              <div>
                <p className="font-medium text-foreground">{acc.name}</p>
                <p className="text-sm text-muted-foreground">{acc.email}</p>
              </div>
              <div className="flex items-center gap-3">
                <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                  acc.suspended ? "bg-destructive/10 text-destructive" : "bg-primary/10 text-primary"
                }`}>
                  {acc.suspended ? "Suspended" : "Active"}
                </span>
                <button
                  onClick={() => toggleSuspend(acc._id)}
                  disabled={togglingId === acc._id}
                  className="text-xs px-3 py-1.5 rounded-lg border border-border text-muted-foreground hover:text-foreground transition disabled:opacity-50"
                >
                  {togglingId === acc._id ? "..." : acc.suspended ? "Activate" : "Suspend"}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </DashboardShell>
  );
}