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

  function attachCursorHovers() {
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
  attachCursorHovers();
  setInterval(attachCursorHovers, 3000);
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

async 
// ── Local Knowledge Base — answers from Sujitha's profile ──────
const KB = {
  'experience|years|background|career|work':
    "Sujitha has 9+ years of enterprise software engineering: SAP Concur (2022–2024), SAP SuccessFactors/SAP Labs (2020–2022), and Unisys (2015–2020). She's a certified SAP BTP Solution Architect based in Atlanta, GA.",
  'sap|btp|concur|successfactors|hcm|odata|s4|hana|cloud foundry':
    "SAP is Sujitha's deep expertise — BTP, Concur, SuccessFactors HCM, S/4HANA, Cloud Foundry, Integration Suite, API Management, SAP Joule, and SAP Build. Certified SAP BTP Solution Architect (2026).",
  'java|spring|backend|microservice|api|rest':
    "Java is Sujitha's primary language — Java 8+ with Spring Boot, JUnit, Mockito, REST/OData APIs, and microservices. 9+ years of enterprise Java development.",
  'aws|cloud|kubernetes|eks|kafka|docker|devops|ci|cd|pipeline':
    "Sujitha built a 2M+ records/hour pipeline on AWS (EKS, Kafka, S3) at SAP Concur with 40% reliability improvement. Expert in Kubernetes, Docker, Helm, CI/CD, Terraform, and GitHub Actions.",
  'certification|certified|credly|ibm|pagerduty':
    "4 certifications: SAP BTP Solution Architect (2026), PagerDuty DevOps (2026), IBM AI Developer (2025), Gen AI for Software Dev — DeepLearning.AI (2025). Verify at credly.com/users/sujitha-suresh-rao.",
  'education|georgia tech|omscs|ms|masters|degree|gpa':
    "Sujitha is pursuing her MS CS at Georgia Tech OMSCS (part-time, Jan 2026) — one of the world's top CS programs. B.Tech CSE with 3.9/4.0 GPA from Model Engineering College, India (2015).",
  'hire|job|role|opportunity|position|open|recruit|available':
    "Sujitha is open to senior Software Engineering conversations — especially Java, cloud-native, SAP ecosystems, and DevOps. Based in Atlanta, GA, pursuing Georgia Tech MS part-time, and fully available for full-time roles. Reach her at sujitharao93@gmail.com.",
  'salary|compensation|rate|pay':
    "For compensation discussions, I'd suggest reaching out directly to Sujitha at sujitharao93@gmail.com — she'll be happy to chat!",
  'contact|email|reach|connect|linkedin':
    "Email: sujitharao93@gmail.com — LinkedIn: linkedin.com/in/sujitha-rao. I can also forward your message directly — just share your email! 📧",
  'project|pipeline|achievement|impact|result':
    "Key achievements: (1) 2M+ records/hr AWS pipeline at SAP Concur (+40% reliability). (2) SuccessFactors HCM modules on SAP BTP. (3) SSL/X.509 validation at Unisys. (4) Hand Gesture Recognition (OpenCV/Python). (5) 35% defect reduction via automated testing.",
  'ai|machine learning|ml|artificial intelligence|gen ai':
    "IBM Certified AI Developer (2025), Gen AI for Software Development from DeepLearning.AI (2025). Exploring ML & Cloud Computing in her Georgia Tech OMSCS program.",
  'location|atlanta|georgia|remote|relocation':
    "Sujitha is based in Atlanta, Georgia, USA. Open to both local and remote opportunities.",
  'hello|hi|hey|good morning|good afternoon':
    "Hi there! 👋 I'm Sujitha's AI assistant. Ask me about her experience, skills, certifications, or projects — or leave a message and I'll make sure she gets it!",
  'collaborate|freelance|consult|side project|partner':
    "Sujitha is open to interesting engineering collaborations! Tell me more about what you have in mind.",
};

function callClaude(userMessage) {
  const lower = userMessage.toLowerCase();
  for (const [pattern, answer] of Object.entries(KB)) {
    if (pattern.split('|').some(kw => lower.includes(kw))) {
      return Promise.resolve(answer);
    }
  }
  return Promise.resolve(null); // triggers email escalation
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

  // FormSubmit.co — free, no API key required.
  // IMPORTANT: First-ever submission sends an activation email to sujitharao93@gmail.com.
  // Click the activation link ONCE — then all future emails are delivered automatically.
  // The visitor is automatically CC'd so they get a copy too.
  try {
    const res = await fetch('https://formsubmit.co/ajax/sujitharao93@gmail.com', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify({
        _subject:      'Portfolio Chat — Message from ' + (userEmail || 'a visitor'),
        _template:     'box',
        _replyto:      userEmail || '',
        _cc:           userEmail || '',
        _autoresponse: 'Hi! Thanks for reaching out to Sujitha. She has received your message and will get back to you soon!',
        name:          'Sujitha Portfolio Bot',
        email:         userEmail || 'visitor@portfolio.com',
        message:       '=== Chat Conversation ===\n\n' + transcript +
                       '\n\n=== Visitor Email: ' + (userEmail || 'not provided') + ' ===',
      }),
    });
    const d = await res.json();
    if (d.success === 'true' || d.success === true) {
      emailSentThisSession = true;
      return true;
    }
  } catch(e) {  }

  emailSentThisSession = true;
  return false;
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

// ═══════════════════════════════════════════
// MOBILE POST-IT CAROUSEL
// ═══════════════════════════════════════════
function mpiFlip(card) {
  card.classList.toggle('flipped');
}

function initMobileCarousel() {
  const track = document.getElementById('mpiTrack');
  const dotsEl = document.getElementById('mpiDots');
  if (!track || !dotsEl) return;
  const cards = track.querySelectorAll('.mpi-card');
  if (!cards.length) return;
  dotsEl.innerHTML = '';
  cards.forEach((_, i) => {
    const d = document.createElement('div');
    d.className = 'mpi-dot' + (i === 0 ? ' active' : '');
    d.onclick = () => cards[i].scrollIntoView({behavior:'smooth',block:'nearest',inline:'center'});
    dotsEl.appendChild(d);
  });
  const dots = dotsEl.querySelectorAll('.mpi-dot');
  track.addEventListener('scroll', () => {
    requestAnimationFrame(() => {
      const mid = track.scrollLeft + track.offsetWidth / 2;
      let closest = 0, minDist = Infinity;
      cards.forEach((card, i) => {
        const dist = Math.abs(card.offsetLeft + card.offsetWidth/2 - mid);
        if (dist < minDist) { minDist = dist; closest = i; }
      });
      dots.forEach((d, i) => d.classList.toggle('active', i === closest));
    });
  }, { passive: true });
}
window.addEventListener('load', initMobileCarousel);

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
// PORTFOLIO ANALYTICS — runs on page load, no IntersectionObserver dependency
// ═══════════════════════════════════════════
(function initAnalytics() {
  const STORE = 'ssr_v7';

  // Load or seed data
  let d = {};
  try { d = JSON.parse(localStorage.getItem(STORE)) || {}; } catch(e) {}
  if (!d.visits)   d.visits   = 51;
  if (!d.sources)  d.sources  = {};
  if (!d.cities)   d.cities   = {};
  if (!d.cityList) d.cityList = [];

  // Detect traffic source from referrer
  const ref = document.referrer || '';
  const source = /linkedin/i.test(ref) ? 'linkedin'
               : /github/i.test(ref)   ? 'github'
               : ref === ''             ? 'direct'
               : 'other';

  // Increment every page load
  d.visits++;
  d.sources[source] = (d.sources[source] || 0) + 1;
  try { localStorage.setItem(STORE, JSON.stringify(d)); } catch(e) {}

  // ── Helpers ────────────────────────────────
  function setEl(id, text) {
    const el = document.getElementById(id);
    if (el) el.textContent = text;
  }

  function countUp(id, target, dur) {
    const el = document.getElementById(id);
    if (!el) return;
    const t0 = Date.now();
    (function tick() {
      const p = Math.min((Date.now() - t0) / dur, 1);
      const v = Math.round(target * (1 - Math.pow(1 - p, 3)));
      el.textContent = v.toLocaleString();
      if (p < 1) requestAnimationFrame(tick);
    })();
  }

  function renderCloud(id, words) {
    const el = document.getElementById(id);
    if (!el || !words.length) return;
    el.innerHTML = '';
    const max  = Math.max(...words.map(w => w.count), 1);
    const SIZE = [2.2, 1.8, 1.5, 1.25, 1.05, 0.9, 0.8, 0.72];
    const OPA  = [1.0, 0.9, 0.82, 0.74, 0.66, 0.6, 0.55, 0.5];
    words.forEach((w, i) => {
      const n   = Math.min(i, SIZE.length - 1);
      const sz  = Math.max(SIZE[n] * Math.sqrt(w.count / max), 0.7).toFixed(2);
      const op  = OPA[n];
      const rot = (Math.random() - 0.5) * 10;
      const s = document.createElement('span');
      s.textContent = w.text;
      s.style.cssText = [
        'font-family:var(--serif)',
        'font-size:' + sz + 'rem',
        'color:rgba(255,255,255,' + op + ')',
        'display:inline-block',
        'transform:rotate(' + rot + 'deg)',
        'line-height:1.5',
        'padding:0 .3rem',
        'cursor:default',
        'transition:transform .2s,opacity .2s',
      ].join(';');
      s.onmouseenter = () => { s.style.opacity = '1'; s.style.transform = 'scale(1.15)'; };
      s.onmouseleave = () => { s.style.opacity = String(op); s.style.transform = 'rotate(' + rot + 'deg)'; };
      el.appendChild(s);
    });
  }

  // ── Paint all values ────────────────────────
  function paint() {
    // Visit count
    countUp('sv-visits', d.visits, 1000);
    const bar = document.getElementById('sv-visits-bar');
    if (bar) setTimeout(() => { bar.style.width = Math.min((d.visits / 300) * 100, 95) + '%'; }, 300);

    // Source card
    const srcLabel = { linkedin:'LinkedIn', github:'GitHub', direct:'Direct link', other:'Web / Other' };
    setEl('sv-source', srcLabel[source] || 'Unknown');
    const srcSub = document.getElementById('sv-source-sub');
    if (srcSub) {
      try { srcSub.textContent = ref ? new URL(ref).hostname : 'No referrer'; }
      catch(e) { srcSub.textContent = ref || 'No referrer'; }
    }

    // Traffic source cloud — always show all 4, sized by visit count
    const srcMax = Math.max(...Object.values(d.sources), 1);
    const srcWords = ['direct', 'linkedin', 'github', 'other']
      .map(k => ({
        text: { linkedin:'LinkedIn', github:'GitHub', direct:'Direct', other:'Other' }[k],
        count: d.sources[k] || (srcMax * 0.12),
      }))
      .sort((a, b) => b.count - a.count);
    renderCloud('sv-source-cloud', srcWords);

    // Location cloud from stored history
    const cityWords = d.cityList
      .map(city => ({ text: city, count: d.cities[city] || 1 }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 20);
    if (cityWords.length) renderCloud('sv-location-cloud', cityWords);

    setEl('sv-footer', 'Analytics stored locally · Updates on every visit');
  }

  // ── Fetch location async, update after paint ─
  async function fetchLocation() {
    try {
      const ctrl = new AbortController();
      setTimeout(() => ctrl.abort(), 5000);
      const r = await fetch('https://ipinfo.io/json', { signal: ctrl.signal });
      if (!r.ok) return;
      const loc = await r.json();
      if (!loc || !loc.city) return;

      setEl('sv-location', loc.city);
      const sub = document.getElementById('sv-location-sub');
      if (sub) sub.textContent = (loc.region || '') + (loc.country ? ', ' + loc.country : '');

      // Store city and re-render location cloud
      d.cities[loc.city] = (d.cities[loc.city] || 0) + 1;
      if (!d.cityList.includes(loc.city)) d.cityList.unshift(loc.city);
      try { localStorage.setItem(STORE, JSON.stringify(d)); } catch(e) {}

      const cityWords = d.cityList
        .map(city => ({ text: city, count: d.cities[city] || 1 }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 20);
      renderCloud('sv-location-cloud', cityWords);
    } catch(e) {
      setEl('sv-location', 'Private');
    }
  }

  // ── Run immediately (DOM is ready since script is at end of body) ──
  paint();
  fetchLocation();
})();
