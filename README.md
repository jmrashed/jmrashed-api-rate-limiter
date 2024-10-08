# Jmrashed API Rate Limiter

A middleware for Express.js that helps limit API calls to prevent abuse and manage load. This package allows for dynamic rate limits based on user roles or API keys.

## Features

- Rate limiting based on HTTP methods (GET, POST, etc.)
- Configurable rate limits
- Dynamic limits based on user roles or API keys
- In-memory storage for rate limit tracking (can be modified for persistent storage)

## Installation

To install the Jmrashed API Rate Limiter, use npm:

```bash
npm install jmrashed-api-rate-limiter
```

## Usage

Here’s how to integrate the middleware into your Express.js application:

```javascript
const express = require('express');
const rateLimit = require('jmrashed-api-rate-limiter');

const app = express();
const PORT = process.env.PORT || 3000;

// Configure rate limiter options
const rateLimiterOptions = {
  windowMs: 60 * 1000, // 1 minute
  limits: {
    GET: 10,  // 10 requests per minute for GET
    POST: 5,  // 5 requests per minute for POST
    default: 15 // Default limit for other methods
  }
};

// Apply rate limiter middleware
app.use(rateLimit(rateLimiterOptions));

// Sample route
app.get('/api/resource', (req, res) => {
  res.send('Resource accessed!');
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
```

## Configuration Options

- `windowMs`: Duration in milliseconds for the rate limit window (default is 60 seconds).
- `limits`: An object defining the number of requests allowed for each HTTP method. You can set a default limit for methods not explicitly defined.

## Example of Dynamic Limits

To implement dynamic limits based on user roles or API keys, modify the `key` variable within the middleware to reflect the user's identity. This allows for different limits based on the user's access level.

## Testing

You can test the rate limiter using tools like Postman or curl. Make several requests to the defined endpoint and observe how the middleware enforces the limits.

## Contributing

Contributions are welcome! If you have suggestions or improvements, please open an issue or submit a pull request.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## Author

**Jmrashed** 