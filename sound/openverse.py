#!/usr/bin/env python3
"""Find and fetch openly licensed audio through Openverse (https://openverse.org).

usage:
  python3 sound/openverse.py search "rain on umbrella" [--source freesound|jamendo] [--max 20] [--min-s 1] [--max-s 60]
  python3 sound/openverse.py get <openverse-id> <name> [--start S] [--dur S]

`search` lists CC0 / CC BY results only (no NC, no ND, no SA), with id, length, licence and title.
`get` downloads one result, trims it if asked, converts it to 48 kHz stereo WAV at assets/sfx/<name>.wav and records
title, creator, licence and landing page in assets/sfx/CREDITS.json. CC BY items must be credited in the post caption:
`python3 sound/openverse.py credits <slug>` prints the lines for the sounds a story's cues.py uses.
"""
import argparse, json, os, re, subprocess, sys, tempfile, urllib.parse, urllib.request

API = 'https://api.openverse.org/v1/audio/'
UA = 'creeps-animation-sfx/1.0 (+https://github.com/rayen-faleh/creeps-animation)'
OUT = os.path.join('assets', 'sfx')
CREDITS = os.path.join(OUT, 'CREDITS.json')


def fetch(url):
    req = urllib.request.Request(url, headers={'User-Agent': UA})
    with urllib.request.urlopen(req, timeout=60) as r:
        return r.read()


def search(a):
    q = {'q': a.query, 'license': 'cc0,by', 'page_size': str(a.max)}
    if a.source: q['source'] = a.source
    d = json.loads(fetch(API + '?' + urllib.parse.urlencode(q)))
    print(f"{d.get('result_count')} results for {a.query!r}")
    for r in d['results']:
        s = (r.get('duration') or 0) / 1000
        if s and not (a.min_s <= s <= a.max_s): continue
        print(f"{r['id']}  {s:6.1f}s  {r['license']:<3} {r['source']:<9} {r['title'][:60]}  — {r.get('creator') or '?'}")


def credits_load():
    return json.load(open(CREDITS)) if os.path.exists(CREDITS) else {}


def get(a):
    r = json.loads(fetch(API + a.id + '/'))
    if r['license'] not in ('cc0', 'by', 'pdm'):
        sys.exit(f"refusing licence {r['license']}: only CC0 / CC BY / public domain")
    raw = fetch(r['url'])
    os.makedirs(OUT, exist_ok=True)
    with tempfile.NamedTemporaryFile(suffix='.' + (r.get('filetype') or 'mp3'), delete=False) as f:
        f.write(raw); src = f.name
    dst = os.path.join(OUT, a.name + '.wav')
    cmd = ['ffmpeg', '-v', 'error', '-y']
    if a.start: cmd += ['-ss', str(a.start)]
    cmd += ['-i', src]
    if a.dur: cmd += ['-t', str(a.dur)]
    cmd += ['-ar', '48000', '-ac', '2', '-c:a', 'pcm_s16le', dst]
    subprocess.run(cmd, check=True); os.unlink(src)
    c = credits_load()
    c[a.name] = {k: r.get(k) for k in ('id', 'title', 'creator', 'creator_url', 'license', 'license_version',
                                       'license_url', 'foreign_landing_url', 'source', 'attribution')}
    c[a.name]['trim'] = {'start': a.start, 'dur': a.dur}
    json.dump(c, open(CREDITS, 'w'), indent=1, ensure_ascii=False, sort_keys=True)
    print(f"{dst}  ({r['license']} {r.get('license_version') or ''}, {r['title']} — {r.get('creator')})")


def credits(a):
    found = [os.path.join('src', 'episodes', f, a.slug, 'cues.py') for f in ('portrait', 'landscape')]
    src = next((open(p).read() for p in found if os.path.exists(p)), '')
    used = set(re.findall(r"""sample\(\s*['"]([\w\-/]+)['"]""", src))
    c = credits_load()
    for n in sorted(used):
        e = c.get(n)
        if not e: print(f'# {n}: no credit record'); continue
        if e['license'] in ('by',):
            print(f"\"{e['title']}\" by {e['creator']} ({e['foreign_landing_url']}), CC BY {e['license_version']}")
    print('# CC0 / public domain items need no credit.')


def main():
    ap = argparse.ArgumentParser(); sp = ap.add_subparsers(dest='cmd', required=True)
    s = sp.add_parser('search'); s.add_argument('query'); s.add_argument('--source'); s.add_argument('--max', type=int, default=20)
    s.add_argument('--min-s', type=float, default=0); s.add_argument('--max-s', type=float, default=1e9)
    g = sp.add_parser('get'); g.add_argument('id'); g.add_argument('name')
    g.add_argument('--start', type=float, default=0); g.add_argument('--dur', type=float, default=0)
    c = sp.add_parser('credits'); c.add_argument('slug')
    a = ap.parse_args(); {'search': search, 'get': get, 'credits': credits}[a.cmd](a)


if __name__ == '__main__':
    main()
