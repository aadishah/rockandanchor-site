// ---------- Curate your own experience ----------
// A guided builder: choices > recommendation logic > example flow > human handoff over WhatsApp.
// Server side: reads the live experiences (Airtable) and sends a small JSON of them to the page.
// Client side: one question at a time, state kept in the URL hash (refresh and shared links keep the choices).
// No new backend: "Send this to Rock & Anchor" opens WhatsApp with the full summary, the same channel the site already uses.

// Activities shown in step 5. A fixed list, but an activity only appears if at least one live
// experience mentions it, so the page never offers something Rock & Anchor does not run.
const CURATE_ACTS = [
  ['trek', 'Trekking', 'A ridge, a forest trail or a hill.', /\btrek|\bhik(e|ing)\b/, 'day'],
  ['waterfall', 'Waterfalls', 'Stand under one, or just listen to it.', /waterfall/, 'day'],
  ['water', 'Streams and lakes', 'Get your feet wet.', /\bstream|\briver|\blake\b|\bfloat|\bsplash|\bswim/, 'day'],
  ['nature', 'Nature exploration', 'Insects, birds, frogs and forests up close.', /wildlife|insect|\bfrog|\bbird|forest|biodiversity|nature walk|\bfungi|\bsnail/, 'day'],
  ['village', 'Village life', 'Spend time where people live and work.', /village/, 'day'],
  ['farming', 'Farming', 'See where food comes from.', /\bfarm|paddy|\brice\b|harvest|sowing|plough/, 'day'],
  ['food', 'Local food', 'Eat what is cooked here.', /\blunch\b|\bdinner\b|\bmeal|maharashtrian|cook/, 'meal'],
  ['games', 'Outdoor games', 'Play, run, laugh.', /\bgames?\b/, 'day'],
  ['skills', 'Outdoor skills', 'Navigation, how to camp, looking after the place.', /navigation|survival|\bknots?\b|leave no trace|how to camp|outdoor skills|camp ?craft/, 'day'],
  ['climbing', 'Rock climbing', 'Hands on rock.', /rock climb|rappel/, 'day'],
  ['cave', 'Caves', 'Step into the cool and dark.', /\bcaves?\b/, 'day'],
  ['trees', 'Tree planting', 'Leave something growing.', /tree planting|plant(ing)? (a )?trees?|sapling/, 'day'],
  ['painting', 'Rock painting', 'Make something with your hands.', /rock painting/, 'day'],
  ['sustain', 'Sustainability activities', 'Waste, compost and what happens next.', /sustainab|compost|vermi/, 'day'],
  ['sunset', 'Sunsets', 'Be somewhere high when the light goes.', /sunset/, 'evening'],
  ['stars', 'Stargazing', 'Telescopes, planets and a dark sky.', /stargaz|telescope|planet|constellation|night sky/, 'night'],
  ['nightwalk', 'Night walks', 'The forest after dark.', /night (walk|trail)|after dark/, 'night'],
  ['camping', 'Camping', 'Sleep in a tent.', /\btents?\b|camping/, 'stay'],
  ['campfire', 'Campfire', 'Stories around a fire.', /campfire|bonfire/, 'night'],
];

function curateData(data) {
  const exps = sorted(data).filter((e) => !(e.categories || []).some((c) => /guide training/i.test(c)));
  const acts = CURATE_ACTS.map(([id, label, line, re, kind]) => ({ id, label, line, kind, re }));
  const out = exps.map((e) => {
    const text = [e.title, e.summary, e.description, e.itinerary].join(' ').toLowerCase(); // FAQs left out: they mention safety (first aid) and logistics, not activities
    const p = priceInfo(e);
    const ages = String(e.age || '').match(/(\d+)\s*(?:to|-|–)\s*(\d+)|(\d+)\s*\+/);
    const t = String(e.timing || '').toLowerCase();
    const hrs = (() => { const m = t.match(/(\d{1,2})(?::(\d\d))?\s*(am|pm)\s*to\s*(\d{1,2})(?::(\d\d))?\s*(am|pm)/); if (!m) return null; const h = (H, M, ap) => ((+H % 12) + (ap === 'pm' ? 12 : 0)) + (+M || 0) / 60; return { start: h(m[1], m[2], m[3]), end: h(m[4], m[5], m[6]) }; })();
    const len = /night|2 days|overnight/.test(t) ? 'night' : hrs ? (hrs.end - hrs.start <= 5.5 ? 'short' : 'day') : /evening|hours/.test(t) ? 'short' : '';
    return {
      s: e.slug, t: e.title, d: shortText(plainText(e.summary || firstLine(e)), 140), c: e.categories || [],
      a: acts.filter((a) => a.re.test(text)).map((a) => a.id),
      img: cover(e), min: p.min, grp: p.group, lab: p.minLabel,
      lo: ages ? +(ages[1] || ages[3]) : 0, hi: ages && ages[2] ? +ages[2] : 99,
      len, eve: !!(hrs && hrs.start >= 15), up: upcoming(data, e).length,
    };
  });
  // Photo per activity: an Airtable slot (curate.act.<id>) if set, otherwise the cover of the most specific
  // experience that offers it (fewest other activities), never repeating a photo.
  const taken = new Set();
  const used = acts.filter((a) => out.some((e) => e.a.includes(a.id))).map((a) => {
    const sl = slot(data, 'curate.act.' + a.id, '');
    let img = sl.src;
    if (!img) {
      const cands = out.filter((e) => e.a.includes(a.id)).sort((x, y) => x.a.length - y.a.length);
      for (const e of cands) { const ex = bySlug(data, e.s); for (const ph of (ex && ex.photos) || []) { if (ph.video || taken.has(ph.thumb)) continue; img = ph.thumb; break; } if (img) break; }
    }
    if (img) taken.add(img);
    return { id: a.id, label: a.label, line: a.line, kind: a.kind, img: img || '' };
  });
  return { exps: out, acts: used };
}

