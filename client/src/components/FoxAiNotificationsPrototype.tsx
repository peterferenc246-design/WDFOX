import { useEffect, useMemo, useState } from "react";
import {
  Bell,
  Bot,
  Check,
  CheckCheck,
  ChevronRight,
  Languages,
  Mail,
  MessageSquareText,
  Send,
  ShieldCheck,
  Sparkles,
  Users,
  X,
} from "lucide-react";

type Client = {
  id: string;
  name: string;
  company: string;
  language: "sk" | "de" | "it" | "en";
};

type NotificationItem = {
  id: string;
  clientId: string;
  clientName: string;
  language: Client["language"];
  title: string;
  message: string;
  createdAt: string;
  read: boolean;
  channel: "web" | "push" | "email";
};

type Draft = {
  recipients: Client[];
  message: string;
  channels: Array<NotificationItem["channel"]>;
  reason: string;
};

const demoClients: Client[] = [
  { id: "c1", name: "Peter Müller", company: "Müller Bau", language: "de" },
  { id: "c2", name: "Lucia Nováková", company: "Nova Studio", language: "sk" },
  { id: "c3", name: "Marco Rossi", company: "Rossi Design", language: "it" },
  { id: "c4", name: "Emma Johnson", company: "North Digital", language: "en" },
];

const initialNotifications: NotificationItem[] = [
  {
    id: "seed-1",
    clientId: "c1",
    clientName: "Peter Müller",
    language: "de",
    title: "Demo oznámenie",
    message: "Návrh webu je pripravený na kontrolu.",
    createdAt: new Date().toISOString(),
    read: false,
    channel: "web",
  },
];

const languageLabels: Record<Client["language"], string> = {
  sk: "SK",
  de: "DE",
  it: "IT",
  en: "EN",
};

