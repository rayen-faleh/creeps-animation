#!/usr/bin/env python3
"""Derive every shot boundary and sync point of The Witch Bottle, Part I from timing.json.

usage: python3 src/episodes/portrait/witch-bottle-01/beats.py   -> beats.json (read by Main.tsx, scenes and cues.py)
"""
import json, os

HERE = os.path.dirname(os.path.abspath(__file__))
TITLE_HOLD = 4.6


def main():
    timing = json.load(open(os.path.join(HERE, 'timing.json')))
    L = {l['id']: l for l in timing['lines']}
    s = lambda i: L[i]['start']
    e = lambda i: L[i]['end']
    ph = lambda i, k: L[i]['phrases'][k]['start']
    cut = round(s('L17') - 0.12, 3)
    B = {
        'hook': 0.0,
        'boiled': s('L02'),
        'winter': s('L03'),
        'six': ph('L03', 2),
        'pig': ph('L03', 3),
        'smoke': ph('L03', 4),
        'lane': s('L04'),
        'cough': s('L05'),
        'gran': s('L06'),
        'someone': ph('L06', 1),
        'jug': s('L07'),
        'pins': s('L08'),
        'nails': ph('L08', 1),
        'lock': ph('L08', 2),
        'grey': s('L09'),
        'comb': ph('L09', 1),
        'embers': s('L10'),
        'rule': ph('L10', 1),
        'feel': s('L11'),
        'body': ph('L11', 1),
        'door': s('L12'),
        'sat': s('L13'),
        'ticked': ph('L13', 1),
        'hiss': ph('L13', 2),
        'midnight': s('L14'),
        'stopped': ph('L14', 1),
        'knock': s('L15'),
        'still': s('L16'),
        'open': ph('L16', 1),
        'cut': cut,
    }
    out = {'B': B, 'durationSec': round(cut + TITLE_HOLD, 2), 'source': 'timing.json (' + timing.get('provenance', '') + ')'}
    json.dump(out, open(os.path.join(HERE, 'beats.json'), 'w'), indent=1)
    print(f"beats.json: cut {cut:.2f} s, duration {out['durationSec']:.2f} s")


if __name__ == '__main__':
    main()
