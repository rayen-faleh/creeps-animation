#!/usr/bin/env python3
"""Shot boundaries and sync points for The Shroud Eater, derived from timing.json (re-run after re-narrating).

usage: python3 src/episodes/portrait/shroud-eater/beats.py   -> beats.json (read by Main.tsx, scenes and cues.py)
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
        'hook': 0.0, 'stoneLine': ph('L01', 1),
        'door': s('L02'), 'watched': ph('L02', 1),
        'gran': s('L03'), 'hungry': ph('L03', 1),
        'threads': s('L04'), 'byThread': ph('L04', 1),
        'candles': s('L05'), 'dies': ph('L05', 1), 'oneByOne': ph('L05', 2),
        'chair': s('L06'),
        'umbrellas': s('L07'), 'funeral': ph('L07', 1),
        'lid': s('L08'), 'rainy': ph('L08', 1), 'mum': ph('L08', 2),
        'nostone': s('L09'),
        'phone': s('L10'), 'uncle': ph('L10', 1),
        'aunt': s('L11'), 'auntEnd': e('L11'),
        'tired': s('L12'), 'getup': ph('L12', 1),
        'three': s('L13'), 'woke': ph('L13', 1), 'jaw': ph('L13', 2),
        'chew': s('L14'), 'slow': ph('L14', 1), 'close': ph('L14', 2),
        'grave': s('L15'),
        'thread': s('L16'),
        'torch': s('L17'), 'torchOn': e('L17') + 0.12,
        'satin': s('L18'), 'six': ph('L18', 1),
        'twist': s('L19'), 'twistEnd': e('L19'),
        'texted': s('L20'),
        'last': s('L21'),
        'whisper': s('L22'), 'whisperEnd': e('L22'),
        'title': round(e('L22') + 0.2, 3),
    }
    B = {k: round(v, 3) for k, v in B.items()}
    out = {'B': B, 'durationSec': round(B['title'] + TITLE_HOLD, 2), 'source': 'timing.json (' + timing.get('provenance', '') + ')'}
    json.dump(out, open(os.path.join(HERE, 'beats.json'), 'w'), indent=1)
    print(f"beats.json: title {B['title']:.2f} s, duration {out['durationSec']:.2f} s")


if __name__ == '__main__':
    main()
