#!/usr/bin/env python3
"""Derive the shared picture/sound clock (events.json) of Rabenfels Part IV from the measured narration.

usage: python3 src/episodes/portrait/rabenfels-04/events.py   (re-run after re-narrating)
"""
import json, os

HERE = os.path.dirname(os.path.abspath(__file__))
TITLE_HOLD = 3.3

def main():
    L = {l['id']: l for l in json.load(open(os.path.join(HERE, 'timing.json')))['lines']}
    s = lambda i: L[i]['start']
    e = lambda i: L[i]['end']
    ph = lambda i, k: L[i]['phrases'][k]['start']
    cut = round(e('L18') + 0.4, 3)
    E = {
        'decision': s('L00'), 'stepback': s('L01'), 'look': ph('L01', 2), 'closes': s('L02'),
        'grete': s('L03'), 'upstairs': ph('L03', 1), 'lida': s('L04'), 'keys': ph('L04', 2),
        'climb': s('L05'), 'safwan': ph('L05', 1), 'noback': ph('L05', 2),
        'bolt': s('L06'), 'key': ph('L06', 1), 'swings': ph('L06', 2),
        'gone': s('L07'), 'window': ph('L07', 1), 'floor': s('L08'), 'otto': s('L09'), 'barely': ph('L09', 1),
        'waves': s('L10'), 'pen': ph('L10', 2), 'cant': s('L11'), 'invited': ph('L11', 2), 'foot': s('L12'),
        'eyes': s('L13'), 'sees': ph('L13', 1), 'only': s('L14'), 'pulls': s('L15'), 'looksup': s('L16'), 'atyou': ph('L16', 1),
        'question': s('L17'), 'top': s('L18'), 'cut': cut, 'title': round(cut + 1.0, 3),
    }
    E = {k: round(v, 3) for k, v in E.items()}
    E = {'duration': round(cut + TITLE_HOLD, 2), **E}
    json.dump(E, open(os.path.join(HERE, 'events.json'), 'w'), indent=1)
    print(f"events.json: cut {cut:.2f} s, duration {E['duration']:.2f} s")

if __name__ == '__main__':
    main()