function curatePage(data) {
  const cd = curateData(data);
  const ph = (slug, i) => { const x = bySlug(data, slug); const p = x && x.photos && (x.photos[i] || x.photos[0]); return p ? p.url : cover(sorted(data)[0], true); };
  const heroP = slot(data, 'curate.hero', ph('little-feet-sunset-safari', 2));
  const json = JSON.stringify({ ...cd, wa: SITE.wa, phone: SITE.phone }).replace(/</g, '\\u003c');
  const body = `<style>${CURATE_CSS}</style>
<div class="cu">
<section class="cu-hero"><img src="${esc(heroP.src)}"${posStyle(heroP)} alt="${esc(heroP.alt || 'A group outdoors with Rock & Anchor')}" fetchpriority="high"><div class="wrap">
  <p class="cu-kicker">Curate your own experience</p>
  <h1>Let’s create something that feels like yours.</h1>
  <p class="cu-sub">Tell us who you are bringing, what you want to experience and how much time you have. We’ll help turn it into a Rock &amp; Anchor experience.</p>
  <p class="cu-bring"><b>You bring the people.</b> We bring the place, people and possibilities.</p>
  <a class="btn btn-clay cu-start" href="#curate" data-start>Start curating</a>
</div></section>

<section class="cu-app" id="curate" aria-live="polite"><div class="wrap">
  <noscript><div class="cu-card"><h2>This builder needs JavaScript.</h2><p>Tell us who you are bringing, what you want to do and when, and we will shape it with you.</p><a class="btn btn-clay" href="${waLink('Hi Rock & Anchor, I would like to curate a private experience for my group.')}">${ICON.wa}WhatsApp us</a></div></noscript>
  <div id="cu-root"></div>
</div></section>
</div>
<script type="application/json" id="cu-data">${json}</script>
<script>${CURATE_JS}</script>`;
  return layout({ title: 'Curate your own experience', desc: 'Build an idea for a private Rock & Anchor experience: who is coming, what you want to feel, how much time you have. We shape the rest with you.', path: '/curate', body, image: heroP.src, data });
}

