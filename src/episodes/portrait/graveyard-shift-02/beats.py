#!/usr/bin/env python3
"""Derive every shot boundary and sync point of Graveyard Shift, Part 2 from timing.json (re-run after re-narrating).

usage: python3 src/episodes/portrait/graveyard-shift-02/beats.py   -> beats.json (read by Main.tsx, scenes and cues.py)
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
    cut = round(e('L13') + 0.5, 3)
    B = {
        'hook': 0.0, 'ring': ph('L01', 1),
        'recap': s('L02'), 'coins': ph('L02', 1), 'bydawn': ph('L02', 2), 'smoking': ph('L02', 3),
        'name': s('L03'), 'badge': ph('L03', 1),
        'sunrise': s('L04'), 'bored': ph('L04', 1),
        'stock': s('L05'), 'shadows': ph('L05', 2),
        'crawl': s('L06'), 'aisle': ph('L06', 1),
        'van': s('L07'), 'dave': ph('L07', 1), 'early': ph('L07', 3),
        'bang': s('L08'), 'comein': ph('L08', 1),
        'heart': s('L09'), 'hear': ph('L09', 1),
        'offer': s('L10'), 'rule': ph('L10', 2), 'price': ph('L10', 3),
        'invite': s('L11'), 'inviteEnd': e('L11'),
        'twice': s('L12'), 'onphone': ph('L12', 1), 'behind': ph('L12', 2),
        'expire': s('L13'), 'doesnt': ph('L13', 1),
        'cut': cut,
    }
    B = {k: round(v, 3) for k, v in B.items()}
    out = {'B': B, 'durationSec': round(cut + CARD_HOLD, 2), 'source': 'timing.json (' + timing.get('provenance', '') + ')'}
    json.dump(out, open(os.path.join(HERE, 'beats.json'), 'w'), indent=1)
    print(f"beats.json: cut {cut:.2f} s, duration {out['durationSec']:.2f} s")


if __name__ == '__main__':
    main()
