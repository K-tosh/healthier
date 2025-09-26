# 🔧 HealthierKE Maintenance & Operations Guide

## 🎯 Overview

This guide covers ongoing maintenance, monitoring, and operational procedures for the HealthierKE health information platform. Regular maintenance ensures optimal performance, data accuracy, and system reliability.

## 📊 Health Content Audit Procedures

### Monthly Health Content Audit

#### Content Accuracy Review
1. **Emergency Content Verification** (Priority: Critical)
   ```bash
   # Check emergency content status
   curl "http://localhost:1337/api/conditions?filters[isEmergency][$eq]=true" | jq '.data[] | {name, priority, updatedAt}'
   ```
   - Verify all emergency conditions are up-to-date
   - Check emergency contact information (999, 719)
   - Validate emergency procedures match current protocols

2. **Medical Review Status Check**
   ```bash
   # Find content needing medical review  
   curl "http://localhost:1337/api/articles?filters[medicallyReviewed][$eq]=false" | jq '.data | length'
   ```
   - Identify unreviewed medical content
   - Prioritize high-traffic content for review
   - Schedule reviews with medical professionals

3. **Kenya-Specific Data Validation**
   ```bash
   # Check Kenya prevalence data completeness
   curl "http://localhost:1337/api/conditions?filters[prevalenceInKenya][$null]=true" | jq '.data[] | {name, slug}'
   ```
   - Update local epidemiological data
   - Verify treatment availability in Kenya
   - Check cost estimates against current market prices

#### Content Freshness Monitoring
```javascript
// Check content age and flag for review
const sixMonthsAgo = new Date();
sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

// Articles older than 6 months
GET /api/articles?filters[lastMedicalUpdate][$lt]=${sixMonthsAgo.toISOString()}

// High-priority conditions older than 3 months  
GET /api/conditions?filters[updatedAt][$lt]=${threeMonthsAgo.toISOString()}&filters[priority][$gte]=90
```

### Quarterly Medical Content Review

#### Complete Content Inventory
1. **Generate Content Report**
   ```bash
   # Run comprehensive content audit
   ./scripts/content-audit.sh
   ```

2. **Medical Professional Review Schedule**
   - **Q1**: Infectious diseases and emergency content
   - **Q2**: Non-communicable diseases and treatments
   - **Q3**: Women's health and reproductive health
   - **Q4**: Mental health and preventive care

3. **Kenya Health Ministry Guidelines Alignment**
   - Compare content with latest MoH guidelines
   - Update treatment protocols as needed
   - Verify emergency procedures

### Annual Health Content Refresh

#### Complete Platform Audit
1. **Content Gap Analysis**
   - Identify missing health topics
   - Assess content coverage vs. Kenya health priorities
   - Plan content creation for identified gaps

2. **Epidemiological Data Update**
   - Update disease prevalence statistics
   - Refresh treatment availability data
   - Update cost estimates based on current market

3. **Technology Stack Review**
   - Update Strapi and dependencies
   - Review API performance benchmarks
   - Assess mobile optimization effectiveness

## 🏥 Medical Content Freshness Monitoring

### Automated Monitoring Setup

#### Content Age Alerts
```javascript
// Set up monitoring for content that needs review
const monitoringRules = {
  emergencyContent: {
    maxAge: 90, // 3 months
    priority: 'critical'
  },
  medicalArticles: {
    maxAge: 180, // 6 months  
    priority: 'high'
  },
  treatmentInfo: {
    maxAge: 365, // 1 year
    priority: 'medium'
  }
};
```

#### Review Date Tracking
```bash
# Weekly script to check review dates
#!/bin/bash

# Check for content approaching review date
THIRTY_DAYS_FROM_NOW=$(date -d "+30 days" +%Y-%m-%d)

echo "Content needing review in next 30 days:"
curl -s "http://localhost:1337/api/articles?filters[reviewDate][$lt]=${THIRTY_DAYS_FROM_NOW}&filters[medicallyReviewed][$eq]=true" | \
jq -r '.data[] | "\(.title) - Review due: \(.reviewDate)"'
```

### Manual Review Triggers
- **Immediate Review**: New WHO guidelines, Kenya MoH updates
- **Priority Review**: User reports, medical professional feedback
- **Scheduled Review**: Based on content age and importance

## 🔄 Automated Health Content Backups

### Database Backup Strategy

