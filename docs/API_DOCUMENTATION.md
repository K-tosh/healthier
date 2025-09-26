# 📚 HealthierKE API Documentation

## 🏥 Overview

HealthierKE provides comprehensive health information APIs specifically designed for Kenya's healthcare ecosystem. All endpoints are optimized for mobile-first usage and include Kenya-specific health guidance.

## 🌐 Base URL
```
Production: https://api.healthierke.com
Development: http://localhost:1337/api
```

## 🔑 Authentication
- **Public Endpoints**: No authentication required for reading health content
- **Admin Operations**: JWT token required for content management

## 📋 Content Types

### 🩺 Health Topics
**Endpoint**: `/health-topics`
**Description**: Main health categories organizing related conditions and articles

```javascript
// GET /api/health-topics
{
  "data": [
    {
      "id": "clx1234567890",
      "name": "Infectious Diseases in Kenya", 
      "slug": "infectious-diseases-kenya",
      "description": "Information about infectious diseases common in Kenya...",
      "isActive": true,
      "priority": 100,
      "icon": "/uploads/infectious_diseases_icon.png",
      "conditionCount": 4,
      "articleCount": 6,
      "publishedAt": "2024-01-15T10:00:00.000Z"
    }
  ]
}
```

**Available Filters**:
- `?filters[isActive][$eq]=true` - Active topics only
- `?sort[priority]=desc` - Sort by priority
- `?populate=*` - Include related conditions and articles

### 🩺 Conditions
**Endpoint**: `/conditions`  
**Description**: Health conditions with Kenya-specific prevalence data

```javascript
// GET /api/conditions
{
  "data": [
    {
      "id": "clx1234567891",
      "name": "Malaria",
      "slug": "malaria", 
      "description": "A mosquito-borne infectious disease common in Kenya",
      "severity": "moderate",
      "isEmergency": false,
      "color": "#E53E3E",
      "priority": 100,
      "prevalenceInKenya": "Very common, especially in western and coastal regions",
      "icon": "/uploads/malaria_icon_small.png",
      "articleCount": 2,
      "urgencyLevel": "moderate",
      "isCommonInKenya": true,
      "publishedAt": "2024-01-15T10:00:00.000Z"
    }
  ]
}
```

**Available Filters**:
- `?filters[isEmergency][$eq]=true` - Emergency conditions only
- `?filters[severity][$eq]=critical` - Filter by severity level
- `?filters[prevalenceInKenya][$null]=false` - Conditions with Kenya data
- `?populate[articles]=*` - Include related articles

**Emergency Response**: Conditions marked with `isEmergency: true` trigger:
- `X-Kenya-Emergency: 999` header
- Emergency guidance in API responses

### 📄 Articles  
**Endpoint**: `/articles`
**Description**: Enhanced health articles with medical review tracking

```javascript
// GET /api/articles
{
  "data": [
    {
      "id": "clx1234567892",
      "title": "Malaria in Kenya: What You Should Know",
      "slug": "malaria-kenya-guide",
      "description": "A comprehensive guide to understanding malaria in Kenya...",
      "articleType": "overview",
      "readingTime": 8,
      "priority": 100, 
      "medicallyReviewed": true,
      "healthDisclaimer": true,
      "targetAudience": "general_public",
      "isEmergencyContent": false,
      "requiresDisclaimer": true,
      "relatedConditions": [
        {
          "id": "clx1234567891",
          "name": "Malaria",
          "severity": "moderate",
          "isEmergency": false
        }
      ],
      "publishedAt": "2024-01-15T10:00:00.000Z"
    }
  ]
}
```

**Available Filters**:
- `?filters[articleType][$eq]=emergency` - Emergency articles only
- `?filters[medicallyReviewed][$eq]=true` - Medically reviewed articles
- `?filters[targetAudience][$eq]=healthcare_workers` - Filter by audience
- `?populate[relatedConditions]=*` - Include related conditions

