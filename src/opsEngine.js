import { SCENARIOS, VENUES } from "./data/venues.js";

/**
 * Clamps a numeric value between a minimum and maximum threshold.
 * @param {number} value - The input value.
 * @param {number} min - The lower boundary.
 * @param {number} max - The upper boundary.
 * @returns {number} The clamped value.
 */
export function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

/**
 * Finds a venue configuration object by its unique string identifier.
 * @param {string} venueId - The venue ID.
 * @returns {Object} The matched venue object or the default venue.
 */
export function findVenue(venueId) {
  return VENUES.find((venue) => venue.id === venueId) || VENUES[0];
}

/**
 * Finds a matchday scenario configuration object by its unique string identifier.
 * @param {string} scenarioId - The scenario ID.
 * @returns {Object} The matched scenario object or the default baseline.
 */
export function findScenario(scenarioId) {
  return SCENARIOS.find((scenario) => scenario.id === scenarioId) || SCENARIOS[0];
}

/**
 * Infers the active matchday phase based on the hour of the day.
 * @param {Date} now - The active date/time object.
 * @returns {string} The active matchday phase name.
 */
export function getMatchPhase(now = new Date()) {
  const hour = now.getHours();
  if (hour >= 8 && hour < 12) return "early operations";
  if (hour >= 12 && hour < 16) return "arrival build";
  if (hour >= 16 && hour < 20) return "ingress peak";
  if (hour >= 20 && hour < 23) return "egress and transit";
  return "overnight reset";
}

/**
 * Generates synthetic or API-grounded telemetry datasets for a chosen venue and scenario.
 * @param {string} venueId - The venue ID.
 * @param {string} scenarioId - The scenario ID.
 * @param {Date} now - The current date/time context.
 * @param {Object|null} externalWeather - Weather inputs if retrieved from real-time API.
 * @returns {Object} The populated telemetry data object.
 */
export function buildTelemetry(venueId, scenarioId = "baseline", now = new Date(), externalWeather = null) {
  const venue = findVenue(venueId);
  const scenario = findScenario(scenarioId);
  const minute = now.getMinutes();
  const capacityFactor = clamp((venue.capacity - 45000) / 50000, 0, 1);
  const timeWave = (Math.sin((minute + venue.capacity % 29) / 8) + 1) / 2;
  const phase = getMatchPhase(now);
  const phaseBoost = phase === "ingress peak" ? 10 : phase === "egress and transit" ? 8 : phase === "arrival build" ? 5 : 0;
  const modifiers = scenario.modifiers;

  const queueMinutes = Math.round(clamp(8 + timeWave * 14 + capacityFactor * 7 + phaseBoost + modifiers.queue, 2, 80));
  const crowdDensity = Math.round(clamp(42 + timeWave * 22 + capacityFactor * 11 + phaseBoost + modifiers.density, 12, 100));
  const transitLoad = Math.round(clamp(38 + timeWave * 18 + capacityFactor * 12 + modifiers.transit + (phase === "egress and transit" ? 18 : 0), 15, 100));
  const accessibleDemand = Math.round(clamp(28 + capacityFactor * 9 + timeWave * 10 + modifiers.accessibility, 8, 100));
  const wasteLoad = Math.round(clamp(34 + timeWave * 14 + capacityFactor * 9 + modifiers.waste + (phase === "ingress peak" ? 8 : 0), 8, 100));

  let heatIndexF;
  let weatherRisk;

  if (externalWeather) {
    heatIndexF = Math.round(clamp(externalWeather.apparentTempF + modifiers.heat, 45, 112));
    const code = externalWeather.weatherCode;
    let baseWeatherRisk = 0;
    if (code >= 95) baseWeatherRisk = 85;
    else if (code >= 80 && code <= 82) baseWeatherRisk = 60;
    else if (code >= 71 && code <= 77) baseWeatherRisk = 50;
    else if (code >= 61 && code <= 67) baseWeatherRisk = 40;
    else if (code >= 51 && code <= 57) baseWeatherRisk = 15;
    else if (code >= 45 && code <= 48) baseWeatherRisk = 20;
    weatherRisk = Math.round(clamp(baseWeatherRisk + (scenario.id === "weather-hold" ? 45 : 0), 0, 100));
  } else {
    heatIndexF = Math.round(clamp(74 + capacityFactor * 5 + modifiers.heat + (venue.country === "Mexico" ? 4 : 0), 45, 112));
    weatherRisk = Math.round(clamp(Math.max(0, modifiers.heat) * 1.6 + (scenario.id === "weather-hold" ? 45 : 0), 0, 100));
  }

  const incidentCount = Math.round(clamp(modifiers.incidents + (queueMinutes > 35 ? 1 : 0) + (heatIndexF > 94 ? 1 : 0), 0, 8));

  const telemetry = {
    venueId: venue.id,
    scenarioId: scenario.id,
    scenarioLabel: scenario.label,
    generatedAt: now.toISOString(),
    phase,
    queueMinutes,
    crowdDensity,
    transitLoad,
    heatIndexF,
    accessibleDemand,
    wasteLoad,
    weatherRisk,
    incidentCount,
    openGates: recommendOpenGates(venue, queueMinutes, crowdDensity),
    staffRedeploy: recommendStaffRedeploy(venue, crowdDensity, accessibleDemand, transitLoad),
    externalWeather
  };

  return {
    ...telemetry,
    risk: scoreTelemetry(telemetry)
  };
}

