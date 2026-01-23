#!/bin/bash

# Test script for revalidation endpoint
# Usage: ./test-revalidate.sh [secret] [domain] [path]

SECRET=${1:-"your_secret_here"}
DOMAIN=${2:-"http://localhost:3000"}
PATH=${3:-"/fi"}

echo "Testing revalidation endpoint..."
echo "Domain: $DOMAIN"
echo "Path: $PATH"
echo ""

# Test GET endpoint (health check)
echo "1. Testing GET /api/revalidate (health check)..."
curl -s "$DOMAIN/api/revalidate" | jq '.' || echo "Response received"
echo ""

# Test POST endpoint without secret (should fail)
echo "2. Testing POST without secret (should fail with 400)..."
curl -s -X POST "$DOMAIN/api/revalidate?path=$PATH" | jq '.' || echo "Response received"
echo ""

# Test POST endpoint with wrong secret (should fail)
echo "3. Testing POST with wrong secret (should fail with 401)..."
curl -s -X POST "$DOMAIN/api/revalidate?secret=wrong_secret&path=$PATH" | jq '.' || echo "Response received"
echo ""

# Test POST endpoint with correct secret (should succeed)
echo "4. Testing POST with correct secret (should succeed)..."
curl -s -X POST "$DOMAIN/api/revalidate?secret=$SECRET&path=$PATH" | jq '.' || echo "Response received"
echo ""

echo "Testing complete!"
echo ""
echo "To use this script:"
echo "  ./test-revalidate.sh YOUR_SECRET http://localhost:3000 /fi"
echo ""
echo "Or set environment variables:"
echo "  export REVALIDATION_SECRET=your_secret"
echo "  export NEXTJS_DOMAIN=http://localhost:3000"
echo "  ./test-revalidate.sh \$REVALIDATION_SECRET \$NEXTJS_DOMAIN /fi"
