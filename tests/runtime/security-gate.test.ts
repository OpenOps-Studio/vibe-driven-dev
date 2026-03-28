import { describe, it, expect } from "vitest";
import { SecurityGate } from "../../core/gates/security-gate.js";

describe("SecurityGate", () => {
  it("passes clean content", async () => {
    const gate = new SecurityGate();
    const result = await gate.audit("export const value = 42;");

    expect(result.passed).toBe(true);
    expect(result.score).toBe(100);
    expect(result.findings).toHaveLength(0);
  });

  it("detects hardcoded secrets and SQL injection signals", async () => {
    const gate = new SecurityGate();
    const result = await gate.audit(`
      const apiKey = "secret-token-value";
      const query = "SELECT * FROM users WHERE id = " + userId + " OR 1=1";
      const key = \`-----BEGIN PRIVATE KEY-----\`;
    `, "src/security.ts");

    expect(result.passed).toBe(false);
    expect(result.score).toBeLessThan(70);
    expect(result.findings.some((finding) => finding.severity === "high")).toBe(true);
    expect(result.findings.every((finding) => finding.filehint === "src/security.ts")).toBe(true);
  });

  it("never returns a negative score even with repeated issues", async () => {
    const gate = new SecurityGate();
    const result = await gate.audit(`
      sk_123456789012345678901234
      sk_123456789012345678901234
      SELECT * FROM accounts WHERE email = " + email + "
    `);

    expect(result.score).toBeGreaterThanOrEqual(0);
    expect(result.findings.some((finding) => finding.severity === "critical")).toBe(true);
  });
});
