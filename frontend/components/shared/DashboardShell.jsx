"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { signOut } from "firebase/auth";
import { auth } from "../../lib/firebase";
import { useAuth } from "../../lib/authContext";
import BrandLogo from "./BrandLogo";

export default function DashboardShell({ navItems, roleLabel, children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { firebaseUser, dbUser } = useAuth();
  const dropdownRef = useRef(null);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.push("/auth/login");
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const userInitial = dbUser?.name
    ? dbUser.name.charAt(0).toUpperCase()
    : firebaseUser?.email?.charAt(0).toUpperCase() || "U";

  const photoURL = firebaseUser?.photoURL || null;

  const roleLinks = {
    candidate: [
      { label: "Dashboard", href: "/candidate/dashboard" },
      { label: "Browse Jobs", href: "/candidate/apply" },
      { label: "My Tests", href: "/test" },
      { label: "Onboarding", href: "/candidate/onboarding" },
    ],
    hr: [
      { label: "Dashboard", href: "/hr/dashboard" },
      { label: "Job Postings", href: "/hr/job-posting" },
      { label: "Ranked Candidates", href: "/hr/ranked-candidates" },
      { label: "Finalize Hire", href: "/hr/finalize-hire" },
    ],
    admin: [
      { label: "Admin Dashboard", href: "/admin/hr" },
    ],
  };

  const quickLinks = roleLinks[dbUser?.role] || [];

  return (
    <div className="min-h-screen bg-background flex">
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:static z-40 inset-y-0 left-0 w-64 bg-sidebar border-r border-sidebar-border flex flex-col transition-transform duration-200 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="px-5 py-5 border-b border-sidebar-border">
          <BrandLogo />
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={`${item.href}-${item.label}`}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition ${
                  active
                    ? "bg-sidebar-primary text-sidebar-primary-foreground"
                    : "text-sidebar-foreground hover:bg-sidebar-accent"
                }`}
              >
                <span className="w-5 h-5 flex items-center justify-center">{item.icon}</span>
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="px-5 py-4 border-t border-sidebar-border">
          <p className="text-xs text-sidebar-foreground/60 mb-2">{roleLabel}</p>
          <button
            onClick={handleLogout}
            className="text-sm text-destructive font-medium hover:underline text-left"
          >
            Log Out
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header className="h-16 border-b border-border flex items-center justify-between px-4 lg:px-8 bg-background sticky top-0 z-20">
          <button
            className="lg:hidden w-9 h-9 rounded-lg bg-secondary flex items-center justify-center"
            onClick={() => setSidebarOpen(true)}
            aria-label="Open menu"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path
                d="M4 6h16M4 12h16M4 18h16"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </button>

          <div className="flex-1" />

          {/* Profile button + dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center gap-2 rounded-xl px-2 py-1.5 hover:bg-secondary transition"
              aria-label="Open profile menu"
            >
              {/* Avatar */}
              <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-semibold text-sm overflow-hidden flex-shrink-0">
                {photoURL ? (
                  <img src={photoURL} alt="avatar" className="w-full h-full object-cover" />
                ) : (
                  userInitial
                )}
              </div>
              {/* Name + role (hidden on small screens) */}
              <div className="hidden sm:flex flex-col items-start leading-tight">
                <span className="text-sm font-medium text-foreground">
                  {dbUser?.name || "User"}
                </span>
                <span className="text-xs text-muted-foreground capitalize">{dbUser?.role}</span>
              </div>
              {/* Chevron */}
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                className={`text-muted-foreground transition-transform hidden sm:block ${dropdownOpen ? "rotate-180" : ""}`}
              >
                <path
                  d="M6 9l6 6 6-6"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>

            {/* Dropdown */}
            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-64 bg-card border border-border rounded-2xl shadow-lg overflow-hidden z-50">
                {/* User info header */}
                <div className="px-4 py-3 border-b border-border bg-muted/40">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-base overflow-hidden flex-shrink-0">
                      {photoURL ? (
                        <img src={photoURL} alt="avatar" className="w-full h-full object-cover" />
                      ) : (
                        userInitial
                      )}
                    </div>
                    <div className="min-w-0">
                      <p className="font-semibold text-foreground text-sm truncate">
                        {dbUser?.name || "User"}
                      </p>
                      <p className="text-xs text-muted-foreground truncate">
                        {firebaseUser?.email}
                      </p>
                      <span className="inline-block mt-0.5 text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full capitalize">
                        {dbUser?.role}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Quick links */}
                <div className="py-1">
                  <p className="px-4 py-1.5 text-xs text-muted-foreground font-medium uppercase tracking-wide">
                    Quick Access
                  </p>
                  {quickLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setDropdownOpen(false)}
                      className={`flex items-center gap-2 px-4 py-2 text-sm hover:bg-muted transition ${
                        pathname === link.href ? "text-primary font-medium" : "text-foreground"
                      }`}
                    >
                      {pathname === link.href && (
                        <span className="w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0" />
                      )}
                      {link.label}
                    </Link>
                  ))}
                </div>

                <div className="border-t border-border py-1">
                  <button
                    onClick={() => {
                      setDropdownOpen(false);
                      handleLogout();
                    }}
                    className="w-full flex items-center gap-2 px-4 py-2 text-sm text-destructive hover:bg-destructive/10 transition"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                      <path
                        d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    Log Out
                  </button>
                </div>
              </div>
            )}
          </div>
        </header>

        <main className="flex-1 p-4 lg:p-8">{children}</main>
      </div>
    </div>
  );
}