#!/usr/bin/env python3
"""Derive every shot boundary and sync point of The Watch 01 from timing.json, so a re-voiced narration re-times itself.

usage: python3 src/episodes/the-watch-01/beats.py      (run after tts/narrate.py, before sound/build_audio.py)
writes beats.json next to this file; scenes (Memory.tsx, Present.tsx, Main.tsx) and cues.py all read it.
"""
import json, os

HERE = os.path.dirname(os.path.abspath(__file__))
TITLE_HOLD = 4.6  # black + whisper + title card after the cut


def phrase_start(lines, lid, text_prefix):
    """Start of the caption phrase in line `lid` beginning with text_prefix; if the narrator ran the phrases
    together (no measured silence), estimate it from the word position within the line."""
    L = lines[lid]
    for p in L['phrases']:
        if p['text'].startswith(text_prefix):
            return p['start']
    words = L['text'].split()
    k = next(i for i in range(len(words)) if ' '.join(words[i:]).startswith(text_prefix))
    return round(L['start'] + (L['end'] - L['start']) * k / len(words), 3)


def main():
    timing = json.load(open(os.path.join(HERE, 'timing.json')))
    lines = {l['id']: l for l in timing['lines']}
    s = lambda i: lines[i]['start']
    e = lambda i: lines[i]['end']
    T = {
        'hook': 0.0,
        'profile': s('L02'),
        'l03': [s('L03'), e('L03')],  # Mick's words (jaw moves)
        'mock': s('L04'),
        'nails': phrase_start(lines, 'L05', 'Silver'),
        'bane': phrase_start(lines, 'L05', 'Wolfsbane'),
        'home': s('L06'),
        'window': s('L07'),
        'glare': round(s('L08') + 0.55, 3),  # the torch lands on our window during "Watching the houses"
        'lamp': s('L09'),
    }
    cut = round(s('L22') - 0.12, 3)
    turn = round(e('L21') + 0.6, 3)
    P = {
        'card': s('L10'),
        'room': phrase_start(lines, 'L11', 'Slept'),
        'black': round(s('L13') - 0.27, 3),
        'mud': s('L14'),
        'phone': s('L15'),
        'msgs': [s('L16'), s('L17'), s('L18')],
        'hands': round(s('L19') - 0.16, 3),
        'proof': s('L21'),
        'out': round(e('L21') - 0.45, 3),  # "out." lands near the end of the line
        'turn': turn,
        'cut': cut,
    }
    P['wake'] = round(P['black'] + 0.2, 3)
    P['buzz'] = round(P['phone'] + 0.15, 3)
    P['lampOff'] = round(turn + 0.4, 3)
    P['torchOn'] = round(turn + 0.72, 3)
    out = {'T': T, 'P': P, 'durationSec': round(cut + TITLE_HOLD, 2), 'source': 'timing.json (' + timing.get('provenance', '') + ')'}
    json.dump(out, open(os.path.join(HERE, 'beats.json'), 'w'), indent=1)
    print(f"beats.json: cut {cut:.2f} s, duration {out['durationSec']:.2f} s")


if __name__ == '__main__':
    main()
