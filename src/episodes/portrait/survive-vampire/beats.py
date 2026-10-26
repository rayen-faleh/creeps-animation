#!/usr/bin/env python3
"""Derive every shot boundary and sync point of "Would you survive? Vampire" from timing.json.

usage: python3 src/episodes/portrait/survive-vampire/beats.py   -> beats.json (read by Main.tsx, scenes and cues.py)
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
    cut = round(s('L12') - 0.12, 3)
    B = {
        'hook': 0.0,
        'week': s('L02'),
        'day1': s('L03'),
        'noRef': ph('L03', 1),
        'phone': s('L04'),
        'fail': round(e('L04') - 0.55, 3),
        'day2': s('L05'),
        'sun': ph('L05', 1),
        'blind': s('L06'),
        'easy': ph('L06', 1),
        'day3': s('L07'),
        'home': s('L08'),
        'cant': ph('L08', 1),
        'rule': s('L09'),
        'drop': round(e('L09') - 0.6, 3),
        'rent': s('L10'),
        'text': s('L11'),
        'nine': ph('L11', 1),
        'knock': round(cut - 0.75, 3),
        'cut': cut,
    }
    out = {'B': B, 'durationSec': round(cut + CARD_HOLD, 2), 'source': 'timing.json (' + timing.get('provenance', '') + ')'}
    json.dump(out, open(os.path.join(HERE, 'beats.json'), 'w'), indent=1)
    print(f"beats.json: cut {cut:.2f} s, duration {out['durationSec']:.2f} s")


if __name__ == '__main__':
    main()