#### Daily Automated Backups
```bash
#!/bin/bash
# daily-backup.sh

DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/backups/healthierke"
DB_FILE="/path/to/strapi/.tmp/data.db"

# Create backup with timestamp
mkdir -p "$BACKUP_DIR/daily"
cp "$DB_FILE" "$BACKUP_DIR/daily/data_${DATE}.db"

# Compress older backups (keep 7 days uncompressed)
find "$BACKUP_DIR/daily" -name "*.db" -mtime +7 -exec gzip {} \;

# Remove backups older than 30 days
find "$BACKUP_DIR/daily" -name "*.gz" -mtime +30 -delete

echo "Daily backup completed: data_${DATE}.db"
```

#### Weekly Content Export
```bash
#!/bin/bash
# weekly-content-export.sh

DATE=$(date +%Y%m%d)
EXPORT_DIR="/backups/healthierke/exports"

mkdir -p "$EXPORT_DIR"

# Export all health content as JSON
curl "http://localhost:1337/api/health-topics?populate=*&pagination[pageSize]=100" > "$EXPORT_DIR/health-topics_${DATE}.json"
curl "http://localhost:1337/api/conditions?populate=*&pagination[pageSize]=100" > "$EXPORT_DIR/conditions_${DATE}.json"
curl "http://localhost:1337/api/articles?populate=*&pagination[pageSize]=100" > "$EXPORT_DIR/articles_${DATE}.json"
curl "http://localhost:1337/api/symptoms?populate=*&pagination[pageSize]=100" > "$EXPORT_DIR/symptoms_${DATE}.json"
curl "http://localhost:1337/api/treatments?populate=*&pagination[pageSize]=100" > "$EXPORT_DIR/treatments_${DATE}.json"

# Create compressed archive
tar -czf "$EXPORT_DIR/healthierke_content_${DATE}.tar.gz" "$EXPORT_DIR"/*_${DATE}.json

# Clean up individual files
rm "$EXPORT_DIR"/*_${DATE}.json

echo "Weekly content export completed: healthierke_content_${DATE}.tar.gz"
```

#### Critical Content Mirror
```bash
#!/bin/bash
# emergency-content-mirror.sh

# Keep live mirror of critical emergency content
MIRROR_DIR="/emergency-mirror"

# Emergency conditions
curl "http://localhost:1337/api/conditions?filters[isEmergency][$eq]=true&populate=*" > "$MIRROR_DIR/emergency-conditions.json"

# Emergency articles  
curl "http://localhost:1337/api/articles?filters[articleType][$eq]=emergency&populate=*" > "$MIRROR_DIR/emergency-articles.json"

# Emergency symptoms
curl "http://localhost:1337/api/symptoms?filters[whenToSeekCare][$eq]=emergency&populate=*" > "$MIRROR_DIR/emergency-symptoms.json"

echo "Emergency content mirror updated: $(date)"
```

### Backup Restoration Procedures

#### Database Restoration
```bash
#!/bin/bash
# restore-database.sh

BACKUP_FILE="$1"
DB_PATH="/path/to/strapi/.tmp/data.db"

if [ -z "$BACKUP_FILE" ]; then
    echo "Usage: $0 <backup-file>"
    exit 1
fi

# Stop Strapi
systemctl stop strapi

# Backup current database
cp "$DB_PATH" "${DB_PATH}.backup-$(date +%Y%m%d_%H%M%S)"

# Restore from backup
cp "$BACKUP_FILE" "$DB_PATH"

# Start Strapi
systemctl start strapi

echo "Database restored from: $BACKUP_FILE"
```

#### Content Import Procedures
```bash
#!/bin/bash
# import-content.sh

CONTENT_FILE="$1"

if [ -z "$CONTENT_FILE" ]; then
    echo "Usage: $0 <content-export-file.tar.gz>"
    exit 1
fi

# Extract content
TEMP_DIR="/tmp/content-restore"
mkdir -p "$TEMP_DIR"
tar -xzf "$CONTENT_FILE" -C "$TEMP_DIR"

# Import content via API
# Note: This requires careful handling of relationships
echo "Content import from: $CONTENT_FILE"
echo "Manual verification required after import"
```

## 📈 Health Content Analytics & Reporting

### Performance Monitoring

