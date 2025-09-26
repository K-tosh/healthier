# 👩‍⚕️ HealthierKE Content Management Guide

## 🎯 Overview

This guide helps administrators create, manage, and maintain health content in HealthierKE. All content should be medically accurate, culturally appropriate for Kenya, and follow established medical review processes.

## 🔐 Admin Access

### Login to Admin Panel
1. Navigate to: `http://localhost:1337/admin` (or your production URL)
2. Login with your admin credentials
3. Admin dashboard provides access to all content types

### User Roles
- **Super Admin**: Full access to all content and settings
- **Editor**: Can create and edit health content
- **Medical Reviewer**: Can approve medically reviewed content
- **Contributor**: Can create draft content for review

## 📋 Content Creation Workflow

### 🩺 Health Topics (Main Categories)

**Purpose**: Organize health content into main categories
**Access**: Content Manager → Collection Types → Health Topics

#### Required Fields
- **Name**: Clear, descriptive category name (e.g., "Infectious Diseases in Kenya")
- **Slug**: URL-friendly version (auto-generated)
- **Description**: Brief explanation of the topic category
- **Is Active**: ✅ Enable for public display
- **Priority**: Higher numbers appear first (100 = highest priority)

#### Optional Fields
- **Icon**: Upload relevant medical icon (recommended: 256x256px)
- **Related Conditions**: Link to conditions in this category
- **Featured Articles**: Highlight important articles

#### Best Practices
- Keep names concise but descriptive
- Include "Kenya" in descriptions when relevant
- Use priority to control display order
- Add icons for better user experience

#### Example Health Topics
```
1. "Infectious Diseases in Kenya" (Priority: 100)
   - Description: "Common infectious diseases affecting Kenyan populations"
   
2. "Non-Communicable Diseases" (Priority: 90) 
   - Description: "Chronic diseases like diabetes and hypertension"
   
3. "Women's Health in Kenya" (Priority: 85)
   - Description: "Health issues specific to Kenyan women"
   
4. "Emergency Health Conditions" (Priority: 95)
   - Description: "Critical conditions requiring immediate attention"
```

### 🩺 Conditions

**Purpose**: Individual health conditions with Kenya-specific data
**Access**: Content Manager → Collection Types → Conditions

