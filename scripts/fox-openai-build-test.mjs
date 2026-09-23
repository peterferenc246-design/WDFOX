const apiKey = String(process.env.OPENAI_API_KEY || '').trim();
const model = String(process.env.OPENAI_MODEL || 'gpt-5.6-terra').trim();

if (!apiKey) {
  console.error('FOX OpenAI build probe failed: OPENAI_API_KEY missing');
  process.exit(1);
}

const response = await fetch('https://api.openai.com/v1/responses', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${apiKey}`,
  },
  body: JSON.stringify({
    model,
    instructions: 'Reply with exactly FOX_AGENT_OK and nothing else.',
    input: 'Run FOX Agent OpenAI runtime probe.',
    store: false,
    max_output_tokens: 32,
  }),
});

const raw = await response.text();
let data = null;
try { data = JSON.parse(raw); } catch {}

if (!response.ok) {
  console.error(`FOX OpenAI build probe failed: HTTP ${response.status}: ${data?.error?.message || raw.slice(0, 500)}`);
  process.exit(1);
}

const output = typeof data?.output_text === 'string'
  ? data.output_text.trim()
  : (Array.isArray(data?.output)
      ? data.output.flatMap(item => Array.isArray(item?.content) ? item.content : []).map(part => part?.text || '').join('').trim()
      : '');

if (output !== 'FOX_AGENT_OK') {
  console.error(`FOX OpenAI build probe failed: unexpected output: ${output.slice(0, 200)}`);
  process.exit(1);
}

console.log(`FOX OpenAI build probe PASSED with ${model}; response ${data?.id || 'n/a'}`);
