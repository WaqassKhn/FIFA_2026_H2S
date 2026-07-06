const state = {
  venues: [],
  scenarios: [],
  roles: [],
  languages: [],
  selectedVenueId: null,
  selectedScenarioId: "baseline",
  selectedRole: "fan",
  selectedLanguage: "en",
  selectedDestination: "gate",
  selectedMobility: "none",
  telemetry: null,
  route: null,
  cards: []
};

const els = {
  venueSelect: document.querySelector("#venueSelect"),
  scenarioSelect: document.querySelector("#scenarioSelect"),
  roleSelect: document.querySelector("#roleSelect"),
  languageSelect: document.querySelector("#languageSelect"),
  destinationSelect: document.querySelector("#destinationSelect"),
  mobilitySelect: document.querySelector("#mobilitySelect"),
  refreshButton: document.querySelector("#refreshButton"),
  sourceNote: document.querySelector("#sourceNote"),
  venueMeta: document.querySelector("#venueMeta"),
  venueTitle: document.querySelector("#venueTitle"),
  assistantMode: document.querySelector("#assistantMode"),
  riskLevel: document.querySelector("#riskLevel"),
  riskFill: document.querySelector("#riskFill"),
  riskScore: document.querySelector("#riskScore"),
  driverList: document.querySelector("#driverList"),
  phaseText: document.querySelector("#phaseText"),
  venueMap: document.querySelector("#venueMap"),
  metricGrid: document.querySelector("#metricGrid"),
  decisionList: document.querySelector("#decisionList"),
  quickPrompts: document.querySelector("#quickPrompts"),
  questionInput: document.querySelector("#questionInput"),
  askButton: document.querySelector("#askButton"),
  clearButton: document.querySelector("#clearButton"),
  answerBox: document.querySelector("#answerBox"),
  routePlan: document.querySelector("#routePlan")
};

const quickPrompts = [
  "Gate queues are rising. What should operations do in the next 10 minutes?",
  "Give multilingual wayfinding instructions for a fan using transit.",
  "How should volunteers support accessible entry right now?",
  "What sustainability actions should venue services prioritize?"
];

boot();

async function boot() {
  const data = await fetchJson("/api/venues");
  state.venues = data.venues;
  state.scenarios = data.scenarios;
  state.roles = data.roles;
  state.languages = data.languages;
  state.selectedVenueId = state.venues[0].id;

  fillSelect(els.venueSelect, state.venues.map((venue) => ({ id: venue.id, label: `${venue.city} - ${venue.fifaName}` })));
  fillSelect(els.scenarioSelect, state.scenarios);
  fillSelect(els.roleSelect, state.roles);
  fillSelect(els.languageSelect, state.languages);
  els.sourceNote.textContent = `Data reviewed ${data.dataLastReviewed}. Sources: FIFA, Wikidata, OpenStreetMap planning assumptions.`;
  renderQuickPrompts();
  bindEvents();
  await refreshTelemetry();
  setInterval(refreshTelemetry, 20000);
}

function bindEvents() {
  els.venueSelect.addEventListener("change", async () => {
    state.selectedVenueId = els.venueSelect.value;
    await refreshTelemetry();
  });
  els.scenarioSelect.addEventListener("change", async () => {
    state.selectedScenarioId = els.scenarioSelect.value;
    await refreshTelemetry();
  });
  els.roleSelect.addEventListener("change", () => {
    state.selectedRole = els.roleSelect.value;
  });
  els.languageSelect.addEventListener("change", () => {
    state.selectedLanguage = els.languageSelect.value;
  });
  els.destinationSelect.addEventListener("change", async () => {
    state.selectedDestination = els.destinationSelect.value;
    await refreshTelemetry();
  });
  els.mobilitySelect.addEventListener("change", async () => {
    state.selectedMobility = els.mobilitySelect.value;
    await refreshTelemetry();
  });
  els.refreshButton.addEventListener("click", refreshTelemetry);
  els.askButton.addEventListener("click", askAssistant);
  els.clearButton.addEventListener("click", () => {
    els.answerBox.textContent = "";
  });
}

async function refreshTelemetry() {
  const params = new URLSearchParams({
    venueId: state.selectedVenueId,
    scenarioId: state.selectedScenarioId,
    destination: state.selectedDestination,
    mobilityNeed: state.selectedMobility
  });
  const data = await fetchJson(`/api/telemetry?${params}`);
  state.telemetry = data.telemetry;
  state.route = data.route;
  state.cards = data.cards;
  renderAll(data.venue);
}

function renderAll(venue) {
  renderVenueHeader(venue);
  renderRisk(state.telemetry);
  renderMap();
  renderMetrics(state.telemetry);
  renderDecisions(state.cards);
  renderRoute(state.route);
}

function renderVenueHeader(venue) {
  els.venueMeta.textContent = `${venue.city}, ${venue.country} | capacity ${formatNumber(venue.capacity)} | ${venue.timezone}`;
  els.venueTitle.textContent = venue.venueName;
  els.phaseText.textContent = state.telemetry.phase;
}

function renderRisk(telemetry) {
  const risk = telemetry.risk;
  els.riskLevel.textContent = risk.level;
  els.riskLevel.dataset.risk = risk.level;
  els.riskScore.textContent = risk.score;
  els.riskFill.style.width = `${risk.score}%`;
  els.riskFill.style.background = riskColor(risk.level);
  replaceChildren(els.driverList, risk.drivers.map((driver) => {
    const node = document.createElement("div");
    node.className = "driver-item";
    node.innerHTML = `<strong></strong><span></span>`;
    node.querySelector("strong").textContent = driver.label;
    node.querySelector("span").textContent = `${driver.value}%`;
    return node;
  }));
}

