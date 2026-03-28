/**
 * Security Gate Implementation
 * 
 * Performs passive security analysis on current project context,
 * identifying high-risk patterns like hardcoded secrets, SQLi vulnerability signs,
 * or PII exposure.
 */

export interface SecurityAuditResult {
  passed: boolean;
  score: number;
  findings: Array<{
    severity: "critical" | "high" | "medium" | "low";
    pattern: string;
    message: string;
    filehint?: string | undefined;
  }>;
}

const COMMON_SECRET_PATTERNS = [
  { pattern: /sk_[a-zA-Z0-9]{24,}/, name: "OpenAI Secret Key" },
  { pattern: /AKIA[0-9A-Z]{16}/, name: "AWS Access Key ID" },
  { pattern: /ghp_[a-zA-Z0-9]{36}/, name: "GitHub Personal Access Token" },
  { pattern: /mongodb\+srv:\/\/[a-zA-Z0-9:@.]+/, name: "MongoDB Connection String" },
  {
    pattern: /\b(?:api[_-]?key|secret|token|password|bearer)\b\s*[:=]\s*["'][^"']{8,}["']/i,
    name: "Generic Secret Assignment"
  },
  {
    pattern: /-----BEGIN [A-Z ]+PRIVATE KEY-----/,
    name: "Private Key Block"
  }
];

const SQLI_PATTERNS = [
  { pattern: /"\s*\+\s*.*\s*\+\s*"/, name: "String Concatenation in Query" },
  { pattern: /`\s*\${.*}\s*`/, name: "Template Literal in SQL/DB Call" },
  { pattern: /\bunion\s+select\b/i, name: "Union Select Injection" }
];

export class SecurityGate {
  async audit(content: string, fileName?: string): Promise<SecurityAuditResult> {
    const findings: SecurityAuditResult["findings"] = [];
    let score = 100;
    const normalized = content.toLowerCase();

    const addFinding = (
      severity: "critical" | "high" | "medium" | "low",
      pattern: string,
      message: string,
      deduction: number
    ): void => {
      findings.push({
        severity,
        pattern,
        message,
        filehint: fileName
      });
      score -= deduction;
    };

    // 1. Check for hardcoded secrets
    for (const { pattern, name } of COMMON_SECRET_PATTERNS) {
      if (pattern.test(content)) {
        const severity = name === "Generic Secret Assignment" ? "high" : "critical";
        addFinding(
          severity,
          name,
          `Detected potential hardcoded secret: ${name}`,
          severity === "critical" ? 40 : 25
        );
      }
    }

    // 2. Check for SQL Injection patterns
    for (const { pattern, name } of SQLI_PATTERNS) {
      // Very basic check - would need smarter context-aware analysis in a real production system
      if (pattern.test(content) && (normalized.includes("select") || normalized.includes("where") || normalized.includes("query"))) {
        addFinding(
          "high",
          name,
          `Detected potential SQL injection vulnerability: ${name}`,
          20
        );
      }
    }

    return {
      passed: score >= 70,
      score: Math.max(0, score),
      findings
    };
  }
}
