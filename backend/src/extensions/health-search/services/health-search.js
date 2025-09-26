'use strict';

/**
 * Health Search Service
 * Comprehensive search functionality across all health content types
 */

module.exports = ({ strapi }) => ({
  /**
   * Search across all health content types
   */
  async searchAll(query, options = {}) {
    try {
      const {
        limit = 20,
        page = 1,
        contentTypes = ['article', 'condition', 'symptom', 'treatment', 'health-topic']
      } = options;

      const results = {};
      const searchPromises = [];

      // Search Articles
      if (contentTypes.includes('article')) {
        searchPromises.push(
          this.searchArticles(query, { limit, page }).then(res => {
            results.articles = res;
          })
        );
      }

      // Search Conditions
      if (contentTypes.includes('condition')) {
        searchPromises.push(
          this.searchConditions(query, { limit, page }).then(res => {
            results.conditions = res;
          })
        );
      }

      // Search Symptoms
      if (contentTypes.includes('symptom')) {
        searchPromises.push(
          this.searchSymptoms(query, { limit, page }).then(res => {
            results.symptoms = res;
          })
        );
      }

      // Search Treatments
      if (contentTypes.includes('treatment')) {
        searchPromises.push(
          this.searchTreatments(query, { limit, page }).then(res => {
            results.treatments = res;
          })
        );
      }

      // Search Health Topics
      if (contentTypes.includes('health-topic')) {
        searchPromises.push(
          this.searchHealthTopics(query, { limit, page }).then(res => {
            results.healthTopics = res;
          })
        );
      }

      await Promise.all(searchPromises);

      // Calculate total results and apply relevance weighting
      const weightedResults = this.applyRelevanceWeighting(results, query);

      return {
        results: weightedResults,
        totalResults: this.calculateTotalResults(results),
        query,
        searchTime: Date.now()
      };
    } catch (error) {
      strapi.log.error('Error in searchAll:', error);
      throw error;
    }
  },

  /**
   * Search articles with health-specific weighting
   */
  async searchArticles(query, options = {}) {
    try {
      const { results, pagination } = await strapi.documents('api::article.article').findMany({
        filters: {
          $or: [
            { title: { $containsi: query } },
            { description: { $containsi: query } },
            { blocks: { $containsi: query } }
          ]
        },
        populate: {
          relatedConditions: true,
          category: true,
          cover: true
        },
        pagination: {
          page: options.page || 1,
          pageSize: options.limit || 10
        },
        sort: { priority: 'desc', createdAt: 'desc' }
      });

      return {
        data: results,
        pagination,
        contentType: 'article'
      };
    } catch (error) {
      strapi.log.error('Error searching articles:', error);
      return { data: [], pagination: null, contentType: 'article' };
    }
  },

  /**
   * Search conditions
   */
  async searchConditions(query, options = {}) {
    try {
      const { results, pagination } = await strapi.documents('api::condition.condition').findMany({
        filters: {
          $or: [
            { name: { $containsi: query } },
            { description: { $containsi: query } },
            { overview: { $containsi: query } },
            { prevalenceInKenya: { $containsi: query } }
          ]
        },
        populate: {
          condition_groups: true,
          articles: true,
          icon: true
        },
        pagination: {
          page: options.page || 1,
          pageSize: options.limit || 10
        },
        sort: { priority: 'desc', severity: 'desc' }
      });

      return {
        data: results,
        pagination,
        contentType: 'condition'
      };
    } catch (error) {
      strapi.log.error('Error searching conditions:', error);
      return { data: [], pagination: null, contentType: 'condition' };
    }
  },

  /**
   * Search symptoms
   */
  async searchSymptoms(query, options = {}) {
    try {
      const { results, pagination } = await strapi.documents('api::symptom.symptom').findMany({
        filters: {
          $or: [
            { name: { $containsi: query } },
            { description: { $containsi: query } }
          ]
        },
        populate: {
          relatedConditions: true
        },
        pagination: {
          page: options.page || 1,
          pageSize: options.limit || 10
        },
        sort: { commonSeverity: 'desc', name: 'asc' }
      });

      return {
        data: results,
        pagination,
        contentType: 'symptom'
      };
    } catch (error) {
      strapi.log.error('Error searching symptoms:', error);
      return { data: [], pagination: null, contentType: 'symptom' };
    }
  },

  /**
   * Search treatments
   */
  async searchTreatments(query, options = {}) {
    try {
      const { results, pagination } = await strapi.documents('api::treatment.treatment').findMany({
        filters: {
          $or: [
            { name: { $containsi: query } },
            { description: { $containsi: query } },
            { sideEffects: { $containsi: query } },
            { contraindications: { $containsi: query } }
          ]
        },
        populate: {
          relatedConditions: true
        },
        pagination: {
          page: options.page || 1,
          pageSize: options.limit || 10
        },
        sort: { availableInKenya: 'desc', type: 'asc' }
      });

      return {
        data: results,
        pagination,
        contentType: 'treatment'
      };
    } catch (error) {
      strapi.log.error('Error searching treatments:', error);
      return { data: [], pagination: null, contentType: 'treatment' };
    }
  },

  /**
   * Search health topics
   */
  async searchHealthTopics(query, options = {}) {
    try {
      const { results, pagination } = await strapi.documents('api::health-topic.health-topic').findMany({
        filters: {
          $or: [
            { name: { $containsi: query } },
            { description: { $containsi: query } },
            { shortDescription: { $containsi: query } },
            { overview: { $containsi: query } },
            { keyStatistics: { $containsi: query } }
          ]
        },
        populate: {
          relatedConditions: true,
          featuredArticles: true,
          icon: true,
          coverImage: true
        },
        pagination: {
          page: options.page || 1,
          pageSize: options.limit || 10
        },
        sort: { priority: 'desc', isActive: 'desc' }
      });

      return {
        data: results,
        pagination,
        contentType: 'health-topic'
      };
    } catch (error) {
      strapi.log.error('Error searching health topics:', error);
      return { data: [], pagination: null, contentType: 'health-topic' };
    }
  },

  /**
   * Search by category with health-specific filtering
   */
  async searchByCategory(query, category, options = {}) {
    try {
      const categoryMap = {
        'emergency': { filters: { isEmergency: true }, contentTypes: ['condition'] },
        'severe': { filters: { severity: 'severe' }, contentTypes: ['condition'] },
        'critical': { filters: { severity: 'critical' }, contentTypes: ['condition'] },
        'medication': { filters: { type: 'medication' }, contentTypes: ['treatment'] },
        'lifestyle': { filters: { type: 'lifestyle' }, contentTypes: ['treatment'] },
        'symptoms': { contentTypes: ['symptom'] },
        'treatments': { contentTypes: ['treatment'] }
      };

      const categoryConfig = categoryMap[category];
      if (!categoryConfig) {
        return await this.searchAll(query, options);
      }

      const results = await this.searchAll(query, {
        ...options,
        contentTypes: categoryConfig.contentTypes
      });

      // Apply additional filters if specified
      if (categoryConfig.filters) {
        Object.keys(results.results).forEach(contentType => {
          if (results.results[contentType]?.data) {
            results.results[contentType].data = results.results[contentType].data.filter(item => {
              return Object.entries(categoryConfig.filters).every(([key, value]) => 
                item[key] === value
              );
            });
          }
        });
      }

      return results;
    } catch (error) {
      strapi.log.error('Error in searchByCategory:', error);
      throw error;
    }
  },

  /**
   * Get health search suggestions
   */
  async getHealthSuggestions(partialQuery, limit = 5) {
    try {
      const suggestions = new Set();

      // Get condition names
      const conditions = await strapi.documents('api::condition.condition').findMany({
        filters: {
          name: { $containsi: partialQuery }
        },
        fields: ['name'],
        pagination: { pageSize: limit }
      });
      conditions.results.forEach(c => suggestions.add(c.name));

      // Get symptom names
      const symptoms = await strapi.documents('api::symptom.symptom').findMany({
        filters: {
          name: { $containsi: partialQuery }
        },
        fields: ['name'],
        pagination: { pageSize: limit }
      });
      symptoms.results.forEach(s => suggestions.add(s.name));

      // Get treatment names
      const treatments = await strapi.documents('api::treatment.treatment').findMany({
        filters: {
          name: { $containsi: partialQuery }
        },
        fields: ['name'],
        pagination: { pageSize: limit }
      });
      treatments.results.forEach(t => suggestions.add(t.name));

      return Array.from(suggestions).slice(0, limit);
    } catch (error) {
      strapi.log.error('Error getting health suggestions:', error);
      return [];
    }
  },

  /**
   * Apply relevance weighting for Kenya health context
   */
  applyRelevanceWeighting(results, query) {
    const weighted = {};
    
    Object.entries(results).forEach(([contentType, data]) => {
      if (data.data) {
        weighted[contentType] = {
          ...data,
          data: data.data.map(item => {
            let relevanceScore = 0;
            
            // Base score for exact name match
            if (item.name && item.name.toLowerCase().includes(query.toLowerCase())) {
              relevanceScore += 10;
            }
            
            // Kenya-specific content gets higher priority
            if (item.commonInKenya) relevanceScore += 5;
            if (item.availableInKenya) relevanceScore += 5;
            if (item.prevalenceInKenya) relevanceScore += 3;
            
            // Emergency conditions get priority
            if (item.isEmergency) relevanceScore += 8;
            
            // Higher priority items get boosted
            if (item.priority) relevanceScore += item.priority;
            
            return {
              ...item,
              relevanceScore
            };
          }).sort((a, b) => b.relevanceScore - a.relevanceScore)
        };
      }
    });
    
    return weighted;
  },

  /**
   * Calculate total results across all content types
   */
  calculateTotalResults(results) {
    return Object.values(results).reduce((total, contentTypeResult) => {
      return total + (contentTypeResult.data?.length || 0);
    }, 0);
  }
});