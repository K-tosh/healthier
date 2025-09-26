'use strict';

/**
 * condition service with health-specific enhancements
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::condition.condition', ({ strapi }) => ({
  /**
   * Find conditions by symptom
   */
  async findBySymptom(symptomId, options = {}) {
    try {
      const { results, pagination } = await strapi.documents('api::symptom.symptom').findMany({
        filters: {
          documentId: symptomId
        },
        populate: {
          relatedConditions: {
            populate: {
              condition_groups: true,
              articles: true,
              icon: true
            }
          }
        },
        ...options
      });
      
      return results.length > 0 ? results[0].relatedConditions : [];
    } catch (error) {
      strapi.log.error('Error finding conditions by symptom:', error);
      throw error;
    }
  },

  /**
   * Find conditions by health topic
   */
  async findByHealthTopic(topicId, options = {}) {
    try {
      const { results } = await strapi.documents('api::health-topic.health-topic').findMany({
        filters: {
          documentId: topicId
        },
        populate: {
          relatedConditions: {
            populate: {
              condition_groups: true,
              articles: true,
              icon: true
            }
          }
        },
        ...options
      });
      
      return results.length > 0 ? results[0].relatedConditions : [];
    } catch (error) {
      strapi.log.error('Error finding conditions by health topic:', error);
      throw error;
    }
  },

  /**
   * Get emergency conditions
   */
  async getEmergencyConditions(options = {}) {
    try {
      const { results, pagination } = await strapi.documents('api::condition.condition').findMany({
        filters: {
          isEmergency: true
        },
        populate: {
          condition_groups: true,
          articles: true,
          icon: true
        },
        sort: { priority: 'desc', severity: 'desc' },
        ...options
      });
      
      return { results, pagination };
    } catch (error) {
      strapi.log.error('Error getting emergency conditions:', error);
      throw error;
    }
  },

  /**
   * Find conditions by severity
   */
  async findBySeverity(severity, options = {}) {
    try {
      const { results, pagination } = await strapi.documents('api::condition.condition').findMany({
        filters: {
          severity: severity
        },
        populate: {
          condition_groups: true,
          articles: true,
          icon: true
        },
        sort: { priority: 'desc', name: 'asc' },
        ...options
      });
      
      return { results, pagination };
    } catch (error) {
      strapi.log.error('Error finding conditions by severity:', error);
      throw error;
    }
  },

  /**
   * Search conditions
   */
  async searchConditions(keyword, options = {}) {
    try {
      const { results, pagination } = await strapi.documents('api::condition.condition').findMany({
        filters: {
          $or: [
            { name: { $containsi: keyword } },
            { description: { $containsi: keyword } },
            { overview: { $containsi: keyword } },
            { prevalenceInKenya: { $containsi: keyword } }
          ]
        },
        populate: {
          condition_groups: true,
          articles: true,
          icon: true
        },
        sort: { priority: 'desc', name: 'asc' },
        ...options
      });
      
      return { results, pagination };
    } catch (error) {
      strapi.log.error('Error searching conditions:', error);
      throw error;
    }
  },

  /**
   * Get related treatments for a condition
   */
  async getRelatedTreatments(conditionId, options = {}) {
    try {
      const { results } = await strapi.documents('api::treatment.treatment').findMany({
        filters: {
          relatedConditions: {
            documentId: conditionId
          }
        },
        populate: {
          relatedConditions: true
        },
        sort: { type: 'asc', name: 'asc' },
        ...options
      });
      
      return results;
    } catch (error) {
      strapi.log.error('Error getting related treatments:', error);
      throw error;
    }
  },

  /**
   * Get conditions by body system (via related symptoms)
   */
  async getConditionsByBodySystem(bodySystem, options = {}) {
    try {
      const { results } = await strapi.documents('api::symptom.symptom').findMany({
        filters: {
          bodySystem: bodySystem
        },
        populate: {
          relatedConditions: {
            populate: {
              condition_groups: true,
              articles: true,
              icon: true
            }
          }
        },
        ...options
      });
      
      // Extract unique conditions from all symptoms
      const conditionsMap = new Map();
      results.forEach(symptom => {
        if (symptom.relatedConditions) {
          symptom.relatedConditions.forEach(condition => {
            conditionsMap.set(condition.documentId, condition);
          });
        }
      });
      
      return Array.from(conditionsMap.values());
    } catch (error) {
      strapi.log.error('Error getting conditions by body system:', error);
      throw error;
    }
  },

  /**
   * Get condition statistics for Kenya
   */
  async getKenyaStatistics() {
    try {
      const totalConditions = await strapi.db.query('api::condition.condition').count();
      const emergencyConditions = await strapi.db.query('api::condition.condition').count({
        where: { isEmergency: true }
      });
      const severityStats = await strapi.db.query('api::condition.condition').groupBy({
        by: ['severity'],
        count: '*'
      });
      
      return {
        total: totalConditions,
        emergency: emergencyConditions,
        bySeverity: severityStats
      };
    } catch (error) {
      strapi.log.error('Error getting Kenya statistics:', error);
      throw error;
    }
  }
}));
