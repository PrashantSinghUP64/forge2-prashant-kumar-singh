// Slack Test Script — Forge 2 Qualifier
// Run AFTER you have set SLACK_BOT_TOKEN in your environment
// Usage: node slack-test.js

import { WebClient } from "@slack/web-api";

const token = process.env.SLACK_BOT_TOKEN;
if (!token) {
  console.error("❌ SLACK_BOT_TOKEN not set. Run: $env:SLACK_BOT_TOKEN='xoxb-your-token'");
  process.exit(1);
}

const slack = new WebClient(token);

// ── Channel IDs: fill these in after creating your workspace ──
// Get them by right-clicking a channel in Slack → View channel details → scroll to bottom
const CHANNELS = {
  sprintMain: process.env.SLACK_CHANNEL_SPRINT_MAIN   || "C_SPRINT_MAIN",
  agentCoder: process.env.SLACK_CHANNEL_AGENT_CODER   || "C_AGENT_CODER",
  agentLog:   process.env.SLACK_CHANNEL_AGENT_LOG     || "C_AGENT_LOG",
};

async function test() {
  console.log("🔍 Testing Slack connection...\n");

  // 1. Verify token
  const auth = await slack.auth.test();
  console.log(`✅ Connected as: ${auth.user} (bot) in workspace: ${auth.team}`);

  // 2. Hermes posts to #sprint-main
  const msg1 = await slack.chat.postMessage({
    channel: CHANNELS.sprintMain,
    text: "🧠 *[Hermes — Orchestrator]* Sprint started. Stack: Laravel + React. Assigning tasks to @OpenClaw.",
    mrkdwn: true,
  });
  console.log(`✅ Posted to #sprint-main: ${msg1.ts}`);

  // 3. OpenClaw posts to #agent-coder
  const msg2 = await slack.chat.postMessage({
    channel: CHANNELS.agentCoder,
    text: "🤖 *[OpenClaw — Coder]* Ready to receive tasks.\n\n*What I Did* — Verified connection to Slack.\n*What's Left* — Awaiting first task from Hermes.\n*What Needs Your Call* — None.",
    mrkdwn: true,
  });
  console.log(`✅ Posted to #agent-coder: ${msg2.ts}`);

  // 4. Hermes autonomous run to #agent-log
  const msg3 = await slack.chat.postMessage({
    channel: CHANNELS.agentLog,
    text: `🤖 *[AUTONOMOUS RUN]* Nightly health check — ${new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })} IST\n\n✅ All systems operational. Forge 2 Qualifier stack is live.`,
    mrkdwn: true,
  });
  console.log(`✅ Posted to #agent-log: ${msg3.ts}`);

  console.log("\n🎉 All Slack tests passed! Both agents are connected and posting.");
}

test().catch((err) => {
  console.error("❌ Slack test failed:", err.message);
  process.exit(1);
});
