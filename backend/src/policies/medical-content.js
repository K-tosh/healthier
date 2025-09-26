'use strict';

/**
 * Medical Content Policy
 * Ensure medical content meets quality standards
 */

module.exports = (policyContext, config, { strapi }) => {
  return async (ctx, next) => {
    try {
      const { action, model } = ctx.state.route;
      const { data } = ctx.request.body;
      
      // Only apply to health-related content types
      const healthContentTypes = ['article', 'condition', 'symptom', 'treatment'];
      const modelName = model.split('.')[1]; // Extract model name from api::article.article
      
      if (!healthContentTypes.includes(modelName)) {
        return await next();
      }
      
      // Apply different validations based on action
      if (['create', 'update'].includes(action)) {
        await validateMedicalContent(ctx, modelName, data);
      }
      
      // Continue to next policy/controller
      await next();
      
    } catch (error) {
      strapi.log.error('Medical content policy error:', error);
      return ctx.badRequest(`Medical content validation failed: ${error.message}`);
    }
  };
};

/**
 * Validate medical content based on type
 */
async function validateMedicalContent(ctx, contentType, data) {
  try {
    switch (contentType) {
      case 'article':
        await validateMedicalArticle(ctx, data);
        break;
      case 'condition':
        await validateMedicalCondition(ctx, data);
        break;
      case 'symptom':
        await validateMedicalSymptom(ctx, data);
        break;
      case 'treatment':
        await validateMedicalTreatment(ctx, data);
        break;
    }
  } catch (error) {
    throw error;
  }
}

/**
 * Validate medical articles
 */
async function validateMedicalArticle(ctx, data) {
  const healthArticleTypes = ['symptoms', 'treatment', 'prevention', 'emergency', 'overview'];
  
  // Check if this is health-related content
  if (!data.articleType || !healthArticleTypes.includes(data.articleType)) {
    return; // Not health content, skip validation
  }
  
  // Emergency content must have disclaimers
  if (data.articleType === 'emergency') {
    if (!data.healthDisclaimer) {
      throw new Error('Emergency articles must have health disclaimers enabled');
    }
    
    // Check for emergency contact information
    const contentText = JSON.stringify(data).toLowerCase();
    if (!contentText.includes('999') && !contentText.includes('emergency')) {
      throw new Error('Emergency articles must include emergency contact information (999)');
    }
  }
  
  // Medical articles should have appropriate target audience
  if (data.articleType === 'treatment' && data.targetAudience === 'general_public') {
    // This is allowed but log a warning
    strapi.log.warn('Treatment articles for general public should be carefully reviewed');
  }
  
  // Check for problematic medical claims
  if (data.title || data.description || data.blocks) {
    const problematicTerms = ['cure', 'guaranteed', 'miracle', 'always works', '100% effective'];
    const allContent = [
      data.title || '',
      data.description || '',
      JSON.stringify(data.blocks || [])
    ].join(' ').toLowerCase();
    
    problematicTerms.forEach(term => {
      if (allContent.includes(term)) {
        strapi.log.warn(`Medical article contains potentially problematic term: "${term}"`);
      }
    });
  }
  
  // Validate reading time is reasonable
  if (data.readingTime && (data.readingTime < 1 || data.readingTime > 60)) {
    throw new Error('Reading time must be between 1 and 60 minutes');
  }
}

/**
 * Validate medical conditions
 */
async function validateMedicalCondition(ctx, data) {
  // Emergency conditions validation
  if (data.isEmergency) {
    if (!data.description || data.description.length < 50) {
      throw new Error('Emergency conditions must have detailed descriptions (at least 50 characters)');
    }
    
    if (data.severity && !['severe', 'critical'].includes(data.severity)) {
      strapi.log.warn('Emergency conditions should typically be marked as severe or critical');
    }
  }
  
  // Validate color format
  if (data.color && !isValidHexColor(data.color)) {
    throw new Error('Condition color must be a valid hex color format');
  }
  
  // Validate priority range
  if (data.priority && (data.priority < 0 || data.priority > 100)) {
    throw new Error('Condition priority must be between 0 and 100');
  }
  
  // Check for Kenya-specific context in prevalence data
  if (data.prevalenceInKenya) {
    const kenyaTerms = ['kenya', 'kenyan', 'nairobi', 'mombasa', 'kisumu'];
    const hasKenyaContext = kenyaTerms.some(term => 
      data.prevalenceInKenya.toLowerCase().includes(term)
    );
    
    if (!hasKenyaContext) {
      strapi.log.info('Consider adding specific Kenya context to prevalence data');
    }
  }
}

/**
 * Validate medical symptoms
 */
async function validateMedicalSymptom(ctx, data) {
  // Validate consistency between severity and care urgency
  if (data.commonSeverity === 'emergency' && data.whenToSeekCare !== 'emergency') {
    throw new Error('Emergency-level symptoms must require emergency care');
  }
  
  if (data.whenToSeekCare === 'emergency' && data.commonSeverity !== 'emergency') {
    strapi.log.warn('Symptoms requiring emergency care should have emergency severity');
  }
  
  // Emergency symptoms should specify body system
  if (data.commonSeverity === 'emergency' && data.bodySystem === 'general') {
    strapi.log.warn('Emergency symptoms should specify relevant body system for better categorization');
  }
  
  // Validate description contains symptom information
  if (data.description && data.description.length < 20) {
    throw new Error('Symptom descriptions must be at least 20 characters long');
  }
}

/**
 * Validate medical treatments
 */
async function validateMedicalTreatment(ctx, data) {
  // Medication-specific validations
  if (data.type === 'medication') {
    if (!data.hasOwnProperty('requiresPrescription')) {
      strapi.log.warn('Medications should specify if prescription is required');
    }
    
    if (!data.sideEffects) {
      strapi.log.warn('Medications should include side effects information');
    }
    
    if (!data.contraindications) {
      strapi.log.warn('Medications should include contraindications information');
    }
    
    // Check for dosage information for prescription medications
    if (data.requiresPrescription && !data.dosageInformation) {
      strapi.log.warn('Prescription medications should include dosage information');
    }
  }
  
  // Emergency treatment validations
  if (data.type === 'emergency') {
    if (!data.dosageInformation) {
      throw new Error('Emergency treatments must include specific dosage information');
    }
    
    if (!data.availableInKenya) {
      throw new Error('Emergency treatments must be available in Kenya');
    }
  }
  
  // Validate cost information
  if (data.estimatedCost === 'high') {
    strapi.log.info('High-cost treatments should include cost context for Kenya');
  }
  
  // Check for Kenya availability context
  if (data.availableInKenya === false) {
    strapi.log.warn('Treatment not available in Kenya - consider noting alternatives');
  }
}

/**
 * Helper function to validate hex color
 */
function isValidHexColor(color) {
  const hexColorRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
  return hexColorRegex.test(color);
}