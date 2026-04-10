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
// MOVING BACKGROUND — Geometric particle mesh
// ═══════════════════════════════════════════
(function() {
  const canvas = document.getElementById('bg-canvas');
  const ctx    = canvas.getContext('2d');
  let W, H, mouse = { x: -999, y: -999 };

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);
  document.addEventListener('mousemove', e => { mouse.x = e.clientX; mouse.y = e.clientY; });

  // ── Floating hex/circle shapes (large decorative) ──────────────
  const blobs = Array.from({length: 6}, (_, i) => ({
    x: Math.random() * W,
    y: Math.random() * H,
    r: 120 + Math.random() * 160,
    vx: (Math.random() - .5) * .4,
    vy: (Math.random() - .5) * .4,
    hue: i < 3 ? '#0f766e' : i < 5 ? '#14b8a6' : '#ccfbf1',
    alpha: 0.04 + Math.random() * 0.04,
  }));

  // ── Small particles ─────────────────────────────────────────────
  const particles = Array.from({length: 90}, () => ({
    x: Math.random() * (typeof W !== 'undefined' ? W : 1200),
    y: Math.random() * (typeof H !== 'undefined' ? H : 800),
    r: .8 + Math.random() * 2.2,
    vx: (Math.random() - .5) * .5,
    vy: (Math.random() - .5) * .5,
    alpha: .08 + Math.random() * .18,
    color: Math.random() > .4 ? '#0f766e' : Math.random() > .5 ? '#14b8a6' : '#0a5c56',
  }));

  // ── Grid dots (static teal grid) ────────────────────────────────
  const GRID = 80;

  let frame = 0;

  function draw() {
    ctx.clearRect(0, 0, W, H);
    frame++;

    // 1. Soft gradient background wash
    const grad = ctx.createRadialGradient(W*.35, H*.4, 0, W*.35, H*.4, Math.max(W,H)*.8);
    grad.addColorStop(0,   'rgba(15,118,110,0.07)');
    grad.addColorStop(.5,  'rgba(20,184,166,0.03)');
    grad.addColorStop(1,   'rgba(204,251,241,0.02)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, W, H);

    // 2. Grid dot pattern
    ctx.fillStyle = 'rgba(15,118,110,0.09)';
    for (let gx = GRID/2; gx < W; gx += GRID) {
      for (let gy = GRID/2; gy < H; gy += GRID) {
        const pulse = Math.sin(frame*.015 + gx*.01 + gy*.008) * .5 + .5;
        ctx.globalAlpha = 0.04 + pulse * 0.06;
        ctx.beginPath();
        ctx.arc(gx, gy, 1.5, 0, Math.PI*2);
        ctx.fill();
      }
    }
    ctx.globalAlpha = 1;

    // 3. Large decorative floating circles
    for (const b of blobs) {
      b.x += b.vx; b.y += b.vy;
      if (b.x < -b.r) b.x = W + b.r;
      if (b.x > W+b.r) b.x = -b.r;
      if (b.y < -b.r) b.y = H + b.r;
      if (b.y > H+b.r) b.y = -b.r;
      const bg = ctx.createRadialGradient(b.x, b.y, 0, b.x, b.y, b.r);
      bg.addColorStop(0, b.hue + 'CC');
      bg.addColorStop(.6, b.hue + '44');
      bg.addColorStop(1, b.hue + '00');
      ctx.globalAlpha = b.alpha;
      ctx.fillStyle = bg;
      ctx.beginPath();
      ctx.arc(b.x, b.y, b.r, 0, Math.PI*2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;

    // 4. Particle network with mouse interaction
    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];

      // Mouse attraction (gentle)
      const mdx = mouse.x - p.x, mdy = mouse.y - p.y;
      const md  = Math.sqrt(mdx*mdx + mdy*mdy);
      if (md < 180) {
        p.vx += mdx * .00012;
        p.vy += mdy * .00012;
      }
      // Speed cap
      const spd = Math.sqrt(p.vx*p.vx + p.vy*p.vy);
      if (spd > .9) { p.vx *= .92; p.vy *= .92; }

      p.x += p.vx; p.y += p.vy;
      if (p.x < 0) { p.x = 0; p.vx *= -1; }
      if (p.x > W) { p.x = W; p.vx *= -1; }
      if (p.y < 0) { p.y = 0; p.vy *= -1; }
      if (p.y > H) { p.y = H; p.vy *= -1; }

      // Connect nearby particles
      for (let j = i+1; j < particles.length; j++) {
        const q   = particles[j];
        const dx  = p.x - q.x, dy = p.y - q.y;
        const dist = Math.sqrt(dx*dx + dy*dy);
        if (dist < 110) {
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(q.x, q.y);
          ctx.strokeStyle = `rgba(15,118,110,${0.12 * (1 - dist/110)})`;
          ctx.lineWidth = .8;
          ctx.stroke();
        }
      }

      // Draw dot with subtle glow on particles near cursor
      const nearMouse = md < 80;
      ctx.beginPath();
      ctx.arc(p.x, p.y, nearMouse ? p.r * 1.8 : p.r, 0, Math.PI*2);
      ctx.fillStyle = nearMouse ? '#14b8a6' : p.color;
      ctx.globalAlpha = nearMouse ? .35 : p.alpha;
      ctx.fill();
    }
    ctx.globalAlpha = 1;

    // 5. Travelling wave lines (subtle horizontal sine)
    const lineCount = 4;
    for (let k = 0; k < lineCount; k++) {
      const baseY = H * (.2 + k * .2);
      ctx.beginPath();
      for (let x = 0; x <= W; x += 4) {
        const y = baseY + Math.sin((x + frame * (k%2===0 ? 1.2 : -1)) * .007 + k) * 28;
        x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
      }
      ctx.strokeStyle = `rgba(15,118,110,${.04 + k*.01})`;
      ctx.lineWidth = 1;
      ctx.stroke();
    }

    requestAnimationFrame(draw);
  }
  draw();
})();


