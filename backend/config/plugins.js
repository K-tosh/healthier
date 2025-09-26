module.exports = ({ env }) => ({
  // SEO Plugin Configuration for Health Content
  seo: {
    enabled: true,
    config: {
      // Health-specific SEO defaults
      defaults: {
        article: {
          metaTitle: '{title} | HealthierKE - Kenya Health Information',
          metaDescription: '{description}',
          shareImage: '/uploads/healthierke-share-image.jpg'
        },
        condition: {
          metaTitle: '{name} Information | HealthierKE Kenya',
          metaDescription: '{description}'
        },
        symptom: {
          metaTitle: '{name} - Symptoms & When to Seek Care | HealthierKE',
          metaDescription: '{description}'
        },
        treatment: {
          metaTitle: '{name} Treatment Information | HealthierKE Kenya',
          metaDescription: '{description}'
        }
      }
    }
  },

  // Users & Permissions Plugin - Enhanced for Health Content
  'users-permissions': {
    enabled: true,
    config: {
      // Health content specific role configurations
      healthContentAccess: {
        enableHealthEndpoints: true,
        emergencyContentPublic: true,
        medicalContentRestricted: false
      }
    }
  },

  // Plugin Cloud Configuration (only enable if installed)
  ...(process.env.STRAPI_PLUGIN_CLOUD_ENABLED === 'true' && {
    cloud: {
      enabled: true,
      config: {
        uploadLimits: {
          images: {
            maxSize: 2 * 1024 * 1024, // 2MB for health images
            allowedTypes: ['image/jpeg', 'image/png', 'image/webp']
          }
        }
      }
    }
  })
});