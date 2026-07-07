const state = {
  venues: [],
  scenarios: [],
  roles: [],
  languages: [],
  matches: [],
  selectedVenueId: null,
  selectedScenarioId: "baseline",
  selectedRole: "fan",
  selectedLanguage: "en",
  selectedDestination: "gate",
  selectedMobility: "none",
  telemetry: null,
  route: null,
  cards: [],
  venue: null,
  dataLastReviewed: null
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
  matchStatus: document.querySelector("#matchStatus"),
  matchFocus: document.querySelector("#matchFocus"),
  concernPanel: document.querySelector("#concernPanel"),
  concernTitle: document.querySelector("#concernTitle"),
  concernSummary: document.querySelector("#concernSummary"),
  riskLevel: document.querySelector("#riskLevel"),
  riskFill: document.querySelector("#riskFill"),
  riskScore: document.querySelector("#riskScore"),
  driverList: document.querySelector("#driverList"),
  phaseText: document.querySelector("#phaseText"),
  venueMap: document.querySelector("#venueMap"),
  metricGrid: document.querySelector("#metricGrid"),
  decisionList: document.querySelector("#decisionList"),
  routePlan: document.querySelector("#routePlan"),
  matchHistory: document.querySelector("#matchHistory"),
  quickPrompts: document.querySelector("#quickPrompts"),
  questionInput: document.querySelector("#questionInput"),
  askButton: document.querySelector("#askButton"),
  clearButton: document.querySelector("#clearButton"),
  answerBox: document.querySelector("#answerBox")
};

