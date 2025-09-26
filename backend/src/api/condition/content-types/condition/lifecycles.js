'use strict';

/**
 * Condition Lifecycle Hooks
 * Auto-validation for condition content and relationship management
 */

module.exports = {
  /**
   * Before creating a condition
   */
  async beforeCreate(event) {
    const { data } = event.params;
    
    try {
      // Validate required fields
      if (!data.name || data.name.trim().length < 2) {
        throw new Error('Condition name must be at least 2 characters long');
      }
      
      if (!data.description || data.description.trim().length < 20) {
        throw new Error('Condition description must be at least 20 characters long');
      }
      
      // Validate color format if provided
      if (data.color && !isValidHexColor(data.color)) {
        throw new Error('Color must be a valid hex color format (#RGB or #RRGGBB)');
      }
      
      // Set default values
      if (!data.color) {
        data.color = '#3B82F6'; // Default blue
      }
      
      if (!data.severity) {
        data.severity = 'moderate';
      }
      
      if (!data.hasOwnProperty('priority')) {
        data.priority = 0;
      }
      
      // Validate emergency conditions
      if (data.isEmergency) {
        await validateEmergencyCondition(data);
      }
      
      // Log condition creation
      strapi.log.info(`Creating new condition: ${data.name} (Severity: ${data.severity})`);
      
    } catch (error) {
      strapi.log.error('Error in condition beforeCreate lifecycle:', error);
      throw new Error(`Condition validation failed: ${error.message}`);
    }
  },

  /**
   * Before updating a condition
   */
  async beforeUpdate(event) {
    const { data, where } = event.params;
    
    try {
      // Get existing condition to compare changes
      const existingCondition = await strapi.documents('api::condition.condition').findOne({
        documentId: where.documentId,
        populate: { articles: true, condition_groups: true }
      });
      
      if (!existingCondition) {
        throw new Error('Condition not found');
      }
      
      // Validate field changes
      if (data.name && data.name.trim().length < 2) {
        throw new Error('Condition name must be at least 2 characters long');
      }
      
      if (data.description && data.description.trim().length < 20) {
        throw new Error('Condition description must be at least 20 characters long');
      }
      
      if (data.color && !isValidHexColor(data.color)) {
        throw new Error('Color must be a valid hex color format (#RGB or #RRGGBB)');
      }
      
      // Validate emergency status changes
      if (data.hasOwnProperty('isEmergency') && data.isEmergency) {
        await validateEmergencyCondition({ ...existingCondition, ...data });
      }
      
      // Check for severity consistency with emergency status
      if (data.isEmergency && data.severity && 
          !['severe', 'critical'].includes(data.severity)) {
        strapi.log.warn(`Emergency condition "${existingCondition.name}" should typically be severe or critical`);
      }
      
      // Log significant changes
      if (data.hasOwnProperty('isEmergency') && data.isEmergency !== existingCondition.isEmergency) {
        strapi.log.info(`Condition emergency status changed: ${existingCondition.name} - Emergency: ${data.isEmergency}`);
      }
      
    } catch (error) {
      strapi.log.error('Error in condition beforeUpdate lifecycle:', error);
      throw new Error(`Condition update validation failed: ${error.message}`);
    }
  },

  /**
   * After creating a condition
   */
  async afterCreate(event) {
    const { result } = event;
    
    try {
      // Update related health topic statistics
      await updateHealthTopicStats();
      
      // Log condition creation with details
      strapi.log.info(`New condition created: ${result.name} (ID: ${result.documentId}, Emergency: ${result.isEmergency || false})`);
      
    } catch (error) {
      strapi.log.error('Error in condition afterCreate lifecycle:', error);
      // Don't throw error as condition is already created
    }
  },

  /**
   * After updating a condition
   */
  async afterUpdate(event) {
    const { result } = event;
    
    try {
      // Update related health topic statistics
      await updateHealthTopicStats();
      
      // Log condition update
      strapi.log.info(`Condition updated: ${result.name} (Emergency: ${result.isEmergency || false})`);
      
    } catch (error) {
      strapi.log.error('Error in condition afterUpdate lifecycle:', error);
      // Don't throw error as condition is already updated
    }
  },

  /**
   * Before deleting a condition
   */
  async beforeDelete(event) {
    const { where } = event.params;
    
    try {
      // Get condition with relationships to check dependencies
      const condition = await strapi.documents('api::condition.condition').findOne({
        documentId: where.documentId,
        populate: { articles: true }
      });
      
      if (condition && condition.articles && condition.articles.length > 0) {
        strapi.log.warn(`Deleting condition "${condition.name}" that has ${condition.articles.length} related articles`);
      }
      
    } catch (error) {
      strapi.log.error('Error in condition beforeDelete lifecycle:', error);
      // Don't throw error, allow deletion to proceed
    }
  }
};

/**
 * Helper function to validate hex color format
 */
function isValidHexColor(color) {
  const hexColorRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
  return hexColorRegex.test(color);
}

/**
 * Helper function to validate emergency conditions
 */
async function validateEmergencyCondition(conditionData) {
  try {
    // Emergency conditions should have appropriate severity
    if (conditionData.severity && !['severe', 'critical'].includes(conditionData.severity)) {
      strapi.log.warn('Emergency conditions should typically be marked as severe or critical');
    }
    
    // Emergency conditions should have Kenya prevalence data for context
    if (!conditionData.prevalenceInKenya) {
      strapi.log.info('Consider adding Kenya-specific prevalence data for emergency conditions');
    }
    
    // Emergency conditions should have proper description
    if (conditionData.description && conditionData.description.length < 50) {
      throw new Error('Emergency conditions should have detailed descriptions (at least 50 characters)');
    }
    
    // Check if description mentions emergency care
    if (conditionData.description) {
      const emergencyTerms = ['emergency', 'urgent', 'immediate', '999', 'hospital'];
      const hasEmergencyLanguage = emergencyTerms.some(term => 
        conditionData.description.toLowerCase().includes(term)
      );
      
      if (!hasEmergencyLanguage) {
        strapi.log.warn('Emergency condition descriptions should mention urgent care or emergency contact (999)');
      }
    }
    
  } catch (error) {
    throw error;
  }
}

/**
 * Helper function to update health topic statistics
 */
async function updateHealthTopicStats() {
  try {
    // Get all health topics and update their condition counts
    const healthTopics = await strapi.documents('api::health-topic.health-topic').findMany({
      populate: { relatedConditions: true }
    });
    
    for (const topic of healthTopics.results) {
      const conditionCount = topic.relatedConditions ? topic.relatedConditions.length : 0;
      
      // You could store this count in a custom field if needed
      // For now, we'll just log it for analytics
      if (conditionCount > 0) {
        strapi.log.debug(`Health topic "${topic.name}" has ${conditionCount} related conditions`);
      }
    }
    
  } catch (error) {
    strapi.log.error('Error updating health topic statistics:', error);
  }
}