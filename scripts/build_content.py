from pathlib import Path
import json, re, html
ROOT = Path(__file__).resolve().parents[1]
POSTS = ROOT / 'content' / 'posts'
OUT = ROOT / 'public' / 'data.json'

def parse_frontmatter(s):
    if not s.startswith('---'): return {}, s
    _, rest = s.split('---', 1)
    fm, body = rest.split('---', 1)
    data={}
    for line in fm.strip().splitlines():
        if ':' not in line: continue
        k,v=line.split(':',1); v=v.strip()
        if v.startswith('[') and v.endswith(']'):
            data[k.strip()] = [x.strip().strip("'\"") for x in v[1:-1].split(',') if x.strip()]
        else: data[k.strip()] = v.strip().strip("'\"")
    return data, body.strip()

def inline(t):
    t=html.escape(t, quote=False)
    t=re.sub(r'\[([^]]+)\]\((https?://[^)]+)\)', r'<a href="\2" target="_blank" rel="noreferrer">\1</a>', t)
    t=re.sub(r'\[\[([^]|]+)\|([^]]+)\]\]', r'<a href="#\1">\2</a>', t)
    t=re.sub(r'\[\[([^]]+)\]\]', r'<a href="#\1">\1</a>', t)
    t=re.sub(r'`([^`]+)`', r'<code>\1</code>', t)
    t=re.sub(r'\*\*([^*]+)\*\*', r'<strong>\1</strong>', t)
    return t

def md_to_html(body):
    lines=body.splitlines(); out=[]; para=[]; in_code=False; code=[]
    def flush():
        nonlocal para
        if para:
            out.append('<p>'+inline(' '.join(x.strip() for x in para))+'</p>'); para=[]
    for line in lines:
        if line.startswith('```'):
            flush()
            if not in_code: in_code=True; code=[]
            else: out.append('<pre><code>'+html.escape('\n'.join(code))+'</code></pre>'); in_code=False
            continue
        if in_code: code.append(line); continue
        if not line.strip(): flush(); continue
        m=re.match(r'^(#{1,3})\s+(.*)',line)
        if m: flush(); level=len(m.group(1)); out.append(f'<h{level+1}>'+inline(m.group(2))+f'</h{level+1}>'); continue
        if line.startswith('> '): flush(); out.append('<blockquote>'+inline(line[2:])+'</blockquote>'); continue
        if re.match(r'^[-*]\s+', line):
            flush(); item=re.sub(r'^[-*]\s+','',line); 
            if not out or not out[-1].startswith('<ul>'): out.append('<ul>')
            out[-1]=out[-1][:-5]+'<li>'+inline(item)+'</li></ul>' if out[-1].endswith('</ul>') else out[-1]+'<li>'+inline(item)+'</li>'
            continue
        para.append(line)
    flush()
    # normalize list construction
    fixed=[]
    for x in out:
        if x.startswith('<ul>') and not x.endswith('</ul>'): x+='</ul>'
        fixed.append(x)
    return '\n'.join(fixed)

posts=[]
for path in sorted(POSTS.glob('*.md')):
    meta, body = parse_frontmatter(path.read_text())
    if meta.get('draft','false').lower()=='true': continue
    slug=meta.get('slug',path.stem)
    posts.append({
      'slug':slug, 'title':meta.get('title',path.stem), 'date':meta.get('date','2026-10-09'),
      'type':meta.get('type','note'), 'tags':meta.get('tags',[]), 'links':meta.get('links',[]),
      'summary':meta.get('summary',''), 'body':md_to_html(body)
    })
# derive topic nodes + explicit edges
nodes=[]; edges=[]
for p in posts: nodes.append({'id':'post:'+p['slug'],'label':p['title'],'kind':'post','date':p['date'],'slug':p['slug'],'tags':p['tags']})
topics=sorted({t for p in posts for t in p['tags']})
for t in topics: nodes.append({'id':'topic:'+t,'label':t,'kind':'topic'})
for p in posts:
    pid='post:'+p['slug']
    for t in p['tags']: edges.append({'source':pid,'target':'topic:'+t,'kind':'topic'})
    for l in p.get('links',[]):
        if any(q['slug']==l for q in posts): edges.append({'source':pid,'target':'post:'+l,'kind':'link'})
# connect posts sharing tags for a complete visual network (one edge per pair)
for i,a in enumerate(posts):
  for b in posts[i+1:]:
    shared=sorted(set(a['tags']) & set(b['tags']))
    if shared: edges.append({'source':'post:'+a['slug'],'target':'post:'+b['slug'],'kind':'shared','label':shared[0]})
OUT.write_text(json.dumps({'meta':{'count':len(posts),'topicCount':len(topics),'generated':'2026-10-09'},'posts':posts,'nodes':nodes,'edges':edges},ensure_ascii=False,indent=2))
print(f'generated {len(posts)} posts, {len(topics)} topics, {len(edges)} edges')
