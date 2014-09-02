module.exports = {
  mongodb: {
    server: 'localhost',
    port: 27017,
    database: 'page-analytics',
	connectionString: 'mongodb://localhost/page-analytics'
  },
  analytics: {
	excludes: ['/page-analytics/usages'] // A list of urls to exclude from being tracked -- an exact match is performed
  }
};