**Article Types**:
- `overview` - General condition overviews
- `symptoms` - Symptom identification guides  
- `treatment` - Treatment information
- `prevention` - Prevention strategies
- `emergency` - Emergency response guides
- `lifestyle` - Lifestyle recommendations
- `general` - General health information

### 🔍 Symptoms
**Endpoint**: `/symptoms`
**Description**: Individual symptoms with care urgency guidance

```javascript
// GET /api/symptoms  
{
  "data": [
    {
      "id": "clx1234567893",
      "name": "Persistent Fever",
      "slug": "persistent-fever",
      "description": "Body temperature higher than normal lasting more than 3 days...",
      "commonSeverity": "moderate",
      "bodySystem": "general", 
      "whenToSeekCare": "urgent",
      "commonInKenya": true,
      "urgencyLevel": "urgent",
      "isRelevantToKenya": true,
      "emergencyNumber": null,
      "relatedConditions": [
        {
          "id": "clx1234567891", 
          "name": "Malaria",
          "isEmergency": false
        }
      ],
      "publishedAt": "2024-01-15T10:00:00.000Z"
    }
  ]
}
```

**Available Filters**:
- `?filters[whenToSeekCare][$eq]=emergency` - Emergency symptoms
- `?filters[commonInKenya][$eq]=true` - Kenya-common symptoms
- `?filters[bodySystem][$eq]=respiratory` - Filter by body system

**Body Systems**:
- `cardiovascular`, `respiratory`, `digestive`, `nervous`
- `musculoskeletal`, `endocrine`, `immune`, `reproductive`
- `urinary`, `integumentary`, `general`

**Care Urgency Levels**:
- `self_care` - Can be managed at home
- `routine_checkup` - See doctor when convenient
- `urgent` - See doctor within 24 hours
- `emergency` - Seek immediate medical attention (999)

### 💊 Treatments
**Endpoint**: `/treatments`
**Description**: Treatment options with Kenya availability and cost info

```javascript
// GET /api/treatments
{
  "data": [
    {
      "id": "clx1234567894",
      "name": "Antimalarial Medication",
      "slug": "antimalarial-medication", 
      "description": "Medications to treat and prevent malaria infections...",
      "type": "medication",
      "estimatedCost": "low",
      "availableInKenya": true,
      "requiresPrescription": true,
      "conditionCount": 1,
      "accessibilityInKenya": "accessible",
      "isAffordable": true,
      "publishedAt": "2024-01-15T10:00:00.000Z"
    }
  ]
}
```

**Available Filters**:
- `?filters[availableInKenya][$eq]=true` - Kenya-available treatments
- `?filters[estimatedCost][$eq]=low` - Filter by cost level
- `?filters[requiresPrescription][$eq]=false` - Over-the-counter options
- `?filters[type][$eq]=medication` - Filter by treatment type

**Treatment Types**:
- `medication` - Pharmaceutical treatments
- `lifestyle` - Lifestyle modifications
- `surgical` - Surgical procedures
- `therapy` - Therapeutic interventions  
- `alternative` - Alternative medicine
- `emergency` - Emergency treatments

**Cost Estimates**:
- `low` - Affordable for most Kenyans
- `moderate` - Middle-income accessible
- `high` - Expensive treatment option
- `varies` - Cost depends on specific case

## 🇰🇪 Kenya-Specific Features

### Emergency Integration
All health content includes Kenya emergency contacts:
```javascript
"kenyaHealthMetadata": {
  "emergencyNumber": "999",
  "healthMinistryContact": "+254-20-2717077", 
  "isRelevantToKenya": true,
  "emergencyServices": {
    "ambulance": "999",
    "police": "999", 
    "fire": "999",
    "healthHotline": "719"
  }
}
```

### Mobile Optimization
Add `?mobile=true` or use mobile User-Agent for:
- Reduced response sizes
- Optimized image formats
- Compressed content descriptions