export function scoreTelemetry(telemetry) {
  const dimensions = [
    { key: "queue", label: "Gate queues", value: normalize(telemetry.queueMinutes, 10, 55), weight: 0.18 },
    { key: "density", label: "Crowd density", value: telemetry.crowdDensity / 100, weight: 0.22 },
    { key: "transit", label: "Transit load", value: telemetry.transitLoad / 100, weight: 0.15 },
    { key: "heat", label: "Heat index", value: normalize(telemetry.heatIndexF, 78, 104), weight: 0.14 },
    { key: "accessibility", label: "Accessible service demand", value: telemetry.accessibleDemand / 100, weight: 0.1 },
    { key: "weather", label: "Weather risk", value: telemetry.weatherRisk / 100, weight: 0.11 },
    { key: "waste", label: "Waste load", value: telemetry.wasteLoad / 100, weight: 0.05 },
    { key: "incidents", label: "Active incidents", value: normalize(telemetry.incidentCount, 0, 6), weight: 0.05 }
  ].map((dimension) => ({
    ...dimension,
    value: clamp(dimension.value, 0, 1),
    impact: clamp(dimension.value, 0, 1) * dimension.weight
  }));

  const score = Math.round(dimensions.reduce((total, dimension) => total + dimension.impact, 0) * 100);
  const drivers = [...dimensions]
    .sort((a, b) => b.impact - a.impact)
    .slice(0, 3)
    .map((driver) => ({
      key: driver.key,
      label: driver.label,
      value: Math.round(driver.value * 100),
      impact: Number(driver.impact.toFixed(3))
    }));

  return {
    score: clamp(score, 0, 100),
    level: riskLevel(score),
    drivers
  };
}

export function riskLevel(score) {
  if (score >= 75) return "critical";
  if (score >= 56) return "high";
  if (score >= 36) return "elevated";
  return "stable";
}

export function buildDecisionCards(venue, telemetry) {
  const risk = telemetry.risk.level;
  const cards = [
    {
      title: "Crowd flow",
      owner: "Operations",
      priority: telemetry.queueMinutes > 30 || telemetry.crowdDensity > 70 ? "Now" : "Monitor",
      action: telemetry.queueMinutes > 30
        ? `Open ${telemetry.openGates.join(" and ")} and move mobile ticket checks to ${venue.operations.secondaryIngress}.`
        : `Keep ${venue.operations.primaryIngress} active and publish next best entry signs every 10 minutes.`
    },
    {
      title: "Accessible service",
      owner: "Volunteer lead",
      priority: telemetry.accessibleDemand > 60 ? "Now" : "Ready",
      action: telemetry.accessibleDemand > 60
        ? `Redeploy two volunteers to ${venue.operations.accessibleEntry} and pre-call elevator support.`
        : `Keep the priority lane visible at ${venue.operations.accessibleEntry} and confirm shuttle spacing.`
    },
    {
      title: "Transit",
      owner: "Transport desk",
      priority: telemetry.transitLoad > 70 ? "Now" : "Coordinate",
      action: telemetry.transitLoad > 70
        ? `Start metered release toward ${venue.operations.transitHub} and push alternate shuttle instructions.`
        : `Hold a standby message for ${venue.transitModes.slice(0, 2).join(" and ")} arrivals.`
    },
    {
      title: "Sustainability",
      owner: "Venue services",
      priority: telemetry.wasteLoad > 72 ? "Now" : "Rotate",
      action: telemetry.wasteLoad > 72
        ? `Send sorting staff to concession exits and clear overflow near ${venue.operations.primaryIngress}.`
        : `Rotate recycling captains through high-volume concessions and refill points.`
    }
  ];

  if (telemetry.heatIndexF >= 92 || risk === "critical") {
    cards.unshift({
      title: "Safety trigger",
      owner: "Medical",
      priority: "Now",
      action: `Broadcast water and shade guidance, then stage medical spotters near ${venue.operations.chokePoints[0]}.`
    });
  }

  return cards;
}