const dictionaries = {
  en: {
    brandEyebrow: "FIFA World Cup 2026",
    appTitle: "Matchday Stadium Copilot",
    brandCopy: "Live command support for fans, staff, volunteers, and organizers.",
    venueLabel: "Venue",
    scenarioLabel: "Scenario",
    roleLabel: "Persona",
    languageLabel: "Language",
    destinationLabel: "Destination",
    mobilityLabel: "Access need",
    refreshButton: "Refresh telemetry",
    matchFocusEyebrow: "Match focus",
    matchFocusTitle: "Live match simulation",
    concernEyebrow: "Primary concern",
    signalsEyebrow: "Signals",
    telemetryTitle: "Matchday telemetry",
    decisionEyebrow: "Decision support",
    decisionTitle: "Recommended actions",
    navigationEyebrow: "Navigation",
    routeTitle: "Route plan",
    mapEyebrow: "Host footprint",
    mapTitle: "Venue network",
    historyEyebrow: "Match history",
    historyTitle: "Recent tournament flow",
    assistantEyebrow: "GenAI assistant",
    assistantTitle: "Ask for a grounded plan",
    questionLabel: "Question",
    askButton: "Generate plan",
    clearButton: "Clear",
    localFallbackReady: "Local fallback ready",
    contextUpdated: "Context updated",
    generatingPlan: "Generating plan",
    assistantError: "Assistant error",
    localGroundedFallback: "Local grounded fallback",
    working: "Working from venue data and current telemetry...",
    unablePlan: "Unable to generate a plan: {message}",
    providerNote: "Provider note: {message}",
    sourceNote: "Data reviewed {date}. Sources: FIFA, Wikidata, OpenStreetMap, and seeded public planning data.",
    capacity: "capacity",
    selectedContext: "Selected context",
    language: "Language",
    scenario: "Scenario",
    destination: "Destination",
    accessNeed: "Access need",
    persona: "Persona",
    status_live: "Live",
    status_upcoming: "Upcoming",
    status_completed: "Completed",
    minute: "{minute}'",
    kickoff: "Kickoff {time}",
    fullTime: "Full time",
    attendance: "Attendance",
    simulatedNotice: "Simulated match feed for matchday operations rehearsal.",
    liveOpsHint: "When the match starts, this panel becomes the command view: score, minute, player cues, timeline, and crowd-operation triggers update together.",
    playersToWatch: "Players to watch",
    timeline: "Timeline",
    operationsCue: "Operations cue",
    latestEvent: "Latest event",
    mainConcern: "{driver} is the current operational focus.",
    concernAction: "Handle this first, then scan the supporting tiles below.",
    gateQueue: "Gate queue",
    gateQueueNote: "Estimated wait at the busiest entry.",
    crowdDensity: "Crowd density",
    crowdDensityNote: "Concourse and plaza pressure.",
    transitLoad: "Transit load",
    transitLoadNote: "Rail, shuttle, and curb demand.",
    heatIndex: "Heat index",
    heatIndexNote: "Shade, hydration, and medical demand.",
    accessDemand: "Access demand",
    accessDemandNote: "Accessible route and elevator support.",
    wasteLoad: "Waste load",
    wasteLoadNote: "Recycling, compost, and bin turnover.",
    risk_stable: "stable",
    risk_elevated: "elevated",
    risk_high: "high",
    risk_critical: "critical",
    routeSummary: "{destination} | {minutes} minutes",
    routeStart: "Start from {place}.",
    routeAvoid: "Avoid {place} until density eases.",
    routeUseSigns: "Use signed lanes toward {place}.",
    routeAccessible: "Use the step-free route and check in at {place}.",
    routeEnd: "End at {place}.",
    accessibleNote: "{services} are available on this route.",
    accessibleAlternate: "Accessible alternate: {place}.",
    noHistory: "No completed match history is assigned to this venue yet.",
    previousGames: "Previous games",
    openAiMode: "OpenAI {model}",
    groqMode: "Groq {model}",
    quick1: "Gate queues are rising. What should operations do in the next 10 minutes?",
    quick2: "Give multilingual wayfinding instructions for a fan using transit.",
    quick3: "How should volunteers support accessible entry right now?",
    quick4: "What sustainability actions should venue services prioritize?",
    defaultQuestion: "A wheelchair user and family need the safest route to their section while gate queues are rising. What should staff do?",
    safetyTrigger: "Safety trigger",
    crowdFlow: "Crowd flow",
    accessibleService: "Accessible service",
    transit: "Transit",
    sustainability: "Sustainability",
    now: "Now",
    monitor: "Monitor",
    ready: "Ready",
    coordinate: "Coordinate",
    rotate: "Rotate",
    operations: "Operations",
    volunteerLead: "Volunteer lead",
    transportDesk: "Transport desk",
    venueServices: "Venue services",
    medical: "Medical",
    actionSafety: "Broadcast water and shade guidance, then stage medical spotters near {place}.",
    actionCrowdOpen: "Open relief lanes at {gate} and move mobile ticket checks toward {secondary}.",
    actionCrowdHold: "Keep {primary} active and publish the next best entry every 10 minutes.",
    actionAccessNow: "Redeploy two volunteers to {place} and pre-call elevator support.",
    actionAccessReady: "Keep the priority lane visible at {place} and confirm shuttle spacing.",
    actionTransitNow: "Start metered release toward {place} and push alternate shuttle instructions.",
    actionTransitHold: "Hold a standby message for {modes} arrivals.",
    actionWasteNow: "Send sorting staff to concession exits and clear overflow near {place}.",
    actionWasteHold: "Rotate recycling captains through high-volume concessions and refill points.",
    phase_early_operations: "early operations",
    phase_arrival_build: "arrival build",
    phase_ingress_peak: "ingress peak",
    phase_egress_and_transit: "egress and transit",
    phase_overnight_reset: "overnight reset"
  },
  es: {
    brandEyebrow: "Copa Mundial FIFA 2026",
    appTitle: "Copiloto de estadio",
    brandCopy: "Apoyo en vivo para aficion, personal, voluntarios y organizadores.",
    venueLabel: "Sede",
    scenarioLabel: "Escenario",
    roleLabel: "Persona",
    languageLabel: "Idioma",
    destinationLabel: "Destino",
    mobilityLabel: "Necesidad de acceso",
    refreshButton: "Actualizar telemetria",
    matchFocusEyebrow: "Foco del partido",
    matchFocusTitle: "Simulacion en vivo",
    concernEyebrow: "Prioridad principal",
    signalsEyebrow: "Senales",
    telemetryTitle: "Telemetria del partido",
    decisionEyebrow: "Soporte de decision",
    decisionTitle: "Acciones recomendadas",
    navigationEyebrow: "Navegacion",
    routeTitle: "Plan de ruta",
    mapEyebrow: "Mapa de sedes",
    mapTitle: "Red de estadios",
    historyEyebrow: "Historial",
    historyTitle: "Flujo reciente del torneo",
    assistantEyebrow: "Asistente GenAI",
    assistantTitle: "Pide un plan contextual",
    questionLabel: "Pregunta",
    askButton: "Generar plan",
    clearButton: "Limpiar",
    localFallbackReady: "Modo local listo",
    contextUpdated: "Contexto actualizado",
    generatingPlan: "Generando plan",
    assistantError: "Error del asistente",
    localGroundedFallback: "Respuesta local contextual",
    working: "Trabajando con datos de la sede y telemetria actual...",
    unablePlan: "No se pudo generar un plan: {message}",
    providerNote: "Nota del proveedor: {message}",
    sourceNote: "Datos revisados {date}. Fuentes: FIFA, Wikidata, OpenStreetMap y datos publicos semilla.",
    capacity: "capacidad",
    selectedContext: "Contexto seleccionado",
    language: "Idioma",
    scenario: "Escenario",
    destination: "Destino",
    accessNeed: "Acceso",
    persona: "Persona",
    status_live: "En vivo",
    status_upcoming: "Proximo",
    status_completed: "Finalizado",
    minute: "{minute}'",
    kickoff: "Inicio {time}",
    fullTime: "Final",
    attendance: "Asistencia",
    simulatedNotice: "Feed simulado para ensayo de operaciones.",
    liveOpsHint: "Cuando empieza el partido, este panel muestra marcador, minuto, jugadores, eventos y detonantes operativos juntos.",
    playersToWatch: "Jugadores a seguir",
    timeline: "Linea de tiempo",
    operationsCue: "Clave operativa",
    latestEvent: "Ultimo evento",
    mainConcern: "{driver} es el foco operativo actual.",
    concernAction: "Atiende esto primero y luego revisa las tarjetas de apoyo.",
    gateQueue: "Fila de entrada",
    gateQueueNote: "Espera estimada en el acceso mas cargado.",
    crowdDensity: "Densidad",
    crowdDensityNote: "Presion en explanada y pasillos.",
    transitLoad: "Carga de transporte",
    transitLoadNote: "Demanda de tren, shuttle y acera.",
    heatIndex: "Indice de calor",
    heatIndexNote: "Demanda de sombra, agua y salud.",
    accessDemand: "Demanda accesible",
    accessDemandNote: "Rutas accesibles y apoyo de elevadores.",
    wasteLoad: "Carga de residuos",
    wasteLoadNote: "Reciclaje, compost y recambio de contenedores.",
    risk_stable: "estable",
    risk_elevated: "elevado",
    risk_high: "alto",
    risk_critical: "critico",
    routeSummary: "{destination} | {minutes} minutos",
    routeStart: "Comienza en {place}.",
    routeAvoid: "Evita {place} hasta que baje la densidad.",
    routeUseSigns: "Usa los carriles senalizados hacia {place}.",
    routeAccessible: "Usa la ruta sin escalones y registra apoyo en {place}.",
    routeEnd: "Termina en {place}.",
    accessibleNote: "{services} estan disponibles en esta ruta.",
    accessibleAlternate: "Alternativa accesible: {place}.",
    noHistory: "Aun no hay historial finalizado para esta sede.",
    previousGames: "Partidos previos",
    openAiMode: "OpenAI {model}",
    groqMode: "Groq {model}",
    quick1: "Las filas de entrada suben. Que debe hacer operaciones en 10 minutos?",
    quick2: "Da instrucciones multilingues para una persona que usa transporte.",
    quick3: "Como deben apoyar voluntarios la entrada accesible?",
    quick4: "Que acciones sostenibles debe priorizar servicios?",
    defaultQuestion: "Una persona en silla de ruedas y su familia necesitan la ruta mas segura mientras suben las filas. Que debe hacer el personal?",
    safetyTrigger: "Activador de seguridad",
    crowdFlow: "Flujo de publico",
    accessibleService: "Servicio accesible",
    transit: "Transporte",
    sustainability: "Sostenibilidad",
    now: "Ahora",
    monitor: "Vigilar",
    ready: "Listo",
    coordinate: "Coordinar",
    rotate: "Rotar",
    operations: "Operaciones",
    volunteerLead: "Lider voluntario",
    transportDesk: "Mesa de transporte",
    venueServices: "Servicios de sede",
    medical: "Medico",
    actionSafety: "Difunde guia de agua y sombra, y ubica personal medico cerca de {place}.",
    actionCrowdOpen: "Abre carriles de alivio en {gate} y mueve revision movil hacia {secondary}.",
    actionCrowdHold: "Manten activo {primary} y publica el mejor acceso cada 10 minutos.",
    actionAccessNow: "Mueve dos voluntarios a {place} y avisa al equipo de elevadores.",
    actionAccessReady: "Manten visible el carril prioritario en {place} y confirma intervalos de shuttle.",
    actionTransitNow: "Inicia salida controlada hacia {place} y envia rutas alternas de shuttle.",
    actionTransitHold: "Prepara un mensaje para llegadas por {modes}.",
    actionWasteNow: "Envia personal de separacion a concesiones y limpia desborde cerca de {place}.",
    actionWasteHold: "Rota capitanes de reciclaje por concesiones y puntos de recarga.",
    phase_early_operations: "operacion temprana",
    phase_arrival_build: "aumento de llegadas",
    phase_ingress_peak: "pico de entrada",
    phase_egress_and_transit: "salida y transporte",
    phase_overnight_reset: "reinicio nocturno"
  },
  fr: {
    brandEyebrow: "Coupe du Monde FIFA 2026",
    appTitle: "Copilote stade",
    brandCopy: "Aide en direct pour supporters, personnel, benevoles et organisateurs.",
    venueLabel: "Site",
    scenarioLabel: "Scenario",
    roleLabel: "Persona",
    languageLabel: "Langue",
    destinationLabel: "Destination",
    mobilityLabel: "Besoin d'acces",
    refreshButton: "Actualiser la telemetrie",
    matchFocusEyebrow: "Focus match",
    matchFocusTitle: "Simulation en direct",
    concernEyebrow: "Priorite principale",
    signalsEyebrow: "Signaux",
    telemetryTitle: "Telemetrie match",
    decisionEyebrow: "Aide a la decision",
    decisionTitle: "Actions recommandees",
    navigationEyebrow: "Navigation",
    routeTitle: "Plan d'itineraire",
    mapEyebrow: "Carte des sites",
    mapTitle: "Reseau des stades",
    historyEyebrow: "Historique",
    historyTitle: "Flux recent du tournoi",
    assistantEyebrow: "Assistant GenAI",
    assistantTitle: "Demander un plan contextualise",
    questionLabel: "Question",
    askButton: "Generer le plan",
    clearButton: "Effacer",
    localFallbackReady: "Mode local pret",
    contextUpdated: "Contexte mis a jour",
    generatingPlan: "Generation du plan",
    assistantError: "Erreur assistant",
    localGroundedFallback: "Reponse locale contextualisee",
    working: "Analyse des donnees du site et de la telemetrie...",
    unablePlan: "Impossible de generer un plan : {message}",
    providerNote: "Note fournisseur : {message}",
    sourceNote: "Donnees revues {date}. Sources : FIFA, Wikidata, OpenStreetMap et donnees publiques de reference.",
    capacity: "capacite",
    selectedContext: "Contexte choisi",
    language: "Langue",
    scenario: "Scenario",
    destination: "Destination",
    accessNeed: "Acces",
    persona: "Persona",
    status_live: "En direct",
    status_upcoming: "A venir",
    status_completed: "Termine",
    minute: "{minute}'",
    kickoff: "Coup d'envoi {time}",
    fullTime: "Fin du match",
    attendance: "Affluence",
    simulatedNotice: "Flux simule pour repetition operationnelle.",
    liveOpsHint: "Au coup d'envoi, ce panneau montre score, minute, joueurs, evenements et signaux operationnels ensemble.",
    playersToWatch: "Joueurs a suivre",
    timeline: "Chronologie",
    operationsCue: "Signal operationnel",
    latestEvent: "Dernier evenement",
    mainConcern: "{driver} est le focus operationnel actuel.",
    concernAction: "Traitez cela d'abord, puis lisez les tuiles de soutien.",
    gateQueue: "File aux portes",
    gateQueueNote: "Attente estimee a l'entree la plus chargee.",
    crowdDensity: "Densite",
    crowdDensityNote: "Pression sur parvis et coursives.",
    transitLoad: "Charge transport",
    transitLoadNote: "Demande rail, navettes et depose.",
    heatIndex: "Indice chaleur",
    heatIndexNote: "Besoin d'eau, ombre et medical.",
    accessDemand: "Demande accessible",
    accessDemandNote: "Route accessible et ascenseurs.",
    wasteLoad: "Charge dechets",
    wasteLoadNote: "Tri, compost et rotation des bacs.",
    risk_stable: "stable",
    risk_elevated: "eleve",
    risk_high: "haut",
    risk_critical: "critique",
    routeSummary: "{destination} | {minutes} minutes",
    routeStart: "Commencez a {place}.",
    routeAvoid: "Evitez {place} jusqu'a baisse de densite.",
    routeUseSigns: "Suivez les voies signalees vers {place}.",
    routeAccessible: "Prenez la route sans marche et signalez-vous a {place}.",
    routeEnd: "Terminez a {place}.",
    accessibleNote: "{services} sont disponibles sur cette route.",
    accessibleAlternate: "Alternative accessible : {place}.",
    noHistory: "Aucun match termine n'est encore lie a ce site.",
    previousGames: "Matchs precedents",
    openAiMode: "OpenAI {model}",
    groqMode: "Groq {model}",
    quick1: "Les files montent. Que doit faire l'equipe operations dans 10 minutes ?",
    quick2: "Donne des consignes multilingues pour un supporter en transport.",
    quick3: "Comment les benevoles doivent-ils aider l'entree accessible ?",
    quick4: "Quelles actions durables prioriser ?",
    defaultQuestion: "Une personne en fauteuil et sa famille ont besoin de la route la plus sure alors que les files montent. Que doit faire le personnel ?",
    safetyTrigger: "Declencheur securite",
    crowdFlow: "Flux public",
    accessibleService: "Service accessible",
    transit: "Transport",
    sustainability: "Durabilite",
    now: "Maintenant",
    monitor: "Surveiller",
    ready: "Pret",
    coordinate: "Coordonner",
    rotate: "Rotation",
    operations: "Operations",
    volunteerLead: "Responsable benevoles",
    transportDesk: "Poste transport",
    venueServices: "Services du site",
    medical: "Medical",
    actionSafety: "Diffusez eau et ombre, puis placez des observateurs medicaux pres de {place}.",
    actionCrowdOpen: "Ouvrez des voies de delestage a {gate} et deplacez les controles mobiles vers {secondary}.",
    actionCrowdHold: "Gardez {primary} actif et publiez la meilleure entree toutes les 10 minutes.",
    actionAccessNow: "Redeployez deux benevoles a {place} et pre-alertez les ascenseurs.",
    actionAccessReady: "Gardez la voie prioritaire visible a {place} et confirmez les navettes.",
    actionTransitNow: "Lancez une sortie cadencee vers {place} et poussez les navettes alternatives.",
    actionTransitHold: "Preparez un message pour les arrivees {modes}.",
    actionWasteNow: "Envoyez l'equipe tri aux concessions et videz le trop-plein pres de {place}.",
    actionWasteHold: "Faites tourner les capitaines recyclage aux concessions et points d'eau.",
    phase_early_operations: "operations matinales",
    phase_arrival_build: "montee des arrivees",
    phase_ingress_peak: "pic d'entree",
    phase_egress_and_transit: "sortie et transport",
    phase_overnight_reset: "remise a zero nocturne"
  }
};

