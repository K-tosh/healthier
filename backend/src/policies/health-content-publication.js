'use strict';

/**
 * Health Content Publication Policy
 * Control publication of health content based on review status and safety requirements
 */

module.exports = (policyContext, config, { strapi }) => {
  return async (ctx, next) => {
    try {
      const { action, model } = ctx.state.route;
      const { data } = ctx.request.body;
      const documentId = ctx.params.documentId;
      
      // Only apply to health content publication actions
      const healthContentTypes = ['article', 'condition', 'symptom', 'treatment'];
      const modelName = model.split('.')[1];
      
      if (!healthContentTypes.includes(modelName)) {
        return await next();
      }
      
      // Check publication-related actions
      if (action === 'publish' || (data && data.publishedAt)) {
        await validatePublicationReadiness(ctx, modelName, data, documentId);
      }
      
      // Apply content freshness checks for updates
      if (action === 'update' && modelName === 'article') {
        await checkContentFreshness(ctx, documentId);
      }
      
      // Continue to next policy/controller
      await next();
      
    } catch (error) {
      strapi.log.error('Health content publication policy error:', error);
      return ctx.forbidden(`Publication validation failed: ${error.message}`);
    }
  };
};

/**
 * Validate that content is ready for publication
 */
async function validatePublicationReadiness(ctx, contentType, data, documentId) {
  try {
    let content = data;
    
    // If updating existing content, get current data
    if (documentId) {
      const existing = await strapi.documents(`api::${contentType}.${contentType}`).findOne({
        documentId: documentId,
        populate: '*'
      });
      
      if (existing) {
        content = { ...existing, ...data };
      }
    }
    
    switch (contentType) {
      case 'article':
        await validateArticlePublication(ctx, content);
        break;
      case 'condition':
        await validateConditionPublication(ctx, content);
        break;
      case 'symptom':
        await validateSymptomPublication(ctx, content);
        break;
      case 'treatment':
        await validateTreatmentPublication(ctx, content);
        break;
    }
    
  } catch (error) {
    throw error;
  }
}

/**
 * Validate article publication readiness
 */
async function validateArticlePublication(ctx, article) {
  const healthArticleTypes = ['symptoms', 'treatment', 'prevention', 'emergency', 'overview'];
  
  // Check if this is health-related content
  if (!healthArticleTypes.includes(article.articleType)) {
    return; // Not health content, skip health-specific validation
  }
  
  // Medical articles must have health disclaimers
  if (!article.healthDisclaimer) {
    throw new Error('Health articles must have disclaimers enabled before publication');
  }
  
  // Emergency articles must be medically reviewed
  if (article.articleType === 'emergency' && !article.medicallyReviewed) {
    throw new Error('Emergency articles must be medically reviewed before publication');
  }
  
  // Check for recent medical review on critical health content
  const criticalTypes = ['emergency', 'treatment'];
  if (criticalTypes.includes(article.articleType)) {
    if (!article.reviewDate) {
      strapi.log.warn(`Critical health article "${article.title}" published without medical review date`);
    } else {
      const reviewDate = new Date(article.reviewDate);
      const sixMonthsAgo = new Date();
      sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
      
      if (reviewDate < sixMonthsAgo) {
        strapi.log.warn(`Critical health article "${article.title}" has outdated medical review (${reviewDate.toDateString()})`);
      }
    }
  }
  
  // Validate content completeness
  if (!article.title || article.title.trim().length < 5) {
    throw new Error('Articles must have meaningful titles (at least 5 characters)');
  }
  
  if (!article.description || article.description.trim().length < 50) {
    throw new Error('Health articles must have detailed descriptions (at least 50 characters)');
  }
  
  // Check reading time is calculated
  if (!article.readingTime || article.readingTime < 1) {
    strapi.log.warn('Article published without valid reading time calculation');
  }
  
  // Validate SEO information for health content
  if (article.seo) {
    if (!article.seo.metaTitle || article.seo.metaTitle.length < 10) {
      throw new Error('Health articles must have meaningful SEO meta titles');
    }
    
    if (!article.seo.metaDescription || article.seo.metaDescription.length < 50) {
      throw new Error('Health articles must have detailed SEO meta descriptions');
    }
  } else {
    strapi.log.warn(`Health article "${article.title}" published without SEO information`);
  }
}

/**
 * Validate condition publication readiness
 */
