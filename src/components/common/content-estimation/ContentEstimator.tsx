/**
 * ContentEstimator component for analyzing and displaying content time estimates
 * 
 * Integrates with the content analysis engine to provide real-time time estimates
 * for mixed content (text + video) with user personalization and progress tracking.
 * 
 * Built using existing components and follows our reusability protocol.
 * 
 * @example
 * <ContentEstimator 
 *   content={{
 *     text: "Course content...",
 *     videos: [{ url: "video.mp4", duration: 300 }],
 *     contentType: "lesson"
 *   }}
 *   userProfile={{ readingSpeed: 220, completionRate: 1.1 }}
 *   onEstimateReady={(estimate) => console.log(estimate)}
 *   trackProgress={true}
 * />
 */

"use client";

import { useEffect, useState, useMemo } from "react";
import { TimeEstimate } from "./TimeEstimate";
import { calculateTimeEstimate, type MixedContent, type UserProfile, type TimeEstimate as EstimateData, DEFAULT_ESTIMATION_CONFIG } from "@/lib/content-analysis";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertCircle, CheckCircle, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

export interface ContentEstimatorProps {
  /** Content to analyze (text and/or video) */
  content: MixedContent;
  /** User profile for personalized estimates */
  userProfile?: UserProfile;
  /** Callback when estimate is calculated */
  onEstimateReady?: (estimate: EstimateData) => void;
  /** Whether to track progress during content consumption */
  trackProgress?: boolean;
  /** Display variant */
  variant?: 'compact' | 'detailed' | 'card';
  /** Whether to show time breakdown */
  showBreakdown?: boolean;
  /** Additional CSS classes */
  className?: string;
  /** Loading state override */
  isLoading?: boolean;
  /** Error state override */
  error?: string;
}

/**
 * Main ContentEstimator component with analysis integration
 */
export function ContentEstimator({
  content,
  userProfile,
  onEstimateReady,
  trackProgress = false,
  variant = 'detailed',
  showBreakdown = true,
  className,
  isLoading: externalLoading,
  error: externalError
}: ContentEstimatorProps) {
  const [estimate, setEstimate] = useState<EstimateData | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisError, setAnalysisError] = useState<string | null>(null);

  // Memoize content analysis to avoid unnecessary recalculations
  const contentAnalysis = useMemo(() => {
    if (!content) return null;
    
    try {
      setIsAnalyzing(true);
      setAnalysisError(null);
      
      // Perform content analysis with user personalization
      const result = calculateTimeEstimate(
        content,
        userProfile || {},
        DEFAULT_ESTIMATION_CONFIG
      );
      
      setIsAnalyzing(false);
      return result;
    } catch (error) {
      setIsAnalyzing(false);
      const errorMessage = error instanceof Error ? error.message : 'Analysis failed';
      setAnalysisError(errorMessage);
      return null;
    }
  }, [content, userProfile]);

  // Update estimate when analysis completes
  useEffect(() => {
    if (contentAnalysis) {
      setEstimate(contentAnalysis);
      onEstimateReady?.(contentAnalysis);
    }
  }, [contentAnalysis, onEstimateReady]);

  // Determine loading and error states
  const isLoading = externalLoading || isAnalyzing;
  const error = externalError || analysisError;

  // Handle error state
  if (error) {
    return (
      <ErrorDisplay 
        error={error} 
        variant={variant}
        className={className}
      />
    );
  }

  // Handle loading state
  if (isLoading || !estimate) {
    return (
      <LoadingDisplay 
        variant={variant}
        className={className}
      />
    );
  }

  // Determine content complexity from analysis
  const complexity = determineComplexityFromContent(content);

  return (
    <div className={cn("space-y-4", className)}>
      {/* Main time estimate display */}
      <TimeEstimate
        estimate={estimate}
        variant={variant}
        showBreakdown={showBreakdown}
        complexity={complexity}
      />

      {/* Progress tracking component (if enabled) */}
      {trackProgress && (
        <ProgressTracker
          estimatedTime={estimate.total}
          recommendations={estimate.recommendations}
        />
      )}

      {/* Analysis insights (for detailed variant) */}
      {variant === 'detailed' && (
        <AnalysisInsights
          estimate={estimate}
          content={content}
          userProfile={userProfile}
        />
      )}
    </div>
  );
}

/**
 * Loading state display component
 */