const languageLabels = {
  en: { en: "English", es: "Spanish", fr: "French" },
  es: { en: "Ingles", es: "Espanol", fr: "Frances" },
  fr: { en: "Anglais", es: "Espagnol", fr: "Francais" }
};

const roleLabels = {
  fan: { en: "Fan", es: "Aficion", fr: "Supporter" },
  volunteer: { en: "Volunteer", es: "Voluntario", fr: "Benevole" },
  organizer: { en: "Organizer", es: "Organizador", fr: "Organisateur" },
  "venue-staff": { en: "Venue staff", es: "Personal de sede", fr: "Personnel du site" }
};

const scenarioLabels = {
  baseline: { en: "Live baseline", es: "Base en vivo", fr: "Base en direct" },
  "ingress-rush": { en: "Ingress rush", es: "Pico de entrada", fr: "Afflux d'entree" },
  "transit-delay": { en: "Transit delay", es: "Retraso de transporte", fr: "Retard transport" },
  "heat-advisory": { en: "Heat advisory", es: "Alerta de calor", fr: "Alerte chaleur" },
  "accessibility-surge": { en: "Accessibility surge", es: "Aumento accesible", fr: "Hausse accessible" },
  "weather-hold": { en: "Weather hold", es: "Pausa por clima", fr: "Pause meteo" },
  "waste-overflow": { en: "Waste overflow", es: "Residuos saturados", fr: "Debordement dechets" }
};