// Client script. Plain ES5 style, no template literals, so it can live inside this file safely.
const CURATE_JS = String.raw`(function(){
var D=JSON.parse(document.getElementById('cu-data').textContent),root=document.getElementById('cu-root');
if(!root)return;
function h(t){return String(t==null?'':t).replace(/[&<>"']/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]})}
var WHO=[['family','Family'],['children','Children'],['friends','Friends'],['college','College group'],['corporate','Corporate or team'],['celebration','Celebration'],['school','School'],['other','Something else']];
var AGES=[['u5','Under 5'],['5-8','5 to 8'],['9-12','9 to 12'],['13-17','13 to 17']];
var AGEN={'u5':[0,4],'5-8':[5,8],'9-12':[9,12],'13-17':[13,17]};
var FEEL=[['explore','Explore','See something new.'],['challenge','Challenge','Push yourself a little.'],['slow','Slow down','Get away from the noise.'],['learn','Learn','Come back knowing something you did not know before.'],['together','Spend time together','Do something that brings everyone into the same moment.'],['village','Village life','Spend time with the people and places that make the Sahyadris what they are.'],['lookup','Look up','Watch the sky. Stay out after dark.'],['kids','Let the kids loose','Give them space to run, discover and get dirty.']];
var LEAVE=[['touched','Touched','Something moved you.'],['moved','Moved','You did something you did not think you would.'],['inspired','Inspired','You saw something differently.']];
var TIME=[['hours','A few hours'],['half','Half day'],['full','Full day'],['night','One night'],['weekend','Weekend'],['flex','I’m flexible']];
var LOCAL=[['meal','Eat a local meal'],['hosts','Meet local hosts'],['farming','Learn about farming'],['tradition','Try something traditionally done here'],['stories','Hear stories about the place'],['stay','Stay in or near the village'],['suggest','Let Rock & Anchor suggest something']];
var PACE=[['slow','Slow','More pauses. Less rushing.'],['balanced','Balanced','A little bit of everything.'],['active','Active','Keep us moving.'],['decide','Let Rock & Anchor decide','You know the place. Surprise us.']];
var STEPS=[['who','Who are you bringing with you?'],['feel','What do you want this experience to feel like?'],['leave','When you head home, what do you want to take with you?'],['time','How much time do you want to give this?'],['do','What do you want to do?'],['local','Would you like to bring the village into your experience?'],['pace','How do you want the day to move?'],['care','Before we put it together']];
var MONTHS=['January','February','March','April','May','June','July','August','September','October','November','December'];
var S={step:-1,who:[],n:0,ages:[],feel:[],leave:[],time:'',when:'',date:'',month:'',acts:[],local:[],pace:'',ok:0};
var ACT={};D.acts.forEach(function(a){ACT[a.id]=a});
function lab(list,id){for(var i=0;i<list.length;i++)if(list[i][0]===id)return list[i][1];return id}
function labs(list,ids){return ids.map(function(i){return lab(list,i)})}
function has(k,v){return S[k].indexOf(v)>-1}
function tog(k,v){var i=S[k].indexOf(v);if(i>-1)S[k].splice(i,1);else S[k].push(v)}
// state in the URL hash, so refresh, back button and shared links keep the choices
function enc(o){try{return btoa(unescape(encodeURIComponent(JSON.stringify(o)))).replace(/\+/g,'-').replace(/\//g,'_').replace(/=+$/,'')}catch(e){return''}}
function dec(s){try{s=s.replace(/-/g,'+').replace(/_/g,'/');return JSON.parse(decodeURIComponent(escape(atob(s))))}catch(e){return null}}
function save(){if(S.step<0){if(location.hash)try{history.replaceState(null,'',location.pathname+location.search)}catch(e){}return}var o={};for(var k in S)o[k]=S[k];var u=location.pathname+'#c='+enc(o);try{history.replaceState(null,'',u)}catch(e){}}
function load(){var m=location.hash.match(/c=([\w-]+)/);if(!m)return;var o=dec(m[1]);if(!o)return;for(var k in S)if(k in o&&typeof o[k]===typeof S[k])S[k]=o[k];if(S.step>STEPS.length)S.step=STEPS.length}
function link(){return location.origin+location.pathname+'#c='+enc(S)}

function opt(k,id,title,line,multi,img){var on=multi?has(k,id):S[k]===id;return '<button type="button" class="cu-opt'+(on?' on':'')+(img?' img':'')+'" data-k="'+k+'" data-v="'+h(id)+'"'+(multi?'':' data-one="1"')+' aria-pressed="'+on+'">'+(img?'<span class="cu-opt-ph" style="background-image:url(\''+h(img)+'\')"></span>':'')+'<span class="cu-opt-t">'+h(title)+'</span>'+(line?'<span class="cu-opt-l">'+h(line)+'</span>':'')+'<span class="cu-tick" aria-hidden="true"></span></button>'}
function grid(k,list,multi,cls){return '<div class="cu-grid '+(cls||'')+'">'+list.map(function(o){return opt(k,o[0],o[1],o[2],multi)}).join('')+'</div>'}

function stepHtml(){
  var id=STEPS[S.step][0],q=STEPS[S.step][1],x='';
  if(id==='who'){
    x+='<p class="cu-hint">Pick all that fit.</p>'+grid('who',WHO,1,'cu-grid-s');
    x+='<div class="cu-sub2"><h3>How many people?</h3><div class="cu-num"><button type="button" class="cu-nb" data-n="-1" aria-label="One less">−</button><input id="cu-n" type="number" inputmode="numeric" min="1" max="999" value="'+(S.n||'')+'" placeholder="0" aria-label="Number of people"><button type="button" class="cu-nb" data-n="1" aria-label="One more">+</button></div>'+(S.n>40?'<p class="cu-note">A big group. We will plan this one with you directly, and may split it into smaller groups on the trail.</p>':'')+'</div>';
    if(has('who','children')||has('who','school')||has('who','family'))x+='<div class="cu-sub2"><h3>What ages are the children?</h3><p class="cu-hint">Pick all that apply. Skip if no children are coming.</p>'+grid('ages',AGES,1,'cu-grid-s')+'</div>';
  }
  if(id==='feel')x+='<p class="cu-hint">Pick as many as you like.</p>'+grid('feel',FEEL,1);
  if(id==='leave')x+='<p class="cu-hint">Pick one, two or all three.</p>'+grid('leave',LEAVE,1,'cu-grid-3');
  if(id==='time'){
    x+=grid('time',TIME.map(function(t){return [t[0],t[1]]}),0,'cu-grid-s');
    x+='<div class="cu-sub2"><h3>When?</h3><p class="cu-hint">You don’t need an exact date yet.</p>'+grid('when',[['date','A specific date'],['month','A month or season'],['flex','Flexible']],0,'cu-grid-s');
    if(S.when==='date'){var t=new Date(),iso=t.toISOString().slice(0,10);x+='<input class="cu-date" id="cu-date" type="date" min="'+iso+'" value="'+h(S.date)+'" aria-label="Preferred date">'}
    if(S.when==='month'){var mm=[],d=new Date();for(var i=0;i<12;i++){var dd=new Date(d.getFullYear(),d.getMonth()+i,1);mm.push([MONTHS[dd.getMonth()]+' '+dd.getFullYear(),MONTHS[dd.getMonth()].slice(0,3)+' '+String(dd.getFullYear()).slice(2)])}mm.push(['Monsoon (June to September)','Monsoon'],['Winter (November to February)','Winter']);x+='<div class="cu-grid cu-grid-m">'+mm.map(function(m){return opt('month',m[0],m[1],'',0)}).join('')+'</div>'}
    x+='</div>';
  }
  if(id==='do'){x+='<p class="cu-hint">These all come from experiences we already run. Pick what sounds good.</p><div class="cu-grid cu-grid-img">'+D.acts.map(function(a){return opt('acts',a.id,a.label,a.line,1,a.img)}).join('')+'</div>'}
  if(id==='local')x+='<p class="cu-hint">These are real people who live here, not an attraction. Pick any that interest you.</p>'+grid('local',LOCAL,1,'cu-grid-s');
  if(id==='pace')x+='<p class="cu-hint">The same day can feel very different depending on pace.</p>'+grid('pace',PACE,0,'cu-grid-2');
  if(id==='care'){x+='<p class="cu-lead">Every experience we create happens somewhere that already belongs to someone and something.</p><ul class="cu-care">'+['Leave No Trace.','Respect wildlife.','Respect communities.','Do not disturb fragile places.','Think before sharing sensitive locations.'].map(function(p){return '<li>'+p+'</li>'}).join('')+'</ul><p class="cu-hint">More on this on our <a href="/values">Values</a> page.</p>'}
  return '<p class="cu-q-k">Step '+(S.step+1)+' of '+STEPS.length+'</p><h2 class="cu-q">'+h(q)+'</h2>'+x;
}
function canNext(){var id=STEPS[S.step][0];if(id==='who')return S.who.length>0&&S.n>0;return true}
function nextLabel(){var id=STEPS[S.step][0],k={feel:'feel',leave:'leave',time:'time',do:'acts',local:'local',pace:'pace'}[id];if(id==='care')return 'Sounds good';if(k&&(S[k]==='' ||S[k].length===0))return 'Skip for now';return 'Next'}
function progress(){return '<div class="cu-prog" role="progressbar" aria-valuemin="1" aria-valuemax="'+STEPS.length+'" aria-valuenow="'+(S.step+1)+'"><div class="cu-prog-bar" style="width:'+Math.round((S.step+1)/STEPS.length*100)+'%"></div></div><ol class="cu-dots">'+STEPS.map(function(s,i){return '<li class="'+(i<S.step?'done':i===S.step?'now':'')+'"><button type="button" data-go="'+i+'"'+(i>S.step?' disabled':'')+'>'+(i+1)+'</button></li>'}).join('')+'</ol>'}

// recommendation logic: score each live experience against the choices
var FEELW={explore:{c:['Treks','Wildlife & Nature'],a:['trek','nature','waterfall','cave']},challenge:{c:['Treks'],a:['trek','climbing','skills']},slow:{c:['Village Life','Camping & Overnight'],a:['village','campfire','sunset','water']},learn:{c:['Schools & Camps','Wildlife & Nature'],a:['nature','stars','farming','skills','sustain']},together:{c:['Corporate & Private Groups','Family & Kids'],a:['games','food','campfire']},village:{c:['Village Life'],a:['village','farming','food']},lookup:{c:['Stargazing','Evenings'],a:['stars','nightwalk','sunset']},kids:{c:['Family & Kids'],a:['water','games','nature']}};
function month(){var m=-1;if(S.when==='date'&&S.date)m=new Date(S.date).getMonth();else if(S.when==='month'&&S.month){if(/^Monsoon/.test(S.month))m=7;else if(/^Winter/.test(S.month))m=0;else m=MONTHS.indexOf(S.month.split(' ')[0])}return m<0?new Date().getMonth():m}
function score(e){
  var s=0,i,c=e.c;function hc(x){return c.indexOf(x)>-1}
  S.acts.forEach(function(a){if(e.a.indexOf(a)>-1)s+=3});
  S.feel.forEach(function(f){var w=FEELW[f];if(!w)return;w.c.forEach(function(x){if(hc(x))s+=2});w.a.forEach(function(x){if(e.a.indexOf(x)>-1)s+=1})});
  if((has('who','children')||has('who','family'))&&hc('Family & Kids'))s+=2;
  if(has('who','school')&&(hc('Schools & Camps')||hc('Family & Kids')))s+=2;
  if((has('who','corporate')||has('who','college'))&&hc('Corporate & Private Groups'))s+=2;
  for(i=0;i<S.ages.length;i++){var r=AGEN[S.ages[i]];if(r&&(r[1]<e.lo||r[0]>e.hi)){s-=4;break}}
  var t=S.time,L=e.len;
  if(t==='hours'){s+=L==='short'?2:L==='night'?-8:-1}
  if(t==='half'){s+=L==='short'?2:L==='night'?-8:0}
  if(t==='full'){s+=L==='day'?2:L==='short'?1:-8}
  if(t==='night'||t==='weekend'){s+=L==='night'?3:0}
  if(S.local.length&&(hc('Village Life')||e.a.indexOf('village')>-1))s+=1;
  if(has('local','meal')&&e.a.indexOf('food')>-1)s+=1;
  if(hc('Monsoon')||/^monsoon/i.test(e.t)){var m=month();if(m<5||m>8)s-=4}
  if(e.up)s+=1;
  return s;
}
function recs(){return D.exps.map(function(e){return{e:e,s:score(e)}}).filter(function(x){return x.s>=4}).sort(function(a,b){return b.s-a.s}).slice(0,3).map(function(x){return x.e})}

// example flow, built from the chosen time, pace, activities and local layer
function flow(){
  var pace=S.pace==='decide'||!S.pace?'balanced':S.pace,per={slow:2,balanced:3,active:4}[pace];
  var day=[],eve=[],night=[],stay=0;
  S.acts.forEach(function(a){var x=ACT[a];if(!x)return;if(x.kind==='night')night.push(x.label);else if(x.kind==='evening')eve.push(x.label);else if(x.kind==='stay')stay=1;else if(x.kind==='day')day.push(x.label)});
  if(has('feel','lookup')&&!night.length&&ACT.stars)night.push(ACT.stars.label);
  var loc=[];if(has('local','hosts'))loc.push('Time with local hosts');if(has('local','farming')&&S.acts.indexOf('farming')<0)loc.push('Learning about farming');if(has('local','tradition'))loc.push('Something traditionally done here');if(has('local','stories'))loc.push('Stories about the place');if(has('local','suggest'))loc.push('A local moment we pick for you');
  day=day.concat(loc);
  if(!day.length)day=['Nature exploration','Something we choose for you'];
  var meal=has('local','meal')||S.acts.indexOf('food')>-1?'Lunch, cooked locally':'Lunch';
  var dinner=has('local','meal')||S.acts.indexOf('food')>-1?'Dinner, cooked locally':'Dinner';
  var q=day.slice(0,per+1),take=function(f){return q.length?q.shift():f};
  var dark=night.length>0,F=[],t=S.time||'flex';
  function add(time,what,d){F.push([time,what,d||''])}
  if(t==='hours'){
    if(dark||eve.length){add('16:00','Arrive');add('16:30',take('A short walk'));add('18:00',eve[0]||'Sunset');add('18:45',night[0]||take('Something we choose for you'));if(has('local','meal'))add('19:45','Dinner, cooked locally');add('20:30','Head home')}
    else{add('07:00','Arrive');add('07:30',take('A short walk'));if(pace!=='slow')add('09:00',take('Something we choose for you'));add('10:30','Head home')}
  }else if(t==='half'){
    if(dark){add('15:00','Arrive');add('15:30',take('A short walk'));if(pace!=='slow')add('16:45',take('Something we choose for you'));add('18:00',eve[0]||'Sunset');add('19:00',night[0]);if(has('local','meal'))add('20:15','Dinner, cooked locally');add('21:00','Head home')}
    else{add('08:00','Arrive');add('08:30',take('Nature exploration'));add('10:30',take('Something we choose for you'));if(pace==='active')add('11:45',take('One more thing'));add('13:00',has('local','meal')?'Lunch, cooked locally, then head home':'Head home')}
  }else if(t==='night'||t==='weekend'){
    var D1=t==='weekend'?'Day 1':'',D2='Day 2';
    if(t==='weekend'){add('09:00','Arrive',D1);add('09:30',take('Nature exploration'),D1);add('13:00',meal,D1);add('14:30',pace==='slow'?'Free time and rest':take('Something we choose for you'),D1)}
    else{add('15:00','Arrive',D1||'Day 1');add('15:30',take('Nature exploration'),'Day 1')}
    var d1=t==='weekend'?'Day 1':'Day 1';
    add('17:30',eve[0]||'Sunset',d1);add('19:30',dinner,d1);add('20:30',night.length?night.join(' and '):'Campfire and stories',d1);add('22:00',stay||has('local','stay')?(has('local','stay')?'Sleep in or near the village':'Sleep in tents'):'Sleep',d1);
    add('06:30','Sunrise and a slow morning',D2);add('08:30','Breakfast',D2);add('09:30',take(pace==='slow'?'Free time by the water':'One more thing'),D2);if(t==='weekend'&&pace!=='slow')add('11:30',take('Something we choose for you'),D2);add(t==='weekend'?'13:00':'11:30',t==='weekend'?meal+', then head home':'Head home',D2);
  }else{
    add('09:00','Arrive');add('09:30',take('Nature exploration'));add('11:30',take('Something we choose for you'));add('13:00',meal);
    add('14:30',pace==='slow'?'Free time, rest by the water':take('Free time and rest'));
    if(pace==='active')add('16:00',take('One more thing'));else if(pace==='balanced'&&q.length)add('16:00',take(''));
    add('18:00',eve[0]||'Sunset');if(dark){add('19:00',night.join(' and '));add('21:00','Head home')}else add('19:00','Head home');
  }
  return F;
}

function whoText(){var w=labs(WHO,S.who).join(' and ');return (S.n?S.n+(S.n===1?' person':' people'):'')+(w?(S.n?', ':'')+w.toLowerCase():'')+(S.ages.length?' (children '+labs(AGES,S.ages).join(', ').toLowerCase()+')':'')}
function whenText(){if(S.when==='date'&&S.date){var d=new Date(S.date);return d.toLocaleDateString('en-IN',{day:'numeric',month:'long',year:'numeric'})}if(S.when==='month'&&S.month)return S.month;return 'Flexible'}
function rows(){return [['Who',whoText()||'Not sure yet'],['Looking for',labs(FEEL,S.feel).join(' + ')||'Open to ideas'],['Leave feeling',labs(LEAVE,S.leave).join(' + ')||'We’ll see'],['Time',(function(){var a=S.time&&S.time!=='flex'?lab(TIME,S.time):'',w=whenText();return a?a+', '+(w==='Flexible'?'flexible on dates':w):(w==='Flexible'?'Flexible':'Flexible on length, '+w)})()],['Doing',S.acts.map(function(a){return ACT[a]?ACT[a].label:a}).join(', ')||'Your call'],['Local layer',labs(LOCAL,S.local).join(', ')||'Not this time'],['Pace',lab(PACE,S.pace)||'Balanced']]}
function rupees(n){return '₹'+Number(n).toLocaleString('en-IN')}
function summaryText(R,F){
  var t='Hi Rock & Anchor, I used Curate on your website. Here’s what we’re imagining:\n\n'+rows().map(function(r){return r[0]+': '+r[1]}).join('\n');
  t+='\n\nAn example of how the day could go:\n'+F.map(function(f){return (f[2]?f[2]+', ':'')+f[0]+'  '+f[1]}).join('\n');
  if(R.length)t+='\n\nExperiences the page suggested: '+R.map(function(e){return e.t}).join(', ');
  return t+'\n\nMy choices: '+link();
}
function summaryHtml(){
  var R=recs(),F=flow(),txt=summaryText(R,F);
  var x='<p class="cu-q-k">Your idea</p><h2 class="cu-q">Here’s what we’re imagining.</h2>';
  x+='<dl class="cu-sum">'+rows().map(function(r){return '<div><dt>'+h(r[0])+'</dt><dd>'+h(r[1])+'</dd></div>'}).join('')+'</dl>';
  var days={};F.forEach(function(f){var k=f[2]||'';(days[k]=days[k]||[]).push(f)});
  x+='<div class="cu-flow"><h3>An example of how we could shape your day</h3><p class="cu-hint">This is a sketch from your choices, not a confirmed plan. We shape the real one with you.</p>'+Object.keys(days).map(function(k){return (k?'<p class="cu-day">'+h(k)+'</p>':'')+'<ol class="cu-tl">'+days[k].map(function(f){return '<li><time>'+h(f[0])+'</time><span>'+h(f[1])+'</span></li>'}).join('')+'</ol>'}).join('')+'</div>';
  x+='<div class="cu-recs"><h3>Based on what you told us, you might enjoy…</h3>';
  if(R.length){x+='<div class="grid cu-rgrid">'+R.map(function(e){return '<a class="card" href="/experiences/'+h(e.s)+'"><div class="ph">'+(e.img?'<img src="'+h(e.img)+'" alt="'+h(e.t)+'" loading="lazy">':'')+'</div><div class="body"><span class="cat">'+h(e.c.slice(0,2).join(' · '))+'</span><h3>'+h(e.t)+'</h3><p>'+h(e.d)+'</p><span class="cu-price">'+(e.min?'From '+rupees(e.min)+(e.grp?' per group':' per person'):'Price on request')+'</span></div></a>'}).join('')+'</div><p class="cu-hint">We can run any of these privately for your group, or combine parts of them.</p>'}
  else x+='<p class="cu-none">We’ll build something around what you told us.</p>';
  x+='</div>';
  var pp=R.filter(function(e){return e.min&&!e.grp}).map(function(e){return e.min});
  x+='<div class="cu-cost"><h3>What it might cost</h3>'+(pp.length?'<p>Experiences like this usually start from <b>'+rupees(Math.min.apply(null,pp))+' per person</b>. This is indicative only.</p>':'')+'<p>We’ll work out the exact cost once we know the group and date.</p></div>';
  x+='<div class="cu-hand"><p class="cu-ing">You have given us the ingredients.<br>We’ll help you turn them into an experience.</p><p>Someone from Rock &amp; Anchor will look at what you have chosen and get back to you.</p>';
  x+='<a class="btn btn-clay cu-send" href="https://wa.me/'+D.wa+'?text='+encodeURIComponent(txt)+'" target="_blank" rel="noopener">Send this to Rock &amp; Anchor</a>';
  x+='<p class="cu-hint">Opens WhatsApp with your idea already written. Or call us on '+h(D.phone)+'.</p></div>';
  x+='<div class="cu-share"><h3>Share this idea with your group</h3><div class="cu-share-b"><a class="btn btn-ghost" href="https://wa.me/?text='+encodeURIComponent('Here’s an idea for our trip with Rock & Anchor:\n\n'+rows().map(function(r){return r[0]+': '+r[1]}).join('\n')+'\n\nSee it here: '+link())+'" target="_blank" rel="noopener">Share on WhatsApp</a><button type="button" class="btn btn-ghost" data-copy="text">Copy summary</button><button type="button" class="btn btn-ghost" data-copy="link">Copy link</button></div><p class="cu-copied" aria-live="polite"></p></div>';
  x+='<div class="cu-edit"><button type="button" class="cu-link" data-go="0">Change my answers</button><button type="button" class="cu-link" data-reset>Start again</button></div>';
  root._txt=txt;return x;
}

function render(focus){
  save();
  if(S.step<0){root.innerHTML='<div class="cu-intro"><p class="cu-q-k">How this works</p><h2 class="cu-q">Eight quick questions. Then we put it together.</h2><ol class="cu-how"><li><b>You choose.</b> Who, what, how long, how fast.</li><li><b>We sketch it.</b> An example day and experiences that fit.</li><li><b>We talk.</b> Someone from our team shapes it with you.</li></ol><button type="button" class="btn btn-clay" data-next>Start curating</button></div>';return}
  if(S.step>=STEPS.length){root.innerHTML='<div class="cu-done">'+summaryHtml()+'</div>';if(focus)root.querySelector('.cu-q').focus();return}
  root.innerHTML=progress()+'<div class="cu-step">'+stepHtml()+'</div><div class="cu-bar"><button type="button" class="btn btn-ghost cu-back" data-back>'+(S.step?'Back':'Back to start')+'</button><button type="button" class="btn btn-clay cu-next" data-next'+(canNext()?'':' disabled')+'>'+nextLabel()+'</button></div>'+(STEPS[S.step][0]==='who'&&!canNext()?'<p class="cu-need">Pick who is coming and how many people to continue.</p>':'');
  if(focus){var q=root.querySelector('.cu-q');if(q){q.setAttribute('tabindex','-1');q.focus({preventScroll:true})}var top=document.getElementById('curate').getBoundingClientRect().top+window.scrollY-70;if(Math.abs(window.scrollY-top)>40)window.scrollTo({top:top,behavior:'smooth'})}
}
function bigNote(){var w=root.querySelector('.cu-num'),n=root.querySelector('.cu-note');if(!w)return;if(S.n>40&&!n){n=document.createElement('p');n.className='cu-note';n.textContent='A big group. We will plan this one with you directly, and may split it into smaller groups on the trail.';w.insertAdjacentElement('afterend',n)}else if(S.n<=40&&n)n.remove()}
function refreshBar(){var b=root.querySelector('.cu-next');if(b){b.disabled=!canNext();b.textContent=nextLabel()}var n=root.querySelector('.cu-need');if(n&&canNext())n.remove()}
root.addEventListener('click',function(ev){
  var b=ev.target.closest('button,a');if(!b||!root.contains(b))return;
  if(b.dataset.k){var k=b.dataset.k,v=b.dataset.v;if(b.dataset.one){S[k]=S[k]===v?'':v}else tog(k,v);
    if(k==='who'&&!(has('who','children')||has('who','school')||has('who','family')))S.ages=[];
    if(k==='when'||k==='who'||k==='time'){render();return}
    b.classList.toggle('on');b.setAttribute('aria-pressed',b.classList.contains('on'));if(b.dataset.one){root.querySelectorAll('[data-k="'+k+'"]').forEach(function(o){if(o!==b){o.classList.remove('on');o.setAttribute('aria-pressed','false')}})}save();refreshBar();return}
  if(b.dataset.n){S.n=Math.max(0,Math.min(999,(+S.n||0)+(+b.dataset.n)));var i=root.querySelector('#cu-n');if(i)i.value=S.n||'';save();refreshBar();bigNote();return}
  if(b.hasAttribute('data-next')){if(S.step>=0&&!canNext())return;S.step++;render(1);return}
  if(b.hasAttribute('data-back')){S.step--;render(1);return}
  if(b.dataset.go){S.step=+b.dataset.go;render(1);return}
  if(b.hasAttribute('data-reset')){S={step:0,who:[],n:0,ages:[],feel:[],leave:[],time:'',when:'',date:'',month:'',acts:[],local:[],pace:'',ok:0};render(1);return}
  if(b.dataset.copy){var t=b.dataset.copy==='link'?link():root._txt,msg=root.querySelector('.cu-copied');var done=function(){if(msg)msg.textContent=b.dataset.copy==='link'?'Link copied.':'Summary copied.'};
    if(navigator.clipboard&&navigator.clipboard.writeText)navigator.clipboard.writeText(t).then(done,function(){fallback(t);done()});else{fallback(t);done()}}
});
function fallback(t){var a=document.createElement('textarea');a.value=t;a.setAttribute('readonly','');a.style.position='fixed';a.style.opacity='0';document.body.appendChild(a);a.select();try{document.execCommand('copy')}catch(e){}a.remove()}
root.addEventListener('input',function(ev){if(ev.target.id==='cu-n'){var v=parseInt(ev.target.value,10);S.n=isNaN(v)?0:Math.max(0,Math.min(999,v));save();refreshBar();bigNote()}if(ev.target.id==='cu-date'){S.date=ev.target.value;save()}});
document.querySelectorAll('[data-start]').forEach(function(a){a.addEventListener('click',function(e){e.preventDefault();if(S.step<0)S.step=0;render(1)})});
load();render();
})();`;

