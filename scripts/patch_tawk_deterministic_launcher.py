from pathlib import Path

p = Path('public/tawk-language-loader.js')
s = p.read_text()
start_marker = '  // WDFOX_TAWK_RESTORED_STATE_FIX_V2\n'
end_marker = '  function foxLauncherPressed(event) {\n'
start = s.find(start_marker)
end = s.find(end_marker)
if start < 0 or end < 0 or end <= start:
    raise SystemExit('launcher state block not found')

new = '''  // WDFOX_TAWK_DETERMINISTIC_LAUNCHER_V3
  // Every page load starts with ONLY the FOX launcher visible.
  // The Tawk window is shown only after an explicit FOX click.
  var userOpenedChat = false;

  var visibilityApi = window.Tawk_API = window.Tawk_API || {};
  var previousOnLoad = visibilityApi.onLoad;
  var previousChatMaximized = visibilityApi.onChatMaximized;
  var previousChatMinimized = visibilityApi.onChatMinimized;
  var previousChatHidden = visibilityApi.onChatHidden;
  var previousStatusChange = visibilityApi.onStatusChange;

  function forceFoxOnlyState() {
    if (userOpenedChat) return;
    foxChatOpen = false;
    var api = window.Tawk_API || {};
    try { if (typeof api.minimize === "function") api.minimize(); } catch (_) {}
    try { if (typeof api.hideWidget === "function") api.hideWidget(); } catch (_) {}
    showFoxLauncher();
  }

  visibilityApi.onLoad = function () {
    try {
      if (typeof previousOnLoad === "function") previousOnLoad.apply(this, arguments);
    } catch (_) {}
    userOpenedChat = false;
    forceFoxOnlyState();
    window.setTimeout(forceFoxOnlyState, 0);
    window.setTimeout(forceFoxOnlyState, 150);
    window.setTimeout(forceFoxOnlyState, 500);
    window.setTimeout(forceFoxOnlyState, 1200);
  };

  visibilityApi.onChatMaximized = function () {
    try {
      if (typeof previousChatMaximized === "function") previousChatMaximized.apply(this, arguments);
    } catch (_) {}
    if (!userOpenedChat) {
      forceFoxOnlyState();
      return;
    }
    foxChatOpen = true;
    hideFoxLauncher();
  };

  visibilityApi.onChatMinimized = function () {
    userOpenedChat = false;
    foxChatOpen = false;
    try {
      if (typeof previousChatMinimized === "function") previousChatMinimized.apply(this, arguments);
    } catch (_) {}
    try {
      if (window.Tawk_API && typeof window.Tawk_API.hideWidget === "function") window.Tawk_API.hideWidget();
    } catch (_) {}
    showFoxLauncher();
  };

  visibilityApi.onChatHidden = function () {
    userOpenedChat = false;
    foxChatOpen = false;
    try {
      if (typeof previousChatHidden === "function") previousChatHidden.apply(this, arguments);
    } catch (_) {}
    showFoxLauncher();
  };

  visibilityApi.onStatusChange = function () {
    try {
      if (typeof previousStatusChange === "function") previousStatusChange.apply(this, arguments);
    } catch (_) {}
    if (userOpenedChat) hideFoxLauncher();
    else forceFoxOnlyState();
  };

'''

s = s[:start] + new + s[end:]

old = '''  function foxLauncherPressed(event) {
    var launcher = getFoxLauncher();
    if (!launcher || !event || !event.target) return;
    var target = event.target.closest ? event.target.closest("#fox-tawk-launcher") : null;
    if (target !== launcher) return;
    foxChatOpen = true;
    hideFoxLauncher();
    window.setTimeout(hideFoxLauncher, 0);
    window.setTimeout(hideFoxLauncher, 120);
    window.setTimeout(hideFoxLauncher, 500);
  }
'''
new_pressed = '''  function foxLauncherPressed(event) {
    var launcher = getFoxLauncher();
    if (!launcher || !event || !event.target) return;
    var target = event.target.closest ? event.target.closest("#fox-tawk-launcher") : null;
    if (target !== launcher) return;
    userOpenedChat = true;
    foxChatOpen = true;
    hideFoxLauncher();
    var api = window.Tawk_API || {};
    try { if (typeof api.showWidget === "function") api.showWidget(); } catch (_) {}
    try { if (typeof api.maximize === "function") api.maximize(); } catch (_) {}
    window.setTimeout(hideFoxLauncher, 0);
    window.setTimeout(hideFoxLauncher, 120);
    window.setTimeout(hideFoxLauncher, 500);
  }
'''
if old not in s:
    raise SystemExit('foxLauncherPressed block not found')
s = s.replace(old, new_pressed, 1)

p.write_text(s)
print('Deterministic FOX/Tawk launcher behavior applied')
