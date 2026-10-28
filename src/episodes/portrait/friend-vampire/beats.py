#!/usr/bin/env python3
"""Derive every shot boundary and sync point of the friend-vampire signs reel from timing.json.

usage: python3 src/episodes/portrait/friend-vampire/beats.py   -> beats.json (read by Main.tsx, scenes and cues.py)
"""
import json, os

HERE = os.path.dirname(os.path.abspath(__file__))
CARD_HOLD = 5.0


def main():
    timing = json.load(open(os.path.join(HERE, 'timing.json')))
    L = {l['id']: l for l in timing['lines']}
    s = lambda i: L[i]['start']
    ph = lambda i, k: L[i]['phrases'][k]['start']
    cut = round(s('W') - 0.12, 3)
    B = {'hook': 0.0, 'small': ph('L01', 1)}
    for i in range(1, 8):
        B[f's{i}'] = s(f'S{i}')
        B[f's{i}b'] = ph(f'S{i}', 1)
    B['every'] = ph('S2', 2)
    B['loo'] = ph('S3', 2)
    B['twice'] = ph('S4', 3)
    B['eleven'] = ph('S5', 3)
    B['once'] = ph('S6', 2)
    B['cut'] = cut
    out = {'B': B, 'durationSec': round(cut + CARD_HOLD, 2), 'source': 'timing.json (' + timing.get('provenance', '') + ')'}
    json.dump(out, open(os.path.join(HERE, 'beats.json'), 'w'), indent=1)
    print(f"beats.json: cut {cut:.2f} s, duration {out['durationSec']:.2f} s")


if __name__ == '__main__':
    main()