const CURATE_CSS = `
.cu-hero{position:relative;min-height:clamp(460px,72vh,660px);display:flex;align-items:flex-end;color:#fff;background:var(--night);overflow:hidden}
.cu-hero img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover}
.cu-hero:after{content:"";position:absolute;inset:0;background:linear-gradient(90deg,rgba(12,16,22,.72) 0%,rgba(12,16,22,.45) 45%,rgba(12,16,22,.05) 75%),linear-gradient(180deg,rgba(12,16,22,.25) 0%,rgba(12,16,22,0) 40%,rgba(12,16,22,.55) 100%)}
@media(max-width:720px){.cu-hero:after{background:linear-gradient(180deg,rgba(12,16,22,.35) 0%,rgba(12,16,22,.55) 45%,rgba(12,16,22,.85) 100%)}}
.cu-hero .wrap{position:relative;z-index:2;padding-bottom:clamp(44px,8vh,88px);width:100%}
.cu-kicker,.cu-q-k{font:700 13px/1.4 "DM Sans",sans-serif;letter-spacing:.16em;text-transform:uppercase;color:var(--clay);margin:0 0 14px}
.cu-hero .cu-kicker{color:#f7d2b2;text-shadow:0 1px 8px rgba(0,0,0,.6)}
.cu-hero h1{font-size:clamp(42px,6.6vw,88px);max-width:15ch;margin:0 0 .3em;text-shadow:0 2px 20px rgba(0,0,0,.35)}
.cu-sub{font-size:clamp(17px,1.9vw,21px);max-width:52ch;margin:0 0 14px;color:#f2ede6;text-shadow:0 1px 10px rgba(0,0,0,.5)}
.cu-bring{margin:0 0 26px;color:#f3c9a6;font-size:clamp(16px,1.7vw,19px);text-shadow:0 1px 8px rgba(0,0,0,.6)}.cu-bring b{color:#fff}
.cu-app{background:#efe7da;padding:clamp(44px,7vw,90px) 0;min-height:70vh;scroll-margin-top:60px}
.cu-app .wrap{max-width:980px}
#cu-root{background:var(--card);border:1px solid var(--line);border-radius:24px;padding:clamp(20px,4vw,48px);box-shadow:0 30px 60px -40px rgba(34,29,25,.35)}
.cu-q{font-size:clamp(30px,4.4vw,52px);margin:0 0 10px;max-width:22ch;outline:none}
.cu-hint{color:var(--muted);font-size:15.5px;margin:0 0 18px}.cu-hint a{color:var(--clay);font-weight:700}
.cu-lead{font-size:clamp(19px,2.2vw,24px);font-weight:500;max-width:40ch;margin:6px 0 18px}
.cu-prog{height:6px;border-radius:999px;background:var(--line);overflow:hidden;margin:0 0 12px}
.cu-prog-bar{height:100%;background:var(--forest);border-radius:999px;transition:width .35s ease}
.cu-dots{list-style:none;display:flex;gap:8px;padding:0;margin:0 0 28px;flex-wrap:wrap}
.cu-dots button{width:32px;height:32px;border-radius:50%;border:1.5px solid var(--line);background:var(--paper);font:700 13px "DM Sans",sans-serif;color:var(--muted);cursor:pointer}
.cu-dots .done button{background:var(--moss);border-color:var(--moss);color:var(--forest)}
.cu-dots .now button{background:var(--forest);border-color:var(--forest);color:#fff}
.cu-dots button:disabled{cursor:default;opacity:.6}
.cu-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(210px,1fr));gap:12px;margin:0 0 8px}
.cu-grid-s{grid-template-columns:repeat(auto-fill,minmax(160px,1fr))}
.cu-grid-2{grid-template-columns:repeat(2,minmax(0,1fr))}
.cu-grid-3{grid-template-columns:repeat(3,minmax(0,1fr))}
.cu-grid-m{grid-template-columns:repeat(auto-fill,minmax(110px,1fr));margin-top:12px}
.cu-grid-img{grid-template-columns:repeat(auto-fill,minmax(200px,1fr))}
.cu-opt{position:relative;text-align:left;display:flex;flex-direction:column;gap:6px;min-height:64px;padding:16px 46px 16px 18px;border-radius:16px;border:2px solid var(--line);background:var(--paper);color:var(--ink);cursor:pointer;font:inherit;transition:border-color .15s,background .15s,transform .1s;-webkit-tap-highlight-color:transparent}
.cu-opt:hover{border-color:#cdbfa9}.cu-opt:active{transform:scale(.98)}
.cu-opt:focus-visible{outline:3px solid var(--clay);outline-offset:2px}
.cu-opt-t{font-weight:700;font-size:18px;line-height:1.2}
.cu-grid-2 .cu-opt-t,.cu-grid-3 .cu-opt-t,.cu-grid:not(.cu-grid-s):not(.cu-grid-m):not(.cu-grid-img) .cu-opt-t{font:800 24px/1.05 "Big Shoulders Display","Arial Narrow",sans-serif;text-transform:uppercase;letter-spacing:.02em}
.cu-opt-l{color:var(--ink2);font-size:15px;line-height:1.4}
.cu-tick{position:absolute;top:14px;right:14px;width:24px;height:24px;border-radius:50%;border:2px solid var(--line);background:#fff}
.cu-opt.on{border-color:var(--forest);background:var(--moss)}
.cu-opt.on .cu-tick{background:var(--forest);border-color:var(--forest)}
.cu-opt.on .cu-tick:after{content:"";position:absolute;left:7px;top:3px;width:6px;height:11px;border:solid #fff;border-width:0 2.5px 2.5px 0;transform:rotate(45deg)}
.cu-grid-m .cu-opt{min-height:48px;padding:12px 14px;align-items:center;text-align:center}.cu-grid-m .cu-tick{display:none}.cu-grid-m .cu-opt-t{font-size:15px}
.cu-opt.img{padding:0 0 14px;overflow:hidden}.cu-opt.img .cu-opt-t,.cu-opt.img .cu-opt-l{padding:0 46px 0 16px}
.cu-opt-ph{display:block;aspect-ratio:16/10;background:#d8d0c3 center/cover;margin-bottom:6px}
.cu-opt.img .cu-tick{top:auto;bottom:14px}
.cu-opt.img.on .cu-opt-ph{box-shadow:inset 0 0 0 4px var(--forest)}
.cu-sub2{margin-top:30px;padding-top:24px;border-top:1px solid var(--line)}
.cu-sub2 h3{font-size:clamp(24px,2.8vw,32px);margin:0 0 8px}
.cu-num{display:inline-flex;align-items:center;border:2px solid var(--line);border-radius:999px;background:var(--paper);overflow:hidden}
.cu-nb{width:56px;height:56px;border:0;background:transparent;font-size:28px;cursor:pointer;color:var(--forest)}
.cu-num input{width:90px;height:56px;border:0;background:transparent;text-align:center;font:800 28px "DM Sans",sans-serif;color:var(--ink);-moz-appearance:textfield}
.cu-num input::-webkit-outer-spin-button,.cu-num input::-webkit-inner-spin-button{-webkit-appearance:none;margin:0}
.cu-note{margin:12px 0 0;color:var(--clay2);font-size:15px}
.cu-date{margin-top:14px;font:600 18px "DM Sans",sans-serif;padding:12px 16px;border-radius:14px;border:2px solid var(--line);background:var(--paper);color:var(--ink);min-height:52px}
.cu-care{list-style:none;padding:0;margin:0 0 14px;display:grid;gap:10px}
.cu-care li{font:800 clamp(24px,3vw,34px)/1.1 "Big Shoulders Display","Arial Narrow",sans-serif;padding:12px 0;border-bottom:1px solid var(--line);color:var(--forest)}
.cu-bar{display:flex;justify-content:space-between;gap:12px;margin-top:30px;padding-top:20px;border-top:1px solid var(--line)}
.cu-bar .btn{min-height:52px;justify-content:center}
.cu-next:disabled{opacity:.45;cursor:not-allowed}
.cu-need{margin:10px 0 0;text-align:right;color:var(--muted);font-size:14.5px}
.cu-intro{text-align:left}.cu-how{list-style:none;padding:0;margin:10px 0 28px;display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:12px;counter-reset:h}
.cu-how li{counter-increment:h;background:var(--paper);border:1px solid var(--line);border-radius:16px;padding:18px;color:var(--ink2)}
.cu-how li:before{content:counter(h);display:grid;place-items:center;width:30px;height:30px;border-radius:50%;background:var(--forest);color:#fff;font-weight:800;margin-bottom:10px}
.cu-how b{display:block;color:var(--ink);font-size:18px}
.cu-sum{display:grid;grid-template-columns:repeat(auto-fill,minmax(250px,1fr));gap:0 28px;margin:16px 0 30px}
.cu-sum div{padding:14px 0;border-top:1px solid var(--line)}
.cu-sum dt{font:700 12px/1 "DM Sans",sans-serif;letter-spacing:.14em;text-transform:uppercase;color:var(--clay);margin-bottom:6px}
.cu-sum dd{margin:0;font-weight:600;font-size:17px}
.cu-flow,.cu-recs,.cu-cost,.cu-share{margin-top:34px}
.cu-flow{background:var(--paper);border:1px solid var(--line);border-radius:20px;padding:clamp(18px,3vw,30px)}
.cu-flow h3,.cu-recs h3,.cu-cost h3,.cu-share h3{font-size:clamp(24px,2.8vw,32px);margin:0 0 6px}
.cu-day{font:700 12px/1 "DM Sans",sans-serif;letter-spacing:.14em;text-transform:uppercase;color:var(--clay);margin:18px 0 6px}
.cu-tl{list-style:none;padding:0;margin:0;position:relative}
.cu-tl li{display:grid;grid-template-columns:70px 1fr;gap:14px;padding:10px 0;border-bottom:1px dashed var(--line)}
.cu-tl li:last-child{border-bottom:0}
.cu-tl time{font:800 20px/1.2 "Big Shoulders Display","Arial Narrow",sans-serif;color:var(--forest)}
.cu-tl span{font-weight:600}
.cu-rgrid{grid-template-columns:repeat(auto-fill,minmax(240px,1fr));gap:16px;margin:16px 0 10px}
.cu-rgrid .card h3{font-size:24px}.cu-price{font-weight:700;color:var(--clay);font-size:15px;margin-top:auto}
.cu-none{font-weight:700;font-size:19px;color:var(--forest)}
.cu-cost p{margin:0 0 6px;color:var(--ink2)}
.cu-hand{margin-top:34px;background:var(--forest);color:#fff;border-radius:22px;padding:clamp(22px,4vw,40px)}
.cu-ing{font:800 clamp(28px,3.6vw,42px)/1.1 "Big Shoulders Display","Arial Narrow",sans-serif;margin:0 0 12px}
.cu-hand p{color:#dfe8e1}.cu-hand .cu-hint{color:#b9cbbd;margin:12px 0 0}
.cu-send{margin-top:8px;min-height:56px;font-size:17px}
.cu-share-b{display:flex;flex-wrap:wrap;gap:10px;margin-top:12px}.cu-share-b .btn{min-height:48px;color:var(--ink)}
.cu-copied{min-height:1.4em;color:var(--forest);font-weight:700;margin:10px 0 0}
.cu-edit{display:flex;gap:18px;margin-top:26px;padding-top:18px;border-top:1px solid var(--line)}
.cu-link{background:none;border:0;padding:0;font:700 15px "DM Sans",sans-serif;color:var(--clay);cursor:pointer;text-decoration:underline}
@media(max-width:720px){
body:has(.cu) .float-wa{bottom:96px}
#cu-root{border-radius:18px;padding:20px 16px 0}
.cu-grid,.cu-grid-s,.cu-grid-img{grid-template-columns:repeat(2,minmax(0,1fr));gap:10px}
.cu-grid:not(.cu-grid-s):not(.cu-grid-m):not(.cu-grid-img),.cu-grid-2,.cu-grid-3{grid-template-columns:1fr}
.cu-grid-m{grid-template-columns:repeat(3,minmax(0,1fr))}
.cu-opt{padding:14px 40px 14px 14px}.cu-opt-t{font-size:16px}.cu-opt.img .cu-opt-t,.cu-opt.img .cu-opt-l{padding:0 36px 0 12px}.cu-opt.img .cu-opt-l{font-size:13.5px}
.cu-tick{top:12px;right:12px;width:22px;height:22px}.cu-opt.on .cu-tick:after{left:6px;top:2px}
.cu-bar{position:sticky;bottom:0;background:var(--card);margin:24px -16px 0;padding:12px 16px calc(12px + env(safe-area-inset-bottom));box-shadow:0 -10px 20px -16px rgba(0,0,0,.4);z-index:5}
.cu-bar .btn{flex:1;padding:14px 12px}
.cu-need{text-align:center;padding-bottom:12px}
.cu-how{grid-template-columns:1fr}
.cu-done{padding-bottom:20px}.cu-intro{padding-bottom:20px}
.cu-tl li{grid-template-columns:58px 1fr}
.cu-share-b .btn{flex:1 1 45%;justify-content:center}
}
`;
