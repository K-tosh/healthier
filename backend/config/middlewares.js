module.exports = [
  'strapi::errors',
  'strapi::security',
  {
    name: 'strapi::cors',
    config: {
      enabled: true,
      origin: ['http://localhost:3000', // Allow your frontend origin
             'https://52d52640-c024-4dfc-9e73-977c4e8be44e-00-2uz4cnfou0ic1.picard.replit.dev/'
      ],
      // methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
      headers: [
        'Content-Type',
        'Authorization',
        'strapi-response-format', // <-- This is the important one!
        'Origin',
        'Accept',
        'X-Requested-With',
        'Access-Control-Allow-Origin',
        'Access-Control-Allow-Credentials',
      ],
    },
  },
  'strapi::poweredBy',
  'strapi::logger',
  'strapi::query',
  'strapi::body',
  'strapi::session',
  'strapi::favicon',
  'strapi::public',
];
