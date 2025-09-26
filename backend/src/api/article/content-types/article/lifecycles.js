'use strict';

/**
 * Article Lifecycle Hooks
 * Auto-validation and processing for health articles
 */

module.exports = {
  /**
   * Before creating an article
   */
  async beforeCreate(event) {
    const { data } = event.params;
    
    try {
      // Auto-calculate reading time if not provided
      if (!data.readingTime) {
        data.readingTime = await calculateReadingTime(data);
      }
      
      // Set medical review flag for health-related articles
      if (isHealthRelatedArticle(data)) {
        if (!data.hasOwnProperty('healthDisclaimer')) {
          data.healthDisclaimer = true;
        }
        
        // Flag for medical review if not already reviewed
        if (!data.medicallyReviewed) {
          data.lastMedicalUpdate = new Date();
          strapi.log.info(`Article flagged for medical review: ${data.title || 'Untitled'}`);
        }
      }
      
      // Validate emergency content
      if (data.articleType === 'emergency') {
        await validateEmergencyContent(data);
      }
      
      // Set default target audience if not specified
      if (!data.targetAudience) {
        data.targetAudience = 'general_public';
      }
      
    } catch (error) {
      strapi.log.error('Error in article beforeCreate lifecycle:', error);
      throw new Error(`Article validation failed: ${error.message}`);
    }
  },

  /**
   * Before updating an article
   */
  async beforeUpdate(event) {
    const { data, where } = event.params;
    
    try {
      // Only proceed with complex validation if we're updating content fields
      const contentFields = ['title', 'description', 'blocks', 'articleType', 'relatedConditions'];
      const isContentUpdate = contentFields.some(field => data.hasOwnProperty(field));
      
      if (!isContentUpdate) {
        // Simple updates (like status changes) don't need full validation
        return;
      }

      // Try to get existing article, but handle gracefully if not found
      let existingArticle = null;
      try {
        if (where.documentId) {
          existingArticle = await strapi.documents('api::article.article').findOne({
            documentId: where.documentId,
            populate: { relatedConditions: true }
          });
        } else if (where.id) {
          // Fallback for legacy ID-based lookups
          existingArticle = await strapi.db.query('api::article.article').findOne({
            where: { id: where.id },
            populate: { relatedConditions: true }
          });
        }
      } catch (findError) {
        strapi.log.warn('Could not fetch existing article for validation:', findError.message);
        // Continue with update but skip content-dependent validations
      }
      
      // Recalculate reading time if content changed
      if (data.title || data.description || data.blocks) {
        const articleForCalculation = existingArticle ? { ...existingArticle, ...data } : data;
        data.readingTime = await calculateReadingTime(articleForCalculation);
        data.lastMedicalUpdate = new Date();
        
        // Flag for medical review if health content changed
        if (isHealthRelatedArticle(articleForCalculation)) {
          data.medicallyReviewed = false;
          data.reviewDate = null;
          data.medicalReviewer = null;
          const title = existingArticle?.title || data.title || 'Unknown Article';
          strapi.log.info(`Article flagged for re-review due to content changes: ${title}`);
        }
      }
      
      // Validate emergency content if article type is or changed to emergency
      if (data.articleType === 'emergency' || (existingArticle && existingArticle.articleType === 'emergency')) {
        const articleForValidation = existingArticle ? { ...existingArticle, ...data } : data;
        await validateEmergencyContent(articleForValidation);
      }
      
      // Check review date freshness if we have existing article
      if (existingArticle && existingArticle.reviewDate) {
        const reviewDate = new Date(existingArticle.reviewDate);
        const oneYearAgo = new Date();
        oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
        
        if (reviewDate < oneYearAgo) {
          strapi.log.warn(`Article review is over one year old: ${existingArticle.title}`);
        }
      }
      
    } catch (error) {
      strapi.log.error('Error in article beforeUpdate lifecycle:', error);
      // Don't throw error for non-critical validations, just log them
      if (error.message.includes('Emergency articles must') || error.message.includes('validation failed')) {
        throw error; // Re-throw validation errors
      }
      strapi.log.warn('Non-critical validation error, continuing with update');
    }
  },

  /**
   * After creating an article
   */
  async afterCreate(event) {
    const { result } = event;
    
    try {
      // Log article creation for analytics
      strapi.log.info(`New article created: ${result.title} (Type: ${result.articleType || 'general'})`);
      
      // Update related health topics if article has conditions
      if (result.relatedConditions && result.relatedConditions.length > 0) {
        await updateRelatedHealthTopics(result);
      }
      
    } catch (error) {
      strapi.log.error('Error in article afterCreate lifecycle:', error);
      // Don't throw error as article is already created
    }
  },

  /**
   * After updating an article
   */
  async afterUpdate(event) {
    const { result } = event;
    
    try {
      // Log article update
      strapi.log.info(`Article updated: ${result.title}`);
      
      // Update related health topics if conditions changed
      if (result.relatedConditions) {
        await updateRelatedHealthTopics(result);
      }
      
    } catch (error) {
      strapi.log.error('Error in article afterUpdate lifecycle:', error);
      // Don't throw error as article is already updated
    }
  }
};

