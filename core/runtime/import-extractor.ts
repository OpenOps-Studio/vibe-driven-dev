import fs from "fs-extra";
import path from "node:path";

export interface VddRule {
  ruleId: string;
  name: string;
  description: string;
  rationale?: string;
  consequence?: string;
}

export interface RuleSet {
  ruleSetName: string;
  description: string;
  rules: VddRule[];
}

export class ImportExtractor {
  async extractFromDirectory(directoryPath: string): Promise<string> {
    if (!(await fs.pathExists(directoryPath))) {
      throw new Error(`Directory not found: ${directoryPath}`);
    }

    const files = await fs.readdir(directoryPath);
    const jsonFiles = files.filter((f) => f.endsWith(".rules.json"));

    let markdown = "# VDD Promotion Proposal: Extracted Rules\n\n";
    markdown += "The following rules were extracted from archived legacy material and are proposed for integration into the project's `Constraints.md` or as a new Workspace Pack.\n\n";

    for (const file of jsonFiles) {
      const suite = await this.readRuleSet(path.join(directoryPath, file));
      if (suite) {
        markdown += `## ${suite.ruleSetName}\n`;
        markdown += `${suite.description}\n\n`;

        for (const rule of suite.rules) {
          markdown += `### [${rule.ruleId}] ${rule.name}\n`;
          markdown += `**Requirement**: ${rule.description}\n`;
          if (rule.rationale) markdown += `**Rationale**: ${rule.rationale}\n`;
          if (rule.consequence) markdown += `**Consequence**: ${rule.consequence}\n`;
          markdown += "\n";
        }
        markdown += "---\n\n";
      }
    }

    return markdown;
  }

  private async readRuleSet(filePath: string): Promise<RuleSet | null> {
    try {
      const content = await fs.readJson(filePath);
      return {
        ruleSetName: content.ruleSetName || path.basename(filePath),
        description: content.description || "No description provided.",
        rules: Array.isArray(content.rules) ? content.rules : []
      };
    } catch {
      return null;
    }
  }
}
