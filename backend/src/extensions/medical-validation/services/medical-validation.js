'use strict';

/**
 * Medical Content Validation Service
 * Validate and ensure quality of medical content
 */

module.exports = ({ strapi }) => ({
  /**
   * Validate medical content based on type and content
   */
  async validateMedicalContent(contentType, contentId) {
    try {
      const validationResults = {
        isValid: true,
        warnings: [],
        errors: [],
        recommendations: []
      };

      let content;
      
      // Get the content based on type
      switch (contentType) {
        case 'article':
          content = await strapi.documents('api::article.article').findOne({
            documentId: contentId,
            populate: {
              relatedConditions: true,
              blocks: true
            }
          });
          break;
        case 'condition':
          content = await strapi.documents('api::condition.condition').findOne({
            documentId: contentId
          });
          break;
        case 'symptom':
          content = await strapi.documents('api::symptom.symptom').findOne({
            documentId: contentId
          });
          break;
        case 'treatment':
          content = await strapi.documents('api::treatment.treatment').findOne({
            documentId: contentId
          });
          break;
        default:
          throw new Error(`Unsupported content type: ${contentType}`);
      }

      if (!content) {
        validationResults.errors.push('Content not found');
        validationResults.isValid = false;
        return validationResults;
      }

      // Apply content-specific validations
      switch (contentType) {
        case 'article':
          this.validateArticleContent(content, validationResults);
          break;
        case 'condition':
          this.validateConditionContent(content, validationResults);
          break;
        case 'symptom':
          this.validateSymptomContent(content, validationResults);
          break;
        case 'treatment':
          this.validateTreatmentContent(content, validationResults);
          break;
      }

      // General medical content validations
      this.validateGeneralMedicalContent(content, validationResults);

      return validationResults;
    } catch (error) {
      strapi.log.error('Error validating medical content:', error);
      throw error;
    }
  },

  /**
   * Validate article-specific content
   */
  validateArticleContent(article, validationResults) {
    // Check if health disclaimer is enabled for medical content
    if (article.articleType && ['symptoms', 'treatment', 'emergency'].includes(article.articleType)) {
      if (!article.healthDisclaimer) {
        validationResults.warnings.push('Medical articles should have health disclaimers enabled');
      }
      
      if (!article.medicallyReviewed) {
        validationResults.warnings.push('Medical articles should be medically reviewed');
      }
    }

    // Check for emergency content warnings
    if (article.articleType === 'emergency') {
      if (!this.hasEmergencyAlert(article.blocks)) {
        validationResults.errors.push('Emergency articles must include emergency alert components');
        validationResults.isValid = false;
      }
    }

    // Check review date freshness
    if (article.reviewDate) {
      const reviewDate = new Date(article.reviewDate);
      const oneYearAgo = new Date();
      oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
      
      if (reviewDate < oneYearAgo) {
        validationResults.warnings.push('Article review is over one year old - consider updating');
      }
    }

    // Check reading time accuracy
    if (article.readingTime && (article.readingTime < 1 || article.readingTime > 60)) {
      validationResults.recommendations.push('Reading time seems unusual - verify calculation');
    }
  },

  /**
   * Validate condition-specific content
   */
  validateConditionContent(condition, validationResults) {
    // Check for required fields
    if (!condition.description || condition.description.length < 50) {
      validationResults.warnings.push('Condition description should be at least 50 characters');
    }

    // Validate emergency conditions
    if (condition.isEmergency) {
      if (!condition.prevalenceInKenya) {
        validationResults.recommendations.push('Consider adding Kenya-specific prevalence data for emergency conditions');
      }
    }

    // Check color format
    if (condition.color && !this.isValidHexColor(condition.color)) {
      validationResults.errors.push('Invalid color format - must be valid hex color');
      validationResults.isValid = false;
    }
  },

  /**
   * Validate symptom-specific content
   */
  validateSymptomContent(symptom, validationResults) {
    // Check severity consistency
    if (symptom.whenToSeekCare === 'emergency' && symptom.commonSeverity !== 'emergency') {
      validationResults.warnings.push('Symptoms requiring emergency care should have emergency severity level');
    }

    // Check body system relevance
    if (symptom.bodySystem === 'general' && symptom.commonSeverity === 'emergency') {
      validationResults.recommendations.push('Emergency symptoms should specify relevant body system');
    }
  },

  /**
   * Validate treatment-specific content
   */
  validateTreatmentContent(treatment, validationResults) {
    // Check prescription requirements
    if (treatment.type === 'medication' && !treatment.hasOwnProperty('requiresPrescription')) {
      validationResults.warnings.push('Medications should specify if prescription is required');
    }

    // Check Kenya availability
    if (!treatment.hasOwnProperty('availableInKenya')) {
      validationResults.recommendations.push('Consider specifying if treatment is available in Kenya');
    }

    // Check for important safety information
    if (treatment.type === 'medication') {
      if (!treatment.sideEffects) {
        validationResults.warnings.push('Medication treatments should include side effects information');
      }
      if (!treatment.contraindications) {
        validationResults.warnings.push('Medication treatments should include contraindications');
      }
    }

    // Validate emergency treatments
    if (treatment.type === 'emergency') {
      if (!treatment.dosageInformation) {
        validationResults.errors.push('Emergency treatments must include dosage information');
        validationResults.isValid = false;
      }
    }
  },

  /**
   * General medical content validation
   */
  validateGeneralMedicalContent(content, validationResults) {
    // Check for medical disclaimer language in description or content
    const medicalTerms = ['treatment', 'diagnosis', 'medication', 'symptoms', 'disease', 'condition'];
    const hasmedicalContent = medicalTerms.some(term => 
      (content.description && content.description.toLowerCase().includes(term)) ||
      (content.overview && content.overview.toLowerCase().includes(term)) ||
      (content.name && content.name.toLowerCase().includes(term))
    );

    if (hasmedicalContent && content.contentType !== 'general') {
      validationResults.recommendations.push('Content with medical terms should include appropriate disclaimers');
    }

    // Check for outdated terms or problematic language
    const problematicTerms = ['cure', 'guaranteed', 'miracle', 'always works'];
    const contentText = JSON.stringify(content).toLowerCase();
    
    problematicTerms.forEach(term => {
      if (contentText.includes(term)) {
        validationResults.warnings.push(`Avoid using "${term}" in medical content - consider more appropriate language`);
      }
    });
  },

  /**
   * Check content freshness
   */
  async checkContentFreshness(articleId) {
    try {
      const article = await strapi.documents('api::article.article').findOne({
        documentId: articleId,
        fields: ['reviewDate', 'lastMedicalUpdate', 'createdAt', 'updatedAt']
      });

      if (!article) {
        throw new Error('Article not found');
      }

      const now = new Date();
      const sixMonthsAgo = new Date();
      sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
      
      const oneYearAgo = new Date();
      oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);

      const freshness = {
        isFresh: true,
        status: 'current',
        lastReview: article.reviewDate,
        daysSinceReview: null,
        recommendations: []
      };

      if (article.reviewDate) {
        const reviewDate = new Date(article.reviewDate);
        const daysDiff = Math.floor((now - reviewDate) / (1000 * 60 * 60 * 24));
        freshness.daysSinceReview = daysDiff;

        if (reviewDate < oneYearAgo) {
          freshness.isFresh = false;
          freshness.status = 'stale';
          freshness.recommendations.push('Content is over 1 year old and should be reviewed for accuracy');
        } else if (reviewDate < sixMonthsAgo) {
          freshness.status = 'aging';
          freshness.recommendations.push('Content is over 6 months old - consider reviewing for updates');
        }
      } else {
        freshness.isFresh = false;
        freshness.status = 'unreviewed';
        freshness.recommendations.push('Content has never been medically reviewed');
      }

      return freshness;
    } catch (error) {
      strapi.log.error('Error checking content freshness:', error);
      throw error;
    }
  },

  /**
   * Flag content for review
   */
  async flagForReview(contentId, contentType, reason) {
    try {
      const timestamp = new Date();
      const reviewFlag = {
        contentId,
        contentType,
        reason,
        flaggedAt: timestamp,
        status: 'pending_review'
      };

      // Log the flag for tracking
      strapi.log.info(`Content flagged for review:`, reviewFlag);

      // Here you could store flags in a separate collection or send notifications
      // For now, we'll just update the content based on type
      switch (contentType) {
        case 'article':
          await strapi.documents('api::article.article').update({
            documentId: contentId,
            data: {
              medicallyReviewed: false,
              lastMedicalUpdate: timestamp
            }
          });
          break;
        // Add other content types as needed
      }

      return reviewFlag;
    } catch (error) {
      strapi.log.error('Error flagging content for review:', error);
      throw error;
    }
  },

  /**
   * Generate appropriate medical disclaimer
   */
  generateMedicalDisclaimer(contentType) {
    const disclaimers = {
      general: "This information is for educational purposes only and should not be used as a substitute for professional medical advice, diagnosis, or treatment. Always consult with a qualified healthcare provider before making any decisions about your health.",
      
      emergency: "This information is for educational purposes only. In case of a medical emergency, immediately call 999 or go to the nearest emergency room. Do not rely on this information for emergency medical decisions.",
      
      medication: "This medication information is for educational purposes only. Always consult with a healthcare provider or pharmacist before taking any medication. Do not stop or change medications without professional medical advice.",
      
      treatment: "Treatment information provided is for educational purposes only. Individual treatment plans should always be developed in consultation with qualified healthcare providers who can assess your specific situation.",
      
      symptom: "Symptom information is provided for educational purposes. If you are experiencing concerning symptoms, consult with a healthcare provider for proper evaluation and diagnosis."
    };

    return disclaimers[contentType] || disclaimers.general;
  },

  /**
   * Validate emergency content
   */
  validateEmergencyContent(content) {
    const validationResults = {
      isValid: true,
      warnings: [],
      errors: []
    };

    // Check for emergency contact information
    if (!this.hasEmergencyContact(content)) {
      validationResults.errors.push('Emergency content must include emergency contact information (999)');
      validationResults.isValid = false;
    }

    // Check for appropriate urgency language
    const emergencyKeywords = ['immediately', 'urgent', 'emergency', 'call 999', 'seek help'];
    const contentText = JSON.stringify(content).toLowerCase();
    
    const hasUrgencyLanguage = emergencyKeywords.some(keyword => 
      contentText.includes(keyword)
    );

    if (!hasUrgencyLanguage) {
      validationResults.warnings.push('Emergency content should include urgent language');
    }

    return validationResults;
  },

  /**
   * Helper: Check if content has emergency alert
   */
  hasEmergencyAlert(blocks) {
    if (!blocks || !Array.isArray(blocks)) return false;
    
    return blocks.some(block => 
      block.__component === 'medical.emergency-alert'
    );
  },

  /**
   * Helper: Check if content has emergency contact
   */
  hasEmergencyContact(content) {
    const contentText = JSON.stringify(content).toLowerCase();
    return contentText.includes('999') || contentText.includes('emergency');
  },

  /**
   * Helper: Validate hex color
   */
  isValidHexColor(color) {
    const hexColorRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
    return hexColorRegex.test(color);
  }
});