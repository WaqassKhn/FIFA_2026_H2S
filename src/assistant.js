import { LANGUAGES, ROLES, SCENARIOS, MATCH_FIXTURES } from "./data/venues.js";
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

const FALLBACK_LABELS = {
  en: {
    roles: { fan: "fan", volunteer: "volunteer", organizer: "organizer", "venue-staff": "venue staff" },
    risks: { stable: "stable", elevated: "elevated", high: "high", critical: "critical" },
    scenarios: {
      baseline: "Live baseline",
      "ingress-rush": "Ingress rush",
      "transit-delay": "Transit delay",
      "heat-advisory": "Heat advisory",
      "accessibility-surge": "Accessibility surge",
      "weather-hold": "Weather hold",
      "waste-overflow": "Waste overflow"
    },
    drivers: {
      "Gate queues": "Gate queues",
      "Crowd density": "Crowd density",
      "Transit load": "Transit load",
      "Heat index": "Heat index",
      "Accessible service demand": "Accessible service demand",
      "Weather risk": "Weather risk",
      "Waste load": "Waste load",
      "Active incidents": "Active incidents"
    },
    summary: "For {role} at {venue}, risk is {risk} ({score}/100) during {scenario}. Main driver: {driver}.",
    medicalAction: "Escalate to {medical}, assign a runner from {entry}, and keep the route clear until medical confirms handoff.",
    firstAction: "Prioritize: {action}",
    transitAction: "Coordinate with the transport desk at {hub}; publish the next departure option and hold overflow in signed lanes.",
    reliefAction: "Use {path} as the relief path if {choke} exceeds safe density.",
    sustainabilityAction: "Send recycling captains to concession exits and promote {items}.",
    announcementAction: "Keep multilingual announcements short and repeat them through staff, screens, and mobile alerts.",
    routeIntro: "{destination}, estimated {minutes} minutes.",
    accessibleAlternate: "Keep {entry} visible as the accessible alternate.",
    opsMetric: "Monitor queues every 5 minutes. Current gate queue estimate is {queue} minutes and transit load is {transit} percent.",
    staffRedeployFallback: "Keep roaming support between {primary} and {secondary}."
  },
  es: {
    roles: { fan: "aficion", volunteer: "voluntario", organizer: "organizador", "venue-staff": "personal de sede" },
    risks: { stable: "estable", elevated: "elevado", high: "alto", critical: "critico" },
    scenarios: {
      baseline: "base en vivo",
      "ingress-rush": "pico de entrada",
      "transit-delay": "retraso de transporte",
      "heat-advisory": "alerta de calor",
      "accessibility-surge": "aumento accesible",
      "weather-hold": "pausa por clima",
      "waste-overflow": "residuos saturados"
    },
    drivers: {
      "Gate queues": "filas de entrada",
      "Crowd density": "densidad de publico",
      "Transit load": "carga de transporte",
      "Heat index": "indice de calor",
      "Accessible service demand": "demanda de servicio accesible",
      "Weather risk": "riesgo climatico",
      "Waste load": "carga de residuos",
      "Active incidents": "incidentes activos"
    },
    summary: "Para {role} en {venue}, el riesgo es {risk} ({score}/100) durante {scenario}. Principal factor: {driver}.",
    medicalAction: "Escala a {medical}, asigna una persona de apoyo desde {entry} y manten la ruta despejada hasta entrega medica.",
    firstAction: "Prioriza: {action}",
    transitAction: "Coordina con transporte en {hub}; publica la siguiente salida y contiene el desborde en carriles senalizados.",
    reliefAction: "Usa {path} como ruta de alivio si {choke} supera la densidad segura.",
    sustainabilityAction: "Envia capitanes de reciclaje a concesiones y promueve {items}.",
    announcementAction: "Manten los avisos multilingues cortos y repitelos por personal, pantallas y alertas moviles.",
    routeIntro: "{destination}, estimado {minutes} minutos.",
    accessibleAlternate: "Manten {entry} visible como alternativa accesible.",
    opsMetric: "Vigila las filas cada 5 minutos. La espera estimada es {queue} minutos y la carga de transporte es {transit} por ciento.",
    staffRedeployFallback: "Manten apoyo movil entre {primary} y {secondary}."
  },
  fr: {
    roles: { fan: "supporter", volunteer: "benevole", organizer: "organisateur", "venue-staff": "personnel du site" },
    risks: { stable: "stable", elevated: "eleve", high: "haut", critical: "critique" },
    scenarios: {
      baseline: "base en direct",
      "ingress-rush": "afflux d'entree",
      "transit-delay": "retard transport",
      "heat-advisory": "alerte chaleur",
      "accessibility-surge": "hausse accessible",
      "weather-hold": "pause meteo",
      "waste-overflow": "debordement dechets"
    },
    drivers: {
      "Gate queues": "files aux portes",
      "Crowd density": "densite de foule",
      "Transit load": "charge transport",
      "Heat index": "indice chaleur",
      "Accessible service demand": "demande de service accessible",
      "Weather risk": "risque meteo",
      "Waste load": "charge dechets",
      "Active incidents": "incidents actifs"
    },
    summary: "Pour {role} a {venue}, le risque est {risk} ({score}/100) pendant {scenario}. Facteur principal : {driver}.",
    medicalAction: "Escaladez vers {medical}, envoyez un relais depuis {entry}, et gardez la route degagee jusqu'au relais medical.",
    firstAction: "Priorite : {action}",
    transitAction: "Coordonnez avec le poste transport a {hub}; publiez le prochain depart et gardez le debordement en voies signalees.",
    reliefAction: "Utilisez {path} comme route de delestage si {choke} depasse la densite sure.",
    sustainabilityAction: "Envoyez les capitaines recyclage aux concessions et mettez en avant {items}.",
    announcementAction: "Gardez les annonces multilingues courtes et repetez-les via personnel, ecrans et alertes mobiles.",
    routeIntro: "{destination}, environ {minutes} minutes.",
    accessibleAlternate: "Gardez {entry} visible comme alternative accessible.",
    opsMetric: "Surveillez les files toutes les 5 minutes. L'attente estimee est {queue} minutes et la charge transport est {transit} pour cent.",
    staffRedeployFallback: "Gardez un soutien mobile entre {primary} et {secondary}."
  }
};