### Kenya Health Headers
All responses include:
- `X-Health-Content: true`
- `X-Medical-Disclaimer: This content is for informational purposes only...`
- `X-Kenya-Emergency: 999` (for emergency content)

## 🔍 Advanced Querying

### Relationship Queries
```javascript
// Get articles with their related conditions
GET /api/articles?populate[relatedConditions][populate]=*

// Get conditions with their related articles and symptoms
GET /api/conditions?populate[articles]=*&populate[symptoms]=*

// Get health topics with full relationship tree
GET /api/health-topics?populate[relatedConditions][populate][articles]=*
```

### Complex Filtering
```javascript
// Emergency conditions in Kenya  
GET /api/conditions?filters[isEmergency][$eq]=true&filters[prevalenceInKenya][$null]=false

// Low-cost treatments available in Kenya
GET /api/treatments?filters[availableInKenya][$eq]=true&filters[estimatedCost][$in][0]=low&filters[estimatedCost][$in][1]=moderate

// Medical articles for healthcare workers
GET /api/articles?filters[medicallyReviewed][$eq]=true&filters[targetAudience][$eq]=healthcare_workers
```

### Search Functionality
```javascript
// Text search across articles
GET /api/articles?filters[$or][0][title][$containsi]=malaria&filters[$or][1][description][$containsi]=malaria

// Find symptoms by body system with emergency priority
GET /api/symptoms?filters[bodySystem][$eq]=cardiovascular&sort[whenToSeekCare]=desc
```

## 📱 Mobile-First Considerations

### Response Size Optimization
- List views exclude heavy content fields (`overview`, `blocks`)
- Mobile requests get compressed descriptions (200 char limit)
- Image URLs optimized for mobile formats

### Kenya Network Optimization  
- Responses cached for 15-30 minutes
- Emergency content cached for 5 minutes (more frequent updates)
- Gzip compression enabled
- Minimal JSON structure

### Offline Considerations
- Critical emergency content marked with high priority
- Essential Kenya emergency contacts always included
- Graceful degradation for network issues

## 🔧 Error Handling

### Standard Error Response
```javascript
{
  "data": null,
  "error": {
    "status": 404,
    "name": "HealthContentNotFoundError", 
    "message": "The requested health information could not be found.",
    "details": {
      "code": "HEALTH_CONTENT_NOT_FOUND",
      "suggestion": "Try browsing our health topics or use the search function"
    },
    "emergencyGuidance": {
      "message": "If this is a medical emergency, call 999 immediately",
      "contacts": {
        "emergency": "999",
        "healthHotline": "719", 
        "poisonControl": "+254-20-2642660"
      }
    }
  }
}
```

### Error Codes
- `HEALTH_CONTENT_NOT_FOUND` (404)
- `HEALTH_CONTENT_INVALID` (400) 
- `HEALTH_RATE_LIMIT_EXCEEDED` (429)
- `HEALTH_SERVICE_ERROR` (500)

## 📊 Rate Limits

- **Search requests**: 100/15 minutes
- **Content requests**: 300/15 minutes  
- **Emergency content**: 1000/15 minutes (higher limit)

## 🔒 Security & Compliance

### Medical Disclaimer
All health content responses include medical disclaimers:
- Content is for informational purposes only
- Should not replace professional medical advice
- Emergency situations require immediate medical attention

### Data Privacy
- No personal health information stored
- Public health information only
- GDPR and Kenya Data Protection Act compliant

## 📈 Performance Metrics

### Response Times (Target)
- Simple queries: <200ms
- Complex relationship queries: <500ms
- Search operations: <800ms
- Emergency content: <100ms (priority)

### Availability
- 99.9% uptime target
- Health content always cached
- Emergency endpoints prioritized

---

## 🆘 Emergency Content Priority

Content marked as emergency (`isEmergency: true` or `articleType: "emergency"`) receives:
- Highest cache priority  
- Fastest response times
- Kenya emergency contact integration
- Special error handling with immediate guidance

Remember: **For actual medical emergencies, always call 999 immediately!**