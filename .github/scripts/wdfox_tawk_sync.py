#!/usr/bin/env python3
from pathlib import Path
import argparse
import shutil

WIDGET_IDS = [
    "1k1b9121q", "1k1bb2aln", "1k1bb9ast",
    "1k1bjvbjq", "1k1blk6o4", "1k1bovo5t",
    "1k1bp5qda", "1k1bp6lk5", "1k1bpdngj",
]


def require(text: str, needle: str, label: str) -> None:
    if needle not in text:
        raise SystemExit(f"Expected marker missing in {label}: {needle!r}")


def transform_external(text: str) -> str:
    host_block = (
        '  var host = String(window.location.hostname || "").toLowerCase();\n'
        '  var isPreviewHost =\n'
        '    host === "localhost" ||\n'
        '    host === "127.0.0.1" ||\n'
        '    host.endsWith(".app.github.dev") ||\n'
        '    host.endsWith(".github.dev");\n\n'
        '  if (!isPreviewHost) return;\n'
    )
    require(text, host_block, "preview external loader")
    text = text.replace(host_block, "", 1)
    text = text.replace(
        "/* WDFOX preview: external Tawk.to connection only. */",
        "/* WDFOX production: external Tawk.to connection mirrored from tested preview. */",
        1,
    )
    text = text.replace("fox-tawk-preview-concealed", "fox-tawk-concealed")
    text = text.replace("fox-tawk-preview-no-flash", "fox-tawk-no-flash")
    text = text.replace(
        'script.setAttribute("data-wdfox-preview", "external-tawk");',
        'script.setAttribute("data-wdfox-production", "external-tawk");',
        1,
    )

    widget_marker = '  var widgetId = WIDGETS[language];\n'
    require(text, widget_marker, "preview external loader")
    text = text.replace(
        widget_marker,
        widget_marker + '\n  try { localStorage.setItem("wdfox-language", language); } catch (_) {}\n',
        1,
    )

    globals_marker = '  window.WebDesignFOXTawkWidgetId = widgetId;\n'
    require(text, globals_marker, "preview external loader")
    switch_block = (
        '\n  window.WebDesignFOXSwitchChatLanguage = function (nextLanguage, done) {\n'
        '    var next = normalize(nextLanguage);\n'
        '    if (WIDGETS[next]) {\n'
        '      try { localStorage.setItem("wdfox-language", next); } catch (_) {}\n'
        '    }\n'
        '    var finish = function () {\n'
        '      if (typeof done === "function") done();\n'
        '    };\n'
        '    try {\n'
        '      if (window.Tawk_API && typeof window.Tawk_API.endChat === "function") {\n'
        '        window.Tawk_API.endChat();\n'
        '        window.setTimeout(finish, 120);\n'
        '        return;\n'
        '      }\n'
        '    } catch (_) {}\n'
        '    finish();\n'
        '  };\n'
    )
    return text.replace(globals_marker, globals_marker + switch_block, 1)


def transform_launcher(text: str) -> str:
    host_block = (
        '  var host = String(window.location.hostname || "").toLowerCase();\n'
        '  var isPreviewHost = host === "localhost" || host === "127.0.0.1" || host.endsWith(".app.github.dev") || host.endsWith(".github.dev");\n'
        '  if (!isPreviewHost) return;\n'
    )
    require(text, host_block, "preview launcher")
    text = text.replace(host_block, "", 1)
    text = text.replace(
        "/* WDFOX Codespaces-only Tawk.to launcher — restored original FOX artwork. */",
        "/* WDFOX production Tawk.to launcher — exact behavior mirrored from tested preview. */",
        1,
    )
    text = text.replace("fox-tawk-preview-launcher", "fox-tawk-launcher")
    text = text.replace("fox-tawk-preview-concealed", "fox-tawk-concealed")
    text = text.replace("fox-preview-arc", "fox-prod-arc")
    text = text.replace("fox-tawk-launcher-style", "fox-tawk-production-launcher-style", 1)

    css_marker = '    "#fox-tawk-launcher svg *{pointer-events:none!important}" +\n'
    require(text, css_marker, "preview launcher")
    text = text.replace(
        css_marker,
        css_marker
        + '    ".live-chat-bubble:not(#fox-tawk-launcher){display:none!important;visibility:hidden!important;opacity:0!important;pointer-events:none!important}" +\n',
        1,
    )
    return text


def validate(loader: str, launcher: str) -> None:
    for widget_id in WIDGET_IDS:
        require(loader, widget_id, "generated production loader")
        require(launcher, widget_id, "generated production launcher")
    require(loader, "window.WebDesignFOXSwitchChatLanguage", "generated production loader")
    require(launcher, 'launcher.id = "fox-tawk-launcher"', "generated production launcher")
    require(launcher, ".live-chat-bubble:not(#fox-tawk-launcher)", "generated production launcher")
    for forbidden in ("isPreviewHost", "fox-tawk-preview-"):
        if forbidden in loader or forbidden in launcher:
            raise SystemExit(f"Blocked preview-only marker in production candidate: {forbidden}")


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--input-dir", required=True)
    parser.add_argument("--output-dir", required=True)
    args = parser.parse_args()

    src = Path(args.input_dir)
    out = Path(args.output_dir)
    out.mkdir(parents=True, exist_ok=True)

    external = (src / "tawk-preview-external.js").read_text(encoding="utf-8")
    launcher = (src / "tawk-preview-launcher.js").read_text(encoding="utf-8")

    production_loader = transform_external(external)
    production_launcher = transform_launcher(launcher)
    validate(production_loader, production_launcher)

    (out / "tawk-language-loader.js").write_text(production_loader, encoding="utf-8")
    (out / "tawk-native-force.js").write_text(production_launcher, encoding="utf-8")
    shutil.copyfile(src / "tawk-fox-face-transparent.png", out / "tawk-fox-face-transparent.png")


if __name__ == "__main__":
    main()