export function getRoutePlan(venueId, destination = "gate", mobilityNeed = "none", telemetry = null) {
  const venue = findVenue(venueId);
  const density = telemetry?.crowdDensity ?? 45;
  const avoidPrimary = density > 70;
  const needsAccessibleRoute = mobilityNeed !== "none";
  const destinationMap = {
    gate: {
      label: "Best entry gate",
      end: needsAccessibleRoute ? venue.operations.accessibleEntry : avoidPrimary ? venue.operations.secondaryIngress : venue.operations.primaryIngress
    },
    transit: { label: "Transit hub", end: venue.operations.transitHub },
    medical: { label: "Medical support", end: venue.operations.medical },
    accessibility: { label: "Accessible services", end: venue.operations.accessibleEntry },
    water: { label: "Water and shade", end: "nearest refill and shade station" },
    sustainability: { label: "Recycling and refill point", end: "nearest sorting station" },
    fanzone: { label: "FIFA Fan Festival", end: "main sponsor festival plaza" },
    merchandise: { label: "Official Merchandise Megastore", end: "stadium retail megastore" }
  };
  const target = destinationMap[destination] || destinationMap.gate;
  const start = avoidPrimary ? venue.operations.secondaryIngress : venue.operations.primaryIngress;
  const etaMinutes = Math.round(clamp(5 + density / 12 + (needsAccessibleRoute ? 4 : 0), 5, 22));

  const steps = [
    `Start from ${start}.`,
    avoidPrimary
      ? `Avoid ${venue.operations.chokePoints[0]} until density drops below 70 percent.`
      : `Use the signed lane toward ${venue.operations.primaryIngress}.`,
  ];

  if (mobilityNeed === "wheelchair") {
    steps.push(`Use the step-free ramp at Gate ${venue.operations.accessibleEntry} (elevator access active).`);
  } else if (mobilityNeed === "visual") {
    steps.push(`Follow yellow tactile warning indicators and request audio guidance maps.`);
  } else if (mobilityNeed === "hearing") {
    steps.push(`Watch overhead digital caption boards for entry queue times.`);
  } else if (mobilityNeed === "sensory") {
    steps.push(`Follow the low-noise bypass corridor to avoid loud concourse zones.`);
  } else if (needsAccessibleRoute) {
    steps.push(`Use the step-free route and check in at ${venue.operations.accessibleEntry}.`);
  } else {
    steps.push(`Follow staff line-of-sight markers toward ${target.end}.`);
  }

  steps.push(`End at ${target.end}.`);

  let accessibilityNote = "";
  if (mobilityNeed === "wheelchair") {
    accessibilityNote = `Wheelchair ramps, accessible lifts, and shuttle carts are active on this route.`;
  } else if (mobilityNeed === "visual") {
    accessibilityNote = `Tactile paving, braille signage, and audio wayfinding escorts are active on this route.`;
  } else if (mobilityNeed === "hearing") {
    accessibilityNote = `Assistive listening induction loops and live closed-caption screens are active on this route.`;
  } else if (mobilityNeed === "sensory") {
    accessibilityNote = `Noise-canceling headphones checkout and designated quiet zones are accessible along this route.`;
  } else if (needsAccessibleRoute) {
    accessibilityNote = `${venue.accessibility.slice(0, 2).join(" and ")} are available on this route.`;
  } else {
    accessibilityNote = `Accessible alternate: ${venue.operations.accessibleEntry}.`;
  }

  return {
    destination: target.label,
    etaMinutes,
    steps,
    accessibilityNote,
    avoid: avoidPrimary ? venue.operations.chokePoints.slice(0, 2) : []
  };
}

export function buildVenueSummary(venue) {
  return {
    id: venue.id,
    city: venue.city,
    country: venue.country,
    venueName: venue.venueName,
    fifaName: venue.fifaName,
    capacity: venue.capacity,
    timezone: venue.timezone,
    coordinates: venue.coordinates,
    pin: venue.pin,
    languages: venue.languages,
    transitModes: venue.transitModes,
    accessibility: venue.accessibility,
    sustainability: venue.sustainability,
    operations: venue.operations
  };
}

function normalize(value, min, max) {
  if (max === min) return 0;
  return clamp((value - min) / (max - min), 0, 1);
}

function recommendOpenGates(venue, queueMinutes, crowdDensity) {
  if (queueMinutes > 34 || crowdDensity > 72) {
    return [venue.operations.secondaryIngress, venue.operations.accessibleEntry];
  }
  if (queueMinutes > 20) {
    return [venue.operations.secondaryIngress];
  }
  return [venue.operations.primaryIngress];
}

function recommendStaffRedeploy(venue, crowdDensity, accessibleDemand, transitLoad) {
  if (accessibleDemand > 64) {
    return `Move accessibility volunteers to ${venue.operations.accessibleEntry}.`;
  }
  if (transitLoad > 72) {
    return `Move wayfinding staff to ${venue.operations.transitHub}.`;
  }
  if (crowdDensity > 70) {
    return `Move crowd marshals to ${venue.operations.chokePoints[0]}.`;
  }
  return `Keep roaming support between ${venue.operations.primaryIngress} and ${venue.operations.secondaryIngress}.`;
}
