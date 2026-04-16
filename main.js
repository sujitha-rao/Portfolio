// ═══════════════════════════════════════════
// EARLY LOADER DISMISSAL (inline-safe)
// ═══════════════════════════════════════════
function hideLoader() {
  const loader = document.getElementById('loader');
  if (loader) loader.classList.add('hidden');
}
window.addEventListener('load', function() { setTimeout(hideLoader, 300); });
setTimeout(hideLoader, 3500);

// ═══════════════════════════════════════════
// LOADER
// ═══════════════════════════════════════════
function hideLoader() {
  const l = document.getElementById('loader');
  if (l) l.classList.add('hidden');
}
window.addEventListener('load', () => setTimeout(hideLoader, 1800));
setTimeout(hideLoader, 3500);

// ═══════════════════════════════════════════
// MOVING BACKGROUND — Corporate data-flow animation
// Binary code, data nodes, circuit traces, floating tech icons
// ═══════════════════════════════════════════
(function() {
  const canvas = document.getElementById('bg-canvas');
  const ctx    = canvas.getContext('2d');
  let W, H;
  const mouse = { x: -999, y: -999 };

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', () => { resize(); initAll(); });
  document.addEventListener('mousemove', e => { mouse.x = e.clientX; mouse.y = e.clientY; });

  const TEAL    = '#0f766e';
  const TEAL2   = '#14b8a6';
  const TEALLT  = '#ccfbf1';

  // ── 1. Floating data nodes (circles with labels) ──────────────
  const NODE_LABELS = ['Java','AWS','K8s','SAP BTP','CI/CD','REST','OAuth','Spring','Kafka','Docker','Git','EKS'];
  let nodes = [];
  function initNodes() {
    nodes = Array.from({length: 14}, (_, i) => ({
      x: 60 + Math.random() * (W - 120),
      y: 60 + Math.random() * (H - 120),
      r: 20 + Math.random() * 16,
      vx: (Math.random() - .5) * .35,
      vy: (Math.random() - .5) * .35,
      label: NODE_LABELS[i % NODE_LABELS.length],
      alpha: .22 + Math.random() * .18,
      pulse: Math.random() * Math.PI * 2,
    }));
  }

  // ── 2. Circuit trace lines (animated dashes travelling along paths) ─
  let traces = [];
  function initTraces() {
    traces = Array.from({length: 10}, () => {
      const x1 = Math.random() * W, y1 = Math.random() * H;
      const ang = Math.floor(Math.random() * 4) * Math.PI/2 + (Math.random()-.5)*.4;
      const len = 80 + Math.random() * 180;
      return {
        x1, y1,
        x2: x1 + Math.cos(ang)*len,
        y2: y1 + Math.sin(ang)*len,
        progress: Math.random(),
        speed: .003 + Math.random() * .005,
        alpha: .18 + Math.random() * .15,
      };
    });
  }

  // ── 3. Binary code columns (rain-style) ───────────────────────
  const COLS = Math.floor(W / 28);
  let drops = [];
  function initDrops() {
    const cols = Math.floor(W / 28);
    drops = Array.from({length: cols}, () => ({
      x: Math.random() * W,
      y: -Math.random() * H,
      speed: .3 + Math.random() * .5,
      chars: '01·×+SAP AWS Java K8s',
      alpha: .14 + Math.random() * .12,
    }));
  }

  // ── 4. Floating hexagons (corporate grid feel) ─────────────────
  let hexes = [];
  function initHexes() {
    hexes = Array.from({length: 8}, () => ({
      x: Math.random() * W,
      y: Math.random() * H,
      r: 18 + Math.random() * 30,
      vx: (Math.random()-.5) * .18,
      vy: (Math.random()-.5) * .18,
      angle: Math.random() * Math.PI,
      va: (Math.random()-.5) * .005,
      alpha: .12 + Math.random() * .13,
    }));
  }

  function initAll() { initNodes(); initTraces(); initDrops(); initHexes(); }
  initAll();

  function drawHex(x, y, r, angle) {
    ctx.beginPath();
    for (let i = 0; i < 6; i++) {
      const a = angle + (i / 6) * Math.PI * 2;
      i === 0 ? ctx.moveTo(x + Math.cos(a)*r, y + Math.sin(a)*r)
              : ctx.lineTo(x + Math.cos(a)*r, y + Math.sin(a)*r);
    }
    ctx.closePath();
  }

  let frame = 0;

  function draw() {
    ctx.clearRect(0, 0, W, H);
    frame++;

    // ── Background gradient ──
    const bg = ctx.createLinearGradient(0, 0, W, H);
    bg.addColorStop(0,   'rgba(15,118,110,0.04)');
    bg.addColorStop(.5,  'rgba(204,251,241,0.025)');
    bg.addColorStop(1,   'rgba(10,92,86,0.03)');
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, W, H);

    // ── Binary rain columns ──
    ctx.font = '11px "DM Mono", monospace';
    ctx.fillStyle = TEAL;
    for (const d of drops) {
      const chars = d.chars.split('');
      ctx.globalAlpha = d.alpha * 2.5;
      const ch = chars[Math.floor(frame*.1 + d.y * .05) % chars.length];
      ctx.fillText(ch, d.x, d.y);
      d.y += d.speed;
      if (d.y > H + 20) d.y = -20;
    }
    ctx.globalAlpha = 1;

    // ── Hexagons ──
    for (const h of hexes) {
      h.x += h.vx; h.y += h.vy; h.angle += h.va;
      if (h.x < -h.r*2) h.x = W + h.r;
      if (h.x > W + h.r*2) h.x = -h.r;
      if (h.y < -h.r*2) h.y = H + h.r;
      if (h.y > H + h.r*2) h.y = -h.r;
      drawHex(h.x, h.y, h.r, h.angle);
      ctx.strokeStyle = TEAL;
      ctx.lineWidth = .8;
      ctx.globalAlpha = h.alpha;
      ctx.stroke();
      // Inner ring
      drawHex(h.x, h.y, h.r * .5, h.angle + .3);
      ctx.globalAlpha = h.alpha * .5;
      ctx.stroke();
    }
    ctx.globalAlpha = 1;

    // ── Circuit traces (animated dot travelling along line) ──
    for (const t of traces) {
      t.progress += t.speed;
      if (t.progress > 1) t.progress = 0;
      const px = t.x1 + (t.x2 - t.x1) * t.progress;
      const py = t.y1 + (t.y2 - t.y1) * t.progress;

      // Static line
      ctx.beginPath();
      ctx.moveTo(t.x1, t.y1);
      ctx.lineTo(t.x2, t.y2);
      ctx.strokeStyle = TEAL;
      ctx.lineWidth = .5;
      ctx.globalAlpha = t.alpha * .6;
      ctx.setLineDash([4, 8]);
      ctx.stroke();
      ctx.setLineDash([]);

      // Travelling pulse dot
      ctx.beginPath();
      ctx.arc(px, py, 2.5, 0, Math.PI*2);
      ctx.fillStyle = TEAL2;
      ctx.globalAlpha = Math.min(1, t.alpha * 3.5);
      ctx.fill();

      // Corner joints
      ctx.beginPath();
      ctx.arc(t.x1, t.y1, 3, 0, Math.PI*2);
      ctx.fillStyle = TEAL;
      ctx.globalAlpha = t.alpha * 2;
      ctx.fill();
      ctx.beginPath();
      ctx.arc(t.x2, t.y2, 3, 0, Math.PI*2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;

    // ── Data nodes — connect closest ones ──
    const CONNECTION_DIST = 180;
    for (let i = 0; i < nodes.length; i++) {
      const a = nodes[i];
      for (let j = i+1; j < nodes.length; j++) {
        const b = nodes[j];
        const dx = a.x - b.x, dy = a.y - b.y;
        const dist = Math.sqrt(dx*dx + dy*dy);
        if (dist < CONNECTION_DIST) {
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.strokeStyle = TEAL;
          ctx.lineWidth = .7;
          ctx.globalAlpha = .2 * (1 - dist/CONNECTION_DIST);
          ctx.stroke();
        }
      }
    }

    for (const n of nodes) {
      n.x += n.vx; n.y += n.vy;
      n.pulse += .025;
      // Bounce off walls
      if (n.x < n.r)   { n.x = n.r;   n.vx *= -1; }
      if (n.x > W-n.r) { n.x = W-n.r; n.vx *= -1; }
      if (n.y < n.r)   { n.y = n.r;   n.vy *= -1; }
      if (n.y > H-n.r) { n.y = H-n.r; n.vy *= -1; }

      // Mouse repel
      const mdx = n.x - mouse.x, mdy = n.y - mouse.y;
      const md = Math.sqrt(mdx*mdx + mdy*mdy);
      if (md < 120) { n.vx += mdx*.001; n.vy += mdy*.001; }

      // Speed cap
      const spd = Math.sqrt(n.vx*n.vx + n.vy*n.vy);
      if (spd > .6) { n.vx *= .95; n.vy *= .95; }

      // Pulsing circle
      const pulse = .85 + Math.sin(n.pulse) * .15;
      const rr = n.r * pulse;

      // Outer ring
      ctx.beginPath();
      ctx.arc(n.x, n.y, rr, 0, Math.PI*2);
      ctx.strokeStyle = TEAL;
      ctx.lineWidth = .8;
      ctx.globalAlpha = n.alpha * .8;
      ctx.stroke();

      // Fill circle
      ctx.beginPath();
      ctx.arc(n.x, n.y, rr * .7, 0, Math.PI*2);
      const nodeGrad = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, rr*.7);
      nodeGrad.addColorStop(0, TEALLT + '30');
      nodeGrad.addColorStop(1, TEAL + '10');
      ctx.fillStyle = nodeGrad;
      ctx.globalAlpha = n.alpha;
      ctx.fill();

      // Label
      ctx.fillStyle = TEAL;
      ctx.font = `bold 9px "DM Mono", monospace`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.globalAlpha = Math.min(1, n.alpha * 2.2);
      ctx.fillText(n.label, n.x, n.y);
    }
    ctx.globalAlpha = 1;
    ctx.textAlign = 'left';
    ctx.textBaseline = 'alphabetic';

    requestAnimationFrame(draw);
  }
  draw();
})();


