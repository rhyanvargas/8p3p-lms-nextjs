/**
 * VTT Parser Utility
 * 
 * Parses WebVTT (Web Video Text Tracks) format into TranscriptSegment objects
 * for use with the interactive video player and transcript panel.
 * 
 * @example
 * ```typescript
 * const vttContent = `WEBVTT
 * 1
 * 00:00:00.000 --> 00:00:03.600
 * Welcome to chapter one`;
 * 
 * const segments = parseVTT(vttContent);
 * ```
 */

export interface TranscriptSegment {
  id: string;
  startTime: number;
  endTime: number;
  text: string;
}

/**
 * Converts VTT timestamp (HH:MM:SS.mmm) to seconds
 */
function parseTimestamp(timestamp: string): number {
  const parts = timestamp.trim().split(':');
  
  if (parts.length === 3) {
    // HH:MM:SS.mmm format
    const hours = parseInt(parts[0], 10);
    const minutes = parseInt(parts[1], 10);
    const seconds = parseFloat(parts[2]);
    return hours * 3600 + minutes * 60 + seconds;
  } else if (parts.length === 2) {
    // MM:SS.mmm format
    const minutes = parseInt(parts[0], 10);
    const seconds = parseFloat(parts[1]);
    return minutes * 60 + seconds;
  }
  
  return 0;
}

/**
 * Parses WebVTT content into an array of transcript segments
 * 
 * @param vttContent - Raw WebVTT content string
 * @returns Array of TranscriptSegment objects
 */
export function parseVTT(vttContent: string): TranscriptSegment[] {
  const segments: TranscriptSegment[] = [];
  
  // Split by double newlines to separate cues
  const lines = vttContent.split('\n');
  
  let i = 0;
  while (i < lines.length) {
    const line = lines[i].trim();
    
    // Skip WEBVTT header and empty lines
    if (line === '' || line === 'WEBVTT' || line.startsWith('NOTE')) {
      i++;
      continue;
    }
    
    // Check if this is a cue identifier (number)
    const cueId = line;
    
    // Next line should be the timestamp
    i++;
    if (i >= lines.length) break;
    
    const timestampLine = lines[i].trim();
    
    // Parse timestamp line (format: 00:00:00.000 --> 00:00:03.600)
    if (timestampLine.includes('-->')) {
      const [startStr, endStr] = timestampLine.split('-->').map(s => s.trim());
      const startTime = parseTimestamp(startStr);
      const endTime = parseTimestamp(endStr);
      
      // Collect text lines until we hit an empty line or end of file
      i++;
      const textLines: string[] = [];
      while (i < lines.length && lines[i].trim() !== '') {
        textLines.push(lines[i].trim());
        i++;
      }
      
      const text = textLines.join(' ');
      
      if (text) {
        segments.push({
          id: `segment_${cueId}`,
          startTime,
          endTime,
          text,
        });
      }
    }
    
    i++;
  }
  
  return segments;
}

/**
 * Converts a simple script text into basic transcript segments
 * This is a fallback for when VTT content is not available
 * 
 * @param script - Plain text script
 * @param segmentDuration - Duration of each segment in seconds (default: 10)
 * @returns Array of TranscriptSegment objects
 */
export function scriptToTranscript(
  script: string,
  segmentDuration: number = 10
): TranscriptSegment[] {
  const sentences = script
    .split(/[.!?]+/)
    .map(s => s.trim())
    .filter(s => s.length > 0);

  return sentences.map((sentence, index) => ({
    id: `segment_${index + 1}`,
    startTime: index * segmentDuration,
    endTime: (index + 1) * segmentDuration,
    text: sentence,
  }));
}
