// test/rateLimiter.test.js

const express = require("express");
const request = require("supertest");
const rateLimit = require("../lib/rateLimiter"); // Adjust the path as necessary

const createApp = () => {
  const app = express();
  const rateLimiterOptions = {
    windowMs: 1000, // 1 second for testing
    limits: {
      GET: 2, // Limit to 2 requests per minute for GET
      POST: 2, // Limit to 2 requests per minute for POST
      default: 2, // Default limit for other methods
    },
  };

  app.use(rateLimit(rateLimiterOptions));

  app.get("/api/resource", (req, res) => {
    res.send("Resource accessed!");
  });

  app.post("/api/resource", (req, res) => {
    res.send("Resource created!");
  });

  return app;
};

describe("Rate Limiter Middleware", () => {
  let app;

  beforeEach(() => {
    app = createApp();
  });

  it("should allow requests below the limit", async () => {
    const res1 = await request(app).get("/api/resource");
    expect(res1.status).toBe(200);
    expect(res1.text).toBe("Resource accessed!");

    const res2 = await request(app).get("/api/resource");
    expect(res2.status).toBe(200);
    expect(res2.text).toBe("Resource accessed!");
  });

  it("should block requests above the limit", async () => {
    const res1 = await request(app).get("/api/resource");
    expect(res1.status).toBe(200);

    const res2 = await request(app).get("/api/resource");
    expect(res2.status).toBe(200);

    const res3 = await request(app).get("/api/resource");
    expect(res3.status).toBe(429); // Rate limit exceeded
    expect(res3.body.error).toBe("Too many requests. Please try again later.");
  });

  it("should reset the limit after the time window", async () => {
    const res1 = await request(app).get("/api/resource");
    expect(res1.status).toBe(200);

    const res2 = await request(app).get("/api/resource");
    expect(res2.status).toBe(200);

    // Wait for the time window to reset
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const res3 = await request(app).get("/api/resource");
    expect(res3.status).toBe(200); // Should allow again after 1 second
  });
});