function extractMessage(command: string) {
  const clean = command.trim();
  if (!clean) return "";

  const patterns = [
    /správu\s*:\s*(.+)$/i,
    /správu\s*,?\s*že\s+(.+)$/i,
    /oznámenie\s*:\s*(.+)$/i,
    /že\s+(.+)$/i,
  ];

  for (const pattern of patterns) {
    const match = clean.match(pattern);
    if (match?.[1]) return match[1].trim().replace(/^['\"]|['\"]$/g, "");
  }

  return clean;
}

function resolveRecipients(command: string) {
  const lower = command.toLocaleLowerCase("sk");
  const exactMatches = demoClients.filter((client) => {
    const fullName = client.name.toLocaleLowerCase("sk");
    const surname = fullName.split(" ").slice(-1)[0];
    return lower.includes(fullName) || (surname.length > 3 && lower.includes(surname));
  });

  if (exactMatches.length) {
    return { recipients: exactMatches, reason: "Agent rozpoznal konkrétne meno klienta." };
  }

  if (/všetk|vsetk|all clients|všetkým klient/i.test(lower)) {
    return { recipients: demoClients, reason: "Agent rozpoznal hromadné odoslanie všetkým klientom." };
  }

  const languageRules: Array<{ test: RegExp; language: Client["language"]; label: string }> = [
    { test: /nemeck|german|\bde\b/i, language: "de", label: "nemeckých klientov" },
    { test: /slovensk|slovak|\bsk\b/i, language: "sk", label: "slovenských klientov" },
    { test: /talian|italian|\bit\b/i, language: "it", label: "talianskych klientov" },
    { test: /anglick|english|\ben\b/i, language: "en", label: "anglických klientov" },
  ];

  const languageRule = languageRules.find((rule) => rule.test.test(lower));
  if (languageRule) {
    return {
      recipients: demoClients.filter((client) => client.language === languageRule.language),
      reason: `Agent rozpoznal skupinu: ${languageRule.label}.`,
    };
  }

  return { recipients: [], reason: "Agent zatiaľ nerozpoznal príjemcu. Doplň meno alebo skupinu klientov." };
}

function resolveChannels(command: string): Array<NotificationItem["channel"]> {
  const lower = command.toLocaleLowerCase("sk");
  const channels: Array<NotificationItem["channel"]> = ["web"];
  if (/push/i.test(lower)) channels.push("push");
  if (/e-?mail|mail/i.test(lower)) channels.push("email");
  return [...new Set(channels)];
}

function formatTime(value: string) {
  return new Intl.DateTimeFormat("sk-SK", {
    hour: "2-digit",
    minute: "2-digit",
    day: "2-digit",
    month: "2-digit",
  }).format(new Date(value));
}

export default function FoxAiNotificationsPrototype() {
  const [notifications, setNotifications] = useState<NotificationItem[]>(initialNotifications);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [agentOpen, setAgentOpen] = useState(false);
  const [tab, setTab] = useState<"unread" | "all">("unread");
  const [command, setCommand] = useState("Pošli Petrovi Müllerovi správu: Návrh webu je pripravený.");
  const [draft, setDraft] = useState<Draft | null>(null);
  const [sentMessage, setSentMessage] = useState("");

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem("fox-test-notifications-v1");
      if (stored) setNotifications(JSON.parse(stored));
    } catch {
      // TEST prototype must stay usable even when localStorage is blocked.
    }
  }, []);

  useEffect(() => {
    try {
      window.localStorage.setItem("fox-test-notifications-v1", JSON.stringify(notifications));
    } catch {
      // No-op in privacy/incognito modes that disallow storage.
    }
  }, [notifications]);

  const unreadCount = notifications.filter((item) => !item.read).length;
  const visibleNotifications = useMemo(
    () => (tab === "unread" ? notifications.filter((item) => !item.read) : notifications),
    [notifications, tab],
  );

  const buildDraft = () => {
    const recipientResult = resolveRecipients(command);
    const message = extractMessage(command);
    const channels = resolveChannels(command);
    setDraft({
      recipients: recipientResult.recipients,
      message,
      channels,
      reason: recipientResult.reason,
    });
    setSentMessage("");
  };

  const sendInTest = () => {
    if (!draft || !draft.recipients.length || !draft.message) return;
    const now = new Date().toISOString();
    const next = draft.recipients.flatMap((client) =>
      draft.channels.map((channel, index) => ({
        id: `${Date.now()}-${client.id}-${channel}-${index}`,
        clientId: client.id,
        clientName: client.name,
        language: client.language,
        title: channel === "web" ? "Nová správa od WebDizainFOX" : channel === "push" ? "Push · TEST" : "E-mail · TEST",
        message: draft.message,
        createdAt: now,
        read: false,
        channel,
      })),
    );

    setNotifications((current) => [...next, ...current]);
    setSentMessage(`TEST odoslanie vytvorilo ${next.length} oznámení pre ${draft.recipients.length} klientov.`);
    setNotificationsOpen(true);
  };

  const markAllRead = () => setNotifications((items) => items.map((item) => ({ ...item, read: true })));
  const markRead = (id: string) =>
    setNotifications((items) => items.map((item) => (item.id === id ? { ...item, read: true } : item)));
  const resetDemo = () => {
    setNotifications(initialNotifications);
    setDraft(null);
    setSentMessage("");
  };

  return (
    <>
      <style>{`
        .fox-test-tools{position:fixed;top:92px;right:18px;z-index:100000;display:flex;align-items:center;gap:8px;font-family:Inter,ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif}
        .fox-test-badge{height:26px;padding:0 9px;border-radius:999px;background:#171717;color:#fff;display:flex;align-items:center;gap:5px;font-size:10px;font-weight:900;letter-spacing:.11em;box-shadow:0 8px 24px rgba(0,0,0,.14)}
        .fox-tool-button{position:relative;width:44px;height:44px;border:1px solid #ececec;border-radius:14px;background:#fff;color:#171717;display:grid;place-items:center;cursor:pointer;box-shadow:0 10px 30px rgba(23,23,23,.13);transition:.18s ease}
        .fox-tool-button:hover{transform:translateY(-2px);border-color:#f36a0a;color:#f36a0a}.fox-tool-button.agent{width:auto;padding:0 13px;display:flex;gap:7px;font-size:12px;font-weight:850;background:#f36a0a;color:#fff;border-color:#f36a0a}.fox-tool-button.agent:hover{color:#fff;background:#db5c05}
        .fox-unread-count{position:absolute;top:-6px;right:-6px;min-width:21px;height:21px;padding:0 5px;border-radius:11px;background:#e11d48;color:#fff;border:2px solid #fff;display:grid;place-items:center;font-size:10px;font-weight:900}
        .fox-notification-panel{position:fixed;top:148px;right:18px;z-index:100001;width:min(410px,calc(100vw - 24px));max-height:72vh;background:#fff;border:1px solid #e9e9e9;border-radius:20px;box-shadow:0 24px 80px rgba(0,0,0,.22);overflow:hidden;font-family:Inter,ui-sans-serif,system-ui,sans-serif}
        .fox-panel-head{padding:16px 17px 12px;border-bottom:1px solid #eee;display:flex;align-items:flex-start;justify-content:space-between;gap:12px}.fox-panel-title{display:flex;align-items:center;gap:9px}.fox-panel-title strong{display:block;font-size:16px}.fox-panel-title small{display:block;color:#777;margin-top:2px;font-size:11px}.fox-close{width:32px;height:32px;border:0;border-radius:9px;background:#f4f4f4;display:grid;place-items:center;cursor:pointer}
        .fox-tabs{display:flex;align-items:center;gap:4px;padding:10px 12px;border-bottom:1px solid #eee}.fox-tab{border:0;background:transparent;padding:7px 10px;border-radius:8px;font-size:12px;font-weight:800;color:#777;cursor:pointer}.fox-tab.active{background:#fff1e7;color:#d95800}.fox-mark-all{margin-left:auto;border:0;background:transparent;color:#d95800;font-size:11px;font-weight:800;cursor:pointer}
        .fox-notification-list{overflow:auto;max-height:55vh}.fox-empty{padding:36px 22px;text-align:center;color:#777;font-size:13px}.fox-note{width:100%;border:0;border-bottom:1px solid #f0f0f0;background:#fff;padding:14px 16px;text-align:left;display:grid;grid-template-columns:38px 1fr auto;gap:10px;cursor:pointer}.fox-note:hover{background:#fffaf6}.fox-note.unread{background:#fff7f0}.fox-note-icon{width:36px;height:36px;border-radius:11px;background:#fff0e4;color:#ef6508;display:grid;place-items:center}.fox-note-copy strong{font-size:12px;display:flex;align-items:center;gap:6px}.fox-note-copy p{font-size:12px;line-height:1.45;margin:4px 0 5px;color:#444}.fox-note-meta{font-size:10px;color:#888;display:flex;gap:6px;flex-wrap:wrap}.fox-new-dot{width:7px;height:7px;border-radius:50%;background:#e11d48}.fox-note-arrow{color:#bbb;align-self:center}
        .fox-agent-backdrop{position:fixed;inset:0;z-index:100010;background:rgba(18,18,18,.48);backdrop-filter:blur(5px);display:grid;place-items:center;padding:18px;font-family:Inter,ui-sans-serif,system-ui,sans-serif}
        .fox-agent-modal{width:min(760px,100%);max-height:90vh;overflow:auto;background:#fff;border-radius:24px;box-shadow:0 30px 100px rgba(0,0,0,.32)}.fox-agent-header{padding:20px 22px 16px;display:flex;justify-content:space-between;gap:12px;border-bottom:1px solid #eee}.fox-agent-identity{display:flex;gap:12px;align-items:center}.fox-agent-avatar{width:46px;height:46px;border-radius:15px;background:#171717;color:#f36a0a;display:grid;place-items:center}.fox-agent-header h3{margin:0;font-size:20px}.fox-agent-header p{margin:3px 0 0;color:#777;font-size:12px}.fox-test-label{display:inline-flex;align-items:center;gap:5px;margin-top:7px;padding:4px 7px;border-radius:7px;background:#fff2e8;color:#c64f00;font-size:10px;font-weight:900;letter-spacing:.07em}
        .fox-agent-body{padding:20px 22px 24px}.fox-command-label{display:flex;align-items:center;justify-content:space-between;gap:10px;margin-bottom:8px;font-size:12px;font-weight:850}.fox-command-label span{font-weight:600;color:#8a8a8a}.fox-command{width:100%;min-height:100px;resize:vertical;border:1px solid #ddd;border-radius:15px;padding:13px 14px;font:inherit;font-size:14px;line-height:1.5;outline:none}.fox-command:focus{border-color:#f36a0a;box-shadow:0 0 0 3px rgba(243,106,10,.12)}
        .fox-quick-prompts{display:flex;gap:7px;flex-wrap:wrap;margin-top:9px}.fox-quick{border:1px solid #e4e4e4;background:#fafafa;border-radius:999px;padding:7px 10px;font-size:10px;font-weight:750;cursor:pointer}.fox-quick:hover{border-color:#f36a0a;color:#d95800}.fox-agent-actions{display:flex;gap:8px;margin-top:13px}.fox-primary,.fox-secondary{min-height:42px;border-radius:12px;padding:0 14px;font-weight:850;font-size:12px;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:7px}.fox-primary{border:0;background:#f36a0a;color:#fff}.fox-primary:disabled{opacity:.45;cursor:not-allowed}.fox-secondary{border:1px solid #ddd;background:#fff;color:#333}
        .fox-draft{margin-top:18px;border:1px solid #e6e6e6;border-radius:18px;overflow:hidden}.fox-draft-head{padding:12px 14px;background:#f8f8f8;border-bottom:1px solid #e8e8e8;display:flex;align-items:center;justify-content:space-between;gap:8px}.fox-draft-head strong{font-size:12px}.fox-draft-grid{display:grid;grid-template-columns:1fr 1fr;gap:0}.fox-draft-cell{padding:14px;border-bottom:1px solid #eee}.fox-draft-cell:nth-child(odd){border-right:1px solid #eee}.fox-draft-cell.full{grid-column:1/-1;border-right:0}.fox-draft-cell small{display:block;color:#888;font-size:10px;font-weight:800;text-transform:uppercase;letter-spacing:.08em;margin-bottom:7px}.fox-client-chips{display:flex;gap:6px;flex-wrap:wrap}.fox-client-chip{display:inline-flex;align-items:center;gap:5px;padding:6px 8px;border-radius:9px;background:#f4f4f4;font-size:11px;font-weight:750}.fox-lang{font-size:9px;color:#d95800;font-weight:900}.fox-channel{display:inline-flex;align-items:center;gap:5px;margin:0 5px 5px 0;padding:6px 8px;background:#fff1e7;color:#c95100;border-radius:9px;font-size:10px;font-weight:850}.fox-message-preview{margin:0;color:#333;font-size:13px;line-height:1.55}.fox-agent-reason{font-size:11px;color:#666;line-height:1.45}.fox-warning{margin-top:12px;padding:10px 12px;border-radius:11px;background:#fff8df;color:#765900;font-size:11px;display:flex;gap:8px;align-items:flex-start}.fox-success{margin-top:12px;padding:10px 12px;border-radius:11px;background:#eaf9ef;color:#176735;font-size:11px;font-weight:750;display:flex;gap:7px;align-items:center}
        @media(max-width:700px){.fox-test-tools{top:74px;right:10px}.fox-test-badge{display:none}.fox-tool-button.agent span{display:none}.fox-tool-button.agent{width:44px;padding:0;justify-content:center}.fox-notification-panel{top:126px;right:10px}.fox-draft-grid{grid-template-columns:1fr}.fox-draft-cell:nth-child(odd){border-right:0}.fox-agent-body{padding:16px}.fox-agent-header{padding:16px}.fox-agent-actions{flex-direction:column}.fox-primary,.fox-secondary{width:100%}}
      `}</style>

      <div className="fox-test-tools" aria-label="FOX TEST nástroje">
        <span className="fox-test-badge"><ShieldCheck size={12} /> TEST</span>
        <button
          className="fox-tool-button agent"
          type="button"
          title="Otvoriť FOX AI Agent prototyp"
          onClick={() => setAgentOpen(true)}
        >
          <Bot size={19} /><span>FOX Agent</span>
        </button>
        <button
          className="fox-tool-button"
          type="button"
          title="Oznámenia"
          aria-label={`Oznámenia, neprečítané: ${unreadCount}`}
          onClick={() => setNotificationsOpen((value) => !value)}
        >
          <Bell size={19} />
          {unreadCount > 0 && <span className="fox-unread-count">{unreadCount > 99 ? "99+" : unreadCount}</span>}
        </button>
      </div>

      {notificationsOpen && (
        <section className="fox-notification-panel" aria-label="FOX oznámenia">
          <div className="fox-panel-head">
            <div className="fox-panel-title">
              <Bell size={20} />
              <div><strong>Oznámenia</strong><small>FOX Notifications · TEST prototyp</small></div>
            </div>
            <button className="fox-close" type="button" aria-label="Zavrieť" onClick={() => setNotificationsOpen(false)}><X size={17} /></button>
          </div>
          <div className="fox-tabs">
            <button className={`fox-tab ${tab === "unread" ? "active" : ""}`} onClick={() => setTab("unread")}>Neprečítané ({unreadCount})</button>
            <button className={`fox-tab ${tab === "all" ? "active" : ""}`} onClick={() => setTab("all")}>Všetky</button>
            {unreadCount > 0 && <button className="fox-mark-all" type="button" onClick={markAllRead}><CheckCheck size={13} /> prečítať všetko</button>}
          </div>
          <div className="fox-notification-list">
            {!visibleNotifications.length ? (
              <div className="fox-empty"><CheckCheck size={30} /><p>Žiadne nové oznámenia.</p></div>
            ) : visibleNotifications.map((item) => (
              <button key={item.id} className={`fox-note ${item.read ? "" : "unread"}`} type="button" onClick={() => markRead(item.id)}>
                <span className="fox-note-icon">{item.channel === "email" ? <Mail size={16} /> : <MessageSquareText size={16} />}</span>
                <span className="fox-note-copy">
                  <strong>{!item.read && <span className="fox-new-dot" />} {item.clientName} · {languageLabels[item.language]}</strong>
                  <p>{item.message}</p>
                  <span className="fox-note-meta"><span>{item.title}</span><span>·</span><span>{formatTime(item.createdAt)}</span><span>·</span><span>{item.channel.toUpperCase()}</span></span>
                </span>
                <ChevronRight className="fox-note-arrow" size={16} />
              </button>
            ))}
          </div>
        </section>
      )}

      {agentOpen && (
        <div className="fox-agent-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setAgentOpen(false); }}>
          <section className="fox-agent-modal" role="dialog" aria-modal="true" aria-label="FOX AI Agent TEST prototyp">
            <header className="fox-agent-header">
              <div className="fox-agent-identity">
                <span className="fox-agent-avatar"><Bot size={25} /></span>
                <div>
                  <h3>FOX AI Agent</h3>
                  <p>Povedz komu a akú správu chceš poslať.</p>
                  <span className="fox-test-label"><ShieldCheck size={11} /> TEST · NIČ SA NEPOSIELA MIMO PROTOTYPU</span>
                </div>
              </div>
              <button className="fox-close" type="button" aria-label="Zavrieť FOX Agenta" onClick={() => setAgentOpen(false)}><X size={18} /></button>
            </header>

            <div className="fox-agent-body">
              <label className="fox-command-label" htmlFor="fox-agent-command">Príkaz pre agenta <span>prirodzený jazyk</span></label>
              <textarea id="fox-agent-command" className="fox-command" value={command} onChange={(event) => setCommand(event.target.value)} />

              <div className="fox-quick-prompts" aria-label="Rýchle testovacie príkazy">
                <button className="fox-quick" type="button" onClick={() => setCommand("Pošli Petrovi Müllerovi správu: Návrh webu je pripravený.")}>Peter Müller</button>
                <button className="fox-quick" type="button" onClick={() => setCommand("Pošli všetkým klientom správu, že zajtra budem dostupný od 10:00.")}>Všetci klienti</button>
                <button className="fox-quick" type="button" onClick={() => setCommand("Pošli nemeckým klientom správu: Máme pre vás novú verziu projektu. Pridaj aj push.")}>DE + push</button>
                <button className="fox-quick" type="button" onClick={() => setCommand("Pošli Lucii Novákovej správu: Prosím skontrolujte nový návrh. Pošli aj e-mail.")}>SK + e-mail</button>
              </div>

              <div className="fox-agent-actions">
                <button className="fox-primary" type="button" onClick={buildDraft}><Sparkles size={16} /> Agent: pripraviť náhľad</button>
                <button className="fox-secondary" type="button" onClick={resetDemo}>Reset demo</button>
              </div>

              {draft && (
                <div className="fox-draft">
                  <div className="fox-draft-head"><strong>Náhľad pred odoslaním</strong><span className="fox-test-label"><ShieldCheck size={10} /> APPROVAL REQUIRED</span></div>
                  <div className="fox-draft-grid">
                    <div className="fox-draft-cell">
                      <small><Users size={12} /> Príjemcovia</small>
                      <div className="fox-client-chips">
                        {draft.recipients.length ? draft.recipients.map((client) => (
                          <span className="fox-client-chip" key={client.id}>{client.name}<span className="fox-lang">{languageLabels[client.language]}</span></span>
                        )) : <span className="fox-agent-reason">Nebol rozpoznaný žiadny klient.</span>}
                      </div>
                    </div>
                    <div className="fox-draft-cell">
                      <small><Send size={12} /> Kanály</small>
                      {draft.channels.map((channel) => <span className="fox-channel" key={channel}>{channel === "web" ? <Bell size={12} /> : channel === "email" ? <Mail size={12} /> : <Send size={12} />}{channel}</span>)}
                    </div>
                    <div className="fox-draft-cell full">
                      <small><MessageSquareText size={12} /> Správa</small>
                      <p className="fox-message-preview">{draft.message || "Správa nebola rozpoznaná."}</p>
                    </div>
                    <div className="fox-draft-cell full">
                      <small><Languages size={12} /> Interpretácia agenta</small>
                      <div className="fox-agent-reason">{draft.reason} Jazykové mutácie sú v tomto prvom prototype označené podľa jazyka klienta; reálny AI preklad napojíme v ďalšej fáze.</div>
                    </div>
                  </div>
                  <div style={{ padding: "14px" }}>
                    <button className="fox-primary" type="button" disabled={!draft.recipients.length || !draft.message} onClick={sendInTest}><Send size={15} /> Potvrdiť a odoslať v TESTE</button>
                    <div className="fox-warning"><ShieldCheck size={15} /> Bez tvojho kliknutia na potvrdenie sa nevytvorí ani testovacie oznámenie. Reálne push/e-mail odosielanie nie je v tejto vetve zapnuté.</div>
                    {sentMessage && <div className="fox-success"><Check size={15} /> {sentMessage}</div>}
                  </div>
                </div>
              )}
            </div>
          </section>
        </div>
      )}
    </>
  );
}