const destinationOptions = [
  { id: "gate", label: { en: "Best entry gate", es: "Mejor entrada", fr: "Meilleure entree" } },
  { id: "transit", label: { en: "Transit hub", es: "Centro de transporte", fr: "Pole transport" } },
  { id: "medical", label: { en: "Medical support", es: "Apoyo medico", fr: "Aide medicale" } },
  { id: "accessibility", label: { en: "Accessible services", es: "Servicios accesibles", fr: "Services accessibles" } },
  { id: "water", label: { en: "Water and shade", es: "Agua y sombra", fr: "Eau et ombre" } },
  { id: "sustainability", label: { en: "Recycling and refill", es: "Reciclaje y recarga", fr: "Tri et remplissage" } },
  { id: "fanzone", label: { en: "FIFA Fan Festival", es: "Festival de Aficionados", fr: "FIFA Fan Festival" } },
  { id: "merchandise", label: { en: "Official Merchandise", es: "Tienda Oficial", fr: "Boutique Officielle" } }
];

const mobilityOptions = [
  { id: "none", label: { en: "None", es: "Ninguna", fr: "Aucun" } },
  { id: "mobility", label: { en: "Mobility support", es: "Apoyo de movilidad", fr: "Aide mobilite" } },
  { id: "wheelchair", label: { en: "Wheelchair route", es: "Ruta silla de ruedas", fr: "Route fauteuil" } },
  { id: "visual", label: { en: "Visual guidance", es: "Guia visual", fr: "Guidage visuel" } },
  { id: "hearing", label: { en: "Hearing support", es: "Apoyo auditivo", fr: "Aide auditive" } },
  { id: "sensory", label: { en: "Sensory support", es: "Apoyo sensorial", fr: "Aide sensorielle" } }
];

const decisionKeys = {
  "Safety trigger": "safetyTrigger",
  "Crowd flow": "crowdFlow",
  "Accessible service": "accessibleService",
  Transit: "transit",
  Sustainability: "sustainability"
};

const priorityKeys = {
  Now: "now",
  Monitor: "monitor",
  Ready: "ready",
  Coordinate: "coordinate",
  Rotate: "rotate"
};

const ownerKeys = {
  Operations: "operations",
  "Volunteer lead": "volunteerLead",
  "Transport desk": "transportDesk",
  "Venue services": "venueServices",
  Medical: "medical"
};

function initFifaBackground() {
  const bg = document.createElement("div");
  bg.className = "fifa-bg-grid";
  bg.setAttribute("aria-hidden", "true");
  
  const symbols = ["⚽", "🏆", "🏟️", "⏱️", "📣", "🚩", "⭐", "26"];
  const count = 120;
  for (let i = 0; i < count; i++) {
    const span = document.createElement("span");
    span.textContent = symbols[i % symbols.length];
    span.style.setProperty("--rotation", `${(i * 37) % 360}deg`);
    bg.appendChild(span);
  }
  document.body.prepend(bg);
  
  document.addEventListener("mousemove", (e) => {
    const x = e.clientX;
    const y = e.clientY;
    const spans = bg.querySelectorAll("span");
    spans.forEach(span => {
      const rect = span.getBoundingClientRect();
      const dx = x - (rect.left + rect.width / 2);
      const dy = y - (rect.top + rect.height / 2);
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 180) {
        const factor = (180 - dist) / 180;
        span.style.opacity = 0.02 + factor * 0.18;
        span.style.transform = `scale(${1 + factor * 0.15}) rotate(calc(var(--rotation) + ${factor * 12}deg))`;
        span.style.color = `rgba(52, 211, 153, ${0.1 + factor * 0.35})`;
        span.style.textShadow = `0 0 ${factor * 10}px rgba(52, 211, 153, 0.45)`;
      } else {
        span.style.opacity = "";
        span.style.transform = "";
        span.style.color = "";
        span.style.textShadow = "";
      }
    });
  });
}

boot();

async function boot() {
  const data = await fetchJson("/api/venues");
  state.venues = data.venues;
  state.scenarios = data.scenarios;
  state.roles = data.roles;
  state.languages = data.languages;
  state.matches = data.matches || [];
  state.dataLastReviewed = data.dataLastReviewed;
  state.selectedVenueId = state.venues[0].id;

  populateControls();
  els.sourceNote.textContent = t("sourceNote", { date: state.dataLastReviewed });
  els.questionInput.value = t("defaultQuestion");
  applyLanguage();
  bindEvents();
  initTabs();
  initFifaBackground();
  
  const initialVenue = state.venues.find(v => v.id === state.selectedVenueId);
  if (initialVenue) startVenueClock(initialVenue.timezone);

  await refreshTelemetry("initial");
  els.questionInput.value = buildAutoQuery();
  await askAssistant();
  setInterval(() => refreshTelemetry("background"), 20000);
}

function buildAutoQuery() {
  const venue = state.venues.find(v => v.id === state.selectedVenueId);
  const scenario = state.scenarios.find(s => s.id === state.selectedScenarioId);
  const role = state.roles.find(r => r.id === state.selectedRole);
  
  const roleLabel = roleLabels[role.id]?.[state.selectedLanguage] || role.label;
  const scenarioLabel = scenarioLabels[scenario.id]?.[state.selectedLanguage] || scenario.label;
  const destinationLabel = optionLabel(destinationOptions, state.selectedDestination);
  const mobilityLabel = optionLabel(mobilityOptions, state.selectedMobility);
  
  let q = "";
  if (state.selectedLanguage === "es") {
    q = `Proporciona el plan operativo para una persona de tipo [${roleLabel}] en ${venue.city} durante el escenario [${scenarioLabel}]. Destino principal: [${destinationLabel}]. Requisito especial: [${mobilityLabel}].`;
  } else if (state.selectedLanguage === "fr") {
    q = `Fournir le plan d'operation pour un [${roleLabel}] a ${venue.city} pendant le scenario [${scenarioLabel}]. Destination : [${destinationLabel}]. Besoin d'acces : [${mobilityLabel}].`;
  } else {
    q = `Provide the matchday operations plan for a [${roleLabel}] at ${venue.city} stadium during [${scenarioLabel}]. Destination: [${destinationLabel}]. Access requirement: [${mobilityLabel}].`;
  }
  return q;
}

