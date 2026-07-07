# Matchday Stadium Copilot

Matchday Stadium Copilot is an artificial intelligence assistant and command center built to optimize stadium operations and fan navigation during the FIFA World Cup 2026. By turning complex stadium telemetry, live transit schedules, weather variables, and accessibility requests into immediate, clear guidance, it keeps venue staff, organizers, volunteers, and tournament fans aligned under high-pressure matchday conditions.

## Chosen Vertical

The application is built under the **Stadium Assistant & Logistics Operations** vertical. It focuses on solving the critical gap between complex, raw backend sensor/operations data (such as gate sensor counts, weather advisories, transport delays, and incident reports) and the immediate, actionable guidance needed by gate managers, volunteers, transport desks, and fans.

## Approach and Logic

The core logic of the application centers on translating multi-source telemetry data into real-time operational directives:

1. **Risk Telemetry Scoring**: Raw data streams (gate queue times, crowd density percentages, transport loads, heat index values, accessible shuttle demand, and waste load) are scored on a scale of 0 to 100.
2. **Dynamic Severity Categorization**: Scores are mapped into four distinct risk tiers: Stable (under 35), Elevated (35-64), High (65-84), and Critical (85-100).
3. **Role-Based Filtering**: The user interface matches incoming telemetry with the selected operator role (Fan, Volunteer, Organizer, or Venue Staff) to highlight relevant information.
4. **Context-Building Logic**: By combining the chosen venue, role, scenario, and active telemetry, the system constructs a precise JSON payload. This payload is routed to natural language processing models (Gemini, Groq, or OpenAI) to generate grounded operational plans.

## How the Solution Works

The application operates as a lightweight, secure web portal built with static frontend assets and a robust local command engine:

* **Telemetry Engine**: Processes live match phases, attendance counts, transit delays, and weather metrics. It dynamically determines a risk score to alert organizers to critical bottlenecks.
* **Smart Filter Queries**: Selecting any stadium, matchday scenario, operator role, destination, or accessibility need instantly builds a natural language query, updates the user interface, and prompts the artificial intelligence planner for a response.
* **Keyless Map Integration**: Embeds live, fully interactive mapping frames showing roads, parking gates, and actual stadium coordinates.
* **Intelligent Background Monogram**: Features a mouse-tracking background grid that dynamically glows and scales as the cursor hovers near watermark patterns.
* **Secure AI Architecture**: Connects safely to natural language processors on the server side, keeping all API keys protected, and falls back to a grounded local script if no keys are configured.

## Assumptions Made

To ensure consistent operational forecasts and routing, the following assumptions were made:

* **Transit Flow Calculations**: Transit delay impacts assume standard light rail, bus shuttle, and parking terminal capacity limits unique to each stadium.
* **Accessibility Alternatives**: The system assumes that standard navigation routes are not suitable for wheelchair or sensory support, automatically substituting designated ADA entries and elevators when those options are toggled.
* **Weather Baseline**: Safe temperature thresholds are set at 95 degrees Fahrenheit (35 degrees Celsius); exceeding this threshold automatically triggers hydration and shaded relief warnings across all operator roles.
* **Sensor Frequency**: Telemetry calculations assume live operations feeds refresh at least once every 20 seconds.

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
   GEMINI_API_KEY=your_gemini_key_here
   ```
3. Restart your server.

### Running Unit Tests

To run the automated tests that validate risk math, accessibility routes, and API responses, run:
```bash
npm test
```
