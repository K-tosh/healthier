'use strict';

/**
 * health-topic service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::health-topic.health-topic');