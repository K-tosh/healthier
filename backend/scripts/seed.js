const fs = require('fs');
const path = require('path');

async function isFirstRun() {
  const articles = await strapi.entityService.findMany('api::article.article', {
    limit: 1
  });
  return !articles || articles.length === 0;
}

async function seedLivingHealthy() {
  console.log('Seeding Living Healthy categories...');
  const data = require('../src/api/living-healthy/content/sample-data.json');
  
  for (const category of data['living-healthy']) {
    try {
      await strapi.entityService.create('api::living-healthy.living-healthy', {
        data: {
          ...category,
          publishedAt: new Date()
        }
      });
      console.log(`Created Living Healthy category: ${category.title}`);
    } catch (error) {
      console.error(`Error creating Living Healthy category ${category.title}:`, error.message);
    }
  }
}

async function seedTools() {
  console.log('Seeding Tools...');
  const data = require('../src/api/tool/content/sample-data.json');
  
  for (const tool of data.tools) {
    try {
      await strapi.entityService.create('api::tool.tool', {
        data: {
          ...tool,
          publishedAt: new Date()
        }
      });
      console.log(`Created Tool: ${tool.title}`);
    } catch (error) {
      console.error(`Error creating Tool ${tool.title}:`, error.message);
    }
  }
}

async function seedArticles() {
  console.log('Seeding Articles...');
  const data = require('../src/api/article/content/sample-data.json');
  
  // Get Living Healthy categories to link articles
  const categories = await strapi.entityService.findMany('api::living-healthy.living-healthy');
  const categoryMap = categories.reduce((acc, cat) => {
    acc[cat.slug] = cat.id;
    return acc;
  }, {});

  for (const article of data.articles) {
    try {
      const articleData = { ...article };
      
      // Link to Living Healthy category if specified
      if (article.livingHealthyCategory) {
        const categoryId = categoryMap[article.livingHealthyCategory];
        if (categoryId) {
          articleData.livingHealthyCategory = categoryId;
        }
        delete articleData.livingHealthyCategory; // Remove the slug reference
      }

      await strapi.entityService.create('api::article.article', {
        data: {
          ...articleData,
          publishedAt: new Date()
        }
      });
      console.log(`Created Article: ${article.title}`);
    } catch (error) {
      console.error(`Error creating Article ${article.title}:`, error.message);
    }
  }
}

async function createSeedImages() {
  console.log('Creating placeholder images...');
  const uploadsDir = path.join(__dirname, '../public/uploads');
  
  // Ensure uploads directory exists
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }

  // Create placeholder images for different content types
  const placeholders = {
    'article-cover.jpg': 'https://picsum.photos/800/450', // 16:9 ratio for articles
    'living-healthy.jpg': 'https://picsum.photos/400/400', // Square for categories
    'tool-icon.png': 'https://via.placeholder.com/100' // Icons for tools
  };

  for (const [filename, url] of Object.entries(placeholders)) {
    try {
      const response = await fetch(url);
      const buffer = await response.buffer();
      fs.writeFileSync(path.join(uploadsDir, filename), buffer);
      console.log(`Created placeholder image: ${filename}`);
    } catch (error) {
      console.error(`Error creating placeholder image ${filename}:`, error.message);
    }
  }
}

module.exports = {
  async bootstrap() {
    if (await isFirstRun()) {
      try {
        await createSeedImages();
        await seedLivingHealthy();
        await seedTools();
        await seedArticles();
        console.log('Seed completed successfully!');
      } catch (error) {
        console.error('Seed error:', error);
      }
    } else {
      console.log('Database is not empty. Skipping seed.');
    }
  }
}; 