"use client";

import { useAuthenticator } from "@aws-amplify/ui-react";
import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";

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
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p>Loading...</p>
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