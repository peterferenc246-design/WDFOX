(() => {
  const ROOT_SELECTOR = '[data-fox-ai-test]';
  const GEMINI_URL = 'https://wdfox-gemini-api.vercel.app/api/gemini-chat';
  const STORAGE_KEY = 'fox-test-notifications-astro-v1';
  const OPEN_AFTER_RELOAD_KEY = 'fox-ai-v2-open-after-reload';

  const clients = [
    { id: 'c1', name: 'Peter Müller', company: 'Müller Bau', language: 'DE' },
    { id: 'c2', name: 'Lucia Nováková', company: 'Nova Studio', language: 'SK' },
    { id: 'c3', name: 'Marco Rossi', company: 'Rossi Design', language: 'IT' },
    { id: 'c4', name: 'Emma Johnson', company: 'North Digital', language: 'EN' },
  ];

  const byId = new Map(clients.map((client) => [client.id, client]));
  let aiPlan = null;

  const cleanJson = (value) => {
    const text = String(value || '').trim();
    const unfenced = text.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/i, '').trim();
    const first = unfenced.indexOf('{');
    const last = unfenced.lastIndexOf('}');
    if (first === -1 || last === -1 || last <= first) throw new Error('AI nevrátil platný JSON plán.');
    return JSON.parse(unfenced.slice(first, last + 1));
  };

  const systemInstruction = `
You are FOX AI Agent, an action-planning assistant for a web agency notification center.
Your task is to interpret the owner's natural-language instruction and return ONLY valid JSON, no markdown.
You may only select recipients from the provided client registry. Never invent a client.
Translate the outgoing message naturally into each recipient's language.
If the instruction is ambiguous, missing a recipient, or asks for someone not in the registry, return action "clarify" and a short clarificationQuestion in Slovak.
Supported channels are: web, push, email. If no channel is specified, use ["web"].
Never claim that anything was actually sent. You are only planning a TEST action that requires human confirmation.

Return exactly this shape:
{
  "action": "send_notifications" | "clarify",
  "summary": "short Slovak explanation of what you understood",
  "clarificationQuestion": "string or empty string",
  "channels": ["web" | "push" | "email"],
  "recipients": [
    {
      "id": "client id from registry",
      "message": "message translated for this client's language"
    }
  ]
}
`;

  function ensureStatus(root) {
    let status = root.querySelector('[data-ai-v2-status]');
    if (status) return status;
    status = document.createElement('div');
    status.setAttribute('data-ai-v2-status', '');
    status.style.cssText = 'margin-top:10px;padding:10px 12px;border-radius:12px;background:#f7f7f7;border:1px solid #e7e7e7;font:600 11px/1.45 Inter,system-ui,sans-serif;color:#555;display:none';
    const actions = root.querySelector('.fox-agent-actions');
    actions?.insertAdjacentElement('afterend', status);
    return status;
  }

  function showStatus(root, message, kind = 'info') {
    const status = ensureStatus(root);
    const themes = {
      info: ['#f7f7f7', '#e7e7e7', '#555'],
      loading: ['#fff7ef', '#ffd8bd', '#9a4d00'],
      success: ['#ecfdf3', '#b7ebc9', '#176b3a'],
      error: ['#fff1f2', '#fecdd3', '#9f1239'],
    };
    const [bg, border, color] = themes[kind] || themes.info;
    status.style.display = 'block';
    status.style.background = bg;
    status.style.borderColor = border;
    status.style.color = color;
    status.textContent = message;
  }

  function normalizePlan(raw) {
    const action = raw?.action === 'send_notifications' ? 'send_notifications' : 'clarify';
    const channels = Array.isArray(raw?.channels)
      ? [...new Set(raw.channels.filter((channel) => ['web', 'push', 'email'].includes(channel)))]
      : ['web'];
    const recipients = Array.isArray(raw?.recipients)
      ? raw.recipients
          .map((item) => {
            const client = byId.get(String(item?.id || ''));
            if (!client) return null;
            const message = String(item?.message || '').trim();
            if (!message) return null;
            return { ...client, message };
          })
          .filter(Boolean)
      : [];

    if (action === 'send_notifications' && recipients.length === 0) {
      return {
        action: 'clarify',
        summary: 'AI neurčilo platného príjemcu.',
        clarificationQuestion: 'Komu mám správu poslať?',
        channels: ['web'],
        recipients: [],
      };
    }

    return {
      action,
      summary: String(raw?.summary || '').trim() || 'FOX AI pripravil plán.',
      clarificationQuestion: String(raw?.clarificationQuestion || '').trim(),
      channels: channels.length ? channels : ['web'],
      recipients,
    };
  }

  function renderPlan(root, plan) {
    const draftBox = root.querySelector('[data-draft]');
    const recipientsEl = root.querySelector('[data-draft-recipients]');
    const languagesEl = root.querySelector('[data-draft-languages]');
    const channelsEl = root.querySelector('[data-draft-channels]');
    const messageEl = root.querySelector('[data-draft-message]');
    const reasonEl = root.querySelector('[data-draft-reason]');
    const confirm = root.querySelector('[data-confirm-send]');
    const sendButton = root.querySelector('[data-send-test]');
    const success = root.querySelector('[data-success]');

    if (!draftBox || !recipientsEl || !languagesEl || !channelsEl || !messageEl || !reasonEl || !confirm || !sendButton) return;

    draftBox.hidden = false;
    if (success) success.hidden = true;
    confirm.checked = false;
    sendButton.disabled = true;

    if (plan.action === 'clarify') {
      recipientsEl.textContent = 'Potrebujem upresnenie';
      languagesEl.textContent = '—';
      channelsEl.textContent = '—';
      messageEl.textContent = plan.clarificationQuestion || 'Upresni príkaz.';
      reasonEl.textContent = `FOX AI: ${plan.summary}`;
      showStatus(root, plan.clarificationQuestion || 'FOX AI potrebuje upresnenie príkazu.', 'error');
      return;
    }

    recipientsEl.textContent = plan.recipients.map((recipient) => `${recipient.name} (${recipient.company})`).join(', ');
    languagesEl.textContent = [...new Set(plan.recipients.map((recipient) => recipient.language))].join(', ');
    channelsEl.textContent = plan.channels.map((channel) => channel.toUpperCase()).join(' + ');
    messageEl.innerHTML = plan.recipients
      .map((recipient) => `<strong>${recipient.language} · ${recipient.name}</strong><br>${escapeHtml(recipient.message)}`)
      .join('<br><br>');
    reasonEl.textContent = `FOX AI plán: ${plan.summary}`;
    showStatus(root, 'FOX AI pripravil akčný plán pomocou Gemini. Skontroluj ho a až potom potvrď TEST vykonanie.', 'success');
  }

  function escapeHtml(value) {
    return String(value).replace(/[&<>"']/g, (char) => ({
      '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
    }[char]));
  }

  async function buildAiPlan(root) {
    const command = root.querySelector('[data-command]');
    const buildButton = root.querySelector('[data-build-draft]');
    const text = String(command?.value || '').trim();
    if (!text) {
      showStatus(root, 'Najprv napíš agentovi príkaz.', 'error');
      return;
    }

    aiPlan = null;
    window.__foxAiPlanV2 = null;
    if (buildButton) {
      buildButton.disabled = true;
      buildButton.textContent = 'FOX AI premýšľa…';
    }
    showStatus(root, 'Gemini analyzuje príkaz, vyberá príjemcov, kanály a pripravuje jazykové verzie…', 'loading');

    try {
      const registry = JSON.stringify(clients);
      const response = await fetch(GEMINI_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({
          message: `OWNER COMMAND:\n${text}\n\nCLIENT REGISTRY:\n${registry}`,
          systemInstruction,
          thinkingLevel: 'medium',
        }),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data?.error || `Gemini HTTP ${response.status}`);
      const rawPlan = cleanJson(data?.text);
      aiPlan = normalizePlan(rawPlan);
      window.__foxAiPlanV2 = aiPlan;
      renderPlan(root, aiPlan);
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      showStatus(root, `FOX AI chyba: ${message}`, 'error');
    } finally {
      if (buildButton) {
        buildButton.disabled = false;
        buildButton.textContent = 'AI pripraviť plán';
      }
    }
  }

  function executeTestPlan(root) {
    const confirm = root.querySelector('[data-confirm-send]');
    if (!confirm?.checked) {
      showStatus(root, 'Najprv potvrď, že ide o TEST simuláciu.', 'error');
      return;
    }
    if (!aiPlan || aiPlan.action !== 'send_notifications') {
      showStatus(root, 'Najprv nechaj FOX AI pripraviť platný plán.', 'error');
      return;
    }

    let existing = [];
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      existing = stored ? JSON.parse(stored) : [];
      if (!Array.isArray(existing)) existing = [];
    } catch (_) {
      existing = [];
    }

    const now = new Date().toISOString();
    const created = [];
    aiPlan.recipients.forEach((recipient) => {
      aiPlan.channels.forEach((channel, index) => {
        created.push({
          id: `ai-v2-${Date.now()}-${recipient.id}-${channel}-${index}`,
          clientId: recipient.id,
          clientName: recipient.name,
          language: recipient.language,
          title: channel === 'web' ? 'FOX AI · Nová správa' : channel === 'push' ? 'FOX AI · Push · TEST' : 'FOX AI · E-mail · TEST',
          message: recipient.message,
          createdAt: now,
          read: false,
          channel,
          source: 'gemini-ai-agent-v2',
        });
      });
    });

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify([...created, ...existing]));
      sessionStorage.setItem(OPEN_AFTER_RELOAD_KEY, '1');
    } catch (_) {}
    showStatus(root, `FOX AI vykonal TEST plán: vytvorených ${created.length} oznámení pre ${aiPlan.recipients.length} klientov.`, 'success');
    setTimeout(() => window.location.reload(), 650);
  }

  function enhance(root) {
    if (!root || root.dataset.aiV2 === '1') return;
    root.dataset.aiV2 = '1';

    const subtitle = root.querySelector('.fox-agent-header p');
    if (subtitle) subtitle.textContent = 'Gemini AI → akčný plán → tvoje potvrdenie → vykonanie';
    const testLabel = root.querySelector('.fox-test-label');
    if (testLabel) testLabel.textContent = 'AI TEST · GEMINI · NIČ SA REÁLNE NEODOSIELA';
    const buildButton = root.querySelector('[data-build-draft]');
    if (buildButton) buildButton.textContent = 'AI pripraviť plán';

    ensureStatus(root);

    document.addEventListener('click', (event) => {
      const target = event.target instanceof Element ? event.target.closest('[data-build-draft]') : null;
      if (!target || !root.contains(target)) return;
      event.preventDefault();
      event.stopPropagation();
      event.stopImmediatePropagation();
      buildAiPlan(root);
    }, true);

    document.addEventListener('click', (event) => {
      const target = event.target instanceof Element ? event.target.closest('[data-send-test]') : null;
      if (!target || !root.contains(target)) return;
      event.preventDefault();
      event.stopPropagation();
      event.stopImmediatePropagation();
      executeTestPlan(root);
    }, true);

    root.querySelector('[data-reset-demo]')?.addEventListener('click', () => {
      aiPlan = null;
      window.__foxAiPlanV2 = null;
      const status = root.querySelector('[data-ai-v2-status]');
      if (status) status.style.display = 'none';
    });

    try {
      if (sessionStorage.getItem(OPEN_AFTER_RELOAD_KEY) === '1') {
        sessionStorage.removeItem(OPEN_AFTER_RELOAD_KEY);
        setTimeout(() => root.querySelector('[data-bell-open]')?.click(), 350);
      }
    } catch (_) {}
  }

  const start = () => {
    const root = document.querySelector(ROOT_SELECTOR);
    if (root) enhance(root);
  };

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start, { once: true });
  else start();
})();
