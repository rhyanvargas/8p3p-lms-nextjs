"use client"

import { useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"
import type { TranscriptSegment } from "./interactive-video-player"

interface TranscriptPanelProps {
  transcript: TranscriptSegment[]
  activeSegmentId: string | null
  currentTime: number
  onSeekToTime: (time: number) => void
}

export function TranscriptPanel({ transcript, activeSegmentId, currentTime: _currentTime, onSeekToTime }: TranscriptPanelProps) {
  const activeSegmentRef = useRef<HTMLButtonElement>(null)

  // Auto-scroll to active segment
  useEffect(() => {
    if (activeSegmentRef.current) {
      activeSegmentRef.current.scrollIntoView({
        behavior: "smooth",
        block: "center",
      })
    }
  }, [activeSegmentId])

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds.toString().padStart(2, "0")}`
  }

  return (
    <div className="bg-card rounded-lg border border-border">
      <div className="p-4 border-b border-border">
        <h3 className="text-lg font-semibold text-card-foreground">Interactive Transcript</h3>
        <p className="text-sm text-muted-foreground mt-1">Click any segment to jump to that time</p>
      </div>

      <ScrollArea className="h-[300px]">
        <div className="p-4 space-y-2">
          {transcript.map((segment) => {
            const isActive = segment.id === activeSegmentId

            return (
              <Button
                key={segment.id}
                ref={isActive ? activeSegmentRef : undefined}
                variant="ghost"
                className={cn(
                  "w-full text-left p-3 h-auto justify-start transition-all duration-200",
                  "hover:bg-secondary/50 rounded-md",
                  isActive && "bg-primary/10 border border-primary/20 text-primary",
                )}
                onClick={() => onSeekToTime(segment.startTime)}
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span
                      className={cn(
                        "text-xs font-mono px-2 py-1 rounded",
                        isActive ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground",
                      )}
                    >
                      {formatTime(segment.startTime)}
                    </span>
                    {isActive && <div className="h-2 w-2 bg-primary rounded-full animate-pulse" />}
                  </div>
                  <p
                    className={cn(
                      "text-sm leading-relaxed text-pretty",
                      isActive ? "text-primary font-medium" : "text-card-foreground",
                    )}
                  >
                    {segment.text}
                  </p>
                </div>
              </Button>
            )
          })}
        </div>
      </ScrollArea>
    </div>
  )
}
