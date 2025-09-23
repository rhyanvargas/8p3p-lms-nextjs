/**
 * TimeEstimate component for displaying content completion time estimates
 * 
 * Built using existing Card and Badge components from shadcn/ui and
 * integrates with our timer infrastructure for consistent time formatting.
 * 
 * Displays estimated reading time, video time, and total completion time
 * with confidence indicators and complexity badges.
 * 
 * @example
 * <TimeEstimate 
 *   estimate={{
 *     total: 1800,
 *     breakdown: { reading: 600, video: 900, interaction: 300, breaks: 0 },
 *     confidence: 0.85,
 *     isPersonalized: true
 *   }}
 *   variant="detailed"
 *   showBreakdown={true}
 * />
 */

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatTime } from "@/lib/utils/time-formatting";
import { Clock, User, BookOpen, Video, Coffee, Activity } from "lucide-react";
import { cn } from "@/lib/utils";

export interface TimeEstimateProps {
  /** Time estimate data from estimation engine */
  estimate: {
    total: number;
    breakdown: {
      reading: number;
      video: number;
      interaction: number;
      breaks: number;
    };
    confidence: number;
    isPersonalized: boolean;
  };
  /** Display variant for different use cases */
  variant?: 'compact' | 'detailed' | 'card';
  /** Whether to show time breakdown details */
  showBreakdown?: boolean;
  /** Content complexity level for badge display */
  complexity?: 'simple' | 'moderate' | 'complex';
  /** Additional CSS classes */
  className?: string;
  /** Optional click handler for interactive use */
  onClick?: () => void;
}

/**
 * Main TimeEstimate component with reusable design patterns
 */
export function TimeEstimate({
  estimate,
  variant = 'detailed',
  showBreakdown = false,
  complexity,
  className,
  onClick
}: TimeEstimateProps) {
  if (variant === 'compact') {
    return (
      <CompactTimeEstimate 
        estimate={estimate} 
        complexity={complexity}
        className={className}
        onClick={onClick}
      />
    );
  }

  if (variant === 'card') {
    return (
      <CardTimeEstimate 
        estimate={estimate}
        showBreakdown={showBreakdown}
        complexity={complexity}
        className={className}
        onClick={onClick}
      />
    );
  }

  return (
    <DetailedTimeEstimate 
      estimate={estimate}
      showBreakdown={showBreakdown}
      complexity={complexity}
      className={className}
      onClick={onClick}
    />
  );
}

/**
 * Compact time estimate display for inline use
 */
function CompactTimeEstimate({ 
  estimate, 
  complexity, 
  className, 
  onClick 
}: Pick<TimeEstimateProps, 'estimate' | 'complexity' | 'className' | 'onClick'>) {
  return (
    <div 
      className={cn(
        "flex items-center gap-2 text-sm",
        onClick && "cursor-pointer hover:opacity-80",
        className
      )}
      onClick={onClick}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
    >
      <Clock className="h-4 w-4 text-muted-foreground" />
      <span className="font-medium">
        {formatTime(estimate.total)}
      </span>
      
      {estimate.isPersonalized && (
        <Badge variant="secondary" className="h-5 text-xs">
          <User className="h-3 w-3 mr-1" />
          Personal
        </Badge>
      )}
      
      {complexity && (
        <ComplexityBadge complexity={complexity} />
      )}
      
      <ConfidenceBadge confidence={estimate.confidence} />
    </div>
  );
}

/**
 * Detailed time estimate with breakdown information
 */
