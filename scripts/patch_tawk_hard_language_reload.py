from pathlib import Path

p = Path('public/tawk-language-loader.js')
s = p.read_text(encoding='utf-8')
start_marker = '  window.WebDesignFOXSwitchChatLanguage = function (nextLanguage, callback) {\n'
end_marker = '\n\n  var script = document.createElement("script");\n'
start = s.find(start_marker)
end = s.find(end_marker, start)
if start < 0 or end < 0:
    raise SystemExit('language switch block not found')
new_block = '''  // WDFOX_HARD_LANGUAGE_WIDGET_ISOLATION_V1\n  // Never use Tawk switchWidget for language changes: it preserves the current\n  // conversation and can leak messages/cards/quick replies across languages.\n  // End the current chat, then let the language navigation perform a full page\n  // load so exactly one widget ID is booted from scratch for the target locale.\n  window.WebDesignFOXSwitchChatLanguage = function (nextLanguage, callback) {\n    var nextWidget = widgets[nextLanguage];\n    if (!nextWidget) {\n      callback();\n      return;\n    }\n\n    try {\n      if (window.Tawk_API && typeof window.Tawk_API.endChat === "function") {\n        window.Tawk_API.endChat();\n      }\n    } catch (_) {}\n\n    window.setTimeout(function () {\n      callback();\n    }, 120);\n  };'''
s = s[:start] + new_block + s[end:]
p.write_text(s, encoding='utf-8')
print('Applied hard language widget isolation')
