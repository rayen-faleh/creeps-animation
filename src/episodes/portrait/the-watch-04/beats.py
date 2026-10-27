#!/usr/bin/env python3
"""Derive every shot boundary and sync point of The Watch 04 from timing.json (re-run after re-narrating).

usage: python3 src/episodes/portrait/the-watch-04/beats.py   -> beats.json (read by Main.tsx, scenes and cues.py)
"""
import json, os

HERE = os.path.dirname(os.path.abspath(__file__))
TITLE_HOLD = 4.6


def main():
    timing = json.load(open(os.path.join(HERE, 'timing.json')))
    L = {l['id']: l for l in timing['lines']}
    s = lambda i: L[i]['start']
    ph = lambda i, k: L[i]['phrases'][k]['start']
    cut = round(s('L19') - 0.12, 3)
    B = {
        'hook': 0.0,
        'mick': s('L03'),
        'died': s('L04'),
        'recap': s('L05'),
        'pulled': ph('L05', 1),
        'out': ph('L05', 2),
        'ran': s('L06'),
        'miles': s('L07'),
        'street': s('L08'),
        'click': ph('L08', 1),
        'lamp': s('L09'),
        'someone': s('L10'),
        'mum': s('L11'),
        'gun': s('L12'),
        'barrels': ph('L12', 1),
        'silver': ph('L12', 2),
        'said': s('L13'),
        'turned': s('L14'),
        'away': s('L15'),
        'danny': s('L16'),
        'family': s('L17'),
        'claws': s('L18'),
        'finger': ph('L18', 1),
        'cut': cut,
    }
    out = {'B': B, 'durationSec': round(cut + TITLE_HOLD, 2), 'source': 'timing.json (' + timing.get('provenance', '') + ')'}
    json.dump(out, open(os.path.join(HERE, 'beats.json'), 'w'), indent=1)
    print(f"beats.json: cut {cut:.2f} s, duration {out['durationSec']:.2f} s")


if __name__ == '__main__':
    main()
