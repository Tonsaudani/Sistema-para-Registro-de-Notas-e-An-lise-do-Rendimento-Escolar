import { describe, expect, it } from "vitest";
import { getHealthStatus } from "../src/services/healthService.js";
describe("healthService", () => {
  it("deve retornar status ok", () => {
    expect(getHealthStatus()).toEqual({ status: "ok", service: "sistema-desempenho-backend" });
  });
});
