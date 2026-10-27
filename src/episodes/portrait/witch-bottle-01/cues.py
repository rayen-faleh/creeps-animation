"""The Witch Bottle, Part I: score and effects cues. Times come from beats.json (beats.py), the same clock as the scenes."""
import json, os
import numpy as np
from sound_lib import SR, boom, breath, chime, click, creak, knock, lp, hp, bp, sting, whoosh, _rng

_B = json.load(open(os.path.join(os.path.dirname(os.path.abspath(__file__)), 'beats.json')))
B = _B['B']
DUR = _B['durationSec']

def shape(n, a=0.05, r=0.2):
    e = np.ones(n); na, nr = int(a * SR), int(r * SR)
    e[:na] = np.linspace(0, 1, na); e[-nr:] *= np.linspace(1, 0, nr); return e

def crackle(dur, gain=0.12, rate=0.0015):
    """Wood fire: soft roar plus random pops."""
    n = int(dur * SR)
    roar = lp(_rng.standard_normal(n), 500) * 0.25
    pops = (_rng.random(n) < rate) * _rng.standard_normal(n) * 3
    pops = bp(pops, 1500, 7000)
    return (roar + pops) * shape(n, 0.4, 0.4) * gain

def hiss(dur, gain=0.08):
    n = int(dur * SR); t = np.arange(n) / SR
    return hp(_rng.standard_normal(n), 4000) * np.minimum(1, t / dur * 1.5) * (0.8 + 0.2 * np.sin(2 * np.pi * 7 * t)) * shape(n, 0.3, 0.3) * gain

def cough(gain=0.12):
    """A small, chesty cough: a short band-passed burst."""
    n = int(0.22 * SR); t = np.arange(n) / SR
    return bp(_rng.standard_normal(n), 400, 2400) * np.exp(-t * 22) * gain

def bell(gain=0.12, f=196):
    """One stroke of a church bell: inharmonic partials, long decay."""
    n = int(5.0 * SR); t = np.arange(n) / SR
    parts = [(0.5, 0.6), (1.0, 1.0), (1.2, 0.5), (1.5, 0.4), (2.0, 0.35), (2.6, 0.2), (3.0, 0.15)]
    return sum(a * np.sin(2 * np.pi * f * m * t) * np.exp(-t * (0.6 + m * 0.5)) for m, a in parts) * gain

def grunt(gain=0.08):
    n = int(0.4 * SR); t = np.arange(n) / SR
    return lp(_rng.standard_normal(n) * (0.6 + 0.4 * np.sin(2 * np.pi * 22 * t)), 350) * shape(n, 0.05, 0.2) * gain

def tink(gain=0.15, f=3000):
    n = int(0.35 * SR); t = np.arange(n) / SR
    return (np.sin(2 * np.pi * f * t) + 0.5 * np.sin(2 * np.pi * f * 2.7 * t)) * np.exp(-t * 20) * gain

