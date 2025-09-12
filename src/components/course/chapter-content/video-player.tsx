"use client";

import { useState } from "react";
import { Play, Pause, Volume2, VolumeX, Maximize, SkipBack, SkipForward } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";

export function VideoPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [volume, setVolume] = useState(80);
  
  // Toggle play/pause
  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };
  
  // Toggle mute
  const toggleMute = () => {
    setIsMuted(!isMuted);
  };
  
  // Format time (seconds) to MM:SS
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };
  
  return (
    <div className="rounded-lg overflow-hidden bg-black">
      {/* Video Display */}
      <div className="relative aspect-video bg-gray-900 flex items-center justify-center">
        {/* Placeholder for video - in a real app, this would be a video element */}
        <div className="text-white text-center">
          <p className="text-lg font-medium mb-2">Video Player</p>
          <p className="text-sm text-gray-400">
            {isPlaying ? "Playing" : "Paused"} - {formatTime(progress * 600 / 100)} / 10:00
          </p>
        </div>
        
        {/* Play/Pause overlay button (center of video) */}
        <button 
          className="absolute inset-0 flex items-center justify-center"
          onClick={togglePlay}
        >
          <div className="bg-black/30 rounded-full p-4">
            {isPlaying ? (
              <Pause className="h-8 w-8 text-white" />
            ) : (
              <Play className="h-8 w-8 text-white" />
            )}
          </div>
        </button>
      </div>
      
      {/* Video Controls */}
      <div className="bg-gray-900 text-white p-4">
        {/* Progress bar */}
        <div className="mb-4">
          <Slider
            value={[progress]}
            max={100}
            step={1}
            onValueChange={(value) => setProgress(value[0])}
            className="cursor-pointer"
          />
          <div className="flex justify-between text-xs mt-1">
            <span>{formatTime(progress * 600 / 100)}</span>
            <span>10:00</span>
          </div>
        </div>
        
        {/* Control buttons */}
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Button 
              variant="ghost" 
              size="icon"
              className="text-white hover:bg-white/10"
            >
              <SkipBack className="h-5 w-5" />
            </Button>
            
            <Button 
              variant="ghost" 
              size="icon"
              className="text-white hover:bg-white/10"
              onClick={togglePlay}
            >
              {isPlaying ? (
                <Pause className="h-5 w-5" />
              ) : (
                <Play className="h-5 w-5" />
              )}
            </Button>
            
            <Button 
              variant="ghost" 
              size="icon"
              className="text-white hover:bg-white/10"
            >
              <SkipForward className="h-5 w-5" />
            </Button>
          </div>
          
          <div className="flex items-center gap-2">
            <Button 
              variant="ghost" 
              size="icon"
              className="text-white hover:bg-white/10"
              onClick={toggleMute}
            >
              {isMuted ? (
                <VolumeX className="h-5 w-5" />
              ) : (
                <Volume2 className="h-5 w-5" />
              )}
            </Button>
            
            <div className="w-24">
              <Slider
                value={[isMuted ? 0 : volume]}
                max={100}
                step={1}
                onValueChange={(value) => {
                  setVolume(value[0]);
                  if (value[0] > 0 && isMuted) {
                    setIsMuted(false);
                  }
                }}
                className="cursor-pointer"
              />
            </div>
            
            <Button 
              variant="ghost" 
              size="icon"
              className="text-white hover:bg-white/10"
            >
              <Maximize className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