function parseMarkdown(text) {
  if (!text) return "";
  let html = text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
  html = html.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
  html = html.replace(/^### (.*?)$/gm, "<h4>$1</h4>");
  html = html.replace(/^## (.*?)$/gm, "<h3>$1</h3>");
  html = html.replace(/^# (.*?)$/gm, "<h2>$1</h2>");
  html = html.replace(/^&gt; (.*?)$/gm, "<blockquote>$1</blockquote>");
  let inList = false;
  const lines = html.split("\n");
  const parsedLines = lines.map(line => {
    const trimmed = line.trim();
    if (trimmed.startsWith("- ") || trimmed.startsWith("* ")) {
      const content = trimmed.substring(2);
      let prefix = "";
      if (!inList) {
        inList = true;
        prefix = "<ul>";
      }
      return `${prefix}<li>${content}</li>`;
    } else {
      let suffix = "";
      if (inList) {
        inList = false;
        suffix = "</ul>";
      }
      return `${suffix}${line}`;
    }
  });
  if (inList) parsedLines.push("</ul>");
  html = parsedLines.join("\n");
  html = html.split("\n\n").map(p => {
    const t = p.trim();
    if (t.startsWith("<ul") || t.startsWith("<li") || t.startsWith("<h") || t.startsWith("<block")) {
      return p;
    }
    return `<p>${p.replace(/\n/g, "<br>")}</p>`;
  }).join("\n");
  return html;
}

function bindEvents() {
  els.venueSelect.addEventListener("change", async () => {
    state.selectedVenueId = els.venueSelect.value;
    const v = state.venues.find(item => item.id === state.selectedVenueId);
    if (v) startVenueClock(v.timezone);
    els.questionInput.value = buildAutoQuery();
    await refreshTelemetry("filter");
    await askAssistant();
  });
  els.scenarioSelect.addEventListener("change", async () => {
    state.selectedScenarioId = els.scenarioSelect.value;
    els.questionInput.value = buildAutoQuery();
    await refreshTelemetry("filter");
    await askAssistant();
  });
  els.roleSelect.addEventListener("change", () => {
    state.selectedRole = els.roleSelect.value;
    els.questionInput.value = buildAutoQuery();
    renderAll(state.venue, "filter");
    askAssistant();
  });
  els.languageSelect.addEventListener("change", () => {
    state.selectedLanguage = els.languageSelect.value;
    applyLanguage();
    populateControls();
    els.questionInput.value = buildAutoQuery();
    renderAll(state.venue, "language");
    askAssistant();
  });
  els.destinationSelect.addEventListener("change", async () => {
    state.selectedDestination = els.destinationSelect.value;
    els.questionInput.value = buildAutoQuery();
    await refreshTelemetry("filter");
    await askAssistant();
  });
  els.mobilitySelect.addEventListener("change", async () => {
    state.selectedMobility = els.mobilitySelect.value;
    els.questionInput.value = buildAutoQuery();
    await refreshTelemetry("filter");
    await askAssistant();
  });
  
  // Bind top main navigation clicks
  const navLinks = document.querySelectorAll(".main-nav .nav-link");
  navLinks.forEach(link => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      navLinks.forEach(l => l.classList.remove("active"));
      link.classList.add("active");
      
      const id = link.id;
      if (id === "navLiveControl") {
        setActiveTab("overview");
      } else if (id === "navVenueMetrics") {
        setActiveTab("signals");
      } else if (id === "navStaffingHub") {
        setActiveTab("decisions");
      } else if (id === "navEmergencyEscalation") {
        setActiveTab("assistant");
        document.querySelector("#concernPanel")?.classList.add("expanded", "focused");
      }
    });
  });

  els.askButton.addEventListener("click", askAssistant);
  els.clearButton.addEventListener("click", () => {
    state.assistantQueried = false;
    els.answerBox.innerHTML = "";
    pulse(els.answerBox);
  });
}

async function refreshTelemetry(reason = "manual") {
  const needsButtonLoader = reason === "manual" || reason === "filter" || reason === "initial";
  if (needsButtonLoader && els.refreshButton) {
    els.refreshButton.disabled = true;
    els.refreshButton.classList.add("spinning");
  }
  try {
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
    state.venue = data.venue;
    renderAll(data.venue, reason);
  } finally {
    if (needsButtonLoader && els.refreshButton) {
      els.refreshButton.disabled = false;
      els.refreshButton.classList.remove("spinning");
    }
  }
}

function renderAll(venue, reason = "manual") {
  if (!venue || !state.telemetry) return;
  renderVenueHeader(venue);
  renderMatchFocus(venue);
  renderConcern(state.telemetry);
  renderMetrics(state.telemetry);
  renderDecisions(state.cards, venue, state.telemetry);
  renderRoute(venue, state.route, state.telemetry);
  renderMap();
  updateMapCard(venue);
  renderMatchHistory(venue);
  renderQuickPrompts();

  if (reason !== "background") {
    if (els.assistantMode) {
      els.assistantMode.textContent = reason === "language" ? t("localFallbackReady") : t("contextUpdated");
    }
    pulse(document.querySelector(".workspace"));
  }
}

function applyLanguage() {
  document.documentElement.lang = state.selectedLanguage;
  document.querySelectorAll("[data-i18n]").forEach((node) => {
    node.textContent = t(node.dataset.i18n);
  });
  els.sourceNote.textContent = t("sourceNote", { date: state.dataLastReviewed });
  if (!els.answerBox.textContent.trim()) {
    if (els.assistantMode) els.assistantMode.textContent = t("localFallbackReady");
  }
  if (!els.questionInput.value.trim() || Object.values(dictionaries).some((dict) => dict.defaultQuestion === els.questionInput.value)) {
    els.questionInput.value = t("defaultQuestion");
  }
}

function populateControls() {
  const language = state.selectedLanguage;
  fillSelect(els.venueSelect, state.venues.map((venue) => ({ id: venue.id, label: `${venue.city} - ${venue.fifaName}` })), state.selectedVenueId);
  fillSelect(els.scenarioSelect, state.scenarios.map((scenario) => ({ id: scenario.id, label: scenarioLabel(scenario.id) })), state.selectedScenarioId);
  fillSelect(els.roleSelect, state.roles.map((role) => ({ id: role.id, label: roleLabels[role.id]?.[language] || role.label })), state.selectedRole);
  fillSelect(els.languageSelect, state.languages.map((item) => ({ id: item.id, label: languageLabels[language]?.[item.id] || item.label })), state.selectedLanguage);
  fillSelect(els.destinationSelect, destinationOptions.map((item) => ({ id: item.id, label: item.label[language] })), state.selectedDestination);
  fillSelect(els.mobilitySelect, mobilityOptions.map((item) => ({ id: item.id, label: item.label[language] })), state.selectedMobility);
}

function renderVenueHeader(venue) {
  els.venueMeta.textContent = `${venue.city}, ${venue.country} | ${venue.timezone}`;
  els.venueTitle.textContent = venue.fifaName;
  els.phaseText.textContent = translatePhase(state.telemetry.phase);
  
  const capacityEl = document.querySelector("#stadiumCapacity");
  if (capacityEl) capacityEl.textContent = formatNumber(venue.capacity);
  
  const transitEl = document.querySelector("#stadiumTransit");
  if (transitEl) transitEl.textContent = venue.transitModes.slice(0, 2).join(", ");
}

// renderContextStrip removed

