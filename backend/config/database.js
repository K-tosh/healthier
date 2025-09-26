const path = require('path');

module.exports = ({ env }) => ({
  connection: {
    client: 'sqlite',
    connection: {
      filename: path.join(__dirname, '..', env('DATABASE_FILENAME', '.tmp/data.db')),
    },
    useNullAsDefault: true,
    // SQLite performance optimizations
    pool: {
      min: 2,
      max: 10,
      createTimeoutMillis: 3000,
      acquireTimeoutMillis: 30000,
      idleTimeoutMillis: 30000,
      reapIntervalMillis: 1000,
      createRetryIntervalMillis: 100,
    },
    acquireConnectionTimeout: 60000,
  },
  // Database settings for health content optimization
  settings: {
    // Enable WAL mode for better concurrent access
    initOptions: {
      pragma: [
        'PRAGMA journal_mode = WAL;',
        'PRAGMA cache_size = 10000;',
        'PRAGMA temp_store = memory;',
        'PRAGMA mmap_size = 268435456;', // 256MB
        'PRAGMA optimize;'
      ]
    }
  }
});
