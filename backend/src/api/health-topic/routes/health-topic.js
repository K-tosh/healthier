'use strict';

/**
 * health-topic router
 */

const { createCoreRouter } = require('@strapi/strapi').factories;

module.exports = createCoreRouter('api::health-topic.health-topic');