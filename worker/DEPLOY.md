# Deploy the Portfolio Worker (10 min, completely free)

## What you get after deploying
- ✅ Universal visit counter shared across ALL browsers/locations
- ✅ Real traffic source tracking (LinkedIn / GitHub / Direct / Other)
- ✅ Real visitor location word cloud (from every unique city)
- ✅ Claude AI-powered chat responses
- ✅ Automatic email delivery (no mailto popup)

---

## Step 1 — Sign up (free)
- **Cloudflare**: https://dash.cloudflare.com (free Workers plan)
- **Resend** (email): https://resend.com (free — 100 emails/day)
- **Anthropic** (optional — for AI chat): https://console.anthropic.com

---

## Step 2 — Create the Worker

1. Go to **Workers & Pages** → **Create** → **Create Worker**
2. Name it `sujitha-portfolio` → click **Deploy**
3. Click **Edit code** → select all → paste the contents of `index.js` → **Deploy**

---

## Step 3 — Create KV Namespace (for universal analytics)

1. In Cloudflare dashboard → **Workers & Pages** → **KV**
2. Click **Create namespace** → name it `ANALYTICS` → **Add**
3. Go back to your Worker → **Settings** → **Bindings** → **Add binding**
4. Choose **KV Namespace** → Variable name: `ANALYTICS` → select the namespace → **Save**

---

## Step 4 — Set Environment Variables

In Worker dashboard → **Settings** → **Variables** → **Environment Variables**:

| Name | Value |
|------|-------|
| `RESEND_API_KEY` | re_... (from resend.com) |
| `ANTHROPIC_API_KEY` | sk-ant-... (optional, for AI chat) |

---

## Step 5 — Update portfolio with your Worker URL

Your worker URL is: `https://sujitha-portfolio.YOUR-SUBDOMAIN.workers.dev`

In `main.js`, find this line near the top and replace the URL:
```js
const WORKER_URL = 'https://sujitha-portfolio.YOUR-SUBDOMAIN.workers.dev';
```

Commit and push — analytics and chat will work universally from any browser.

---

## Notes
- The KV namespace persists data permanently across all visitors globally
- Free tier: 10M KV reads/day, 1M writes/day — more than enough for a portfolio
- `visits` counter starts from 51 (offset applied in the worker)