#### API Response Time Monitoring
```javascript
// Monitor health content API performance
const performanceThresholds = {
  emergency: 100,    // Emergency content must load in <100ms
  standard: 500,     // Standard content <500ms
  search: 1000       // Search operations <1000ms
};

// Weekly performance report
async function generatePerformanceReport() {
  const endpoints = [
    '/api/conditions',
    '/api/articles', 
    '/api/symptoms',
    '/api/treatments',
    '/api/health-topics'
  ];
  
  for (const endpoint of endpoints) {
    const startTime = Date.now();
    await fetch(`http://localhost:1337${endpoint}`);
    const responseTime = Date.now() - startTime;
    
    console.log(`${endpoint}: ${responseTime}ms`);
  }
}
```

#### Usage Analytics
```bash
#!/bin/bash
# usage-analytics.sh

# Most accessed health content
echo "Top 10 accessed conditions:"
grep "GET /api/conditions" /var/log/nginx/access.log | \
awk '{print $7}' | sort | uniq -c | sort -nr | head -10

echo "Emergency content access patterns:"
grep "X-Kenya-Emergency" /var/log/nginx/access.log | \
awk '{print $4}' | cut -d: -f1 | sort | uniq -c

echo "Mobile vs Desktop usage:"
grep "Mobile" /var/log/nginx/access.log | wc -l
grep -v "Mobile" /var/log/nginx/access.log | wc -l
```

### Content Quality Metrics

#### Medical Review Coverage
```javascript
// Calculate medical review coverage
async function calculateReviewCoverage() {
  const totalArticles = await strapi.db.query('api::article.article').count();
  const reviewedArticles = await strapi.db.query('api::article.article').count({
    where: { medicallyReviewed: true }
  });
  
  const coverage = (reviewedArticles / totalArticles) * 100;
  console.log(`Medical review coverage: ${coverage.toFixed(1)}%`);
  
  return coverage;
}
```

#### Content Freshness Score
```javascript
// Calculate content freshness
async function calculateContentFreshness() {
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
  
  const recentContent = await strapi.db.query('api::article.article').count({
    where: { 
      lastMedicalUpdate: { $gte: sixMonthsAgo }
    }
  });
  
  const totalContent = await strapi.db.query('api::article.article').count();
  
  const freshness = (recentContent / totalContent) * 100;
  console.log(`Content freshness score: ${freshness.toFixed(1)}%`);
  
  return freshness;
}
```

### Monthly Operations Report

#### Automated Report Generation
```bash
#!/bin/bash
# monthly-report.sh

DATE=$(date +%Y-%m)
REPORT_FILE="/reports/healthierke_report_${DATE}.md"

cat > "$REPORT_FILE" << EOF
# HealthierKE Monthly Operations Report - $(date +"%B %Y")

## Content Statistics
- Total Articles: $(curl -s "http://localhost:1337/api/articles" | jq '.meta.pagination.total')
- Total Conditions: $(curl -s "http://localhost:1337/api/conditions" | jq '.meta.pagination.total')  
- Total Symptoms: $(curl -s "http://localhost:1337/api/symptoms" | jq '.meta.pagination.total')
- Total Treatments: $(curl -s "http://localhost:1337/api/treatments" | jq '.meta.pagination.total')

## Medical Review Status
- Reviewed Articles: $(curl -s "http://localhost:1337/api/articles?filters[medicallyReviewed][\$eq]=true" | jq '.meta.pagination.total')
- Pending Review: $(curl -s "http://localhost:1337/api/articles?filters[medicallyReviewed][\$eq]=false" | jq '.meta.pagination.total')

## Emergency Content
- Emergency Conditions: $(curl -s "http://localhost:1337/api/conditions?filters[isEmergency][\$eq]=true" | jq '.meta.pagination.total')
- Emergency Articles: $(curl -s "http://localhost:1337/api/articles?filters[articleType][\$eq]=emergency" | jq '.meta.pagination.total')

## Kenya-Specific Content
- Conditions with Kenya Data: $(curl -s "http://localhost:1337/api/conditions?filters[prevalenceInKenya][\$null]=false" | jq '.meta.pagination.total')
- Kenya-Available Treatments: $(curl -s "http://localhost:1337/api/treatments?filters[availableInKenya][\$eq]=true" | jq '.meta.pagination.total')

