from pathlib import Path

p = Path('public/tawk-language-loader.js')
s = p.read_text()
marker = '  // WDFOX_TAWK_NO_FLASH_GUARD_V4\n'
if marker in s:
    print('No-flash guard already present')
    raise SystemExit(0)

anchor = '  var script = document.createElement("script");\n'
patch = '''  // WDFOX_TAWK_NO_FLASH_GUARD_V4
  // Keep every Tawk iframe visually suppressed until the visitor explicitly
  // opens chat through the FOX launcher. This prevents any blue-window flash
  // while Tawk restores its previous UI state during page refresh.
  var tawkGuardStyle = document.createElement("style");
  tawkGuardStyle.id = "fox-tawk-no-flash-guard";
  tawkGuardStyle.textContent =
    'html.fox-tawk-concealed iframe[src*="tawk.to"],'+
    'html.fox-tawk-concealed iframe[src*="tawk.link"],'+
    'html.fox-tawk-concealed iframe[title*="chat widget" i]{'+
    'visibility:hidden!important;opacity:0!important;pointer-events:none!important;}';
  document.head.appendChild(tawkGuardStyle);
  document.documentElement.classList.add("fox-tawk-concealed");

  function concealTawkFrames() {
    document.documentElement.classList.add("fox-tawk-concealed");
  }

  function revealTawkFrames() {
    document.documentElement.classList.remove("fox-tawk-concealed");
  }

'''
if anchor not in s:
    raise SystemExit('Tawk script anchor not found')
s = s.replace(anchor, patch + anchor, 1)

old = '''  function forceFoxOnlyState() {
    if (userOpenedChat) return;
    foxChatOpen = false;
    var api = window.Tawk_API || {};
    try { if (typeof api.minimize === "function") api.minimize(); } catch (_) {}
    try { if (typeof api.hideWidget === "function") api.hideWidget(); } catch (_) {}
    showFoxLauncher();
  }
'''
new = '''  function forceFoxOnlyState() {
    if (userOpenedChat) return;
    foxChatOpen = false;
    concealTawkFrames();
    var api = window.Tawk_API || {};
    try { if (typeof api.minimize === "function") api.minimize(); } catch (_) {}
    try { if (typeof api.hideWidget === "function") api.hideWidget(); } catch (_) {}
    showFoxLauncher();
  }
'''
if old not in s:
    raise SystemExit('forceFoxOnlyState block not found')
s = s.replace(old, new, 1)

old2 = '''  visibilityApi.onChatMinimized = function () {
    userOpenedChat = false;
    foxChatOpen = false;
'''
new2 = '''  visibilityApi.onChatMinimized = function () {
    userOpenedChat = false;
    foxChatOpen = false;
    concealTawkFrames();
'''
if old2 not in s:
    raise SystemExit('onChatMinimized anchor not found')
s = s.replace(old2, new2, 1)

old3 = '''  visibilityApi.onChatHidden = function () {
    userOpenedChat = false;
    foxChatOpen = false;
'''
new3 = '''  visibilityApi.onChatHidden = function () {
    userOpenedChat = false;
    foxChatOpen = false;
    concealTawkFrames();
'''
if old3 not in s:
    raise SystemExit('onChatHidden anchor not found')
s = s.replace(old3, new3, 1)

old4 = '''    userOpenedChat = true;
    foxChatOpen = true;
    hideFoxLauncher();
    var api = window.Tawk_API || {};
'''
new4 = '''    userOpenedChat = true;
    foxChatOpen = true;
    hideFoxLauncher();
    revealTawkFrames();
    var api = window.Tawk_API || {};
'''
if old4 not in s:
    raise SystemExit('fox launcher open anchor not found')
s = s.replace(old4, new4, 1)

p.write_text(s)
print('Tawk no-flash guard applied')