// ═══════════════════════════════════════════
// CURSOR — teal dot + ring, desktop only
// ═══════════════════════════════════════════
(function() {
  const cur  = document.getElementById('cursor');
  const ring = document.getElementById('cursorRing');
  if (!cur || !ring) return;

  let mx = -999, my = -999, rx = -999, ry = -999;

  document.addEventListener('mousemove', e => {
    mx = e.clientX; my = e.clientY;
    cur.style.left = mx + 'px';
    cur.style.top  = my + 'px';
  }, { passive: true });

  (function tick() {
    rx += (mx - rx) * 0.13;
    ry += (my - ry) * 0.13;
    ring.style.left = rx + 'px';
    ring.style.top  = ry + 'px';
    requestAnimationFrame(tick);
  })();

  document.addEventListener('mousedown', () => document.body.classList.add('clicking'));
  document.addEventListener('mouseup',   () => document.body.classList.remove('clicking'));

  function bindHovers() {
    document.querySelectorAll(
      'a, button, [onclick], .skill-pill, .cert-badge, .project-card, ' +
      '.postit, .stat-card, .social-chip, .mpi-card, .sv-card, .photo-wrap, .testimonial-card'
    ).forEach(el => {
      if (el.dataset.ch) return;
      el.dataset.ch = '1';
      el.addEventListener('mouseenter', () => { cur.classList.add('hover'); ring.classList.add('hover'); });
      el.addEventListener('mouseleave', () => { cur.classList.remove('hover'); ring.classList.remove('hover'); });
    });
  }
  bindHovers();
  setInterval(bindHovers, 3000);
})();