// ═══════════════════════════════════════════
// CURSOR
// ═══════════════════════════════════════════
const cur = document.getElementById('cursor'), ring = document.getElementById('cursorRing');
let mx = window.innerWidth/2, my = window.innerHeight/2, rx = mx, ry = my;
// Show cursor at center initially
cur.style.left = mx + 'px'; cur.style.top = my + 'px';
ring.style.left = rx + 'px'; ring.style.top = ry + 'px';

document.addEventListener('mousemove', e => {
  mx = e.clientX; my = e.clientY;
  cur.style.left = mx + 'px'; cur.style.top = my + 'px';
});
(function anim() {
  rx += (mx - rx) * 0.13; ry += (my - ry) * 0.13;
  ring.style.left = rx + 'px'; ring.style.top = ry + 'px';
  requestAnimationFrame(anim);
})();
document.addEventListener('mousedown', () => document.body.classList.add('clicking'));
document.addEventListener('mouseup', () => document.body.classList.remove('clicking'));
document.querySelectorAll('a,button,.skill-pill,.cert-badge,.edu-card,.project-card,.postit,.stat-card,.social-chip,.chat-quick,.testimonial-card').forEach(el => {
  el.addEventListener('mouseenter', () => { cur.classList.add('hover'); ring.classList.add('hover'); });
  el.addEventListener('mouseleave', () => { cur.classList.remove('hover'); ring.classList.remove('hover'); });
});

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
// CHATBOX — AI Assistant with email-first flow
// ═══════════════════════════════════════════
let chatOpen = false;
let chatHistory = [];
let userEmail = null;
let awaitingEmail = false;
let emailSentThisSession = false;

