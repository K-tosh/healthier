const path = require('path');

module.exports = ({ env }) => ({
  connection: {
    client: 'sqlite',
    connection: {
      filename: path.join(__dirname, '..', env('DATABASE_FILENAME', '.tmp/data.db')),
    },
    useNullAsDefault: true,
    // Enhanced SQLite settings for better concurrency handling
    pool: {
      min: 1, // Single connection works better for SQLite
      max: 1,
      createTimeoutMillis: 10000,
      acquireTimeoutMillis: 60000,
      idleTimeoutMillis: 30000,
      reapIntervalMillis: 1000,
      createRetryIntervalMillis: 200,
      // Add connection initialization for better lock handling
      afterCreate: (conn, cb) => {
        // Enable WAL mode for better concurrent access
        conn.exec('PRAGMA journal_mode = WAL');
        // Increase busy timeout to handle locks
        conn.exec('PRAGMA busy_timeout = 30000'); 
        // Other optimizations
        conn.exec('PRAGMA cache_size = 10000');
        conn.exec('PRAGMA temp_store = memory');
        conn.exec('PRAGMA synchronous = NORMAL');
        cb();
      }
    },
    acquireConnectionTimeout: 60000,
  },
  // Database settings for health content optimization
  settings: {
    // Enable WAL mode for better concurrent access
    initOptions: {
      pragma: [
        'PRAGMA journal_mode = WAL;',
        'PRAGMA busy_timeout = 30000;', // 30 second timeout for locks
        'PRAGMA cache_size = 10000;',
        'PRAGMA temp_store = memory;',
        'PRAGMA mmap_size = 268435456;', // 256MB
        'PRAGMA synchronous = NORMAL;',
        'PRAGMA optimize;'
      ]
    }
  }
});
