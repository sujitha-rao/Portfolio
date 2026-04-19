/**
 * Sujitha Portfolio — Cloudflare Worker
 * Handles:
 *   POST /api/chat   → Claude AI (needs ANTHROPIC_API_KEY env var)
 *   POST /api/email  → Resend email (needs RESEND_API_KEY env var)
 *   POST /api/analytics/hit  → Increment counters in KV
 *   GET  /api/analytics/get  → Read all analytics from KV
 *
 * KV Namespace: bind a KV namespace called ANALYTICS in the Worker settings.
 * Deploy guide: see worker/DEPLOY.md
 */

const ALLOWED_ORIGIN = 'https://sujitha-rao.github.io';

const CORS = {
  'Access-Control-Allow-Origin':  ALLOWED_ORIGIN,
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

function corsResponse(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json', ...CORS },
  });
}

export default {
  async fetch(request, env) {
    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: CORS });
    }

    const url = new URL(request.url);

    if (url.pathname === '/api/chat')            return handleChat(request, env);
    if (url.pathname === '/api/email')           return handleEmail(request, env);
    if (url.pathname === '/api/analytics/hit')   return handleAnalyticsHit(request, env);
    if (url.pathname === '/api/analytics/get')   return handleAnalyticsGet(request, env);

    return new Response('Not found', { status: 404, headers: CORS });
  }
};

// ── KV Analytics ─────────────────────────────────────────────────
// Keys stored in KV:
//   visits        → total visit count (integer string)
//   src:linkedin  → visits from LinkedIn
//   src:github    → visits from GitHub
//   src:direct    → visits from direct/typed URL
//   src:other     → visits from other referrers
//   city:Atlanta  → visits from Atlanta
//   cities        → JSON array of city names seen

async function kvInc(kv, key, by = 1) {
  const val = parseInt(await kv.get(key) || '0') + by;
  await kv.put(key, String(val));
  return val;
}

async function handleAnalyticsHit(request, env) {
  if (!env.ANALYTICS) return corsResponse({ error: 'KV not bound' }, 500);

  const { source, city, country, region } = await request.json().catch(() => ({}));

  // Increment total visits
  const total = await kvInc(env.ANALYTICS, 'visits');

  // Increment source counter
  const src = ['linkedin','github','direct','other'].includes(source) ? source : 'other';
  await kvInc(env.ANALYTICS, 'src:' + src);

  // Track city
  if (city) {
    await kvInc(env.ANALYTICS, 'city:' + city);
    // Maintain ordered city list (JSON array)
    const raw = await env.ANALYTICS.get('cities');
    const cities = raw ? JSON.parse(raw) : [];
    if (!cities.includes(city)) { cities.unshift(city); }
    await env.ANALYTICS.put('cities', JSON.stringify(cities.slice(0, 50)));
  }

  return corsResponse({ ok: true, visits: total });
}

async function handleAnalyticsGet(request, env) {
  if (!env.ANALYTICS) {
    // Return dummy data so the UI still shows something during setup
    return corsResponse({
      visits: 51, sources: {}, cities: [], cityCounts: {}
    });
  }

  const [visits, li, gh, di, ot, citiesRaw] = await Promise.all([
    env.ANALYTICS.get('visits'),
    env.ANALYTICS.get('src:linkedin'),
    env.ANALYTICS.get('src:github'),
    env.ANALYTICS.get('src:direct'),
    env.ANALYTICS.get('src:other'),
    env.ANALYTICS.get('cities'),
  ]);

  const cities = citiesRaw ? JSON.parse(citiesRaw) : [];
  const cityCounts = {};
  if (cities.length) {
    const counts = await Promise.all(
      cities.map(c => env.ANALYTICS.get('city:' + c).then(v => [c, parseInt(v||'0')]))
    );
    counts.forEach(([c, n]) => { cityCounts[c] = n; });
  }

  return corsResponse({
    visits:     Math.max(parseInt(visits || '0') + 50, 51), // offset so it starts at 51
    sources: {
      linkedin: parseInt(li || '0'),
      github:   parseInt(gh || '0'),
      direct:   parseInt(di || '0'),
      other:    parseInt(ot || '0'),
    },
    cities,
    cityCounts,
  });
}

// ── Claude AI Chat ────────────────────────────────────────────────
async function handleChat(request, env) {
  try {
    const { messages } = await request.json();
    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 250,
        system: `You are Sujitha Suresh Rao's AI portfolio assistant. Be warm, concise (2-4 sentences).
Key facts: 9+ years Senior Software Engineer. SAP BTP Certified Architect (2026). Java/Spring Boot, AWS EKS/Kafka, Kubernetes expert. Georgia Tech OMSCS part-time (Jan 2026). SAP Concur, SAP Labs, Unisys experience. Atlanta GA. sujitharao93@gmail.com. Open to new opportunities.`,
        messages,
      }),
    });
    const data = await res.json();
    return corsResponse({ reply: data?.content?.[0]?.text || "I'll make sure Sujitha sees your message!" });
  } catch(e) {
    return corsResponse({ reply: "I'll pass your message to Sujitha directly!" });
  }
}

// ── Email via Resend ──────────────────────────────────────────────
async function handleEmail(request, env) {
  try {
    const { visitorEmail, transcript } = await request.json();
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${env.RESEND_API_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from:     'Portfolio <onboarding@resend.dev>',
        to:       ['sujitharao93@gmail.com'],
        reply_to: visitorEmail || undefined,
        subject:  `Portfolio Chat — from ${visitorEmail || 'a visitor'}`,
        text:     `Visitor: ${visitorEmail||'not provided'}\n\n${transcript}`,
      }),
    });
    return corsResponse({ ok: res.ok });
  } catch(e) {
    return corsResponse({ ok: false });
  }
}
