'use strict';

/**
 * article service with health-specific enhancements
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::article.article', ({ strapi }) => ({
  /**
   * Find articles by condition
   */
  async findByCondition(conditionId, options = {}) {
    try {
      const { results, pagination } = await strapi.documents('api::article.article').findMany({
        filters: {
          relatedConditions: {
            documentId: conditionId
          }
        },
        populate: {
          relatedConditions: true,
          category: true,
          authorsBio: true,
          cover: true
        },
        ...options
      });
      
      return { results, pagination };
    } catch (error) {
      strapi.log.error('Error finding articles by condition:', error);
      throw error;
    }
  },

  /**
   * Find articles by health topic
   */
  async findByHealthTopic(topicId, options = {}) {
    try {
      const { results, pagination } = await strapi.documents('api::health-topic.health-topic').findMany({
        filters: {
          documentId: topicId
        },
        populate: {
          featuredArticles: {
            populate: {
              relatedConditions: true,
              category: true,
              authorsBio: true,
              cover: true
            }
          }
        },
        ...options
      });
      
      return results.length > 0 ? results[0].featuredArticles : [];
    } catch (error) {
      strapi.log.error('Error finding articles by health topic:', error);
      throw error;
    }
  },

  /**
   * Find articles by article type
   */
  async findByArticleType(articleType, options = {}) {
    try {
      const { results, pagination } = await strapi.documents('api::article.article').findMany({
        filters: {
          articleType: articleType
        },
        populate: {
          relatedConditions: true,
          category: true,
          authorsBio: true,
          cover: true
        },
        ...options
      });
      
      return { results, pagination };
    } catch (error) {
      strapi.log.error('Error finding articles by type:', error);
      throw error;
    }
  },

  /**
   * Search health content
   */
  async searchHealthContent(query, filters = {}, options = {}) {
    try {
      const { results, pagination } = await strapi.documents('api::article.article').findMany({
        filters: {
          $or: [
            { title: { $containsi: query } },
            { description: { $containsi: query } },
            { blocks: { $containsi: query } }
          ],
          ...filters
        },
        populate: {
          relatedConditions: true,
          category: true,
          authorsBio: true,
          cover: true
        },
        ...options
      });
      
      return { results, pagination };
    } catch (error) {
      strapi.log.error('Error searching health content:', error);
      throw error;
    }
  },

  /**
   * Get featured articles by topic
   */
  async getFeaturedByTopic(topicId, limit = 5) {
    try {
      const { results } = await this.findByHealthTopic(topicId, {
        pagination: {
          page: 1,
          pageSize: limit
        },
        sort: { priority: 'desc', createdAt: 'desc' }
      });
      
      return results;
    } catch (error) {
      strapi.log.error('Error getting featured articles by topic:', error);
      throw error;
    }
  },

  /**
   * Get related articles
   */
  async getRelatedArticles(articleId, limit = 3) {
    try {
      // First get the current article's conditions
      const currentArticle = await strapi.documents('api::article.article').findOne({
        documentId: articleId,
        populate: {
          relatedConditions: true
        }
      });

      if (!currentArticle || !currentArticle.relatedConditions?.length) {
        return [];
      }

      // Find articles with similar conditions
      const conditionIds = currentArticle.relatedConditions.map(condition => condition.documentId);
      
      const { results } = await strapi.documents('api::article.article').findMany({
        filters: {
          documentId: { $ne: articleId }, // Exclude current article
          relatedConditions: {
            documentId: { $in: conditionIds }
          }
        },
        populate: {
          relatedConditions: true,
          category: true,
          cover: true
        },
        pagination: {
          page: 1,
          pageSize: limit
        },
        sort: { priority: 'desc', createdAt: 'desc' }
      });
      
      return results;
    } catch (error) {
      strapi.log.error('Error getting related articles:', error);
      throw error;
    }
  },

  /**
   * Update reading time based on content
   */
  async updateReadingTime(articleId) {
    try {
      const article = await strapi.documents('api::article.article').findOne({
        documentId: articleId,
        populate: {
          blocks: true
        }
      });

      if (!article) {
        throw new Error('Article not found');
      }

      // Calculate reading time based on content
      let wordCount = 0;
      
      // Count words in title and description
      if (article.title) wordCount += article.title.split(' ').length;
      if (article.description) wordCount += article.description.split(' ').length;
      
      // Count words in dynamic blocks
      if (article.blocks) {
        article.blocks.forEach(block => {
          if (block.__component === 'shared.rich-text' && block.body) {
            // Strip HTML tags and count words
            const plainText = block.body.replace(/<[^>]*>/g, ' ');
            wordCount += plainText.split(' ').filter(word => word.length > 0).length;
          }
        });
      }

      // Average reading speed: 200 words per minute
      const readingTime = Math.max(1, Math.ceil(wordCount / 200));

      // Update the article
      await strapi.documents('api::article.article').update({
        documentId: articleId,
        data: { readingTime }
      });

      return readingTime;
    } catch (error) {
      strapi.log.error('Error updating reading time:', error);
      throw error;
    }
  },

  /**
   * Flag article for medical review
   */
  async flagForMedicalReview(articleId, reason = 'Content update requires medical review') {
    try {
      await strapi.documents('api::article.article').update({
        documentId: articleId,
        data: {
          medicallyReviewed: false,
          reviewDate: null,
          medicalReviewer: null,
          lastMedicalUpdate: new Date()
        }
      });

      // Log the review flag for tracking
      strapi.log.info(`Article ${articleId} flagged for medical review: ${reason}`);
      
      return true;
    } catch (error) {
      strapi.log.error('Error flagging article for review:', error);
      throw error;
    }
  }
}));
