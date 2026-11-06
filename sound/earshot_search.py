#!/usr/bin/env python3
"""Tune the hard textures of the horror kit by ear: render variants of a recipe, let earshot's CLAP critic score
each against what it should sound like (and what it might be mistaken for), keep the best.

usage: <earshot venv>/bin/python sound/earshot_search.py [name ...] [--n 10]
writes assets/sfx/<name>.wav for the winner and its parameters to sound/earshot_params.json (so earshot_kit.py
re-renders exactly that take).
"""
import argparse, json, os, sys, tempfile
import numpy as np
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import earshot_kit as K
from earshot.match import match

PARAMS = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'earshot_params.json')

SPACE = {  # name: (recipe, fixed kwargs, ranges, query, alternatives)
    'rain_umbrella': (K.rain2, {'seconds': 8.0}, {'rate': (150, 700), 'f_lo': (90, 260), 'f_hi': (260, 700),
                      'decay': (0.003, 0.02), 'splash': (0.1, 1.2), 'bed': (0.1, 0.8), 'lp': (5000, 12000)},
                      'rain falling on an umbrella', ['static noise', 'frying food', 'bubbles underwater']),
    'cloth_tear_slow': (K.rip, {'seconds': 2.4}, {'period': (0.004, 0.014), 'jit': (0.1, 0.9), 'f_body': (250, 1400),
                        'noise_mix': (0.0, 0.4), 'surge': (0.8, 4.0), 'lo': (80, 400), 'hi': (1500, 5000)},
                        'fabric being torn slowly', ['static', 'fire crackling', 'paper crumpling']),
    'cloth_tear_short': (K.rip, {'seconds': 0.7}, {'period': (0.003, 0.012), 'jit': (0.1, 0.9), 'f_body': (250, 1400),
                         'noise_mix': (0.0, 0.4), 'surge': (2.0, 8.0), 'lo': (80, 400), 'hi': (1500, 5000)},
                         'cloth ripping', ['static', 'fire crackling', 'paper crumpling']),
    'chewing_close': (K.chew2, {'seconds': 6.0}, {'cycle': (0.5, 0.8), 'lo': (250, 800), 'hi': (1500, 4000),
                      'bubbles': (4, 30), 'jaw': (0.0, 0.15), 'crunch': (0.0, 0.8)},
                      'wet chewing sounds, eating', ['footsteps', 'a kick drum', 'water dripping']),
    'candle_snuff': (K.blow_out, {}, {'dur': (0.25, 0.7), 'center': (400, 1800), 'flutter': (0.1, 0.9), 'lo': (150, 600),
                     'hi': (1500, 5000), 'sizzle': (0.0, 0.15), 'lips': (0.2, 1.0)},
                     'blowing out a candle', ['a cough', 'a whoosh', 'wind']),
    'soil_on_lid': (K.soil2, {}, {'rate': (600, 3000), 'clods': (2, 12), 'hollow': (0.0, 0.6), 'grit': (0.1, 0.9),
                    'tail': (0.0, 1.5), 'lid_lo': (80, 400)},
                    'dirt and soil shovelled onto a wooden coffin', ['an explosion', 'a door knock', 'gravel']),
}
INTS = {'clods', 'bubbles'}


def score(m):
    return m['z'] + 1.5 * m['p_vs_alts']


def main():
    ap = argparse.ArgumentParser(); ap.add_argument('names', nargs='*'); ap.add_argument('--n', type=int, default=10)
    a = ap.parse_args()
    saved = json.load(open(PARAMS)) if os.path.exists(PARAMS) else {}
    tmp = tempfile.mkdtemp()
    for name in a.names or SPACE:
        fn, fixed, ranges, q, alts = SPACE[name]
        r = np.random.default_rng(abs(hash(name)) % 2 ** 31)
        best = None
        cands = ([saved[name]] if name in saved else []) + [None] * a.n
        for i, c in enumerate(cands):
            kw = dict(c) if c else {k: (int(round(r.uniform(*v))) if k in INTS else float(r.uniform(*v))) for k, v in ranges.items()}
            kw.update(fixed); kw['seed'] = kw.get('seed', int(r.integers(1, 10_000)))
            path = os.path.join(tmp, f'{name}_{i}.wav')
            x = fn(**kw); x = K.dsp.fade(K.dsp.normalize(K.mono(x), -1.0), 0.002, 0.03)
            K.sf.write(path, x.astype(np.float32), K.SR)
            m = match(path, q, alts=alts)
            print(f"{name} #{i}: {m['verdict']:<10} z {m['z']:+.1f}  p {m['p_vs_alts']:.2f}  top: {m['closest_vocab'][0] if m.get('closest_vocab') else ''}")
            if best is None or score(m) > score(best[0]): best = (m, kw, x)
        m, kw, x = best
        print(f"==> {name}: {m['summary'][:260]}\n")
        K.save(name, x); saved[name] = kw
        json.dump(saved, open(PARAMS, 'w'), indent=1, sort_keys=True)


if __name__ == '__main__':
    main()
