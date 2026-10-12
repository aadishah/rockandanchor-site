// ---------- About page: an interactive manifesto ----------
// Story order: why we exist > problem > intersection > experiences > model > shared value >
// this is why > people > origin > future > see the evidence > beliefs > invitation.
// About speaks as Rock & Anchor: it makes the argument. Evidence (numbers, projects, money) lives on Impact Created.
const ABOUT_BELIEFS = [
  'Nature is not a backdrop.',
  'Villages are not destinations.',
  'Local people should benefit from tourism.',
];

function aboutPage(data) {
  const ph = (slug, i, big) => {
    const x = bySlug(data, slug);
    const p = x && x.photos && (x.photos[i] || x.photos[0]);
    if (p) return big ? p.url : p.thumb;
    const all = sorted(data).flatMap((e) => e.photos || []);
    return all.length ? (big ? all[(i * 7) % all.length].url : all[(i * 7) % all.length].thumb) : '';
  };
  // S(key, fallback) reads a spot from the Website Page Photos table; the alt text there replaces the default.
  const S = (key, fb) => slot(data, key, fb);
  const heroP = S('about.hero', ph('ridge-and-lake', 0, true)), earthP = S('about.earth', ph('winter-trekking', 1, true)), endP = S('about.end', ph('ridge-and-lake', 2, true));
  const img = (src, alt, cls = '') => { const o = typeof src === 'object' && src ? src : { src, alt: '', pos: '' }; return o.src ? `<img class="${cls}" src="${esc(o.src)}"${posStyle(o)} alt="${esc(o.alt || alt)}" loading="lazy">` : `<div class="${cls} ab-noimg"></div>`; };

  const problems = [
    ['01', 'We are losing our connection with nature', 'Modern life has made it easier to be connected to everything except the natural world around us.', S('about.problem.1', ph('night-sky-experience', 1, true)), 'A guest looking out of a tent at sunrise over the Sahyadris', '<span>City</span><span>Phone</span><span>Screen</span><i></i><span>Forest</span><span>Mountains</span><span>Night sky</span>'],
    ['02', 'Rural communities are losing opportunity', 'In many rural communities, young people leave because meaningful work is limited. When people leave, villages do not just lose workers. They can lose knowledge, traditions, relationships and the people who hold communities together.', S('about.problem.2', ph('be-a-villager', 0, true)), 'Village life in the Sahyadris', ''],
    ['03', 'The places we depend on need us to care', 'Tourism can either extract value from a place or help create value within it.', S('about.problem.3', ph('winter-trekking', 2, true)), 'A gorge in the Sahyadris', ''],
  ];
  const circles = [
    ['people', 'People', 'connection', 'Reconnect with nature, themselves and others.'],
    ['communities', 'Communities', 'opportunity', 'Create meaningful work, skills and opportunities close to home.'],
    ['places', 'Places', 'care', 'Protect ecosystems, culture and local knowledge.'],
  ];
  const tmi = [
    ['Touch', 'You encounter a place, a person, a story.', S('about.tmi.touch', ph('hidden-kingdom', 1, true)), 'Snail shells held in a guest’s palm'],
    ['Move', 'You participate rather than simply observe.', S('about.tmi.move', ph('monsoon-village-1-day', 2, true)), 'Children floating in a monsoon stream'],
    ['Inspire', 'You leave with a possibility you did not have before.', S('about.tmi.inspire', ph('rooftop-stargazing', 0, true)), 'A girl looking through a telescope'],
  ];
  const model = [
    ['Educate', 'We use the outdoors as a classroom.', S('about.model.educate', ph('young-explorers-winter-school', 2, true)), 'A child learning with a facilitator',
      `<p>Participants learn about:</p><ul class="ab-list"><li>Nature</li><li>Local ecosystems</li><li>Survival and life skills</li><li>Sustainability</li><li>Local culture</li></ul><p>And we support learning in the communities around us. The village decides what it needs. Your experience helps make it happen.</p>`],
    ['Employ', 'We create meaningful opportunities for people from the villages where we operate.', S('about.model.employ', ph('hidden-kingdom', 2, true)), 'A shared meal served on leaves',
      `<p>Not simply as labour. As:</p><ul class="ab-list"><li>Guides</li><li>Facilitators</li><li>Hosts</li><li>Cooks</li><li>Leaders</li><li>Specialists</li></ul>`],
    ['Empower', 'Skills become confidence. Confidence becomes leadership. Leadership creates possibilities for others.', S('about.model.empower', ph('be-a-villager', 1, true)), 'A facilitator sitting in a circle with village children',
      `<ul class="ab-steps"><li><b>Create</b> their own projects and experiences</li><li><b>Bring others along</b> and build a team</li><li><b>Find their voice</b> and speak with confidence</li><li><b>Set goals</b> and work towards them</li><li><b>Lead</b> groups and make decisions</li><li><b>Hand over</b> to the next person they have trained</li></ul>`],
  ];
  const ring = ['Guest', 'Experience', 'Local people', 'Local economy', 'Community', 'Place', 'Better care'];
  const gains = [
    ['Guest', 'A meaningful experience.'],
    ['Local community', 'Income, skills, relationships and opportunity.'],
    ['Village', 'Economic value and investment staying closer to home.'],
    ['Nature', 'People who understand and care for it.'],
    ['Rock & Anchor', 'A sustainable business capable of doing more.'],
  ];
  // "This is why": About makes the argument. The evidence lives on Impact Created.
  const ground = [
    ['This is why we work with villages.', 'Villages hold knowledge, food, stories and ways of living that are quietly disappearing. When a village hosts an experience, the value stays in the village.', S('about.ground.villages', ph('little-feet-sunset-safari', 2, true)), 'Guests with their village hosts'],
    ['This is why we care about nature.', 'You cannot care for a place you have never felt. We bring people close to the natural world, and leave it as we found it.', S('about.ground.nature', ph('monsoon-village-1-day', 0, true)), 'A monsoon waterfall in the Sahyadris'],
    ['This is why we employ locally.', 'The people who live here know these mountains better than anyone. Meaningful work close to home means young people do not have to leave to find it.', S('about.ground.employ', ph('young-explorers-winter-school', 1, true)), 'A local guide leading a group'],
    ['This is why we support village schools.', 'A community that learns can build its own future. The village decides what it needs. Your experience helps make it happen.', S('about.ground.schools', ph('be-a-villager', 3, true)), 'Village school children'],
    ['This is why experiences matter.', 'People learn by touching, building, getting wet and asking questions. A day outside teaches what a classroom or a screen cannot.', S('about.ground.experiences', ph('little-feet-sensory', 2, true)), 'Children playing in a stream'],
  ];
  const roles = [
    ['Local guides', 'People who know every trail, river and season, trained to lead groups safely.'],
    ['Village hosts', 'Families who share their food, stories, farming and culture with our guests.'],
    ['Outdoor educators', 'The people responsible for learning, safety and how every experience is designed.'],
    ['Rock & Anchor team', 'The people who coordinate the whole system, from the first message to the walk back.'],
  ];
  const gi = (g) => { const i = TEAM_GROUPS.indexOf(g); return i < 0 ? 99 : i; };
  const team = (data.team || []).slice().sort((a, b) => gi(a.group) - gi(b.group) || a.order - b.order);
  const workWith = waLink('Hi Rock & Anchor, I would like to work with you (school, company or partnership).');

  // Circular "everyone gains" diagram.
  const R = 170, cx = 220, cy = 220;
  const ringNodes = ring.map((r, i) => { const a = -Math.PI / 2 + (i * 2 * Math.PI) / ring.length; return { r, x: cx + R * Math.cos(a), y: cy + R * Math.sin(a) }; });
  const ringSvg = `<svg class="ab-ring" viewBox="0 0 440 440" role="img" aria-labelledby="ringT"><title id="ringT">A cycle: guest, experience, local people, local economy, community, place, better care, and back to the guest.</title>
<circle class="track" cx="${cx}" cy="${cy}" r="${R}"/><path id="ringPath" class="track-path" d="M${cx} ${cy - R} a${R} ${R} 0 1 1 -0.01 0"/>
<circle class="dot" r="7"><animateMotion dur="14s" repeatCount="indefinite"><mpath href="#ringPath"/></animateMotion></circle>
${ringNodes.map((n) => `<g class="rn"><circle cx="${n.x.toFixed(1)}" cy="${n.y.toFixed(1)}" r="44"/><text x="${n.x.toFixed(1)}" y="${(n.y + 5).toFixed(1)}">${esc(n.r)}</text></g>`).join('')}
<text class="mid" x="${cx}" y="${cy - 6}">Everyone</text><text class="mid" x="${cx}" y="${cy + 26}">gains</text></svg>`;

  const body = `<style>${ABOUT_CSS}</style>
<div class="ab">
<section class="ab-hero" id="why"><div class="ab-stick">
  <img class="ab-bg" data-par src="${esc(heroP.src)}"${posStyle(heroP)} alt="" fetchpriority="high">
  <div class="wrap ab-hero-text"><p class="ab-kicker">Why we exist</p><h1>We believe getting outside can change more than you.</h1>
  <p class="ab-sub">Rock &amp; Anchor exists to reconnect people with nature, create meaningful livelihoods in rural communities, and help protect the places that make those connections possible.</p></div>
  <a class="ab-scroll" href="#problem" aria-label="Scroll to read more"><span></span></a>
</div></section>

<section class="ab-problem" id="problem"><div class="wrap">
  <p class="ab-kicker rv">The problem we noticed</p><h2 class="ab-h rv">Something is being lost.</h2>
  <div class="ab-probs">${problems.map(([n, h, t, src, alt, strip]) => `<article class="ab-prob rv">${img(src, alt, 'ab-prob-img')}<div class="ab-prob-body"><span class="ab-num">${n}</span><h3>${h}</h3><p>${t}</p>${strip ? `<div class="ab-strip" aria-hidden="true">${strip}</div>` : ''}</div></article>`).join('')}</div>
</div></section>

<section class="ab-earth" id="earth"><div class="ab-earth-stick">
  <img class="ab-earth-img" src="${esc(earthP.src)}"${posStyle(earthP)} alt="${esc(earthP.alt || 'The Sahyadri mountains')}" loading="lazy">
  <p class="ab-earth-text">We do not have an <span>Earth&nbsp;2.0.</span></p>
</div></section>

<section class="ab-inter" id="together"><div class="wrap ab-inter-grid">
  <div><p class="ab-kicker rv">The intersection</p><h2 class="ab-h rv">Three things that should not be separated.</h2>
  <div class="ab-tabs" role="tablist" aria-label="People, communities and places">${circles.map(([k, l, s], i) => `<button type="button" role="tab" class="ab-tab${i ? '' : ' on'}" data-k="${k}" aria-selected="${i ? 'false' : 'true'}"><b>${l}</b><span>${s}</span></button>`).join('')}</div>
  <div class="ab-tabtext" aria-live="polite">${circles.map(([k, l, s, t], i) => `<p data-k="${k}"${i ? ' hidden' : ''}><b>${l}.</b> ${t}</p>`).join('')}</div>
  <p class="ab-centerline rv"><b>Rock &amp; Anchor</b> uses experiences to bring these three together.</p></div>
  <svg class="ab-venn" viewBox="0 0 420 400" role="img" aria-labelledby="vennT"><title id="vennT">Three overlapping circles: people, communities and places, with Rock and Anchor at the centre.</title>
    <circle class="vc" data-k="people" cx="210" cy="140" r="115"/><circle class="vc" data-k="communities" cx="290" cy="265" r="115"/><circle class="vc" data-k="places" cx="130" cy="265" r="115"/>
    <text class="vl" x="210" y="82">PEOPLE</text><text class="vs" x="210" y="104">connection</text>
    <text class="vl" x="330" y="318">COMMUNITIES</text><text class="vs" x="330" y="340">opportunity</text>
    <text class="vl" x="92" y="318">PLACES</text><text class="vs" x="92" y="340">care</text>
    <circle class="vcore" cx="210" cy="222" r="46"/><text class="vcore-t" x="210" y="218">ROCK &amp;</text><text class="vcore-t" x="210" y="238">ANCHOR</text>
  </svg>
</div></section>

<section class="ab-exp" id="experience"><div class="wrap">
  <p class="ab-kicker rv">What we believe about experiences</p><h2 class="ab-h rv">An experience can do more than give you a good day.</h2>
  <ol class="ab-journey" data-journey>${['Come curious', 'Participate', 'Connect', 'Understand', 'Care', 'Act'].map((w) => `<li>${w}</li>`).join('')}</ol>
  <div class="ab-tmi">
    <div class="ab-tmi-steps">${tmi.map(([w, t], i) => `<div class="ab-tmi-step" data-i="${i}"><h3>${w}</h3><p>${t}</p></div>`).join('')}</div>
    <div class="ab-tmi-media" aria-hidden="true">${tmi.map(([w, , src, alt], i) => img(src, alt, 'ab-tmi-img' + (i ? '' : ' on'))).join('')}</div>
  </div>
  <p class="ab-bigline rv">The best experiences do not end when you leave.</p>
</div></section>

<section class="ab-model" id="model"><div class="wrap">
  <p class="ab-kicker rv">Our model</p><h2 class="ab-h rv">Our work does not stop at the experience.</h2>
  <div class="ab-cards">${model.map(([h, lead, src, alt, more], i) => `<article class="ab-card rv"${i ? '' : ' data-open'}>${img(src, alt, 'ab-card-img')}<div class="ab-card-body"><span class="ab-num">0${i + 1}</span><h3>${h}</h3><p class="ab-card-lead">${lead}</p>
    <button type="button" class="ab-more" aria-expanded="${i ? 'false' : 'true'}" aria-controls="m${i}">What this means</button><div class="ab-card-more" id="m${i}"${i ? ' hidden' : ''}>${more}</div></div></article>`).join('<span class="ab-arrow" aria-hidden="true">→</span>')}</div>
  <p class="ab-bigline rv">A community that can build its own future.</p>
</div></section>

<section class="ab-gain" id="gain"><div class="wrap ab-gain-grid">
  <div>${ringSvg}</div>
  <div><p class="ab-kicker rv">The experience is shared</p><h2 class="ab-h rv">Everyone should gain.</h2>
  <p class="ab-p rv">When you come on an experience, the value does not stop with you. It moves through the people who host it, the village economy and the place itself, and comes back as places that are cared for and worth returning to.</p>
  <dl class="ab-gains">${gains.map(([w, t]) => `<div class="rv"><dt>${esc(w)} gets</dt><dd>${t}</dd></div>`).join('')}</dl></div>
</div></section>

<section class="ab-ground" id="ground"><div class="wrap">
  <p class="ab-kicker rv">Why we work the way we do</p><h2 class="ab-h rv">Every choice comes back to what we believe.</h2></div>
  <div class="ab-rail" tabindex="0" aria-label="Why we work the way we do">${ground.map(([h, t, src, alt]) => `<div class="ab-tile">${img(src, alt, 'ab-tile-img')}<span class="ab-tile-body"><b>${h}</b><span>${t}</span></span></div>`).join('')}</div>
  <div class="wrap"><a class="ab-link ab-bridge rv" href="/impact">See what that looks like: Impact Created →</a></div>
</section>

<section class="ab-people" id="people"><div class="wrap">
  <p class="ab-kicker rv">The people behind the experience</p><h2 class="ab-h rv">People make the place.</h2>
  <div class="ab-roles">${roles.map(([h, t], i) => `<div class="ab-role rv"><span class="ab-num">0${i + 1}</span><h3>${h}</h3><p>${t}</p></div>`).join('')}</div>
  ${team.length ? `<div class="ab-team rv"><p>Some of the people you will meet</p><ul>${team.map((m) => `<li>${m.photo ? `<img src="${esc(m.photo)}" alt="" loading="lazy">` : `<span class="ab-av">${esc(m.name.split(/\s+/).map((w) => w[0]).slice(0, 2).join(''))}</span>`}<b>${esc(m.name)}</b><small>${esc(m.role)}</small></li>`).join('')}</ul><a class="ab-link" href="/team">Meet the team →</a></div>` : ''}
</div></section>

<section class="ab-origin" id="origin"><div class="wrap ab-origin-grid">
  ${img(S('about.origin', ph('winter-trekking', 0, true)), 'A Rock & Anchor group in the Sahyadris', 'ab-origin-img rv')}
  <div class="ab-origin-text"><p class="ab-kicker rv">The origin</p><h2 class="ab-h rv">It started with Aaditya and Mansi.</h2>
  <p class="rv">Aaditya and Mansi met on a trek in the Sahyadris, brought together by a shared love for the outdoors and the experiences that happen there.</p>
  <p class="rv">Over time, they began to see that these experiences could mean more than a day in the mountains. They could connect people with nature, create meaningful work in rural communities, and help people see the places they visit differently.</p>
  <p class="rv"><b>That idea became Rock &amp; Anchor.</b></p>
  <p class="rv">What began with a few outdoor experiences has grown into a community built around nature, learning, livelihoods and meaningful adventure.</p>
  <p class="ab-italic rv">And we are still exploring what it can become.</p></div>
</div></section>

<section class="ab-future" id="future"><div class="wrap">
  <p class="ab-kicker rv">What we are building</p><h2 class="ab-h rv">We are not trying to build another adventure company.</h2>
  <p class="ab-p ab-wide rv">We want to build a model where exploring rural India creates value for the people who live there, encourages people to care for the places they visit, and gives more people a reason to step outside.</p>
  <div class="ab-ambitions">${[['More local leaders', 'People who can create and lead experiences themselves.'], ['More opportunities', 'More meaningful livelihoods close to home.'], ['More people connected to nature', 'Especially children and young people.']].map(([h, t]) => `<div class="rv"><h3>${h}</h3><p>${t}</p></div>`).join('')}</div>
</div></section>

<section class="ab-proof" id="proof"><div class="wrap">
  <p class="ab-kicker rv">The evidence</p><h2 class="ab-h rv">See what that looks like.</h2>
  <p class="ab-p rv">This page is what we believe. What actually happens because of it, the projects, the money, the people and the places, is on its own page.</p>
  <div class="ab-see"><a href="/impact">Impact Created →</a><a href="/team">The people who make it happen →</a></div>
</div></section>

<section class="ab-believe" id="believe"><div class="wrap">
  <p class="ab-kicker">A few things we believe.</p>
  <ul>${ABOUT_BELIEFS.map((b) => `<li class="rv">${b}</li>`).join('')}</ul>
</div></section>

<section class="ab-end" id="come"><img class="ab-end-img" src="${esc(endP.src)}"${posStyle(endP)} alt="" loading="lazy"><div class="wrap">
  <h2 class="ab-end-h rv">Get outside. Come back changed.</h2>
  <div class="ab-end-cta rv"><a class="btn btn-clay" href="/experiences">Explore experiences</a><a class="btn btn-ghost" href="${workWith}">${ICON.wa}Work with us</a></div>
</div></section>
</div>
<script>${ABOUT_JS}</script>`;
  return layout({ title: 'About Us', desc: 'Why Rock & Anchor exists: reconnecting people with nature, creating meaningful livelihoods in rural communities and caring for the places we visit.', path: '/about', body, image: heroP.src, data });
}

