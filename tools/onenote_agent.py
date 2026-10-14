#!/usr/bin/env python3
"""Read-only GitHub change journal -> Microsoft OneNote. Requires delegated MSAL cache."""
import base64, datetime as dt, html, json, os, pathlib, sys
import msal, requests

REPO=os.environ.get("GITHUB_REPOSITORY","peterferenc246-design/WDFOX")
SECTION=os.environ["ONENOTE_CHANGE_SECTION_ID"]
TOKEN=os.environ["GITHUB_TOKEN"]
API="https://api.github.com"
session=requests.Session()
session.headers.update({"Authorization":f"Bearer {TOKEN}","Accept":"application/vnd.github+json","X-GitHub-Api-Version":"2022-11-28"})

def api(path):
    resp=session.get(API+path,timeout=30)
    resp.raise_for_status()
    return resp.json()

def graph_token():
    cache=msal.SerializableTokenCache()
    cache.deserialize(base64.b64decode(os.environ["MSAL_CACHE_B64"]).decode())
    client=msal.PublicClientApplication(os.environ["MS_CLIENT_ID"],authority="https://login.microsoftonline.com/"+os.environ["MS_TENANT_ID"],token_cache=cache)
    accounts=client.get_accounts()
    if not accounts: raise RuntimeError("No delegated OneNote account in MSAL token cache")
    result=client.acquire_token_silent(["Notes.Create"],account=accounts[0])
    if not result or "access_token" not in result:
        raise RuntimeError("Microsoft login expired; refresh delegated token cache securely")
    return result["access_token"]

def content_summary(path, ref):
    if pathlib.PurePosixPath(path).suffix.lower() not in {".astro",".js",".ts",".tsx",".jsx",".py",".md",".json",".css",".html",".yml",".yaml"}:
        return "Binárny alebo nepodporovaný formát – obsah neanalyzovaný"
    response=session.get(API+f"/repos/{REPO}/contents/{path}",params={"ref":ref},timeout=30)
    if not response.ok: return "Obsah sa nepodarilo načítať"
    data=response.json()
    if not isinstance(data,dict) or data.get("encoding")!="base64": return "Obsah nebol dostupný ako text"
    raw=base64.b64decode(data["content"])
    if len(raw)>100000: return "Veľký súbor – úplný obsah nebol načítaný"
    text=raw.decode("utf-8",errors="replace")
    lines=text.splitlines()
    markers=[line.strip()[:120] for line in lines if line.strip().startswith(("export ","import ","function ","class ","const ","# ","## ","<h1","<title"))][:8]
    return f"{len(lines)} riadkov; orientačné prvky: "+(", ".join(markers) if markers else "bez identifikovaných deklarácií")

def main():
    event=json.loads(pathlib.Path(os.environ["GITHUB_EVENT_PATH"]).read_text())
    before=event.get("before")
    after=event.get("after")
    if not before or not after or set(before)=={"0"} or set(after)=={"0"}:
        print("No comparable push range");return
    compare=api(f"/repos/{REPO}/compare/{before}...{after}")
    changes=compare.get("files",[])
    rows=[]
    for f in changes[:200]:
        path=f["filename"]; status=f.get("status","modified")
        detail=content_summary(path,after) if status not in ("removed",) else "Odstránený súbor"
        rows.append(f"<li><b>{html.escape(status)}</b> <code>{html.escape(path)}</code> – {html.escape(detail)}</li>")
    added_dirs=sorted({str(pathlib.PurePosixPath(f["filename"]).parent) for f in changes if f.get("status")=="added" and "/" in f["filename"]})
    stamp=dt.datetime.now(dt.timezone.utc).strftime("%Y-%m-%d %H:%M UTC")
    title=f"WDFOX GitHub zmeny – {after[:12]}"
    page=f'<!DOCTYPE html><html><head><title>{title}</title></head><body><h1>{title}</h1><p>{stamp}; repo {html.escape(REPO)}; vetva {html.escape(event.get("ref",""))}; porovnanie: https://github.com/{REPO}/compare/{before}...{after}</p><p>Súbory: {len(changes)}. Technický výpis; význam kódu si vyžaduje odborné posúdenie.</p><h2>Zmenené súbory</h2><ul>{"".join(rows)}</ul><h2>Adresáre s novými súbormi</h2><p>{html.escape(", ".join(added_dirs))}</p></body></html>'
    response=requests.post(f"https://graph.microsoft.com/v1.0/me/onenote/sections/{SECTION}/pages",headers={"Authorization":"Bearer "+graph_token(),"Content-Type":"text/html"},data=page.encode(),timeout=45)
    response.raise_for_status()
    print("OneNote page created:",response.status_code)

if __name__=="__main__":main()
