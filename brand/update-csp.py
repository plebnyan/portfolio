"""Write/refresh the Content-Security-Policy <meta> tag in every page under site/.

    python3 brand/update-csp.py

GitHub Pages can't send security headers, so the policy lives in a <meta> tag.
Inline <script> blocks are allowed by their SHA-256 hash, which means the hash must
be recomputed whenever one of them changes. Run this after editing any inline script.
"""
import base64
import hashlib
import re
from pathlib import Path

SITE = Path(__file__).resolve().parent.parent / "site"

# Everything not listed here is blocked.
BASE_POLICY = {
    "default-src": ["'self'"],
    "script-src": ["'self'", "https://gc.zgo.at"],              # + inline hashes
    "style-src": ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
    "font-src": ["'self'", "https://fonts.gstatic.com"],
    "img-src": ["'self'", "data:", "https://nyanlynntun.goatcounter.com"],
    "connect-src": ["'self'", "https://nyanlynntun.goatcounter.com"],
    "object-src": ["'none'"],
    "base-uri": ["'self'"],
    "form-action": ["'none'"],
    "upgrade-insecure-requests": [],
}

INLINE_JS = re.compile(r"<script(?![^>]*\bsrc=)(?![^>]*application/ld\+json)[^>]*>(.*?)</script>", re.S)
CSP_META = re.compile(r'\n?[ \t]*<meta http-equiv="Content-Security-Policy"[^>]*>')
ANCHOR = re.compile(r'([ \t]*)<meta name="viewport"[^>]*>')


def sha256(js: str) -> str:
    return "'sha256-" + base64.b64encode(hashlib.sha256(js.encode()).digest()).decode() + "'"


for page in sorted(SITE.glob("*.html")):
    html = CSP_META.sub("", page.read_text())
    policy = {k: list(v) for k, v in BASE_POLICY.items()}
    policy["script-src"] += [sha256(js) for js in INLINE_JS.findall(html)]
    value = "; ".join((k + " " + " ".join(v)).strip() for k, v in policy.items())
    m = ANCHOR.search(html)
    html = html[: m.end()] + f'\n{m.group(1)}<meta http-equiv="Content-Security-Policy" content="{value}" />' + html[m.end():]
    page.write_text(html)
    print(f"{page.name}: {len(policy['script-src']) - 2} inline script hash(es)")