// ═══════════════════════════════════════════
// NAV
// ═══════════════════════════════════════════
window.addEventListener('scroll', () => document.getElementById('nav').classList.toggle('scrolled', scrollY > 60));

// ═══════════════════════════════════════════
// TYPEWRITER
// ═══════════════════════════════════════════
const roles = ['Senior Software Engineer','SAP BTP Solution Architect','Cloud-Native Systems Builder','Java & Spring Boot Expert','DevOps Practitioner','Georgia Tech MS Student'];
let ri=0, ci=0, del=false;
const tel = document.getElementById('typed-text');
function type() {
  const w = roles[ri];
  if (!del) { tel.textContent = w.slice(0, ++ci); if (ci === w.length) { del = true; setTimeout(type, 2200); return; } }
  else { tel.textContent = w.slice(0, --ci); if (ci === 0) { del = false; ri = (ri + 1) % roles.length; } }
  setTimeout(type, del ? 40 : 78);
}
setTimeout(type, 2500);

// ═══════════════════════════════════════════
// INTERSECTION OBSERVER
// ═══════════════════════════════════════════
const obs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (!e.isIntersecting) return;
    e.target.classList.add('visible');
    e.target.querySelectorAll('[data-target]').forEach(el => animCount(el, +el.dataset.target));
    e.target.querySelectorAll('.skill-pills').forEach((row, ri) => {
      Array.from(row.children).forEach((pill, i) => {
        setTimeout(() => pill.classList.add('anim'), ri * 80 + i * 50);
      });
    });
  });
}, { threshold: 0.07 });

document.querySelectorAll('.reveal,.reveal-left,.reveal-right,.reveal-scale,.timeline-item').forEach(el => obs.observe(el));
const sb = document.querySelector('.stats-band .reveal') || document.querySelector('.stats-band');
if (sb) obs.observe(sb);

// Safety fallback: ensure all reveal elements show after 4s
setTimeout(() => {
  document.querySelectorAll('.reveal,.reveal-left,.reveal-right,.reveal-scale,.timeline-item').forEach(el => {
    el.classList.add('visible');
    el.querySelectorAll('[data-target]').forEach(el2 => { if (!el2.dataset.counted) { el2.dataset.counted='1'; animCount(el2, +el2.dataset.target); } });
    el.querySelectorAll('.skill-pills').forEach((row,ri) => {
      Array.from(row.children).forEach((pill,i) => setTimeout(() => pill.classList.add('anim'), ri*60+i*40));
    });
  });
}, 4000);

function animCount(el, target) {
  let v = 0; const step = Math.max(1, Math.ceil(target / 45));
  const t = setInterval(() => { v = Math.min(v + step, target); el.textContent = v; if (v >= target) clearInterval(t); }, 30);
}