// Knowledge base — answers common questions
const KB = {
  'job opportunity':  "Great news! Sujitha is open to exciting Software Engineering opportunities in cloud-native, Java/SAP, and DevOps. She's based in Atlanta, GA. Could you share details — company name, role, and location? I'll forward everything to her! 📬",
  'collaborate':      "Sujitha loves collaborating on interesting engineering challenges — open source, consulting, or side projects. Tell me more! I can forward your proposal directly to her.",
  'experience':       "Sujitha has 9+ years as a Senior Software Engineer across SAP Concur, SuccessFactors, and S/4HANA. She's an SAP BTP Certified Solution Architect, expert in Java/Spring Boot, AWS, and Kubernetes, and pursuing her MS CS at Georgia Tech OMSCS. Anything specific you'd like to know?",
  'tech stack':       "Core stack: Java 8+ / Spring Boot · AWS (EKS, Kafka, S3, IAM) · Kubernetes / Docker · SAP BTP & Cloud Foundry · CI/CD Pipelines · REST APIs / OData. Also certified in IBM AI Development and DevOps.",
  'certification':    "4 certifications: SAP BTP Solution Architect (2026), DevOps Professional — PagerDuty (2026), IBM Certified AI Developer (2025), Gen AI for Software Dev — DeepLearning.AI (2025). Verify at credly.com/users/sujitha-suresh-rao",
  'education':        "MS in Computer Science at Georgia Tech OMSCS (Jan 2026, part-time). B.Tech in CS&E — GPA 3.9/4.0 from Govt. Model Engineering College, India (2015).",
  'location':         "Sujitha is based in Atlanta, Georgia, USA. She has worked across both India and the US.",
  'contact':          "Reach Sujitha at sujitharao93@gmail.com or linkedin.com/in/sujitha-rao. I can also forward your message directly — just share your email!",
  'salary':           "For compensation discussions, I'd recommend reaching out directly to sujitharao93@gmail.com. She'll be happy to have that conversation.",
  'availability':     "I don't have exact availability details, but I'll pass your message to Sujitha and she typically responds within 24 hours.",
  'aws':              "Sujitha built a 2M+ records/hour data pipeline on AWS at SAP Concur (EC2, EKS, Kafka, S3, DynamoDB, CloudWatch) with 40% improved reliability.",
  'kubernetes':       "Hands-on Kubernetes (EKS) experience — containerizing microservices, Helm-based IaC, zero-touch CI/CD deployments in production at SAP Concur.",
  'sap':              "SAP is Sujitha's deep expertise: BTP, Concur, SuccessFactors HCM, S/4HANA, Cloud Foundry, Integration Suite, API Management, SAP Joule, SAP Build. Certified SAP BTP Solution Architect.",
  'java':             "Java is Sujitha's primary language — Java 8+ with Spring Boot, JUnit, Mockito, Gradle, REST APIs, and microservices. 9+ years of enterprise Java development.",
  'project':          "Key projects: (1) Enterprise Data Pipeline — 2M+ rec/hr on AWS Kafka+EKS at SAP Concur. (2) SuccessFactors HCM modules on SAP BTP. (3) SSL Certificate Validation at Unisys. (4) Hand Gesture Recognition (CV/Python). Check the Projects section!",
  'georgia tech':     "Sujitha is enrolled in Georgia Tech OMSCS — one of the top CS programs globally, specializing in ML & Cloud Computing. Started Jan 2026.",
  'hello':            "Hi there! 👋 Great to meet you. I'm Sujitha's AI assistant. I can answer questions about her experience, skills, projects, or certifications — or forward your message directly to her. What can I help you with?",
  'hi':               "Hi! 👋 I'm Sujitha's AI assistant. How can I help you today? You can ask about her experience, tech stack, certifications, or leave a message for her.",
};

function getAIResponse(msg) {
  const lower = msg.toLowerCase();
  for (const [key, response] of Object.entries(KB)) {
    if (lower.includes(key)) return response;
  }
  return null;
}

