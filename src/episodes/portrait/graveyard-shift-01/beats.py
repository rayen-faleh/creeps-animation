#!/usr/bin/env python3
"""Derive every shot boundary and sync point of Graveyard Shift, Part 1 from timing.json.

usage: python3 src/episodes/portrait/graveyard-shift-01/beats.py   -> beats.json (read by Main.tsx, scenes and cues.py)
"""
import json, os

HERE = os.path.dirname(os.path.abspath(__file__))
CARD_HOLD = 6.2  # poll card: question, series, two options, prompt


def main():
    timing = json.load(open(os.path.join(HERE, 'timing.json')))
    L = {l['id']: l for l in timing['lines']}
    s = lambda i: L[i]['start']
    e = lambda i: L[i]['end']
    ph = lambda i, k: L[i]['phrases'][k]['start']
    cut = round(e('L16') + 0.6, 3)
    B = {
        'hook': 0.0,
        'doors': s('L02'),
        'wouldnt': ph('L02', 1),
        'knock': s('L03'),
        'yes': s('L04'),
        'shop': ph('L04', 2),
        'rice': s('L05'),
        'coins': ph('L05', 1),
        'cctv': s('L06'),
        'nobody': ph('L06', 1),
        'lean': s('L07'),
        'tired': ph('L07', 1),
        'black': s('L08'),
        'wake': s('L09'),
        'till': ph('L09', 1),
        'count': s('L10'),
        'counting': ph('L10', 1),
        'dozed': s('L11'),
        'five': s('L12'),
        'coffee': ph('L12', 1),
        'pump': s('L13'),
        'dawn': s('L14'),
        'smoke': ph('L14', 2),
        'ends': s('L15'),
        'sunrise': ph('L15', 1),
        'receipt': s('L16'),
        'number': ph('L16', 1),
        'cut': cut,
    }
    out = {'B': B, 'durationSec': round(cut + CARD_HOLD, 2), 'source': 'timing.json (' + timing.get('provenance', '') + ')'}
    json.dump(out, open(os.path.join(HERE, 'beats.json'), 'w'), indent=1)
    print(f"beats.json: cut {cut:.2f} s, duration {out['durationSec']:.2f} s")


if __name__ == '__main__':
    main()
