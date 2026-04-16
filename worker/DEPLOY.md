# Deploy the Portfolio Worker (5 minutes, free)

## Step 1 — Get free API keys

### A. Anthropic API key (for Claude AI chat)
1. Go to https://console.anthropic.com
2. API Keys → Create Key → copy it

### B. Resend API key (for email sending — free 100 emails/day)
1. Go to https://resend.com → Sign up free
2. API Keys → Create API Key → copy it
   (No domain verification needed for sending to your own email)

---

## Step 2 — Deploy to Cloudflare Workers (free)

1. Go to https://dash.cloudflare.com → sign up free if needed
2. Click **Workers & Pages** → **Create** → **Create Worker**
3. Name it `sujitha-portfolio` → click **Deploy**
4. Click **Edit code**, paste the contents of `index.js`
5. Click **Deploy**

---

## Step 3 — Set Environment Variables

In the Worker dashboard → **Settings** → **Variables** → **Environment Variables**:

| Variable name       | Value                    |
|---------------------|--------------------------|
| `ANTHROPIC_API_KEY` | sk-ant-... (your key)    |
| `RESEND_API_KEY`    | re_... (your Resend key) |

Click **Save and Deploy**

---

## Step 4 — Update portfolio with your Worker URL

Your worker URL will be:
`https://sujitha-portfolio.YOUR-USERNAME.workers.dev`

Replace `WORKER_URL` in main.js with that URL.

---

## That's it! 
- Chat messages → intelligently answered by Claude Haiku
- User emails → delivered instantly to sujitharao93@gmail.com via Resend