function renderMatchFocus(venue) {
  const match = matchForVenue(venue.id);
  els.matchStatus.textContent = t(`status_${match.status}`);
  els.matchStatus.dataset.status = match.status;

  const wrapper = document.createElement("div");
  wrapper.className = "match-focus";

  const scoreboard = document.createElement("div");
  scoreboard.className = "scoreboard";
  scoreboard.append(renderTeam(match.home, "home"));

  const score = document.createElement("div");
  score.className = "score-core";
  const scoreLine = document.createElement("div");
  scoreLine.className = "score-line";
  scoreLine.textContent = scoreText(match);
  const clock = document.createElement("div");
  clock.className = "match-clock";
  clock.textContent = matchClock(match);
  const stage = document.createElement("p");
  stage.textContent = `${match.stage} | ${venue.fifaName}`;
  score.append(scoreLine, clock, stage);

  scoreboard.append(score, renderTeam(match.away, "away"));

  const infoGrid = document.createElement("div");
  infoGrid.className = "match-info-grid";
  infoGrid.append(
    statTile(t("attendance"), match.attendance ? formatNumber(match.attendance) : t("kickoff", { time: match.kickoffLocal })),
    statTile(t("latestEvent"), latestTimeline(match)?.label || t("liveOpsHint")),
    statTile(t("operationsCue"), match.operationsNotes[0])
  );

  const playerGrid = document.createElement("div");
  playerGrid.className = "player-grid";
  playerGrid.append(playerColumn(match.home), playerColumn(match.away));

  const timeline = document.createElement("div");
  timeline.className = "timeline-list";
  for (const event of match.timeline.slice(-3)) {
    const item = document.createElement("div");
    item.className = `timeline-item ${event.type}`;
    const minute = document.createElement("span");
    minute.textContent = event.minute < 0 ? `${Math.abs(event.minute)}m pre` : t("minute", { minute: event.minute });
    const label = document.createElement("p");
    label.textContent = event.label;
    item.append(minute, label);
    timeline.append(item);
  }

  const notice = document.createElement("p");
  notice.className = "simulation-note";
  notice.textContent = match.status === "upcoming" ? t("liveOpsHint") : t("simulatedNotice");

  wrapper.append(scoreboard, infoGrid, sectionBlock(t("playersToWatch"), playerGrid), sectionBlock(t("timeline"), timeline), notice);
  replaceChildren(els.matchFocus, [wrapper]);
  pulse(document.querySelector("#matchFocusPanel"));
}

function renderConcern(telemetry) {
  const risk = telemetry.risk;
  const topDriver = risk.drivers[0] || { label: "Crowd density", value: telemetry.crowdDensity };
  els.concernTitle.textContent = localizedDriver(topDriver.label);
  els.riskLevel.textContent = t(`risk_${risk.level}`);
  els.riskLevel.dataset.risk = risk.level;
  els.riskScore.textContent = risk.score;
  els.riskFill.style.width = `${risk.score}%`;
  els.riskFill.style.background = riskColor(risk.level);
  els.concernSummary.textContent = `${t("mainConcern", { driver: localizedDriver(topDriver.label) })} ${t("concernAction")}`;

  replaceChildren(els.driverList, risk.drivers.map((driver) => {
    const node = document.createElement("div");
    node.className = "driver-item";
    node.innerHTML = `<strong></strong><span></span>`;
    node.querySelector("strong").textContent = localizedDriver(driver.label);
    node.querySelector("span").textContent = `${driver.value}%`;
    return node;
  }));
  pulse(els.concernPanel);
}