/**
 * Analyzes stadium operations queries and calls configured LLM providers (Gemini, Groq, or OpenAI)
 * to return grounded operational directives. Falls back to a local model ruleset on key issues.
 * @param {Object} payload - The client request filters and details.
 * @param {Object} options - Server credentials and model settings.
 * @returns {Promise<Object>} The structured assistant response.
 */
export async function answerQuestion(payload = {}, options = {}) {
  const venue = findVenue(payload.venueId);
  const scenario = findScenario(payload.scenarioId || "baseline");
  const telemetry = buildTelemetry(venue.id, scenario.id, payload.now ? new Date(payload.now) : new Date(), payload.externalWeather);
  const language = resolveLanguage(payload.language);
  const role = resolveRole(payload.role);
  const question = normalizeQuestion(payload.question);
  const destination = payload.destination || inferDestination(question);
  const mobilityNeed = payload.mobilityNeed || inferMobilityNeed(question);
  const route = getRoutePlan(venue.id, destination, mobilityNeed, telemetry);
  const cards = buildDecisionCards(venue, telemetry);
  const context = buildContext({ venue, scenario, telemetry, language, role, question, route, cards, mobilityNeed });

  const preferredProvider = payload.provider || "auto";

  // 1. Try Gemini if selected or in auto mode with Gemini Key configured
  if ((preferredProvider === "gemini" && options.geminiApiKey) || (preferredProvider === "auto" && options.geminiApiKey)) {
    try {
      const answer = await callGemini(context, {
        apiKey: options.geminiApiKey,
        model: options.geminiModel || "gemini-2.5-flash"
      });
      if (answer) {
        return {
          mode: "gemini",
          model: options.geminiModel || "gemini-2.5-flash",
          answer,
          telemetry,
          route,
          cards,
          sourceSummary: COPY[language].source
        };
      }
    } catch (error) {
      if (preferredProvider === "gemini") {
        return {
          ...fallbackAnswer({ venue, scenario, telemetry, language, role, question, route, cards, mobilityNeed }),
          modelError: safeError(error)
        };
      }
      console.warn(`[Gemini API Warning] ${error.message}. trying next.`);
    }
  }

  // 2. Try Groq if selected or in auto mode with Groq Key configured
  if ((preferredProvider === "groq" && options.groqApiKey) || (preferredProvider === "auto" && options.groqApiKey)) {
    try {
      const answer = await callGroq(context, {
        apiKey: options.groqApiKey,
        model: options.groqModel || "llama-3.3-70b-versatile",
        endpoint: options.groqEndpoint || options.endpoint
      });
      if (answer) {
        return {
          mode: "groq",
          model: options.groqModel || "llama-3.3-70b-versatile",
          answer,
          telemetry,
          route,
          cards,
          sourceSummary: COPY[language].source
        };
      }
    } catch (error) {
      if (preferredProvider === "groq") {
        return {
          ...fallbackAnswer({ venue, scenario, telemetry, language, role, question, route, cards, mobilityNeed }),
          modelError: safeError(error)
        };
      }
      console.warn(`[Groq API Warning] ${error.message}. trying next.`);
    }
  }

  // 3. Try OpenAI if selected or in auto mode with OpenAI Key configured
  if ((preferredProvider === "openai" && options.apiKey) || (preferredProvider === "auto" && options.apiKey)) {
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
  const labels = FALLBACK_LABELS[language] || FALLBACK_LABELS.en;
  const intent = classifyIntent(question);
  const topDriver = telemetry.risk.drivers[0]?.label || "Crowd density";
  const roleLabel = labels.roles[role.id] || role.label.toLowerCase();
  const scenarioLabel = labels.scenarios[scenario.id] || scenario.label;
  const riskLabel = labels.risks[telemetry.risk.level] || telemetry.risk.level;
  const driverLabel = labels.drivers[topDriver] || topDriver;
  const firstAction = localizedAction(cards[0], venue, telemetry, language);
  const accessibilityLine = mobilityNeed !== "none"
    ? route.accessibilityNote
    : format(labels.accessibleAlternate, { entry: venue.operations.accessibleEntry });

  const actionLines = [
    `${copy.plan}: ${format(labels.summary, { role: roleLabel, venue: venue.fifaName, risk: riskLabel, score: telemetry.risk.score, scenario: scenarioLabel, driver: driverLabel })}`,
    intent === "medical"
      ? format(labels.medicalAction, { medical: venue.operations.medical, entry: venue.operations.primaryIngress })
      : format(labels.firstAction, { action: firstAction }),
    intent === "transit"
      ? format(labels.transitAction, { hub: venue.operations.transitHub })
      : format(labels.reliefAction, { path: venue.operations.secondaryIngress, choke: venue.operations.chokePoints[0] }),
    intent === "sustainability"
      ? format(labels.sustainabilityAction, { items: venue.sustainability.slice(0, 2).join(" plus ") })
      : labels.announcementAction
  ];

  const routeLines = [
    `${copy.route}: ${format(labels.routeIntro, { destination: route.destination, minutes: route.etaMinutes })}`,
    ...route.steps,
    accessibilityLine
  ];

  const opsLines = [
    `${copy.operations}: ${localizedStaffRedeploy(venue, telemetry, language)}`,
    format(labels.opsMetric, { queue: telemetry.queueMinutes, transit: telemetry.transitLoad }),
    `${copy.safety}: ${copy.medical}`
  ];

  let matchInfoResponse = "";
  const lowQuestion = question.toLowerCase();
  if (lowQuestion.includes("won") || lowQuestion.includes("win") || lowQuestion.includes("score") || lowQuestion.includes("result") || lowQuestion.includes("match") || lowQuestion.includes("play")) {
    const venueMatches = MATCH_FIXTURES.filter(m => m.venueId === venue.id);
    if (venueMatches.length > 0) {
      matchInfoResponse = "\n\n### Match Information\n" + venueMatches.map(m => {
        const scoreStr = m.status === "completed" || m.status === "live"
          ? ` (${m.home.name} ${m.home.score} - ${m.away.score} ${m.away.name})`
          : "";
        return `- **[${m.status.toUpperCase()}]** ${m.stage}: ${m.home.name} vs ${m.away.name}${scoreStr} at ${m.kickoffLocal} (Attendance: ${m.attendance.toLocaleString() || "N/A"}).`;
      }).join("\n");
    }
  }

  return {
    mode: "local",
    model: "grounded-planning-fallback",
    answer: [actionLines.join("\n"), routeLines.join("\n"), opsLines.join("\n")].join("\n\n") + matchInfoResponse,
    telemetry,
    route,
    cards,
    sourceSummary: copy.source
  };
}

function localizedAction(card, venue, telemetry, language) {
  const labels = FALLBACK_LABELS[language] || FALLBACK_LABELS.en;
  if (card.title === "Safety trigger") {
    return language === "es"
      ? `difunde guia de agua y sombra, y ubica personal medico cerca de ${venue.operations.chokePoints[0]}`
      : language === "fr"
        ? `diffusez eau et ombre, puis placez du soutien medical pres de ${venue.operations.chokePoints[0]}`
        : card.action;
  }
  if (card.title === "Crowd flow") {
    return telemetry.queueMinutes > 30
      ? format(language === "es" ? "abre carriles de alivio en {gate} y mueve revision movil hacia {secondary}" : language === "fr" ? "ouvrez des voies de delestage a {gate} et deplacez les controles mobiles vers {secondary}" : "{action}", { gate: venue.operations.accessibleEntry, secondary: venue.operations.secondaryIngress, action: card.action })
      : format(language === "es" ? "manten activo {primary} y publica el mejor acceso cada 10 minutos" : language === "fr" ? "gardez {primary} actif et publiez la meilleure entree toutes les 10 minutes" : "{action}", { primary: venue.operations.primaryIngress, action: card.action });
  }
  if (card.title === "Accessible service") {
    return telemetry.accessibleDemand > 60
      ? format(language === "es" ? "mueve dos voluntarios a {place} y avisa al equipo de elevadores" : language === "fr" ? "redeployez deux benevoles a {place} et pre-alertez les ascenseurs" : "{action}", { place: venue.operations.accessibleEntry, action: card.action })
      : format(language === "es" ? "manten visible el carril prioritario en {place} y confirma intervalos de shuttle" : language === "fr" ? "gardez la voie prioritaire visible a {place} et confirmez les navettes" : "{action}", { place: venue.operations.accessibleEntry, action: card.action });
  }
  if (card.title === "Transit") {
    return telemetry.transitLoad > 70
      ? format(labels.transitAction, { hub: venue.operations.transitHub })
      : card.action;
  }
  if (card.title === "Sustainability") {
    return language === "es"
      ? "rota capitanes de reciclaje por concesiones y puntos de recarga"
      : language === "fr"
        ? "faites tourner les capitaines recyclage aux concessions et points d'eau"
        : card.action;
  }
  return card.action;
}

function localizedStaffRedeploy(venue, telemetry, language) {
  const labels = FALLBACK_LABELS[language] || FALLBACK_LABELS.en;
  if (telemetry.accessibleDemand > 64) {
    if (language === "es") return `mueve voluntarios de accesibilidad a ${venue.operations.accessibleEntry}.`;
    if (language === "fr") return `deplacez les benevoles accessibilite vers ${venue.operations.accessibleEntry}.`;
  }
  if (telemetry.transitLoad > 72) {
    if (language === "es") return `mueve personal de orientacion a ${venue.operations.transitHub}.`;
    if (language === "fr") return `deplacez l'equipe orientation vers ${venue.operations.transitHub}.`;
  }
  if (telemetry.crowdDensity > 70) {
    if (language === "es") return `mueve gestores de publico a ${venue.operations.chokePoints[0]}.`;
    if (language === "fr") return `deplacez les stewards vers ${venue.operations.chokePoints[0]}.`;
  }
  return format(labels.staffRedeployFallback, { primary: venue.operations.primaryIngress, secondary: venue.operations.secondaryIngress });
}

function buildContext({ venue, scenario, telemetry, language, role, question, route, cards, mobilityNeed }) {
  return {
    system: [
      "You are Matchday Stadium Copilot for FIFA World Cup 2026 stadium operations.",
      "Use only the provided venue, telemetry, route, and operations context.",
      "Support fans, organizers, volunteers, and venue staff with concise real-world actions.",
      "Do not invent live facts, private data, police instructions, or emergency status.",
      "For medical, safety, missing-person, or immediate-danger cases, tell the user to contact venue medical or emergency services.",
      "Format your response clearly using markdown: use bullet points for steps, bold headings, and blockquotes for warnings or critical notices. Ensure it is highly readable and structured.",
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
      decisionCards: cards,
      matches: MATCH_FIXTURES
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

async function callGroq(context, options) {
  const response = await fetch(options.endpoint || "https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${options.apiKey}`,
      "Content-Type": "application/json"
    },
    signal: AbortSignal.timeout(options.timeoutMs || 15000),
    body: JSON.stringify({
      model: options.model || "llama-3.3-70b-versatile",
      messages: [
        { role: "system", content: context.system },
        { role: "user", content: context.user }
      ],
      temperature: 0.2,
      max_tokens: 900
    })
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(`Groq request failed (${response.status}): ${message.slice(0, 300)}`);
  }

  const payload = await response.json();
  return payload.choices?.[0]?.message?.content?.trim() || "";
}

async function callGemini(context, options) {
  const modelName = options.model || "gemini-2.5-flash";
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${options.apiKey}`;
  
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    signal: AbortSignal.timeout(options.timeoutMs || 15000),
    body: JSON.stringify({
      contents: [
        {
          parts: [
            {
              text: context.user
            }
          ]
        }
      ],
      systemInstruction: {
        parts: [
          {
            text: context.system
          }
        ]
      },
      generationConfig: {
        temperature: 0.2,
        maxOutputTokens: 900
      }
    })
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(`Gemini request failed (${response.status}): ${message.slice(0, 300)}`);
  }

  const payload = await response.json();
  return payload.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || "";
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

function format(template, values = {}) {
  return Object.entries(values).reduce((text, [key, value]) => text.replaceAll(`{${key}}`, value), template);
}

function safeError(error) {
  return error instanceof Error ? error.message : "Assistant provider error";
}
