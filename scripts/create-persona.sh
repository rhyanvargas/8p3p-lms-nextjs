#!/bin/bash

# Create Tavus Persona for 8P3P LMS Learning Check
# This script creates a new persona with the exact configuration for the AI Instructor Assistant
#
# Usage:
#   ./scripts/create-persona.sh
#   ./scripts/create-persona.sh --api-key YOUR_API_KEY
#   ./scripts/create-persona.sh --replica-id YOUR_REPLICA_ID

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Default values
API_KEY=""
REPLICA_ID="r9fa0878977a"
OBJECTIVES_ID=""
GUARDRAILS_ID=""

# Parse command line arguments
while [[ $# -gt 0 ]]; do
  case $1 in
    --api-key)
      API_KEY="$2"
      shift 2
      ;;
    --replica-id)
      REPLICA_ID="$2"
      shift 2
      ;;
    --objectives-id)
      OBJECTIVES_ID="$2"
      shift 2
      ;;
    --guardrails-id)
      GUARDRAILS_ID="$2"
      shift 2
      ;;
    --help|-h)
      echo "Usage: $0 [OPTIONS]"
      echo ""
      echo "Options:"
      echo "  --api-key KEY          Tavus API key (or set TAVUS_API_KEY env var)"
      echo "  --replica-id ID        Replica ID (default: r9fa0878977a)"
      echo "  --objectives-id ID     Objectives ID (optional)"
      echo "  --guardrails-id ID     Guardrails ID (optional)"
      echo "  --help, -h             Show this help message"
      exit 0
      ;;
    *)
      echo -e "${RED}Unknown option: $1${NC}"
      echo "Use --help for usage information"
      exit 1
      ;;
  esac
done

echo -e "${BLUE}🚀 Creating Tavus Persona for 8P3P LMS${NC}"
echo ""

# Get API key from environment if not provided
if [ -z "$API_KEY" ]; then
  if [ -f .env.local ]; then
    API_KEY=$(grep "TAVUS_API_KEY" .env.local | cut -d '=' -f2)
  fi
fi

# Prompt for API key if still not found
if [ -z "$API_KEY" ]; then
  echo -e "${YELLOW}⚠️  TAVUS_API_KEY not found in .env.local${NC}"
  read -p "Enter your Tavus API key: " API_KEY
fi

if [ -z "$API_KEY" ]; then
  echo -e "${RED}❌ API key is required${NC}"
  exit 1
fi

# Get objectives and guardrails IDs from .env.local if not provided
if [ -z "$OBJECTIVES_ID" ] && [ -f .env.local ]; then
  OBJECTIVES_ID=$(grep "NEXT_PUBLIC_TAVUS_LEARNING_CHECK_OBJECTIVES_ID" .env.local | cut -d '=' -f2)
fi

if [ -z "$GUARDRAILS_ID" ] && [ -f .env.local ]; then
  GUARDRAILS_ID=$(grep "NEXT_PUBLIC_TAVUS_LEARNING_CHECK_GUARDRAILS_ID" .env.local | cut -d '=' -f2)
fi

# Build the persona configuration from centralized config
echo -e "${BLUE}📋 Loading persona configuration from src/lib/tavus/config.ts...${NC}"

# Check if tsx is available
if ! command -v tsx &> /dev/null; then
  echo -e "${RED}❌ tsx is required but not installed${NC}"
  echo -e "${YELLOW}Install it with: npm install -g tsx${NC}"
  exit 1
fi

# Load persona config directly from centralized location
PERSONA_CONFIG=$(tsx --eval "
  import { PERSONA_CONFIG } from './src/lib/tavus/index.js';
  console.log(JSON.stringify(PERSONA_CONFIG, null, 2));
")

if [ -z "$PERSONA_CONFIG" ]; then
  echo -e "${RED}❌ Failed to load persona configuration${NC}"
  exit 1
fi

# Build JSON payload with centralized config
PAYLOAD=$(echo "$PERSONA_CONFIG" | jq --arg replica "$REPLICA_ID" '. + {default_replica_id: $replica}')

# Add objectives_id if provided
if [ -n "$OBJECTIVES_ID" ]; then
  PAYLOAD=$(echo "$PAYLOAD" | jq --arg id "$OBJECTIVES_ID" '. + {objectives_id: $id}')
  echo -e "${GREEN}✅ Including objectives_id: $OBJECTIVES_ID${NC}"
fi

# Add guardrails_id if provided
if [ -n "$GUARDRAILS_ID" ]; then
  PAYLOAD=$(echo "$PAYLOAD" | jq --arg id "$GUARDRAILS_ID" '. + {guardrails_id: $id}')
  echo -e "${GREEN}✅ Including guardrails_id: $GUARDRAILS_ID${NC}"
fi

echo ""
echo -e "${BLUE}🔧 Creating persona in Tavus...${NC}"

# Create the persona
RESPONSE=$(curl -s -X POST \
  https://tavusapi.com/v2/personas \
  -H "Content-Type: application/json" \
  -H "x-api-key: $API_KEY" \
  -d "$PAYLOAD")

# Check if successful
PERSONA_ID=$(echo "$RESPONSE" | jq -r '.persona_id // empty')

if [ -n "$PERSONA_ID" ]; then
  PERSONA_NAME=$(echo "$RESPONSE" | jq -r '.persona_name')
  
  echo ""
  echo -e "${GREEN}🎉 Persona created successfully!${NC}"
  echo ""
  echo -e "${BLUE}Persona Details:${NC}"
  echo "  ID: $PERSONA_ID"
  echo "  Name: $PERSONA_NAME"
  echo "  Replica ID: $REPLICA_ID"
  
  if [ -n "$OBJECTIVES_ID" ]; then
    echo "  Objectives ID: $OBJECTIVES_ID"
  fi
  
  if [ -n "$GUARDRAILS_ID" ]; then
    echo "  Guardrails ID: $GUARDRAILS_ID"
  fi
  
  echo ""
  echo -e "${YELLOW}📝 Next Steps:${NC}"
  echo "1. Add to your .env.local:"
  echo "   TAVUS_PERSONA_ID=$PERSONA_ID"
  echo ""
  echo "2. Restart your development server"
  echo "   npm run dev"
  echo ""
  
  # Save persona config to file
  echo "$RESPONSE" | jq . > "docs/persona-created-$(date +%Y%m%d-%H%M%S).json"
  echo -e "${GREEN}✅ Persona config saved to docs/persona-created-*.json${NC}"
  
else
  echo ""
  echo -e "${RED}❌ Failed to create persona${NC}"
  echo ""
  echo -e "${YELLOW}Response:${NC}"
  echo "$RESPONSE" | jq .
  exit 1
fi
