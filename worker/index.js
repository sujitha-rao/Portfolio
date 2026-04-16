/**
 * Sujitha Portfolio — Cloudflare Worker
 * Handles: /api/chat (Claude AI proxy) and /api/email (email via Resend)
 * Deploy at: https://dash.cloudflare.com → Workers → Create Worker
 * Env vars to set:  ANTHROPIC_API_KEY  and  RESEND_API_KEY
 */

const CORS = {
  'Access-Control-Allow-Origin':  'https://sujitha-rao.github.io',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

export default {
  async fetch(request, env) {
    // Handle CORS preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: CORS });
    }

    const url = new URL(request.url);

    // ── /api/chat → Claude AI proxy ──────────────────────────────
    if (url.pathname === '/api/chat') {
      return handleChat(request, env);
    }

    // ── /api/email → Send email via Resend ───────────────────────
    if (url.pathname === '/api/email') {
      return handleEmail(request, env);
    }

    return new Response('Not found', { status: 404 });
  }
};

// ── Claude AI Chat ────────────────────────────────────────────────
async function handleChat(request, env) {
  try {
    const { messages } = await request.json();

    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type':         'application/json',
        'x-api-key':            env.ANTHROPIC_API_KEY,
        'anthropic-version':    '2023-06-01',
      },
      body: JSON.stringify({
        model:      'claude-haiku-4-5-20251001',
        max_tokens: 250,
        system: `You are Sujitha Suresh Rao's AI portfolio assistant. Be warm, professional, and concise (2-4 sentences max). You represent Sujitha and help visitors learn about her.

Key facts:
- Senior Software Engineer, 9+ years experience
- SAP BTP Certified Solution Architect (2026), PagerDuty DevOps (2026), IBM AI Developer (2025)
- Core skills: Java 8+, Spring Boot, AWS (EKS, Kafka, S3), Kubernetes, SAP BTP, Cloud Foundry, CI/CD
- Currently pursuing Georgia Tech OMSCS (MS CS, part-time, Jan 2026) — open to full-time roles
- Experience: SAP Concur (2022-2024), SAP SuccessFactors/SAP Labs (2020-2022), Unisys (2015-2020)
- Achievements: 2M+ records/hr pipeline, 40% reliability boost, 35% defect reduction
- Location: Atlanta, GA. Email: sujitharao93@gmail.com
- Open to conversations, connections, and new opportunities
- LinkedIn: linkedin.com/in/sujitha-rao

Stay positive. If asked about salary, suggest reaching out directly. If unsure, say you'll make sure Sujitha gets their message.`,
        messages,
      }),
    });

    const data = await res.json();
    const reply = data?.content?.[0]?.text ?? "I'll make sure Sujitha sees your message!";

    return new Response(JSON.stringify({ reply }), {
      headers: { 'Content-Type': 'application/json', ...CORS },
    });
  } catch (e) {
    return new Response(JSON.stringify({ reply: "I'll pass your message to Sujitha directly!" }), {
      headers: { 'Content-Type': 'application/json', ...CORS },
    });
  }
}

// ── Email via Resend ──────────────────────────────────────────────
async function handleEmail(request, env) {
  try {
    const { visitorEmail, transcript } = await request.json();

    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${env.RESEND_API_KEY}`,
        'Content-Type':  'application/json',
      },
      body: JSON.stringify({
        from:    'Portfolio Assistant <onboarding@resend.dev>',
        to:      ['sujitharao93@gmail.com'],
        reply_to: visitorEmail || undefined,
        subject: `Portfolio Chat — Message from ${visitorEmail || 'a visitor'}`,
        text:    `Hi Sujitha,\n\nA visitor chatted with your AI portfolio assistant.\n\nVisitor email: ${visitorEmail || 'Not provided'}\n\n--- Conversation ---\n\n${transcript}\n\nPlease follow up at your earliest convenience!`,
      }),
    });

    const data = await res.json();
    const ok = res.status === 200 || res.status === 201;
    return new Response(JSON.stringify({ ok, id: data.id }), {
      headers: { 'Content-Type': 'application/json', ...CORS },
    });
  } catch (e) {
    return new Response(JSON.stringify({ ok: false, error: e.message }), {
      headers: { 'Content-Type': 'application/json', ...CORS },
    });
  }
}
