#!/usr/bin/env python3
"""Derive every shot boundary and sync point of The Watch 02 from timing.json (re-run after re-narrating).

usage: python3 src/episodes/the-watch-02/beats.py   -> beats.json (read by Main.tsx, scenes/*.tsx and cues.py)
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
    text = round(e('L19') + 0.45, 3)  # Danny's new message lands after "keeping Danny out."
    B = {
        'hook': 0.0,
        'street': s('L02'),
        'post': s('L03'),
        'window': s('L04'),
        'key': s('L05'),
        'door': s('L06'),
        'shelf': s('L07'),
        'memory': s('L08'),
        'page': s('L09'),
        'y2006': s('L10'),
        'open2006': s('L11'),
        'oneHand': s('L12'),
        'reveal': s('L13'),
        'danny': s('L14'),
        'told': s('L15'),
        'last': s('L16'),
        'keep': s('L17'),
        'inside': s('L18'),
        'out': round(e('L19') - 0.35, 3),
        'text': text,
        'turn': round(text + 1.7, 3),
        'cut': cut,
    }
    out = {'B': B, 'durationSec': round(cut + TITLE_HOLD, 2), 'source': 'timing.json (' + timing.get('provenance', '') + ')'}
    json.dump(out, open(os.path.join(HERE, 'beats.json'), 'w'), indent=1)
    print(f"beats.json: cut {cut:.2f} s, duration {out['durationSec']:.2f} s")


if __name__ == '__main__':
    main()
