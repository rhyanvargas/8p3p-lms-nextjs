"use client";

import { useRouter } from "next/navigation";
import { ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ResumeButtonProps {
  resumeUrl: string | null;
  hasProgress: boolean;
}

export function ResumeButton({ resumeUrl, hasProgress }: ResumeButtonProps) {
  const router = useRouter();

  const handleResume = () => {
    if (resumeUrl) {
      router.push(resumeUrl);
    }
  };

  if (!resumeUrl) {
    return null;
  }

  return (
    <Button 
      size="lg" 
      className="gap-2"
      onClick={handleResume}
    >
      {hasProgress ? "Resume Course" : "Start Course"}
      <ChevronRight className="h-4 w-4" />
    </Button>
  );
}