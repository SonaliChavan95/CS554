const express = require('express');
const app = express();
const configRoutes = require('./routes');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 1. Keep a count of the total number of requests to the server
let totalRequests = 0;

app.use(async (req, res, next) => {
  totalRequests++;
  console.log("\n");
  console.log(`There have been ${totalRequests} requests made to the server`);
  next();
});

// 3. One which will count the number of requests that have been made to the current path
// Required: keep track of many times a particular URL has been requested, updating and logging with each request.
const pathsAccessed = {};

app.use(async (req, res, next) => {
  // if (!pathsAccessed[req.path]) pathsAccessed[req.path] = 0;
  if (!pathsAccessed[req.originalUrl]) pathsAccessed[req.originalUrl] = 0;

  pathsAccessed[req.originalUrl]++;

  console.log(
    `There have now been ${pathsAccessed[req.originalUrl]} requests made to ${req.protocol}://${req.headers.host}${req.originalUrl}`
  );
  next();
});

// Logging Middleware
// 2. Log all request bodies, as well as the url path they are requesting, and the HTTP verb they are using to make the request
app.use(async (req, res, next) => {
  console.log(`[${new Date().toUTCString()}]: ${req.method} ${req.protocol}://${req.headers.host}${req.originalUrl} \n${JSON.stringify(req.body)}`);
  next();
});

configRoutes(app);

app.listen(3000, () => {
  console.log("We've now got a server!");
  console.log('Your routes will be running on http://localhost:3000');
});