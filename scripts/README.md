# Scripts Directory

Utility scripts for maintaining and managing the 8P3P LMS.

## Available Scripts

### 🎬 Video Management

#### `fetch-mux-vtt.js`
**Purpose**: Fetch WebVTT transcripts from Mux for new videos  
**When to use**: When adding new video content that has captions in Mux  

**Usage**:
```bash
# 1. Edit the script and update the videos array with:
#    - section ID
#    - video title
#    - playback ID (from .mp4.json file)
#    - track ID (from Mux dashboard)

# 2. Run the script
node scripts/fetch-mux-vtt.js

# 3. Copy the output videoVTT content to src/lib/mock-data.ts
```

**Requirements**:
- Video must be uploaded to Mux
- Captions/subtitles generated in Mux
- Track ID from Mux dashboard

### 🎯 Tavus Configuration Management

**Single Source of Truth**: Automatically syncs `src/lib/tavus/config.ts` with Tavus API.

#### Quick Start
```bash
# 1. Edit src/lib/tavus/config.ts
# 2. Run the update script
./scripts/update-tavus-config.sh
```

#### Available Scripts
- `update-tavus-config.sh` - Updates both objectives and guardrails (recommended)
- `update-tavus-objectives.sh` - Updates objectives only
- `update-tavus-guardrails.sh` - Updates guardrails only
- `extract-tavus-config.mjs` - Helper that parses TypeScript config to JSON

**📚 Full Documentation**: See [TAVUS_SCRIPTS_README.md](./TAVUS_SCRIPTS_README.md) for detailed usage, troubleshooting, and examples.

**Key Features**:
- ✅ Automatically reads from TypeScript config
- ✅ No manual JSON editing required
- ✅ Version controlled configuration
- ✅ macOS and Linux compatible

---

### ✅ Quality Gates

#### `pre-commit.sh`
**Purpose**: Run quality checks before commits  
**When to use**: Automatically via git hooks or manually before commits

**Usage**:
```bash
# Manual run
./scripts/pre-commit.sh

# Checks performed:
# - ESLint with no warnings
# - TypeScript type checking
# - Build verification
```

## Removed Scripts

The following scripts were one-time setup utilities and have been removed:

- ~~`generate-vtt-from-tavus.js`~~ - Tavus-specific transcript generation
- ~~`replace-videos.sh`~~ - One-time video replacement
- ~~`new-video-metadata.md`~~ - One-time video setup documentation

## Adding New Scripts

When adding new scripts:

1. **Add shebang**: `#!/usr/bin/env node` or `#!/bin/bash`
2. **Make executable**: `chmod +x scripts/your-script.sh`
3. **Add documentation**: Update this README with usage instructions
4. **Add to .gitignore**: Add generated output files (if any)
5. **Update eslint.config.mjs**: Ensure scripts/ is in ignores

## Script Output Files

Generated files (not committed to git):
- `vtt-output.json` - Temporary VTT fetching output

These files should be listed in `.gitignore` under the scripts section.
