# One-off helper used on 8 Oct 2026 to build src/snapshot.json from Airtable exports. Paths are from that session.
import json, re
S = '/tmp/claude-0/-home-claude/976b76ba-28c5-5a78-bb7e-41892f067f3b/scratchpad/'
B = 'https://www.rockandanchor.in/wp-content/uploads/2026/10/'
photos = {
 'recSXQ2tQxqLEpN0C':['little-feet-sensory-%d'%i for i in (1,2,3,4)],
 'recW9JKhVGqNh0LLS':['little-feet-sunset-safari-%d'%i for i in (1,2,3,4)],
 'recotNF3taNVJQHvz':['young-explorers-%d'%i for i in (1,2,3,4)],
 'rec8Qu6E2UZeocjE7':['be-a-villager-%d'%i for i in (1,2,3,4)],
 'rec2ZtYTJkhhBie5P':['rooftop-stargazing-%d'%i for i in (1,2,3,4)],
 'receVObty2OP5RqpK':['night-sky-2','rooftop-stargazing-2','night-sky-1','rooftop-stargazing-3'],
 'recZX0tQG7JhPJHX2':['hidden-kingdom-%d'%i for i in (1,2,3,4)],
 'recjOD7ru8rr5MUtF':['ridge-and-lake-%d'%i for i in (1,2,4)],
 'recCERBptmvu3WC5B':['winter-trekking-%d'%i for i in (1,2,3,4)],
 'recs1bI9IlvrAb5Cu':['night-sky-1','night-sky-2','rooftop-stargazing-1'],
 'recGe4O48b5CHf426':['floating-picnic-%d'%i for i in (1,2,3,4)],
 'rec7yorjjv9g6gILU':['mini-splash-%d'%i for i in (1,2,3,4)],
 'recUBPYOfeFiGrBBV':['monsoon-1-day-4','monsoon-1-day-2','monsoon-1-day-1'],
 'recU4Q0ZgIELxs0uE':['monsoon-1-day-1','monsoon-1-day-2','monsoon-1-day-4'],
 'recm8esl6OoEUzVBj':['rooftop-stargazing-4','talking-to-the-planets-2','rooftop-stargazing-1'],
}
F = dict(title='fldM3NSq47YsF9tR2', slug='fld4JwhapQZdKtBcA', order='fld0ZNPcdfO412lmd', summary='fldQm3jgyBV5X1nzK',
         description='fldylkcJyzF9uK0Xi', itinerary='fldePmvVNr0Plgo4D', faqs='fld89jnU68Zl9q6nM', prices='fldLEraHeNPgjjG8T',
         age='fldF1U1n4ks9FSFtP', location='fld2m8zyHAoKGlZEi', timing='fldlwqH0kyOcnhSm3', categories='fldIyJ28XTWNtfRm3',
         fromPrice='fldiOgiemRJAEgWdP')
exp = []
for r in json.load(open(S+'exp.json'))['records']:
    c = r['cellValuesByFieldId']; e = {'id': r['id']}
    for k, f in F.items():
        v = c.get(f)
        if k == 'categories': v = [x['name'] for x in (v or [])]
        e[k] = v
    e['datesAhead'] = 60 if r['id'] == 'receVObty2OP5RqpK' else None
    e['photos'] = [{'url': B+n+'.jpg', 'thumb': B+n+'.jpg'} for n in photos.get(r['id'], [])]
    exp.append(e)
ev = []
for r in json.load(open(S+'ev.json'))['records']:
    c = r['cellValuesByFieldId']
    ev.append({'exp': c['fldTwb0rZY39trwD4'][0]['id'], 'start': c['fldWr96uilLEjfI24'], 'end': c.get('fldLWXxoeM3Xr7Qkd')})
show = {'rec1O9PO57YHt86qz','recCD6JCewaMQH4Vg','recHDQp8KClHlRwKQ','recDN2bO5kL9dOt8m','rec5DwMqDdMnCzvUT','recG1q3mY5oxcailB'}
rev = []
for r in json.load(open(S+'rev.json'))['records']:
    if r['id'] in show:
        c = r['cellValuesByFieldId']
        rev.append({'name': c['fldIgYRm1oIN51m2Z'], 'text': c['fldoiPyv0cAhFNMtJ'], 'exp': []})
imp = []
for r in json.load(open(S+'imp.json'))['records']:
    c = r['cellValuesByFieldId']
    if c.get('fldMKHdAIyLWJJsKQ'):
        imp.append({'metric': c['fldX1aQLHwAWY4A0C'], 'value': c.get('fldcFhyLkZhdUiyF2'), 'order': c.get('fldWCIzvRPTsj0hQW') or 99})
imp.sort(key=lambda x: x['order'])
snap = {'experiences': exp, 'events': ev, 'reviews': rev, 'impact': imp, 'source': 'snapshot 8 Oct 2026'}
json.dump(snap, open('snapshot.json', 'w'), ensure_ascii=False, separators=(',', ':'))
print(len(exp), len(ev), len(rev), len(imp))
