---
name: onboarding-guide
description: Guide a non-technical user through the first project conversation, capture minimal intent, translate it into VDD state, and propose the next best step in plain language.
category: governance
stage: any
version: 0.1.0
triggers:
  - /vibe.start
  - onboarding
  - first-run
inputs:
  required:
    - user_goal
  optional:
    - existing_project_state
    - current_runtime
    - guided_mode
    - autopilot_mode
    - partial_answers
outputs:
  - onboarding-summary
  - normalized-project-intent
  - assumptions
  - next-step-recommendation
  - command-handoff-plan
handoff:
  next:
    - vibe-init
    - vibe-plan
    - vibe-scaffold
state_effect: write
authority:
  final: orchestrator
compatibility:
  core: "0.1.x"
  skill_schema: "1.x"
---

# Onboarding Guide

## Purpose

Guide a non-technical user into the VDD workflow without requiring them to know commands, engineering vocabulary, or stage sequencing.

This skill turns a simple project idea into normalized workflow input.

It is the first conversational layer of the system.

## When to Use

Use this skill when:
- the user is starting a new project
- the user has just installed VDD
- the user asks how to begin
- the current state is empty or too weak for reliable planning
- the system needs to convert plain-language intent into structured VDD inputs

## When Not to Use

Do not use this skill when:
- the project is already well into a later stage and context is clear
- the user explicitly requests a specialist workflow step only
- the task is deep architecture or implementation work rather than onboarding
- the user already supplied normalized project state and does not need guided capture

## Core Principle

Ask the smallest useful number of questions.

The user should feel:
- understood
- guided
- protected from workflow confusion
- informed in plain language

The user should not feel:
- interrogated
- tested on technical knowledge
- forced to choose engineering details too early

## Question Budget

Ask at most five primary questions before moving forward.

Preferred questions:
1. What kind of project do you want to build
2. Who is it for
3. What problem does it solve
4. Does the product itself use AI
5. Do you want a fast MVP or a stronger foundation

## Language Rules

Questions and explanations should:
- use plain language
- avoid framework and infrastructure jargon
- explain internal actions simply
- keep answers short and easy to provide

Avoid asking for:
- framework choice
- provider choice
- database choice
- deployment choice

Those should be inferred or deferred unless the user explicitly cares.

## Translation Rules

This skill must translate user answers into normalized VDD inputs such as:
- `project type`
- `target user`
- `success definition`
- `constraints`
- `AI usage`
- `delivery preference`

The user does not need to supply these fields by name.

## Assumption Rules

If the user gives incomplete information:
- choose the safest reasonable default
- record the assumption
- continue unless the missing detail blocks correctness materially

Recommended defaults:
- unclear platform -> web app
- unclear delivery priority -> MVP
- unclear AI usage -> no embedded AI

## Modes

### Guided Mode

Use when the user should confirm each major transition.

In this mode:
- ask minimal questions
- summarize understanding
- propose next step
- wait for explicit confirmation before continuing

### Autopilot Mode

Use when the user wants the system to continue through the obvious early workflow.

In this mode:
- collect minimal intent
- summarize what was understood
- continue into `init`, `plan`, and `scaffold` if safe
- stop at heavy decisions or high-impact assumptions

## Required Output Shape

The output should always contain:
1. what the system understood
2. which assumptions were made
3. what stage the user is entering
4. what the next best step is
5. whether the system can continue automatically

## Command Handoff

This skill should not replace the workflow.

It should prepare the user and the system for it.

The expected internal handoff path is:
- `/vibe.init`
- `/vibe.plan`
- `/vibe.scaffold`

Later steps should be recommended only after those are grounded.

## Safety Rules

This skill must not:
- overwhelm the user with too many questions
- require technical choices too early
- pretend understanding when user intent is ambiguous in a material way
- skip explanation of what is happening
- jump deep into implementation before the project idea is grounded

## Halt Conditions

Halt when:
- the user goal is too unclear to identify even a rough project type
- there is a direct contradiction in core intent
- continuing would create misleading state
- the system would need to fabricate a major decision