// ═══════════════════════════════════════════
// POST-IT CLICK-REVEAL (click photo)
// ═══════════════════════════════════════════
let piIdx = 0; const totalPi = 6;
const piOrder = [0, 1, 2, 3, 4, 5];

function playChalk() {
  try {
    const C = window.AudioContext || window.webkitAudioContext;
    if (!C) return;
    const ctx = new C(), dur = 0.24;
    const buf = ctx.createBuffer(1, ctx.sampleRate * dur, ctx.sampleRate);
    const d = buf.getChannelData(0);
    for (let i = 0; i < d.length; i++) {
      const t = i / ctx.sampleRate;
      const env = Math.exp(-t * 10) * (1 - Math.exp(-t * 80));
      d[i] = ((Math.random() * 2 - 1) * 0.8 + Math.sin(2 * Math.PI * 1600 * t) * 0.1) * env * 0.5;
    }
    const src = ctx.createBufferSource(); src.buffer = buf;
    const hpf = ctx.createBiquadFilter(); hpf.type = 'highpass'; hpf.frequency.value = 900;
    const g = ctx.createGain(); g.gain.setValueAtTime(0.6, ctx.currentTime); g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + dur);
    src.connect(hpf); hpf.connect(g); g.connect(ctx.destination); src.start();
    setTimeout(() => { try { ctx.close(); } catch(e) {} }, 700);
  } catch(e) {}
}

function spawnStars(el) {
  const r = el.getBoundingClientRect(), cx = r.left + r.width / 2, cy = r.top + r.height / 2;
  '✨⭐💫🌟✦'.split('').forEach((em, i) => {
    const s = document.createElement('div');
    const angle = Math.random() * Math.PI * 2, dist = 50 + Math.random() * 60;
    s.style.cssText = `position:fixed;left:${cx}px;top:${cy}px;font-size:${13+Math.random()*10}px;pointer-events:none;z-index:99999;--dx:${Math.cos(angle)*dist}px;--dy:${Math.sin(angle)*dist}px;animation:spark-fly .85s ease-out ${i*35}ms forwards;`;
    s.textContent = em;
    document.body.appendChild(s);
    setTimeout(() => s.remove(), 950);
  });
}

function revealNextPostit() {
  // On mobile: toggle the carousel into view
  if (window.matchMedia('(max-width:960px)').matches) {
    const mpi = document.getElementById('mobile-pi-carousel');
    const hint = document.getElementById('photoHint');
    if (mpi) {
      mpi.classList.add('pi-revealed');
      if (hint) hint.innerHTML = '&#9660; Scroll down for highlights';
    }
    return;
  }
  
  if (piIdx >= totalPi) return;
  const pi = document.getElementById('pi' + piOrder[piIdx]);
  if (pi) {
    playChalk();
    pi.classList.add('revealed');
    spawnStars(pi);
    piIdx++;
    // Update hint text
    const hint = document.querySelector('.photo-hint');
    if (piIdx >= totalPi) {
      hint.innerHTML = '&#10003; All revealed! Click "read +" on each note.';
    } else {
      hint.innerHTML = `<span class="photo-hint-arrow">&#128070;</span> ${totalPi - piIdx} more to reveal`;
    }
  }
}

// ═══════════════════════════════════════════
// POST-IT FLIP (front/back)
// ═══════════════════════════════════════════
function flipPostit(idx, event) {
  event.stopPropagation();
  const pi = document.getElementById('pi' + idx);
  if (pi) pi.classList.toggle('flipped');
}

// ═══════════════════════════════════════════
// CHATBOX — Claude AI powered assistant
// ═══════════════════════════════════════════
let chatOpen = false;
let chatHistory = [];
let userEmail = null;
let awaitingEmail = false;
let emailSentThisSession = false;

// System prompt for Claude
const SYSTEM_PROMPT = `You are Sujitha Suresh Rao's AI portfolio assistant. Be warm, professional, and concise (2-4 sentences max per reply). You represent Sujitha and help visitors learn about her.

Key facts:
- Senior Software Engineer, 9+ years experience
- SAP BTP Certified Solution Architect
- Expert: Java 8+, Spring Boot, AWS (EKS, Kafka, S3), Kubernetes, SAP BTP, Cloud Foundry, CI/CD
- Currently: Georgia Tech OMSCS (MS CS, part-time, Jan 2026)
- Experience: SAP Concur (2022-2024), SAP SuccessFactors/SAP Labs (2020-2022), Unisys (2015-2020)
- Achievements: 2M+ records/hr pipeline, 40% reliability boost, 35% defect reduction
- Certifications: SAP BTP Architect (2026), PagerDuty DevOps (2026), IBM AI Developer (2025)
- Location: Atlanta, GA. Email: sujitharao93@gmail.com
- Open to conversations, connections, and new opportunities
- LinkedIn: linkedin.com/in/sujitha-rao

If someone asks about something you don't know, say you'll make sure Sujitha gets their message. Always stay positive about Sujitha. If asked about salary/compensation, suggest reaching out directly.`;

