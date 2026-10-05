from pathlib import Path

path = Path('public/jobcenter-poster-fix.js')
text = path.read_text(encoding='utf-8')

marker = "  function run(){"
if marker not in text:
    raise SystemExit('run() marker not found')

if 'function moveRecentMessagesBelowMainText()' not in text:
    helper = r'''
  function moveRecentMessagesBelowMainText(){
    var documentsHeading = Array.from(document.querySelectorAll('h2')).find(function(el){
      return (el.textContent || '').trim() === 'Dokumente des Jobcenters / Nachweise';
    });
    if (!documentsHeading) return false;

    var anchor = documentsHeading.closest('section') || documentsHeading;
    var ids = [
      'jobcenter-krankenversicherung-2026-10-05',
      'daniel-freund-email-2026-10-05',
      'jobcenter-existenz-message-2026-10-04',
      'daniel-freund-letter-2026-10-04'
    ];

    ids.forEach(function(id){
      var node = document.getElementById(id);
      if (node && anchor.parentNode) anchor.parentNode.insertBefore(node, anchor);
    });

    var freund04 = document.getElementById('daniel-freund-letter-2026-10-04');
    if (freund04) {
      Array.from(freund04.children).forEach(function(child){
        if (child.classList && (child.classList.contains('evidence-divider') || child.classList.contains('update-date'))) child.remove();
      });
      freund04.style.marginTop = '16px';
    }

    return true;
  }

'''
    text = text.replace(marker, helper + marker, 1)
else:
    text = text.replace("      'daniel-freund-letter'", "      'daniel-freund-letter-2026-10-04'")
    old = """    ids.forEach(function(id){\n      var node = document.getElementById(id);\n      if (node && anchor.parentNode) anchor.parentNode.insertBefore(node, anchor);\n    });\n\n    return true;"""
    new = """    ids.forEach(function(id){\n      var node = document.getElementById(id);\n      if (node && anchor.parentNode) anchor.parentNode.insertBefore(node, anchor);\n    });\n\n    var freund04 = document.getElementById('daniel-freund-letter-2026-10-04');\n    if (freund04) {\n      Array.from(freund04.children).forEach(function(child){\n        if (child.classList && (child.classList.contains('evidence-divider') || child.classList.contains('update-date'))) child.remove();\n      });\n      freund04.style.marginTop = '16px';\n    }\n\n    return true;"""
    if old not in text and "var freund04 = document.getElementById('daniel-freund-letter-2026-10-04');" not in text:
        raise SystemExit('moveRecentMessagesBelowMainText body not found')
    if old in text:
        text = text.replace(old, new, 1)

needle = "    addStandalonePoster();\n"
replacement = "    addStandalonePoster();\n    moveRecentMessagesBelowMainText();\n"
if replacement not in text:
    if needle not in text:
        raise SystemExit('Primary run insertion point not found')
    text = text.replace(needle, replacement, 1)

if 'setTimeout(function(){ moveRecentMessagesBelowMainText(); }, 1500);' not in text:
    run_end = "  }\n\n  if (document.readyState === 'loading')"
    if run_end not in text:
        raise SystemExit('run() closing marker not found')
    text = text.replace(run_end, "    setTimeout(function(){ moveRecentMessagesBelowMainText(); }, 1500);\n  }\n\n  if (document.readyState === 'loading')", 1)

path.write_text(text, encoding='utf-8')
print('Grouped both 04.10.2026 messages under one update block: removed the intermediate orange divider and duplicate update date from the Daniel Freund section.')
