const seed = require('../../scripts/seed');

module.exports = async () => {
  // Run the seed script
  await seed.bootstrap();
}; 