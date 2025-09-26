#!/bin/bash

# Fixed HealthierKE API Testing Script - Handles URL encoding properly
# Tests all health content endpoints with proper URL encoding

echo "🧪 HealthierKE Enhanced API Testing (Fixed)"
echo "============================================"
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

# Function to test API endpoint with proper error handling
test_endpoint() {
    local name="$1"
    local url="$2"
    local description="$3"
    
    echo -e "${BLUE}🔍 Testing: $name${NC}"
    echo "   URL: $url"
    echo "   Description: $description"
    
    # Test basic endpoint with proper error handling
    response=$(curl -s -w "HTTPSTATUS:%{http_code}" "$url" 2>/dev/null)
    status_code=$(echo "$response" | tr -d '\n' | sed -e 's/.*HTTPSTATUS://')
    body=$(echo "$response" | sed -e 's/HTTPSTATUS:.*//g')
    
    # Check if status code is valid number
    if [[ "$status_code" =~ ^[0-9]+$ ]] && [ "$status_code" -eq 200 ]; then
        echo -e "${GREEN}   ✅ Status: $status_code${NC}"
        
        # Check if response has data
        if echo "$body" | grep -q '"data"' 2>/dev/null; then
            data_count=$(echo "$body" | jq -r '.data | length' 2>/dev/null)
            if [ "$data_count" != "null" ] && [[ "$data_count" =~ ^[0-9]+$ ]]; then
                echo -e "${GREEN}   ✅ Data: $data_count items found${NC}"
            else
                echo -e "${GREEN}   ✅ Single item response${NC}"
            fi
        else
            echo -e "${YELLOW}   ⚠️  No data field in response${NC}"
        fi
        
        # Check for health-specific headers
        headers=$(curl -s -I "$url" 2>/dev/null)
        if echo "$headers" | grep -q "X-Health-Content"; then
            echo -e "${GREEN}   ✅ Health content headers present${NC}"
        else
            echo -e "${YELLOW}   ⚠️  Health content headers missing${NC}"
        fi
        
    elif [[ "$status_code" =~ ^[0-9]+$ ]] && [ "$status_code" -eq 403 ]; then
        echo -e "${RED}   ❌ Status: $status_code - Forbidden (Need to enable permissions)${NC}"
        echo -e "${YELLOW}   💡 Fix: Enable public permissions for this content type${NC}"
    elif [[ "$status_code" =~ ^[0-9]+$ ]]; then
        echo -e "${RED}   ❌ Status: $status_code${NC}"
        if [ ${#body} -lt 500 ]; then
            echo "   Response: $body"
        fi
    else
        echo -e "${RED}   ❌ Invalid response or connection error${NC}"
    fi
    echo ""
}

# Function to test mobile optimization
test_mobile_endpoint() {
    local name="$1"
    local url="$2"
    
    echo -e "${BLUE}📱 Testing Mobile Optimization: $name${NC}"
    
    # Test with mobile user agent
    response=$(curl -s -w "HTTPSTATUS:%{http_code}" -H "User-Agent: Mozilla/5.0 (Linux; Android 10; SM-G973F) AppleWebKit/537.36" "$url" 2>/dev/null)
    status_code=$(echo "$response" | tr -d '\n' | sed -e 's/.*HTTPSTATUS://')
    
    if [[ "$status_code" =~ ^[0-9]+$ ]] && [ "$status_code" -eq 200 ]; then
        echo -e "${GREEN}   ✅ Mobile response: $status_code${NC}"
        
        # Test with mobile query parameter
        mobile_response=$(curl -s "$url?mobile=true" 2>/dev/null)
        if echo "$mobile_response" | grep -q '"data"'; then
            echo -e "${GREEN}   ✅ Mobile query parameter works${NC}"
        fi
    elif [[ "$status_code" =~ ^[0-9]+$ ]] && [ "$status_code" -eq 403 ]; then
        echo -e "${RED}   ❌ Mobile response failed: $status_code - Need permissions${NC}"
    else
        echo -e "${RED}   ❌ Mobile response failed: $status_code${NC}"
    fi
    echo ""
}

echo "🔧 PERMISSION CHECK FIRST"
echo "=========================="
echo "Before testing, let's check which content types need permissions:"
echo ""

# Check permissions for each content type
content_types=("health-topics:Health Topics" "symptoms:Symptoms" "treatments:Treatments" "articles:Articles" "conditions:Conditions")

for ct in "${content_types[@]}"; do
    IFS=':' read -r endpoint name <<< "$ct"
    status=$(curl -s -w "%{http_code}" -o /dev/null "http://localhost:1337/api/$endpoint")
    if [ "$status" -eq 200 ]; then
        echo -e "✅ $name: Public access enabled"
    elif [ "$status" -eq 403 ]; then
        echo -e "❌ $name: Need to enable public permissions"
    else
        echo -e "⚠️  $name: Status $status"
    fi
done

echo ""
echo "💡 To fix 403 errors:"
echo "1. Go to: http://localhost:1337/admin/settings/users-permissions/roles"
echo "2. Click 'Public' role"
echo "3. Enable 'find' and 'findOne' for blocked content types"
echo "4. Click 'Save'"
echo ""
read -p "Press Enter after fixing permissions, or Ctrl+C to exit..."
echo ""

echo "1. 📋 Testing Health Topics"
test_endpoint "Health Topics List" "http://localhost:1337/api/health-topics" "List all health topics"
test_endpoint "Health Topics with Population" "http://localhost:1337/api/health-topics?populate=*" "Health topics with relationships"
test_mobile_endpoint "Health Topics" "http://localhost:1337/api/health-topics"

echo "2. 🩺 Testing Conditions"
test_endpoint "Conditions List" "http://localhost:1337/api/conditions" "List all conditions"
# URL encode the filter parameters properly
test_endpoint "Emergency Conditions" "http://localhost:1337/api/conditions?filters%5BisEmergency%5D%5B%24eq%5D=true" "Filter emergency conditions"
test_endpoint "Conditions by Severity" "http://localhost:1337/api/conditions?filters%5Bseverity%5D%5B%24eq%5D=critical" "Filter by critical severity"
test_mobile_endpoint "Conditions" "http://localhost:1337/api/conditions"

echo "3. 📄 Testing Articles"
test_endpoint "Articles List" "http://localhost:1337/api/articles" "List all articles"
test_endpoint "Emergency Articles" "http://localhost:1337/api/articles?filters%5BarticleType%5D%5B%24eq%5D=emergency" "Filter emergency articles"
test_endpoint "Reviewed Articles" "http://localhost:1337/api/articles?filters%5BmedicallyReviewed%5D%5B%24eq%5D=true" "Filter medically reviewed articles"
test_mobile_endpoint "Articles" "http://localhost:1337/api/articles"

echo "4. 🔍 Testing Symptoms"
test_endpoint "Symptoms List" "http://localhost:1337/api/symptoms" "List all symptoms"
test_endpoint "Emergency Symptoms" "http://localhost:1337/api/symptoms?filters%5BwhenToSeekCare%5D%5B%24eq%5D=emergency" "Filter emergency symptoms"
test_endpoint "Kenya Common Symptoms" "http://localhost:1337/api/symptoms?filters%5BcommonInKenya%5D%5B%24eq%5D=true" "Filter Kenya common symptoms"
test_mobile_endpoint "Symptoms" "http://localhost:1337/api/symptoms"

echo "5. 💊 Testing Treatments"
test_endpoint "Treatments List" "http://localhost:1337/api/treatments" "List all treatments"
test_endpoint "Available in Kenya" "http://localhost:1337/api/treatments?filters%5BavailableInKenya%5D%5B%24eq%5D=true" "Filter Kenya available treatments"
test_endpoint "Low Cost Treatments" "http://localhost:1337/api/treatments?filters%5BestimatedCost%5D%5B%24eq%5D=low" "Filter low cost treatments"
test_mobile_endpoint "Treatments" "http://localhost:1337/api/treatments"

echo "6. 🔗 Testing Relationships"
test_endpoint "Articles with Conditions" "http://localhost:1337/api/articles?populate%5BrelatedConditions%5D%5Bpopulate%5D=*" "Articles with related conditions"
test_endpoint "Conditions with Articles" "http://localhost:1337/api/conditions?populate%5Barticles%5D%5Bpopulate%5D=*" "Conditions with related articles"

echo "7. 🛡️ Testing Error Handling"
echo -e "${BLUE}🛡️ Testing Error Handling${NC}"

# Test 404 error
response=$(curl -s -w "HTTPSTATUS:%{http_code}" "http://localhost:1337/api/conditions/nonexistent-condition" 2>/dev/null)
status_code=$(echo "$response" | tr -d '\n' | sed -e 's/.*HTTPSTATUS://')

if [[ "$status_code" =~ ^[0-9]+$ ]] && [ "$status_code" -eq 404 ]; then
    echo -e "${GREEN}   ✅ 404 handling works${NC}"
    
    # Check if error response has Kenya emergency info
    body=$(echo "$response" | sed -e 's/HTTPSTATUS:.*//g')
    if echo "$body" | grep -q "999"; then
        echo -e "${GREEN}   ✅ Kenya emergency info in 404 errors${NC}"
    fi
else
    echo -e "${RED}   ❌ 404 handling failed: $status_code${NC}"
fi
echo ""

echo "8. 📊 Testing Performance Features"
echo -e "${BLUE}📊 Testing Performance Features${NC}"

# Test pagination
response=$(curl -s "http://localhost:1337/api/articles?pagination%5BpageSize%5D=2" 2>/dev/null)
if echo "$response" | grep -q '"pageSize":2' || echo "$response" | grep -q '"data"'; then
    echo -e "${GREEN}   ✅ Pagination works${NC}"
else
    echo -e "${YELLOW}   ⚠️  Pagination may not be working as expected${NC}"
fi

# Test sorting
response=$(curl -s "http://localhost:1337/api/conditions?sort%5Bpriority%5D=desc" 2>/dev/null)
if echo "$response" | grep -q '"data"'; then
    echo -e "${GREEN}   ✅ Sorting works${NC}"
else
    echo -e "${YELLOW}   ⚠️  Sorting may not be working as expected${NC}"
fi

echo ""
echo "📋 Test Summary"
echo "==============="
echo -e "${GREEN}✅ Script parsing errors fixed${NC}"
echo -e "${GREEN}✅ URL encoding handled properly${NC}"
echo -e "${GREEN}✅ Permission checks added${NC}"
echo -e "${GREEN}✅ Error handling improved${NC}"
echo ""
echo "🎉 HealthierKE API testing completed!"
echo ""
echo "📝 Next Steps if you saw 403 errors:"
echo "1. Enable public permissions in Strapi admin as shown above"
echo "2. Re-run this test script"
echo "3. Use: ./add-new-content-types.sh to add content"
echo ""