function renderMetrics(telemetry) {
  let weatherText = t("heatIndexNote");
  if (telemetry.externalWeather) {
    const desc = weatherDesc(telemetry.externalWeather.weatherCode);
    weatherText = `${desc} | Live: ${telemetry.externalWeather.tempF}°F, ${telemetry.externalWeather.humidity}% hum, ${telemetry.externalWeather.windSpeedMph}mph wind`;
  }
  
  const metrics = [
    { label: t("gateQueue"), value: `${telemetry.queueMinutes} min`, note: t("gateQueueNote") },
    { label: t("crowdDensity"), value: `${telemetry.crowdDensity}%`, note: t("crowdDensityNote") },
    { label: t("transitLoad"), value: `${telemetry.transitLoad}%`, note: t("transitLoadNote") },
    { label: t("heatIndex"), value: `${telemetry.heatIndexF}°F`, note: weatherText },
    { label: t("accessDemand"), value: `${telemetry.accessibleDemand}%`, note: t("accessDemandNote") },
    { label: t("wasteLoad"), value: `${telemetry.wasteLoad}%`, note: t("wasteLoadNote") }
  ];
  replaceChildren(els.metricGrid, metrics.map((metric, index) => {
    const card = document.createElement("article");
    card.className = "metric-card tile-pop";
    card.style.setProperty("--delay", `${index * 35}ms`);
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
  pulse(els.metricGrid);
}

function renderDecisions(cards, venue, telemetry) {
  replaceChildren(els.decisionList, cards.map((card, index) => {
    const key = decisionKeys[card.title] || "operations";
    const node = document.createElement("article");
    node.className = "decision-card tile-pop";
    node.style.setProperty("--delay", `${index * 45}ms`);

    // Add persona card highlighting
    const roleId = state.selectedRole;
    let isPreferred = false;
    if (roleId === "volunteer" && card.owner === "Volunteer lead") isPreferred = true;
    if (roleId === "venue-staff" && (card.owner === "Venue services" || card.owner === "Operations")) isPreferred = true;
    if (roleId === "organizer" && (card.owner === "Operations" || card.owner === "Medical")) isPreferred = true;
    if (roleId === "fan" && (card.title === "Crowd flow" || card.title === "Transit" || card.title === "Sustainability")) isPreferred = true;

    if (isPreferred) {
      node.classList.add("highlighted-role-card");
    }

    const head = document.createElement("div");
    head.className = "card-head";
    const title = document.createElement("h4");
    title.textContent = t(key);
    const priority = document.createElement("span");
    priority.className = "priority";
    priority.textContent = t(priorityKeys[card.priority] || "monitor");
    head.append(title, priority);
    const owner = document.createElement("p");
    owner.className = "owner";
    owner.textContent = t(ownerKeys[card.owner] || "operations");
    const action = document.createElement("p");
    action.textContent = localizedDecisionAction(card.title, venue, telemetry);
    node.append(head, owner, action);
    return node;
  }));
  pulse(els.decisionList);
}

function renderRoute(venue, route, telemetry) {
  const needsAccessibleRoute = state.selectedMobility !== "none";
  const nodes = [];
  const summary = document.createElement("div");
  summary.className = "route-step route-summary";
  if (needsAccessibleRoute) {
    summary.classList.add("accessible-active");
  }
  summary.innerHTML = `<strong></strong><small></small>`;
  
  // Custom route title based on selected persona
  const roleId = state.selectedRole;
  let routeTitleText = t("routeSummary", {
    destination: optionLabel(destinationOptions, state.selectedDestination),
    minutes: route.etaMinutes
  });
  if (roleId === "volunteer") {
    routeTitleText = `♿ [Volunteer Assistant] Guide fans to: ${optionLabel(destinationOptions, state.selectedDestination)} (${route.etaMinutes} mins)`;
  } else if (roleId === "venue-staff" || roleId === "organizer") {
    routeTitleText = `📋 [Staff Access Path] Destination: ${optionLabel(destinationOptions, state.selectedDestination)} (${route.etaMinutes} mins)`;
  }

  summary.querySelector("strong").textContent = routeTitleText;
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
  pulse(els.routePlan);
}

function renderMap() {
  replaceChildren(els.venueMap, state.venues.map((venue) => {
    const pin = document.createElement("button");
    pin.type = "button";
    pin.className = `venue-pin${venue.id === state.selectedVenueId ? " active" : ""}`;
    pin.style.left = `${venue.pin.x}%`;
    pin.style.top = `${venue.pin.y}%`;
    pin.setAttribute("aria-label", `${t("venueLabel")}: ${venue.city}`);
    pin.title = venue.city;
    pin.addEventListener("click", async () => {
      state.selectedVenueId = venue.id;
      els.venueSelect.value = venue.id;
      await refreshTelemetry("filter");
    });
    const label = document.createElement("span");
    label.textContent = venue.city;
    pin.append(label);
    return pin;
  }));
}

function renderMatchHistory(venue) {
  const current = matchForVenue(venue.id);
  const completed = state.matches
    .filter((match) => match.status === "completed")
    .sort((a, b) => (a.venueId === venue.id ? -1 : 0) - (b.venueId === venue.id ? -1 : 0))
    .slice(0, 4);

  const wrapper = document.createElement("div");
  wrapper.className = "history-list";

  const currentCard = matchHistoryCard(current, true);
  wrapper.append(currentCard);

  if (completed.length) {
    for (const match of completed) {
      if (match.id !== current.id) wrapper.append(matchHistoryCard(match, false));
    }
  } else {
    const empty = document.createElement("p");
    empty.className = "empty-state";
    empty.textContent = t("noHistory");
    wrapper.append(empty);
  }

  replaceChildren(els.matchHistory, [wrapper]);
  pulse(els.matchHistory);
}

function renderQuickPrompts() {
  const prompts = [t("quick1"), t("quick2"), t("quick3"), t("quick4")];
  replaceChildren(els.quickPrompts, prompts.map((prompt) => {
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
  state.assistantQueried = true;
  setActiveTab("assistant", false); // Do not auto-scroll on background/automatic queries
  els.askButton.disabled = true;
  if (els.assistantMode) els.assistantMode.textContent = t("generatingPlan");
  els.answerBox.innerHTML = `<p class="empty-state">${t("working")}</p>`;
  pulse(els.answerBox);
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
        question: els.questionInput.value,
        externalWeather: state.telemetry?.externalWeather
      })
    });
    state.telemetry = result.telemetry;
    state.route = result.route;
    state.cards = result.cards;
    if (els.assistantMode) {
      els.assistantMode.textContent = result.mode === "openai"
        ? t("openAiMode", { model: result.model })
        : result.mode === "groq"
          ? t("groqMode", { model: result.model })
          : t("localGroundedFallback");
    }
    els.answerBox.innerHTML = parseMarkdown(result.modelError
      ? `${result.answer}\n\n${t("providerNote", { message: result.modelError })}`
      : result.answer);
    renderConcern(state.telemetry);
    renderDecisions(state.cards, state.venue, state.telemetry);
    renderRoute(state.venue, state.route, state.telemetry);
    pulse(els.answerBox);
  } catch (error) {
    els.answerBox.innerHTML = parseMarkdown(t("unablePlan", { message: error.message }));
    if (els.assistantMode) els.assistantMode.textContent = t("assistantError");
  } finally {
    els.askButton.disabled = false;
  }
}

function renderTeam(team, side) {
  const node = document.createElement("div");
  node.className = `team-block ${side}`;
  node.style.setProperty("--team-color", team.color || "#2563eb");
  const flag = document.createElement("div");
  flag.className = "team-flag";
  flag.textContent = team.flag || team.code || "";
  const name = document.createElement("strong");
  name.textContent = team.name;
  const code = document.createElement("span");
  code.textContent = `${team.code || ""} | ${team.formation || ""}`;
  node.append(flag, name, code);
  return node;
}

function playerColumn(team) {
  const column = document.createElement("div");
  column.className = "player-column";
  const title = document.createElement("h4");
  title.textContent = `${team.flag || ""} ${team.name}`;
  column.append(title);
  for (const player of (team.players || []).slice(0, 3)) {
    const row = document.createElement("div");
    row.className = "player-row";
    const name = document.createElement("strong");
    name.textContent = player.name;
    const detail = document.createElement("span");
    detail.textContent = `${player.role} - ${player.note}`;
    row.append(name, detail);
    column.append(row);
  }
  return column;
}

function sectionBlock(title, content) {
  const section = document.createElement("section");
  section.className = "mini-section";
  const heading = document.createElement("h4");
  heading.textContent = title;
  section.append(heading, content);
  return section;
}

function statTile(label, value) {
  const node = document.createElement("div");
  node.className = "match-stat";
  const title = document.createElement("span");
  title.textContent = label;
  const text = document.createElement("strong");
  text.textContent = value;
  node.append(title, text);
  return node;
}

function matchHistoryCard(match, active) {
  const node = document.createElement("article");
  node.className = `history-card${active ? " active" : ""}`;
  const top = document.createElement("div");
  top.className = "history-teams";
  top.textContent = `${match.home.flag} ${match.home.code} ${scoreFor(match.home)} - ${scoreFor(match.away)} ${match.away.code} ${match.away.flag}`;
  const meta = document.createElement("p");
  meta.textContent = `${t(`status_${match.status}`)} | ${match.stage} | ${match.kickoffLocal}`;
  const cue = document.createElement("small");
  cue.textContent = latestTimeline(match)?.label || match.operationsNotes[0];
  node.append(top, meta, cue);
  return node;
}

function matchForVenue(venueId) {
  return state.matches.find((match) => match.venueId === venueId)
    || state.matches.find((match) => match.status === "live")
    || state.matches[0];
}

function latestTimeline(match) {
  return [...(match.timeline || [])].sort((a, b) => b.minute - a.minute)[0];
}

function scoreText(match) {
  if (match.status === "upcoming") return "vs";
  return `${scoreFor(match.home)} - ${scoreFor(match.away)}`;
}

function scoreFor(team) {
  return team.score ?? 0;
}

function matchClock(match) {
  if (match.status === "live") return t("minute", { minute: match.minute });
  if (match.status === "completed") return t("fullTime");
  return t("kickoff", { time: match.kickoffLocal });
}

function localizedDecisionAction(title, venue, telemetry) {
  if (title === "Safety trigger") {
    return t("actionSafety", { place: venue.operations.chokePoints[0] });
  }
  if (title === "Crowd flow") {
    return telemetry.queueMinutes > 30
      ? t("actionCrowdOpen", { gate: venue.operations.accessibleEntry, secondary: venue.operations.secondaryIngress })
      : t("actionCrowdHold", { primary: venue.operations.primaryIngress });
  }
  if (title === "Accessible service") {
    return telemetry.accessibleDemand > 60
      ? t("actionAccessNow", { place: venue.operations.accessibleEntry })
      : t("actionAccessReady", { place: venue.operations.accessibleEntry });
  }
  if (title === "Transit") {
    return telemetry.transitLoad > 70
      ? t("actionTransitNow", { place: venue.operations.transitHub })
      : t("actionTransitHold", { modes: venue.transitModes.slice(0, 2).join(" and ") });
  }
  if (title === "Sustainability") {
    return telemetry.wasteLoad > 72
      ? t("actionWasteNow", { place: venue.operations.primaryIngress })
      : t("actionWasteHold");
  }
  return title;
}

function routeTarget(venue) {
  const targets = {
    gate: state.selectedMobility === "none" ? venue.operations.primaryIngress : venue.operations.accessibleEntry,
    transit: venue.operations.transitHub,
    medical: venue.operations.medical,
    accessibility: venue.operations.accessibleEntry,
    water: "nearest refill and shade station",
    sustainability: "nearest sorting station"
  };
  return targets[state.selectedDestination] || targets.gate;
}

function localizedDriver(label) {
  const key = {
    "Gate queues": "gateQueue",
    "Crowd density": "crowdDensity",
    "Transit load": "transitLoad",
    "Heat index": "heatIndex",
    "Accessible service demand": "accessDemand",
    "Weather risk": "scenario",
    "Waste load": "wasteLoad",
    "Active incidents": "concernEyebrow"
  }[label];
  return key ? t(key) : label;
}

function translatePhase(phase) {
  return t(`phase_${phase.replaceAll(" ", "_")}`);
}

function scenarioLabel(id) {
  return scenarioLabels[id]?.[state.selectedLanguage] || id;
}

function optionLabel(options, id) {
  return options.find((item) => item.id === id)?.label[state.selectedLanguage] || id;
}

async function fetchJson(url, options) {
  const response = await fetch(url, options);
  if (!response.ok) {
    throw new Error(`Request failed: ${response.status}`);
  }
  return response.json();
}

function fillSelect(select, items, selectedValue) {
  select.innerHTML = "";
  for (const item of items) {
    const option = document.createElement("option");
    option.value = item.id;
    option.textContent = item.label;
    select.append(option);
  }
  select.value = selectedValue;
}

function replaceChildren(parent, children) {
  parent.replaceChildren(...children);
}

function pulse(element) {
  if (!element) return;
  element.classList.remove("is-changing");
  void element.offsetWidth;
  element.classList.add("is-changing");
}

function riskColor(level) {
  if (level === "critical") return "var(--red)";
  if (level === "high") return "#ea580c";
  if (level === "elevated") return "var(--amber)";
  return "var(--green)";
}

function formatNumber(value) {
  return new Intl.NumberFormat(state.selectedLanguage === "en" ? "en-US" : state.selectedLanguage).format(value);
}

function t(key, values = {}) {
  const dictionary = dictionaries[state.selectedLanguage] || dictionaries.en;
  const template = dictionary[key] || dictionaries.en[key] || key;
  return Object.entries(values).reduce((text, [name, value]) => text.replaceAll(`{${name}}`, value), template);
}

let clockInterval = null;
function startVenueClock(timezone) {
  if (clockInterval) clearInterval(clockInterval);
  const el = document.querySelector("#timezoneClock");
  if (!el) return;
  const update = () => {
    try {
      const timeStr = new Date().toLocaleTimeString("en-US", {
        timeZone: timezone,
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: true
      });
      el.textContent = timeStr;
    } catch (e) {
      el.textContent = new Date().toLocaleTimeString();
    }
  };
  update();
  clockInterval = setInterval(update, 1000);
}

function updateMapCard(venue) {
  const titleEl = document.querySelector("#mapCardTitle");
  const nameEl = document.querySelector("#mapCardVenueName");
  const coordsEl = document.querySelector("#mapCardCoords");
  const linkEl = document.querySelector("#mapDirectionsLink");

  if (titleEl) titleEl.textContent = venue.city;
  if (nameEl) nameEl.textContent = `${venue.venueName} (${venue.fifaName})`;
  if (coordsEl) coordsEl.textContent = `Coordinates: ${venue.coordinates.lat}, ${venue.coordinates.lng}`;
  if (linkEl) {
    linkEl.href = `https://www.google.com/maps/dir/?api=1&destination=${venue.coordinates.lat},${venue.coordinates.lng}`;
  }
}

function weatherDesc(code) {
  if (code >= 95) return "Thunderstorm";
  if (code >= 80 && code <= 82) return "Rain Showers";
  if (code >= 71 && code <= 77) return "Snow";
  if (code >= 61 && code <= 67) return "Rainy";
  if (code >= 51 && code <= 57) return "Drizzle";
  if (code >= 45 && code <= 48) return "Foggy";
  if (code >= 1 && code <= 3) return "Partly Cloudy";
  return "Clear Sky";
}

function initTabs() {
  const tabs = document.querySelectorAll(".tab-button");
  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      setActiveTab(tab.dataset.tab);
    });
  });

  const allIds = ["#concernPanel", "#decisionsPanel", "#matchFocusPanel", "#telemetryPanel", "#routePanel", "#historyPanel", "#assistantPanel"];
  
  allIds.forEach((id) => {
    const el = document.querySelector(id);
    if (el) {
      const head = el.querySelector(".panel-head");
      if (head) {
        head.addEventListener("click", (e) => {
          e.stopPropagation();
          const isExpanded = el.classList.contains("focused") || el.classList.contains("expanded");
          if (isExpanded) {
            el.classList.remove("focused", "expanded");
          } else {
            el.classList.add("focused", "expanded");
            el.scrollIntoView({ behavior: "smooth", block: "start" });
          }
        });
      }
    }
  });

  setActiveTab("overview", false);
}

