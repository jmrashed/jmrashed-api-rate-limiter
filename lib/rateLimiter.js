// lib/rateLimiter.js

const rateLimit = (options) => {
  const { windowMs, limits } = options;
  const requestCounts = new Map();

  return (req, res, next) => {
    const key = req.ip; // You can customize the key to use user ID or API key
    const currentTime = Date.now();

    // Initialize request count if not set
    if (!requestCounts.has(key)) {
      requestCounts.set(key, { count: 0, startTime: currentTime });
    }

    const requestData = requestCounts.get(key);

    // Reset count if the time window has passed
    if (currentTime - requestData.startTime > windowMs) {
      requestData.count = 0;
      requestData.startTime = currentTime;
    }

    // Determine the limit for the request method
    const limit = limits[req.method] || limits.default;

    if (requestData.count < limit) {
      requestData.count += 1; // Increment the count
      next(); // Allow the request to continue
    } else {
      // Rate limit exceeded
      res.status(429).json({
        error: "Too many requests. Please try again later.",
      });
    }
  };
};

module.exports = rateLimit;
