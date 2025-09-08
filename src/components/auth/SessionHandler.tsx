"use client";

import { useAuthenticator } from "@aws-amplify/ui-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function SessionHandler() {
  const { authStatus } = useAuthenticator();
  const router = useRouter();

  useEffect(() => {
    // Handle session timeout/expiration
    if (authStatus === "unauthenticated") {
      const currentPath = window.location.pathname;
      const protectedPaths = ['/dashboard', '/courses'];
      
      // If user was on a protected page and became unauthenticated, redirect to login
      if (protectedPaths.some(path => currentPath.startsWith(path))) {
        sessionStorage.setItem("redirectAfterLogin", currentPath);
        router.push("/login");
      }
    }
  }, [authStatus, router]);

  return null; // This component doesn't render anything
}