function renderMap() {
  replaceChildren(els.venueMap, state.venues.map((venue) => {
    const pin = document.createElement("button");
    pin.type = "button";
    pin.className = `venue-pin${venue.id === state.selectedVenueId ? " active" : ""}`;
    pin.style.left = `${venue.pin.x}%`;
    pin.style.top = `${venue.pin.y}%`;
    pin.setAttribute("aria-label", `Select ${venue.city}`);
    pin.title = venue.city;
    pin.addEventListener("click", async () => {
      state.selectedVenueId = venue.id;
      els.venueSelect.value = venue.id;
      await refreshTelemetry();
    });
    const label = document.createElement("span");
    label.textContent = venue.city;
    pin.append(label);
    return pin;
  }));
}

function renderMetrics(telemetry) {
  const metrics = [
    { label: "Gate queue", value: `${telemetry.queueMinutes} min`, note: "Estimated wait at the busiest entry." },
    { label: "Crowd density", value: `${telemetry.crowdDensity}%`, note: "Concourse and plaza pressure." },
    { label: "Transit load", value: `${telemetry.transitLoad}%`, note: "Rail, shuttle, and curb demand." },
    { label: "Heat index", value: `${telemetry.heatIndexF} F`, note: "Shade, hydration, and medical demand." },
    { label: "Access demand", value: `${telemetry.accessibleDemand}%`, note: "Accessible route and elevator support." },
    { label: "Waste load", value: `${telemetry.wasteLoad}%`, note: "Recycling, compost, and bin turnover." }
  ];
  replaceChildren(els.metricGrid, metrics.map((metric) => {
    const card = document.createElement("article");
    card.className = "metric-card";
    const title = document.createElement("strong");
    title.textContent = metric.label;
    const value = document.createElement("div");
    value.className = "metric-value";
    value.textContent = metric.value;
    const note = document.createElement("p");
    note.textContent = metric.note;
    card.append(title, value, note);
    return card;
  }));
}

function renderDecisions(cards) {
  replaceChildren(els.decisionList, cards.map((card) => {
    const node = document.createElement("article");
    node.className = "decision-card";
    const head = document.createElement("div");
    head.className = "card-head";
    const title = document.createElement("h4");
    title.textContent = card.title;
    const priority = document.createElement("span");
    priority.className = "priority";
    priority.textContent = card.priority;
    head.append(title, priority);
    const owner = document.createElement("p");
    owner.textContent = card.owner;
    const action = document.createElement("p");
    action.textContent = card.action;
    node.append(head, owner, action);
    return node;
  }));
}

function renderRoute(route) {
  const nodes = [];
  const summary = document.createElement("div");
  summary.className = "route-step";
  summary.innerHTML = `<strong></strong><small></small>`;
  summary.querySelector("strong").textContent = `${route.destination} | ${route.etaMinutes} minutes`;
  summary.querySelector("small").textContent = route.accessibilityNote;
  nodes.push(summary);

  for (const step of route.steps) {
    const item = document.createElement("div");
    item.className = "route-step";
    item.textContent = step;
    nodes.push(item);
  }

  const wrapper = document.createElement("div");
  wrapper.className = "route-plan";
  wrapper.append(...nodes);
  replaceChildren(els.routePlan, [wrapper]);
}

function renderQuickPrompts() {
  replaceChildren(els.quickPrompts, quickPrompts.map((prompt) => {
    const button = document.createElement("button");
    button.type = "button";
    button.textContent = prompt;
    button.addEventListener("click", () => {
      els.questionInput.value = prompt;
      askAssistant();
    });
    return button;
  }));
}

async function askAssistant() {
  els.askButton.disabled = true;
  els.assistantMode.textContent = "Generating plan";
  els.answerBox.textContent = "Working from venue data and current telemetry...";
  try {
    const result = await fetchJson("/api/assistant", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        venueId: state.selectedVenueId,
        scenarioId: state.selectedScenarioId,
        role: state.selectedRole,
        language: state.selectedLanguage,
        destination: state.selectedDestination,
        mobilityNeed: state.selectedMobility,
        question: els.questionInput.value
      })
    });
    state.telemetry = result.telemetry;
    state.route = result.route;
    state.cards = result.cards;
    els.assistantMode.textContent = result.mode === "openai" ? `OpenAI ${result.model}` : "Local grounded fallback";
    els.answerBox.textContent = result.modelError
      ? `${result.answer}\n\nProvider note: ${result.modelError}`
      : result.answer;
    renderRisk(state.telemetry);
    renderDecisions(state.cards);
    renderRoute(state.route);
  } catch (error) {
    els.answerBox.textContent = `Unable to generate a plan: ${error.message}`;
    els.assistantMode.textContent = "Assistant error";
  } finally {
    els.askButton.disabled = false;
  }
}

async function fetchJson(url, options) {
  const response = await fetch(url, options);
  if (!response.ok) {
    throw new Error(`Request failed: ${response.status}`);
  }
  return response.json();
}

function fillSelect(select, items) {
  select.innerHTML = "";
  for (const item of items) {
    const option = document.createElement("option");
    option.value = item.id;
    option.textContent = item.label;
    select.append(option);
  }
}

function replaceChildren(parent, children) {
  parent.replaceChildren(...children);
}

function riskColor(level) {
  if (level === "critical") return "var(--red)";
  if (level === "high") return "#ea580c";
  if (level === "elevated") return "var(--amber)";
  return "var(--green)";
}

function formatNumber(value) {
  return new Intl.NumberFormat("en-US").format(value);
}