/**
 * Helper function to calculate reading time based on content
 */
async function calculateReadingTime(articleData) {
  try {
    let wordCount = 0;
    
    // Count words in title and description
    if (articleData.title) {
      wordCount += articleData.title.split(' ').filter(word => word.length > 0).length;
    }
    if (articleData.description) {
      wordCount += articleData.description.split(' ').filter(word => word.length > 0).length;
    }
    
    // Count words in dynamic blocks
    if (articleData.blocks && Array.isArray(articleData.blocks)) {
      articleData.blocks.forEach(block => {
        if (block.__component === 'shared.rich-text' && block.body) {
          // Strip HTML tags and count words
          const plainText = block.body.replace(/<[^>]*>/g, ' ');
          wordCount += plainText.split(' ').filter(word => word.length > 0).length;
        }
      });
    }
    
    // Average reading speed: 200 words per minute, minimum 1 minute
    const readingTime = Math.max(1, Math.ceil(wordCount / 200));
    
    return readingTime;
  } catch (error) {
    strapi.log.error('Error calculating reading time:', error);
    return 5; // Default to 5 minutes
  }
}

/**
 * Helper function to check if article is health-related
 */
function isHealthRelatedArticle(articleData) {
  const healthTypes = ['symptoms', 'treatment', 'prevention', 'emergency', 'overview'];
  return healthTypes.includes(articleData.articleType) || 
         (articleData.relatedConditions && articleData.relatedConditions.length > 0);
}

/**
 * Helper function to validate emergency content
 */
async function validateEmergencyContent(articleData) {
  try {
    // Check if content includes emergency contact information
    const contentText = JSON.stringify(articleData).toLowerCase();
    
    // More forgiving check - just warn if emergency info is missing
    if (!contentText.includes('999') && !contentText.includes('emergency')) {
      strapi.log.warn('Emergency articles should include emergency contact information (999)');
      // Don't throw error, just warn
    }
    
    // Check for emergency blocks in dynamic zone
    if (articleData.blocks && Array.isArray(articleData.blocks)) {
      const hasEmergencyAlert = articleData.blocks.some(block => 
        block.__component === 'medical.emergency-alert'
      );
      
      if (!hasEmergencyAlert) {
        strapi.log.warn('Emergency article should include emergency alert component');
      }
    }
    
    // Ensure health disclaimer is enabled for emergency content (but don't throw if missing)
    if (!articleData.healthDisclaimer) {
      strapi.log.warn('Emergency articles should have health disclaimers enabled');
      // Auto-set if missing
      articleData.healthDisclaimer = true;
    }
    
  } catch (error) {
    strapi.log.error('Error validating emergency content:', error);
    // Don't throw, just log
  }
}

/**
 * Helper function to update related health topics
 */
async function updateRelatedHealthTopics(article) {
  try {
    if (!article.relatedConditions || article.relatedConditions.length === 0) {
      return;
    }
    
    // Find health topics that include these conditions
    const conditionIds = article.relatedConditions.map(condition => 
      typeof condition === 'string' ? condition : condition.documentId
    ).filter(id => id); // Remove any undefined values
    
    if (conditionIds.length === 0) {
      return;
    }
    
    const healthTopicsResponse = await strapi.documents('api::health-topic.health-topic').findMany({
      filters: {
        relatedConditions: {
          documentId: {
            $in: conditionIds
          }
        }
      }
    });
    
    // Handle both .results and direct array responses
    const healthTopics = healthTopicsResponse.results || healthTopicsResponse || [];
    
    // Log the relationship for potential featured article updates
    if (healthTopics.length > 0) {
      strapi.log.info(`Article "${article.title}" relates to ${healthTopics.length} health topics`);
    }
    
  } catch (error) {
    strapi.log.error('Error updating related health topics:', error);
    // Don't throw, just log the error
  }
}