const { createServer } = require('http');
const { parse } = require('url');
const next = require('next');
const fs = require('fs');
const path = require('path');

const testFilePath = 'C:\\Inetpub\\vhosts\\isfahantheaters.ir\\archives-8778.isfahantheaters.ir\\test.log';

// Logging function
const logToFile = (message) => {
  const timestamp = new Date().toISOString();
  const logMessage = `${timestamp} - ${message}\n`;
  fs.appendFile(testFilePath, logMessage, (err) => {
    if (err) {
      // logToFile('Error writing to test log file:', err);
    } else {
      // logToFile('Log entry added successfully.');
    }
  });
};

const port = process.env.PORT || 3016; // Use environment variable
const app = next({});
const handle = app.getRequestHandler();

app.prepare().then(() => {
  logToFile('Next.js app is prepared, starting server...');
  
  try {
    const server = createServer((req, res) => {
      let parsedUrl = parse(req.url, true);
      logToFile(`Incoming request: ${req.method} ${req.url}`);
      const changedUrl = req.url.replace('server.js', '');
      logToFile(`Change request Url: Old: ${req.url} New: ${changedUrl}`);
      req.url = changedUrl;
     parsedUrl = parse(req.url, true);
      handle(req, res, parsedUrl);
    });

    server.listen(port, () => {
      logToFile(`Server listening at http://localhost:${port}`);
      logToFile(`> Server listening at http://localhost:${port}`);
    });

    // Handle server errors
    server.on('error', (err) => {
      logToFile(`Server error: ${err.message}`);
      logToFile('Server error:', err);
    });

  } catch (err) {
    logToFile('Error creating server:', err);
    logToFile(`Error creating server: ${err.message}`);
  }

}).catch(err => {
  logToFile('Error during Next.js preparation:', err);
});
