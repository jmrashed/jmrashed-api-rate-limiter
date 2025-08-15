# Jmrashed API Rate Limiter

[![NPM Version](https://img.shields.io/npm/v/jmrashed-api-rate-limiter.svg)](https://www.npmjs.com/package/jmrashed-api-rate-limiter)
[![NPM Downloads](https://img.shields.io/npm/dm/jmrashed-api-rate-limiter.svg)](https://www.npmjs.com/package/jmrashed-api-rate-limiter)
[![License](https://img.shields.io/npm/l/jmrashed-api-rate-limiter.svg)](https://github.com/jmrashed/jmrashed-api-rate-limiter/blob/main/LICENSE)
[![GitHub stars](https://img.shields.io/github/stars/jmrashed/jmrashed-api-rate-limiter.svg)](https://github.com/jmrashed/jmrashed-api-rate-limiter/stargazers)
[![GitHub forks](https://img.shields.io/github/forks/jmrashed/jmrashed-api-rate-limiter.svg)](https://github.com/jmrashed/jmrashed-api-rate-limiter/network/members)
[![GitHub issues](https://img.shields.io/github/issues/jmrashed/jmrashed-api-rate-limiter.svg)](https://github.com/jmrashed/jmrashed-api-rate-limiter/issues)

A flexible and lightweight middleware for Express.js that helps you protect your APIs from abuse and manage server load effectively. This package allows for dynamic rate limits based on user roles, API keys, or any other identifier, making it a versatile solution for any Node.js application.

## Table of Contents

- [Features](#features)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Usage](#usage)
- [Configuration Options](#configuration-options)
- [Example of Dynamic Limits](#example-of-dynamic-limits)
- [Screenshots](#screenshots)
- [Testing](#testing)
- [Deployment](#deployment)
- [Built With](#built-with)
- [FAQ](#faq)
- [Roadmap](#roadmap)
- [Release Notes](#release-notes)
- [Versioning](#versioning)
- [Contributing](#contributing)
- [Style Guide](#style-guide)
- [Code of Conduct](#code-of-conduct)
- [License](#license)
- [Author](#author)

## Features

- **Method-Based Rate Limiting**: Set different rate limits for various HTTP methods (e.g., `GET`, `POST`, `PUT`, `DELETE`).
- **Configurable Time Windows**: Define the duration for which requests are tracked (e.g., per minute, per hour).
- **Dynamic Limits**: Implement custom logic to assign different limits to different users, roles, or API keys.
- **In-Memory Storage**: A simple and fast in-memory store for tracking request counts, which can be extended for persistent storage solutions like Redis.
- **Lightweight and Performant**: Designed to have minimal impact on your application's performance.

## Prerequisites

Before you begin, ensure you have the following installed:

- [Node.js](https://nodejs.org/en/) (v14 or later recommended)
- [npm](https://www.npmjs.com/)

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

- `windowMs` (required): The duration of the rate-limiting window in milliseconds.
- `limits` (required): An object defining the number of allowed requests for each HTTP method. You can also set a `default` limit for methods that are not explicitly defined.

## Example of Dynamic Limits

To implement dynamic limits, you can modify the logic inside the middleware to use a unique identifier for each user, such as an API key or user ID. This allows you to apply different rate limits based on the user's plan or access level.

Here's an example of how you could modify the `rateLimiter.js` file to support dynamic limits based on a user's role:

```javascript
// lib/rateLimiter.js

const rateLimit = (options) => {
  const { windowMs, limits } = options;
  const requestCounts = new Map();

  return (req, res, next) => {
    // Use the user's role as the key, or fall back to the IP address
    const key = req.user ? req.user.role : req.ip; 

    const currentTime = Date.now();

    if (!requestCounts.has(key)) {
      requestCounts.set(key, { count: 0, startTime: currentTime });
    }

    const requestData = requestCounts.get(key);

    if (currentTime - requestData.startTime > windowMs) {
      requestData.count = 0;
      requestData.startTime = currentTime;
    }

    // Define different limits for different roles
    const limitsByRole = {
      admin: 100,
      premium: 50,
      free: 10,
    };

    const limit = limitsByRole[key] || limits[req.method] || limits.default;

    if (requestData.count < limit) {
      requestData.count += 1;
      next();
    } else {
      res.status(429).json({
        error: "Too many requests. Please try again later.",
      });
    }
  };
};

module.exports = rateLimit;
```

## Screenshots

Here are some screenshots of the rate limiter in action:

**Successful Request:**

![Successful Request](https://i.imgur.com/9Y2Y4fG.png)

**Rate Limit Exceeded:**

![Rate Limit Exceeded](https://i.imgur.com/5g9oH3g.png)

## Testing

To run the tests for this package, use the following command:

```bash
npm test
```

You can also test the rate limiter manually using tools like Postman or `curl`. Make multiple requests to your API endpoints and observe how the middleware enforces the defined limits.

## Deployment

When deploying an application that uses this middleware, ensure that your environment has Node.js and npm installed. You can then run your application using a process manager like PM2 or by simply running `node your-app.js`.

## Built With

- [Node.js](https://nodejs.org/en/)
- [Express.js](https://expressjs.com/)
- [Jest](https://jestjs.io/)
- [Supertest](https://www.npmjs.com/package/supertest)

## FAQ

**Q: Can I use this with a different framework, like Koa or Hapi?**

A: This middleware is specifically designed for Express.js. However, the core logic could be adapted for other frameworks.

**Q: Is it possible to use a persistent storage solution instead of in-memory storage?**

A: Yes, you can modify the `rateLimiter.js` file to use a different storage solution, such as Redis or a database. This is recommended for production environments.

## Roadmap

- [ ] Add support for more persistent storage solutions (e.g., Redis, Memcached).
- [ ] Add more advanced configuration options (e.g., whitelisting IPs, custom headers).
- [ ] Add support for more frameworks (e.g., Koa, Hapi).
- [ ] Add more comprehensive tests.

## Release Notes

### 2.0.1 - 2025-08-15

- Documentation: Added release notes and updated README for clarity.
- Improvements: Small improvements to dynamic limits examples and configuration docs.
- Tests: Minor test coverage tweaks and reliability improvements.
- Misc: Updated package metadata and README badges.

## Versioning

We use [SemVer](https://semver.org/) for versioning. For the versions available, see the [tags on this repository](https://github.com/jmrashed/jmrashed-api-rate-limiter/tags).

## Contributing

We welcome contributions from the community. Please read our [Contributing Guide](CONTRIBUTING.md) for more information on how to get started.

## Style Guide

This project follows the [Airbnb JavaScript Style Guide](https://github.com/airbnb/javascript). Please ensure that your contributions adhere to this style guide.

## Code of Conduct

Please read our [Code of Conduct](CODE_OF_CONDUCT.md) before contributing.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## Author

## Author

**Rashed Zaman**  

- GitHub: [https://github.com/jmrashed](https://github.com/jmrashed)  
- npm: [https://www.npmjs.com/~jmrashed](https://www.npmjs.com/~jmrashed)  
- Email: [jmrashed@gmail.com](mailto:jmrashed@gmail.com)  

Feel free to reach out for questions, feedback, or contributions!
