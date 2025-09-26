module.exports = [
  'strapi::errors',
  'strapi::security',
  {
    name: 'strapi::cors',
    config: {
      origin: [
        'http://localhost:3000', // Local development
        'https://52d52640-c024-4dfc-9e73-977c4e8be44e-00-2uz4cnfou0ic1.picard.replit.dev/',
        'https://healthierke.com', // Production domain
        'https://*.healthierke.com' // Subdomains
      ],
      headers: [
        'Content-Type',
        'Authorization',
        'strapi-response-format',
        'Origin',
        'Accept',
        'X-Requested-With',
        'Access-Control-Allow-Origin',
        'Access-Control-Allow-Credentials',
        'X-Health-Content-Type', // Custom header for health content tracking
        'X-Emergency-Request', // Custom header for emergency content requests
      ],
      credentials: true,
    },
  },
  'strapi::poweredBy',
  'strapi::logger',
  'strapi::query',
  'strapi::body',
  'strapi::session',
  'strapi::favicon',
  'strapi::public',
  // Health content response transformer (after body parser)
  'global::health-error-handler',
];
