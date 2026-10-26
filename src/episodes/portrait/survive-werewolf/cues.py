"""Would You Survive? Werewolf: score and effects cues. Times come from beats.json (beats.py), the same clock as the scenes.
Unlike the vampire, you're alive: the heartbeat runs, faster each time the wolf gets closer."""
import json, os
import numpy as np
from sound_lib import SR, boom, breath, chime, click, creak, knock, lp, hp, bp, sting, whoosh, _rng

_B = json.load(open(os.path.join(os.path.dirname(os.path.abspath(__file__)), 'beats.json')))
B = _B['B']
DUR = _B['durationSec']

def env_shape(n, a=0.05, r=0.2):
    e = np.ones(n); na, nr = int(a * SR), int(r * SR)
    e[:na] = np.linspace(0, 1, na); e[-nr:] *= np.linspace(1, 0, nr); return e

def growl(dur=1.6, gain=0.35):
    """A dog's low growl: rumbling noise, pulsing at ~28 Hz."""
    n = int(dur * SR); t = np.arange(n) / SR
    body = bp(_rng.standard_normal(n), 90, 700) * (0.55 + 0.45 * np.sin(2 * np.pi * 28 * t + 3 * np.sin(2 * np.pi * 1.3 * t)))
    return body * env_shape(n, 0.15, 0.3) * gain

def whine(gain=0.06):
    n = int(0.5 * SR); t = np.arange(n) / SR
    f = 950 - 350 * t / 0.5
    return np.sin(2 * np.pi * np.cumsum(f) / SR) * env_shape(n, 0.03, 0.2) * gain

def claws_skitter(dur=0.6, gain=0.15):
    out = np.zeros(int(dur * SR))
    for k in np.arange(0, dur - 0.05, 0.07): 
        c = click(1.0, _rng.uniform(2500, 4500))[: int(0.04 * SR)]
        i = int(k * SR); out[i: i + len(c)] += c * gain
    return out

def tink(gain=0.3, f=3200):
    n = int(0.4 * SR); t = np.arange(n) / SR
    return (np.sin(2 * np.pi * f * t) + 0.5 * np.sin(2 * np.pi * f * 2.7 * t)) * np.exp(-t * 18) * gain

def buzz(dur=0.3, gain=0.25):
    n = int(dur * SR); t = np.arange(n) / SR
    return lp(np.sign(np.sin(2 * np.pi * 170 * t)) * (0.6 + 0.4 * np.sin(2 * np.pi * 9 * t)), 900) * np.minimum(1, np.minimum(t, dur - t) * 40) * gain

def ding(f=1568, gain=0.08):
    n = int(0.9 * SR); t = np.arange(n) / SR
    return (np.sin(2 * np.pi * f * t) + 0.4 * np.sin(2 * np.pi * f * 1.5 * t)) * np.exp(-t * 5) * gain

def bleat(gain=0.05):
    """One distant sheep: a wavering nasal tone, filtered far away."""
    n = int(0.7 * SR); t = np.arange(n) / SR
    f = 330 + 20 * np.sin(2 * np.pi * 9 * t)
    x = np.sign(np.sin(2 * np.pi * np.cumsum(f) / SR)) * env_shape(n, 0.06, 0.3)
    return lp(bp(x, 300, 2500), 1400) * gain

def cues(S):
    cut = B['cut']
    S.drone([(0, 0.45), (B['day1'], 0.5), (B['day2'], 0.6), (B['day3'], 0.0), (B['wake'], 0.0), (B['mud'], 0.4), (B['miles'], 0.3), (B['farm'], 0.5), (B['buzz'], 0.7), (cut - 0.02, 1.0), (cut, 0), (DUR, 0)])
    S.wind([(0, 0), (B['day2'], 0), (B['day2'] + 0.3, 0.6), (B['day3'], 0.5), (B['day3'] + 0.1, 0), (B['wake'], 0.2), (B['buzz'], 0.5), (cut - 0.2, 1.6), (cut, 0), (DUR, 0)])
    S.tension([(0, 0.3), (0.9, 0), (B['week'], 0), (B['day1'] - 0.05, 0.6), (B['day1'], 0), (B['best'] - 0.05, 0.9), (B['best'], 0), (B['tonight'], 0.3), (cut - 0.05, 1.0), (cut, 0), (DUR, 0)])
    # hook: the kitchen, the watch, the hand curling
    S.room_tone(0, B['day2'])
    S.sfx_at(boom(2.5, 44), 0.05, 0.5)
    S.sfx_at(breath(0.8, 0.1), B['week'] + 0.4)
    # day one: the dog
    S.sfx_at(growl(B['bolt'] - B['day1'] + 0.1, 0.4), B['day1'] + 0.05)
    S.sfx_at(whine(), B['bolt'] - 0.05); S.sfx_at(claws_skitter(), B['bolt'])
    # day two: the moon, the lock, the key out of the window
    S.sfx_at(boom(2.0, 50), B['moon'], 0.3)
    S.sfx_at(click(0.6, 1500), B['lock'] + 0.25); S.sfx_at(knock(0.45), B['key'] - 0.2)
    S.sfx_at(creak(0.6, 0.08), B['key'] - 0.1); S.sfx_at(whoosh(0.3, 600, 4000, 0.4), B['key'] + 0.25)
    S.sfx_at(tink(0.06, 3400), B['key'] + 1.5)                              # far below, on stone
    S.sfx_at(buzz(), B['easy'] - 0.55); S.sfx_at(ding(1760, 0.06), B['easy'] - 0.5)
    S.heartbeat_run(B['key'], B['day3'] - 0.1, period=0.8, shrink=0.9, fastest=0.5, gain=0.7)
    # day three: silence, then waking; birdless grey morning
    S.silence(B['day3'] + 0.05, B['wake'] - 0.1)
    S.sfx_at(breath(0.9, 0.14), B['wake'] + 0.1); S.sfx_at(breath(0.7, 0.1), B['wake'] + 1.4)
    # the watch: a chime, the count, the personal best
    S.sfx_at(ding(1568, 0.06), B['watch'] + 0.5)
    for k in range(8): S.sfx_at(click(0.18, 3000 + k * 120), B['miles'] + k * 0.12)
    S.sfx_at(ding(2093, 0.1), B['best']); S.sfx_at(ding(2637, 0.07), B['best'] + 0.12)
    S.sfx_at(boom(2.6, 38), B['best'] + 0.05, 0.6)
    # the farm
    S.sfx_at(whoosh(0.3, 1500, 6000, 0.3), B['farm'] + 0.05)
    S.sfx_at(bleat(0.06), B['farm'] + 1.7); S.sfx_at(bleat(0.04), B['farm'] + 2.4)
    # tonight
    S.sfx_at(buzz(0.3, 0.3), B['buzz'] + 0.1); S.sfx_at(buzz(0.3, 0.3), B['buzz'] + 0.7)
    S.heartbeat_run(B['tonight'], cut, period=0.7, shrink=0.88, fastest=0.42, gain=0.85)
    S.sfx_at(growl(1.0, 0.25), cut - 1.0)
    S.silence(cut, cut + 0.98)
    S.sfx_at(boom(2.5, 40), cut + 1.0, 0.8)
    S.sfx_at(chime(1320, 0.8, 0.04), cut + 2.55)
