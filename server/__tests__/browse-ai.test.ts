import { describe, it, expect, beforeAll } from "vitest";

describe("Browse AI API Integration", () => {
  let apiKey: string;

  beforeAll(() => {
    apiKey = process.env.BROWSE_AI_API_KEY || "";
    if (!apiKey) {
      throw new Error("BROWSE_AI_API_KEY environment variable is not set");
    }
  });

  it("should validate Browse AI API credentials by checking API status", async () => {
    const response = await fetch("https://api.browse.ai/v2/status", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${apiKey}`,
      },
    });

    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data.statusCode).toBe(200);
    expect(data.messageCode).toBe("success");
  });

  it("should list available robots", async () => {
    const response = await fetch("https://api.browse.ai/v2/robots", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${apiKey}`,
      },
    });

    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data.statusCode).toBe(200);
    expect(data.messageCode).toBe("success");
    expect(data.robots).toBeDefined();
    expect(Array.isArray(data.robots.items)).toBe(true);
  });

  it("should have valid API key format", () => {
    // Browse AI API key format: workspace-id:api-key
    const parts = apiKey.split(":");
    expect(parts.length).toBe(2);
    expect(parts[0].length).toBeGreaterThan(0);
    expect(parts[1].length).toBeGreaterThan(0);
  });
});
