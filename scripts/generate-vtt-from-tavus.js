#!/usr/bin/env node

/**
 * Generate VTT transcripts from Tavus video scripts
 * 
 * This script reads the Tavus video data and converts the scripts
 * into WebVTT format for use in the interactive video player.
 */

const fs = require('fs');

// Tavus video data (from the provided JSON)
const tavusVideos = {
  "section_1_2": {
    "video_id": "c05d1f87af",
    "video_name": "Section 1.2 How EMDR Works",
    "script": "Eye Movement Desensitization and Reprocessing, or EMDR, is a therapy that helps the brain unlock and reprocess those memories. Using bilateral stimulation such as guided eye movements, tapping, or tones the therapist activates the brain's natural information-processing system. This allows traumatic memories to shift from being raw and overwhelming into adaptive memories that feel resolved. Think of it like a physical wound, if it's blocked, it can't heal. EMDR clears the block so the mind and body can finish the healing process. Research shows that even long-lasting trauma can improve in just a few sessions.",
    "stream_url": "https://stream.mux.com/d4G7Hj4mMCZ01JoHxJ025VNWCGjERG8IIEuUMUGQYxrfQ.m3u8"
  },
  "section_1_3": {
    "video_id": "597c152f8f",
    "video_name": "Section 1.3 Trauma and the Body",
    "script": "Trauma is not only stored in the mind it also lives in the body. People may feel tense, numb, or constantly on alert. The body 'keeps the score,' holding the imprint of traumatic stress until it is released. EMDR, combined with grounding techniques, can reduce these reactions and restore balance across the brain's major networks which consist of the default mode (self-reflection), central executive (focus and planning), and salience network (threat detection).",
    "stream_url": "https://stream.mux.com/MefHb01vWf00KMKGevalQgTL1JSgl5iiL007Ad02jwD4Ji8.m3u8"
  },
  "section_1_4": {
    "video_id": "8028735c0d",
    "video_name": "Section 1.4 Closing",
    "script": "In this chapter, we learned how trauma can remain stuck, how EMDR reactivates the brain's natural ability to heal, and how restoring balance across brain networks allows people to remember without reliving.  Now it's your turn. Take a short knowledge check quiz to review what you've learned and reinforce these key concepts before moving forward.",
    "stream_url": "https://stream.mux.com/GhYrHVhSeIdNE2ygMFFaxKVwXi017KFmpoe00QtvlA8no.m3u8"
  }
};

/**
 * Convert timestamp in seconds to VTT format (HH:MM:SS.mmm)
 */
function formatTimestamp(seconds) {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);
  const ms = Math.floor((seconds % 1) * 1000);
  
  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}.${String(ms).padStart(3, '0')}`;
}

/**
 * Split script into sentences and create VTT segments
 * Assumes average speaking rate of ~150 words per minute
 */
function scriptToVTT(script, videoName) {
  const sentences = script.match(/[^.!?]+[.!?]+/g) || [script];
  
  let vtt = 'WEBVTT\n\n';
  let currentTime = 0;
  
  // Estimate duration based on word count
  // Average speaking rate: 150 words/minute = 2.5 words/second
  const words = script.split(/\s+/).length;
  const estimatedDuration = words / 2.5;
  const timePerSentence = estimatedDuration / sentences.length;
  
  sentences.forEach((sentence, index) => {
    const startTime = currentTime;
    const endTime = currentTime + timePerSentence;
    
    vtt += `${index + 1}\n`;
    vtt += `${formatTimestamp(startTime)} --> ${formatTimestamp(endTime)}\n`;
    vtt += `${sentence.trim()}\n\n`;
    
    currentTime = endTime;
  });
  
  return vtt;
}

/**
 * Main execution
 */
function main() {
  console.log('🎬 Generating VTT transcripts from Tavus scripts...\n');
  
  const results = [];
  
  Object.entries(tavusVideos).forEach(([sectionId, video]) => {
    console.log(`📝 ${video.video_name}...`);
    
    const vttContent = scriptToVTT(video.script, video.video_name);
    
    console.log(`✅ Generated VTT (${video.script.length} chars → ${vttContent.length} chars)`);
    console.log(`   Sentences: ${video.script.match(/[^.!?]+[.!?]+/g)?.length || 1}\n`);
    
    results.push({
      sectionId,
      videoName: video.video_name,
      vttContent,
      originalScript: video.script,
    });
  });
  
  // Save results
  const outputPath = './scripts/generated-vtt-output.json';
  fs.writeFileSync(outputPath, JSON.stringify(results, null, 2));
  console.log(`💾 Results saved to: ${outputPath}\n`);
  
  // Generate TypeScript code snippets for mock-data.ts
  console.log('📋 Copy these videoVTT values to mock-data.ts:\n');
  console.log('─'.repeat(80));
  
  results.forEach((result) => {
    console.log(`\n// ${result.videoName}`);
    console.log(`// ${result.sectionId}`);
    console.log(`videoVTT: \`${result.vttContent.replace(/`/g, '\\`')}\`,`);
  });
  
  console.log('\n' + '─'.repeat(80));
  console.log('\n✅ All VTT transcripts generated successfully!');
  console.log('📝 Paste the above snippets into your mock-data.ts sections\n');
}

// Run the script
main();
