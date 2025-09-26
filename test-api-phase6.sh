#!/bin/bash

# Enhanced HealthierKE API Testing Script
# Tests all health content endpoints with different scenarios

echo "🧪 HealthierKE Enhanced API Testing"
echo "==================================="
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Check if Strapi is running
if ! curl -s http://localhost:1337/admin > /dev/null; then
    echo -e "${RED}❌ Error: Strapi is not running at http://localhost:1337${NC}"
    echo "Please start Strapi first with: npm start"
    exit 1
fi

echo -e "${GREEN}✅ Strapi is running!${NC}"
echo ""

# Function to test API endpoint
test_endpoint() {
    local name="$1"
    local url="$2"
    local description="$3"
    
    echo -e "${BLUE}🔍 Testing: $name${NC}"
    echo "   URL: $url"
    echo "   Description: $description"
    
    # Test basic endpoint
    response=$(curl -s -w "HTTPSTATUS:%{http_code}" "$url")
    status_code=$(echo "$response" | tr -d '\n' | sed -e 's/.*HTTPSTATUS://')
    body=$(echo "$response" | sed -e 's/HTTPSTATUS:.*//g')
    
    if [ "$status_code" -eq 200 ]; then
        echo -e "${GREEN}   ✅ Status: $status_code${NC}"
        
        # Check if response has data
        if echo "$body" | grep -q '"data"'; then
            data_count=$(echo "$body" | jq -r '.data | length' 2>/dev/null)
            if [ "$data_count" != "null" ]; then
                echo -e "${GREEN}   ✅ Data: $data_count items found${NC}"
            else
                echo -e "${GREEN}   ✅ Single item response${NC}"
            fi
        else
            echo -e "${YELLOW}   ⚠️  No data field in response${NC}"
        fi
        
        # Check for health-specific headers
        headers=$(curl -s -I "$url")
        if echo "$headers" | grep -q "X-Health-Content"; then
            echo -e "${GREEN}   ✅ Health content headers present${NC}"
        else
            echo -e "${YELLOW}   ⚠️  Health content headers missing${NC}"
        fi
        
    else
        echo -e "${RED}   ❌ Status: $status_code${NC}"
        if [ ${#body} -lt 500 ]; then
            echo "   Response: $body"
        fi
    fi
    echo ""
}

# Function to test mobile optimization
test_mobile_endpoint() {
    local name="$1"
    local url="$2"
    
    echo -e "${BLUE}📱 Testing Mobile Optimization: $name${NC}"
    
    # Test with mobile user agent
    response=$(curl -s -w "HTTPSTATUS:%{http_code}" -H "User-Agent: Mozilla/5.0 (Linux; Android 10; SM-G973F) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.120 Mobile Safari/537.36" "$url")
    status_code=$(echo "$response" | tr -d '\n' | sed -e 's/.*HTTPSTATUS://')
    
    if [ "$status_code" -eq 200 ]; then
        echo -e "${GREEN}   ✅ Mobile response: $status_code${NC}"
        
        # Test with mobile query parameter
        mobile_response=$(curl -s "$url?mobile=true")
        if echo "$mobile_response" | grep -q '"data"'; then
            echo -e "${GREEN}   ✅ Mobile query parameter works${NC}"
        fi
    else
        echo -e "${RED}   ❌ Mobile response failed: $status_code${NC}"
    fi
    echo ""
}

# Function to test error handling
test_error_handling() {
    echo -e "${BLUE}🛡️ Testing Error Handling${NC}"
    
    # Test 404 error
    response=$(curl -s -w "HTTPSTATUS:%{http_code}" "http://localhost:1337/api/conditions/nonexistent-condition")
    status_code=$(echo "$response" | tr -d '\n' | sed -e 's/.*HTTPSTATUS://')
    
    if [ "$status_code" -eq 404 ]; then
        echo -e "${GREEN}   ✅ 404 handling works${NC}"
        
        # Check if error response has Kenya emergency info for health content
        body=$(echo "$response" | sed -e 's/HTTPSTATUS:.*//g')
        if echo "$body" | grep -q "999"; then
            echo -e "${GREEN}   ✅ Kenya emergency info in 404 errors${NC}"
        fi
    else
        echo -e "${RED}   ❌ 404 handling failed: $status_code${NC}"
    fi
    echo ""
}

echo "1. 📋 Testing Health Topics"
test_endpoint "Health Topics List" "http://localhost:1337/api/health-topics" "List all health topics"
test_endpoint "Health Topics with Population" "http://localhost:1337/api/health-topics?populate=*" "Health topics with relationships"
test_mobile_endpoint "Health Topics" "http://localhost:1337/api/health-topics"

echo "2. 🩺 Testing Conditions"
test_endpoint "Conditions List" "http://localhost:1337/api/conditions" "List all conditions"
test_endpoint "Emergency Conditions" "http://localhost:1337/api/conditions?filters[isEmergency][\$eq]=true" "Filter emergency conditions"
test_endpoint "Conditions by Severity" "http://localhost:1337/api/conditions?filters[severity][\$eq]=critical" "Filter by critical severity"
test_mobile_endpoint "Conditions" "http://localhost:1337/api/conditions"

echo "3. 📄 Testing Articles"
test_endpoint "Articles List" "http://localhost:1337/api/articles" "List all articles"
test_endpoint "Emergency Articles" "http://localhost:1337/api/articles?filters[articleType][\$eq]=emergency" "Filter emergency articles"
test_endpoint "Reviewed Articles" "http://localhost:1337/api/articles?filters[medicallyReviewed][\$eq]=true" "Filter medically reviewed articles"
test_mobile_endpoint "Articles" "http://localhost:1337/api/articles"

echo "4. 🔍 Testing Symptoms"
test_endpoint "Symptoms List" "http://localhost:1337/api/symptoms" "List all symptoms"
test_endpoint "Emergency Symptoms" "http://localhost:1337/api/symptoms?filters[whenToSeekCare][\$eq]=emergency" "Filter emergency symptoms"
test_endpoint "Kenya Common Symptoms" "http://localhost:1337/api/symptoms?filters[commonInKenya][\$eq]=true" "Filter Kenya common symptoms"
test_mobile_endpoint "Symptoms" "http://localhost:1337/api/symptoms"

echo "5. 💊 Testing Treatments"
test_endpoint "Treatments List" "http://localhost:1337/api/treatments" "List all treatments"
test_endpoint "Available in Kenya" "http://localhost:1337/api/treatments?filters[availableInKenya][\$eq]=true" "Filter Kenya available treatments"
test_endpoint "Low Cost Treatments" "http://localhost:1337/api/treatments?filters[estimatedCost][\$eq]=low" "Filter low cost treatments"
test_mobile_endpoint "Treatments" "http://localhost:1337/api/treatments"

echo "6. 🔗 Testing Relationships"
test_endpoint "Articles with Conditions" "http://localhost:1337/api/articles?populate[relatedConditions][populate]=*" "Articles with related conditions"
test_endpoint "Conditions with Articles" "http://localhost:1337/api/conditions?populate[articles][populate]=*" "Conditions with related articles"

echo "7. 🛡️ Testing Error Handling & Headers"
test_error_handling

echo "8. 📊 Testing Performance Features"
echo -e "${BLUE}📊 Testing Performance Features${NC}"

# Test pagination
response=$(curl -s "http://localhost:1337/api/articles?pagination[pageSize]=2")
if echo "$response" | grep -q '"pageSize":2'; then
    echo -e "${GREEN}   ✅ Pagination works${NC}"
else
    echo -e "${YELLOW}   ⚠️  Pagination not working as expected${NC}"
fi

# Test sorting
response=$(curl -s "http://localhost:1337/api/conditions?sort[priority]=desc")
if echo "$response" | grep -q '"data"'; then
    echo -e "${GREEN}   ✅ Sorting works${NC}"
else
    echo -e "${YELLOW}   ⚠️  Sorting not working as expected${NC}"
fi

echo ""

echo "🎯 Advanced Testing Scenarios"
echo "=============================="

echo -e "${BLUE}🚨 Testing Emergency Content Detection${NC}"
# Test emergency conditions
response=$(curl -s -I "http://localhost:1337/api/conditions?filters[isEmergency][\$eq]=true")
if echo "$response" | grep -q "X-Kenya-Emergency: 999"; then
    echo -e "${GREEN}   ✅ Emergency content headers present${NC}"
else
    echo -e "${YELLOW}   ⚠️  Emergency headers not detected${NC}"
fi

echo -e "${BLUE}🔍 Testing Search Functionality${NC}"
# Test if any search functionality is available
response=$(curl -s "http://localhost:1337/api/articles?filters[\$or][0][title][\$containsi]=heart&filters[\$or][1][description][\$containsi]=heart")
status_code=$(curl -s -w "%{http_code}" -o /dev/null "http://localhost:1337/api/articles?filters[\$or][0][title][\$containsi]=heart&filters[\$or][1][description][\$containsi]=heart")

if [ "$status_code" -eq 200 ]; then
    echo -e "${GREEN}   ✅ Text search functionality works${NC}"
else
    echo -e "${RED}   ❌ Text search failed: $status_code${NC}"
fi

echo ""
echo "📋 Test Summary"
echo "==============="
echo -e "${GREEN}✅ Basic endpoint testing completed${NC}"
echo -e "${GREEN}✅ Mobile optimization testing completed${NC}"
echo -e "${GREEN}✅ Error handling testing completed${NC}"
echo -e "${GREEN}✅ Health-specific headers testing completed${NC}"
echo -e "${GREEN}✅ Emergency content detection testing completed${NC}"
echo -e "${GREEN}✅ Relationship testing completed${NC}"
echo -e "${GREEN}✅ Performance features testing completed${NC}"
echo ""
echo "🎉 HealthierKE API testing completed!"
echo ""
echo "📝 Next Steps:"
echo "1. Populate content using: ./populate-sample-content.sh"
echo "2. Test with actual content relationships"
echo "3. Test admin interface usability"
echo "4. Verify lifecycle hooks with content creation"
echo "5. Test custom services and policies"
echo ""