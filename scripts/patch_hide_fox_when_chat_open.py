from pathlib import Path

p = Path('public/tawk-language-loader.js')
s = p.read_text()
marker = 'WDFOX_CHAT_LAUNCHER_VISIBILITY_FIX_V1'

if marker in s:
    print('FOX launcher visibility fix already present')
    raise SystemExit(0)

insert = r'''

  // WDFOX_CHAT_LAUNCHER_VISIBILITY_FIX_V1
  // The custom FOX launcher must never overlap an open Tawk chat window.
  var foxChatOpen = false;

  function getFoxLauncher() {
    return document.getElementById("fox-tawk-launcher");
  }

  function hideFoxLauncher() {
    var launcher = getFoxLauncher();
    if (!launcher) return;
    launcher.style.setProperty("visibility", "hidden", "important");
    launcher.style.setProperty("opacity", "0", "important");
    launcher.style.setProperty("display", "none", "important");
    launcher.style.setProperty("pointer-events", "none", "important");
  }

  function showFoxLauncher() {
    var launcher = getFoxLauncher();
    if (!launcher || foxChatOpen) return;
    launcher.style.setProperty("visibility", "visible", "important");
    launcher.style.setProperty("opacity", "1", "important");
    launcher.style.setProperty("display", "block", "important");
    launcher.style.setProperty("pointer-events", "auto", "important");
  }

  var visibilityApi = window.Tawk_API = window.Tawk_API || {};
  var previousChatMaximized = visibilityApi.onChatMaximized;
  var previousChatMinimized = visibilityApi.onChatMinimized;
  var previousChatHidden = visibilityApi.onChatHidden;
  var previousStatusChange = visibilityApi.onStatusChange;

  visibilityApi.onChatMaximized = function () {
    foxChatOpen = true;
    try {
      if (typeof previousChatMaximized === "function") previousChatMaximized.apply(this, arguments);
    } catch (_) {}
    hideFoxLauncher();
  };

  visibilityApi.onChatMinimized = function () {
    foxChatOpen = false;
    try {
      if (typeof previousChatMinimized === "function") previousChatMinimized.apply(this, arguments);
    } catch (_) {}
    showFoxLauncher();
  };

  visibilityApi.onChatHidden = function () {
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
    if (foxChatOpen) hideFoxLauncher();
  };

  function foxLauncherPressed(event) {
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

  document.addEventListener("pointerdown", foxLauncherPressed, true);
  document.addEventListener("click", foxLauncherPressed, true);
'''

needle = '\n})();'
pos = s.rfind(needle)
if pos == -1:
    raise SystemExit('tawk-language-loader.js closing anchor not found')

s = s[:pos] + insert + s[pos:]
p.write_text(s)
print('FOX launcher visibility patch applied to tawk-language-loader.js')
