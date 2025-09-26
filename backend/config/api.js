module.exports = {
  rest: {
    defaultLimit: 25,
    maxLimit: 100,
    withCount: true,
  },
  // Health content specific API optimizations
  healthContent: {
    // Caching strategy for frequently accessed health content
    cache: {
      enabled: true,
      maxAge: 1000 * 60 * 15, // 15 minutes for health content
      emergencyContent: {
        maxAge: 1000 * 60 * 5, // 5 minutes for emergency content (more frequent updates)
      },
      conditionsCache: {
        maxAge: 1000 * 60 * 30, // 30 minutes for conditions (relatively stable)
      }
    },
    // Rate limiting for health content endpoints
    rateLimit: {
      search: {
        max: 100, // 100 search requests per window
        windowMs: 15 * 60 * 1000, // 15 minutes
        message: 'Too many search requests, please try again later'
      },
      content: {
        max: 300, // 300 content requests per window
        windowMs: 15 * 60 * 1000, // 15 minutes
        message: 'Too many content requests, please try again later'
      },
      emergency: {
        max: 1000, // Higher limit for emergency content
        windowMs: 15 * 60 * 1000,
        message: 'Emergency content access limit reached'
      }
    },
    // Response optimization for Kenya's mobile-first users
    mobileOptimization: {
      enableCompression: true,
      minifyJson: true,
      excludeFields: {
        // Reduce response size by excluding heavy fields when not needed
        articles: ['blocks'], // Exclude content blocks from list views
        conditions: ['overview'], // Exclude detailed overview from list views
      }
    }
  }
};
