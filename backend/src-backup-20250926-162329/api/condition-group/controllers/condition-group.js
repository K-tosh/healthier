'use strict';

/**
 * condition-group controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::condition-group.condition-group', ({ strapi }) => ({
  async find(ctx) {
    // Inject population rules
    ctx.query = {
      populate: {
        conditions: {
          fields: ['name', 'slug'],
        },
      },
      ...ctx.query,
    };

    // Call the default core controller logic
    const { data, meta } = await super.find(ctx);
    return { data, meta };
  },
}));
