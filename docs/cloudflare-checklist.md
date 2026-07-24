# Cloudflare checklist

Pending items before launch:

- Point `2morrow.land` and `www.2morrow.land` DNS to GitHub Pages, with `www` redirected to `https://2morrow.land/`.
- Enable GitHub Pages custom-domain verification for `2morrow.land`.
- Enable Cloudflare Web Analytics from the Cloudflare dashboard. Do not add repository-side analytics scripts.
- Add a `Content-Security-Policy` that keeps the default policy strict and expands `form-action`, `connect-src` and any required asset origins only after the final SendFox form endpoint is confirmed.
- Add `X-Content-Type-Options: nosniff`.
- Add `Referrer-Policy: strict-origin-when-cross-origin`.
- Add `Permissions-Policy` with disabled features by default, enabling only the features that remain necessary after newsletter integration.
- Add `frame-ancestors 'none'` through CSP unless a future embedded use case requires otherwise.
- Confirm that `https://www.2morrow.land/` performs a 301 redirect to `https://2morrow.land/`.
- Confirm Cloudflare SSL/TLS is active and the Pages origin is served over HTTPS only.
- Review Cloudflare caching so HTML stays fresh while static assets can be cached aggressively.
- Replace the placeholder search-console verification tokens in the homepage heads with the final Google Search Console and Bing Webmaster Tools values.
- After SendFox integration is available, update CSP to allow only the final SendFox form target and any indispensable related origins.
