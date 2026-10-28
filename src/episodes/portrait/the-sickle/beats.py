#!/usr/bin/env python3
"""Derive every shot boundary and sync point of The Sickle from timing.json (re-run after re-narrating).

usage: python3 src/episodes/portrait/the-sickle/beats.py   -> beats.json (read by Main.tsx, scenes and cues.py)
"""
import json, os

HERE = os.path.dirname(os.path.abspath(__file__))
TITLE_HOLD = 4.6


def main():
    timing = json.load(open(os.path.join(HERE, 'timing.json')))
    L = {l['id']: l for l in timing['lines']}
    s = lambda i: L[i]['start']
    e = lambda i: L[i]['end']
    ph = lambda i, k: L[i]['phrases'][k]['start']
    cut = round(s('L18') - 0.12, 3)
    B = {
        'hook': 0.0,
        'did': s('L02'),
        'sickle': s('L03'),
        'every': ph('L03', 1),
        'padlock': s('L04'),
        'toe': ph('L04', 1),
        'why': s('L05'),
        'put': ph('L05', 2),
        'promise': s('L06'),
        'coffin': ph('L06', 2),
        'thirty': s('L07'),
        'buried': ph('L07', 1),
        'undertaker': s('L08'),
        'real': ph('L08', 1),
        'drawer': s('L09'),
        'lastnight': s('L10'),
        'open': ph('L10', 1),
        'gone': s('L11'),
        'soil': s('L12'),
        'wet': ph('L12', 1),
        'prints': ph('L12', 2),
        'stairs': s('L13'),
        'room': s('L14'),
        'never': s('L15'),
        'ground': s('L16'),
        'cold': s('L17'),
        'snap': round(e('L17') - 0.45, 3),
        'cut': cut,
    }
    out = {'B': B, 'durationSec': round(cut + TITLE_HOLD, 2), 'source': 'timing.json (' + timing.get('provenance', '') + ')'}
    json.dump(out, open(os.path.join(HERE, 'beats.json'), 'w'), indent=1)
    print(f"beats.json: cut {cut:.2f} s, duration {out['durationSec']:.2f} s")


if __name__ == '__main__':
    main()
