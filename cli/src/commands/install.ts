import chalk from "chalk";
import path from "node:path";
import { installClaude } from "../../../core/install/install-claude.js";
import { installGeneric } from "../../../core/install/install-generic.js";
import {
  listInstallTargets,
  resolveInstallTarget
} from "../../../core/install/registry.js";
import type { InstallScope } from "../../../core/install/target-types.js";

function printSection(title: string): void {
  console.log(chalk.bold.cyan(title));
}

export async function runInstallCommand(
  requestedTarget: string,
  options: { project?: boolean; global?: boolean; force?: boolean }
): Promise<void> {
  const projectRoot = process.cwd();
  const target = resolveInstallTarget(requestedTarget);

  if (!target) {
    console.log(chalk.red(`Unknown install target: ${requestedTarget}`));
    console.log(
      `Supported targets: ${listInstallTargets()
        .map((item) => item.id)
        .join(", ")}`
    );
    process.exitCode = 1;
    return;
  }

  printSection(`VDD install ${target.id}`);

  if (target.adapterStatus !== "implemented") {
    console.log(
      chalk.yellow(
        `${target.label} is not installable yet. This target is tracked as ${target.supportTier} / ${target.adapterStatus}.`
      )
    );
    console.log(chalk.gray(`Summary: ${target.summary}`));
    console.log(chalk.gray(`Conventions: ${target.runtimeConventions.join(", ")}`));
    console.log(chalk.gray("Run `vdd targets` to see the current support matrix."));
    process.exitCode = 1;
    return;
  }

  // --- Claude install ---
  if (target.id === "claude-code") {
    const scope: InstallScope = options.global ? "global" : "project";

    console.log(
      chalk.gray(
        `Installing VDD agents for Claude Code (scope: ${scope})...`
      )
    );
    console.log(
      chalk.gray(
        scope === "project"
          ? `  → Agents will appear in: .claude/agents/`
          : `  → Agents will appear in: ~/.claude/agents/`
      )
    );
    console.log("");

    const result = await installClaude(projectRoot, scope);

    if (result.agentsInstalled.length > 0) {
      for (const name of result.agentsInstalled) {
        console.log(chalk.green(`  ✓ vdd-${name}.md`));
      }
    }

    if (result.skipped.length > 0) {
      console.log("");
      console.log(chalk.yellow("  Already installed (skipped):"));
      for (const name of result.skipped) {
        console.log(chalk.gray(`    - vdd-${name}.md`));
      }
    }

    if (result.errors.length > 0) {
      console.log("");
      console.log(chalk.red("  Errors during install:"));
      for (const err of result.errors) {
        console.log(chalk.red(`    - ${err}`));
      }
    }

    console.log("");
    console.log(chalk.gray(`  VDD workspace:    ${path.relative(projectRoot, result.vddDir)}/`));
    console.log(chalk.gray(`  Agents directory: ${path.relative(projectRoot, result.agentsDir)}/`));
    console.log(chalk.gray(`  Manifest:         ${path.relative(projectRoot, result.manifestPath)}`));
    console.log("");

    if (result.ok) {
      console.log(chalk.green("✓ Claude install complete."));
      console.log("");
      console.log("Next steps:");
      console.log(`  ${chalk.cyan("vdd doctor")}   — verify environment health`);
      console.log(`  ${chalk.cyan("vdd scan")}     — discover installed agents and skills`);
      console.log(`  ${chalk.cyan("vdd run /vibe.init")}  — start the VDD workflow`);
    } else {
      console.log(chalk.yellow("⚠ Install completed with errors. Run `vdd doctor` to debug."));
      process.exitCode = 1;
    }

    return;
  }

  // --- Generic install ---
  if (target.id === "generic-agents-md") {
    console.log(chalk.gray("Installing VDD in portable AGENTS.md compatibility mode..."));
    console.log(chalk.gray("  → Canonical agents will appear in: .vdd/agents/"));
    console.log(chalk.gray("  → Compatibility bridge will appear in: AGENTS.md"));
    console.log("");

    const result = await installGeneric(projectRoot);

    if (result.agentsInstalled.length > 0) {
      for (const name of result.agentsInstalled) {
        console.log(chalk.green(`  ✓ vdd-${name}.md`));
      }
    }

    if (result.skipped.length > 0) {
      console.log("");
      for (const name of result.skipped) {
        console.log(chalk.gray(`  [skip] vdd-${name}.md already exists`));
      }
    }

    if (result.compatibilityFilesInstalled.length > 0) {
      console.log("");
      for (const file of result.compatibilityFilesInstalled) {
        console.log(chalk.green(`  ✓ ${file}`));
      }
    }

    if (result.compatibilityFilesSkipped.length > 0) {
      console.log("");
      for (const file of result.compatibilityFilesSkipped) {
        console.log(chalk.gray(`  [skip] ${file} already exists`));
      }
    }

    if (result.errors.length > 0) {
      console.log("");
      for (const err of result.errors) {
        console.log(chalk.red(`  [error] ${err}`));
      }
    }

    console.log("");

    if (result.ok) {
      console.log(chalk.green("✓ Generic AGENTS.md install complete."));
      console.log("");
      console.log("Next steps:");
      console.log(`  ${chalk.cyan("vdd doctor")}   — verify environment`);
      console.log(`  ${chalk.cyan("vdd targets")}  — inspect runtime support matrix`);
      console.log(`  ${chalk.cyan("vdd run /vibe.init")}  — start workflow`);
    } else {
      console.log(chalk.yellow("⚠ Install completed with errors."));
      process.exitCode = 1;
    }

    return;
  }

  console.log(chalk.red(`Unknown install target: ${target.id}`));
  console.log(
    `Supported targets: ${listInstallTargets()
      .map((item) => item.id)
      .join(", ")}`
  );
  process.exitCode = 1;
}
