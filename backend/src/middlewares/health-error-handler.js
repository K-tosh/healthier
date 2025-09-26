'use strict';

/**
 * Health Content Error Handler Middleware
 * Provides specialized error handling for medical content endpoints
 */

module.exports = (config, { strapi }) => {
  return async (ctx, next) => {
    // Only handle API requests, skip admin panel and other requests
    if (!ctx.url.startsWith('/api/')) {
      return await next();
    }

    try {
      await next();

      // Handle health content specific responses
      if (ctx.url.includes('/api/health-') || 
          ctx.url.includes('/api/condition') || 
          ctx.url.includes('/api/symptom') || 
          ctx.url.includes('/api/treatment') || 
          ctx.url.includes('/api/article')) {
        
        // Add health-specific headers
        ctx.set('X-Health-Content', 'true');
        ctx.set('X-Medical-Disclaimer', 'This content is for informational purposes only and should not replace professional medical advice');
        
        // Add Kenya emergency contact header for emergency content
        if (ctx.response.body?.data?.isEmergency || 
            ctx.response.body?.data?.articleType === 'emergency' ||
            (Array.isArray(ctx.response.body?.data) && 
             ctx.response.body.data.some(item => item.isEmergency))) {
          ctx.set('X-Kenya-Emergency', '999');
        }

        // Transform response using health transformers if available
        const transformerService = strapi.plugin('health-transformers')?.service('health-transformers') || 
                                  strapi.service('health-transformers');
        
        if (transformerService && ctx.response.body?.data) {
          const contentType = ctx.url.split('/').pop()?.split('?')[0];
          const isMobileRequest = ctx.headers['user-agent']?.includes('Mobile') || 
                                 ctx.query.mobile === 'true';
          
          if (Array.isArray(ctx.response.body.data)) {
            // Transform list responses
            ctx.response.body.data = transformerService.transformContentList(
              contentType,
              ctx.response.body.data,
              { optimizeForMobile: isMobileRequest }
            );
          } else {
            // Transform single item responses
            const includeFull = ctx.query.populate || ctx.method === 'GET' && ctx.url.includes('/');
            ctx.response.body.data = transformerService.transformHealthContent(
              contentType,
              ctx.response.body.data,
              { 
                includeFull,
                optimizeForMobile: isMobileRequest 
              }
            );
          }
        }
      }

    } catch (error) {
      // Only handle API errors, skip admin errors
      if (!ctx.url.startsWith('/api/')) {
        throw error; // Re-throw admin errors
      }

      // Health content specific error handling for API requests only
      const healthError = await handleHealthContentError(error, ctx, strapi);
      
      ctx.status = healthError.status;
      ctx.body = {
        data: null,
        error: {
          status: healthError.status,
          name: healthError.name,
          message: healthError.message,
          details: healthError.details,
          // Add Kenya-specific emergency guidance for critical errors
          ...(healthError.status >= 500 && {
            emergencyGuidance: {
              message: "If this is a medical emergency, call 999 immediately",
              contacts: {
                emergency: "999",
                healthHotline: "719",
                poisonControl: "+254-20-2642660"
              }
            }
          })
        }
      };

      // Log health content errors for monitoring
      strapi.log.error('Health Content Error:', {
        url: ctx.url,
        method: ctx.method,
        error: error.message,
        stack: error.stack,
        userAgent: ctx.headers['user-agent'],
        ip: ctx.ip
      });
    }
  };
};

/**
 * Handle health content specific errors
 */
async function handleHealthContentError(error, ctx, strapi) {
  // Database connection errors
  if (error.code === 'SQLITE_BUSY' || error.code === 'SQLITE_LOCKED') {
    return {
      status: 503,
      name: 'ServiceUnavailableError',
      message: 'Health content service is temporarily unavailable. Please try again in a moment.',
      details: {
        code: 'HEALTH_SERVICE_BUSY',
        retryAfter: 30
      }
    };
  }

  // Content not found errors
  if (error.status === 404 || error.name === 'NotFoundError') {
    return {
      status: 404,
      name: 'HealthContentNotFoundError',
      message: 'The requested health information could not be found.',
      details: {
        code: 'HEALTH_CONTENT_NOT_FOUND',
        suggestion: 'Try browsing our health topics or use the search function'
      }
    };
  }

  // Validation errors for health content
  if (error.name === 'ValidationError' && ctx.url.includes('/api/')) {
    return {
      status: 400,
      name: 'HealthContentValidationError',
      message: 'The health content data provided is invalid.',
      details: {
        code: 'HEALTH_CONTENT_INVALID',
        validationErrors: error.details?.errors || error.message,
        guidance: 'Please ensure all required medical information is provided correctly'
      }
    };
  }

  // Rate limiting errors
  if (error.status === 429) {
    return {
      status: 429,
      name: 'HealthContentRateLimitError',
      message: 'Too many requests for health content. Please wait before making more requests.',
      details: {
        code: 'HEALTH_RATE_LIMIT_EXCEEDED',
        retryAfter: error.retryAfter || 900, // 15 minutes default
        guidance: 'For emergency medical information, call 999 directly'
      }
    };
  }

  // Permission errors
  if (error.status === 403 || error.name === 'ForbiddenError') {
    return {
      status: 403,
      name: 'HealthContentAccessError',
      message: 'Access to this health content is restricted.',
      details: {
        code: 'HEALTH_CONTENT_RESTRICTED',
        guidance: 'Some medical content may require professional access or review'
      }
    };
  }

  // Server errors
  if (error.status >= 500 || error.name === 'InternalServerError') {
    return {
      status: 500,
      name: 'HealthServiceError',
      message: 'An error occurred while processing your health content request.',
      details: {
        code: 'HEALTH_SERVICE_ERROR',
        timestamp: new Date().toISOString(),
        guidance: 'Our technical team has been notified. For urgent medical needs, please contact healthcare providers directly.'
      }
    };
  }

  // Default error handling
  return {
    status: error.status || 500,
    name: error.name || 'HealthContentError',
    message: error.message || 'An unexpected error occurred with health content',
    details: {
      code: 'HEALTH_CONTENT_UNKNOWN_ERROR',
      originalError: process.env.NODE_ENV === 'development' ? error.message : undefined
    }
  };
}