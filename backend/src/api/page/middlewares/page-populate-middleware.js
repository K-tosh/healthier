"use strict";

/**
 * `page-populate-middleware` middleware
 */

const populate = {
  contentSections: {
    on: {
      "sections.hero": { 
        populate: {
          picture: { populate: "*" },
          buttons: { populate: "*" }
        }
      },
      "sections.features": {
        populate: {
          feature: { 
            populate: {
              media: { populate: "*" }
            }
          }
        }
      },
      "sections.bottom-actions": { 
        populate: {
          buttons: { populate: "*" }
        }
      },
      "sections.feature-columns-group": { 
        populate: {
          features: { 
            populate: {
              icon: { populate: "*" }
            }
          }
        }
      },
      "sections.feature-rows-group": { 
        populate: {
          features: {
            populate: {

              media: { populate: "*" },
              link: { populate: "*" }
            }
          }
        }
      },
      "sections.testimonials-group": {
        populate: { testimonials: { populate: "*" } },
      },
      "sections.large-video": { 
        populate: {
          video: { populate: "*" },
          poster: { populate: "*" }
        }
      },
      "sections.rich-text": { populate: "*" },
      "sections.pricing": {
        populate: { 
          plans: { 
            populate: {
              product_features: { populate: "*" }
            }
          }
        }
      },
      "sections.lead-form": { 
        populate: {
          submitButton: { populate: "*" }
        }
      },
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
          articles: { populate: "*" },
        },
      },
      "sections.featured-content": {
        populate: {
          featuredArticles: { populate: "*" },
          featuredConditions: { populate: "*" },
        },
      },
      "medical.medical-disclaimer": {
        populate: "*"
      },
      "medical.emergency-alert": {
        populate: {
          icon: { populate: "*" }
        }
      },
      "health.health-facts": {
        populate: {
          facts: { populate: "*" }
        }
      },
      "health.symptom-list": {
        populate: {
          symptoms: {
            populate: {
              relatedConditions: { populate: "*" }
            }
          }
        }
      },
      "health.treatment-options": {
        populate: {
          treatments: {
            populate: {
              relatedConditions: { populate: "*" }
            }
          }
        }
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
