import { LANGUAGES, ROLES, SCENARIOS } from "./data/venues.js";
import { buildDecisionCards, buildTelemetry, findScenario, findVenue, getRoutePlan } from "./opsEngine.js";

const OPENAI_RESPONSES_URL = "https://api.openai.com/v1/responses";

const COPY = {
  en: {
    plan: "Action plan",
    route: "Route guidance",
    operations: "Operations note",
    safety: "Safety guardrail",
    medical: "If anyone is hurt, unconscious, missing, or in immediate danger, contact venue medical or emergency services now. This assistant only supports decision preparation.",
    source: "Grounded in current venue data, scenario telemetry, and operational rules."
  },
  es: {
    plan: "Plan de accion",
    route: "Guia de ruta",
    operations: "Nota operativa",
    safety: "Regla de seguridad",
    medical: "Si alguien esta herido, inconsciente, perdido o en peligro inmediato, contacta ahora al equipo medico del estadio o a emergencias. Este asistente solo apoya la preparacion de decisiones.",
    source: "Basado en datos del estadio, telemetria del escenario y reglas operativas."
  },
  fr: {
    plan: "Plan d'action",
    route: "Guidage",
    operations: "Note operationnelle",
    safety: "Regle de securite",
    medical: "Si une personne est blessee, inconsciente, perdue ou en danger immediat, contactez tout de suite le service medical du stade ou les urgences. Cet assistant aide seulement a preparer les decisions.",
    source: "Base sur les donnees du stade, la telemetrie du scenario et les regles operationnelles."
  }
};

export async function answerQuestion(payload = {}, options = {}) {
  const venue = findVenue(payload.venueId);
  const scenario = findScenario(payload.scenarioId || "baseline");
  const telemetry = buildTelemetry(venue.id, scenario.id, payload.now ? new Date(payload.now) : new Date());
  const language = resolveLanguage(payload.language);
  const role = resolveRole(payload.role);
  const question = normalizeQuestion(payload.question);
  const destination = payload.destination || inferDestination(question);
  const mobilityNeed = payload.mobilityNeed || inferMobilityNeed(question);
  const route = getRoutePlan(venue.id, destination, mobilityNeed, telemetry);
  const cards = buildDecisionCards(venue, telemetry);
  const context = buildContext({ venue, scenario, telemetry, language, role, question, route, cards, mobilityNeed });

  if (options.apiKey) {
    try {
      const answer = await callOpenAI(context, options);
      if (answer) {
        return {
          mode: "openai",
          model: options.model || process.env.OPENAI_MODEL || "gpt-5.2",
          answer,
          telemetry,
          route,
          cards,
          sourceSummary: COPY[language].source
        };
      }
    } catch (error) {
      return {
        ...fallbackAnswer({ venue, scenario, telemetry, language, role, question, route, cards, mobilityNeed }),
        modelError: safeError(error)
      };
    }
  }

  return fallbackAnswer({ venue, scenario, telemetry, language, role, question, route, cards, mobilityNeed });
}

export function fallbackAnswer({ venue, scenario, telemetry, language, role, question, route, cards, mobilityNeed }) {
  const copy = COPY[language] || COPY.en;
  const intent = classifyIntent(question);
  const topDriver = telemetry.risk.drivers[0]?.label || "Crowd density";
  const roleLabel = role.label.toLowerCase();
  const accessibilityLine = mobilityNeed !== "none"
    ? route.accessibilityNote
    : `Keep ${venue.operations.accessibleEntry} visible as the accessible alternate.`;

  const actionLines = [
    `${copy.plan}: For ${roleLabel} at ${venue.fifaName}, risk is ${telemetry.risk.level} (${telemetry.risk.score}/100) during ${scenario.label}. Main driver: ${topDriver}.`,
    intent === "medical"
      ? `Escalate to ${venue.operations.medical}, assign a runner from ${venue.operations.primaryIngress}, and keep the route clear until medical confirms handoff.`
      : `Prioritize ${cards[0].action}`,
    intent === "transit"
      ? `Coordinate with the transport desk at ${venue.operations.transitHub}; publish the next departure option and hold overflow in signed lanes.`
      : `Use ${venue.operations.secondaryIngress} as the relief path if ${venue.operations.chokePoints[0]} exceeds safe density.`,
    intent === "sustainability"
      ? `Send recycling captains to concession exits and promote ${venue.sustainability.slice(0, 2).join(" plus ")}.`
      : `Keep multilingual announcements short and repeat them through staff, screens, and mobile alerts.`
  ];

  const routeLines = [
    `${copy.route}: ${route.destination}, estimated ${route.etaMinutes} minutes.`,
    ...route.steps,
    accessibilityLine
  ];

  const opsLines = [
    `${copy.operations}: ${telemetry.staffRedeploy}`,
    `Monitor queues every 5 minutes. Current gate queue estimate is ${telemetry.queueMinutes} minutes and transit load is ${telemetry.transitLoad} percent.`,
    `${copy.safety}: ${copy.medical}`
  ];

  return {
    mode: "local",
    model: "grounded-planning-fallback",
    answer: [actionLines.join("\n"), routeLines.join("\n"), opsLines.join("\n")].join("\n\n"),
    telemetry,
    route,
    cards,
    sourceSummary: copy.source
  };
}