function setActiveTab(tabName, scrollTo = true) {
  state.activeTab = tabName;

  document.querySelectorAll(".tab-button").forEach((btn) => {
    btn.classList.toggle("active", btn.dataset.tab === tabName);
  });

  let focusedIds = [];
  if (tabName === "overview") {
    focusedIds = ["#concernPanel", "#decisionsPanel", "#matchFocusPanel"];
  } else if (tabName === "match") {
    focusedIds = ["#matchFocusPanel", "#historyPanel"];
  } else if (tabName === "signals") {
    focusedIds = ["#telemetryPanel", "#concernPanel"];
  } else if (tabName === "decisions") {
    focusedIds = ["#decisionsPanel"];
  } else if (tabName === "route") {
    focusedIds = ["#routePanel"];
  } else if (tabName === "assistant") {
    focusedIds = ["#assistantPanel"];
  }

  const allIds = ["#concernPanel", "#decisionsPanel", "#matchFocusPanel", "#telemetryPanel", "#routePanel", "#historyPanel", "#assistantPanel"];
  allIds.forEach((id) => {
    const el = document.querySelector(id);
    if (el) {
      const isFocused = focusedIds.includes(id);
      el.classList.toggle("focused", isFocused);
      el.classList.toggle("expanded", isFocused);
      el.style.order = "";
    }
  });

  if (scrollTo && focusedIds.length > 0) {
    const firstEl = document.querySelector(focusedIds[0]);
    if (firstEl) {
      firstEl.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }
}