// ── Smart Knowledge Base (no API key needed) ─────────────────
const KB_ANSWERS = {
  'experience|years|background|career':
    "Sujitha has 9+ years of enterprise software engineering experience across SAP Concur (2022-2024), SAP SuccessFactors/SAP Labs (2020-2022), and Unisys (2015-2020). She's a certified SAP BTP Solution Architect based in Atlanta, GA.",
  'sap|btp|concur|successfactors|hcm|odata|s4|hana':
    "SAP is Sujitha's deep expertise — SAP BTP, Concur, SuccessFactors HCM, S/4HANA, Cloud Foundry, Integration Suite, API Management. She's a certified SAP BTP Solution Architect (2026) and has delivered solutions for Fortune 500 companies.",
  'java|spring|backend|microservice|api':
    "Java is Sujitha's primary language — Java 8+ with Spring Boot, JUnit, Mockito, REST APIs, and microservices. She has 9+ years of enterprise Java development building scalable, production-grade systems.",
  'aws|cloud|kubernetes|eks|kafka|docker':
    "Sujitha built a 2M+ records/hour data pipeline on AWS (EKS, Kafka, S3) at SAP Concur with a 40% reliability improvement. She's expert in Kubernetes, Docker, CI/CD, Helm, and cloud-native architecture.",
  'certification|certified|credly':
    "Sujitha holds 4 certifications: SAP BTP Solution Architect (2026), DevOps Professional from PagerDuty (2026), IBM Certified AI Developer (2025), and Gen AI for Software Dev from DeepLearning.AI (2025). Verify at credly.com/users/sujitha-suresh-rao.",
  'georgia tech|omscs|ms|masters|education':
    "Sujitha is pursuing her MS in Computer Science at Georgia Tech (OMSCS, part-time, started Jan 2026) — one of the top CS programs globally. She completed her B.Tech in CSE with 3.9/4.0 GPA from Model Engineering College, India.",
  'devops|ci|cd|jenkins|github actions|terraform|helm':
    "Sujitha is experienced in CI/CD pipelines (Jenkins, GitHub Actions), Terraform, Helm, CloudFormation, AWS CodeBuild, and Artifactory. She's PagerDuty DevOps certified (2026) and champions automated testing cultures.",
  'ai|machine learning|ml|artificial intelligence|ibm':
    "Sujitha holds an IBM Certified AI Developer (2025) and Gen AI for Software Development certification from DeepLearning.AI (2025). She's exploring AI/ML applications in her Georgia Tech OMSCS program.",
  'available|hire|job|role|opportunity|position|open|recruit':
    "Sujitha is open to conversations about senior Software Engineering roles, especially in Java, cloud-native, and SAP ecosystem areas. She's based in Atlanta, GA and pursuing her Georgia Tech MS part-time — fully available for full-time positions. Reach her at sujitharao93@gmail.com or via LinkedIn.",
  'salary|compensation|rate|pay':
    "For compensation discussions, I'd suggest reaching out directly to Sujitha at sujitharao93@gmail.com — she'll be happy to discuss. Want me to forward your message to her?",
  'contact|email|reach|connect|linkedin':
    "You can reach Sujitha at sujitharao93@gmail.com or on LinkedIn at linkedin.com/in/sujitha-rao. I can also forward your message directly — just share your email! 📧",
  'project|pipeline|data|achievements':
    "Key achievements: (1) Built a 2M+ records/hr data pipeline on AWS+Kafka+EKS at SAP Concur with 40% reliability boost. (2) Reduced production defects by 35% through automated testing at Unisys. (3) Delivered SuccessFactors HCM modules for global enterprise clients at SAP Labs.",
  'location|atlanta|georgia|remote|relocation':
    "Sujitha is based in Atlanta, Georgia. She's open to discussions about both local and remote opportunities.",
  'collaborate|freelance|consult|side project':
    "Sujitha is open to interesting engineering collaborations! Share more about your project and I'll forward it to her with your contact details.",
};

function callClaude(userMessage) {
  const lower = userMessage.toLowerCase();
  for (const [pattern, answer] of Object.entries(KB_ANSWERS)) {
    if (pattern.split('|').some(kw => lower.includes(kw))) {
      return Promise.resolve(answer);
    }
  }
  // Generic friendly response
  const generic = [
    "That's a great question! I'll make sure Sujitha sees your message and gets back to you. Could you share your email so she can follow up directly? 📧",
    "I want to make sure Sujitha hears this personally! Share your email and I'll forward your message to her right away. 📬",
    "Great to hear from you! I may not have all the details on that, but Sujitha definitely will. Drop your email and she'll be in touch! 🙌",
  ];
  return Promise.resolve(generic[Math.floor(Math.random() * generic.length)]);
}



