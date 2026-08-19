const express = require('express');
const ServerSetup = require('./utils/serverSetup.js');

const app = express();
const serverSetup = new ServerSetup({
  appName: 'Торопец - Выставочный зал',
  port: 3002,
});

serverSetup.setupStaticFiles(app, express);

serverSetup.startServer(app).catch((error) => {
  console.error('Failed to start launcher:', error);
  process.exit(1);
});
