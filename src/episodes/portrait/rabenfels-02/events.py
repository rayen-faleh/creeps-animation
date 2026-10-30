#!/usr/bin/env python3
"""Derive the shared picture/sound clock (events.json) from the measured narration (timing.json).

usage: python3 src/episodes/rabenfels-02/events.py   (re-run after re-narrating)
Older shot components (Supplier, Recruit, Street, Washing, Confrontation) read the same key names they always did.
"""
import json, os

HERE = os.path.dirname(os.path.abspath(__file__))
TITLE_HOLD = 3.3

def main():
    L = {l['id']: l for l in json.load(open(os.path.join(HERE, 'timing.json')))['lines']}
    s = lambda i: L[i]['start']
    e = lambda i: L[i]['end']
    ph = lambda i, k: L[i]['phrases'][k]['start']
    cut = round(e('L22') + 0.4, 3)
    E = {
        'decision': s('L00'), 'scent': s('L01'), 'familiar': ph('L01', 1), 'cloves': s('L02'),
        'memory': s('L03'), 'recruit': s('L04'), 'light': s('L05'), 'cover': ph('L05', 1), 'turnaway': s('L06'),
        'evidence': s('L07'), 'fought': s('L08'), 'door': s('L09'), 'nolight': ph('L09', 1), 'nootto': ph('L09', 2),
        'street': s('L10'), 'coat': s('L11'), 'torn': ph('L11', 1), 'ask': s('L12'), 'glance': s('L13'),
        'witness': ph('L13', 1), 'customer': s('L14'), 'stairs': s('L15'), 'mirror': s('L16'), 'target': s('L17'),
        'wool': ph('L17', 1), 'demand': s('L18'), 'secret': ph('L18', 1), 'turn': s('L19'), 'what': ph('L19', 1),
        'reach': s('L20'), 'question': s('L21'), 'top': s('L22'), 'cut': cut, 'title': round(cut + 1.0, 3),
    }
    E = {k: round(v, 3) for k, v in E.items()}
    E = {'duration': round(cut + TITLE_HOLD, 2), **E}
    json.dump(E, open(os.path.join(HERE, 'events.json'), 'w'), indent=1)
    print(f"events.json: cut {cut:.2f} s, duration {E['duration']:.2f} s")

if __name__ == '__main__':
    main()
