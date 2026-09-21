from pathlib import Path

p = Path('public/tawk-language-loader.js')
s = p.read_text()
marker = '  // WDFOX_REMOVE_OBSOLETE_FLOATING_CHAT_OPTION_V1\n'
if marker in s:
    print('Floating chat option patch already present')
    raise SystemExit(0)

anchor = '  var PROPERTY_ID = "6a951d52c3c46c344587662a";\n'
patch = '''  // WDFOX_REMOVE_OBSOLETE_FLOATING_CHAT_OPTION_V1
  // The old custom "Floating window" toggle is obsolete and must not be offered.
  try { localStorage.removeItem("wdfox-chat-floating-v3"); } catch (_) {}
  var obsoleteFloatingToggle = document.getElementById("fox-chat-floating");
  if (obsoleteFloatingToggle) obsoleteFloatingToggle.checked = false;
  var obsoleteChatSettings = document.getElementById("fox-chat-settings");
  if (obsoleteChatSettings) obsoleteChatSettings.remove();

'''
if anchor not in s:
    raise SystemExit('Loader anchor not found')
s = s.replace(anchor, patch + anchor, 1)
p.write_text(s)
print('Obsolete floating chat option removed')
