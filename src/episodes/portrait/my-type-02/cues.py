"""My Type, Part 2: the bar's low thump for the hook, the council's drone and a stone set down, a ticking clock
to sunrise, a playful pluck walk under the list and the pizza guy, knock-knock montage beats, a soft room for her
"Sorry.", then the cold: a phone buzz, the message, and silence when she stops apologising."""
import json, os
import numpy as np
from sound_lib import SR, boom, breath, chime, click, creak, whoosh, sting, knock, pluck, note, lp, bp, _rng

_B = json.load(open(os.path.join(os.path.dirname(os.path.abspath(__file__)), 'beats.json')))
B = _B['B']
DUR = _B['durationSec']

def thump(dur, bpm=124, gain=0.2):
    n = int(dur * SR); out = np.zeros(n); step = 60 / bpm
    k = int(0.18 * SR); tt = np.arange(k) / SR
    kick = np.sin(2 * np.pi * (55 + 90 * np.exp(-tt * 30)) * tt) * np.exp(-tt * 14)
    for b in np.arange(0, dur - 0.2, step):
        i = int(b * SR); out[i:i + k] += kick[:max(0, min(k, n - i))]
    return lp(out, 400) * gain

def stone(gain=0.7):
    a, b = click(gain, 1800), click(gain * 0.5, 900)
    out = np.zeros(max(len(a), int(0.04 * SR) + len(b))); out[:len(a)] += a; out[int(0.04 * SR):int(0.04 * SR) + len(b)] += b
    return out

def buzz(dur=0.35, gain=0.25):
    n = int(dur * SR); t = np.arange(n) / SR
    return lp(np.sign(np.sin(2 * np.pi * 170 * t)) * (0.6 + 0.4 * np.sin(2 * np.pi * 9 * t)), 900) * np.minimum(1, np.minimum(t, dur - t) * 40) * gain

def cues(S):
    cut = B['cut']
    # hook: the bar
    S.sfx_at(thump(B['vote'], gain=0.18), 0.0)
    S.sfx_at(boom(2.0, 46), B['girl'] + 1.6, 0.4)
    # the council
    S.drone([(0, 0), (B['vote'], 0), (B['vote'] + 0.3, 0.45), (B['list'], 0.3), (B['list'] + 0.01, 0), (B['last'], 0), (B['last'] + 0.4, 0.5),
             (B['know'], 0.8), (B['shoulder'], 0.6), (B['stopped'] + 0.4, 0.9), (cut - 0.02, 1.0), (cut, 0), (DUR, 0)])
    S.sfx_at(stone(0.8), B['spare'] + 0.35)
    S.sfx_at(boom(2.6, 40), B['spare'] + 0.4, 0.6)
    S.ticks(B['terms'], cut, every=1.0, gain=0.22)
    for k in ('sunrise', 'selfie'): S.sfx_at(lp(knock(0.7), 600), B[k], 0.3)   # the eldest's finger on the table
    S.sfx_at(chime(2000, 0.5, 0.03), B['saw'] + 1.2)
    # the list, the lesson, the pizza guy: a playful plucked walk
    walk = [0, 3, 7, 10, 12, 10, 7, 3]
    for i, k in enumerate(np.arange(B['list'] + 0.1, B['door'], 0.38)):
        if B['teach'] - 0.2 < k < B['pizza']: continue        # hold the music for the lesson
        S.sfx_at(pluck(note(walk[i % len(walk)] - 24), dur=0.6, bright=0.99), k, 0.11)
    S.sfx_at(whoosh(0.5, 2000, 7000, 0.15), B["pen"], 0.3)   # the nib
    S.sfx_at(boom(1.4, 60), B['liked'] + 0.5, 0.2)            # the laugh beat
    S.sfx_at(boom(2.4, 44), B['forget'] + 0.05, 0.5); S.sfx_at(chime(1300, 0.9, 0.04), B['forget'] + 0.05)
    S.sfx_at(boom(1.4, 60), B['name'] + 1.2, 0.2)
    for i in range(5): S.sfx_at(lp(knock(1.0), 800), B['montage'] + i * 0.95 + 0.05, 0.45)   # door after door
    for i in range(7): S.sfx_at(click(0.4, 3200), B['montage'] + 3.8 + i / 12 + 0.08, 0.3)    # ticks on the list
    # her sorry, in a doorway
    S.room_tone(B['door'], B['last'])
    S.sfx_at(breath(0.5, 0.06), B['sorry'] - 0.4)
    # the last name: cold
    S.tension([(0, 0), (B['last'], 0), (B['know'] - 0.05, 0.9), (B['know'], 0.1), (B['stopped'], 0.4), (cut - 0.05, 1.0), (cut, 0), (DUR, 0)])
    S.sfx_at(boom(2.2, 46), B['last'] + 0.1, 0.4)
    S.sfx_at(buzz(0.35, 0.3), B['know'] + 0.05)
    S.sfx_at(boom(3.0, 36), B['know'] + 0.05, 0.8); S.sfx_at(sting(), B['know'] + 0.05)
    S.silence(B['stopped'] + 0.35, B['stopped'] + 1.15)
    S.sfx_at(boom(2.5, 40), B['stopped'] + 1.2, 0.8)
    S.silence(cut, cut + 1.0)
    S.sfx_at(boom(2.5, 40), cut + 1.0, 0.8)
    S.sfx_at(chime(1320, 0.8, 0.04), cut + 2.25); S.sfx_at(chime(1480, 0.8, 0.04), cut + 2.75)
