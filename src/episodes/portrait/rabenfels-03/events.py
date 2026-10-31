#!/usr/bin/env python3
"""Derive the shared picture/sound clock (events.json) of Rabenfels Part III from the measured narration.

usage: python3 src/episodes/portrait/rabenfels-03/events.py   (re-run after re-narrating)
"""
import json, os

HERE = os.path.dirname(os.path.abspath(__file__))
TITLE_HOLD = 3.3

def main():
    L = {l['id']: l for l in json.load(open(os.path.join(HERE, 'timing.json')))['lines']}
    s = lambda i: L[i]['start']
    e = lambda i: L[i]['end']
    ph = lambda i, k: L[i]['phrases'][k]['start']
    cut = round(e('L20') + 0.4, 3)
    E = {
        'decision': s('L00'), 'worked': s('L01'), 'problem': ph('L01', 1),
        'answer': s('L02'), 'look': ph('L02', 3), 'stepback': s('L03'), 'outglass': ph('L03', 2),
        'looks': s('L04'), 'stairs': ph('L04', 1), 'railing': ph('L04', 2), 'candle': ph('L04', 3), 'face': ph('L04', 4),
        'nostranger': s('L05'), 'whistle': s('L06'), 'smiles': s('L07'), 'clever': s('L08'), 'knows': ph('L08', 1),
        'taunt': s('L09'), 'screams': s('L10'), 'backs': ph('L10', 1), 'falls': s('L11'), 'key': ph('L11', 1),
        'slam': s('L12'), 'invited': ph('L12', 1), 'grab': s('L13'), 'youknew': ph('L13', 1), 'how': ph('L13', 2),
        'pulled': s('L14'), 'glass': s('L15'), 'nothing': ph('L15', 1), 'burst': s('L16'), 'grete': ph('L16', 1),
        'lanterns': ph('L16', 2), 'asks': s('L17'), 'where': ph('L17', 1), 'mouth': s('L18'), 'looksmirror': ph('L18', 1),
        'question': s('L19'), 'top': s('L20'), 'cut': cut, 'title': round(cut + 1.0, 3),
    }
    E = {k: round(v, 3) for k, v in E.items()}
    E = {'duration': round(cut + TITLE_HOLD, 2), **E}
    json.dump(E, open(os.path.join(HERE, 'events.json'), 'w'), indent=1)
    print(f"events.json: cut {cut:.2f} s, duration {E['duration']:.2f} s")

if __name__ == '__main__':
    main()
