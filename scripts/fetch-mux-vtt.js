#!/usr/bin/env node

/**
 * Fetch VTT (WebVTT) transcripts from Mux for Chapter 1 videos
 * 
 * Mux VTT endpoint: https://stream.mux.com/:PLAYBACK_ID/text/:TRACK_ID.vtt
 * 
 * Prerequisites:
 * - Videos must have generated captions/subtitles in Mux
 * - Track IDs can be found via Mux API or dashboard
 */

const https = require('https');
const fs = require('fs');

// Playback IDs and Track IDs from Mux
const videos = [
  {
    section: 'section_1_2',
    title: 'How EMDR Works',
    playbackId: 'oqzgl3M2FeTbjhaqhVuWSsT0200TYfMXjTvgE01lV4YXyI',
    trackId: 'y2BsWQHILJJS400tVTvrV01DYHGO01lzaTrbgDE00E0101JzVuTojpmSJNKg',
  },
  {
    section: 'section_1_3',
    title: 'Trauma and the Body',
    playbackId: 'Ym6H8IfAb6WDknDNKarsc200uT3tzbKTHGSighkoToGs',
    trackId: 'FXufMqTgoZd2dhHheV4VnZ478oAOqYt00Gk5Zb5bhTs6JLNPrvlwJdw',
  },
  {
    section: 'section_1_4',
    title: 'Closing',
    playbackId: '3tRhEmo46zyXq02QFVyeyjcyoVxjwGck601lVafqwJy7Y',
    trackId: '5O7gLzrqWceslG7rtvtAcWTeOsf9OvdbFn01oG4tKCWt3waRgWuRAUw',
  },
];

/**
 * Fetch VTT content from Mux
 * @param {string} playbackId - Mux playback ID
 * @param {string} trackId - Track ID (usually 'default' or specific track ID)
 * @returns {Promise<string>} VTT content
 */
function fetchVTT(playbackId, trackId = 'default') {
  return new Promise((resolve, reject) => {
    const url = `https://stream.mux.com/${playbackId}/text/${trackId}.vtt`;
    
    https.get(url, (res) => {
      let data = '';
      
      if (res.statusCode !== 200) {
        reject(new Error(`HTTP ${res.statusCode}: ${res.statusMessage} - ${url}`));
        return;
      }
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        resolve(data);
      });
    }).on('error', (err) => {
      reject(err);
    });
  });
}

/**
 * Try multiple track IDs to find available VTT
 * @param {string} playbackId - Mux playback ID
 * @returns {Promise<{trackId: string, content: string}>}
 */
async function findVTT(playbackId) {
  const trackIds = ['default', 'en', 'english', 'auto', 'generated'];
  
  for (const trackId of trackIds) {
    try {
      console.log(`  Trying track ID: ${trackId}...`);
      const content = await fetchVTT(playbackId, trackId);
      return { trackId, content };
    } catch (err) {
      // Continue to next track ID
    }
  }
  
  throw new Error('No VTT tracks found. Video may not have captions generated.');
}

/**
 * Main execution
 */
async function main() {
  console.log('🎬 Fetching VTT transcripts from Mux...\n');
  
  const results = [];
  
  for (const video of videos) {
    console.log(`📥 ${video.title} (${video.section})...`);
    console.log(`   Playback ID: ${video.playbackId}`);
    console.log(`   Track ID: ${video.trackId}`);
    
    try {
      const content = await fetchVTT(video.playbackId, video.trackId);
      
      console.log(`✅ Success!`);
      console.log(`   VTT Length: ${content.length} characters`);
      console.log(`   Lines: ${content.split('\n').length}\n`);
      
      results.push({
        ...video,
        vttContent: content,
      });
      
    } catch (err) {
      console.log(`❌ Failed: ${err.message}\n`);
      results.push({
        ...video,
        error: err.message,
      });
    }
  }
  
  // Save results to file
  const outputPath = './scripts/vtt-output.json';
  fs.writeFileSync(outputPath, JSON.stringify(results, null, 2));
  console.log(`\n💾 Results saved to: ${outputPath}`);
  
  // Generate TypeScript code snippets
  console.log('\n📝 Copy these to mock-data.ts:\n');
  console.log('─'.repeat(80));
  
  results.forEach((result) => {
    if (result.vttContent) {
      console.log(`\n// ${result.title}`);
      console.log(`videoVTT: \`${result.vttContent.replace(/`/g, '\\`')}\`,\n`);
    } else {
      console.log(`\n// ${result.title} - ERROR: ${result.error}`);
    }
  });
  
  console.log('─'.repeat(80));
  
  // Check for errors
  const errors = results.filter(r => r.error);
  if (errors.length > 0) {
    console.log('\n⚠️  Some videos failed to fetch VTT:');
    errors.forEach(err => {
      console.log(`   - ${err.title}: ${err.error}`);
    });
    console.log('\n💡 Tip: Check Mux dashboard to ensure videos have generated captions');
    console.log('   Or manually add VTT files via Mux API');
  }
}

// Run the script
main().catch((err) => {
  console.error('❌ Script failed:', err);
  process.exit(1);
});