const ABOUT_JS = `(function(){
var d=document,w=window,rm=w.matchMedia&&w.matchMedia('(prefers-reduced-motion: reduce)').matches;
d.documentElement.classList.add('abjs');
var io=('IntersectionObserver' in w)?new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}})},{rootMargin:'0px 0px -10% 0px'}):null;
d.querySelectorAll('.ab .rv').forEach(function(el){if(io&&!rm)io.observe(el);else el.classList.add('in')});
/* hero parallax and Earth 2.0 reveal */
var bg=d.querySelector('.ab-bg'),hero=d.querySelector('.ab-hero'),earth=d.querySelector('.ab-earth'),eimg=d.querySelector('.ab-earth-img'),etext=d.querySelector('.ab-earth-text'),tick=false;
function prog(el){var r=el.getBoundingClientRect(),h=el.offsetHeight-w.innerHeight;return Math.min(1,Math.max(0,-r.top/(h>0?h:1)))}
function frame(){tick=false;if(rm)return;if(hero&&bg){var p=prog(hero);bg.style.transform='scale('+(1.12-p*.1)+') translateY('+(p*-6)+'%)'}
if(earth){var q=prog(earth);eimg.style.opacity=Math.min(1,q*1.6);eimg.style.transform='scale('+(1.1-q*.1)+')';etext.style.color=q>.35?'#fff':''}}
w.addEventListener('scroll',function(){if(!tick){tick=true;requestAnimationFrame(frame)}},{passive:true});frame();
if(rm&&eimg){eimg.style.opacity=1;etext.style.color='#fff'}
/* intersection tabs */
var tabs=d.querySelectorAll('.ab-tab'),texts=d.querySelectorAll('.ab-tabtext p'),vc=d.querySelectorAll('.ab-venn .vc');
function pick(k){tabs.forEach(function(t){var on=t.dataset.k===k;t.classList.toggle('on',on);t.setAttribute('aria-selected',on)});texts.forEach(function(p){p.hidden=p.dataset.k!==k});vc.forEach(function(c){c.classList.toggle('on',c.dataset.k===k)})}
tabs.forEach(function(t){t.addEventListener('click',function(){pick(t.dataset.k)})});vc.forEach(function(c){c.addEventListener('click',function(){pick(c.dataset.k)})});pick('people');
/* journey words light up */
var jw=d.querySelectorAll('[data-journey] li');
if(io&&!rm){var jo=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){jw.forEach(function(li,i){setTimeout(function(){li.classList.add('on')},i*260)});jo.disconnect()}})},{threshold:.6});var jl=d.querySelector('[data-journey]');if(jl)jo.observe(jl)}else jw.forEach(function(li){li.classList.add('on')});
/* touch move inspire */
var steps=d.querySelectorAll('.ab-tmi-step'),imgs=d.querySelectorAll('.ab-tmi-img');
function act(i){steps.forEach(function(s,k){s.classList.toggle('on',k===i)});imgs.forEach(function(m,k){m.classList.toggle('on',k===i)})}
if('IntersectionObserver' in w){var so=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting)act(+e.target.dataset.i)})},{rootMargin:'-45% 0px -45% 0px'});steps.forEach(function(s){so.observe(s)})}act(0);
steps.forEach(function(s){s.addEventListener('click',function(){act(+s.dataset.i)})});
/* model cards */
d.querySelectorAll('.ab-more').forEach(function(b){b.addEventListener('click',function(){var m=d.getElementById(b.getAttribute('aria-controls')),o=b.getAttribute('aria-expanded')==='true';b.setAttribute('aria-expanded',!o);m.hidden=o;b.closest('.ab-card').toggleAttribute('data-open',!o)})});
/* on the ground modal */
var md=d.getElementById('abModal'),last=null;if(md){
function openG(i){d.querySelectorAll('.ab-g').forEach(function(g){g.hidden=g.dataset.g!==String(i)});md.hidden=false;d.body.style.overflow='hidden';md.querySelector('.ab-x').focus()}
function closeG(){md.hidden=true;d.body.style.overflow='';if(last)last.focus()}
d.querySelectorAll('.ab-tile').forEach(function(t){t.addEventListener('click',function(){last=t;openG(t.dataset.g)})});
md.querySelector('.ab-x').addEventListener('click',closeG);md.addEventListener('click',function(e){if(e.target===md)closeG()});
d.addEventListener('keydown',function(e){if(e.key==='Escape'&&!md.hidden)closeG()});}
/* numbers count up */
if(!rm&&io){var co=new IntersectionObserver(function(es){es.forEach(function(e){if(!e.isIntersecting)return;co.unobserve(e.target);var el=e.target,raw=el.dataset.count,m=raw.match(/^([\\d,]+)(.*)$/);if(!m)return;var end=+m[1].replace(/,/g,''),suf=m[2],t0=null;function st(ts){if(!t0)t0=ts;var p=Math.min(1,(ts-t0)/1200),v=Math.round(end*(1-Math.pow(1-p,3)));el.textContent=v.toLocaleString('en-IN')+suf;if(p<1)requestAnimationFrame(st)}requestAnimationFrame(st)})},{threshold:.6});d.querySelectorAll('[data-count]').forEach(function(el){co.observe(el)})}
})();`;

