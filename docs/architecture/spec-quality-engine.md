# Spec Quality Engine

## Purpose

The Spec Quality Engine exists to detect whether a project idea is clear enough for safe execution.

It is the first explicit guard against spec blindness.

## Why It Exists

Vibe coders often move too quickly from vague intent into polished implementation.

That produces:
- fast but shallow output
- hidden rework
- context drift
- fragile delegation

The system therefore needs a way to say:

"This is still too vague to trust."

## User-Facing Surface

The primary public surface is:

- `/vibe.spec-quality`

This command should work:
- before initialization
- during early planning
- after onboarding
- whenever the user wants to check whether the project is clear enough

## Scoring Dimensions

V1 scores five dimensions:

1. Problem framing
2. Target user clarity
3. Success definition
4. Constraints and assumptions
5. Execution readiness

Each dimension scores from 0 to 20.

The total score is 0 to 100.

## Clarity Levels

- `blocked`
- `weak`
- `usable`
- `strong`

The point of the engine is not grading for vanity.

It is deciding whether the workflow can move forward with trustworthy intent.

## Behavior Policy

### Blocked

The project still lacks enough clarity to trust downstream execution.

Recommended behavior:
- route to onboarding or planning
- explain missing signals in plain language
- suggest only the next few useful questions

### Weak

The project has some signal, but it is still easy to overbuild or misbuild.

Recommended behavior:
- allow planning
- keep implementation gated
- tighten the missing signals first

### Usable

The project is clear enough to continue with specialist execution, with warnings where needed.

### Strong

The project is grounded enough to support disciplined execution with lower ambiguity.

## Integration Points

V1 should integrate with:
- `/vibe.spec-quality`
- onboarding guidance
- planning recommendations
- future readiness and delegation gates

Later versions may also:
- block certain stage jumps
- feed complexity budget checks
- improve `/vibe.start`

## Safety Rule

Polished output must not become project truth without passing clarity checks.

The engine should prefer:
- short diagnostics
- few questions
- plain language
- explicit next-step recommendations
