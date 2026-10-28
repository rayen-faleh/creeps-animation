#!/usr/bin/env python3
"""Derive every shot boundary and sync point of My Type, Part 1 from timing.json (re-run after re-narrating).

usage: python3 src/episodes/portrait/my-type/beats.py   -> beats.json (read by Main.tsx, scenes and cues.py)
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
    cut = round(e('L20') + 0.45, 3)
    B = {
        'hook': 0.0,
        'live': ph('L01', 1),
        'hollywood': s('L02'),
        'started': ph('L02', 1),
        'film': s('L03'),
        'hottest': ph('L03', 1),
        'type': s('L04'),
        'pale': ph('L04', 1),
        'lace': ph('L04', 2),
        'mornings': ph('L04', 3),
        'goth': s('L05'),
        'nothing': ph('L05', 1),
        'then': s('L06'),
        'drinking': ph('L06', 1),
        'door': s('L07'),
        'invite': ph('L07', 1),
        'flirting': s('L08'),
        'wine': s('L09'),
        'broke': ph('L09', 1) + 0.45,
        'sorry': s('L10'),
        'alot': ph('L10', 1),
        'black': round(e('L10') + 0.1, 3),
        'woke': s('L11'),
        'pulse': ph('L11', 1),
        'envelope': s('L12'),
        'made': ph('L12', 1),
        'present': ph('L12', 3),
        'rules': s('L13'),
        'vote': ph('L13', 1),
        'finds': s('L14'),
        'eldest': s('L15'),
        'story': s('L16'),
        'glasses': ph('L16', 1),
        'nobody': ph('L16', 2),
        'watched': s('L17'),
        'far': s('L18'),
        'once': ph('L18', 1),
        'each': s('L19'),
        'hers': s('L20'),
        'cut': cut,
        'whisper': s('L21'),
    }
    B = {k: round(v, 3) for k, v in B.items()}
    out = {'B': B, 'durationSec': round(cut + CARD_HOLD, 2), 'source': 'timing.json (' + timing.get('provenance', '') + ')'}
    json.dump(out, open(os.path.join(HERE, 'beats.json'), 'w'), indent=1)
    print(f"beats.json: cut {cut:.2f} s, duration {out['durationSec']:.2f} s")


if __name__ == '__main__':
    main()
