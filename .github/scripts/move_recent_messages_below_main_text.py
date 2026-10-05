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
      'daniel-freund-letter'
    ];

    ids.forEach(function(id){
      var node = document.getElementById(id);
      if (node && anchor.parentNode) anchor.parentNode.insertBefore(node, anchor);
    });

    return true;
  }

'''
    text = text.replace(marker, helper + marker, 1)

needle = "    addStandalonePoster();\n"
replacement = "    addStandalonePoster();\n    moveRecentMessagesBelowMainText();\n"
if replacement not in text:
    if needle not in text:
        raise SystemExit('Primary run insertion point not found')
    text = text.replace(needle, replacement, 1)

# Run once more after the delayed rendering pass without depending on its exact source text.
if 'setTimeout(function(){ moveRecentMessagesBelowMainText(); }, 1500);' not in text:
    run_end = "  }\n\n  if (document.readyState === 'loading')"
    if run_end not in text:
        raise SystemExit('run() closing marker not found')
    text = text.replace(run_end, "    setTimeout(function(){ moveRecentMessagesBelowMainText(); }, 1500);\n  }\n\n  if (document.readyState === 'loading')", 1)

path.write_text(text, encoding='utf-8')
print('Moved the 05.10 and 04.10 message sections back below the main text and before the 03.10 documents block.')