## System Health
- Database Size: $(du -h /path/to/strapi/.tmp/data.db | cut -f1)
- Last Backup: $(ls -la /backups/healthierke/daily/*.db | tail -1 | awk '{print $6, $7, $8}')
- Uptime: $(uptime | awk -F'up ' '{print $2}' | awk -F', ' '{print $1}')

## Action Items
- [ ] Review content flagged for medical update
- [ ] Update Kenya treatment availability data  
- [ ] Verify emergency contact information
- [ ] Check performance against SLA targets

---
Generated on: $(date)
EOF

echo "Monthly report generated: $REPORT_FILE"
```

## 🚨 Emergency Procedures

### Content Emergency Response

#### Critical Content Update Protocol
1. **Immediate Assessment**
   - Identify scope of required update
   - Determine if emergency content is affected
   - Assess potential impact on public health

2. **Fast-Track Review Process**  
   - Contact on-call medical reviewer
   - Expedite content review (target: 2 hours)
   - Bypass normal review workflow for critical updates

3. **Emergency Deployment**
   ```bash
   # Emergency content update
   ./scripts/emergency-deploy.sh
   ```

4. **Notification Protocol**
   - Alert all stakeholders
   - Update status page
   - Monitor access patterns
   - Document incident response

#### System Recovery Procedures

##### Database Corruption Recovery
```bash
#!/bin/bash
# database-recovery.sh

# 1. Stop Strapi immediately
systemctl stop strapi

# 2. Assess database integrity
sqlite3 /path/to/data.db "PRAGMA integrity_check;"

# 3. Restore from most recent backup
LATEST_BACKUP=$(ls -t /backups/healthierke/daily/*.db | head -1)
cp "$LATEST_BACKUP" /path/to/strapi/.tmp/data.db

# 4. Restart Strapi
systemctl start strapi

# 5. Verify critical content accessibility
curl -f "http://localhost:1337/api/conditions?filters[isEmergency][\$eq]=true" || echo "CRITICAL: Emergency content not accessible"
```

##### Service Outage Response
```bash
#!/bin/bash
# outage-response.sh

# 1. Activate emergency content mirror
cp /emergency-mirror/* /var/www/emergency-health/

# 2. Update DNS to point to static emergency content
# (Manual step - contact DNS provider)

# 3. Notify users via status page
curl -X POST "https://status.healthierke.com/api/incidents" \
  -d "title=Service Maintenance&description=Temporary service disruption"

# 4. Begin service restoration
systemctl restart strapi
systemctl restart nginx
```

## 📞 Escalation Procedures

### Contact List
- **Medical Emergency**: Dr. [Name], +254-xxx-xxx-xxx
- **Technical Emergency**: [Tech Lead], +254-xxx-xxx-xxx  
- **Management**: [Project Manager], +254-xxx-xxx-xxx
- **Ministry of Health Liaison**: +254-20-2717077

### Incident Severity Levels
- **Level 1 (Critical)**: Emergency content unavailable, complete service outage
- **Level 2 (High)**: Major functionality impacted, data accuracy issues
- **Level 3 (Medium)**: Performance degradation, minor content issues
- **Level 4 (Low)**: Cosmetic issues, enhancement requests

## 📋 Maintenance Schedule

### Daily Tasks (Automated)
- [ ] Database backup
- [ ] Performance monitoring
- [ ] Error log review
- [ ] Emergency content verification

### Weekly Tasks  
- [ ] Content freshness review
- [ ] Performance report generation
- [ ] User feedback review
- [ ] Security update check

### Monthly Tasks
- [ ] Medical content audit
- [ ] Kenya-specific data validation
- [ ] Comprehensive backup verification
- [ ] Operations report generation

### Quarterly Tasks
- [ ] Complete medical review cycle
- [ ] Technology stack updates
- [ ] Content gap analysis
- [ ] Disaster recovery testing

### Annual Tasks
- [ ] Complete platform audit
- [ ] Medical guidelines alignment
- [ ] Cost estimate updates  
- [ ] Strategic planning review

---

## 📚 Resources

- [Health Content Audit Checklist](./AUDIT_CHECKLIST.md)
- [Emergency Response Playbook](./EMERGENCY_PLAYBOOK.md)  
- [Performance Monitoring Guide](./PERFORMANCE_GUIDE.md)
- [Backup & Recovery Procedures](./BACKUP_PROCEDURES.md)

**Remember: Health content operations directly impact public health. Always prioritize accuracy and availability.** 🏥⚡