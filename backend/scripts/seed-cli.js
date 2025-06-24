#!/usr/bin/env node

const Strapi = require('@strapi/strapi');
const seed = require('./seed');

async function seedData() {
  try {
    // Initialize Strapi
    const strapi = await Strapi().load();
    
    // Run the seed script
    await seed.bootstrap();
    
    // Exit successfully
    process.exit(0);
  } catch (error) {
    console.error('Seeding failed:', error);
    process.exit(1);
  }
}

seedData(); 