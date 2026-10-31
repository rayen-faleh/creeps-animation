#!/usr/bin/env python3
"""Derive every shot boundary and sync point of My Type, Part 2 from timing.json (re-run after re-narrating).

usage: python3 src/episodes/portrait/my-type-02/beats.py   -> beats.json (read by Main.tsx, scenes and cues.py)
"""
import json, os

HERE = os.path.dirname(os.path.abspath(__file__))
CARD_HOLD = 6.2  # poll card


def main():
    timing = json.load(open(os.path.join(HERE, 'timing.json')))
    L = {l['id']: l for l in timing['lines']}
    s = lambda i: L[i]['start']
    e = lambda i: L[i]['end']
    ph = lambda i, k: L[i]['phrases'][k]['start']
    cut = round(e('L15') + 0.5, 3)
    B = {
        'hook': 0.0, 'girl': ph('L01', 1),
        'vote': s('L02'), 'spare': ph('L02', 2),
        'terms': s('L03'), 'sunrise': ph('L03', 1), 'selfie': ph('L03', 2),
        'story': s('L04'), 'saw': ph('L04', 1),
        'list': s('L05'), 'viewer': ph('L05', 1), 'pen': ph('L05', 2),
        'mum': s('L06'), 'liked': ph('L06', 2),
        'teach': s('L07'), 'eye': ph('L07', 1), 'slowly': ph('L07', 2), 'forget': ph('L07', 3),
        'pizza': s('L08'), 'name': ph('L08', 1),
        'montage': s('L09'), 'forgotten': ph('L09', 1),
        'door': s('L10'), 'said': ph('L10', 1), 'sorry': s('L10b'), 'sorryEnd': e('L10b'),
        'last': s('L11'),
        'profile': s('L12'), 'nophoto': ph('L12', 1), 'made': ph('L12', 2),
        'dm': s('L13'), 'message': ph('L13', 1),
        'know': s('L14'), 'doyou': ph('L14', 1),
        'shoulder': s('L15'), 'stopped': ph('L15', 1),
        'cut': cut,
    }
    B = {k: round(v, 3) for k, v in B.items()}
    out = {'B': B, 'durationSec': round(cut + CARD_HOLD, 2), 'source': 'timing.json (' + timing.get('provenance', '') + ')'}
    json.dump(out, open(os.path.join(HERE, 'beats.json'), 'w'), indent=1)
    print(f"beats.json: cut {cut:.2f} s, duration {out['durationSec']:.2f} s")


if __name__ == '__main__':
    main()
