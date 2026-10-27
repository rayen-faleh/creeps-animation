"""The Watch, Part V: score and effects cues. Times come from beats.json (beats.py), the same clock as the scenes.
Tension curve: freeze → slow aftermath → silence under the page → reveal → dawn relief → dread returns → hard cut."""
import json, os
import numpy as np
from sound_lib import SR, boom, breath, chime, click, creak, knock, lp, hp, bp, sting, whoosh, _rng

_B = json.load(open(os.path.join(os.path.dirname(os.path.abspath(__file__)), 'beats.json')))
B = _B['B']
DUR = _B['durationSec']

def shape(n, a=0.05, r=0.2):
    e = np.ones(n); na, nr = int(a * SR), int(r * SR)
    e[:na] = np.linspace(0, 1, na); e[-nr:] *= np.linspace(1, 0, nr); return e

def hammer(gain=0.9):
    """A hammer falling on an empty chamber: a hard dry snap, no blast."""
    n = int(0.12 * SR); t = np.arange(n) / SR
    return (bp(_rng.standard_normal(n), 1500, 6000) * np.exp(-t * 90) + np.sin(2 * np.pi * 2200 * t) * np.exp(-t * 70) * 0.6) * gain

def thump(gain=0.4):
    n = int(0.16 * SR); t = np.arange(n) / SR
    return lp(np.sin(2 * np.pi * 60 * t) * np.exp(-t * 30), 300) * gain

def growl(dur=1.2, gain=0.3):
    n = int(dur * SR); t = np.arange(n) / SR
    return bp(_rng.standard_normal(n), 80, 600) * (0.55 + 0.45 * np.sin(2 * np.pi * 24 * t)) * shape(n, 0.1, 0.3) * gain

def page(gain=0.2):
    return whoosh(0.35, 1500, 7000, gain)

def bird(gain=0.03):
    """One faint dawn bird: a quick falling chirp."""
    n = int(0.18 * SR); t = np.arange(n) / SR
    f = 4200 - 1800 * t / 0.18
    return np.sin(2 * np.pi * np.cumsum(f) / SR) * shape(n, 0.01, 0.08) * gain

def cues(S):
    cut = B['cut']
    # the freeze: tension held, then cut dead on the hammer; a long breath of silence after "nothing"
    S.tension([(0, 0.8), (1.0, 1.0), (1.02, 0), (B['silver'] - 0.05, 0.5), (B['silver'], 0), (B['broke'], 0), (B['empty'] - 0.05, 0.8), (B['empty'], 0), (B['bit'], 0.3), (B['pulling'] - 0.05, 1.0), (B['pulling'], 0), (B['home'], 0.2), (B['smaller'] - 0.05, 1.0), (B['smaller'], 0.3), (cut - 0.05, 1.0), (cut, 0), (DUR, 0)])
    S.heartbeat_run(0.0, 1.0, period=0.45, shrink=1.0, fastest=0.45, gain=0.8)
    S.sfx_at(hammer(1.0), 1.0); S.sfx_at(boom(2.6, 40), 1.02, 0.7)
    S.sfx_at(knock(0.4), B['silver'] + 0.05)                               # a breech snap under "silver"
    S.silence(B['nothing'], B['nothing'] + 1.4)
    S.sfx_at(growl(1.0, 0.25), B['nothing'] + 0.3)
    S.drone([(0, 0.7), (1.0, 0.8), (B['nothing'], 0.4), (B['me'], 0.45), (B['ran'], 0.5), (B['empty'], 0.75), (B['page'], 0.3), (B['bit'], 0.6), (B['pulling'], 1.0), (B['dawn'], 0.0), (B['home'], 0.0), (B['home'] + 0.6, 0.5), (B['window'], 0.6), (B['eyes'], 0.85), (cut - 0.02, 1.0), (cut, 0), (DUR, 0)])
    S.wind([(0, 0.2), (B['ran'], 0.5), (B['broke'], 0.3), (B['page'], 0.15), (B['boy'], 0.0), (B['dawn'], 0.0), (B['home'], 0.3), (B['window'], 0.5), (cut - 0.2, 1.2), (cut, 0), (DUR, 0)])
    # the aftermath: Danny's paws going away; the gun breaking open; the empty chambers
    for k in np.arange(B['ran'] + 0.15, B['didnt'] + 0.4, 0.28): S.sfx_at(thump(0.4 * max(0.1, 1 - (k - B['ran']) / 2.2)), k)
    S.sfx_at(click(0.7, 1400), B['broke'] + 0.3); S.sfx_at(knock(0.3), B['broke'] + 0.35)
    S.sfx_at(boom(2.6, 38), B['empty'], 0.6)
    S.heartbeat_run(B['never'], B['boy'], period=1.0, shrink=0.97, fastest=0.8, gain=0.4)
    # the page: paper, then near-silence under the voice
    S.sfx_at(page(0.25), B['page'] + 0.2)
    S.sfx_at(boom(2.0, 46), B['bit'], 0.35)
    # memory (warm): a music box under "I was the boy", cut on the reveal
    S.music_box(B['boy'] - 0.2, [(0, 12), (0.5, 15), (1.0, 19), (1.5, 17), (2.0, 15), (2.5, 12), (3.0, 10), (3.5, 12), (4.0, 7)], bass=[(0, -9), (2.5, -14)], stop=B['pulling'] + 1.6, gain=0.14)
    S.sfx_at(boom(3.0, 36), B['pulling'] + 0.05, 0.9); S.sfx_at(sting(), B['pulling'] + 0.05)
    # dawn: relief, a dawn chord and a bird
    S.dawn_chord(B['dawn'] - 0.3, B['home'] + 0.2, gain=0.035)
    for k in (0.6, 1.4): S.sfx_at(bird(0.03), B['dawn'] + k)
    # dread returns: never came home; the eyes; heartbeat racing to the cut
    S.sfx_at(boom(2.2, 44), B['home'], 0.4)
    S.heartbeat_run(B['window'], cut, period=0.9, shrink=0.9, fastest=0.42, gain=0.85)
    S.sfx_at(chime(1900, 0.5, 0.04), B['eyes'] + 0.05); S.sfx_at(chime(2400, 0.5, 0.04), B['smaller'] + 0.05)
    S.sfx_at(boom(2.6, 40), B['smaller'] + 0.05, 0.6)
    S.silence(cut, cut + 0.98)
    S.sfx_at(boom(2.5, 40), cut + 1.0, 0.8)
