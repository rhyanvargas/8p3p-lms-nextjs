# New Tavus Video Metadata - Chapter 1

**Generated**: October 3, 2025  
**Source**: Tavus API Response  
**Replica ID**: r3a47ce45e68 (primary)

## Video Mappings

### Section 1.1 - Introduction
- **Tavus Video ID**: `2f59cad21c`
- **Video Name**: "Section 1.1 Introduction"
- **Filename**: `Intro-8p3p-Ch1-Section-1-1.mp4`
- **Stream URL**: `https://stream.mux.com/Cx2LxQBVP4V01WyNimXVk00FFNyHdDvL3T2Jd3D8nq33w.m3u8`
- **Mux Playback ID**: `Cx2LxQBVP4V01WyNimXVk00FFNyHdDvL3T2Jd3D8nq33w`
- **Download URL**: `https://stream.mux.com/Cx2LxQBVP4V01WyNimXVk00FFNyHdDvL3T2Jd3D8nq33w/high.mp4?download=2f59cad21c`
- **Created**: Fri, 03 Oct 2025 17:15:47 GMT
- **Status**: ✅ Ready

**Script**:
> Welcome to Chapter 1 of the EMDR Foundations course! We're glad you're here to learn about how the brain processes overwhelming experiences. When people go through overwhelming experiences such as combat, assault, or childhood trauma, the brain may store memories in a way that keeps the pain alive. This is called dysfunctionally stored memory. Instead of fading into the past, these memories can trigger fear, shame, or physical reactions as if the danger is happening again.

---

### Section 1.2 - How EMDR Works
- **Tavus Video ID**: `c05d1f87af`
- **Video Name**: "Section 1.2 How EMDR Works"
- **Filename**: `How EMDR Works-8p3p-Ch1-Section-1-2.mp4`
- **Stream URL**: `https://stream.mux.com/d4G7Hj4mMCZ01JoHxJ025VNWCGjERG8IIEuUMUGQYxrfQ.m3u8`
- **Mux Playback ID**: `d4G7Hj4mMCZ01JoHxJ025VNWCGjERG8IIEuUMUGQYxrfQ`
- **Download URL**: `https://stream.mux.com/d4G7Hj4mMCZ01JoHxJ025VNWCGjERG8IIEuUMUGQYxrfQ/high.mp4?download=c05d1f87af`
- **Created**: Fri, 03 Oct 2025 17:16:14 GMT
- **Status**: ✅ Ready

**Script**:
> Eye Movement Desensitization and Reprocessing, or EMDR, is a therapy that helps the brain unlock and reprocess those memories. Using bilateral stimulation such as guided eye movements, tapping, or tones the therapist activates the brain's natural information-processing system. This allows traumatic memories to shift from being raw and overwhelming into adaptive memories that feel resolved. Think of it like a physical wound, if it's blocked, it can't heal. EMDR clears the block so the mind and body can finish the healing process. Research shows that even long-lasting trauma can improve in just a few sessions.

---

### Section 1.3 - Trauma and the Body
- **Tavus Video ID**: `597c152f8f`
- **Video Name**: "Section 1.3 Trauma and the Body"
- **Filename**: `Trauma and the Body-8p3p-Ch1-Section-1-3.mp4`
- **Stream URL**: `https://stream.mux.com/MefHb01vWf00KMKGevalQgTL1JSgl5iiL007Ad02jwD4Ji8.m3u8`
- **Mux Playback ID**: `MefHb01vWf00KMKGevalQgTL1JSgl5iiL007Ad02jwD4Ji8`
- **Download URL**: `https://stream.mux.com/MefHb01vWf00KMKGevalQgTL1JSgl5iiL007Ad02jwD4Ji8/high.mp4?download=597c152f8f`
- **Created**: Fri, 03 Oct 2025 17:16:39 GMT
- **Status**: ✅ Ready

**Script**:
> Trauma is not only stored in the mind it also lives in the body. People may feel tense, numb, or constantly on alert. The body 'keeps the score,' holding the imprint of traumatic stress until it is released. EMDR, combined with grounding techniques, can reduce these reactions and restore balance across the brain's major networks which consist of the default mode (self-reflection), central executive (focus and planning), and salience network (threat detection).

---

### Section 1.4 - Closing
- **Tavus Video ID**: `8028735c0d`
- **Video Name**: "Section 1.4 Closing"
- **Filename**: `Closing-8p3p-Ch1-Section-1-4.mp4`
- **Stream URL**: `https://stream.mux.com/GhYrHVhSeIdNE2ygMFFaxKVwXi017KFmpoe00QtvlA8no.m3u8`
- **Mux Playback ID**: `GhYrHVhSeIdNE2ygMFFaxKVwXi017KFmpoe00QtvlA8no`
- **Download URL**: `https://stream.mux.com/GhYrHVhSeIdNE2ygMFFaxKVwXi017KFmpoe00QtvlA8no/high.mp4?download=8028735c0d`
- **Created**: Fri, 03 Oct 2025 17:17:12 GMT
- **Status**: ✅ Ready

**Script**:
> In this chapter, we learned how trauma can remain stuck, how EMDR reactivates the brain's natural ability to heal, and how restoring balance across brain networks allows people to remember without reliving. Now it's your turn. Take a short knowledge check quiz to review what you've learned and reinforce these key concepts before moving forward.

---

## Mock Data Update Required

Update `src/lib/mock-data.ts` with these new stream URLs:

```typescript
// Section 1.1
videoUrl: video_1_1,  // Will resolve to Cx2LxQBVP4V01WyNimXVk00FFNyHdDvL3T2Jd3D8nq33w

// Section 1.2
videoUrl: video_1_2,  // Will resolve to d4G7Hj4mMCZ01JoHxJ025VNWCGjERG8IIEuUMUGQYxrfQ

// Section 1.3
videoUrl: video_1_3,  // Will resolve to MefHb01vWf00KMKGevalQgTL1JSgl5iiL007Ad02jwD4Ji8

// Section 1.4
videoUrl: video_1_4,  // Will resolve to GhYrHVhSeIdNE2ygMFFaxKVwXi017KFmpoe00QtvlA8no
```

## Process Flow

1. **Download Videos**: Run `scripts/replace-videos.sh`
2. **Auto-Generation**: next-video will create new `.mp4.json` files with Mux playback IDs
3. **Verification**: Test each video section to ensure playback works
4. **Cleanup**: Delete backup folder once verified

## Technical Notes

- All videos use **Mux streaming** (`.m3u8` format)
- Videos are optimized for HLS adaptive streaming
- Thumbnails available (JPEG + GIF formats)
- All videos have `start_with_wave: true` setting
- Primary replica ID: `r3a47ce45e68`

## Differences from Old Videos

The new videos were generated with the **latest Tavus replica** which may have:
- Improved voice quality
- Better lip-sync accuracy
- Updated visual presentation
- Consistent audio levels across all sections
