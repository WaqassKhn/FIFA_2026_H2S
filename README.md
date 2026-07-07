# Matchday Stadium Copilot

Matchday Stadium Copilot is an artificial intelligence assistant and command center built to optimize stadium operations and fan navigation during the FIFA World Cup 2026. By turning complex stadium telemetry, live transit schedules, weather variables, and accessibility requests into immediate, clear guidance, it keeps venue staff, organizers, volunteers, and tournament fans aligned under high-pressure matchday conditions.

## What This System Achieves

During a major tournament match, stadium operators face constant changes in crowd queues, gate entries, transit delays, and safety risks. This website solves those issues by acting as a single, centralized command dashboard:

* **Predicts and Scores Risks**: Calculates an operational risk score in real-time based on current gate lines, weather conditions, crowd densities, and transit loads.
* **Simplifies Fan and Staff Decisions**: Recommends immediate operational tasks for gate managers, volunteers, transit coordinators, and safety teams.
* **Optimizes Accessibility Routing**: Generates custom navigation instructions for users with wheelchair, sensory, hearing, or visual assistance requirements.
* **Directs Transit and Crowds**: Provides live location details and direct links to driving navigation for transit hubs, fan zones, merchandise stores, and stadium gates.
* **Drafts Instant Action Plans**: Uses an artificial intelligence helper to compile detailed operational plans for any specific stadium role or scenario automatically.

## How the Solution Works

The application operates as a lightweight, secure web portal built with static frontend assets and a robust local command engine:

* **Telemetry Engine**: Processes live match phases, attendance counts, transit delays, and weather metrics. It dynamically determines a risk score from 0 to 100 to alert organizers to critical bottlenecks.
* **Smart Filter Queries**: Selecting any stadium, matchday scenario, operator role, destination, or accessibility need instantly builds a natural language query, updates the user interface, and prompts the artificial intelligence planner for a response.
* **Keyless Map Integration**: Embeds live, fully interactive mapping frames showing roads, parking gates, and actual stadium coordinates.
* **Intelligent Background Monogram**: Features a mouse-tracking background grid that dynamically glows and scales as the cursor hovers near watermark patterns.
* **Secure AI Architecture**: Connects safely to natural language processors on the server side, keeping all API keys protected, and falls back to a grounded local script if no keys are configured.

## Live Application Link

Add your deployed public link here:
[Insert Deployed Link Here]

## Local Setup Instructions

Follow these simple steps to run the application on your computer.

### Prerequisites

Ensure you have the following installed:
* Node.js version 20 or newer
* A web browser

### Running the Project

1. Open your terminal or command prompt inside the project folder.
2. Start the local server:
   ```bash
   node server/index.js
   ```
3. Open your browser and navigate to:
   ```text
   http://localhost:4173
   ```

### Optional AI Configurations

By default, the system runs on a grounded local database fallback. To connect to live OpenAI or Groq models, set up your credentials:

1. Copy the example environment file:
   ```bash
   cp .env.example .env
   ```
2. Open the `.env` file and insert your API credentials:
   ```text
   OPENAI_API_KEY=your_openai_key_here
   GROQ_API_KEY=your_groq_key_here
   ```
3. Restart your server.

### Running Unit Tests

To run the automated tests that validate risk math, accessibility routes, and API responses, run:
```bash
npm test
```
