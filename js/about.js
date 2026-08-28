/* ============================================================
   PLAYR — ABOUT US
   What PLAYR is · Why it exists · Where it's going ·
   What it believes · Who is building it.
   ============================================================ */
(function(){
"use strict";
let rendered=false;
const IMG=k=>(typeof H2_IMGS!=="undefined"&&H2_IMGS[k])||PLAYR_IMG.sport("running");

const FOUNDERS=[
  {n:"VIVAAN MORADIA",role:"CO-FOUNDER — PRODUCT & COMMUNITY",ini:"VM",accent:"var(--lime)",
   desc:"Vivaan brings a combination of communication, technology, leadership and public-relations experience to PLAYR. With experience as a public speaker, MUN participant and debate leader, he brings strong communication and presentation skills. His experience in web development adds a technology perspective, while his work in public relations and leadership roles across college committees gives him experience in managing teams, coordinating people and communicating ideas.",
   focus:["Product","Technology","Brand communication","Community","Public relations"],
   skills:["Public Speaker","MUN Delegate","Debate Head Boy","Web Developer","PR Specialist","HOD — College Committees"],
   note:"Build something people don't just use — build something they feel part of."},
  {n:"VIVAANSHI NANDU",role:"CO-FOUNDER — STRATEGY & INNOVATION",ini:"VN",accent:"#4DA6FF",
   desc:"Vivaanshi brings a combination of strategic thinking, curiosity, communication and initiative to PLAYR. Her experience through JNS AWS and leadership-oriented opportunities gives her exposure to structured problem-solving and organizational environments. As a speaker and MUN winner, she brings confidence, persuasive communication and the ability to think critically under pressure.",
   focus:["Strategy","Innovation","Business development","Communication","Research","Community growth"],
   skills:["VCP — JNS AWS","Smart Enthusiast","Speaker","Winner at MUNs"],
   note:"Think bigger. Build smarter. Make it matter."},
  {n:"RUSHIK SHAH",role:"CO-FOUNDER — SPORTS & COMMUNITY",ini:"RS",accent:"#B98CFF",
   desc:"Rushik brings the perspective of someone who actively enjoys adventure and outdoor sports. His interest in trekking and exploration gives the founding team a direct connection to the world of sports beyond traditional mainstream disciplines. His perspective is particularly relevant to PLAYR's ambition to make every kind of sport — from mainstream games to adventure disciplines — discoverable and socially connected.",
   focus:["Sports culture","Adventure sports","Outdoor community","Sport discovery","Experiential content"],
   skills:["Adventure Sports Enthusiast","Trekking","Passionate About Outdoor Experiences"],
   note:"Sport isn't only something you watch. It's something you experience."}
];

/* Skill matrix — levels assigned ONLY from backgrounds the founders shared.
   S = STRONG · W = WORKING · D = DEVELOPING */
const MATRIX=[
  ["Technology",            "S","D","D"],
  ["Public Speaking",       "S","S","D"],
  ["Leadership",            "S","W","D"],
  ["Strategy",              "W","S","D"],
  ["PR / Communication",    "S","W","D"],
  ["Business Development",  "W","W","D"],
  ["Sports Knowledge",      "D","D","S"],
  ["Adventure / Outdoor",   "D","D","S"],
  ["Community",             "S","W","W"],
  ["Brand",                 "W","W","D"]
];
const LVL={S:["STRONG","lv-s"],W:["WORKING","lv-w"],D:["DEVELOPING","lv-d"]};

window.renderAbout=function(){
  const root=document.getElementById("aboutRoot"); if(!root) return;
  if(rendered&&root.innerHTML.trim()){ revealAll(); return; }
  const collage=["cricket","football","running","mountaineering","basketball","formula-1","badminton","cycling"];

  root.innerHTML=`
  <!-- ================= HERO ================= -->
  <div class="ab-hero">
    <div class="ab-hero-collage">${collage.map((c,i)=>`<div style="background-image:url('${IMG(c)}'); animation-delay:${i*.5}s"></div>`).join("")}
      <div class="ab-collage-spcl"><span>🔷</span><b>SPCL PLAYERS</b><i>SPORT WITHOUT LIMITS</i></div></div>
    <div class="ab-hero-veil"></div>
    <div class="wrap ab-hero-in">
      <div class="eyebrow">About PLAYR</div>
      <h1>WE'RE BUILDING<br>THE DIGITAL HOME<br>OF SPORT.</h1>
      <p>PLAYR is a social platform where every sport has a place, every community has a voice, and every passion can be shared.</p>
      <div class="ab-hero-btns">
        <button class="btn btn-primary" onclick="switchView('discover')">Explore Sports</button>
        <button class="btn btn-ghost" onclick="renderAboutScroller('founders')">Meet the Founders</button>
      </div>
    </div>
  </div>

  <!-- ================= WHAT IS PLAYR ================= -->
  <div class="wrap ab-sec">
    <div class="ab-split">
      <div class="rv">
        <div class="eyebrow">The platform</div>
        <h2 class="section-title">WHAT IS PLAYR?</h2>
        <p class="ab-lead">PLAYR is an all-sports social platform created to bring fans, athletes, creators, communities and sporting events together in one place.</p>
        <p class="ab-body">Instead of sports content being scattered across different platforms, PLAYR creates one personalized sports universe:</p>
        <ul class="ab-checklist">
          ${["Follow the sports you love","Discover new sports","Follow athletes and creators","Connect with communities","Explore sports history","Discover events","Participate in recreational challenges","Follow competitions","Discover sports products"].map(x=>`<li>${x}</li>`).join("")}
        </ul>
      </div>
      <div class="ab-eco-stage rv">
        <svg viewBox="0 0 620 620" class="ab-eco-svg" aria-hidden="true">
          <g fill="none" stroke="#E0F808" stroke-width="1.1" stroke-dasharray="4 8" class="ab-dash">
            <line x1="310" y1="310" x2="310" y2="86"/><line x1="310" y1="310" x2="516" y2="200"/><line x1="310" y1="310" x2="516" y2="420"/>
            <line x1="310" y1="310" x2="310" y2="534"/><line x1="310" y1="310" x2="104" y2="420"/><line x1="310" y1="310" x2="104" y2="200"/>
            <line x1="310" y1="310" x2="452" y2="110"/><line x1="310" y1="310" x2="168" y2="510"/>
          </g>
          <circle cx="310" cy="310" r="188" fill="none" stroke="#2A2D34"/>
          <circle cx="310" cy="310" r="250" fill="none" stroke="#1C1F24" stroke-dasharray="3 6"/>
        </svg>
        <div class="ab-eco-core"><span class="logo-mark"></span>PLAYR</div>
        <div class="ab-eco-node n1">SPORTS</div><div class="ab-eco-node n2">PEOPLE</div>
        <div class="ab-eco-node n3">COMMUNITIES</div><div class="ab-eco-node n4">EVENTS</div>
        <div class="ab-eco-node n5">CONTENT</div><div class="ab-eco-node n6">CHALLENGES</div>
        <div class="ab-eco-node n7">HISTORY</div><div class="ab-eco-node n8">COMMERCE</div>
      </div>
    </div>
  </div>

  <!-- ================= WHY WE BUILT ================= -->
  <div class="ab-sec-alt">
    <div class="wrap ab-sec">
      <div class="eyebrow">The gap</div>
      <h2 class="section-title">WHY WE BUILT PLAYR.</h2>
      <p class="ab-lead rv">Sports are everywhere, but the sports experience is fragmented.</p>
      <div class="ab-frag rv">
        <div class="ab-frag-left">
          <div class="ab-frag-label">TODAY</div>
          <div class="ab-frag-chips">
            ${["Short-form content","Scores","News","Events","Communities","Sports shopping"].map((x,i)=>`<span style="transform:rotate(${[-3,2,-1,3,-2,1][i]}deg)">${x}</span>`).join("")}
          </div>
          <div class="ab-frag-sub">Six apps. Six logins. One passion, scattered.</div>
        </div>
        <div class="ab-frag-arrow">→</div>
        <div class="ab-frag-right">
          <div class="ab-frag-label lime">PLAYR</div>
          <div class="ab-frag-one"><span class="logo-mark"></span>ONE SPORTS UNIVERSE</div>
          <div class="ab-frag-sub">Instead of finding sports across the internet, we want people to find the world of sport inside PLAYR.</div>
        </div>
      </div>
    </div>
  </div>

  <!-- ================= VISION ================= -->
  <div class="wrap ab-sec ab-center">
    <div class="eyebrow" style="justify-content:center;">Our vision</div>
    <h2 class="section-title xl">TO BUILD THE DIGITAL<br>HOME OF SPORT.</h2>
    <p class="ab-vision-copy rv">We envision a world where sport is not fragmented across platforms, but connected through one global digital community — where every sport, from the world's biggest games to the most niche disciplines, has a place to be discovered, followed and celebrated.</p>
    <div class="ab-map rv">
      <svg viewBox="0 0 620 300" class="ab-map-svg" aria-hidden="true">
        <defs><radialGradient id="abGlow"><stop offset="0%" stop-color="#E0F808" stop-opacity=".8"/><stop offset="100%" stop-color="#E0F808" stop-opacity="0"/></radialGradient></defs>
        <g fill="none" stroke="#2A2D34" stroke-width="1">
          <ellipse cx="310" cy="150" rx="250" ry="105"/><ellipse cx="310" cy="150" rx="120" ry="105"/><ellipse cx="310" cy="150" rx="250" ry="50"/>
        </g>
        <g class="ab-dash" fill="none" stroke="#E0F808" stroke-width="1.2" stroke-dasharray="4 8">
          <path d="M292 170 Q 380 120 440 92"/><path d="M292 170 Q 220 110 168 84"/><path d="M292 170 Q 390 200 442 218"/><path d="M292 170 Q 210 210 150 224"/><path d="M292 170 Q 300 110 306 66"/><path d="M292 170 Q 280 236 268 262"/>
        </g>
        <circle cx="292" cy="170" r="40" fill="url(#abGlow)"/><circle cx="292" cy="170" r="6" fill="#E0F808"/>
        <g fill="#9096A3"><circle cx="440" cy="92" r="4"/><circle cx="168" cy="84" r="4"/><circle cx="442" cy="218" r="4"/><circle cx="150" cy="224" r="4"/><circle cx="306" cy="66" r="3.5"/><circle cx="268" cy="262" r="3.5"/></g>
      </svg>
      <div class="ab-map-label l0">🇮🇳 INDIA<span>WHERE IT STARTS</span></div>
      <div class="ab-map-label l1">ASIA</div><div class="ab-map-label l2">EUROPE</div><div class="ab-map-label l3">N. AMERICA</div>
      <div class="ab-map-label l4">S. AMERICA</div><div class="ab-map-label l5">AFRICA</div><div class="ab-map-label l6">AUSTRALIA</div>
    </div>
    <h3 class="ab-map-title rv">START IN INDIA.<br>CONNECT THE WORLD.</h3>
  </div>

  <!-- ================= MISSION ================= -->
  <div class="ab-sec-alt">
    <div class="wrap ab-sec">
      <div class="eyebrow">Our mission</div>
      <h2 class="section-title">TO MAKE SPORT MORE<br>DISCOVERABLE, SOCIAL,<br>INCLUSIVE & CONNECTED.</h2>
      <div class="ab-mission">
        ${[["01","DISCOVER","Help people discover sports beyond what they already know."],
           ["02","CONNECT","Bring fans, athletes, creators, teams and communities together."],
           ["03","PARTICIPATE","Give people ways to interact with sport through communities, events and recreational challenges."],
           ["04","BELONG","Create a place where every sport and every sports enthusiast can feel part of one larger community."]]
          .map((p,i)=>`<div class="ab-pillar rv ${i%2?"alt":""}"><b class="mono-num">${p[0]}</b><div><h3>${p[1]}</h3><p>${p[2]}</p></div></div>`).join("")}
      </div>
    </div>
  </div>

  <!-- ================= VALUES ================= -->
  <div class="wrap ab-sec">
    <div class="eyebrow">Our values</div>
    <h2 class="section-title">WHAT WE BELIEVE.</h2>
    <div class="ab-values">
      ${[["PASSION","We believe sport begins with genuine passion."],
         ["COMMUNITY","Sport becomes more powerful when people experience it together."],
         ["DISCOVERY","There is always another sport, athlete, story or community to discover."],
         ["INCLUSIVITY","Every sport and every athlete deserves a place."],
         ["COMPETITION","Competition pushes people to grow, improve and connect."],
         ["CURIOSITY","The world of sport is bigger than the sports we already know."]]
        .map((v,i)=>`<div class="ab-value rv" style="--d:${i*60}ms"><b>${v[0]}</b><p>${v[1]}</p></div>`).join("")}
    </div>
  </div>

  <!-- ================= FOUNDERS ================= -->
  <div class="ab-sec-alt">
    <div class="wrap ab-sec" id="founders">
      <div class="ab-center">
        <div class="eyebrow" style="justify-content:center;">The people</div>
        <h2 class="section-title">MEET THE FOUNDERS.</h2>
        <p class="ab-lead">Three different perspectives. One shared passion for building.</p>
      </div>
      <div class="ab-founders">
        ${FOUNDERS.map(f=>`
        <div class="ab-founder rv" style="--a:${f.accent}">
          <div class="ab-f-photo"><span>${f.ini}</span><em>PHOTO COMING SOON</em></div>
          <div class="ab-f-head"><h3>${f.n}</h3><div class="ab-f-role mono-num">${f.role}</div></div>
          <p class="ab-f-desc">${f.desc}</p>
          <div class="ab-f-block"><label>BACKGROUND</label><div class="ab-f-skills">${f.skills.map(s=>`<span>${s}</span>`).join("")}</div></div>
          <div class="ab-f-block"><label>PLAYR FOCUS</label><div class="ab-f-skills lime">${f.focus.map(s=>`<span>${s}</span>`).join("")}</div></div>
          <div class="ab-f-note"><label>FOUNDER NOTE</label><p>“${f.note}”</p></div>
        </div>`).join("")}
      </div>
      <p class="ab-fine mono-num">FOUNDER PROFILES ARE BASED ON BACKGROUNDS SHARED BY THE FOUNDERS. NOTES ARE POSITIONING STATEMENTS, NOT VERIFIED QUOTATIONS. NO ACHIEVEMENTS BEYOND THOSE LISTED ARE CLAIMED.</p>
    </div>
  </div>

  <!-- ================= WHY US ================= -->
  <div class="wrap ab-sec ab-center">
    <div class="eyebrow" style="justify-content:center;">The combination</div>
    <h2 class="section-title">WHY US?</h2>
    <div class="ab-whyus rv">
      <div class="ab-wu-col"><b>VIVAAN</b><span>Technology · Communication · Leadership</span></div>
      <div class="ab-wu-plus">+</div>
      <div class="ab-wu-col"><b>VIVAANSHI</b><span>Strategy · Innovation · Speaking</span></div>
      <div class="ab-wu-plus">+</div>
      <div class="ab-wu-col"><b>RUSHIK</b><span>Sport · Adventure · Community</span></div>
    </div>
    <div class="ab-equation rv">
      <span>TECHNOLOGY</span><i>+</i><span>STRATEGY</span><i>+</i><span>SPORT</span><i>+</i><span>COMMUNICATION</span><em>=</em><b>PLAYR</b>
    </div>
  </div>

  <!-- ================= SKILL MATRIX ================= -->
  <div class="ab-sec-alt">
    <div class="wrap ab-sec">
      <div class="eyebrow">Founders</div>
      <h2 class="section-title">SKILL MATRIX.</h2>
      <p class="ab-body rv">Honest, not inflated — levels reflect only the backgrounds the founders have shared.</p>
      <div class="ab-matrix rv">
        <div class="ab-mx-head"><span>SKILL</span><b>VIVAAN</b><b>VIVAANSHI</b><b>RUSHIK</b></div>
        ${MATRIX.map(r=>`<div class="ab-mx-row"><span>${r[0]}</span>${[1,2,3].map(i=>`<em class="${LVL[r[i]][1]}">${LVL[r[i]][0]}</em>`).join("")}</div>`).join("")}
      </div>
      <div class="ab-mx-legend mono-num">
        <span class="lv-s">STRONG — DIRECT EXPERIENCE</span><span class="lv-w">WORKING — GROWING STRENGTH</span><span class="lv-d">DEVELOPING — EARLY STAGE</span>
      </div>
    </div>
  </div>

  <!-- ================= THREE PERSPECTIVES ================= -->
  <div class="wrap ab-sec ab-center">
    <h2 class="section-title">THREE FOUNDERS.<br>THREE PERSPECTIVES.<br>ONE MISSION.</h2>
    <div class="ab-venn rv">
      <svg viewBox="0 0 560 500" aria-hidden="true">
        <circle cx="280" cy="170" r="150" fill="rgba(224,248,8,.05)" stroke="#E0F808" stroke-width="1.4"/>
        <circle cx="190" cy="330" r="150" fill="rgba(77,166,255,.05)" stroke="#4DA6FF" stroke-width="1.4"/>
        <circle cx="370" cy="330" r="150" fill="rgba(185,140,255,.05)" stroke="#B98CFF" stroke-width="1.4"/>
      </svg>
      <div class="ab-venn-label v1"><b>TECH</b><span>Vivaan</span></div>
      <div class="ab-venn-label v2"><b>STRATEGY</b><span>Vivaanshi</span></div>
      <div class="ab-venn-label v3"><b>SPORT</b><span>Rushik</span></div>
      <div class="ab-venn-core">PLAYR</div>
    </div>
    <p class="ab-venn-cap rv">Different strengths. One direction.</p>
  </div>

  <!-- ================= APPROACH TO SPORT ================= -->
  <div class="ab-sec-alt">
    <div class="wrap ab-sec">
      <div class="eyebrow">Our approach to sport</div>
      <h2 class="section-title">EVERY SPORT<br>DESERVES A PLACE.</h2>
      <p class="ab-body rv">PLAYR doesn't believe sport should be defined only by the biggest leagues. Sport is:</p>
      <div class="ab-sport-kinds rv">
        ${["Mainstream","Niche","Olympic","Para sport","Adventure","Grassroots","College","Community","Creator-led","Emerging disciplines"].map(k=>`<span>${k}</span>`).join("")}
      </div>
      <div class="ab-spcl-cta card rv">
        <div>
          <div class="pill" style="background:rgba(77,166,255,.14);color:#8CC4FF;border:1px solid rgba(77,166,255,.35);margin-bottom:12px;">SPCL PLAYERS</div>
          <h3>SPORTS FOR EVERY CAPABILITY. LIMITLESS POTENTIAL.</h3>
          <p>PLAYR believes Para sport and Para athletes belong at the core of the sports ecosystem — not as an afterthought. SPCL PLAYERS is our dedicated Para-sport space. (SPCL is a PLAYR initiative — not an official Paralympic or IPC organisation.)</p>
        </div>
        <button class="btn btn-primary" onclick="switchView('spcl')">Explore SPCL PLAYERS →</button>
      </div>
    </div>
  </div>

  <!-- ================= INDIA TO WORLD ================= -->
  <div class="wrap ab-sec ab-center">
    <h2 class="section-title xl">BUILT IN INDIA.<br>MADE FOR THE WORLD.</h2>
    <p class="ab-vision-copy rv">We are starting with India's enormous and diverse sports audience, with the ambition to connect sports communities globally.</p>
    <div class="ab-map small rv">
      <svg viewBox="0 0 620 300" class="ab-map-svg">
        <g fill="none" stroke="#2A2D34"><ellipse cx="310" cy="150" rx="250" ry="105"/><ellipse cx="310" cy="150" rx="120" ry="105"/></g>
        <circle cx="292" cy="170" r="44" fill="url(#abGlow)"/><circle cx="292" cy="170" r="6" fill="#E0F808"/>
      </svg>
      <div class="ab-map-label l0">🇮🇳<span>MUMBAI → THE WORLD</span></div>
    </div>
  </div>

  <!-- ================= FINAL CTA ================= -->
  <div class="ab-final">
    <div class="ab-final-veil"></div>
    <div class="wrap ab-final-in">
      <h2>ONE PASSION.<br>ONE COMMUNITY.</h2>
      <p>Welcome to the world we're building.</p>
      <div class="final-btns">
        <button class="btn btn-primary" onclick="openAuth('signup')">Join PLAYR</button>
        <button class="btn btn-ghost" onclick="switchView('discover')">Explore Sports</button>
      </div>
    </div>
  </div>`;

  rendered=true;
  revealAll();
};
window.renderAboutScroller=function(id){ const el=document.getElementById(id); if(el&&el.scrollIntoView) el.scrollIntoView({behavior:"smooth"}); };

/* scroll reveals */
function revealAll(){
  try{
    const io=new IntersectionObserver(es=>es.forEach(e=>{ if(e.isIntersecting){ e.target.classList.add("in"); io.unobserve(e.target);} }),{threshold:.1});
    document.querySelectorAll("#aboutRoot .rv:not(.in)").forEach(el=>io.observe(el));
  }catch(e){ document.querySelectorAll("#aboutRoot .rv").forEach(el=>el.classList.add("in")); }
}
})();