function buildContext({ venue, scenario, telemetry, language, role, question, route, cards, mobilityNeed }) {
  return {
    system: [
      "You are Matchday Stadium Copilot for FIFA World Cup 2026 stadium operations.",
      "Use only the provided venue, telemetry, route, and operations context.",
      "Support fans, organizers, volunteers, and venue staff with concise real-world actions.",
      "Do not invent live facts, private data, police instructions, or emergency status.",
      "For medical, safety, missing-person, or immediate-danger cases, tell the user to contact venue medical or emergency services.",
      `Respond in ${languageName(language)}.`
    ].join(" "),
    user: JSON.stringify({
      question,
      role: role.label,
      language,
      mobilityNeed,
      venue: {
        city: venue.city,
        country: venue.country,
        venueName: venue.venueName,
        fifaName: venue.fifaName,
        capacity: venue.capacity,
        transitModes: venue.transitModes,
        accessibility: venue.accessibility,
        sustainability: venue.sustainability,
        operations: venue.operations
      },
      scenario: { id: scenario.id, label: scenario.label, summary: scenario.summary },
      telemetry,
      route,
      decisionCards: cards
    }, null, 2)
  };
}

async function callOpenAI(context, options) {
  const response = await fetch(options.endpoint || process.env.OPENAI_RESPONSES_URL || OPENAI_RESPONSES_URL, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${options.apiKey}`,
      "Content-Type": "application/json"
    },
    signal: AbortSignal.timeout(options.timeoutMs || 15000),
    body: JSON.stringify({
      model: options.model || process.env.OPENAI_MODEL || "gpt-5.2",
      input: [
        { role: "developer", content: context.system },
        { role: "user", content: context.user }
      ],
      max_output_tokens: 900
    })
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(`OpenAI request failed (${response.status}): ${message.slice(0, 300)}`);
  }

  const payload = await response.json();
  return extractOpenAIText(payload);
}

export function extractOpenAIText(payload) {
  if (payload?.output_text) return String(payload.output_text).trim();
  const chunks = [];
  for (const item of payload?.output || []) {
    for (const content of item.content || []) {
      if (content.text) chunks.push(content.text);
      if (content.output_text) chunks.push(content.output_text);
    }
  }
  return chunks.join("\n").trim();
}

function resolveLanguage(language) {
  return LANGUAGES.some((item) => item.id === language) ? language : "en";
}

function resolveRole(role) {
  return ROLES.find((item) => item.id === role) || ROLES[0];
}

function normalizeQuestion(question) {
  const value = typeof question === "string" ? question.trim() : "";
  return value.slice(0, 1200) || "Give me the best stadium operations plan for the current scenario.";
}

function classifyIntent(question) {
  const value = question.toLowerCase();
  if (value.includes("medical") || value.includes("hurt") || value.includes("injury") || value.includes("emergency")) return "medical";
  if (value.includes("train") || value.includes("bus") || value.includes("transit") || value.includes("shuttle")) return "transit";
  if (value.includes("accessible") || value.includes("wheelchair") || value.includes("mobility") || value.includes("sensory")) return "accessibility";
  if (value.includes("waste") || value.includes("recycle") || value.includes("water") || value.includes("sustain")) return "sustainability";
  if (value.includes("gate") || value.includes("route") || value.includes("where")) return "navigation";
  return "operations";
}

function inferDestination(question) {
  const intent = classifyIntent(question);
  if (intent === "medical") return "medical";
  if (intent === "transit") return "transit";
  if (intent === "accessibility") return "accessibility";
  if (intent === "sustainability") return "sustainability";
  if (question.toLowerCase().includes("water")) return "water";
  return "gate";
}

function inferMobilityNeed(question) {
  const value = question.toLowerCase();
  if (value.includes("wheelchair")) return "wheelchair";
  if (value.includes("visual")) return "visual";
  if (value.includes("hearing")) return "hearing";
  if (value.includes("sensory")) return "sensory";
  if (value.includes("accessible") || value.includes("mobility")) return "mobility";
  return "none";
}

function languageName(language) {
  if (language === "es") return "Spanish";
  if (language === "fr") return "French";
  return "English";
}

function safeError(error) {
  return error instanceof Error ? error.message : "Assistant provider error";
}
