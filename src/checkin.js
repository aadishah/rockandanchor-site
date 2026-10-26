// One-Year Check-In form (rockandanchor.in/check-in). Added 26 Oct 2026.
// A client types an access code (one per company, in the Airtable table "Check-In Codes") and passes a Cloudflare Turnstile check.
// The server then gives a signed 60 minute pass, and the answers are saved to "Check-In Responses".
// Secrets and variables needed (Cloudflare dashboard, Worker settings):
//   TURNSTILE_SITEKEY  (variable, public)     TURNSTILE_SECRET  (secret)
// The Airtable token needs write access to both tables.
// Opens on rockandanchor.in only when CK_LIVE is true. Until then it answers only on workers.dev addresses.
const CK_LIVE = false;
const CK = {
  codes: 'tblpkiQ9oTbIS7Y3g', resp: 'tbl8vGG97JWpxZeWa',
  c: { code: 'fldzReSkvnIWGkFZt', company: 'fldJFYrOw3p2VGHxz', month: 'fld4RwKfhSL7CrFpZ' },
  r: { title: 'fldTynzTaw6zu9mND', link: 'fld2aVWA6l0dz44vM', company: 'fldiQtxTEQ70XXwgG', role: 'fld3kdY5uwuMEC6y2', at: 'fldtZeBkbltlG133R', before: 'fldGdba2VipN6Egts', changed: 'fldA10uJN3NG3K9Ls', example: 'fld7l3v8nGhaCwpDj', notChanged: 'fld8dOhbjRF7FfVOJ', rating: 'fldorke7oGzXHTPzc', remember: 'fldB8KpEgMrmjeusr', again: 'fldI3t5H8ehgkhSl3', perm: 'fldfK66iGk1z2l1dl' },
};
const CK_PERMS = ['Share with our company name', 'Share without our name', 'Short quotes only', 'Private feedback only'];
const CK_PASS_MINUTES = 60;

