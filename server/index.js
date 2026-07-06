import { createServer } from "node:http";
import { existsSync, readFileSync } from "node:fs";
import { readFile, stat } from "node:fs/promises";
import { extname, isAbsolute, join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { DATA_LAST_REVIEWED, DATA_SOURCES, LANGUAGES, ROLES, SCENARIOS, VENUES } from "../src/data/venues.js";
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

async function handleApi(request, response, url) {
  if (request.method === "GET" && url.pathname === "/api/health") {
    sendJson(response, 200, {
      ok: true,
      app: "Matchday Stadium Copilot",
      openAiConfigured: Boolean(process.env.OPENAI_API_KEY),
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
      venues: VENUES.map(buildVenueSummary)
    });
    return;
  }

  if (request.method === "GET" && url.pathname === "/api/telemetry") {
    const venueId = url.searchParams.get("venueId") || VENUES[0].id;
    const scenarioId = url.searchParams.get("scenarioId") || "baseline";
    const venue = findVenue(venueId);
    const telemetry = buildTelemetry(venue.id, scenarioId);
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
      model: process.env.OPENAI_MODEL
    });
    sendJson(response, 200, result);
    return;
  }

  sendJson(response, 404, { error: "Not found" });
}

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

function sendJson(response, statusCode, payload) {
  response.writeHead(statusCode, {
    "Content-Type": "application/json; charset=utf-8",
    "Cache-Control": "no-store"
  });
  response.end(JSON.stringify(payload));
}

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