function toggleChat() {
  chatOpen = !chatOpen;
  const box = document.getElementById('chatbox');
  const trigger = document.getElementById('chatTrigger');
  if (box) box.classList.toggle('open', chatOpen);
  if (trigger) trigger.classList.toggle('open', chatOpen);
  const badge = document.getElementById('chatBadge');
  if (chatOpen && badge) badge.style.display = 'none';
  if (chatOpen) { const inp = document.getElementById('chatInput'); if (inp) inp.focus(); }
}

function appendMessage(text, cls) {
  const body = document.getElementById('chatBody');
  if (!body) return;
  const div = document.createElement('div');
  div.className = 'chat-bubble ' + cls;
  div.innerHTML = text;
  body.appendChild(div);
  body.scrollTop = body.scrollHeight;
}

function showTyping() {
  const body = document.getElementById('chatBody');
  if (!body) return;
  const t = document.createElement('div');
  t.className = 'chat-bubble typing'; t.id = 'typingIndicator';
  t.innerHTML = '<div class="typing-dots"><span></span><span></span><span></span></div>';
  body.appendChild(t);
  body.scrollTop = body.scrollHeight;
}
function removeTyping() { const t = document.getElementById('typingIndicator'); if(t) t.remove(); }

async function sendChatMessage() {
  const input = document.getElementById('chatInput');
  const msg = input.value.trim();
  if (!msg) return;
  input.value = '';
  document.getElementById('quickBtns').style.display = 'none';
  appendMessage(msg, 'from-me');
  chatHistory.push({ role: 'user', content: msg });

  // Email collection step
  if (awaitingEmail) {
    const emailMatch = msg.match(/[\w.+\-]+@[\w\-]+\.[a-z]{2,}/i);
    if (emailMatch) {
      userEmail = emailMatch[0];
      awaitingEmail = false;
      showTyping();
      setTimeout(async () => {
        removeTyping();
        appendMessage(`Got it — <strong>${userEmail}</strong>. Sending your conversation to Sujitha now... ⏳`, 'from-sujitha');
        const ok = await doSendEmail();
        setTimeout(() => {
          appendMessage(ok
            ? '✅ Done! Sujitha will be in touch with you shortly.'
            : '✅ Message noted! Sujitha will follow up at sujitharao93@gmail.com.', 'from-sujitha');
        }, 800);
      }, 800);
    } else {
      showTyping();
      setTimeout(() => { removeTyping(); appendMessage('Please enter a valid email address so I can CC you on the message to Sujitha. 📧', 'from-sujitha'); }, 700);
    }
    return;
  }

  // Get Claude AI response
  showTyping();
  const aiReply = await callClaude(msg);
  removeTyping();

  if (aiReply) {
    appendMessage(aiReply, 'from-sujitha');
    chatHistory.push({ role: 'bot', content: aiReply });
    if (!emailSentThisSession) {
      setTimeout(() => {
        appendMessage("Want me to make sure Sujitha sees this conversation? Share your email and I'll forward it to her! 📬", 'from-sujitha');
        awaitingEmail = true;
      }, 1200);
    }
  } else {
    appendMessage("Great question! I'll make sure Sujitha gets your message. Could you share your email so she can follow up directly? 📧", 'from-sujitha');
    awaitingEmail = true;
  }
}

async function doSendEmail() {
  const transcript = chatHistory
    .map(m => (m.role === 'user' ? 'Visitor: ' : 'Sujitha AI: ') + m.content)
    .join('\n\n');

  // Web3Forms — free, no domain restriction, no credit card
  // Get your free access key at https://web3forms.com (just enter email)
  const WEB3FORMS_KEY = '2ae25753-067a-4ced-9f16-d72985b4a4ac'; 

  try {
    const res = await fetch('https://api.web3forms.com/submit', {
      method:  'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify({
        access_key:  WEB3FORMS_KEY,
        subject:     'Portfolio Chat — Message for Sujitha',
        from_name:   'Sujitha Portfolio Bot',
        email:       userEmail || 'visitor@unknown.com',
        replyto:     userEmail || 'sujitharao93@gmail.com',
        message:     'Visitor email: ' + (userEmail || 'not provided') +
                     '\n\n--- Chat Transcript ---\n\n' + transcript,
      }),
    });
    const d = await res.json();
    if (d.success) { emailSentThisSession = true; return true; }
  } catch(e) {}

  // Hard fallback — open mail client
  const body = encodeURIComponent(
    'Hi Sujitha,\n\nA visitor reached out via your portfolio.\n\n' +
    'Visitor email: ' + (userEmail || 'not provided') + '\n\n' + transcript
  );
  window.location.href = 'mailto:sujitharao93@gmail.com?subject=Portfolio+Chat&body=' + body;
  emailSentThisSession = true;
  return true;
}

