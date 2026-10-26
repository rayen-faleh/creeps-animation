"""The Watch, Part III: score and effects cues. Times come from beats.json (beats.py), the same clock as the scenes."""
import json, os
import numpy as np
from sound_lib import SR, boom, breath, chime, click, creak, knock, lp, bp, scratch, sting, whoosh, _rng

_B = json.load(open(os.path.join(os.path.dirname(os.path.abspath(__file__)), 'beats.json')))
B = _B['B']
DUR = _B['durationSec']

def layer(*sigs):
    n = max(len(x) for x in sigs); out = np.zeros(n)
    for x in sigs: out[: len(x)] += x
    return out

def footstep(gain=0.5):
    n = int(0.18 * SR); t = np.arange(n) / SR
    return lp(np.sin(2 * np.pi * 70 * t) * np.exp(-t * 40), 400) * gain + bp(_rng.standard_normal(n), 1500, 5000) * np.exp(-t * 30) * 0.25 * gain

def slide(dur=1.8, gain=0.08):
    """Metal dragged across wood."""
    n = int(dur * SR); t = np.arange(n) / SR
    return bp(_rng.standard_normal(n), 1800, 6000) * (0.5 + 0.5 * np.sin(2 * np.pi * 31 * t)) * np.sin(np.linspace(0, np.pi, n)) * gain

def tink(gain=0.3, f=3200):
    n = int(0.4 * SR); t = np.arange(n) / SR
    return (np.sin(2 * np.pi * f * t) + 0.5 * np.sin(2 * np.pi * f * 2.7 * t)) * np.exp(-t * 18) * gain

def cues(S):
    cut = B['cut']
    S.drone([(0, 0.55), (B['sat'], 0.4), (B['look'], 0.45), (B['except'], 0.7), (B['pull'], 0.9), (B['out'], 1.0), (B['reach'], 0.8), (cut - 0.02, 1.0), (cut, 0), (DUR, 0)])
    S.wind([(0, 0.25), (B['sat'], 0.1), (B['look'], 0.1), (B['look'] + 0.4, 0.5), (B['except'], 0.6), (B['reach'], 1.0), (cut - 0.2, 1.8), (cut, 0), (DUR, 0)])
    S.tension([(0, 0.4), (0.8, 0), (B['every'], 0), (B['except'] - 0.05, 0.8), (B['except'], 0.1), (B['out'] - 0.05, 1.0), (B['out'], 0), (B['reach'], 0.3), (cut - 0.05, 1.0), (cut, 0), (DUR, 0)])
    # hook: the door swings in, claws on the wood
    S.sfx_at(creak(1.4, 0.12), 0.1)
    for k in range(4): S.sfx_at(scratch(_rng.uniform(0.12, 0.18), 0.1), 0.9 + k * 0.18)
    S.sfx_at(boom(2.5, 44), 0.05, 0.5)
    # recap: a page; then the table
    S.sfx_at(whoosh(0.35, 1800, 7000, 0.35), B['recap'] + 0.1)
    S.room_tone(B['sat'], B['look'])
    S.sfx_at(creak(0.6, 0.06), B['sat'] + 0.3)                               # his chair
    S.sfx_at(slide(), B['slid'] + 0.4); S.sfx_at(tink(0.2), B['slid'] + 2.3)   # the nail across the table
    # the street: footsteps, then a glint at each sill
    for k in np.arange(B['look'] + 0.3, B['two'], 0.52): S.sfx_at(footstep(0.5), k)
    for key in ('two', 'four', 'danny'):
        S.sfx_at(chime(2800 + 120 * ('two', 'four', 'danny').index(key), 0.5, 0.05), B[key] + 0.4)
        for k in np.arange(B[key] + 0.9, B[key] + 1.9, 0.52): S.sfx_at(footstep(0.4), k)
    for k in range(6): S.sfx_at(chime(2600 + k * 90, 0.4, 0.03), B['every'] + 0.3 + k * 0.28)
    S.sfx_at(whoosh(0.35, 300, 4000), B['except'], 0.6); S.sfx_at(boom(2.4, 46), B['except'] + 0.25, 0.6)
    S.heartbeat_run(B['holes'], B['cut'], period=0.95, shrink=0.94, fastest=0.48, gain=0.75)
    S.sfx_at(creak(0.9, 0.1), B['pull'] - 0.6)                               # the casement opens
    for i in range(8): S.sfx_at(tink(0.35, 2600 + i * 170), B['out'] + 0.15 + i * 0.07)   # the nails on the stone
    S.sfx_at(boom(3.0, 36), B['out'], 0.9); S.sfx_at(sting(), B['out'])
    S.sfx_at(breath(0.7, 0.12), B['reach'] + 1.4)
    S.sfx_at(boom(2.5, 40), cut + 1.0, 0.8)                                  # title
    S.silence(cut, cut + 0.98)
