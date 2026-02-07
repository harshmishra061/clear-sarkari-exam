#!/bin/bash

# SEO Verification Script for clearsarkariexam.info
# Run this after deploying to verify everything is working

echo "🔍 Verifying SEO Setup for clearsarkariexam.info"
echo "================================================"
echo ""

SITE_URL="https://clearsarkariexam.info"
ERRORS=0

# Color codes
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to check URL
check_url() {
    local url=$1
    local name=$2
    
    echo -n "Checking $name... "
    
    status_code=$(curl -s -o /dev/null -w "%{http_code}" "$url")
    
    if [ "$status_code" = "200" ]; then
        echo -e "${GREEN}✓ OK${NC} (Status: $status_code)"
        return 0
    else
        echo -e "${RED}✗ FAILED${NC} (Status: $status_code)"
        ERRORS=$((ERRORS + 1))
        return 1
    fi
}

# Function to check if content exists
check_content() {
    local url=$1
    local search_term=$2
    local name=$3
    
    echo -n "Checking $name... "
    
    content=$(curl -s "$url")
    
    if echo "$content" | grep -q "$search_term"; then
        echo -e "${GREEN}✓ Found${NC}"
        return 0
    else
        echo -e "${RED}✗ Not Found${NC}"
        ERRORS=$((ERRORS + 1))
        return 1
    fi
}

echo "1. Basic Accessibility Tests"
echo "----------------------------"
check_url "$SITE_URL" "Homepage"
check_url "$SITE_URL/robots.txt" "Robots.txt"
check_url "$SITE_URL/sitemap.xml" "Sitemap"
check_url "$SITE_URL/latest-jobs" "Latest Jobs Page"
check_url "$SITE_URL/manifest.json" "PWA Manifest"
echo ""

echo "2. Robots.txt Content"
echo "--------------------"
check_content "$SITE_URL/robots.txt" "Sitemap:" "Sitemap reference in robots.txt"
check_content "$SITE_URL/robots.txt" "User-agent: \*" "User-agent directive"
check_content "$SITE_URL/robots.txt" "Allow: /" "Allow directive"
echo ""

echo "3. Sitemap Content"
echo "-----------------"
check_content "$SITE_URL/sitemap.xml" "<loc>$SITE_URL</loc>" "Homepage in sitemap"
check_content "$SITE_URL/sitemap.xml" "<loc>$SITE_URL/latest-jobs</loc>" "Latest-jobs in sitemap"
check_content "$SITE_URL/sitemap.xml" "/jobs/" "Job pages in sitemap"
echo ""

echo "4. Homepage Meta Tags"
echo "--------------------"
check_content "$SITE_URL" "<title>" "Title tag"
check_content "$SITE_URL" "description" "Meta description"
check_content "$SITE_URL" "og:title" "Open Graph title"
check_content "$SITE_URL" "twitter:card" "Twitter card"
echo ""

echo "5. Structured Data"
echo "-----------------"
echo -n "Checking for JSON-LD... "
if curl -s "$SITE_URL" | grep -q "application/ld+json"; then
    echo -e "${GREEN}✓ Found${NC}"
else
    echo -e "${YELLOW}⚠ Not Found (optional)${NC}"
fi
echo ""

echo "================================================"
echo "Summary"
echo "================================================"

if [ $ERRORS -eq 0 ]; then
    echo -e "${GREEN}✓ All checks passed!${NC}"
    echo ""
    echo "Next steps:"
    echo "1. Set up Google Search Console"
    echo "2. Submit sitemap to Google"
    echo "3. Wait 3-7 days for indexing"
    echo ""
    exit 0
else
    echo -e "${RED}✗ $ERRORS check(s) failed${NC}"
    echo ""
    echo "Please fix the errors above and run this script again."
    echo ""
    exit 1
fi
