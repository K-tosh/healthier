'use strict';

/**
 * health-topic controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::health-topic.health-topic');