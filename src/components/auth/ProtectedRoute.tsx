"use client";

import { useAuthenticator } from "@aws-amplify/ui-react";
import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { authStatus } = useAuthenticator();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (authStatus === "unauthenticated") {
      // Store intended destination for post-login redirect
      sessionStorage.setItem("redirectAfterLogin", pathname);
      router.push("/login");
    }
  }, [authStatus, router, pathname]);

  // Show loading while checking auth status
  if (authStatus === "configuring") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <LoadingSpinner size="lg" />
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Only render children if authenticated
  if (authStatus === "authenticated") {
    return <>{children}</>;
  }

  // Return null while redirecting
  return null;
}