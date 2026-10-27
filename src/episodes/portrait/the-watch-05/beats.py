#!/usr/bin/env python3
"""Derive every shot boundary and sync point of The Watch 05 from timing.json (re-run after re-narrating).

usage: python3 src/episodes/portrait/the-watch-05/beats.py   -> beats.json (read by Main.tsx, scenes and cues.py)
"""
import json, os

HERE = os.path.dirname(os.path.abspath(__file__))
TITLE_HOLD = 4.6


def main():
    timing = json.load(open(os.path.join(HERE, 'timing.json')))
    L = {l['id']: l for l in timing['lines']}
    s = lambda i: L[i]['start']
    ph = lambda i, k: L[i]['phrases'][k]['start']
    cut = round(s('L20') - 0.12, 3)
    B = {
        'hook': 0.0,
        'barrels': s('L02'),
        'silver': ph('L02', 1),
        'nothing': s('L03'),
        'me': s('L04'),
        'mick': s('L05'),
        'kept': ph('L05', 1),
        'ran': s('L06'),
        'didnt': ph('L06', 1),
        'broke': s('L07'),
        'empty': s('L08'),
        'never': s('L09'),
        'page': s('L10'),
        'august': s('L11'),
        'left': ph('L11', 2),
        'bit': s('L12'),
        'got': ph('L12', 1),
        'cost': ph('L12', 2),
        'boy': s('L13'),
        'eight': ph('L13', 1),
        'arm': s('L14'),
        'pulling': s('L15'),
        'dawn': s('L16'),
        'home': s('L17'),
        'window': s('L18'),
        'eyes': s('L19'),
        'smaller': ph('L19', 2),
        'cut': cut,
    }
    out = {'B': B, 'durationSec': round(cut + TITLE_HOLD, 2), 'source': 'timing.json (' + timing.get('provenance', '') + ')'}
    json.dump(out, open(os.path.join(HERE, 'beats.json'), 'w'), indent=1)
    print(f"beats.json: cut {cut:.2f} s, duration {out['durationSec']:.2f} s")


if __name__ == '__main__':
    main()