function LoadingDisplay({ 
  variant, 
  className 
}: { 
  variant: ContentEstimatorProps['variant'];
  className?: string;
}) {
  if (variant === 'compact') {
    return (
      <div className={cn("flex items-center gap-2", className)}>
        <Skeleton className="h-4 w-4 rounded" />
        <Skeleton className="h-4 w-16" />
        <Skeleton className="h-5 w-12 rounded-full" />
      </div>
    );
  }

  if (variant === 'card') {
    return (
      <Card className={className}>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 animate-pulse" />
            <Skeleton className="h-5 w-32" />
          </div>
          <Skeleton className="h-8 w-20" />
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className={cn("space-y-3", className)}>
      <div className="flex items-center gap-2">
        <Clock className="h-5 w-5 animate-pulse text-muted-foreground" />
        <Skeleton className="h-6 w-24" />
        <Skeleton className="h-5 w-16 rounded-full" />
      </div>
      <div className="space-y-2">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-2/3" />
      </div>
    </div>
  );
}

/**
 * Error state display component
 */
function ErrorDisplay({ 
  error, 
  variant, 
  className 
}: { 
  error: string;
  variant: ContentEstimatorProps['variant'];
  className?: string;
}) {
  if (variant === 'compact') {
    return (
      <div className={cn("flex items-center gap-2 text-destructive", className)}>
        <AlertCircle className="h-4 w-4" />
        <span className="text-sm">Analysis failed</span>
      </div>
    );
  }

  return (
    <Card className={cn("border-destructive", className)}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-destructive">
          <AlertCircle className="h-4 w-4" />
          Analysis Error
        </CardTitle>
        <CardDescription className="text-destructive">
          {error}
        </CardDescription>
      </CardHeader>
    </Card>
  );
}

/**
 * Progress tracking component for active content consumption
 */
function ProgressTracker({ 
  estimatedTime: _estimatedTime, 
  recommendations 
}: { 
  estimatedTime: number;
  recommendations: EstimateData['recommendations'];
}) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm flex items-center gap-2">
          <CheckCircle className="h-4 w-4 text-green-600" />
          Learning Plan
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-muted-foreground">Sessions:</span>
            <span className="ml-2 font-medium">{recommendations.suggestedSessions}</span>
          </div>
          <div>
            <span className="text-muted-foreground">Per session:</span>
            <span className="ml-2 font-medium">
              ~{Math.round(recommendations.sessionLength / 60)} min
            </span>
          </div>
          <div>
            <span className="text-muted-foreground">Pace:</span>
            <Badge variant="secondary" className="ml-2 text-xs">
              {recommendations.pace}
            </Badge>
          </div>
          <div>
            <span className="text-muted-foreground">Breaks/hour:</span>
            <span className="ml-2 font-medium">{recommendations.breakFrequency}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

/**
 * Analysis insights component showing estimation details
 */
function AnalysisInsights({ 
  estimate, 
  content, 
  userProfile 
}: { 
  estimate: EstimateData;
  content: MixedContent;
  userProfile?: UserProfile;
}) {
  const insights = [];

  // Personalization insight
  if (estimate.isPersonalized && userProfile) {
    insights.push({
      type: "personalization",
      message: `Estimate adjusted for your ${userProfile.readingSpeed ? `${userProfile.readingSpeed} WPM reading speed` : 'learning preferences'}`
    });
  }

  // Confidence insight
  if (estimate.confidence < 0.7) {
    insights.push({
      type: "confidence",
      message: "Estimate has lower confidence due to limited content data"
    });
  }

  // Content type insight
  if (content.videos && content.videos.length > 0) {
    insights.push({
      type: "content",
      message: `Includes ${content.videos.length} video${content.videos.length > 1 ? 's' : ''} with engagement factors`
    });
  }

  if (insights.length === 0) return null;

  return (
    <div className="space-y-2">
      <div className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
        Analysis Insights
      </div>
      <div className="space-y-1">
        {insights.map((insight, index) => (
          <div key={index} className="text-xs text-muted-foreground">
            • {insight.message}
          </div>
        ))}
      </div>
    </div>
  );
}

/**
 * Helper function to determine content complexity for display
 */
function determineComplexityFromContent(content: MixedContent): 'simple' | 'moderate' | 'complex' {
  // Simple heuristic based on content structure
  const hasMultipleVideos = content.videos && content.videos.length > 2;
  const hasLongText = content.text && content.text.length > 2000;
  const isAssessment = content.contentType === 'quiz' || content.contentType === 'assessment';

  if (isAssessment || (hasMultipleVideos && hasLongText)) return 'complex';
  if (hasMultipleVideos || hasLongText) return 'moderate';
  return 'simple';
}
