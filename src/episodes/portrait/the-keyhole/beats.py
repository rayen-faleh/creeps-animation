#!/usr/bin/env python3
"""Shot boundaries and sync points for The Keyhole, derived from timing.json (re-run after re-narrating).

usage: python3 src/episodes/portrait/the-keyhole/beats.py   -> beats.json (read by Main.tsx, scenes and cues.py)
"""
import json, os

HERE = os.path.dirname(os.path.abspath(__file__))
TITLE_HOLD = 3.6


def main():
    timing = json.load(open(os.path.join(HERE, 'timing.json')))
    L = {l['id']: l for l in timing['lines']}
    s = lambda i: L[i]['start']
    e = lambda i: L[i]['end']
    ph = lambda i, k: L[i]['phrases'][k]['start']
    B = {
        'hook': 0.0, 'door': s('L02'), 'gran': s('L03'), 'weight': s('L04'),
        'block': s('L05'), 'cantLeave': ph('L05', 1),
        'sixYears': s('L06'), 'everyNight': ph('L06', 1),
        'stuffed': s('L07'), 'stuffedShut': ph('L07', 1),
        'stopped': s('L08'), 'sameWeek': ph('L08', 1), 'wife': ph('L08', 2),
        'asked': s('L09'), 'pulled': s('L10'), 'quiet': s('L11'),
        'three': s('L12'), 'cantMove': ph('L12', 1),
        'climb': s('L13'), 'reach': s('L14'),
        'empty': s('L15'), 'warm': ph('L15', 1),
        'never': s('L16'), 'married': s('L17'), 'marriedEnd': e('L17'),
        'hair': s('L18'), 'whisper': s('L19'), 'whisperEnd': e('L19'),
        'title': round(e('L19') + 0.25, 3),
    }
    B = {k: round(v, 3) for k, v in B.items()}
    out = {'B': B, 'durationSec': round(B['title'] + TITLE_HOLD, 2), 'source': 'timing.json (' + timing.get('provenance', '') + ')'}
    json.dump(out, open(os.path.join(HERE, 'beats.json'), 'w'), indent=1)
    print(f"beats.json: title {B['title']:.2f} s, duration {out['durationSec']:.2f} s")


if __name__ == '__main__':
    main()