#### Required Fields
- **Name**: Medical condition name (e.g., "Malaria", "Type 2 Diabetes")
- **Slug**: URL-friendly identifier
- **Description**: Brief, clear explanation (max 500 characters)
- **Severity**: Select from mild, moderate, severe, critical
- **Is Emergency**: ✅ Check if requires immediate medical attention
- **Color**: Hex color for UI theming (default: #3B82F6)
- **Priority**: Display order (higher = more important)

#### Kenya-Specific Fields
- **Prevalence in Kenya**: Local epidemiological data
  - Example: "Very common in western and coastal regions"
  - Example: "Affects approximately 2-3% of Kenyan adults"

#### Optional Fields
- **Overview**: Detailed medical information (rich text)
- **Icon**: Condition-specific image
- **Related Articles**: Link to explanatory articles
- **SEO**: Meta title, description, keywords

#### Medical Review Requirements
- All conditions must be medically accurate
- Include local prevalence data when available
- Emergency conditions require special validation
- Regular review every 12 months

#### Emergency Condition Guidelines
When **Is Emergency** = ✅:
- Include "999" in description or overview
- Add emergency contact information
- Set high priority (90-100)
- Include immediate action steps
- Validate emergency alert component usage

### 📄 Articles (Enhanced)

**Purpose**: Detailed health information with medical review tracking
**Access**: Content Manager → Collection Types → Articles

#### Required Fields
- **Title**: Clear, informative headline
- **Slug**: URL-friendly identifier
- **Description**: Summary for search and social sharing
- **Article Type**: Select appropriate type:
  - `overview` - General condition information
  - `symptoms` - How to identify conditions
  - `treatment` - Treatment options and guidance
  - `prevention` - Preventive measures
  - `emergency` - Emergency response procedures
  - `lifestyle` - Lifestyle recommendations
  - `general` - General health information

#### Medical Review Fields
- **Medically Reviewed**: ✅ Only after medical professional approval
- **Review Date**: When content was medically reviewed
- **Medical Reviewer**: Name and credentials of reviewer
- **Last Medical Update**: Automatically updated when content changes
- **Health Disclaimer**: ✅ Required for medical content

#### Content Fields
- **Content/Blocks**: Main article content using Strapi blocks
- **Reading Time**: Auto-calculated based on content length
- **Target Audience**: 
  - `general_public` - For general readers
  - `healthcare_workers` - For medical professionals
  - `patients` - For people with specific conditions
  - `caregivers` - For family members and caregivers

#### Relationship Fields
- **Related Conditions**: Link to relevant health conditions
- **Category**: Article category (if using legacy system)
- **Authors Bio**: Author information

#### SEO & Publishing
- **Priority**: Display importance (0-100)
- **SEO Component**: Meta title, description, keywords
- **Published At**: Publication timestamp

#### Medical Review Workflow

1. **Draft Creation**
   - Content creators write initial draft
   - Set `Medically Reviewed = false`
   - Add placeholder for medical reviewer

2. **Medical Review Process**
   - Medical professional reviews content
   - Verify accuracy against current medical standards
   - Check Kenya-specific recommendations
   - Validate emergency information (if applicable)

3. **Approval**
   - Set `Medically Reviewed = true`
   - Add `Review Date` (current date)
   - Add `Medical Reviewer` name and credentials
   - Content automatically gets `Last Medical Update` timestamp

4. **Publication**
   - Publish approved content
   - Schedule regular review (every 6-12 months)

#### Emergency Article Requirements
For `Article Type = emergency`:
- Must include Kenya emergency number (999)
- Should include emergency alert component
- Requires medical review before publication
- High priority setting (90-100)
- Clear, actionable instructions
- Include "when to call 999" guidance

### 🔍 Symptoms

**Purpose**: Individual symptoms users can identify
**Access**: Content Manager → Collection Types → Symptoms

#### Required Fields
- **Name**: Symptom name (e.g., "Persistent Fever", "Chest Pain")
- **Slug**: URL identifier
- **Description**: How to identify/recognize symptom
- **Common Severity**: Typical severity level (mild/moderate/severe/emergency)
- **Body System**: Affected system (cardiovascular, respiratory, etc.)
- **When to Seek Care**: Urgency level
  - `self_care` - Manageable at home
  - `routine_checkup` - See doctor when convenient
  - `urgent` - See doctor within 24 hours
  - `emergency` - Call 999 immediately
- **Common in Kenya**: ✅ If frequently seen in Kenyan populations

#### Relationship Fields
- **Related Conditions**: Link to conditions that cause this symptom

#### Kenya-Specific Guidance
- Include local context in descriptions
- Reference culturally appropriate care options
- Consider traditional medicine integration where appropriate
- Include cost considerations for healthcare access

#### Emergency Symptom Protocol
For `When to Seek Care = emergency`:
- Include "Call 999" instruction
- Provide immediate action steps
- Reference nearest healthcare facilities
- Include symptom progression warnings

### 💊 Treatments

**Purpose**: Treatment options with Kenya availability information
**Access**: Content Manager → Collection Types → Treatments

#### Required Fields
- **Name**: Treatment name (e.g., "Antimalarial Medication", "Lifestyle Changes")
- **Slug**: URL identifier
- **Description**: Treatment explanation
- **Type**: Treatment category
  - `medication` - Pharmaceutical treatments
  - `lifestyle` - Behavior/diet changes
  - `surgical` - Surgical procedures
  - `therapy` - Therapeutic interventions
  - `alternative` - Traditional/alternative medicine
  - `emergency` - Emergency treatments

#### Kenya-Specific Fields
- **Available in Kenya**: ✅ If treatment is accessible in Kenya
- **Estimated Cost**: Financial accessibility
  - `low` - Affordable for most Kenyans
  - `moderate` - Middle-income accessible
  - `high` - Expensive option
  - `varies` - Depends on individual case
- **Requires Prescription**: ✅ If prescription needed

#### Detailed Information (Optional)
- **Side Effects**: Potential adverse reactions
- **Contraindications**: When not to use treatment
- **Dosage Information**: Usage guidelines
- **Duration**: Treatment timeline

#### Cost Consideration Guidelines
- **Low Cost**: <1,000 KES or covered by NHIF
- **Moderate Cost**: 1,000-10,000 KES
- **High Cost**: >10,000 KES
- **Varies**: Depends on severity, duration, location

#### Kenya Healthcare Context
- Reference NHIF coverage where applicable
- Include public hospital availability
- Mention county-specific programs
- Consider rural vs. urban access differences

## 🔄 Content Relationships

### Creating Effective Relationships
1. **Articles ↔ Conditions**: Link articles to conditions they discuss
2. **Symptoms ↔ Conditions**: Connect symptoms to causing conditions
3. **Treatments ↔ Conditions**: Associate treatments with treatable conditions
4. **Health Topics ↔ Conditions**: Group conditions into topics

### Relationship Best Practices
- Create bidirectional relationships when possible
- Use relationships for content discovery
- Keep relationships relevant and accurate
- Regular relationship audits

### Example Relationship Map
```
Health Topic: "Infectious Diseases in Kenya"
├── Condition: "Malaria"
│   ├── Article: "Malaria in Kenya: What You Should Know"
│   ├── Symptom: "Persistent Fever"
│   └── Treatment: "Antimalarial Medication"
├── Condition: "Tuberculosis"
│   ├── Article: "TB in Kenya: Still a Threat"
│   ├── Symptom: "Persistent Cough"
│   └── Treatment: "TB Treatment (DOTS)"
```

## ✅ Quality Assurance Checklist

### Before Publishing Any Health Content
- [ ] Medical accuracy verified
- [ ] Kenya-specific information included
- [ ] Emergency contacts included (when relevant)
- [ ] Cost information realistic for Kenya
- [ ] Language appropriate for target audience
- [ ] SEO metadata completed
- [ ] Relationships properly configured
- [ ] Images optimized and accessible
- [ ] Mobile-friendly formatting

### Medical Review Checklist
- [ ] Content reviewed by qualified medical professional
- [ ] Information aligns with current medical standards
- [ ] Kenya-specific guidelines incorporated
- [ ] Emergency procedures match local protocols
- [ ] Reviewer information documented
- [ ] Review date recorded
- [ ] Next review date scheduled

### Emergency Content Extra Checks
- [ ] "999" emergency number prominently featured
- [ ] Clear, actionable steps provided
- [ ] Professional medical advice disclaimer included
- [ ] Time-sensitive information highlighted
- [ ] Alternative contact methods provided

## 🔧 Troubleshooting Common Issues

### Content Not Appearing
1. Check if content is published (`Published At` field)
2. Verify permissions in Settings → Users & Permissions
3. Check if content type is marked as active
4. Ensure required fields are completed

### Relationship Issues
1. Verify both sides of relationship are published
2. Check populate parameters in API calls
3. Ensure proper relationship configuration in content types
4. Clear cache if using caching

### Medical Review Workflow Issues
1. Ensure medical reviewer has appropriate permissions
2. Check if review workflow is properly configured
3. Verify medical reviewer fields are completed
4. Document review process clearly

### Performance Issues
1. Optimize images before upload
2. Use appropriate content structure
3. Implement caching where possible
4. Monitor database query performance

## 📊 Content Analytics & Monitoring

### Key Metrics to Track
- Content views by type
- Emergency content access patterns  
- Mobile vs. desktop usage
- Search query patterns
- Content update frequency

### Regular Maintenance Tasks
- **Weekly**: Review emergency content accuracy
- **Monthly**: Check content performance metrics
- **Quarterly**: Medical review of high-traffic content
- **Annually**: Complete content audit and refresh

### Content Freshness
- Medical content should be reviewed every 6-12 months
- Emergency procedures reviewed every 3 months
- Treatment information updated as new treatments become available
- Kenya-specific data updated with latest epidemiological information

## 🚨 Emergency Content Protocol

### Immediate Response Content
- Must be available within 100ms response time
- Cached with highest priority
- Includes direct emergency contacts
- Provides clear next steps
- Available offline when possible

### Update Procedures for Emergency Content
1. Identify need for emergency content update
2. Fast-track medical review (within 24 hours)
3. Implement changes immediately
4. Notify all stakeholders
5. Monitor access patterns
6. Document changes for audit trail

---

## 📞 Support Contacts

- **Medical Review Team**: medical-review@healthierke.com
- **Technical Support**: tech@healthierke.com
- **Content Questions**: content@healthierke.com
- **Emergency Updates**: emergency@healthierke.com

## 📚 Additional Resources

- [Kenya Ministry of Health Guidelines](https://www.health.go.ke)
- [WHO Africa Health Topics](https://www.afro.who.int)
- [Medical Content Style Guide](./MEDICAL_STYLE_GUIDE.md)
- [SEO Best Practices for Health Content](./SEO_HEALTH_GUIDE.md)

Remember: **Quality health content saves lives. Always prioritize accuracy over speed.** 🏥❤️