function sendQuick(msg) {
  document.getElementById('quickBtns').style.display = 'none';
  appendMessage(msg, 'from-me');
  chatHistory.push({ role: 'user', content: msg });
  showTyping();
  callClaude(msg).then(reply => {
    removeTyping();
    const r = reply || "Thanks for reaching out! I'll make sure Sujitha hears about this. Could you share your email so she can follow up? 📧";
    appendMessage(r, 'from-sujitha');
    chatHistory.push({ role: 'bot', content: r });
    if (!emailSentThisSession) {
      setTimeout(() => { appendMessage("Share your email and I'll forward this to Sujitha! 📬", 'from-sujitha'); awaitingEmail = true; }, 1000);
    }
  });
}

// Show badge after 5s
setTimeout(() => { const b = document.getElementById('chatBadge'); if(b && !chatOpen) b.style.display = 'block'; }, 5000);


// ═══════════════════════════════════════════
// TESTIMONIAL FORM
// ═══════════════════════════════════════════
function submitTestimonial(e) {
  e.preventDefault();
  const name = document.getElementById('tName').value.trim();
  const role = document.getElementById('tRole').value.trim();
  const msg = document.getElementById('tMsg').value.trim();
  const rating = parseInt(document.getElementById('tRating').value);

  // Add card dynamically
  const stars = '★'.repeat(rating);
  const initials = name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
  const card = document.createElement('div');
  card.className = 'testimonial-card';
  card.style.animation = 'pi-pop .5s cubic-bezier(0.34,1.56,0.64,1) forwards';
  card.innerHTML = `<div class="testimonial-stars">${stars.split('').map(s=>'&#9733;').join('')}</div><div class="testimonial-text">"${msg}"</div><div class="testimonial-author"><div class="testimonial-avatar">${initials}</div><div><div class="testimonial-name">${name}</div><div class="testimonial-role">${role}</div></div></div>`;
  document.getElementById('testimonialsGrid').appendChild(card);

  // Send via email
  window.location.href = 'mailto:sujitharao93@gmail.com?subject=New Testimonial from ' + encodeURIComponent(name) + '&body=' + encodeURIComponent(`Name: ${name}
Role: ${role}
Rating: ${rating}/5

Message:
${msg}`);

  document.getElementById('testimonialSuccess').classList.add('show');
  document.getElementById('testimonialForm').reset();
  setTimeout(() => document.getElementById('testimonialSuccess').classList.remove('show'), 6000);
}

