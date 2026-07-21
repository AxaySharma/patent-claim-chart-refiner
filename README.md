# Patent Claim Chart Refiner

A conversational interface for refining patent infringement claim charts — built to explore how chat-based interaction can replace manual cell-editing in legal document review workflows.

## The idea

Patent infringement analysis relies on **claim charts**: tables that map each element of a patent claim to a corresponding feature in an accused product, backed by evidence and reasoning. Analysts spend significant time refining these — strengthening weak evidence, rewriting vague reasoning, catching missing features — typically through direct manual editing.

This project explores a different interaction model: what if refinement happened through conversation instead? An analyst can just say *"strengthen the evidence for the motion sensor claim"* or *"the reasoning for element 3 is too vague"*, review the AI's suggestion in context, and accept, reject, or modify it — with the chart updating live.

## Live demo

**[View the deployed prototype →](https://your-app-name.vercel.app)**

## Features

- **Guided setup flow** — load a claim chart, attach supporting documentation, and set custom instructions for how the AI should approach refinements
- **Structured claim chart view** — patent claim element, accused product feature with evidence, and AI reasoning, with clear status indicators (unreviewed / accepted / flagged)
- **Natural language refinement** — request evidence improvements, reasoning rewrites, or gap analysis through plain chat
- **Review-before-apply loop** — every AI suggestion is accept/reject/modify, never applied silently
- **Undo support** — revert the most recent change directly from the chat
- **Graceful failure handling** — when the AI can't find supporting evidence for something, it asks for a document or URL instead of fabricating an answer

## Why these design choices

- **Chat over forms**: refinement is inherently a judgment call, not data entry — the AI needs to explain *why* it's suggesting a change, which a form can't surface but a conversation can
- **Review-before-apply is non-negotiable**: in a legal context, silently auto-applying AI-suggested changes to evidence is a trust and accuracy risk — every suggestion needs a human decision point
- **Undo as a first-class action**: analysts iterate; a tool that can't be reversed won't be trusted with real casework
- **Asking for help over guessing**: when there's no evidence to point to, admitting it and asking for a source is the only acceptable behavior for a tool whose output may end up in litigation

## Tech stack

- React + TypeScript + Vite
- Tailwind CSS
- Client-side state only — no backend, no database

## Running locally

```bash
npm install
npm run dev
```

## Project structure

```
src/
  App.tsx        — main app shell and view state
  components/    — UI components (table, chat panel, setup screen)
  types.ts       — shared TypeScript types
  mockData.ts    — sample claim chart data
```

## Current scope and known limitations

This is an early-stage prototype focused on validating the interaction model, not a production system:

- AI responses are currently simulated with rule-based logic rather than a live LLM call, to isolate and test the interaction design itself
- Document upload is simulated (filename captured, no real parsing or retrieval)
- Export is simulated (no real .docx generation)
- No authentication or persistence layer

**A production version would need**: live LLM calls grounded in the uploaded documents via retrieval (RAG), so every evidence citation is traceable to real source text; a backend to keep API credentials secure and persist chart history; and an audit trail recording who approved which change and when — essential for any tool whose output may be used in legal proceedings.

## License

MIT