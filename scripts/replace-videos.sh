#!/bin/bash

# Video Replacement Script for Chapter 1
# Downloads new Tavus videos and replaces existing ones
# Created: 2025-10-03

set -e  # Exit on error

VIDEOS_DIR="./videos"
BACKUP_DIR="./videos/backup-$(date +%Y%m%d-%H%M%S)"

echo "🎬 Starting video replacement process..."
echo ""

# Create backup directory
echo "📦 Creating backup of old videos..."
mkdir -p "$BACKUP_DIR"

# Backup old videos and JSON files
if [ -f "$VIDEOS_DIR/Intro-8p3p-Ch1-Section-1-1.mp4" ]; then
    mv "$VIDEOS_DIR/Intro-8p3p-Ch1-Section-1-1.mp4" "$BACKUP_DIR/"
    mv "$VIDEOS_DIR/Intro-8p3p-Ch1-Section-1-1.mp4.json" "$BACKUP_DIR/" 2>/dev/null || true
fi

if [ -f "$VIDEOS_DIR/How EMDR Works-8p3p-Ch1-Section-1-2.mp4" ]; then
    mv "$VIDEOS_DIR/How EMDR Works-8p3p-Ch1-Section-1-2.mp4" "$BACKUP_DIR/"
    mv "$VIDEOS_DIR/How EMDR Works-8p3p-Ch1-Section-1-2.mp4.json" "$BACKUP_DIR/" 2>/dev/null || true
fi

if [ -f "$VIDEOS_DIR/Trauma and the Body-8p3p-Ch1-Section-1-3.mp4" ]; then
    mv "$VIDEOS_DIR/Trauma and the Body-8p3p-Ch1-Section-1-3.mp4" "$BACKUP_DIR/"
    mv "$VIDEOS_DIR/Trauma and the Body-8p3p-Ch1-Section-1-3.mp4.json" "$BACKUP_DIR/" 2>/dev/null || true
fi

if [ -f "$VIDEOS_DIR/Closing-8p3p-Ch1-Section-1-4.mp4" ]; then
    mv "$VIDEOS_DIR/Closing-8p3p-Ch1-Section-1-4.mp4" "$BACKUP_DIR/"
    mv "$VIDEOS_DIR/Closing-8p3p-Ch1-Section-1-4.mp4.json" "$BACKUP_DIR/" 2>/dev/null || true
fi

echo "✅ Backup created at: $BACKUP_DIR"
echo ""

# Download new videos
echo "⬇️  Downloading new videos from Tavus/Mux..."
echo ""

# Section 1.1 - Introduction
echo "📥 Downloading Section 1.1 - Introduction..."
curl -L -o "$VIDEOS_DIR/Intro-8p3p-Ch1-Section-1-1.mp4" \
  "https://stream.mux.com/Cx2LxQBVP4V01WyNimXVk00FFNyHdDvL3T2Jd3D8nq33w/high.mp4?download=2f59cad21c"
echo "✅ Section 1.1 downloaded"
echo ""

# Section 1.2 - How EMDR Works
echo "📥 Downloading Section 1.2 - How EMDR Works..."
curl -L -o "$VIDEOS_DIR/How EMDR Works-8p3p-Ch1-Section-1-2.mp4" \
  "https://stream.mux.com/d4G7Hj4mMCZ01JoHxJ025VNWCGjERG8IIEuUMUGQYxrfQ/high.mp4?download=c05d1f87af"
echo "✅ Section 1.2 downloaded"
echo ""

# Section 1.3 - Trauma and the Body
echo "📥 Downloading Section 1.3 - Trauma and the Body..."
curl -L -o "$VIDEOS_DIR/Trauma and the Body-8p3p-Ch1-Section-1-3.mp4" \
  "https://stream.mux.com/MefHb01vWf00KMKGevalQgTL1JSgl5iiL007Ad02jwD4Ji8/high.mp4?download=597c152f8f"
echo "✅ Section 1.3 downloaded"
echo ""

# Section 1.4 - Closing
echo "📥 Downloading Section 1.4 - Closing..."
curl -L -o "$VIDEOS_DIR/Closing-8p3p-Ch1-Section-1-4.mp4" \
  "https://stream.mux.com/GhYrHVhSeIdNE2ygMFFaxKVwXi017KFmpoe00QtvlA8no/high.mp4?download=8028735c0d"
echo "✅ Section 1.4 downloaded"
echo ""

echo "🎉 All videos downloaded successfully!"
echo ""
echo "📝 Next steps:"
echo "   1. Run 'npm run dev' to start the development server"
echo "   2. Navigate to a video section - next-video will auto-generate .mp4.json files"
echo "   3. Verify videos play correctly with new Mux URLs"
echo ""
echo "💾 Old videos backed up to: $BACKUP_DIR"
echo "   (You can delete this backup folder once you verify everything works)"