def cues(S):
    cut = B['cut']
    # a slow modal folk tune (A dorian) on the music box, through the memory; stops dead on the cough
    tune = [0, 2, 3, 5, 7, 5, 3, 2, 0, -2, 0, 3, 2, 0, -5, -2]
    notes = [(i * 0.62, 12 + v) for i, v in enumerate(tune * 3)]
    S.music_box(0.4, [n for n in notes if n[0] < B['cough'] - 0.5], bass=[(0, -12), (5, -14), (10, -12), (15, -17)], stop=B['cough'], gain=0.15)
    S.drone([(0, 0.25), (B['cough'], 0.3), (B['jug'], 0.45), (B['embers'], 0.55), (B['door'], 0.7), (B['sat'], 0.5), (B['midnight'], 0.8), (B['knock'], 0.0), (B['still'], 0.6), (cut - 0.02, 1.0), (cut, 0), (DUR, 0)])
    S.tension([(0, 0.3), (0.8, 0), (B['someone'] - 0.05, 0.7), (B['someone'], 0), (B['grey'], 0), (B['comb'] - 0.05, 0.6), (B['comb'], 0), (B['feel'], 0.2), (B['body'] - 0.05, 0.8), (B['body'], 0), (B['midnight'], 0.3), (B['knock'] - 0.05, 1.0), (B['knock'], 0), (B['open'], 0.5), (cut - 0.05, 1.0), (cut, 0), (DUR, 0)])
    # the fire under everything indoors (not on the lane)
    S.sfx_at(crackle(B['lane'] + 0.2, 0.12), 0)
    S.sfx_at(crackle(B['cut'] - B['cough'] + 0.1, 0.12), B['cough'] - 0.1)
    S.room_tone(B['winter'], B['lane'])
    # hook: the jug hissing in the embers
    S.sfx_at(hiss(B['winter'], 0.06), 0.0); S.sfx_at(boom(2.5, 44), 0.05, 0.5)
    S.sfx_at(boom(2.0, 46), B['boiled'] + 0.9, 0.35)
    S.sfx_at(grunt(), B['pig'] + 0.1)
    # the lane: wind and the passing bell
    S.wind([(0, 0), (B['lane'] - 0.2, 0), (B['lane'], 0.6), (B['cough'] - 0.1, 0.5), (B['cough'], 0), (B['open'] + 0.2, 0), (B['open'] + 0.5, 0.9), (cut, 1.2), (cut + 0.01, 0), (DUR, 0)])
    S.sfx_at(bell(0.14), B['lane'] + 0.3); S.sfx_at(bell(0.1), B['lane'] + 2.6)
    # the cough
    for c in (0.9, 1.5, 1.9): S.sfx_at(cough(0.14), B['cough'] + c)
    S.sfx_at(cough(0.1), B['gran'] - 0.4)
    # the jug: down from the shelf, pins, nails, hair; the comb
    S.sfx_at(creak(0.5, 0.05), B['jug'] + 1.2)
    for i in range(3): S.sfx_at(tink(0.18, 2600 + i * 300), B['pins'] + 0.65 + i * 0.05)
    for i in range(2): S.sfx_at(tink(0.2, 1400 + i * 200), B['nails'] + 0.65 + i * 0.08)
    S.sfx_at(whoosh(0.4, 2000, 8000, 0.15), B['comb'] + 0.2)
    # into the embers: a scrape of stoneware, the fire flaring
    S.sfx_at(knock(0.25), B['embers'] + 1.15); S.sfx_at(whoosh(0.6, 200, 1500, 0.4), B['embers'] + 1.2)
    S.sfx_at(boom(2.6, 38), B['body'], 0.6)
    # the vigil: the fire ticks, the jug hisses louder and louder until the knock
    S.ticks(B['sat'], B['hiss'], every=0.9, gain=0.25)
    S.sfx_at(hiss(B['knock'] - B['hiss'], 0.1), B['hiss'])
    # midnight: the coughing stops (silence but the fire)
    S.sfx_at(breath(0.6, 0.08), B['stopped'] + 0.6)
    # the knock
    for k in (0.45, 0.85, 1.25): S.sfx_at(knock(1.0), B['knock'] + k)
    S.sfx_at(boom(2.6, 40), B['knock'] + 0.45, 0.6)
    # the latch, the door, a sizzle from the bound hand
    S.sfx_at(click(0.7, 1200), B['open'] + 0.05); S.sfx_at(creak(0.8, 0.12), B['open'] + 0.3)
    S.sfx_at(hiss(0.8, 0.07), B['open'] + 0.55)
    S.heartbeat_run(B['knock'] + 1.4, cut, period=0.8, shrink=0.9, fastest=0.5, gain=0.7)
    S.silence(cut, cut + 0.98)
    S.sfx_at(boom(2.5, 40), cut + 1.0, 0.8)
