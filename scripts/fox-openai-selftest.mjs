const apiKey = process.env.OPENAI_API_KEY;
const model = process.env.OPENAI_MODEL || 'gpt-5.6-terra';

if (!apiKey) {
  console.error('[FOX SELFTEST] OPENAI_API_KEY is missing');
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
    input: 'You are FOX Agent runtime self-test. Reply with exactly FOX_OK and nothing else.',
    store: false,
    max_output_tokens: 16,
  }),
});

const data = await response.json().catch(() => ({}));
if (!response.ok) {
  console.error('[FOX SELFTEST] OpenAI request failed', response.status, data?.error?.message || data);
  process.exit(1);
}

const text = String(data.output_text || data?.output?.flatMap?.(x => x?.content || []).map?.(c => c?.text || '').join('') || '').trim();
if (!text.includes('FOX_OK')) {
  console.error('[FOX SELFTEST] Unexpected OpenAI response:', text || '[empty]');
  process.exit(1);
}

console.log(`[FOX SELFTEST] SUCCESS model=${model} response_id=${data.id || 'n/a'} output=FOX_OK`);
