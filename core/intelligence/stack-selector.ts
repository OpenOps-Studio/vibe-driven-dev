/**
 * Stack Selector Intelligence
 *
 * A rule-based decision engine to recommend a complete tech stack.
 * In a future version, this can be hydrated by MCP tools to check for
 * the latest library versions, but current decisions are static and verified.
 */

export interface StackSelectionInput {
  projectType: "saas" | "internal-tool" | "mvp" | "content-site" | "wrapper-app";
  speedPriority: "high" | "medium" | "low";
  complexityTolerance: "high" | "medium" | "low";
  needsAuth: boolean;
  needsDb: boolean;
}

export interface StackRecommendation {
  recommendedStack: {
    frontend: string;
    backend: string;
    database: string;
    auth: string;
    styling: string;
  };
  alternatives: string[];
  rationale: string;
  tradeoffs: string[];
  revisitConditions: string[];
  freshnessStatus: "verified_static" | "mcp_checked" | "unverified";
}

export class StackSelector {
  evaluate(input: StackSelectionInput): StackRecommendation {
    // Basic decision matrix
    if (input.projectType === "saas" || input.projectType === "wrapper-app") {
      return {
        recommendedStack: {
          frontend: "Next.js (App Router)",
          backend: "Next.js Server Actions / API Routes",
          database: input.needsDb ? "Supabase (PostgreSQL)" : "None",
          auth: input.needsAuth ? "Supabase Auth" : "None",
          styling: "Tailwind CSS + Shadcn UI",
        },
        alternatives: ["Vite + React + Express (if moving off Vercel)"],
        rationale:
          "SaaS and Wrapper Apps require rapid iteration, SEO capabilities, and robust auth/db out of the box. Next.js combined with Supabase provides the highest velocity for these constraints.",
        tradeoffs: [
          "Vendor lock-in risk with Vercel/Supabase ecosystem assumptions.",
          "Server Actions can be opaque to debug compared to traditional REST APIs.",
        ],
        revisitConditions: [
          "If the app requires heavy real-time WebSockets that serverless struggles with.",
          "If mobile-native apps are needed immediately (might consider React Native ecosystem first).",
        ],
        freshnessStatus: "verified_static",
      };
    }

    if (input.projectType === "internal-tool") {
      return {
        recommendedStack: {
          frontend: "Vite + React (SPA)",
          backend: "Node.js (Express or Fastify)",
          database: input.needsDb ? "PostgreSQL (Self-hosted or RDS)" : "None",
          auth: input.needsAuth ? "NextAuth / Built-in JWT" : "None",
          styling: "Tailwind CSS",
        },
        alternatives: ["Retool (if extreme speed is needed over control)"],
        rationale:
          "Internal tools rarely need SEO and often live behind corporate firewalls. A traditional SPA built with Vite is blazingly fast to develop and easy to bundle.",
        tradeoffs: [
          "No built-in SSR/SEO.",
          "Requires managing a separate backend service for robust internal workflows.",
        ],
        revisitConditions: [
          "If the tool eventually needs to be exposed to public, unauthenticated users.",
        ],
        freshnessStatus: "verified_static",
      };
    }

    // Default MVP fallback
    return {
      recommendedStack: {
        frontend: "Vite + React",
        backend: "Supabase Backend-as-a-Service",
        database: input.needsDb ? "Supabase" : "None",
        auth: input.needsAuth ? "Supabase Auth" : "None",
        styling: "Tailwind CSS",
      },
      alternatives: ["Firebase (if preferred ecosystem)"],
      rationale:
        "For a generic MVP, minimizing boilerplate is critical. Vite is lightning fast, and Supabase removes the need to write backend boilerplate immediately.",
      tradeoffs: [
        "Business logic ends up tightly coupled to Supabase Edge Functions or RLS.",
      ],
      revisitConditions: [
        "When the application reaches Series A stage architecture complexity.",
      ],
      freshnessStatus: "verified_static",
    };
  }
}
