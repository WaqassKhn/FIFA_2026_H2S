# Matchday Stadium Copilot

GenAI-enabled stadium operations and fan assistance for the FIFA World Cup 2026.

## Chosen vertical

Stadium operations and the tournament fan experience. The primary personas are venue staff, organizers, volunteers, and fans who need fast, grounded help during high-pressure matchday conditions.

## What it does

Matchday Stadium Copilot combines a seeded public venue dataset, simulated matchday telemetry, deterministic risk scoring, route planning, multilingual response logic, and an optional OpenAI assistant endpoint. It helps users decide how to handle gate queues, crowd density, accessible routes, transit delays, medical escalation, heat risk, and sustainability operations.

Core workflows:

- Select one of the 16 FIFA World Cup 2026 host venues.
- Simulate real operational scenarios such as ingress rush, transit delay, heat advisory, accessibility surge, weather hold, and waste overflow.
- See a live risk score with top operational drivers.
- Review recommended actions for crowd flow, transit, accessibility, safety, and sustainability.
- Ask the GenAI assistant for a contextual plan in English, Spanish, or French.
- Run without paid services using the local grounded fallback, or set `OPENAI_API_KEY` for model-generated responses.

## How the logic works

`src/data/venues.js` stores compact public planning data for venues, transit modes, accessibility services, sustainability actions, and venue-specific operations notes. `src/opsEngine.js` builds scenario telemetry and calculates a 0-100 risk score from queues, crowd density, transit load, heat, weather, accessibility demand, waste load, and incidents.

`src/assistant.js` creates a grounded prompt with only the selected venue, telemetry, route plan, and decision cards. If `OPENAI_API_KEY` is configured, `/api/assistant` calls the OpenAI Responses API. If not, it uses a local planning fallback so judges can test the project without secrets.

The assistant intentionally includes safety guardrails: it does not replace emergency services and always escalates medical, missing-person, and immediate-danger cases to venue medical or emergency teams.

## Run locally

Requirements:

- Node.js 20 or newer
- No package install is required

```bash
node server/index.js
```

Open:

```text
http://localhost:4173
```

Optional OpenAI mode:

```bash
cp .env.example .env
# set OPENAI_API_KEY in .env or your deployment environment
OPENAI_API_KEY=your_key_here node server/index.js
```

On Windows PowerShell:

```powershell
$env:OPENAI_API_KEY="your_key_here"
node server/index.js
```

## Test

```bash
node --test tests/*.test.js
```

The tests validate risk scoring, scenario changes, accessible routing, safety triggers, assistant fallback output, and OpenAI Responses API text parsing.

## Data and assumptions

The bundled dataset is intentionally small so the repository stays below the 10 MB challenge limit. It uses public planning information and approximate values for capacities, coordinates, transit modes, accessibility services, and operational notes.

Sources are tracked in `data/public-data-sources.json` and include:

- [FIFA World Cup 2026 official tournament hub](https://www.fifa.com/en/tournaments/mens/worldcup/canadamexicousa2026)
- [FIFA host cities media release](https://inside.fifa.com/media-releases/fifa-world-cup-2026-host-cities)
- [Wikidata](https://www.wikidata.org/)
- [OpenStreetMap](https://www.openstreetmap.org/)
- [Kaggle public datasets catalog](https://www.kaggle.com/datasets) for optional future CSV joins

Production deployment should replace simulated telemetry with live feeds such as ticket scanning, people counters, transit APIs, weather alerts, accessibility service requests, and venue incident systems.

## Security and responsible AI

- API keys stay on the server and are never sent to the browser.
- The prompt is grounded to selected venue data and live scenario telemetry.
- User text is rendered with `textContent`, not raw HTML.
- The server blocks path traversal when serving static files.
- Medical or emergency requests are routed to human emergency response.

## Deployment

Deployed at: https://fifa-2026-h2s.onrender.com/

Set the start command:

```bash
node server/index.js
```

Set environment variables:

```text
PORT=<provided by host>
OPENAI_API_KEY=<optional>
OPENAI_MODEL=gpt-5.2
```

