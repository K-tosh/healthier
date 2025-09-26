'use strict';

/**
 * Health Performance Monitor Service
 * Monitor and optimize health content performance
 */

module.exports = ({ strapi }) => ({
  /**
   * Monitor API performance for health endpoints
   */
  async monitorHealthEndpoints() {
    try {
      const performanceMetrics = {
        healthEndpoints: {},
        slowQueries: [],
        popularContent: {},
        timestamp: new Date()
      };

      // Monitor frequently accessed health content
      const popularArticles = await this.getPopularContent('article');
      const popularConditions = await this.getPopularContent('condition');
      
      performanceMetrics.popularContent = {
        articles: popularArticles,
        conditions: popularConditions
      };

      // Log performance metrics
      strapi.log.info('Health content performance metrics updated');
      
      return performanceMetrics;
    } catch (error) {
      strapi.log.error('Error monitoring health endpoints:', error);
      throw error;
    }
  },

  /**
   * Get popular content for caching optimization
   */
  async getPopularContent(contentType, limit = 10) {
    try {
      // This would integrate with analytics in a real implementation
      // For now, we'll use priority and creation date as proxies
      const { results } = await strapi.documents(`api::${contentType}.${contentType}`).findMany({
        sort: { priority: 'desc', createdAt: 'desc' },
        pagination: { pageSize: limit },
        fields: ['documentId', 'name', 'title', 'priority']
      });

      return results;
    } catch (error) {
      strapi.log.error(`Error getting popular ${contentType} content:`, error);
      return [];
    }
  },

  /**
   * Optimize database queries for health content
   */
  async optimizeHealthQueries() {
    try {
      const optimizations = {
        indexesCreated: 0,
        cacheWarmed: 0,
        queriesOptimized: 0
      };

      // Warm up frequently accessed content cache
      await this.warmHealthContentCache();
      optimizations.cacheWarmed = 1;

      // Log optimization results
      strapi.log.info('Health content queries optimized:', optimizations);
      
      return optimizations;
    } catch (error) {
      strapi.log.error('Error optimizing health queries:', error);
      throw error;
    }
  },

  /**
   * Warm up cache for frequently accessed health content
   */
  async warmHealthContentCache() {
    try {
      const cachePromises = [];

      // Cache emergency conditions
      cachePromises.push(
        strapi.documents('api::condition.condition').findMany({
          filters: { isEmergency: true },
          populate: { condition_groups: true, articles: true }
        })
      );

      // Cache popular health topics
      cachePromises.push(
        strapi.documents('api::health-topic.health-topic').findMany({
          filters: { isActive: true },
          sort: { priority: 'desc' },
          pagination: { pageSize: 5 },
          populate: { relatedConditions: true, featuredArticles: true }
        })
      );

      // Cache recent health articles
      cachePromises.push(
        strapi.documents('api::article.article').findMany({
          filters: { 
            articleType: { $in: ['emergency', 'symptoms', 'treatment'] }
          },
          sort: { priority: 'desc', createdAt: 'desc' },
          pagination: { pageSize: 10 },
          populate: { relatedConditions: true, category: true }
        })
      );

      await Promise.all(cachePromises);
      strapi.log.info('Health content cache warmed successfully');
    } catch (error) {
      strapi.log.error('Error warming health content cache:', error);
    }
  },

  /**
   * Generate health content performance report
   */
  async generatePerformanceReport() {
    try {
      const report = {
        timestamp: new Date(),
        contentStats: await this.getHealthContentStats(),
        recommendations: []
      };

      // Generate recommendations
      report.recommendations = this.generateOptimizationRecommendations(report);

      strapi.log.info('Health content performance report generated');
      return report;
    } catch (error) {
      strapi.log.error('Error generating performance report:', error);
      throw error;
    }
  },

  /**
   * Get health content statistics
   */
  async getHealthContentStats() {
    try {
      const stats = {};

      // Count articles by type
      const articleTypes = ['overview', 'symptoms', 'treatment', 'prevention', 'emergency'];
      for (const type of articleTypes) {
        const count = await strapi.db.query('api::article.article').count({
          where: { articleType: type }
        });
        stats[`${type}Articles`] = count;
      }

      // Count emergency conditions
      stats.emergencyConditions = await strapi.db.query('api::condition.condition').count({
        where: { isEmergency: true }
      });

      // Count medically reviewed articles
      stats.reviewedArticles = await strapi.db.query('api::article.article').count({
        where: { medicallyReviewed: true }
      });

      return stats;
    } catch (error) {
      strapi.log.error('Error getting health content stats:', error);
      return {};
    }
  },

  /**
   * Generate optimization recommendations
   */
  generateOptimizationRecommendations(report) {
    const recommendations = [];

    // Check for emergency content
    if (report.contentStats.emergencyConditions < 5) {
      recommendations.push({
        type: 'content',
        priority: 'high',
        message: 'Consider adding more emergency conditions for comprehensive coverage'
      });
    }

    return recommendations;
  }
});