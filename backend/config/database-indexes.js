'use strict';

/**
 * Database Indexes for Health Content Performance
 * This file defines database indexes to optimize frequently searched health content
 */

module.exports = {
  // Indexes for Article content type
  articles: [
    {
      name: 'idx_articles_article_type',
      fields: ['article_type'],
      description: 'Index for filtering articles by type (symptoms, treatment, etc.)'
    },
    {
      name: 'idx_articles_target_audience',
      fields: ['target_audience'],
      description: 'Index for filtering articles by target audience'
    },
    {
      name: 'idx_articles_medically_reviewed',
      fields: ['medically_reviewed'],
      description: 'Index for filtering reviewed vs unreviewed articles'
    },
    {
      name: 'idx_articles_priority',
      fields: ['priority', 'created_at'],
      description: 'Composite index for featured content ordering'
    },
    {
      name: 'idx_articles_search',
      fields: ['title', 'description'],
      description: 'Index for text search on articles'
    },
    {
      name: 'idx_articles_health_disclaimer',
      fields: ['health_disclaimer'],
      description: 'Index for filtering articles with health disclaimers'
    },
    {
      name: 'idx_articles_reading_time',
      fields: ['reading_time'],
      description: 'Index for filtering articles by reading time'
    }
  ],

  // Indexes for Condition content type
  conditions: [
    {
      name: 'idx_conditions_severity',
      fields: ['severity'],
      description: 'Index for filtering conditions by severity level'
    },
    {
      name: 'idx_conditions_emergency',
      fields: ['is_emergency'],
      description: 'Index for quickly finding emergency conditions'
    },
    {
      name: 'idx_conditions_priority_severity',
      fields: ['priority', 'severity'],
      description: 'Composite index for emergency condition ordering'
    },
    {
      name: 'idx_conditions_name_search',
      fields: ['name'],
      description: 'Index for condition name searches'
    },
    {
      name: 'idx_conditions_kenya_prevalence',
      fields: ['prevalence_in_kenya'],
      description: 'Index for Kenya-specific condition data'
    }
  ],

  // Indexes for Symptom content type
  symptoms: [
    {
      name: 'idx_symptoms_severity',
      fields: ['common_severity'],
      description: 'Index for filtering symptoms by severity'
    },
    {
      name: 'idx_symptoms_body_system',
      fields: ['body_system'],
      description: 'Index for filtering symptoms by body system'
    },
    {
      name: 'idx_symptoms_care_urgency',
      fields: ['when_to_seek_care'],
      description: 'Index for filtering symptoms by care urgency'
    },
    {
      name: 'idx_symptoms_kenya_common',
      fields: ['common_in_kenya'],
      description: 'Index for Kenya-specific symptom data'
    },
    {
      name: 'idx_symptoms_emergency_care',
      fields: ['when_to_seek_care', 'common_severity'],
      description: 'Composite index for emergency symptom identification'
    }
  ],

  // Indexes for Treatment content type
  treatments: [
    {
      name: 'idx_treatments_type',
      fields: ['type'],
      description: 'Index for filtering treatments by type (medication, lifestyle, etc.)'
    },
    {
      name: 'idx_treatments_cost',
      fields: ['estimated_cost'],
      description: 'Index for filtering treatments by cost'
    },
    {
      name: 'idx_treatments_kenya_available',
      fields: ['available_in_kenya'],
      description: 'Index for Kenya-available treatments'
    },
    {
      name: 'idx_treatments_prescription',
      fields: ['requires_prescription'],
      description: 'Index for prescription vs over-the-counter treatments'
    },
    {
      name: 'idx_treatments_emergency_available',
      fields: ['type', 'available_in_kenya'],
      description: 'Composite index for emergency treatments available in Kenya'
    }
  ],

  // Indexes for Health Topic content type
  health_topics: [
    {
      name: 'idx_health_topics_active',
      fields: ['is_active'],
      description: 'Index for filtering active health topics'
    },
    {
      name: 'idx_health_topics_priority',
      fields: ['priority', 'is_active'],
      description: 'Composite index for topic ordering'
    },
    {
      name: 'idx_health_topics_name',
      fields: ['name'],
      description: 'Index for health topic name searches'
    }
  ],

  // Relationship indexes for better join performance
  relationships: [
    {
      name: 'idx_articles_conditions_link',
      table: 'articles_related_conditions_links',
      fields: ['article_id', 'condition_id'],
      description: 'Index for article-condition relationships'
    },
    {
      name: 'idx_conditions_symptoms_link',
      table: 'symptoms_related_conditions_links',
      fields: ['symptom_id', 'condition_id'],
      description: 'Index for symptom-condition relationships'
    },
    {
      name: 'idx_treatments_conditions_link',
      table: 'treatments_related_conditions_links',
      fields: ['treatment_id', 'condition_id'],
      description: 'Index for treatment-condition relationships'
    },
    {
      name: 'idx_health_topics_conditions_link',
      table: 'health_topics_related_conditions_links',
      fields: ['health_topic_id', 'condition_id'],
      description: 'Index for health topic-condition relationships'
    },
    {
      name: 'idx_health_topics_articles_link',
      table: 'health_topics_featured_articles_links',
      fields: ['health_topic_id', 'article_id'],
      description: 'Index for health topic-featured article relationships'
    }
  ],

  // General performance indexes
  general: [
    {
      name: 'idx_created_at',
      fields: ['created_at'],
      description: 'Index for date-based sorting and filtering across all content types'
    },
    {
      name: 'idx_updated_at',
      fields: ['updated_at'],
      description: 'Index for recently updated content queries'
    },
    {
      name: 'idx_published_at',
      fields: ['published_at'],
      description: 'Index for published content filtering'
    },
    {
      name: 'idx_slug',
      fields: ['slug'],
      description: 'Unique index for slug-based lookups'
    }
  ]
};

/**
 * Function to create indexes in SQLite
 * This would be called during application startup or migration
 */
function createHealthContentIndexes(knex) {
  const indexes = module.exports;
  const promises = [];

  // Create indexes for each content type
  Object.entries(indexes).forEach(([contentType, indexList]) => {
    if (contentType === 'relationships' || contentType === 'general') {
      // Handle special cases
      return;
    }

    indexList.forEach(index => {
      const tableName = contentType;
      const indexName = index.name;
      const fields = index.fields;

      promises.push(
        knex.schema.table(tableName, table => {
          if (fields.length === 1) {
            table.index(fields[0], indexName);
          } else {
            table.index(fields, indexName);
          }
        }).catch(err => {
          // Index might already exist, log but don't fail
          console.log(`Index ${indexName} might already exist:`, err.message);
        })
      );
    });
  });

  return Promise.all(promises);
}

module.exports.createHealthContentIndexes = createHealthContentIndexes;