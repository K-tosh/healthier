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
      

      
      if (!data.hasOwnProperty('priority')) {
        data.priority = 0;
      }
      
      // Validate emergency conditions
      if (data.isEmergency) {
        await validateEmergencyCondition(data);
      }
      
      // Log condition creation
      strapi.log.info(`Creating new condition: ${data.name}`);
      
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
      // Debug logging to understand the structure
      strapi.log.debug('Condition beforeUpdate - where parameter:', JSON.stringify(where));
      strapi.log.debug('Condition beforeUpdate - data parameter keys:', Object.keys(data || {}));
      
      // Get the condition identifier - handle different possible structures
      let conditionId = null;
      if (where.documentId) {
        conditionId = where.documentId;
      } else if (where.id) {
        conditionId = where.id;
      } else if (typeof where === 'string') {
        conditionId = where;
      } else if (typeof where === 'number') {
        conditionId = where;
      }
      
      if (!conditionId) {
        strapi.log.warn('Could not determine condition ID from where parameter:', where);
        // Don't throw error, just skip validation
        return;
      }
      
      // Try to find the existing condition with different query approaches
      let existingCondition = null;
      
      try {
        // Try with documentId first (Strapi v5 approach)
        if (typeof conditionId === 'string' && conditionId.length > 10) {
          existingCondition = await strapi.documents('api::condition.condition').findOne({
            documentId: conditionId,
            populate: { articles: true, condition_groups: true }
          });
        }
      } catch (error) {
        strapi.log.debug('DocumentId query failed, trying alternative approaches');
      }
      
      // If documentId approach failed, try with regular id
      if (!existingCondition) {
        try {
          existingCondition = await strapi.entityService.findOne('api::condition.condition', conditionId, {
            populate: { articles: true, condition_groups: true }
          });
        } catch (error) {
          strapi.log.debug('EntityService query failed');
        }
      }
      
      // If still not found, try direct database query
      if (!existingCondition) {
        try {
          existingCondition = await strapi.db.query('api::condition.condition').findOne({
            where: { id: conditionId },
            populate: { articles: true, condition_groups: true }
          });
        } catch (error) {
          strapi.log.debug('Database query failed');
        }
      }
      
      if (!existingCondition) {
        strapi.log.warn(`Condition not found for update with ID: ${conditionId}. Skipping validation.`);
        // Don't throw error, just skip validation to allow the update to proceed
        return;
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
      

      
      // Log significant changes
      if (data.hasOwnProperty('isEmergency') && data.isEmergency !== existingCondition.isEmergency) {
        strapi.log.info(`Condition emergency status changed: ${existingCondition.name} - Emergency: ${data.isEmergency}`);
      }
      
      strapi.log.info(`Condition update validation passed: ${existingCondition.name || 'Unknown'}`);
      
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
      // Get the condition identifier - handle different possible structures
      let conditionId = null;
      if (where.documentId) {
        conditionId = where.documentId;
      } else if (where.id) {
        conditionId = where.id;
      } else if (typeof where === 'string') {
        conditionId = where;
      } else if (typeof where === 'number') {
        conditionId = where;
      }
      
      if (!conditionId) {
        strapi.log.warn('Could not determine condition ID for deletion:', where);
        return;
      }
      
      // Try to get condition with relationships to check dependencies
      let condition = null;
      
      try {
        // Try with documentId first (Strapi v5 approach)
        if (typeof conditionId === 'string' && conditionId.length > 10) {
          condition = await strapi.documents('api::condition.condition').findOne({
            documentId: conditionId,
            populate: { articles: true }
          });
        }
      } catch (error) {
        strapi.log.debug('DocumentId query failed for deletion check');
      }
      
      // If documentId approach failed, try with regular id
      if (!condition) {
        try {
          condition = await strapi.entityService.findOne('api::condition.condition', conditionId, {
            populate: { articles: true }
          });
        } catch (error) {
          strapi.log.debug('EntityService query failed for deletion check');
        }
      }
      
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
    let healthTopics = [];
    
    try {
      // Try the documents API first (Strapi v5)
      const response = await strapi.documents('api::health-topic.health-topic').findMany({
        populate: { relatedConditions: true }
      });
      healthTopics = response.results || response;
    } catch (error) {
      // Fallback to entityService (older Strapi versions)
      try {
        healthTopics = await strapi.entityService.findMany('api::health-topic.health-topic', {
          populate: { relatedConditions: true }
        });
      } catch (fallbackError) {
        strapi.log.debug('Health topic statistics update failed, health-topic content type may not exist');
        return;
      }
    }
    
    if (Array.isArray(healthTopics)) {
      for (const topic of healthTopics) {
        const conditionCount = topic.relatedConditions ? topic.relatedConditions.length : 0;
        
        // You could store this count in a custom field if needed
        // For now, we'll just log it for analytics
        if (conditionCount > 0) {
          strapi.log.debug(`Health topic "${topic.name}" has ${conditionCount} related conditions`);
        }
      }
    }
    
  } catch (error) {
    strapi.log.error('Error updating health topic statistics:', error);
  }
}