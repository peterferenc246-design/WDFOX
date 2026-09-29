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

def require(text, needle, label):
    if needle not in text: raise SystemExit(f"Expected marker missing in {label}: {needle!r}")

def strip_host_guard(text, label):
    lines = text.splitlines(keepends=True)
    start = next((i for i,x in enumerate(lines) if "var host = String(window.location.hostname" in x), None)
    if start is None: raise SystemExit(f"Preview host guard start missing in {label}")
    end = next((i for i in range(start,len(lines)) if "if (!isPreviewHost) return;" in lines[i]), None)
    if end is None: raise SystemExit(f"Preview host guard end missing in {label}")
    return "".join(lines[:start] + lines[end+1:])

def map_backend(text):
    for x in PREVIEW_PROPERTIES: text = text.replace(x, PROD_PROPERTY)
    for old,new in WIDGETS.items(): text = text.replace(old,new)
    return text.replace("data-wdfox-preview","data-wdfox-production").replace("fox-tawk-preview-","fox-tawk-").replace("fox-preview-arc","fox-prod-arc")

def transform_external(text):
    text = map_backend(strip_host_guard(text,"preview external loader"))
    text = text.replace("/* WDFOX preview: isolated Tawk.to property + language widget routing. */","/* WDFOX production: tested preview behavior mapped to production Tawk widgets. */",1)
    text = text.replace("switchPreviewChatLanguage","switchProductionChatLanguage")
    text = "".join(x for x in text.splitlines(keepends=True) if "WebDesignFOXSwitchPreviewChatLanguage" not in x)
    require(text,"window.WebDesignFOXSwitchChatLanguage","generated production loader")
    return text

def transform_launcher(text):
    text = map_backend(strip_host_guard(text,"preview launcher"))
    text = text.replace("/* WDFOX preview Tawk.to launcher — exact GitHub preview behavior plus Vercel host. */","/* WDFOX production Tawk.to launcher — exact behavior mirrored from tested preview. */",1)
    text = text.replace('style.id = "fox-tawk-launcher-style";','style.id = "fox-tawk-production-launcher-style";',1)
    marker = '    "#fox-tawk-launcher svg *{pointer-events:none!important}" +\n'
    require(text,marker,"preview launcher")
    if ".live-chat-bubble:not(#fox-tawk-launcher)" not in text:
        text = text.replace(marker, marker + '    ".live-chat-bubble:not(#fox-tawk-launcher){display:none!important;visibility:hidden!important;opacity:0!important;pointer-events:none!important}" +\n',1)
    return text

def validate(loader, launcher):
    for widget in WIDGETS.values():
        require(loader,widget,"generated production loader"); require(launcher,widget,"generated production launcher")
    require(loader,PROD_PROPERTY,"generated production loader"); require(launcher,PROD_PROPERTY,"generated production launcher")
    for bad in PREVIEW_PROPERTIES + list(WIDGETS) + ["isPreviewHost","isVercelPreviewHost","fox-tawk-preview-","data-wdfox-preview"]:
        if bad in loader or bad in launcher: raise SystemExit(f"Blocked preview marker in production candidate: {bad}")

def main():
    p=argparse.ArgumentParser(); p.add_argument("--input-dir",required=True); p.add_argument("--output-dir",required=True); a=p.parse_args()
    src,out=Path(a.input_dir),Path(a.output_dir); out.mkdir(parents=True,exist_ok=True)
    loader=transform_external((src/"tawk-preview-external.js").read_text(encoding="utf-8"))
    launcher=transform_launcher((src/"tawk-preview-launcher.js").read_text(encoding="utf-8"))
    validate(loader,launcher)
    (out/"tawk-language-loader.js").write_text(loader,encoding="utf-8")
    (out/"tawk-native-force.js").write_text(launcher,encoding="utf-8")
    shutil.copyfile(src/"tawk-fox-face-transparent.png",out/"tawk-fox-face-transparent.png")

if __name__ == "__main__": main()

# Deployment trigger after approved Tawk preview-to-production sync.
