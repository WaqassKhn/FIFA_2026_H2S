import { createServer } from "node:http";
import { existsSync, readFileSync } from "node:fs";
import { readFile, stat } from "node:fs/promises";
import { extname, isAbsolute, join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { DATA_LAST_REVIEWED, DATA_SOURCES, LANGUAGES, MATCH_FIXTURES, ROLES, SCENARIOS, VENUES } from "../src/data/venues.js";
import { answerQuestion } from "../src/assistant.js";
import { buildDecisionCards, buildTelemetry, buildVenueSummary, findVenue, getRoutePlan } from "../src/opsEngine.js";

const __dirname = fileURLToPath(new URL(".", import.meta.url));
const rootDir = resolve(__dirname, "..");
const publicDir = join(rootDir, "public");

loadDotEnv(join(rootDir, ".env"));

const port = Number(process.env.PORT || 4173);

const mimeTypes = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".ico": "image/x-icon"
};

const server = createServer(async (request, response) => {
  try {
    const url = new URL(request.url, `http://${request.headers.host || "localhost"}`);

    if (url.pathname.startsWith("/api/")) {
      await handleApi(request, response, url);
      return;
    }

    await serveStatic(response, url.pathname);
  } catch (error) {
    sendJson(response, 500, { error: error instanceof Error ? error.message : "Internal server error" });
  }
});

server.listen(port, () => {
  console.log(`Matchday Stadium Copilot running at http://localhost:${port}`);
});

/**
 * Handles incoming API requests for health, venues, telemetry, and the GenAI assistant.
 * @param {import("node:http").IncomingMessage} request - The incoming HTTP request.
 * @param {import("node:http").ServerResponse} response - The outgoing HTTP response.
 * @param {URL} url - The parsed request URL object.
 */
async function handleApi(request, response, url) {
  if (request.method === "GET" && url.pathname === "/api/health") {
    sendJson(response, 200, {
      ok: true,
      app: "Matchday Stadium Copilot",
      openAiConfigured: Boolean(process.env.OPENAI_API_KEY),
      groqConfigured: Boolean(process.env.GROQ_API_KEY),
      dataLastReviewed: DATA_LAST_REVIEWED
    });
    return;
  }

  if (request.method === "GET" && url.pathname === "/api/venues") {
    sendJson(response, 200, {
      dataLastReviewed: DATA_LAST_REVIEWED,
      sources: DATA_SOURCES,
      languages: LANGUAGES,
      roles: ROLES,
      scenarios: SCENARIOS,
      matches: MATCH_FIXTURES,
      venues: VENUES.map(buildVenueSummary)
    });
    return;
  }

  if (request.method === "GET" && url.pathname === "/api/telemetry") {
    const venueId = url.searchParams.get("venueId") || VENUES[0].id;
    const scenarioId = url.searchParams.get("scenarioId") || "baseline";
    const venue = findVenue(venueId);

    let externalWeather = null;
    try {
      externalWeather = await fetchRealTimeWeather(venue.coordinates.lat, venue.coordinates.lng);
    } catch (error) {
      console.warn(`[Weather API Warning] Failed to fetch weather for lat=${venue.coordinates.lat}, lng=${venue.coordinates.lng}: ${error.message}`);
    }

    const telemetry = buildTelemetry(venue.id, scenarioId, new Date(), externalWeather);
    sendJson(response, 200, {
      venue: buildVenueSummary(venue),
      telemetry,
      route: getRoutePlan(venue.id, url.searchParams.get("destination") || "gate", url.searchParams.get("mobilityNeed") || "none", telemetry),
      cards: buildDecisionCards(venue, telemetry)
    });
    return;
  }

  if (request.method === "POST" && url.pathname === "/api/assistant") {
    const body = await readJson(request);
    const result = await answerQuestion(body, {
      apiKey: process.env.OPENAI_API_KEY,
      model: process.env.OPENAI_MODEL,
      groqApiKey: process.env.GROQ_API_KEY,
      groqModel: process.env.GROQ_MODEL,
      geminiApiKey: process.env.GEMINI_API_KEY,
      geminiModel: process.env.GEMINI_MODEL
    });
    sendJson(response, 200, result);
    return;
  }

  sendJson(response, 404, { error: "Not found" });
}

