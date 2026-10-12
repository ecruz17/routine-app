// Run with `npm test` (Node's built-in test runner; types are stripped natively).
import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { parseDuration, parseTime, to12h } from "./time-format.ts";

describe("parseTime", () => {
  const cases: [string, string][] = [
    ["8 a.m.", "08:00"],
    ["5:15 p.m.", "17:15"],
    ["8am", "08:00"],
    ["8 AM", "08:00"],
    ["8:00 a. m.", "08:00"],
    ["11:30 p.m.", "23:30"],
    ["20:00", "20:00"],
    ["20:00 hrs", "20:00"],
    ["07:05", "07:05"],
    ["12 a.m.", "00:00"],
    ["12 p.m.", "12:00"],
    ["12:30 a.m.", "00:30"],
    ["  10 P.M.  ", "22:00"],
  ];
  for (const [input, expected] of cases) {
    it(`"${input}" → ${expected}`, () => assert.equal(parseTime(input), expected));
  }

  for (const input of ["", "mañana", "13 p.m.", "0 a.m.", "8:75 a.m.", "25:00", "8"]) {
    it(`rejects "${input}"`, () => assert.equal(parseTime(input), null));
  }

  it("round-trips with to12h", () => {
    for (const time of ["00:00", "08:00", "12:00", "12:45", "17:15", "23:30"]) {
      assert.equal(parseTime(to12h(time)), time);
    }
  });
});

describe("parseDuration", () => {
  const cases: [string, number][] = [
    ["30 minutos", 30],
    ["1 minuto", 1],
    ["1 hora", 60],
    ["2 horas", 120],
    ["1 hora 30 minutos", 90],
    ["1 hora y 30 minutos", 90],
    ["1.5 horas", 90],
    ["1,5 horas", 90],
    ["90 min", 90],
    ["1 h 30 min", 90],
    ["1h30min", 90],
    ["45 mins", 45],
    ["2 hrs", 120],
    ["media hora", 30],
    ["1 hora y media", 90],
    ["  2 Horas  ", 120],
  ];
  for (const [input, expected] of cases) {
    it(`"${input}" → ${expected}`, () => assert.equal(parseDuration(input), expected));
  }

  for (const input of ["", "un rato", "0 minutos", "horas"]) {
    it(`rejects "${input}"`, () => assert.equal(parseDuration(input), null));
  }
});
