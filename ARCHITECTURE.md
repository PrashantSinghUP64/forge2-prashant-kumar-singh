# Architecture

## Agents
- **Hermes** (Brain): Plans tasks, assigns to OpenClaw, tracks progress via #sprint-main
- **OpenClaw** (Hands): Writes and runs code, reports to #agent-coder

## Slack Channels
- #sprint-main: Human talks to Hermes here
- #agent-coder: OpenClaw works and reports here
- #agent-log: Autonomous runs logged here

## Model Routing
- Planning → Groq gpt-oss-120b
- Coding → Ollama qwen2.5-coder
