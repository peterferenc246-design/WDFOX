#!/usr/bin/env python3
from pathlib import Path
import argparse, shutil

PROD_PROPERTY = "6a951d52c3c46c344587662a"
WIDGETS = {
    "1k3jmfkjq":"1k1b9121q", "1k3jk1ga8":"1k1bb2aln", "1k3jmi4o8":"1k1bb9ast",
    "1k3jmj0gp":"1k1bjvbjq", "1k3jmj9u6":"1k1blk6o4", "1k3jmk3i0":"1k1bovo5t",
    "1k3jmkd5l":"1k1bp5qda", "1k3jmlaaq":"1k1bp6lk5", "1k3jmljpb":"1k1bpdngj",
}
PREVIEW_PROPERTIES = [
    "6ab9114a68e784344596dba1","6aba373f25498e3445ceb5b6","6aba2d3f1300d43446c8b761",
    "6aba3791c601f934456dfe2b","6aba37adc601f934456dfe2e","6aba37b7783d543456da149d",
    "6aba37d1497bdf3441c94df7","6aba37dbd338ef344337ab6c","6aba37f98673653447134cc1",
    "6aba3803dff27f343f63f6c9",
]

PRODUCTION_LANGUAGE_SWITCH = r'''
  function endCurrentChat(done) {
    var finished = false;
    var finish = function () {
      if (finished) return;
      finished = true;
      if (typeof done === "function") done();
    };

    try {
      if (window.Tawk_API && typeof window.Tawk_API.endChat === "function") {
        window.Tawk_API.endChat(function () {
          finish();
        });
        window.setTimeout(finish, 900);
        return;
      }
    } catch (_) {}

    finish();
  }

  function switchProductionChatLanguage(nextLanguage, done) {
    var next = normalize(nextLanguage);
    if (!WIDGETS[next]) next = "sk";

    try { localStorage.setItem("wdfox-language", next); } catch (_) {}
    window.WebDesignFOXChatLanguage = next;
    window.WebDesignFOXTawkPropertyId = PROPERTY_ID;
    window.WebDesignFOXTawkWidgetId = WIDGETS[next];
    document.documentElement.setAttribute("data-wdfox-tawk-language", next);
    document.documentElement.setAttribute("data-wdfox-tawk-widget", WIDGETS[next]);

    // Production keeps all language widgets under one Tawk property.
    // Finish the old chat before navigating to the next language so
    // previous-language greetings/messages do not remain in the session.
    endCurrentChat(done);
  }

  window.WebDesignFOXSwitchChatLanguage = switchProductionChatLanguage;

  function installLanguageNavigationGuard() {
    document.addEventListener("click", function (event) {
      if (event.defaultPrevented || event.button > 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;

      var target = event.target;
      var link = target && target.closest ? target.closest("#fixed-lang-layer a.language-flag[data-language]") : null;
      if (!link) return;

      var next = normalize(link.getAttribute("data-language"));
      if (!WIDGETS[next] || next === language) return;

      event.preventDefault();
      var href = link.href;
      var navigated = false;
      var navigate = function () {
        if (navigated) return;
        navigated = true;
        window.location.assign(href);
      };

      switchProductionChatLanguage(next, navigate);
      window.setTimeout(navigate, 1100);
    }, true);
  }

  installLanguageNavigationGuard();
'''

def require(text, needle, label):
    if needle not in text:
        raise SystemExit(f"Expected marker missing in {label}: {needle!r}")

def strip_host_guard(text, label):
    lines = text.splitlines(keepends=True)
    start = next((i for i,x in enumerate(lines) if "var host = String(window.location.hostname" in x), None)
    if start is None:
        raise SystemExit(f"Preview host guard start missing in {label}")
    end = next((i for i in range(start,len(lines)) if "if (!isPreviewHost) return;" in lines[i]), None)
    if end is None:
        raise SystemExit(f"Preview host guard end missing in {label}")
    return "".join(lines[:start] + lines[end+1:])

