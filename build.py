"""Builds dist/worker.js (one self-contained file) from src/template.js.
Run: python3 build.py   then deploy with: npx wrangler deploy
"""
import json, base64, os, sys
here = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.join(here, 'src'))
import policies
p = lambda *a: os.path.join(here, *a)
src = open(p('src', 'template.js')).read()
src = src.replace('__ABOUT__', open(p('src', 'about.js')).read())
src = src.replace('__IMPACT__', open(p('src', 'impact.js')).read())
src = src.replace('__TEAM__', open(p('src', 'team.js')).read())
src = src.replace('__VALUES__', open(p('src', 'values.js')).read())
src = src.replace('__CURATE__', open(p('src', 'curate.js')).read())
src = src.replace('__QUIZ_HG__', open(p('src', 'quiz_hg.js')).read())
src = src.replace('__QUIZ__', open(p('src', 'quiz.js')).read())
src = src.replace('__SNAPSHOT__', open(p('src', 'snapshot.json')).read())
src = src.replace('__LOGO__', base64.b64encode(open(p('assets', 'logo.png'), 'rb').read()).decode())
src = src.replace('__FAVICON__', base64.b64encode(open(p('assets', 'favicon.png'), 'rb').read()).decode())
src = src.replace('__POLICY_REFUNDS__', json.dumps(policies.REFUNDS, ensure_ascii=False))
src = src.replace('__POLICY_TERMS__', json.dumps(policies.TERMS, ensure_ascii=False))
src = src.replace('__POLICY_PRIVACY__', json.dumps(policies.PRIVACY, ensure_ascii=False))
os.makedirs(p('dist'), exist_ok=True)
open(p('dist', 'worker.js'), 'w').write(src)
print('dist/worker.js', len(src.encode()), 'bytes')