// ═══════════════════════════════════════════
// PORTFOLIO COLLECTIVE ANALYTICS
// CountAPI for persistent counters + ipinfo for location
// ═══════════════════════════════════════════
(function() {
  const NS = 'ssr-portfolio-v3';

  // Source keys
  const SRC_KEYS = {
    linkedin: NS+'/src-linkedin',
    github:   NS+'/src-github',
    direct:   NS+'/src-direct',
    other:    NS+'/src-other',
  };
  // Location word-cloud: top cities tracked
  const CITY_KEYS = ['Atlanta','San Francisco','New York','Seattle','London','Bangalore','Mumbai','Sydney','Toronto','Berlin','Chicago','Austin'];

  function getSource() {
    const r = document.referrer||'';
    if(/linkedin/i.test(r)) return 'linkedin';
    if(/github/i.test(r))   return 'github';
    if(r==='')               return 'direct';
    return 'other';
  }
  const source = getSource();

  async function hitCount(key) {
    try { const r=await fetch(`https://api.countapi.xyz/hit/${key}`); return (await r.json()).value||0; } catch(e){return 0;}
  }
  async function getCount(key) {
    try { const r=await fetch(`https://api.countapi.xyz/get/${key}`); return (await r.json()).value||0; } catch(e){return 0;}
  }
  async function getLocation() {
    try { const r=await fetch('https://ipinfo.io/json'); return await r.json(); } catch(e){return null;}
  }

  // Animated counter
  function countUp(el, target, dur) {
    if(!el||!target) return;
    const s=Date.now();
    (function t(){
      const p=Math.min((Date.now()-s)/dur,1), e=1-Math.pow(1-p,3);
      el.textContent=Math.round(target*e).toLocaleString();
      if(p<1) requestAnimationFrame(t);
    })();
  }

  // Word cloud renderer
  function renderCloud(containerId, words) {
    // words = [{text, count}] sorted desc
    const el = document.getElementById(containerId);
    if(!el) return;
    el.innerHTML = '';
    if(!words.length){ el.innerHTML='<span style="color:rgba(255,255,255,0.2);font-family:var(--mono);font-size:12px;">Gathering data…</span>'; return; }
    const max = words[0].count || 1;
    const sizes = [2.2,1.75,1.45,1.2,1.05,0.92,0.82,0.75];
    const opacities = [1,.92,.82,.72,.65,.58,.52,.48];
    words.slice(0,12).forEach((w,i)=>{
      const span = document.createElement('span');
      const sz   = sizes[Math.min(i,sizes.length-1)];
      const op   = opacities[Math.min(i,opacities.length-1)];
      const rotate = (Math.random()-.5)*12; // subtle tilt
      span.textContent = w.text;
      span.style.cssText = `
        font-family:var(--serif);
        font-size:${sz}rem;
        color:rgba(255,255,255,${op});
        display:inline-block;
        transform:rotate(${rotate}deg);
        line-height:1.3;
        cursor:default;
        transition:opacity .2s,transform .2s;
        padding:0 .15rem;
      `;
      span.onmouseenter = ()=>{ span.style.opacity=1; span.style.transform=`rotate(0deg) scale(1.1)`; };
      span.onmouseleave = ()=>{ span.style.opacity=op; span.style.transform=`rotate(${rotate}deg) scale(1)`; };
      el.appendChild(span);
    });
  }

  // ── Main ───────────────────────────────────
  const statsSection = document.getElementById('stats-viewer');
  let rendered = false;

  async function renderStats() {
    if(rendered) return;
    rendered = true;

    // GET current counts (already incremented on page load above)
    const [totalVal, li, gh, di, ot] = await Promise.all([
      getCount(NS + '/total'),
      getCount(SRC_KEYS.linkedin),
      getCount(SRC_KEYS.github),
      getCount(SRC_KEYS.direct),
      getCount(SRC_KEYS.other),
    ]);

    // Total visits
    countUp(document.getElementById('sv-visits'), Math.max(totalVal, 51), 1400);
    const vBar = document.getElementById('sv-visits-bar');
    if(vBar) setTimeout(()=>vBar.style.width=Math.min((totalVal/300)*100,95)+'%', 400);

    // Source word cloud
    const rawSrc = [
      {text:'LinkedIn',  count:li||0},
      {text:'Direct',    count:di||0},
      {text:'GitHub',    count:gh||0},
      {text:'Other',     count:ot||0},
    ].sort((a,b)=>b.count-a.count);
    // Always show all four, even if count is 0 (use minimum size 1 for display)
    const srcWords = rawSrc.map(w=>({...w, count: Math.max(w.count,1)}));
    setTimeout(()=>renderCloud('sv-source-cloud', srcWords), 600);

    // Location: get current visitor location, use to increment city counter
    const loc = await getLocation();
    const locEl  = document.getElementById('sv-location');
    const locSub = document.getElementById('sv-location-sub');
    if(loc && loc.city) {
      if(locEl)  locEl.textContent  = loc.city;
      if(locSub) locSub.textContent = (loc.region||'') + (loc.country ? ', '+loc.country : '');
      // Increment that city's counter
      const cityKey = NS+'/city-'+loc.city.replace(/\s+/g,'-').toLowerCase();
      hitCount(cityKey);
    } else {
      if(locEl)  locEl.textContent  = 'Private';
      if(locSub) locSub.textContent = 'Location not available';
    }

    // Source card
    const srcEl  = document.getElementById('sv-source');
    const srcSub = document.getElementById('sv-source-sub');
    const srcLabel={linkedin:'LinkedIn',github:'GitHub',direct:'Direct',other:'Web/Other'};
    if(srcEl)  srcEl.textContent  = srcLabel[source];
    if(srcSub) srcSub.textContent = document.referrer ? new URL(document.referrer).hostname : 'No referrer';

    // Location word cloud: show top tracked cities using our known keys
    const cityFetches = CITY_KEYS.map(city=>
      getCount(NS+'/city-'+city.replace(/\s+/g,'-').toLowerCase()).then(count=>({text:city,count}))
    );
    const cityData = await Promise.all(cityFetches);
    const topCities = cityData.filter(c=>c.count>0).sort((a,b)=>b.count-a.count);
    // Add current city if not tracked
    if(loc&&loc.city&&!CITY_KEYS.includes(loc.city)){
      topCities.unshift({text:loc.city,count:1});
    }
    // Ensure we always have a visible cloud — pad with base cities at count=1
    const baseCities = ['Atlanta','New York','London','San Francisco','Bangalore'];
    baseCities.forEach(city => {
      if (!topCities.find(c=>c.text===city)) topCities.push({text:city, count:1});
    });
    topCities.sort((a,b)=>b.count-a.count);
    setTimeout(()=>renderCloud('sv-location-cloud', topCities), 800);

    // Footer
    const ft = document.getElementById('sv-footer');
    if(ft) ft.textContent = 'Data collected via CountAPI & ipinfo.io • Refreshes on each visit';
  }

  if(statsSection){
    const obs=new IntersectionObserver(e=>{if(e[0].isIntersecting) renderStats();},{threshold:0.1});
    obs.observe(statsSection);
  }
})();  // ── Fire visit + source counter IMMEDIATELY on page load ────
  (async function trackVisit() {
    try {
      const [total] = await Promise.all([
        hitCount(NS + '/total'),
        hitCount(SRC_KEYS[source]),
      ]);
      // Update visit counter if section already rendered
      const el = document.getElementById('sv-visits');
      if (el && el.textContent !== '—') {
        el.textContent = String(Math.max(total, 51));
      }
    } catch(e) {}
  })();

  
