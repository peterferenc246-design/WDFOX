from pathlib import Path

path = Path('public/jobcenter-poster-fix.js')
text = path.read_text(encoding='utf-8')

marker = '  function run(){\n'
if marker not in text:
    raise SystemExit('run() marker not found')

fn = r'''  function groupFreundWithKranken05Oct(){
    var krank = document.getElementById('jobcenter-krankenversicherung-2026-10-05');
    var freund = document.getElementById('daniel-freund-email-2026-10-05');
    if (!krank || !freund) return false;
    if (freund.parentElement === krank && freund.getAttribute('data-wdfox-same-day') === '1') return true;

    // The 05.10 Jobcenter message and the 05.10 Freund email belong to one visual day block.
    // Keep one top orange divider/date and move the Freund card below the first 05.10 message.
    Array.from(freund.querySelectorAll(':scope > .evidence-divider, :scope > .update-date')).forEach(function(el){ el.remove(); });
    freund.className = 'wdfox-same-day-followup';
    freund.setAttribute('data-wdfox-same-day', '1');
    freund.style.marginTop = '22px';
    freund.style.pageBreakBefore = 'auto';
    freund.style.breakBefore = 'auto';
    var heading = freund.querySelector(':scope > h2');
    if (heading) heading.style.marginTop = '0';
    krank.appendChild(freund);
    return true;
  }

'''

if 'function groupFreundWithKranken05Oct()' not in text:
    text = text.replace(marker, fn + marker, 1)

old = '''    addDanielFreundEmail20261005();
    addDanielFreundLetter();
    addKrankenversicherungMessage();
    addExistenzMessage();'''
new = '''    addDanielFreundEmail20261005();
    addDanielFreundLetter();
    addKrankenversicherungMessage();
    groupFreundWithKranken05Oct();
    addExistenzMessage();'''
if old not in text:
    raise SystemExit('primary run sequence not found')
text = text.replace(old, new, 1)

old2 = '''setTimeout(function(){ addTopFacebookIcon(); addDanielFreundEmail20261005(); addDanielFreundLetter(); addKrankenversicherungMessage(); addExistenzMessage(); addPostfachCards(); addStandalonePoster(); }, 1200);'''
new2 = '''setTimeout(function(){ addTopFacebookIcon(); addDanielFreundEmail20261005(); addDanielFreundLetter(); addKrankenversicherungMessage(); groupFreundWithKranken05Oct(); addExistenzMessage(); addPostfachCards(); addStandalonePoster(); groupFreundWithKranken05Oct(); }, 1200);'''
if old2 not in text:
    raise SystemExit('delayed run sequence not found')
text = text.replace(old2, new2, 1)

path.write_text(text, encoding='utf-8')
print('Grouped the two 05.10 messages at runtime inside one day block.')
