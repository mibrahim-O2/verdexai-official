"use client";

import DashboardShell from "../../../components/shared/DashboardShell";
import StatCard from "../../../components/ui/StatCard";
import { IconHome, IconUser, IconSettings, IconUsers, IconClipboard } from "../../../components/icons/NavIcons";

const navItems = [
  { href: "/admin/hr", label: "Dashboard", icon: <IconHome /> },
  { href: "/admin/hr", label: "Manage HR Accounts", icon: <IconUser /> },
  { href: "/admin/hr", label: "System Settings", icon: <IconSettings /> },
];

const hrAccounts = [
  { name: "Sara Khan", email: "sara@verdexai.com", status: "Active" },
  { name: "Ahmed Raza", email: "ahmed@verdexai.com", status: "Active" },
  { name: "Fatima Noor", email: "fatima@verdexai.com", status: "Suspended" },
];

export default function AdminDashboard() {
  return (
    <DashboardShell navItems={navItems} roleLabel="Admin">
      <h1 className="text-2xl font-bold text-foreground mb-1">Admin Dashboard</h1>
      <p className="text-muted-foreground mb-6">Platform-wide overview and HR account management.</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        <StatCard label="Total HR Accounts" value="8" trend={0} icon={<IconUser className="w-5 h-5" />} />
        <StatCard label="Total Candidates" value="1,204" trend={14} icon={<IconUsers className="w-5 h-5" />} />
        <StatCard label="Total Job Posts" value="56" trend={9} icon={<IconClipboard className="w-5 h-5" />} />
      </div>

      <div className="bg-card border border-border rounded-2xl overflow-hidden">
        <div className="px-5 py-4 border-b border-border flex items-center justify-between">
          <h2 className="font-semibold text-foreground">HR Accounts</h2>
          <span className="text-sm text-primary font-medium cursor-pointer">+ Invite HR</span>
        </div>
        <div className="divide-y divide-border">
          {hrAccounts.map((acc, i) => (
            <div key={i} className="flex items-center justify-between px-5 py-4">
              <div>
                <p className="font-medium text-foreground">{acc.name}</p>
                <p className="text-sm text-muted-foreground">{acc.email}</p>
              </div>
              <span
                className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                  acc.status === "Active"
                    ? "bg-primary/10 text-primary"
                    : "bg-destructive/10 text-destructive"
                }`}
              >
                {acc.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </DashboardShell>
  );
}