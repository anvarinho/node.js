const Statistics = require('../models/stats');

// Function to add statistics to the database
async function writeStats(req, res) {
  try {
    const remoteAddress = req.ip;
    const method = req.method;
    const timestamp = new Date();
    const route = req.baseUrl + req.path;
    const requestHeaders = req.headers;
    const queryParameters = req.query || "";
    const sessionId = req.sessionID // Use CSRF token for authenticatedUser
    const statusCode = res.statusCode || 0

    // Create a new Stats document
    const stats = new Statistics({
      timestamp: timestamp,
      statusCode: statusCode,
      method: method,
      route: route,
      sessionID: sessionId, // Use authenticatedUser as sessionID
      remoteAddress: remoteAddress,
      query: queryParameters ,
      requestHeaders: requestHeaders,
    });

    // Save to the database
    await stats.save();

    console.log('Statistics saved successfully');
  } catch (error) {
    console.error('Error saving statistics:', error);
    throw new Error('An error occurred while saving statistics');
  }
}

module.exports = writeStats;
