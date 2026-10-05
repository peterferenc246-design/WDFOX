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

    var moved = false;
    ids.forEach(function(id){
      var node = document.getElementById(id);
      if (node && anchor.parentNode) {
        anchor.parentNode.insertBefore(node, anchor);
        moved = true;
      }
    });

    return moved;
  }

'''
    text = text.replace(marker, helper + marker, 1)

# Add the ordering call after all sections are created.
needle = "    addStandalonePoster();\n"
replacement = "    addStandalonePoster();\n    moveRecentMessagesBelowMainText();\n"
if replacement not in text:
    if needle not in text:
        raise SystemExit('Primary run insertion point not found')
    text = text.replace(needle, replacement, 1)

# Also enforce the position in the delayed second pass after all dynamic blocks exist.
old_timeout = "setTimeout(function(){ addTopFacebookIcon(); addDanielFreundEmail20261005(); addDanielFreundLetter(); addKrankenversicherungMessage(); addExistenzMessage(); addPostfachCards(); addStandalonePoster(); }, 1200);"
new_timeout = "setTimeout(function(){ addTopFacebookIcon(); addDanielFreundEmail20261005(); addDanielFreundLetter(); addKrankenversicherungMessage(); addExistenzMessage(); addPostfachCards(); addStandalonePoster(); moveRecentMessagesBelowMainText(); }, 1200);"
if old_timeout in text:
    text = text.replace(old_timeout, new_timeout, 1)
elif new_timeout not in text:
    raise SystemExit('Delayed run insertion point not found')

path.write_text(text, encoding='utf-8')
print('Moved 05.10 and 04.10 message sections below the main text, directly before the 03.10 documents block.')
