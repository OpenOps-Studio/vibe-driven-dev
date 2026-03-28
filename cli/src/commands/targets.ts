import chalk from "chalk";
import { listInstallTargets } from "../../../core/install/registry.js";

function printSection(title: string): void {
  console.log(chalk.bold.cyan(title));
}

export function runTargetsCommand(): void {
  const targets = listInstallTargets();

  printSection("VDD targets");
  console.log("");

  for (const target of targets) {
    const status =
      target.adapterStatus === "implemented"
        ? chalk.green(target.adapterStatus)
        : chalk.yellow(target.adapterStatus);

    console.log(`- ${chalk.bold(target.id)} (${target.label})`);
    console.log(`  tier: ${target.supportTier} | adapter: ${status}`);
    console.log(`  scopes: ${target.scopes.join(", ")}`);
    console.log(`  exports: ${target.exportModes.join(", ")}`);
    console.log(`  conventions: ${target.runtimeConventions.join(", ")}`);
    console.log(`  summary: ${target.summary}`);
  }
}
