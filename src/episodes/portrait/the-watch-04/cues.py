"""The Watch, Part IV: score and effects cues. Times come from beats.json (beats.py), the same clock as the scenes."""
import json, os
import numpy as np
from sound_lib import SR, boom, breath, chime, click, creak, knock, lp, hp, bp, sting, whoosh, _rng

_B = json.load(open(os.path.join(os.path.dirname(os.path.abspath(__file__)), 'beats.json')))
B = _B['B']
DUR = _B['durationSec']

def shape(n, a=0.05, r=0.2):
    e = np.ones(n); na, nr = int(a * SR), int(r * SR)
    e[:na] = np.linspace(0, 1, na); e[-nr:] *= np.linspace(1, 0, nr); return e

def thump(gain=0.4):
    """A paw striking turf."""
    n = int(0.16 * SR); t = np.arange(n) / SR
    return lp(np.sin(2 * np.pi * 60 * t) * np.exp(-t * 30), 300) * gain + bp(_rng.standard_normal(n), 300, 1500) * np.exp(-t * 40) * 0.2 * gain

def growl(dur=1.4, gain=0.35):
    n = int(dur * SR); t = np.arange(n) / SR
    body = bp(_rng.standard_normal(n), 80, 600) * (0.55 + 0.45 * np.sin(2 * np.pi * 24 * t + 3 * np.sin(2 * np.pi * 1.1 * t)))
    return body * shape(n, 0.15, 0.3) * gain

def pant(dur, gain=0.06, rate=3.2):
    n = int(dur * SR); t = np.arange(n) / SR
    return bp(_rng.standard_normal(n), 600, 3000) * np.maximum(0, np.sin(2 * np.pi * rate * t)) ** 2 * gain

def torch_click(gain=0.5):
    return click(gain, 2200)

def gun_cock(gain=0.6):
    """Two metallic clacks: the hammers / the action closing."""
    n = int(0.5 * SR); out = np.zeros(n)
    for k, f in ((0.0, 1800), (0.18, 2400)):
        i = int(k * SR); m = int(0.08 * SR); tt = np.arange(m) / SR
        out[i:i + m] += (bp(_rng.standard_normal(m), f, f * 3) * np.exp(-tt * 60) + np.sin(2 * np.pi * f * tt) * np.exp(-tt * 40) * 0.5) * gain
    return out

def cues(S):
    cut = B['cut']
    S.drone([(0, 0.6), (B['mick'], 0.35), (B['ran'], 0.2), (B['street'], 0.45), (B['click'], 0.6), (B['someone'], 0.7), (B['mum'], 0.85), (B['said'], 0.7), (B['turned'], 0.8), (B['danny'], 1.0), (B['family'], 0.8), (cut - 0.02, 1.0), (cut, 0), (DUR, 0)])
    S.wind([(0, 0.3), (B['mick'], 0.25), (B['ran'], 0.4), (B['ran'] + 0.3, 1.0), (B['street'], 0.5), (B['lamp'], 0.3), (B['claws'], 0.6), (cut - 0.2, 1.2), (cut, 0), (DUR, 0)])
    S.tension([(0, 0.5), (1.0, 0), (B['someone'], 0), (B['mum'] - 0.05, 0.9), (B['mum'], 0), (B['turned'], 0.3), (B['danny'] - 0.05, 1.0), (B['danny'], 0), (B['claws'], 0.4), (cut - 0.05, 1.0), (cut, 0), (DUR, 0)])
    # hook: the torch, the gun, a low growl from me
    S.sfx_at(torch_click(0.6), 0.05); S.sfx_at(boom(2.6, 42), 0.05, 0.6)
    S.sfx_at(growl(1.6, 0.3), 0.6)
    S.heartbeat_run(0.2, B['mick'] - 0.3, period=0.55, shrink=0.98, fastest=0.5, gain=0.6)
    # Mick under the lamp (memory); the card; the empty sill
    S.music_box(B['mick'] + 0.2, [(0, 12), (0.6, 15), (1.2, 19), (1.8, 17), (2.4, 15), (3.6, 12), (4.2, 10), (4.8, 12), (5.4, 7)], bass=[(0, -9), (3.6, -14)], stop=B['died'] + 1.2, gain=0.14)
    S.sfx_at(whoosh(0.35, 1800, 7000, 0.3), B['died'] + 0.05)
    S.sfx_at(boom(2.2, 46), B['out'], 0.4)
    # the run: paws, panting, wind
    gait = 1 / 1.6
    for k in np.arange(B['ran'] + 0.1, B['street'] - 0.1, gait / 2): S.sfx_at(thump(0.45), k)
    S.sfx_at(pant(B['street'] - B['ran'], 0.07), B['ran'])
    # down Moor End; the torch clicks on
    for k in np.arange(B['street'] + 0.2, B['click'], 0.62): S.sfx_at(thump(0.25), k)
    S.sfx_at(torch_click(0.9), B['click'] + 0.05); S.sfx_at(boom(2.4, 44), B['click'] + 0.08, 0.6)
    S.heartbeat_run(B['click'], B['mum'], period=0.9, shrink=0.93, fastest=0.55, gain=0.7)
    # Danny's mum; the gun cocked; silver
    S.sfx_at(boom(3.0, 36), B['mum'], 0.9); S.sfx_at(sting(), B['mum'])
    S.sfx_at(gun_cock(0.6), B['barrels'] - 0.1)
    S.sfx_at(chime(2637, 0.6, 0.05), B['silver'] + 0.02)
    # she turns the gun; onto Danny
    S.sfx_at(whoosh(0.5, 200, 1800, 0.4), B['turned'] + 0.3)
    S.sfx_at(boom(3.0, 38), B['danny'], 0.9); S.sfx_at(growl(1.6, 0.4), B['danny'] + 0.15)
    S.heartbeat_run(B['danny'], cut, period=0.75, shrink=0.9, fastest=0.42, gain=0.85)
    S.sfx_at(growl(1.2, 0.45), B['claws'])
    S.sfx_at(click(0.9, 1600), cut - 0.06)                                       # the trigger's first click; hard cut
    S.silence(cut, cut + 0.98)
    S.sfx_at(boom(2.5, 40), cut + 1.0, 0.8)
