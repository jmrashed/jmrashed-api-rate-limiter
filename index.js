// index.js

const express = require("express");
const rateLimit = require("./lib/rateLimiter");

const app = express();
const PORT = process.env.PORT || 3000;

// Configure rate limiter options
const rateLimiterOptions = {
  windowMs: 60 * 1000, // 1 minute
  limits: {
    GET: 10, // 10 requests per minute for GET
    POST: 5, // 5 requests per minute for POST
    default: 15, // Default limit for other methods
  },
};

// Apply rate limiter middleware
app.use(rateLimit(rateLimiterOptions));

// Sample route
app.get("/api/resource", (req, res) => {
  res.send("Resource accessed!");
});

app.listen(PORT, () => {
  console.log(`Server running on port http://localhost:${PORT}`);
});
