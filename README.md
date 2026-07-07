# Matchday Stadium Copilot ⚽🏆

Matchday Stadium Copilot is a GenAI-enabled stadium operations and fan assistance command center for the **FIFA World Cup 2026™**. It enhances tournament navigation, crowd management, accessible services, transportation, and sustainability logistics by combining real-time API integrations, local stadium telemetry, deterministic risk calculations, and an AI planner.

## Deployed URL
**Live Demo:** [https://fifa-2026-h2s.onrender.com/](https://fifa-2026-h2s.onrender.com/)

---

## 📋 Chosen Challenge Vertical

**Stadium Operations & Tournament Fan Experience**: Designed specifically for venue staff, tournament organizers, volunteers, and fans. The solution acts as a unified command hub to resolve high-pressure matchday events across all 16 official host cities.

---

## ✨ Key Features & Solutions

### 1. GenAI Centerpiece Card (Top Focus)
* **Permanent Hero Card**: Positioned prominently at the very top of the dashboard. It remains permanently open to display grounded operational plans.
* **Markdown Rich-Text Formatter**: Implemented a markdown-to-HTML parser that translates headings, lists, bold notes, and quote block warnings into beautiful custom typography.
* **Live Match Grounding**: Grounded the assistant in complete match fixtures, timelines, kickoffs, stages, and scores. The AI can answer questions like *"Who won at Boston?"* (England 2 - 0 Senegal) or *"What is the live score at Atlanta?"* (USA 1 - 1 Mexico).

### 2. Smart Filters to Auto-Query Generator
* **Automatic Queries**: Changing any select option (**Venue, Scenario, Persona, Destination, Access Need, Language**) instantly updates the telemetry and compiles a descriptive natural language query in the textbox, triggering the GenAI planner automatically.
* **Immediate Feedback**: The manual refresh button is removed; selecting any option updates the entire dashboard instantly.
* **Boot-Activated Plan**: Triggers a baseline GenAI plan automatically on page load.

### 3. Active Main Navigation Anchor Actions
* **Interactive Navigation Bar**: Anchors in the header bar are fully interactive:
  - **Live Control**: Expands the live match feed, primary concern, and actions.
  - **Venue Metrics**: Focuses on stadium telemetry and the host footprint map.
  - **Staffing Hub**: Highlights volunteer actions and completed match history.
  - **Emergency Escalation**: Automatically opens the GenAI Copilot assistant and displays primary risk concerns.

### 4. Interactive Background (Louis Vuitton Symbol Grid)
* **Subtle Branding**: Implemented a floating background grid of repeating FIFA icons (⚽, 🏆, 🏟️, ⏱️, 📣, 🚩, ⭐, 26).
* **Mouse-Tracking Hover Glow**: Icons sit at a very low default opacity (`0.02`). Moving the mouse near icons (within `180px`) smoothly scales, rotates, and highlights them with a tournament teal glow (`#34d399`), creating a premium interactive background.

### 5. Custom Mobility Routing & Accessibility Glow
* **♿ Accessible Route Badge**: Selecting a wheelchair, visual, hearing, or sensory need highlights the Route summary box with a glowing blue boundary and a distinct badge.
* **Specific Route Steps**:
  - **Wheelchair**: Routes through step-free ramps and accessible elevator checkpoints.
  - **Visual**: Highlights tactile paving, braille signs, and audio guides.
  - **Hearing**: Directs to overhead caption screens and visual queues.
  - **Sensory**: Routes through low-noise bypass corridors.

---

## 🛠️ How the Code Works

### Architecture
- **`public/index.html`**: Premium glassmorphic interface shell featuring the Hero centered World Cup banner, Top Nav anchors, and grid panels.
- **`public/app.js`**: Core frontend controller. Manages ticking timezone clocks, interactive background mouse tracking, markdown parsing, and automatic query triggers.
- **`src/opsEngine.js`**: The telemetry engine. Calculates 0-100 risk score and drivers based on queues, density, transit loads, sustainability waste, and live weather.
- **`src/assistant.js`**: Orchestrates LLM prompt injection. Grounded in the selected venue, live metrics, route plans, decision cards, and matches.

---

## 🚀 Run Locally

### Requirements
- **Node.js v20** or newer
- Zero external package installations required (runs on native Node modules)

1. Start the server:
   ```bash
   node server/index.js
   ```
2. Open your browser:
   ```text
   http://localhost:4173
   ```

### Optional OpenAI / Groq Integrations
Set credentials in your environment or copy the example env:
```bash
cp .env.example .env
```
Inside `.env`:
```text
OPENAI_API_KEY=your_openai_key
GROQ_API_KEY=your_groq_key
```

---

## 🧪 Testing

Run native Node.js unit tests:
```bash
npm test
```
The test suite validates:
- Risk levels scoring calculations
- Scenario ingress queue surges
- Accessibility route prioritization
- Safety triggers for heat indexes
- Offline fallback plan text parsing
- Groq/OpenAI response format parsers

---

## 🔒 Security & Safe Practices
- **Strict Grounding**: Prompt rules prevent model hallucination or inventing emergency facts.
- **No Client Keys**: API keys reside strictly on the server and are never exposed to the client.
- **HTML Sanitization**: Escapes HTML brackets before parsing markdown to prevent cross-site scripting (XSS).
- **Static File Protection**: Checks relative bounds to block directory traversal attacks.
