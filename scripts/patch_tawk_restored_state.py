from pathlib import Path

p = Path('public/tawk-language-loader.js')
s = p.read_text()
marker = '  // WDFOX_TAWK_RESTORED_STATE_FIX_V2\n'
if marker in s:
    print('Restored state fix already present')
    raise SystemExit(0)

old = '''  var visibilityApi = window.Tawk_API = window.Tawk_API || {};
  var previousChatMaximized = visibilityApi.onChatMaximized;
  var previousChatMinimized = visibilityApi.onChatMinimized;
  var previousChatHidden = visibilityApi.onChatHidden;
  var previousStatusChange = visibilityApi.onStatusChange;
'''
new = '''  // WDFOX_TAWK_RESTORED_STATE_FIX_V2
  // Tawk can restore a maximized chat after refresh without firing onChatMaximized.
  // Hide the FOX launcher until the real widget state is known.
  hideFoxLauncher();

  var visibilityApi = window.Tawk_API = window.Tawk_API || {};
  var previousOnLoad = visibilityApi.onLoad;
  var previousChatMaximized = visibilityApi.onChatMaximized;
  var previousChatMinimized = visibilityApi.onChatMinimized;
  var previousChatHidden = visibilityApi.onChatHidden;
  var previousStatusChange = visibilityApi.onStatusChange;

  function syncFoxLauncherToTawkState() {
    var api = window.Tawk_API || {};
    try {
      if (typeof api.isChatMaximized === "function" && api.isChatMaximized()) {
        foxChatOpen = true;
        hideFoxLauncher();
        return;
      }
      if ((typeof api.isChatMinimized === "function" && api.isChatMinimized()) ||
          (typeof api.isChatHidden === "function" && api.isChatHidden())) {
        foxChatOpen = false;
        showFoxLauncher();
        return;
      }
    } catch (_) {}

    // If the API cannot report the state, keep the known event-driven state.
    if (foxChatOpen) hideFoxLauncher();
    else showFoxLauncher();
  }

  visibilityApi.onLoad = function () {
    try {
      if (typeof previousOnLoad === "function") previousOnLoad.apply(this, arguments);
    } catch (_) {}
    syncFoxLauncherToTawkState();
    window.setTimeout(syncFoxLauncherToTawkState, 100);
    window.setTimeout(syncFoxLauncherToTawkState, 300);
    window.setTimeout(syncFoxLauncherToTawkState, 800);
    window.setTimeout(syncFoxLauncherToTawkState, 1500);
  };
'''
if old not in s:
    raise SystemExit('visibility callback anchor not found')
s = s.replace(old, new, 1)

# Also resync after status changes, because restored widget state may settle there.
old2 = '''  visibilityApi.onStatusChange = function () {
    try {
      if (typeof previousStatusChange === "function") previousStatusChange.apply(this, arguments);
    } catch (_) {}
    if (foxChatOpen) hideFoxLauncher();
  };
'''
new2 = '''  visibilityApi.onStatusChange = function () {
    try {
      if (typeof previousStatusChange === "function") previousStatusChange.apply(this, arguments);
    } catch (_) {}
    syncFoxLauncherToTawkState();
  };
'''
if old2 not in s:
    raise SystemExit('status callback anchor not found')
s = s.replace(old2, new2, 1)

p.write_text(s)
print('Tawk restored-state launcher fix applied')