const ABOUT_CSS = `
.ab{--sp:clamp(72px,10vw,140px)}
.ab section{padding:var(--sp) 0}
.ab-kicker{font:700 13px/1 "DM Sans",sans-serif;letter-spacing:.16em;text-transform:uppercase;color:var(--clay);margin:0 0 16px}
.ab-h{font-size:clamp(36px,5.6vw,72px);max-width:30ch;margin:0 0 .5em}
.ab-p{font-size:clamp(17px,1.6vw,19px);color:var(--ink2);max-width:58ch}
.ab-wide{max-width:70ch;font-size:clamp(19px,2vw,24px);line-height:1.5}
.ab-num{display:block;font:800 15px/1 "Big Shoulders Display","Arial Narrow",sans-serif;letter-spacing:.12em;color:var(--clay);margin-bottom:10px}
.ab-noimg{background:linear-gradient(135deg,#d8d0c3,#c9bfae)}
.abjs .ab .rv{opacity:0;transform:translateY(22px);transition:opacity .8s ease,transform .8s ease}
.abjs .ab .rv.in{opacity:1;transform:none}
/* 1 hero */
.ab-hero{height:165vh;padding:0!important;position:relative;background:var(--night)}
.ab-stick{position:sticky;top:0;height:100vh;overflow:hidden;display:flex;align-items:flex-end}
.ab-bg{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;transform:scale(1.12);will-change:transform}
.ab-stick:after{content:"";position:absolute;inset:0;background:linear-gradient(180deg,rgba(12,16,22,.05) 30%,rgba(12,16,22,.62) 100%)}
.ab-hero-text{position:relative;z-index:2;padding-bottom:clamp(64px,12vh,120px);color:#fff}
.ab-hero-text .ab-kicker{color:#f7d2b2}
.ab-hero h1{font-size:clamp(44px,7.6vw,104px);max-width:14ch;margin:0 0 .3em;text-shadow:0 2px 24px rgba(0,0,0,.35)}
.ab-sub{font-size:clamp(17px,1.9vw,21px);max-width:52ch;margin:0;color:#f2ede6;text-shadow:0 1px 10px rgba(0,0,0,.55)}
.ab-scroll{position:absolute;z-index:2;left:50%;bottom:22px;width:26px;height:42px;border:2px solid rgba(255,255,255,.7);border-radius:20px;transform:translateX(-50%)}
.ab-scroll span{position:absolute;left:50%;top:8px;width:4px;height:8px;margin-left:-2px;border-radius:2px;background:#fff;animation:abs 1.8s infinite}
@keyframes abs{0%{opacity:0;transform:translateY(0)}40%{opacity:1}100%{opacity:0;transform:translateY(14px)}}
/* 2 problem */
.ab-probs{display:grid;grid-template-columns:repeat(3,1fr);gap:22px;margin-top:40px}
.ab-prob{background:var(--card);border:1px solid var(--line);border-radius:var(--r);overflow:hidden;display:flex;flex-direction:column}
.ab-prob-img{width:100%;aspect-ratio:4/3;object-fit:cover;display:block}
.ab-prob-body{padding:24px 24px 28px}
.ab-prob h3{font-size:clamp(24px,2.3vw,30px);margin:0 0 .45em}
.ab-prob p{margin:0;color:var(--ink2)}
.ab-strip{display:flex;flex-wrap:wrap;gap:6px;margin-top:18px;font-size:13px;font-weight:700;letter-spacing:.06em;text-transform:uppercase}
.ab-strip span{padding:5px 10px;border-radius:999px;background:#ece5d9;color:var(--muted)}
.ab-strip span:nth-child(n+5){background:var(--moss);color:var(--forest)}
.ab-strip i{width:100%;height:0}
/* earth */
.ab-earth{height:190vh;padding:0!important;background:var(--paper)}
.ab-earth-stick{position:sticky;top:0;height:100vh;overflow:hidden;display:grid;place-items:center}
.ab-earth-img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;opacity:0;transform:scale(1.1)}
.ab-earth-stick:after{content:"";position:absolute;inset:0;background:rgba(12,16,22,.28);pointer-events:none}
.ab-earth-text{position:relative;z-index:2;margin:0;padding:0 20px;text-align:center;font:800 clamp(52px,11vw,170px)/.92 "Big Shoulders Display","Arial Narrow",sans-serif;text-transform:uppercase;color:var(--ink);transition:color .6s;max-width:12ch;text-shadow:0 2px 30px rgba(0,0,0,.18)}
.ab-earth-text span{display:block;color:#f3c9a6}
/* 3 intersection */
.ab-inter-grid{display:grid;grid-template-columns:1fr 1fr;gap:48px;align-items:center}
.ab-tabs{display:flex;gap:10px;flex-wrap:wrap;margin:8px 0 18px}
.ab-tab{border:1.5px solid var(--line);background:var(--card);border-radius:999px;padding:10px 18px;cursor:pointer;display:flex;flex-direction:column;align-items:flex-start;font:inherit;color:var(--ink);transition:all .2s}
.ab-tab b{font-size:16px}.ab-tab span{font-size:13px;color:var(--muted)}
.ab-tab.on{background:var(--forest);border-color:var(--forest);color:#fff}.ab-tab.on span{color:#cfe0d2}
.ab-tabtext p{font-size:clamp(18px,1.8vw,22px);line-height:1.5;max-width:40ch;min-height:3em;margin:0}
.ab-centerline{margin-top:26px;padding-top:22px;border-top:1px solid var(--line);font-size:18px;color:var(--ink2);max-width:44ch}
.ab-venn{width:100%;max-width:520px;justify-self:center}
.ab-venn .vc{fill:rgba(44,69,53,.07);stroke:var(--forest);stroke-width:1.5;cursor:pointer;transition:fill .3s}
.ab-venn .vc.on{fill:rgba(184,97,47,.16);stroke:var(--clay)}
.ab-venn text{text-anchor:middle;pointer-events:none}
.ab-venn .vl{font:800 19px "Big Shoulders Display","Arial Narrow",sans-serif;letter-spacing:.08em;fill:var(--ink)}
.ab-venn .vs{font:italic 14px "DM Sans",sans-serif;fill:var(--muted)}
.ab-venn .vcore{fill:var(--clay)}
.ab-venn .vcore-t{font:800 14px "Big Shoulders Display","Arial Narrow",sans-serif;letter-spacing:.08em;fill:#fff}
/* 4 experiences */
.ab-exp{background:var(--card);border-top:1px solid var(--line);border-bottom:1px solid var(--line)}
.ab-journey{list-style:none;padding:0;margin:26px 0 54px;display:flex;flex-wrap:wrap;gap:8px 0;counter-reset:j}
.ab-journey li{font:800 clamp(18px,2vw,24px)/1 "Big Shoulders Display","Arial Narrow",sans-serif;text-transform:uppercase;letter-spacing:.04em;color:#cfc6b8;transition:color .5s}
.ab-journey li:not(:last-child):after{content:"→";margin:0 14px;color:#d8d0c3}
.ab-journey li.on{color:var(--ink)}.ab-journey li.on:last-child{color:var(--clay)}
.ab-tmi{display:grid;grid-template-columns:1fr 1fr;gap:48px;align-items:start}
.ab-tmi-step{padding:34px 0 34px 26px;border-left:3px solid var(--line);cursor:pointer;min-height:42vh;display:flex;flex-direction:column;justify-content:center;transition:border-color .4s,opacity .4s;opacity:.38}
.ab-tmi-step.on{border-color:var(--clay);opacity:1}
.ab-tmi-step h3{font-size:clamp(46px,6vw,84px);margin:0 0 .15em}
.ab-tmi-step p{font-size:clamp(18px,1.9vw,23px);margin:0;max-width:30ch;color:var(--ink2)}
.ab-tmi-media{position:sticky;top:110px;aspect-ratio:4/5;border-radius:var(--r);overflow:hidden;background:#d8d0c3}
.ab-tmi-img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;opacity:0;transition:opacity .7s}
.ab-tmi-img.on{opacity:1}
.ab-bigline{font:800 clamp(30px,4.4vw,56px)/1.05 "Big Shoulders Display","Arial Narrow",sans-serif;text-transform:uppercase;margin:64px 0 0;max-width:20ch;color:var(--forest)}
/* 5 model */
.ab-cards{display:grid;grid-template-columns:1fr auto 1fr auto 1fr;gap:16px;align-items:start;margin-top:34px}
.ab-arrow{align-self:center;font-size:32px;color:var(--clay);padding-top:60px}
.ab-card{background:var(--card);border:1px solid var(--line);border-radius:var(--r);overflow:hidden;transition:box-shadow .3s}
.ab-card[data-open]{box-shadow:0 18px 40px -24px rgba(34,29,25,.45);border-color:#d6cbb9}
.ab-card-img{width:100%;aspect-ratio:16/10;object-fit:cover;display:block}
.ab-card-body{padding:22px 22px 24px}
.ab-card h3{font-size:clamp(32px,3.2vw,44px);margin:0 0 .25em}
.ab-card-lead{margin:0 0 14px;color:var(--ink2)}
.ab-more{background:none;border:0;padding:0;font:700 15px "DM Sans",sans-serif;color:var(--clay);cursor:pointer}
.ab-more:after{content:" +"}.ab-more[aria-expanded="true"]:after{content:" −"}
.ab-card-more{margin-top:12px;color:var(--ink2);font-size:15.5px}
.ab-card-more p{margin:0 0 8px}
.ab-list{display:flex;flex-wrap:wrap;gap:6px;list-style:none;padding:0;margin:4px 0 12px}
.ab-list li{background:var(--moss);color:var(--forest);font-weight:700;font-size:13.5px;padding:5px 11px;border-radius:999px}
.ab-steps{list-style:none;padding:0;margin:0;counter-reset:s}
.ab-steps li{counter-increment:s;padding:7px 0 7px 32px;position:relative;border-top:1px dashed var(--line)}
.ab-steps li:before{content:counter(s);position:absolute;left:0;top:7px;width:22px;height:22px;border-radius:50%;background:var(--forest);color:#fff;font-size:12px;font-weight:700;display:grid;place-items:center}
/* 6 gain */
.ab-gain{background:var(--forest);color:#fff}
.ab-gain .ab-kicker{color:#f3c9a6}.ab-gain .ab-p{color:#dfe8e0}
.ab-gain-grid{display:grid;grid-template-columns:1fr 1.1fr;gap:56px;align-items:center}
.ab-ring{width:100%;max-width:480px}
.ab-ring .track{fill:none;stroke:rgba(255,255,255,.22);stroke-width:2;stroke-dasharray:4 8}
.ab-ring .track-path{fill:none;stroke:none}
.ab-ring .dot{fill:#f3c9a6}
.ab-ring .rn circle{fill:var(--forest2);stroke:rgba(255,255,255,.35);stroke-width:1.5}
.ab-ring .rn text{fill:#fff;font:700 12.5px "DM Sans",sans-serif;text-anchor:middle}
.ab-ring .mid{fill:#fff;font:800 34px "Big Shoulders Display","Arial Narrow",sans-serif;text-anchor:middle;text-transform:uppercase}
.ab-gains{display:grid;grid-template-columns:1fr 1fr;gap:18px 28px;margin:26px 0 0}
.ab-gains div{border-top:1px solid rgba(255,255,255,.22);padding-top:12px}
.ab-gains dt{font:800 19px "Big Shoulders Display","Arial Narrow",sans-serif;text-transform:uppercase;letter-spacing:.05em;color:#f3c9a6}
.ab-gains dd{margin:4px 0 0;color:#e6ede7}
/* 7 ground */
.ab-rail{display:flex;gap:16px;overflow-x:auto;scroll-snap-type:x mandatory;scroll-padding-left:max(20px,calc((100vw - var(--max))/2 + 20px));padding:18px max(20px,calc((100vw - var(--max))/2 + 20px)) 22px;scrollbar-width:thin}
.ab-tile{flex:0 0 clamp(250px,28vw,330px);scroll-snap-align:start;border:0;padding:0;background:var(--card);border-radius:var(--r);overflow:hidden;text-align:left;font:inherit;color:var(--ink);box-shadow:0 1px 0 var(--line)}
.ab-bridge{display:inline-block;margin-top:28px;font-size:19px}
.ab-tile-img{width:100%;aspect-ratio:4/5;object-fit:cover;display:block}
.ab-tile-body{display:block;padding:16px 18px 20px}
.ab-tile-body b{display:block;font:800 26px "Big Shoulders Display","Arial Narrow",sans-serif;text-transform:uppercase}
.ab-tile-body span{display:block;color:var(--ink2);font-size:15px;margin:2px 0 10px}
.ab-tile-body em{font-style:normal;font-weight:700;color:var(--clay);font-size:14px}
.ab-modal{position:fixed;inset:0;z-index:1000;background:rgba(12,16,22,.7);display:grid;place-items:center;padding:20px}
.ab-modal[hidden]{display:none}
.ab-modal-card{position:relative;background:var(--card);border-radius:18px;max-width:880px;width:100%;max-height:90vh;overflow:auto}
.ab-g{display:grid;grid-template-columns:1fr 1fr}
.ab-g[hidden]{display:none}
.ab-g-img{width:100%;height:100%;min-height:320px;object-fit:cover;display:block}
.ab-g-body{padding:34px 30px}
.ab-g-body h3{font-size:38px;margin:0 0 .4em}
.ab-g-body p{color:var(--ink2)}
.ab-outcome{background:var(--moss);border-radius:12px;padding:14px 16px;color:var(--forest)!important;font-weight:600}
.ab-outcome span{display:block;font-size:12px;letter-spacing:.14em;text-transform:uppercase;color:var(--clay);margin-bottom:4px}
.ab-x{position:absolute;top:12px;right:12px;z-index:2;width:40px;height:40px;border-radius:50%;border:0;background:rgba(255,255,255,.92);font-size:26px;cursor:pointer;box-shadow:0 2px 10px rgba(0,0,0,.15)}
/* 8 people */
.ab-roles{display:grid;grid-template-columns:repeat(4,1fr);gap:18px;margin-top:30px}
.ab-role{border-top:3px solid var(--forest);padding-top:16px}
.ab-role h3{font-size:28px;margin:0 0 .3em}.ab-role p{margin:0;color:var(--ink2)}
.ab-team{margin-top:48px;background:var(--card);border:1px solid var(--line);border-radius:var(--r);padding:24px}
.ab-team>p{margin:0 0 14px;font-weight:700;color:var(--muted);letter-spacing:.08em;text-transform:uppercase;font-size:13px}
.ab-team ul{list-style:none;padding:0;margin:0 0 14px;display:flex;flex-wrap:wrap;gap:14px 26px}
.ab-team li{display:grid;grid-template-columns:44px auto;grid-template-rows:auto auto;column-gap:10px;align-items:center}
.ab-team img,.ab-av{grid-row:span 2;width:44px;height:44px;border-radius:50%;object-fit:cover}
.ab-av{display:grid;place-items:center;background:var(--moss);color:var(--forest);font-weight:700;font-size:14px}
.ab-team small{color:var(--muted)}
.ab-link{font-weight:700;color:var(--clay);text-decoration:none}
/* 9 origin */
.ab-origin{background:var(--card);border-top:1px solid var(--line)}
.ab-origin-grid{display:grid;grid-template-columns:1fr 1fr;gap:56px;align-items:center}
.ab-origin-img{width:100%;aspect-ratio:4/5;object-fit:cover;border-radius:var(--r)}
.ab-origin-text p:not(.ab-kicker){font-size:clamp(17px,1.6vw,20px);color:var(--ink2);max-width:46ch}
.ab-italic{font-style:italic;color:var(--clay)!important}
/* 10 future */
.ab-ambitions{display:grid;grid-template-columns:repeat(3,1fr);gap:24px;margin-top:40px}
.ab-ambitions div{background:var(--card);border:1px solid var(--line);border-radius:var(--r);padding:26px}
.ab-ambitions h3{font-size:30px;margin:0 0 .3em}.ab-ambitions p{margin:0;color:var(--ink2)}
/* 12 proof */
.ab-facts{display:grid;grid-template-columns:repeat(3,1fr);gap:34px 28px;margin-top:30px}
.ab-facts b{display:block;font:800 clamp(56px,7vw,96px)/1 "Big Shoulders Display","Arial Narrow",sans-serif;color:var(--forest)}
.ab-facts span{display:block;margin-top:6px;color:var(--ink2);max-width:24ch}
.ab-see{display:flex;flex-wrap:wrap;gap:12px 26px;align-items:center;margin-top:48px;padding-top:24px;border-top:1px solid var(--line)}
.ab-see span{font-weight:700;letter-spacing:.12em;text-transform:uppercase;font-size:13px;color:var(--muted)}
.ab-see a{font-weight:700;color:var(--clay);text-decoration:none;font-size:17px}
/* 13 believe */
.ab-believe{background:var(--night);color:#fff}
.ab-believe .ab-kicker{color:#f3c9a6}
.ab-believe ul{list-style:none;padding:0;margin:20px 0 0}
.ab-believe li{font:800 clamp(34px,5.6vw,76px)/1.04 "Big Shoulders Display","Arial Narrow",sans-serif;text-transform:uppercase;padding:.35em 0;border-bottom:1px solid rgba(255,255,255,.1)}
.ab-believe li:last-child{color:#f3c9a6;border:0}
.abjs .ab-believe li.rv{transition-duration:1.1s}
/* 14 end */
.ab-end{position:relative;color:#fff;overflow:hidden;background:var(--night)}
.ab-end-img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;opacity:.42}
.ab-end .wrap{position:relative;z-index:2}
.ab-end-h{font-size:clamp(46px,8vw,112px);color:#f3c9a6;margin:0 0 .4em;max-width:12ch}
.ab-end-cta{display:flex;gap:14px;flex-wrap:wrap}
.ab-end .btn-ghost{color:#fff}
@media(max-width:900px){
.ab-probs,.ab-roles,.ab-ambitions{grid-template-columns:1fr 1fr}
.ab-inter-grid,.ab-gain-grid,.ab-origin-grid{grid-template-columns:1fr;gap:34px}
.ab-cards{grid-template-columns:1fr}.ab-arrow{padding:0;justify-self:center;transform:rotate(90deg)}
.ab-tmi{grid-template-columns:1fr;gap:0}.ab-tmi-media{position:sticky;top:64px;aspect-ratio:16/10;order:-1;z-index:2;margin-bottom:10px}
.ab-tmi-step{min-height:auto;padding:26px 0 26px 18px}
.ab-g{grid-template-columns:1fr}.ab-g-img{min-height:220px;max-height:280px}
.ab-facts{grid-template-columns:1fr 1fr}
}
@media(max-width:600px){
.ab-hero{height:130vh}.ab-earth{height:150vh}
.ab-probs,.ab-roles,.ab-ambitions,.ab-gains{grid-template-columns:1fr}
.ab-journey li:not(:last-child):after{margin:0 8px}
.ab-g-body{padding:24px 20px}
}
@media(prefers-reduced-motion:reduce){.ab-scroll span{animation:none}.ab-bg{transform:none}.ab-ring .dot{display:none}}
`;
