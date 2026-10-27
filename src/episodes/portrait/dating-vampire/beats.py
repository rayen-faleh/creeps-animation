#!/usr/bin/env python3
"""Derive every shot boundary and sync point of "Dating a vampire" from timing.json.

usage: python3 src/episodes/portrait/dating-vampire/beats.py   -> beats.json (read by Main.tsx, scenes and cues.py)
"""
import json, os

HERE = os.path.dirname(os.path.abspath(__file__))
CARD_HOLD = 5.4


def main():
    timing = json.load(open(os.path.join(HERE, 'timing.json')))
    L = {l['id']: l for l in timing['lines']}
    s = lambda i: L[i]['start']
    ph = lambda i, k: L[i]['phrases'][k]['start']
    cut = round(s('L18') - 0.12, 3)
    B = {
        'hook': 0.0,
        'hollywood': s('L02'),
        'folklore': s('L03'),
        'tuesday': ph('L03', 2),
        'anyway': s('L04'),
        'day1': s('L05'),
        'oldfash': ph('L05', 2),
        'expire': s('L06'),
        'kitchen': ph('L06', 1),
        'day2': s('L07'),
        'rose': ph('L07', 2),
        'day3': s('L08'),
        'neck': ph('L08', 3),
        'day4': s('L09'),
        'drop': ph('L09', 1),
        'count': s('L10'),
        'lost': ph('L10', 2),
        'day5': s('L11'),
        'soil': ph('L11', 2),
        'day6': s('L12'),
        'book': ph('L12', 2),
        'film': s('L13'),
        'taped': ph('L13', 1),
        'day7': s('L14'),
        'pale': ph('L14', 2),
        'marks': s('L15'),
        'mirror': s('L16'),
        'shows': s('L17'),
        'floatrose': ph('L17', 1),
        'cut': cut,
    }
    out = {'B': B, 'durationSec': round(cut + CARD_HOLD, 2), 'source': 'timing.json (' + timing.get('provenance', '') + ')'}
    json.dump(out, open(os.path.join(HERE, 'beats.json'), 'w'), indent=1)
    print(f"beats.json: cut {cut:.2f} s, duration {out['durationSec']:.2f} s")


if __name__ == '__main__':
    main()
