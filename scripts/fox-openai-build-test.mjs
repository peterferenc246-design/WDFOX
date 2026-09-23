const apiKey = String(process.env.OPENAI_API_KEY || '').trim();
const model = String(process.env.OPENAI_MODEL || 'gpt-5.6-terra').trim();

if (!apiKey) {
  console.error('FOX Agent planner probe failed: OPENAI_API_KEY missing');
  process.exit(1);
}

const clients = [
  { id: 'c1', name: 'Peter Müller', company: 'Müller Bau', language: 'DE' },
  { id: 'c2', name: 'Lucia Nováková', company: 'Nova Studio', language: 'SK' },
];

const instructions = `
You are FOX Agent, an AI operations agent for WebDizainFOX.
For this probe you only PREPARE a notification plan. You do not send messages and you do not perform external side effects.
Interpret the owner's natural-language command. You may only select recipients from the supplied client registry. Never invent a client.
Translate each outgoing message naturally into the recipient's language.
Supported channels are web, push, email.
Return ONLY valid JSON with exactly this shape:
{
  "action": "send_notifications" | "clarify",
  "summary": "short explanation in Slovak",
  "clarificationQuestion": "question in Slovak or empty string",
  "channels": ["web" | "push" | "email"],
  "recipients": [{ "id": "client id", "message": "translated message" }]
}
`;

const command = 'Pošli Petrovi Müllerovi a Lucii Novákovej cez web aj push správu: Návrh webu je pripravený.';

const response = await fetch('https://api.openai.com/v1/responses', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${apiKey}`,
  },
  body: JSON.stringify({
    model,
    instructions,
    input: `OWNER COMMAND:\n${command}\n\nCLIENT REGISTRY:\n${JSON.stringify(clients)}`,
    store: false,
    max_output_tokens: 500,
  }),
});

const raw = await response.text();
let data = null;
try { data = JSON.parse(raw); } catch {}

if (!response.ok) {
  console.error(`FOX Agent planner probe failed: HTTP ${response.status}: ${data?.error?.message || raw.slice(0, 500)}`);
  process.exit(1);
}

const output = typeof data?.output_text === 'string'
  ? data.output_text.trim()
  : (Array.isArray(data?.output)
      ? data.output.flatMap(item => Array.isArray(item?.content) ? item.content : []).map(part => part?.text || '').join('').trim()
      : '');

const cleaned = output.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/i, '').trim();
let plan;
try {
  const first = cleaned.indexOf('{');
  const last = cleaned.lastIndexOf('}');
  if (first < 0 || last <= first) throw new Error('no JSON object');
  plan = JSON.parse(cleaned.slice(first, last + 1));
} catch (error) {
  console.error(`FOX Agent planner probe failed: invalid JSON output: ${output.slice(0, 500)}`);
  process.exit(1);
}

const ids = Array.isArray(plan?.recipients) ? plan.recipients.map(r => r?.id).sort() : [];
const channels = Array.isArray(plan?.channels) ? [...plan.channels].sort() : [];
const messagesOk = Array.isArray(plan?.recipients) && plan.recipients.every(r => typeof r?.message === 'string' && r.message.trim().length > 0);

const passed =
  plan?.action === 'send_notifications' &&
  JSON.stringify(ids) === JSON.stringify(['c1', 'c2']) &&
  channels.includes('web') &&
  channels.includes('push') &&
  messagesOk;

if (!passed) {
  console.error(`FOX Agent planner probe failed: unexpected plan: ${JSON.stringify(plan).slice(0, 1000)}`);
  process.exit(1);
}

console.log(`FOX Agent planner probe PASSED with ${model}; response ${data?.id || 'n/a'}; recipients ${ids.join(',')}; channels ${channels.join(',')}`);