function toggleChat() {
  chatOpen = !chatOpen;
  const box     = document.getElementById('chatbox');
  const trigger = document.getElementById('chatTrigger');
  if (box)     box.classList.toggle('open', chatOpen);
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

function removeTyping() {
  const t = document.getElementById('typingIndicator');
  if (t) t.remove();
}

function sendChatMessage() {
  const input = document.getElementById('chatInput');
  const msg   = input.value.trim();
  if (!msg) return;
  input.value = '';
  document.getElementById('quickBtns').style.display = 'none';

  appendMessage(msg, 'from-me');
  chatHistory.push({ role: 'user', content: msg });

  // ── Email collection step ──
  if (awaitingEmail) {
    const emailMatch = msg.match(/[\w.+\-]+@[\w\-]+\.[a-z]{2,}/i);
    if (emailMatch) {
      userEmail = emailMatch[0];
      awaitingEmail = false;
      showTyping();
      setTimeout(() => {
        removeTyping();
        appendMessage(`Perfect! Got it — <strong>${userEmail}</strong>. Sending your conversation to Sujitha now; you'll be CC'd so you have a copy. She typically responds within 24 hours. ✅`, 'from-sujitha');
        doSendEmail();
      }, 900);
    } else {
      showTyping();
      setTimeout(() => {
        removeTyping();
        appendMessage("That doesn't look like a valid email address. Please enter your email so I can CC you on the message to Sujitha.", 'from-sujitha');
      }, 700);
    }
    return;
  }

  setTimeout(() => {
    showTyping();
    setTimeout(() => {
      removeTyping();
      const aiResp = getAIResponse(msg);
      if (aiResp) {
        appendMessage(aiResp, 'from-sujitha');
        chatHistory.push({ role: 'bot', content: aiResp });
        if (!emailSentThisSession) {
          setTimeout(() => {
            appendMessage("Would you like me to forward this conversation to Sujitha so she can follow up personally? Share your email address and I'll CC you on the message! 📧", 'from-sujitha');
            awaitingEmail = true;
          }, 1100);
        }
      } else {
        appendMessage("Great question! I may not have all the details on that — but I can make sure Sujitha sees your message and responds personally. Could you share your email address? I'll CC you on the message to her. 📬", 'from-sujitha');
        chatHistory.push({ role: 'bot', content: 'Escalated — unknown question' });
        awaitingEmail = true;
      }
    }, 1100);
  }, 250);
}

function doSendEmail() {
  const transcript = chatHistory
    .map(m => (m.role === 'user' ? 'Visitor: ' : 'Bot: ') + m.content)
    .join('\n\n');
  const subject = encodeURIComponent('Portfolio Chat — Message for Sujitha');
  const body    = encodeURIComponent(
    'Hi Sujitha,\n\nA visitor chatted with your AI portfolio assistant. Here is the conversation:\n\n' +
    transcript +
    '\n\n---\nVisitor email: ' + (userEmail || 'Not provided') +
    '\n\nPlease follow up at your earliest convenience!'
  );
  const cc = userEmail ? '&cc=' + encodeURIComponent(userEmail) : '';
  window.location.href = `mailto:sujitharao93@gmail.com?subject=${subject}&body=${body}${cc}`;
  emailSentThisSession = true;
}

function sendQuick(msg) {
  document.getElementById('quickBtns').style.display = 'none';
  appendMessage(msg, 'from-me');
  chatHistory.push({ role: 'user', content: msg });
  setTimeout(() => {
    showTyping();
    setTimeout(() => {
      removeTyping();
      const aiResp = getAIResponse(msg);
      const reply = aiResp || "Thanks for reaching out! I can forward this to Sujitha directly. Could you share your email address so I can CC you on the message? 📧";
      appendMessage(reply, 'from-sujitha');
      chatHistory.push({ role: 'bot', content: reply });
      if (!emailSentThisSession) {
        setTimeout(() => {
          appendMessage("Share your email and I'll make sure Sujitha follows up with you directly! 📬", 'from-sujitha');
          awaitingEmail = true;
        }, 1000);
      }
    }, 1000);
  }, 300);
}


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
