import fs from 'fs';
globalThis.caches = { default: { match: async () => undefined, put: async () => {} } };
const mod = await import('../dist/worker.js?' + Date.now());
const PH = '/mnt/user-data/uploads/Rock and Anchor/Rock & Anchor/Website Images 2026-10/photos/';
const paths = ['/', '/experiences', '/experiences/greatest-show-on-earth', '/experiences/rooftop-stargazing', '/experiences/talking-to-the-planets', '/experiences/ridge-and-lake', '/experiences/night-sky-experience', '/experiences/project-mini-splash', '/experiences/young-explorers-winter-school', '/about', '/team', '/values', '/our-values', '/impact', '/contact', '/terms', '/privacy', '/cancellation-and-refunds', '/nope', '/product/greatest-show/', '/about-us/', '/sitemap.xml', '/logo.png'];
fs.mkdirSync('out', { recursive: true });
for (const p of paths) {
  const r = await mod.default.fetch(new Request('https://rockandanchor.in' + p), {}, { waitUntil() {} });
  const loc = r.headers.get('location');
  console.log(r.status, p, loc || r.headers.get('content-type'));
  if ((r.headers.get('content-type') || '').includes('html')) {
    let h = await r.text();
    h = h.split('https://www.rockandanchor.in/wp-content/uploads/2026/10/').join('file://' + PH).split('src="/logo.png"').join('src="file://' + process.cwd() + '/logo.png"');
    fs.writeFileSync('out/' + (p.replace(/\//g, '_') || 'home') + '.html', h);
  }
}