const ckjson = (o, status = 200) => new Response(JSON.stringify(o), { status, headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store', 'X-Robots-Tag': 'noindex, nofollow' } });
async function ckat(env, table, method, path, body) {
  const r = await fetch(`https://api.airtable.com/v0/${BASE}/${table}${path}`, { method, headers: { Authorization: `Bearer ${env.AIRTABLE_TOKEN}`, 'content-type': 'application/json' }, body: body ? JSON.stringify(body) : undefined });
  const j = await r.json().catch(() => ({}));
  if (!r.ok) throw new Error(`Airtable ${r.status} ${JSON.stringify(j.error || j).slice(0, 200)}`);
  return j;
}
const ckb64 = (bytes) => btoa(String.fromCharCode(...bytes)).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
const ckunb64 = (s) => Uint8Array.from(atob(s.replace(/-/g, '+').replace(/_/g, '/')), (c) => c.charCodeAt(0));
async function ckKey(env) {
  return crypto.subtle.importKey('raw', new TextEncoder().encode('checkin|' + env.TURNSTILE_SECRET), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
}
async function ckSign(env, payload) {
  const body = ckb64(new TextEncoder().encode(JSON.stringify(payload)));
  const sig = await crypto.subtle.sign('HMAC', await ckKey(env), new TextEncoder().encode(body));
  return body + '.' + ckb64(new Uint8Array(sig));
}
async function ckVerify(env, pass) {
  try {
    const [body, sig] = String(pass || '').split('.');
    if (!body || !sig) return null;
    const good = ckb64(new Uint8Array(await crypto.subtle.sign('HMAC', await ckKey(env), new TextEncoder().encode(body))));
    if (good !== sig) return null;
    const p = JSON.parse(new TextDecoder().decode(ckunb64(body)));
    return p.e > Date.now() ? p : null;
  } catch (e) { return null; }
}
async function ckTurnstile(env, request, token) {
  if (!token) return false;
  const form = new URLSearchParams({ secret: env.TURNSTILE_SECRET, response: String(token).slice(0, 2048) });
  const ip = request.headers.get('CF-Connecting-IP'); if (ip) form.set('remoteip', ip);
  const r = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', { method: 'POST', body: form });
  const j = await r.json().catch(() => ({}));
  return !!j.success;
}
const cktext = (v) => String(v == null ? '' : v).replace(/\r/g, '').trim().slice(0, 2000);

async function checkinApi(request, env, path) {
  if (request.method !== 'POST') return ckjson({ error: 'method' }, 405);
  if (!env.TURNSTILE_SECRET || !env.TURNSTILE_SITEKEY) return ckjson({ error: 'off' }, 503);
  let b; try { b = await request.json(); } catch (e) { return ckjson({ error: 'bad' }, 400); }
  try {
    if (path === '/check-in/api/code') {
      const code = String(b.code || '').toUpperCase().replace(/[^A-Z0-9-]/g, '').slice(0, 40);
      if (!code) return ckjson({ error: 'nocode' }, 400);
      if (!(await ckTurnstile(env, request, b.token))) return ckjson({ error: 'captcha' }, 400);
      const formula = `AND({Active},UPPER({Code})='${code}')`;
      const got = await ckat(env, CK.codes, 'GET', `?returnFieldsByFieldId=true&maxRecords=1&filterByFormula=${encodeURIComponent(formula)}`);
      const rec = got.records && got.records[0];
      if (!rec) return ckjson({ error: 'badcode' }, 404);
      const company = rec.fields[CK.c.company] || '', month = rec.fields[CK.c.month] || '';
      const pass = await ckSign(env, { r: rec.id, co: company, e: Date.now() + CK_PASS_MINUTES * 60000 });
      return ckjson({ ok: true, company, month, pass });
    }
    if (path === '/check-in/api/submit') {
      if (cktext(b.website)) return ckjson({ ok: true }); // hidden field, only bots fill it
      const p = await ckVerify(env, b.pass);
      if (!p) return ckjson({ error: 'expired' }, 401);
      const owner = b.role === 'owner';
      const f = { [CK.r.link]: [p.r], [CK.r.company]: p.co, [CK.r.role]: owner ? 'Owner or booker' : 'Team member', [CK.r.at]: new Date().toISOString() };
      const a = b.a || {};
      let any = false;
      const put = (id, v) => { v = cktext(v); if (v) { f[id] = v; any = true; } };
      if (owner) {
        put(CK.r.before, a.before); put(CK.r.changed, a.changed); put(CK.r.example, a.example); put(CK.r.notChanged, a.notChanged);
        const n = parseInt(a.rating, 10); if (n >= 1 && n <= 5) { f[CK.r.rating] = n; any = true; }
        f[CK.r.perm] = CK_PERMS.includes(a.perm) ? a.perm : 'Private feedback only';
      } else {
        put(CK.r.remember, a.remember); put(CK.r.changed, a.changed);
        if (['Yes', 'Maybe', 'No'].includes(a.again)) { f[CK.r.again] = a.again; any = true; }
      }
      if (!any) return ckjson({ error: 'empty' }, 400);
      const day = new Date(Date.now() + 5.5 * 3600000).toISOString().slice(0, 10);
      f[CK.r.title] = `${p.co} · ${owner ? 'Owner' : 'Team member'} · ${day}`;
      await ckat(env, CK.resp, 'POST', '', { typecast: true, fields: f });
      return ckjson({ ok: true });
    }
  } catch (e) { return ckjson({ error: 'srv' }, 500); }
  return ckjson({ error: 'path' }, 404);
}

function checkinPage(env) {
  const on = !!(env.TURNSTILE_SECRET && env.TURNSTILE_SITEKEY);
  const cfg = JSON.stringify({ on, site: env.TURNSTILE_SITEKEY || '', perms: CK_PERMS, wa: '918928794380' }).replace(/</g, '\\u003c');
  return `<!doctype html><html lang="en-IN"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex,nofollow">
<title>A year later | Rock &amp; Anchor</title><link rel="icon" type="image/png" href="/favicon.png">
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link href="https://fonts.googleapis.com/css2?family=Big+Shoulders+Display:wght@800&family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,700&display=swap" rel="stylesheet">
<meta name="theme-color" content="#f6f1e8"><style>${QUIZ_CSS}${CHECKIN_CSS}</style></head><body>
<header class="qz-top"><a href="/" aria-label="Rock &amp; Anchor home"><img src="/logo.png" alt="Rock &amp; Anchor" width="56" height="46"></a></header>
<main id="ck" aria-live="polite"><noscript><p class="qz-card">Please open this page with JavaScript turned on.</p></noscript></main>
<script type="application/json" id="ck-data">${cfg}</script>${on ? '<script src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit" async defer></script>' : ''}<script>${CHECKIN_JS}</script></body></html>`;
}

const CHECKIN_CSS = `
.qz-card h1{font:800 34px/1.05 "Big Shoulders Display",sans-serif;text-transform:uppercase;color:var(--forest);margin:0 0 10px}
.ck-k{font-size:13px;letter-spacing:.12em;text-transform:uppercase;color:var(--clay);font-weight:700;margin:0 0 6px}
.ck-lead{color:var(--ink2);margin:0 0 16px}
.ck-card label:not(.ck-opt),.ck-q{display:block;font-weight:700;margin:18px 0 6px}
.ck-card .ck-hint{font-weight:400;color:var(--muted);font-size:15px;display:block}
.ck-card input[type=text],.ck-card textarea{width:100%;border:1.5px solid var(--line);border-radius:12px;padding:12px;font:inherit;background:#fff;color:var(--ink)}
.ck-card textarea{min-height:96px;resize:vertical}
.ck-card input[type=text]:focus,.ck-card textarea:focus{outline:2px solid var(--forest);outline-offset:1px}
.ck-opt{display:flex;gap:10px;align-items:flex-start;border:1.5px solid var(--line);border-radius:12px;padding:12px;margin:8px 0;background:#fff;cursor:pointer;font-weight:400}
.ck-opt input{margin-top:5px;accent-color:var(--forest)}.ck-opt b{font-weight:700}
.ck-rate{display:flex;gap:8px;flex-wrap:wrap}.ck-rate .ck-opt{margin:0;min-width:52px;justify-content:center}
.ck-btn{display:block;width:100%;margin-top:22px;background:var(--forest);color:#fff;border:0;border-radius:999px;padding:15px 20px;font:700 17px "DM Sans",sans-serif;cursor:pointer}
.ck-btn[disabled]{opacity:.55;cursor:default}
.ck-err{color:var(--bad);margin:12px 0 0;font-weight:500}
.ck-hp{position:absolute;left:-9999px;width:1px;height:1px;overflow:hidden}
.ck-ts{margin-top:16px;min-height:65px}
.ck-wa{display:inline-block;margin-top:14px;color:var(--forest);font-weight:700}
`;

const CHECKIN_JS = String.raw`(function(){
var D=JSON.parse(document.getElementById('ck-data').textContent),root=document.getElementById('ck'),pass='',co='',mo='',role='',tsid=null,tok='';
function h(t){return String(t==null?'':t).replace(/[&<>"']/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]})}
function post(p,b){return fetch('/check-in/api/'+p,{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify(b)}).then(function(r){return r.json().then(function(j){j.status=r.status;return j},function(){return{error:'srv',status:r.status}})})}
function say(m){var e=document.getElementById('ck-err');if(e)e.textContent=m||''}
function step1(){
  if(!D.on){root.innerHTML='<section class="qz-card"><p class="ck-k">Rock &amp; Anchor</p><h1>Not open yet</h1><p class="ck-lead">This page is not switched on yet. Please message us on WhatsApp and we will help.</p></section>';return}
  root.innerHTML='<section class="qz-card ck-card"><p class="ck-k">Rock &amp; Anchor</p><h1>A year later</h1><p class="ck-lead">Thank you for spending time with us. We would like to know, in your own words, if the experience changed anything for your team. Good or not so good, both help. There are no right answers, and &ldquo;nothing changed&rdquo; is a welcome answer.</p><label for="ck-code">Access code<span class="ck-hint">The person who shared this link will have given you a code.</span></label><input type="text" id="ck-code" autocomplete="off" autocapitalize="characters" spellcheck="false" maxlength="40"><div class="ck-ts" id="ck-ts"></div><p class="ck-err" id="ck-err" role="alert"></p><button class="ck-btn" id="ck-go" type="button">Continue</button></section>';
  document.getElementById('ck-go').onclick=go;
  document.getElementById('ck-code').onkeydown=function(e){if(e.key==='Enter')go()};
  var tries=0;(function draw(){if(window.turnstile){tsid=turnstile.render('#ck-ts',{sitekey:D.site,callback:function(t){tok=t}});return}if(tries++<60)setTimeout(draw,250)})();
}
function go(){
  var code=document.getElementById('ck-code').value.trim();
  if(!code){say('Please type your access code.');return}
  if(!tok){say('Please wait for the check mark above, then press Continue.');return}
  var b=document.getElementById('ck-go');b.disabled=true;say('');
  post('code',{code:code,token:tok}).then(function(j){
    b.disabled=false;
    if(j.ok){pass=j.pass;co=j.company;mo=j.month;step2();return}
    tok='';if(window.turnstile&&tsid!==null)turnstile.reset(tsid);
    if(j.error==='badcode')say('We could not find that code. Please check it with the person who shared this link.');
    else if(j.error==='captcha')say('The check did not pass. Please try again.');
    else say('Something went wrong on our side. Please try again in a minute.');
  },function(){b.disabled=false;say('Could not connect. Please check your internet and try again.')});
}
function ta(id,label,hint){return '<label for="'+id+'">'+label+(hint?'<span class="ck-hint">'+hint+'</span>':'')+'</label><textarea id="'+id+'"></textarea>'}
function step2(){
  root.innerHTML='<section class="qz-card ck-card"><p class="ck-k">'+h(co)+(mo?' &middot; '+h(mo):'')+'</p><h1>Tell us how it went</h1><p class="ck-lead">Please think back to the experience with us. Who is answering?</p>'
  +'<label class="ck-opt"><input type="radio" name="role" value="owner"><span><b>I booked it, or lead the team</b><br>About 5 minutes</span></label>'
  +'<label class="ck-opt"><input type="radio" name="role" value="team"><span><b>I am part of the team</b><br>About 2 minutes. No name or number is asked.</span></label>'
  +'<div id="ck-form"></div></section>';
  var rs=root.querySelectorAll('input[name=role]');for(var i=0;i<rs.length;i++)rs[i].onchange=function(){role=this.value;form()};
}
function form(){
  var f=document.getElementById('ck-form'),x='';
  if(role==='owner'){
    x=ta('a-before','1. Before the experience, how did your team work together?')
     +ta('a-changed','2. Since then, what is different in how people talk or work with each other?','If nothing, please say so.')
     +ta('a-example','3. Please tell us one real thing that happened afterwards.','Who was there, what happened, and roughly when.')
     +ta('a-not','4. Was there something you hoped would change that did not?')
     +'<div class="ck-q">5. My team feels more connected than before.<span class="ck-hint">1 means not at all, 5 means very much</span></div><div class="ck-rate">'+[1,2,3,4,5].map(function(n){return '<label class="ck-opt"><input type="radio" name="rating" value="'+n+'">'+n+'</label>'}).join('')+'</div>'
     +'<div class="ck-q">May we share your story?</div>'+D.perms.map(function(p,i){return '<label class="ck-opt"><input type="radio" name="perm" value="'+h(p)+'"'+(i===3?' checked':'')+'><span>'+h(p)+'</span></label>'}).join('')
     +'<p class="ck-hint" style="color:var(--muted);font-size:15px">Nothing is shared without your say. We will send you any draft first.</p>';
  }else{
    x='<p class="ck-lead" style="margin-top:14px">Your answers are anonymous. We do not ask your name or number.</p>'
     +ta('a-remember','1. What do you remember most from that night?')
     +ta('a-changed','2. After that, did anything change in how you talk or work with the people around you?')
     +'<div class="ck-q">3. Would you like to do something like this again?</div>'+['Yes','Maybe','No'].map(function(p){return '<label class="ck-opt"><input type="radio" name="again" value="'+p+'"><span>'+p+'</span></label>'}).join('');
  }
  f.innerHTML=x+'<div class="ck-hp" aria-hidden="true"><label>Website<input type="text" id="a-web" tabindex="-1" autocomplete="off"></label></div><p class="ck-err" id="ck-err" role="alert"></p><button class="ck-btn" id="ck-send" type="button">Send</button>';
  document.getElementById('ck-send').onclick=send;
}
function val(id){var e=document.getElementById(id);return e?e.value:''}
function radio(n){var e=document.querySelector('input[name='+n+']:checked');return e?e.value:''}
function send(){
  var a=role==='owner'?{before:val('a-before'),changed:val('a-changed'),example:val('a-example'),notChanged:val('a-not'),rating:radio('rating'),perm:radio('perm')}:{remember:val('a-remember'),changed:val('a-changed'),again:radio('again')};
  var any=false;for(var k in a){if(k!=='perm'&&a[k])any=true}
  if(!any){say('Please answer at least one question.');return}
  var b=document.getElementById('ck-send');b.disabled=true;say('');
  post('submit',{pass:pass,role:role,a:a,website:val('a-web')}).then(function(j){
    if(j.ok){done();return}
    b.disabled=false;
    if(j.error==='expired'){say('This page has been open for a while. Please start again with your code.');setTimeout(step1,2500)}
    else say('Your answers could not be saved just now. Please try again in a minute, or send them to us on WhatsApp.');
  },function(){b.disabled=false;say('Could not connect. Please check your internet and try again.')});
}
function done(){
  root.innerHTML='<section class="qz-card ck-card"><p class="ck-k">Rock &amp; Anchor</p><h1>Thank you</h1><p class="ck-lead">Your answers reached us. What you shared helps us do this better, for you and for the next team.</p><p class="ck-lead">If you would like to add anything, you can also message us.</p><a class="ck-wa" href="https://wa.me/'+D.wa+'">Message us on WhatsApp</a></section>';
}
step1();
})();`;
