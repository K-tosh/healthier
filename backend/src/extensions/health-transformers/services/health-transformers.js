'use strict';

/**
 * Health Content API Transformers
 * Optimize API responses for mobile-first Kenyan users and frontend consumption
 */

module.exports = ({ strapi }) => ({
  /**
   * Transform health content for mobile optimization
   * Reduces response size and adds computed fields
   */
  transformHealthContent(contentType, data, options = {}) {
    if (!data) return null;

    const { 
      includeFull = false, 
      includeRelations = true,
      optimizeForMobile = true 
    } = options;

    switch (contentType) {
      case 'article':
        return this.transformArticle(data, { includeFull, includeRelations, optimizeForMobile });
      case 'condition':
        return this.transformCondition(data, { includeFull, includeRelations, optimizeForMobile });
      case 'symptom':
        return this.transformSymptom(data, { includeFull, includeRelations, optimizeForMobile });
      case 'treatment':
        return this.transformTreatment(data, { includeFull, includeRelations, optimizeForMobile });
      case 'health-topic':
        return this.transformHealthTopic(data, { includeFull, includeRelations, optimizeForMobile });
      default:
        return data;
    }
  },

  /**
   * Transform article for optimized frontend consumption
   */
  transformArticle(article, options = {}) {
    const { includeFull = false, includeRelations = true, optimizeForMobile = true } = options;

    const transformed = {
      id: article.documentId,
      title: article.title,
      slug: article.slug,
      description: article.description,
      articleType: article.articleType,
      readingTime: article.readingTime,
      priority: article.priority,
      medicallyReviewed: article.medicallyReviewed,
      healthDisclaimer: article.healthDisclaimer,
      publishedAt: article.publishedAt,
      createdAt: article.createdAt,
      updatedAt: article.updatedAt
    };

    // Add SEO data if available
    if (article.seo) {
      transformed.seo = {
        metaTitle: article.seo.metaTitle,
        metaDescription: article.seo.metaDescription,
        keywords: article.seo.keywords
      };
    }

    // Include full content only when requested (not for list views)
    if (includeFull) {
      transformed.content = article.content;
      transformed.blocks = article.blocks;
      transformed.reviewDate = article.reviewDate;
      transformed.medicalReviewer = article.medicalReviewer;
      transformed.lastMedicalUpdate = article.lastMedicalUpdate;
    }

    // Include relations if requested
    if (includeRelations && article.relatedConditions) {
      transformed.relatedConditions = article.relatedConditions.map(condition => ({
        id: condition.documentId,
        name: condition.name,
        slug: condition.slug,
        isEmergency: condition.isEmergency,
        color: condition.color
      }));
    }

    // Add computed fields
    transformed.isEmergencyContent = article.articleType === 'emergency';
    transformed.requiresDisclaimer = article.healthDisclaimer;
    transformed.targetAudience = article.targetAudience || 'general_public';

    return transformed;
  },

  /**
   * Transform condition for optimized frontend consumption
   */
  transformCondition(condition, options = {}) {
    const { includeFull = false, includeRelations = true, optimizeForMobile = true } = options;

    const transformed = {
      id: condition.documentId,
      name: condition.name,
      slug: condition.slug,
      description: condition.description,
      isEmergency: condition.isEmergency,
      color: condition.color,
      priority: condition.priority,
      prevalenceInKenya: condition.prevalenceInKenya,
      publishedAt: condition.publishedAt,
      createdAt: condition.createdAt
    };

    // Add icon if available
    if (condition.icon?.formats?.small) {
      transformed.icon = optimizeForMobile 
        ? condition.icon.formats.small.url 
        : condition.icon.url;
    }

    // Include full content only when requested
    if (includeFull) {
      transformed.overview = condition.overview;
    }

    // Include relations if requested and optimize for mobile
    if (includeRelations) {
      if (condition.articles) {
        transformed.articleCount = condition.articles.length;
        if (!optimizeForMobile) {
          transformed.articles = condition.articles.map(article => this.transformArticle(article, { 
            includeFull: false, 
            includeRelations: false, 
            optimizeForMobile 
          }));
        }
      }
    }

    // Add computed fields
    transformed.urgencyLevel = condition.isEmergency ? 'emergency' : 'standard';
    transformed.isCommonInKenya = !!condition.prevalenceInKenya;

    return transformed;
  },

  /**
   * Transform symptom for optimized frontend consumption
   */
  transformSymptom(symptom, options = {}) {
    const { includeFull = false, includeRelations = true, optimizeForMobile = true } = options;

    const transformed = {
      id: symptom.documentId,
      name: symptom.name,
      slug: symptom.slug,
      description: optimizeForMobile && symptom.description?.length > 200 
        ? symptom.description.substring(0, 200) + '...' 
        : symptom.description,
      commonSeverity: symptom.commonSeverity,
      bodySystem: symptom.bodySystem,
      whenToSeekCare: symptom.whenToSeekCare,
      commonInKenya: symptom.commonInKenya,
      publishedAt: symptom.publishedAt
    };

    // Include full content only when requested
    if (includeFull) {
      transformed.description = symptom.description; // Full description
    }

    // Include relations if requested
    if (includeRelations && symptom.relatedConditions) {
      transformed.relatedConditions = symptom.relatedConditions.map(condition => ({
        id: condition.documentId,
        name: condition.name,
        isEmergency: condition.isEmergency
      }));
    }

    // Add computed fields for Kenya context
    transformed.urgencyLevel = this.calculateUrgencyLevel(symptom.whenToSeekCare, symptom.commonSeverity);
    transformed.isRelevantToKenya = symptom.commonInKenya;
    transformed.emergencyNumber = symptom.whenToSeekCare === 'emergency' ? '999' : null;

    return transformed;
  },

  /**
   * Transform treatment for optimized frontend consumption
   */
  transformTreatment(treatment, options = {}) {
    const { includeFull = false, includeRelations = true, optimizeForMobile = true } = options;

    const transformed = {
      id: treatment.documentId,
      name: treatment.name,
      slug: treatment.slug,
      description: optimizeForMobile && treatment.description?.length > 200 
        ? treatment.description.substring(0, 200) + '...' 
        : treatment.description,
      type: treatment.type,
      estimatedCost: treatment.estimatedCost,
      availableInKenya: treatment.availableInKenya,
      requiresPrescription: treatment.requiresPrescription,
      publishedAt: treatment.publishedAt
    };

    // Include full content only when requested
    if (includeFull) {
      transformed.description = treatment.description; // Full description
      transformed.sideEffects = treatment.sideEffects;
      transformed.contraindications = treatment.contraindications;
      transformed.dosageInformation = treatment.dosageInformation;
      transformed.duration = treatment.duration;
    }

    // Include relations if requested
    if (includeRelations && treatment.relatedConditions) {
      transformed.conditionCount = treatment.relatedConditions.length;
      if (!optimizeForMobile) {
        transformed.relatedConditions = treatment.relatedConditions.map(condition => ({
          id: condition.documentId,
          name: condition.name
        }));
      }
    }

    // Add computed fields for Kenya context
    transformed.accessibilityInKenya = this.getAccessibilityLevel(treatment);
    transformed.isAffordable = treatment.estimatedCost === 'low' || treatment.estimatedCost === 'moderate';

    return transformed;
  },

  /**
   * Transform health topic for optimized frontend consumption
   */
  transformHealthTopic(healthTopic, options = {}) {
    const { includeFull = false, includeRelations = true, optimizeForMobile = true } = options;

    const transformed = {
      id: healthTopic.documentId,
      name: healthTopic.name,
      slug: healthTopic.slug,
      description: healthTopic.description,
      isActive: healthTopic.isActive,
      priority: healthTopic.priority,
      publishedAt: healthTopic.publishedAt
    };

    // Add icon if available and optimize for mobile
    if (healthTopic.icon?.formats?.small) {
      transformed.icon = optimizeForMobile 
        ? healthTopic.icon.formats.small.url 
        : healthTopic.icon.url;
    }

    // Include relations if requested
    if (includeRelations) {
      if (healthTopic.relatedConditions) {
        transformed.conditionCount = healthTopic.relatedConditions.length;
        if (!optimizeForMobile && includeFull) {
          transformed.relatedConditions = healthTopic.relatedConditions.map(condition => 
            this.transformCondition(condition, { includeFull: false, includeRelations: false, optimizeForMobile })
          );
        }
      }

      if (healthTopic.featuredArticles) {
        transformed.articleCount = healthTopic.featuredArticles.length;
        if (!optimizeForMobile && includeFull) {
          transformed.featuredArticles = healthTopic.featuredArticles.map(article => 
            this.transformArticle(article, { includeFull: false, includeRelations: false, optimizeForMobile })
          );
        }
      }
    }

    return transformed;
  },

  /**
   * Transform list of content items for mobile optimization
   */
  transformContentList(contentType, items, options = {}) {
    if (!Array.isArray(items)) return [];

    return items.map(item => this.transformHealthContent(contentType, item, {
      ...options,
      includeFull: false, // Never include full content in list views
      optimizeForMobile: true
    }));
  },

  /**
   * Add Kenya-specific health metadata to responses
   */
  addKenyaHealthMetadata(transformedData, originalData) {
    const metadata = {
      emergencyNumber: '999',
      healthMinistryContact: '+254-20-2717077',
      isRelevantToKenya: true
    };

    // Add emergency contact info for emergency content
    if (originalData.isEmergency || originalData.articleType === 'emergency') {
      metadata.emergencyServices = {
        ambulance: '999',
        police: '999',
        fire: '999',
        healthHotline: '719'
      };
    }

    return { ...transformedData, kenyaHealthMetadata: metadata };
  },

  /**
   * Calculate urgency level based on symptom data
   */
  calculateUrgencyLevel(whenToSeekCare, severity) {
    if (whenToSeekCare === 'emergency') return 'emergency';
    if (whenToSeekCare === 'urgent') return 'urgent';
    if (severity === 'emergency') return 'urgent';
    if (whenToSeekCare === 'routine_checkup') return 'routine';
    return 'monitor';
  },

  /**
   * Get accessibility level for treatments in Kenya
   */
  getAccessibilityLevel(treatment) {
    if (!treatment.availableInKenya) return 'not_available';
    if (treatment.requiresPrescription) return 'prescription_required';
    if (treatment.estimatedCost === 'high') return 'expensive';
    return 'accessible';
  },

  /**
   * Generate mobile-optimized search results
   */
  transformSearchResults(results, query) {
    return results.map(result => ({
      id: result.documentId,
      title: result.title || result.name,
      type: result.__contentType,
      snippet: this.generateSearchSnippet(result, query),
      relevanceScore: result._relevanceScore || 0,
      isEmergency: result.isEmergency || result.articleType === 'emergency',
      url: `/${result.__contentType}/${result.slug}`
    }));
  },

  /**
   * Generate search snippet with highlighted terms
   */
  generateSearchSnippet(content, query, maxLength = 150) {
    const text = content.description || content.overview || '';
    if (text.length <= maxLength) return text;

    // Try to find query terms in the text
    const lowerQuery = query.toLowerCase();
    const lowerText = text.toLowerCase();
    const queryIndex = lowerText.indexOf(lowerQuery);

    if (queryIndex !== -1) {
      const start = Math.max(0, queryIndex - 50);
      const end = Math.min(text.length, queryIndex + lowerQuery.length + 50);
      return text.substring(start, end) + (end < text.length ? '...' : '');
    }

    return text.substring(0, maxLength) + '...';
  }
});