#!/bin/bash

#
# Update Tavus Guardrails
#
# Updates the guardrails configuration on Tavus using the data from config.ts
# Usage: ./scripts/update-tavus-guardrails.sh
#

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${YELLOW}🛡️  Tavus Guardrails Update Script${NC}\n"

# Load environment variables
if [ -f .env.local ]; then
  export $(cat .env.local | grep -v '^#' | xargs)
fi

# Check required environment variables
if [ -z "$TAVUS_API_KEY" ]; then
  echo -e "${RED}❌ Error: TAVUS_API_KEY not found in environment${NC}"
  echo "Please set TAVUS_API_KEY in .env.local"
  exit 1
fi

if [ -z "$NEXT_PUBLIC_TAVUS_LEARNING_CHECK_GUARDRAILS_ID" ]; then
  echo -e "${RED}❌ Error: NEXT_PUBLIC_TAVUS_LEARNING_CHECK_GUARDRAILS_ID not found in environment${NC}"
  echo "Please set NEXT_PUBLIC_TAVUS_LEARNING_CHECK_GUARDRAILS_ID in .env.local"
  exit 1
fi

GUARDRAILS_ID="$NEXT_PUBLIC_TAVUS_LEARNING_CHECK_GUARDRAILS_ID"
API_KEY="$TAVUS_API_KEY"

echo "Guardrails ID: $GUARDRAILS_ID"
echo ""

# Extract guardrails data from config.ts dynamically
echo -e "${YELLOW}📖 Reading guardrails from src/lib/tavus/config.ts...${NC}"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
GUARDRAILS_DATA=$(node "$SCRIPT_DIR/extract-tavus-config.mjs" guardrails)

if [ -z "$GUARDRAILS_DATA" ]; then
  echo -e "${RED}❌ Failed to extract guardrails from config.ts${NC}"
  exit 1
fi

echo -e "${GREEN}✓ Guardrails loaded successfully${NC}\n"

# Create JSON Patch payload to replace the entire data array
PATCH_DATA=$(cat <<EOF
[
  {
    "op": "replace",
    "path": "/data",
    "value": $GUARDRAILS_DATA
  }
]
EOF
)

echo -e "${YELLOW}📤 Sending PATCH request to Tavus...${NC}\n"

# Make the API request
RESPONSE=$(curl --silent --request PATCH \
  --url "https://tavusapi.com/v2/guardrails/${GUARDRAILS_ID}" \
  --header 'Content-Type: application/json' \
  --header "x-api-key: ${API_KEY}" \
  --write-out "\n%{http_code}" \
  --data "$PATCH_DATA")

# Extract response body and status code (macOS compatible)
HTTP_BODY=$(echo "$RESPONSE" | sed '$d')
HTTP_CODE=$(echo "$RESPONSE" | tail -n 1)

# Check response
if [ "$HTTP_CODE" -eq 200 ] || [ "$HTTP_CODE" -eq 204 ]; then
  echo -e "${GREEN}✅ Guardrails updated successfully!${NC}\n"
  echo "Response:"
  echo "$HTTP_BODY" | jq '.' 2>/dev/null || echo "$HTTP_BODY"
else
  echo -e "${RED}❌ Failed to update guardrails${NC}"
  echo "HTTP Status: $HTTP_CODE"
  echo "Response:"
  echo "$HTTP_BODY" | jq '.' 2>/dev/null || echo "$HTTP_BODY"
  exit 1
fi

echo ""
echo -e "${GREEN}🎉 Done!${NC}"
