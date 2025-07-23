"use strict";

/**
 * `page-populate-middleware` middleware
 */

const populate = {
  contentSections: {
    on: {
      "sections.hero": { populate: "*" },
      "sections.features": { populate: "*" },
      "sections.bottom-actions": { populate: "*" },
      "sections.feature-columns-group": { populate: "*" },
      "sections.feature-rows-group": { populate: "*" },
      "sections.testimonials-group": {
        populate: { testimonials: { populate: "*" } },
      },
      "sections.large-video": { populate: "*" },
      "sections.rich-text": { populate: "*" },
      "sections.pricing": {
        populate: { plans: { populate: "*" } },
      },
      "sections.lead-form": { populate: "*" },
      "sections.heading": { populate: "*" },
      "sections.trending-article": {
        populate: {
          articles: { populate: "*" },
        },
      },
      "sections.explore-conditions": {
        populate: {
          conditions: {
            populate: {
              condition_groups: { populate: "*" },
            },
          },
        },
      },
    },
  },
  seo: {
    populate: "*",
  },
};

module.exports = (config, { strapi }) => {
  return async (ctx, next) => {
    ctx.query = {
      populate,
      filters: { slug: ctx.query.filters?.slug },
      locale: ctx.query.locale,
    };

    console.log("page-populate-middleware.js: ctx.query = ", ctx.query);

    await next();
  };
};