async function validateConditionPublication(ctx, condition) {
  // Required fields validation
  if (!condition.name || condition.name.trim().length < 2) {
    throw new Error('Conditions must have meaningful names');
  }
  
  if (!condition.description || condition.description.trim().length < 30) {
    throw new Error('Conditions must have detailed descriptions (at least 30 characters)');
  }
  
  // Emergency conditions require extra validation
  if (condition.isEmergency) {
    if (!condition.description || condition.description.length < 100) {
      throw new Error('Emergency conditions must have comprehensive descriptions (at least 100 characters)');
    }
    
    // Check for emergency language
    const emergencyTerms = ['emergency', 'urgent', 'immediate', '999', 'hospital'];
    const hasEmergencyLanguage = emergencyTerms.some(term => 
      condition.description.toLowerCase().includes(term)
    );
    
    if (!hasEmergencyLanguage) {
      throw new Error('Emergency conditions must mention urgent care or emergency contact information');
    }
  }
  
  // Validate color is set
  if (!condition.color || !isValidHexColor(condition.color)) {
    strapi.log.warn(`Condition "${condition.name}" published without valid theme color`);
  }
  
  // Check for Kenya context
  if (condition.isEmergency && !condition.prevalenceInKenya) {
    strapi.log.warn(`Emergency condition "${condition.name}" published without Kenya-specific prevalence data`);
  }
}

/**
 * Validate symptom publication readiness
 */
async function validateSymptomPublication(ctx, symptom) {
  // Basic validation
  if (!symptom.name || symptom.name.trim().length < 2) {
    throw new Error('Symptoms must have meaningful names');
  }
  
  if (!symptom.description || symptom.description.trim().length < 20) {
    throw new Error('Symptoms must have detailed descriptions');
  }
  
  // Emergency symptoms validation
  if (symptom.commonSeverity === 'emergency' || symptom.whenToSeekCare === 'emergency') {
    const emergencyTerms = ['emergency', 'urgent', 'immediate', '999', 'hospital'];
    const hasEmergencyGuidance = emergencyTerms.some(term => 
      symptom.description.toLowerCase().includes(term)
    );
    
    if (!hasEmergencyGuidance) {
      throw new Error('Emergency symptoms must include urgent care guidance with contact information');
    }
  }
  
  // Validate body system is specified for specific symptoms
  if (symptom.bodySystem === 'general' && symptom.commonSeverity !== 'mild') {
    strapi.log.warn(`Symptom "${symptom.name}" should specify relevant body system for better categorization`);
  }
}

/**
 * Validate treatment publication readiness
 */
async function validateTreatmentPublication(ctx, treatment) {
  // Basic validation
  if (!treatment.name || treatment.name.trim().length < 2) {
    throw new Error('Treatments must have meaningful names');
  }
  
  if (!treatment.description || treatment.description.trim().length < 30) {
    throw new Error('Treatments must have detailed descriptions');
  }
  
  // Medication-specific validation
  if (treatment.type === 'medication') {
    if (treatment.requiresPrescription && !treatment.dosageInformation) {
      strapi.log.warn(`Prescription medication "${treatment.name}" published without dosage information`);
    }
    
    if (!treatment.sideEffects) {
      strapi.log.warn(`Medication "${treatment.name}" published without side effects information`);
    }
  }
  
  // Emergency treatment validation
  if (treatment.type === 'emergency') {
    if (!treatment.dosageInformation) {
      throw new Error('Emergency treatments must include specific dosage information');
    }
    
    if (!treatment.availableInKenya) {
      throw new Error('Emergency treatments must be available in Kenya');
    }
  }
  
  // Kenya availability check
  if (treatment.availableInKenya === false) {
    strapi.log.warn(`Treatment "${treatment.name}" not available in Kenya - ensure alternatives are mentioned`);
  }
}

/**
 * Check content freshness for articles
 */
async function checkContentFreshness(ctx, documentId) {
  try {
    if (!documentId) return;
    
    const article = await strapi.documents('api::article.article').findOne({
      documentId: documentId,
      fields: ['reviewDate', 'lastMedicalUpdate', 'articleType', 'title']
    });
    
    if (!article) return;
    
    const healthArticleTypes = ['symptoms', 'treatment', 'prevention', 'emergency', 'overview'];
    if (!healthArticleTypes.includes(article.articleType)) {
      return; // Not health content
    }
    
    // Check review date freshness
    if (article.reviewDate) {
      const reviewDate = new Date(article.reviewDate);
      const oneYearAgo = new Date();
      oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
      
      const sixMonthsAgo = new Date();
      sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
      
      if (reviewDate < oneYearAgo) {
        strapi.log.warn(`Health article "${article.title}" has very outdated medical review (over 1 year)`);
      } else if (reviewDate < sixMonthsAgo) {
        strapi.log.info(`Health article "${article.title}" medical review is over 6 months old`);
      }
    } else {
      strapi.log.warn(`Health article "${article.title}" has never been medically reviewed`);
    }
    
  } catch (error) {
    strapi.log.error('Error checking content freshness:', error);
  }
}

/**
 * Helper function to validate hex color
 */
function isValidHexColor(color) {
  const hexColorRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
  return hexColorRegex.test(color);
}