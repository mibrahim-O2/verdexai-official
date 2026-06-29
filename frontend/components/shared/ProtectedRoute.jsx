"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../lib/authContext";
import LoadingSpinner from "./LoadingSpinner";

/**
 * Wraps pages that require authentication.
 * Optionally pass allowedRoles={["hr"]} to restrict by role.
 */
export default function ProtectedRoute({ children, allowedRoles = [] }) {
  const router = useRouter();
  const { firebaseUser, dbUser, loading } = useAuth();

  useEffect(() => {
    if (loading) return;

    if (!firebaseUser || !dbUser) {
      router.replace("/auth/login");
      return;
    }

    if (allowedRoles.length > 0 && !allowedRoles.includes(dbUser.role)) {
      router.replace("/auth/login");
    }
  }, [loading, firebaseUser, dbUser, allowedRoles, router]);

  if (loading || !firebaseUser || !dbUser) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <LoadingSpinner size={32} />
      </div>
    );
  }

  return children;
}