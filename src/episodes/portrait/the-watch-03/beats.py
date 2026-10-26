#!/usr/bin/env python3
"""Derive every shot boundary and sync point of The Watch 03 from timing.json (re-run after re-narrating).

usage: python3 src/episodes/portrait/the-watch-03/beats.py   -> beats.json (read by Main.tsx, scenes and cues.py)
"""
import json, os

HERE = os.path.dirname(os.path.abspath(__file__))
TITLE_HOLD = 4.6


def main():
    timing = json.load(open(os.path.join(HERE, 'timing.json')))
    L = {l['id']: l for l in timing['lines']}
    s = lambda i: L[i]['start']
    e = lambda i: L[i]['end']
    cut = round(s('L20') - 0.12, 3)
    B = {
        'hook': 0.0,
        'recap': s('L04'),
        'sat': s('L05'),
        'moon': s('L06'),
        'slid': s('L08'),
        'look': s('L10'),
        'two': s('L11'),
        'four': s('L12'),
        'danny': s('L13'),
        'every': s('L14'),
        'except': s('L15'),
        'micks': s('L16'),
        'holes': s('L17'),
        'warn': s('L18'),
        'pull': s('L19'),
        'out': round(e('L19') - 0.35, 3),
        'reach': round(e('L19') + 0.5, 3),
        'cut': cut,
    }
    out = {'B': B, 'durationSec': round(cut + TITLE_HOLD, 2), 'source': 'timing.json (' + timing.get('provenance', '') + ')'}
    json.dump(out, open(os.path.join(HERE, 'beats.json'), 'w'), indent=1)
    print(f"beats.json: cut {cut:.2f} s, duration {out['durationSec']:.2f} s")


if __name__ == '__main__':
    main()
