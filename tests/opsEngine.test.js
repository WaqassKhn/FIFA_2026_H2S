import assert from "node:assert/strict";
import test from "node:test";
import { answerQuestion, extractOpenAIText } from "../src/assistant.js";
import { buildDecisionCards, buildTelemetry, findVenue, getRoutePlan, riskLevel, scoreTelemetry } from "../src/opsEngine.js";

test("riskLevel maps scores to operational levels", () => {
  assert.equal(riskLevel(20), "stable");
  assert.equal(riskLevel(36), "elevated");
  assert.equal(riskLevel(56), "high");
  assert.equal(riskLevel(75), "critical");
});

test("scenario telemetry increases risk during ingress rush", () => {
  const now = new Date("2026-07-06T18:15:00Z");
  const baseline = buildTelemetry("dallas", "baseline", now);
  const rush = buildTelemetry("dallas", "ingress-rush", now);

  assert.ok(rush.queueMinutes > baseline.queueMinutes);
  assert.ok(rush.crowdDensity > baseline.crowdDensity);
  assert.ok(rush.risk.score > baseline.risk.score);
});

test("scoreTelemetry identifies top drivers from extreme input", () => {
  const score = scoreTelemetry({
    queueMinutes: 60,
    crowdDensity: 90,
    transitLoad: 35,
    heatIndexF: 82,
    accessibleDemand: 30,
    wasteLoad: 20,
    weatherRisk: 0,
    incidentCount: 0
  });

  assert.equal(score.level, "elevated");
  assert.equal(score.drivers[0].key, "density");
});

test("route planning uses accessible entry when mobility support is requested", () => {
  const telemetry = buildTelemetry("toronto", "accessibility-surge", new Date("2026-07-06T17:00:00-04:00"));
  const route = getRoutePlan("toronto", "gate", "wheelchair", telemetry);
  const venue = findVenue("toronto");

  assert.ok(route.steps.some((step) => step.includes(venue.operations.accessibleEntry)));
  assert.ok(route.accessibilityNote.includes("step-free") || route.accessibilityNote.includes("accessible"));
});

test("decision cards include safety trigger for heat advisory", () => {
  const venue = findVenue("miami");
  const telemetry = buildTelemetry("miami", "heat-advisory", new Date("2026-07-06T18:30:00-04:00"));
  const cards = buildDecisionCards(venue, telemetry);

  assert.equal(cards[0].title, "Safety trigger");
});

test("assistant fallback returns grounded route and safety content", async () => {
  const result = await answerQuestion({
    venueId: "mexico-city",
    scenarioId: "accessibility-surge",
    role: "volunteer",
    language: "en",
    question: "A wheelchair user needs an accessible route to the gate."
  });

  assert.equal(result.mode, "local");
  assert.match(result.answer, /Mexico City Stadium/);
  assert.match(result.answer, /accessible/i);
  assert.match(result.answer, /emergency services/i);
});

test("extractOpenAIText supports Responses API output shape", () => {
  const text = extractOpenAIText({
    output: [
      {
        content: [
          { type: "output_text", text: "First line" },
          { type: "output_text", text: "Second line" }
        ]
      }
    ]
  });

  assert.equal(text, "First line\nSecond line");
});
