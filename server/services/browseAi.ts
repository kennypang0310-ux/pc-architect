/**
 * Browse AI Service
 * Handles all interactions with Browse AI API for web scraping
 */

interface BrowseAiTask {
  id: string;
  status: "running" | "successful" | "failed";
  capturedTexts?: Record<string, string>;
  finishedAt?: number;
  errorMessage?: string;
}

interface BrowseAiRobot {
  id: string;
  name: string;
  inputParameters: Array<{
    name: string;
    type: string;
    required: boolean;
  }>;
}

interface PriceScrapingResult {
  productName: string;
  price: string;
  currency: string;
  availability: string;
  url: string;
  retailer: string;
  scrapedAt: number;
}

const BROWSE_AI_API_URL = "https://api.browse.ai/v2";
const API_KEY = process.env.BROWSE_AI_API_KEY;

if (!API_KEY) {
  console.warn("BROWSE_AI_API_KEY is not set. Browse AI integration will not work.");
}

/**
 * Get authorization header for Browse AI API
 */
function getAuthHeader() {
  if (!API_KEY) {
    throw new Error("BROWSE_AI_API_KEY is not configured");
  }
  return {
    Authorization: `Bearer ${API_KEY}`,
    "Content-Type": "application/json",
  };
}

/**
 * List all available robots
 */
export async function listRobots(): Promise<BrowseAiRobot[]> {
  try {
    const response = await fetch(`${BROWSE_AI_API_URL}/robots`, {
      method: "GET",
      headers: getAuthHeader(),
    });

    if (!response.ok) {
      throw new Error(`Browse AI API error: ${response.statusText}`);
    }

    const data = await response.json();
    return data.robots?.items || [];
  } catch (error) {
    console.error("Error listing Browse AI robots:", error);
    throw error;
  }
}

/**
 * Get details of a specific robot
 */
export async function getRobotDetails(robotId: string): Promise<BrowseAiRobot> {
  try {
    const response = await fetch(`${BROWSE_AI_API_URL}/robots/${robotId}`, {
      method: "GET",
      headers: getAuthHeader(),
    });

    if (!response.ok) {
      throw new Error(`Browse AI API error: ${response.statusText}`);
    }

    const data = await response.json();
    return data.result;
  } catch (error) {
    console.error(`Error getting robot details for ${robotId}:`, error);
    throw error;
  }
}

/**
 * Run a task on a specific robot
 */
export async function runTask(
  robotId: string,
  inputParameters: Record<string, string>
): Promise<string> {
  try {
    const response = await fetch(`${BROWSE_AI_API_URL}/robots/${robotId}/tasks`, {
      method: "POST",
      headers: getAuthHeader(),
      body: JSON.stringify({ inputParameters }),
    });

    if (!response.ok) {
      throw new Error(`Browse AI API error: ${response.statusText}`);
    }

    const data = await response.json();
    return data.result?.id;
  } catch (error) {
    console.error(`Error running task on robot ${robotId}:`, error);
    throw error;
  }
}

/**
 * Get task status and results
 */
export async function getTaskStatus(robotId: string, taskId: string): Promise<BrowseAiTask> {
  try {
    const response = await fetch(`${BROWSE_AI_API_URL}/robots/${robotId}/tasks/${taskId}`, {
      method: "GET",
      headers: getAuthHeader(),
    });

    if (!response.ok) {
      throw new Error(`Browse AI API error: ${response.statusText}`);
    }

    const data = await response.json();
    return data.result;
  } catch (error) {
    console.error(`Error getting task status for ${taskId}:`, error);
    throw error;
  }
}

/**
 * Wait for task completion with timeout
 */
export async function waitForTaskCompletion(
  robotId: string,
  taskId: string,
  maxWaitTime: number = 30000 // 30 seconds
): Promise<BrowseAiTask> {
  const startTime = Date.now();
  const pollInterval = 1000; // Poll every 1 second

  while (Date.now() - startTime < maxWaitTime) {
    const task = await getTaskStatus(robotId, taskId);

    if (task.status === "successful" || task.status === "failed") {
      return task;
    }

    // Wait before next poll
    await new Promise((resolve) => setTimeout(resolve, pollInterval));
  }

  throw new Error(`Task ${taskId} did not complete within ${maxWaitTime}ms`);
}

/**
 * Scrape prices for a PC component
 * This is a generic function that can work with any robot
 */
export async function scrapeComponentPrice(
  robotId: string,
  searchQuery: string,
  retailer: string
): Promise<PriceScrapingResult | null> {
  try {
    // Run the task
    const taskId = await runTask(robotId, {
      searchQuery,
    });

    if (!taskId) {
      throw new Error("Failed to create task");
    }

    // Wait for completion
    const task = await waitForTaskCompletion(robotId, taskId);

    if (task.status === "failed") {
      console.error(`Task failed: ${task.errorMessage}`);
      return null;
    }

    if (!task.capturedTexts) {
      console.error("No captured data from task");
      return null;
    }

    // Parse the captured data
    const capturedTexts = task.capturedTexts;

    return {
      productName: capturedTexts.productName || capturedTexts.title || searchQuery,
      price: capturedTexts.price || "N/A",
      currency: capturedTexts.currency || "USD",
      availability: capturedTexts.availability || "Unknown",
      url: capturedTexts.url || "",
      retailer,
      scrapedAt: task.finishedAt || Date.now(),
    };
  } catch (error) {
    console.error(`Error scraping prices from ${retailer}:`, error);
    return null;
  }
}

/**
 * Get price for a specific component from multiple retailers
 */
export async function getPriceFromRetailers(
  componentType: string,
  componentName: string,
  region: string,
  robotIds: Record<string, string> // Map of retailer to robot ID
): Promise<PriceScrapingResult[]> {
  const searchQuery = `${componentType} ${componentName}`;
  const results: PriceScrapingResult[] = [];

  // Scrape from all retailers in parallel
  const scrapingPromises = Object.entries(robotIds).map(([retailer, robotId]) =>
    scrapeComponentPrice(robotId, searchQuery, retailer)
      .then((result) => {
        if (result) {
          results.push(result);
        }
      })
      .catch((error) => {
        console.error(`Failed to scrape from ${retailer}:`, error);
      })
  );

  await Promise.all(scrapingPromises);

  return results;
}

/**
 * Health check - verify API connection
 */
export async function healthCheck(): Promise<boolean> {
  try {
    const response = await fetch(`${BROWSE_AI_API_URL}/status`, {
      method: "GET",
      headers: getAuthHeader(),
    });

    if (!response.ok) {
      return false;
    }

    const data = await response.json();
    return data.statusCode === 200;
  } catch (error) {
    console.error("Browse AI health check failed:", error);
    return false;
  }
}
