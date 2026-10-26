#!/usr/bin/env python3
"""Derive every shot boundary and sync point of "Would you survive? Werewolf" from timing.json.

usage: python3 src/episodes/portrait/survive-werewolf/beats.py   -> beats.json (read by Main.tsx, scenes and cues.py)
"""
import json, os

HERE = os.path.dirname(os.path.abspath(__file__))
CARD_HOLD = 5.4  # end card: question, monster, comment prompt


def main():
    timing = json.load(open(os.path.join(HERE, 'timing.json')))
    L = {l['id']: l for l in timing['lines']}
    s = lambda i: L[i]['start']
    e = lambda i: L[i]['end']
    ph = lambda i, k: L[i]['phrases'][k]['start']
    cut = round(s('L11') - 0.12, 3)
    B = {
        'hook': 0.0,
        'week': s('L02'),
        'day1': s('L03'),
        'dog': ph('L03', 1),
        'bolt': round(e('L03') - 0.2, 3),
        'day2': s('L04'),
        'moon': ph('L04', 1),
        'lock': s('L05'),
        'key': ph('L05', 1),
        'easy': ph('L05', 2),
        'day3': s('L06'),
        'wake': ph('L06', 1),
        'mud': ph('L06', 2),
        'watch': s('L07'),
        'miles': s('L08'),
        'best': ph('L08', 1),
        'farm': s('L09'),
        'buzz': s('L10'),
        'tonight': ph('L10', 1),
        'cut': cut,
    }
    out = {'B': B, 'durationSec': round(cut + CARD_HOLD, 2), 'source': 'timing.json (' + timing.get('provenance', '') + ')'}
    json.dump(out, open(os.path.join(HERE, 'beats.json'), 'w'), indent=1)
    print(f"beats.json: cut {cut:.2f} s, duration {out['durationSec']:.2f} s")


if __name__ == '__main__':
    main()