function DetailedTimeEstimate({ 
  estimate, 
  showBreakdown, 
  complexity, 
  className, 
  onClick 
}: Pick<TimeEstimateProps, 'estimate' | 'showBreakdown' | 'complexity' | 'className' | 'onClick'>) {
  return (
    <div 
      className={cn(
        "space-y-3",
        onClick && "cursor-pointer",
        className
      )}
      onClick={onClick}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
    >
      {/* Main time display */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Clock className="h-5 w-5 text-muted-foreground" />
          <span className="text-lg font-semibold">
            {formatTime(estimate.total)}
          </span>
          <span className="text-sm text-muted-foreground">
            estimated
          </span>
        </div>
        
        <div className="flex items-center gap-2">
          {estimate.isPersonalized && (
            <Badge variant="secondary">
              <User className="h-3 w-3 mr-1" />
              Personalized
            </Badge>
          )}
          
          {complexity && <ComplexityBadge complexity={complexity} />}
          <ConfidenceBadge confidence={estimate.confidence} />
        </div>
      </div>

      {/* Time breakdown */}
      {showBreakdown && (
        <TimeBreakdown breakdown={estimate.breakdown} />
      )}
    </div>
  );
}

/**
 * Card-based time estimate display for prominent placement
 */
function CardTimeEstimate({ 
  estimate, 
  showBreakdown, 
  complexity, 
  className, 
  onClick 
}: Pick<TimeEstimateProps, 'estimate' | 'showBreakdown' | 'complexity' | 'className' | 'onClick'>) {
  return (
    <Card 
      className={cn(
        "w-full",
        onClick && "cursor-pointer hover:shadow-md transition-shadow",
        className
      )}
      onClick={onClick}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
    >
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base flex items-center gap-2">
            <Clock className="h-4 w-4" />
            Estimated Time
          </CardTitle>
          
          <div className="flex items-center gap-2">
            {complexity && <ComplexityBadge complexity={complexity} />}
            <ConfidenceBadge confidence={estimate.confidence} />
          </div>
        </div>
        
        <CardDescription className="text-2xl font-bold text-foreground">
          {formatTime(estimate.total)}
          {estimate.isPersonalized && (
            <Badge variant="secondary" className="ml-2">
              <User className="h-3 w-3 mr-1" />
              Personal
            </Badge>
          )}
        </CardDescription>
      </CardHeader>
      
      {showBreakdown && (
        <CardContent className="pt-0">
          <TimeBreakdown breakdown={estimate.breakdown} />
        </CardContent>
      )}
    </Card>
  );
}

/**
 * Time breakdown component showing reading, video, and interaction time
 */
function TimeBreakdown({ 
  breakdown 
}: { 
  breakdown: TimeEstimateProps['estimate']['breakdown'] 
}) {
  const breakdownItems = [
    {
      label: "Reading",
      time: breakdown.reading,
      icon: BookOpen,
      color: "text-blue-600"
    },
    {
      label: "Video",
      time: breakdown.video,
      icon: Video,
      color: "text-green-600"
    },
    {
      label: "Interaction",
      time: breakdown.interaction,
      icon: Activity,
      color: "text-purple-600"
    },
    {
      label: "Breaks",
      time: breakdown.breaks,
      icon: Coffee,
      color: "text-orange-600"
    }
  ].filter(item => item.time > 0); // Only show non-zero items

  return (
    <div className="space-y-2">
      <div className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
        Time Breakdown
      </div>
      
      <div className="grid grid-cols-2 gap-2">
        {breakdownItems.map((item) => {
          const Icon = item.icon;
          return (
            <div key={item.label} className="flex items-center gap-2 text-sm">
              <Icon className={cn("h-3 w-3", item.color)} />
              <span className="text-muted-foreground">{item.label}:</span>
              <span className="font-medium">{formatTime(item.time)}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/**
 * Complexity badge component with appropriate styling
 */
function ComplexityBadge({ complexity }: { complexity: 'simple' | 'moderate' | 'complex' }) {
  const variants = {
    simple: { variant: "default" as const, label: "Simple" },
    moderate: { variant: "secondary" as const, label: "Moderate" },
    complex: { variant: "destructive" as const, label: "Complex" }
  };

  const config = variants[complexity];

  return (
    <Badge variant={config.variant} className="text-xs">
      {config.label}
    </Badge>
  );
}

/**
 * Confidence badge component showing estimate reliability
 */
function ConfidenceBadge({ confidence }: { confidence: number }) {
  const percentage = Math.round(confidence * 100);
  
  // Determine badge variant based on confidence level
  let variant: "default" | "secondary" | "destructive" = "secondary";
  if (confidence >= 0.8) variant = "default";
  if (confidence < 0.6) variant = "destructive";

  return (
    <Badge variant={variant} className="text-xs">
      {percentage}% confident
    </Badge>
  );
}
