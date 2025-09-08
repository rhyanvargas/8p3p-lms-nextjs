"use client";

import { useAuthenticator } from "@aws-amplify/ui-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

export default function AuthRedirect({ children }: { children: React.ReactNode }) {
  const { authStatus } = useAuthenticator();
  const router = useRouter();

  useEffect(() => {
    if (authStatus === "authenticated") {
      // Check for stored redirect destination
      const redirectPath = sessionStorage.getItem("redirectAfterLogin");
      if (redirectPath) {
        sessionStorage.removeItem("redirectAfterLogin");
        router.push(redirectPath);
      } else {
        router.push("/dashboard");
      }
    }
  }, [authStatus, router]);

  // Only show login page if not authenticated
  if (authStatus === "unauthenticated" || authStatus === "configuring") {
    return <>{children}</>;
  }

  // Show loading while redirecting authenticated users
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <LoadingSpinner size="lg" />
        <p className="mt-4 text-gray-600">Redirecting...</p>
      </div>
    </div>
  );
}