def map_backend(text):
    for x in PREVIEW_PROPERTIES:
        text = text.replace(x, PROD_PROPERTY)
    for old,new in WIDGETS.items():
        text = text.replace(old,new)
    return (
        text.replace("data-wdfox-preview","data-wdfox-production")
            .replace("fox-tawk-preview-","fox-tawk-")
            .replace("fox-preview-arc","fox-prod-arc")
    )

def transform_external(text):
    text = map_backend(strip_host_guard(text,"preview external loader"))
    text = text.replace(
        "/* WDFOX preview: isolated Tawk.to property + language widget routing. */",
        "/* WDFOX production: tested preview behavior mapped to production Tawk widgets. */",
        1,
    )

    start_marker = "  function switchPreviewChatLanguage(nextLanguage, done) {"
    end_marker = "  window.WebDesignFOXSwitchChatLanguage = switchPreviewChatLanguage;\n"
    start = text.find(start_marker)
    end = text.find(end_marker)
    if start < 0 or end < 0 or end < start:
        raise SystemExit("Preview language switch block not found")
    end += len(end_marker)
    text = text[:start] + PRODUCTION_LANGUAGE_SWITCH + text[end:]

    require(text,"window.WebDesignFOXSwitchChatLanguage","generated production loader")
    require(text,"#fixed-lang-layer a.language-flag[data-language]","generated production loader")
    require(text,"Tawk_API.endChat","generated production loader")
    if "Tawk_API.switchWidget" in text:
        raise SystemExit("Production loader must not switch widgets inside one live Tawk session")
    return text

def transform_launcher(text):
    text = map_backend(strip_host_guard(text,"preview launcher"))
    text = text.replace(
        "/* WDFOX preview Tawk.to launcher — exact GitHub preview behavior plus Vercel host. */",
        "/* WDFOX production Tawk.to launcher — exact behavior mirrored from tested preview. */",
        1,
    )
    text = text.replace(
        'style.id = "fox-tawk-launcher-style";',
        'style.id = "fox-tawk-production-launcher-style";',
        1,
    )
    marker = '    "#fox-tawk-launcher svg *{pointer-events:none!important}" +\n'
    require(text,marker,"preview launcher")
    if ".live-chat-bubble:not(#fox-tawk-launcher)" not in text:
        text = text.replace(
            marker,
            marker + '    ".live-chat-bubble:not(#fox-tawk-launcher){display:none!important;visibility:hidden!important;opacity:0!important;pointer-events:none!important}" +\n',
            1,
        )
    return text

def validate(loader, launcher):
    for widget in WIDGETS.values():
        require(loader,widget,"generated production loader")
        require(launcher,widget,"generated production launcher")
    require(loader,PROD_PROPERTY,"generated production loader")
    require(launcher,PROD_PROPERTY,"generated production launcher")
    require(loader,"Tawk_API.endChat","generated production loader")
    require(loader,"#fixed-lang-layer a.language-flag[data-language]","generated production loader")
    if "Tawk_API.switchWidget" in loader:
        raise SystemExit("Blocked same-session widget switching in production loader")
    for bad in PREVIEW_PROPERTIES + list(WIDGETS) + ["isPreviewHost","isVercelPreviewHost","fox-tawk-preview-","data-wdfox-preview"]:
        if bad in loader or bad in launcher:
            raise SystemExit(f"Blocked preview marker in production candidate: {bad}")

def main():
    p=argparse.ArgumentParser()
    p.add_argument("--input-dir",required=True)
    p.add_argument("--output-dir",required=True)
    a=p.parse_args()
    src,out=Path(a.input_dir),Path(a.output_dir)
    out.mkdir(parents=True,exist_ok=True)
    loader=transform_external((src/"tawk-preview-external.js").read_text(encoding="utf-8"))
    launcher=transform_launcher((src/"tawk-preview-launcher.js").read_text(encoding="utf-8"))
    validate(loader,launcher)
    (out/"tawk-language-loader.js").write_text(loader,encoding="utf-8")
    (out/"tawk-native-force.js").write_text(launcher,encoding="utf-8")
    shutil.copyfile(src/"tawk-fox-face-transparent.png",out/"tawk-fox-face-transparent.png")

if __name__ == "__main__":
    main()