/**
 * Serves static assets from the public directory.
 * @param {import("node:http").ServerResponse} response - The outgoing HTTP response.
 * @param {string} pathname - The clean request pathname.
 */
async function serveStatic(response, pathname) {
  const cleanPath = pathname === "/" ? "/index.html" : pathname;
  const requestedPath = resolve(publicDir, `.${cleanPath}`);
  const publicRelativePath = relative(publicDir, requestedPath);

  if (publicRelativePath.startsWith("..") || isAbsolute(publicRelativePath)) {
    sendJson(response, 403, { error: "Forbidden" });
    return;
  }

  let filePath = requestedPath;
  let fileStat;
  try {
    fileStat = await stat(filePath);
  } catch {
    filePath = join(publicDir, "index.html");
    fileStat = await stat(filePath);
  }

  if (fileStat.isDirectory()) {
    filePath = join(filePath, "index.html");
  }

  const content = await readFile(filePath);
  response.writeHead(200, {
    "Content-Type": mimeTypes[extname(filePath)] || "application/octet-stream",
    "Cache-Control": "no-store"
  });
  response.end(content);
}

/**
 * Reads and parses JSON payloads from incoming HTTP POST requests safely.
 * @param {import("node:http").IncomingMessage} request - The incoming HTTP request stream.
 * @returns {Promise<Object>} The parsed JSON payload.
 */
async function readJson(request) {
  const chunks = [];
  let totalBytes = 0;
  for await (const chunk of request) {
    totalBytes += chunk.length;
    if (totalBytes > 1_000_000) {
      throw new Error("Request body too large");
    }
    chunks.push(chunk);
  }
  const raw = Buffer.concat(chunks).toString("utf8");
  if (!raw.trim()) return {};
  return JSON.parse(raw);
}

/**
 * Sends a structured JSON payload with appropriate content-type and cache control.
 * @param {import("node:http").ServerResponse} response - The outgoing HTTP response.
 * @param {number} statusCode - The HTTP status code to return.
 * @param {Object} payload - The object structure to send.
 */
function sendJson(response, statusCode, payload) {
  response.writeHead(statusCode, {
    "Content-Type": "application/json; charset=utf-8",
    "Cache-Control": "no-store"
  });
  response.end(JSON.stringify(payload));
}

/**
 * Loads environment key-value pairs from a local .env configuration file.
 * @param {string} filePath - The absolute path to the .env file.
 */
function loadDotEnv(filePath) {
  if (!existsSync(filePath)) return;
  const lines = readFileSync(filePath, "utf8").split(/\r?\n/);
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const separatorIndex = trimmed.indexOf("=");
    if (separatorIndex <= 0) continue;
    const key = trimmed.slice(0, separatorIndex).trim();
    let value = trimmed.slice(separatorIndex + 1).trim();
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }
    if (!Object.hasOwn(process.env, key)) {
      process.env[key] = value;
    }
  }
}

/**
 * Queries real-time weather details for stadium coordinates using the Open-Meteo API.
 * @param {number} lat - The latitude coordinate.
 * @param {number} lng - The longitude coordinate.
 * @returns {Promise<Object>} The parsed weather telemetry fields.
 */
async function fetchRealTimeWeather(lat, lng) {
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&current=temperature_2m,relative_humidity_2m,apparent_temperature,wind_speed_10m,weather_code&temperature_unit=fahrenheit`;
  const response = await fetch(url, { signal: AbortSignal.timeout(4000) });
  if (!response.ok) {
    throw new Error(`Open-Meteo returned status ${response.status}`);
  }
  const data = await response.json();
  const current = data?.current;
  if (!current) throw new Error("No current weather data found in Open-Meteo payload");

  return {
    tempF: Math.round(current.temperature_2m),
    apparentTempF: Math.round(current.apparent_temperature),
    humidity: Math.round(current.relative_humidity_2m),
    windSpeedMph: Math.round(current.wind_speed_10m),
    weatherCode: current.weather_code
  };
}
