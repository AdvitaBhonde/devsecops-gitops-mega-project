const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();

router.get('/', (req, res) => {
  const dbState = mongoose.connection.readyState;
  const dbStatusMap = {
    0: 'disconnected',
    1: 'connected',
    2: 'connecting',
    3: 'disconnecting'
  };

  const isHealthy = dbState === 1 || dbState === 2 || process.env.SKIP_DB_HEALTH === 'true';

  res.status(isHealthy ? 200 : 503).json({
    status: isHealthy ? 'UP' : 'DOWN',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    service: 'devsecops-backend',
    database: {
      status: dbStatusMap[dbState] || 'unknown',
      connected: dbState === 1
    }
  });
});

module.exports = router;
