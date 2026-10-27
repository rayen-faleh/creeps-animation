"""Graveyard Shift, Part 1: score and effects cues. Fluorescent hum and fridge buzz under the shop; small dry comedy
sounds; the horror beats get silence and a heartbeat. Times from beats.json."""
import json, os
import numpy as np
from sound_lib import SR, boom, breath, chime, click, creak, knock, lp, hp, bp, sting, whoosh, _rng

_B = json.load(open(os.path.join(os.path.dirname(os.path.abspath(__file__)), 'beats.json')))
B = _B['B']
DUR = _B['durationSec']

def hum(dur, gain=0.03):
    """Fluorescent tubes: 100 Hz mains hum with a little buzz."""
    n = int(dur * SR); t = np.arange(n) / SR
    return (np.sin(2 * np.pi * 100 * t) + 0.4 * np.sin(2 * np.pi * 200 * t) + 0.15 * np.sign(np.sin(2 * np.pi * 100 * t))) * gain

def tink(gain=0.15, f=3000):
    n = int(0.35 * SR); t = np.arange(n) / SR
    return (np.sin(2 * np.pi * f * t) + 0.5 * np.sin(2 * np.pi * f * 2.7 * t)) * np.exp(-t * 20) * gain

def slide(dur=0.8, gain=0.12):
    """Automatic doors sliding: a motor whirr."""
    n = int(dur * SR); t = np.arange(n) / SR
    return lp(np.sign(np.sin(2 * np.pi * 70 * t)) * 0.5 + _rng.standard_normal(n) * 0.2, 800) * np.sin(np.linspace(0, np.pi, n)) * gain

def beep(gain=0.08, f=1800):
    n = int(0.12 * SR); t = np.arange(n) / SR
    return np.sin(2 * np.pi * f * t) * np.minimum(1, (0.12 - t) * 40) * gain

def sizzle(dur=1.2, gain=0.1):
    n = int(dur * SR)
    crackle = (_rng.random(n) < 0.004) * _rng.standard_normal(n) * 4
    return hp(_rng.standard_normal(n) * 0.4 + crackle, 3000) * np.sin(np.linspace(0, np.pi, n)) ** 0.5 * gain

def cues(S):
    cut = B['cut']
    S.sfx_at(hum(B['black'], 0.025), 0.0)
    S.sfx_at(hum(cut - B['wake'], 0.025), B['wake'])
    S.drone([(0, 0.35), (B['cctv'], 0.6), (B['lean'], 0.8), (B['black'], 0), (B['wake'] + 0.5, 0.2), (B['five'], 0.35), (B['pump'], 0.6), (B['dawn'], 0.7), (B['receipt'], 0.85), (cut - 0.02, 1.0), (cut, 0), (DUR, 0)])
    S.tension([(0, 0.3), (1.0, 0), (B['cctv'], 0), (B['nobody'] - 0.05, 0.9), (B['nobody'], 0), (B['lean'], 0.3), (B['tired'] + 0.6, 1.0), (B['black'] - 0.02, 1.0), (B['black'], 0), (B['pump'], 0.3), (B['pump'] + 2.0, 0.6), (B['smoke'], 0.8), (B['number'] - 0.05, 1.0), (B['number'], 0.3), (cut - 0.05, 0.8), (cut, 0), (DUR, 0)])
    # the hook: a sensor that doesn't fire; knuckles on glass
    S.sfx_at(boom(2.2, 46), 0.05, 0.35)
    S.sfx_at(beep(0.05, 600), B['wouldnt'] - 0.1)
    for k in (0.4, 0.75, 1.1): S.sfx_at(knock(0.5), B['knock'] + k)
    # comedy: the door button, the doors whirring open
    S.sfx_at(click(0.5, 2200), B['yes'] + 0.4); S.sfx_at(beep(0.07), B['yes'] + 0.45)
    S.sfx_at(slide(0.9, 0.12), B['shop'] - 0.3)
    # coins on the counter, the till
    S.sfx_at(tink(0.2, 2200), B['rice'] + 0.7); S.sfx_at(tink(0.18, 2500), B['rice'] + 0.85)
    S.sfx_at(chime(1500, 0.5, 0.04), B['coins'] + 0.2)
    # the CCTV: static, then the hit on "nobody"
    S.sfx_at(hp(_rng.standard_normal(int(1.5 * SR)), 3000) * 0.015, B['cctv'] + 0.1)
    S.sfx_at(boom(2.6, 40), B['nobody'] + 0.05, 0.7); S.sfx_at(sting(), B['nobody'] + 0.05)
    # he leans in; then black and silence
    S.sfx_at(breath(0.8, 0.1), B['tired'] - 0.2)
    S.silence(B['black'], B['wake'] + 0.3)
    S.sfx_at(boom(2.0, 36), B['black'], 0.6)
    # waking: breath; the till drawer
    S.sfx_at(breath(0.9, 0.12), B['wake'] + 0.3); S.sfx_at(click(0.4, 1400), B['till'] + 0.2)
    # counting rice: ticks; mopping: a squeak
    for k in np.arange(B['count'] + 0.3, B['dozed'], 0.42): S.sfx_at(tink(0.04, 3800), k)
    S.sfx_at(creak(0.5, 0.04), B['dozed'] + 0.8)
    # coffee: the machine, a hiss, the recoil
    S.sfx_at(lp(_rng.standard_normal(int(1.2 * SR)), 900) * 0.04, B['five'] + 0.2)
    S.sfx_at(whoosh(0.3, 300, 3000, 0.4), B['coffee'] + 0.5)
    # the heartbeat of the man at pump four, loud and close
    S.heartbeat_run(B['pump'] + 0.3, B['dawn'], period=0.75, shrink=1.0, fastest=0.75, gain=1.0)
    # dawn: your hand smokes
    S.dawn_chord(B['dawn'] - 0.2, B['ends'] + 0.5, gain=0.03)
    S.sfx_at(sizzle(1.4, 0.12), B['smoke'] - 0.1)
    S.ticks(B['ends'], B['receipt'], every=1.0, gain=0.35)
    # the number
    S.sfx_at(boom(2.4, 42), B['number'] + 0.05, 0.6)
    S.silence(cut, cut + 0.98)
    S.sfx_at(boom(2.5, 40), cut + 1.0, 0.8)
    S.sfx_at(chime(1320, 0.6, 0.04), cut + 2.25); S.sfx_at(chime(1568, 0.6, 0.04), cut + 2.75)
