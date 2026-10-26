"""Would You Survive? Vampire: score and effects cues. Times come from beats.json (beats.py), the same clock as the scenes.
No heartbeat anywhere: you're dead."""
import json, os
import numpy as np
from sound_lib import SR, boom, breath, chime, click, creak, knock, lp, hp, bp, sting, whoosh, _rng

_B = json.load(open(os.path.join(os.path.dirname(os.path.abspath(__file__)), 'beats.json')))
B = _B['B']
DUR = _B['durationSec']

def footstep(gain=0.5):
    n = int(0.18 * SR); t = np.arange(n) / SR
    return lp(np.sin(2 * np.pi * 70 * t) * np.exp(-t * 40), 400) * gain + bp(_rng.standard_normal(n), 1500, 5000) * np.exp(-t * 30) * 0.25 * gain

def tink(gain=0.3, f=3200):
    n = int(0.4 * SR); t = np.arange(n) / SR
    return (np.sin(2 * np.pi * f * t) + 0.5 * np.sin(2 * np.pi * f * 2.7 * t)) * np.exp(-t * 18) * gain

def buzz(dur=0.35, gain=0.25):
    """Phone vibrating against a hand."""
    n = int(dur * SR); t = np.arange(n) / SR
    return lp(np.sign(np.sin(2 * np.pi * 165 * t)) * (0.6 + 0.4 * np.sin(2 * np.pi * 9 * t)), 900) * np.minimum(1, np.minimum(t, dur - t) * 40) * gain

def sizzle(dur=1.0, gain=0.12):
    n = int(dur * SR); t = np.arange(n) / SR
    crackle = (_rng.random(n) < 0.004) * _rng.standard_normal(n) * 4
    return hp(_rng.standard_normal(n) * 0.5 + crackle, 3000) * np.sin(np.linspace(0, np.pi, n)) ** 0.5 * gain

def thud(gain=0.6):
    """Hands hitting a wall that isn't there: a dull low knock with a glassy ring."""
    n = int(1.2 * SR); t = np.arange(n) / SR
    return lp(np.sin(2 * np.pi * 52 * t) * np.exp(-t * 9), 300) * gain + np.sin(2 * np.pi * 880 * t) * np.exp(-t * 5) * 0.05 * gain

def cues(S):
    cut = B['cut']
    S.drone([(0, 0.5), (B['day2'], 0.35), (B['day3'], 0.45), (B['cant'], 0.75), (B['rent'], 1.0), (B['knock'], 0.9), (cut - 0.02, 1.0), (cut, 0), (DUR, 0)])
    S.wind([(0, 0), (B['day3'], 0), (B['day3'] + 0.3, 0.45), (B['home'], 0.35), (B['text'], 0.5), (cut - 0.2, 1.4), (cut, 0), (DUR, 0)])
    S.tension([(0, 0.3), (0.9, 0), (B['home'], 0), (B['cant'] - 0.05, 0.7), (B['cant'], 0.1), (B['rent'] - 0.05, 1.0), (B['rent'], 0), (B['text'], 0.2), (cut - 0.05, 1.0), (cut, 0), (DUR, 0)])
    # hook: the bathroom, a tap drip, the mirror
    S.room_tone(0, B['day2'])
    S.sfx_at(boom(2.5, 44), 0.05, 0.5)
    for k in (0.9, 2.5, 4.1): S.sfx_at(tink(0.08, 1900), k)
    S.sfx_at(whoosh(0.5, 300, 3000, 0.4), B['week'] - 0.2)
    # day one: Face ID fails, two buzzes
    S.sfx_at(click(0.3), B['phone'] + 0.3)
    S.sfx_at(buzz(), B['fail']); S.sfx_at(buzz(), B['fail'] + 0.55)
    # day two: the sun burns; the blind slams down
    S.dawn_chord(B['day2'] - 0.4, B['blind'] + 0.2, gain=0.03)
    S.sfx_at(sizzle(), B['sun'] + 0.1); S.sfx_at(whoosh(0.25, 400, 4000, 0.4), B['sun'] + 0.35)
    S.sfx_at(whoosh(0.45, 200, 2500, 0.6), B['blind'] + 0.05)
    for k in range(6): S.sfx_at(click(0.25, 2500 + k * 150), B['blind'] + 0.08 + k * 0.07)
    S.sfx_at(knock(0.5), B['blind'] + 0.5); S.sfx_at(boom(1.5, 60), B['blind'] + 0.5, 0.25)
    # day three: footsteps and keys, the door, the wall that isn't there
    for k in np.arange(B['day3'] + 0.2, B['home'] + 0.6, 0.52): S.sfx_at(footstep(0.45), k)
    for k in np.arange(B['day3'] + 0.25, B['home'], 0.52): S.sfx_at(tink(0.05, 3800 + _rng.uniform(-300, 300)), k)
    S.sfx_at(click(0.6, 1800), B['home'] + 0.05); S.sfx_at(creak(1.0, 0.1), B['home'] + 0.12)
    S.room_tone(B['home'] + 0.3, B['knock'], gain=0.03)
    S.sfx_at(thud(0.9), B['cant']); S.sfx_at(boom(2.2, 40), B['cant'], 0.55)
    S.sfx_at(scrape := bp(_rng.standard_normal(int(2.6 * SR)), 2500, 7000) * np.sin(np.linspace(0, np.pi, int(2.6 * SR))) * 0.03, B['rule'] + 0.2)
    for i in range(4): S.sfx_at(tink(0.3, 2600 + i * 400), B['drop'] + 0.35 + i * 0.06)
    # you rent.
    S.sfx_at(boom(3.0, 36), B['rent'], 0.9); S.sfx_at(sting(), B['rent'])
    # the landlord
    S.sfx_at(buzz(0.3, 0.3), B['text'] + 0.5); S.sfx_at(buzz(0.3, 0.3), B['nine'] + 0.25)
    S.sfx_at(breath(0.7, 0.1), B['knock'] - 0.2)
    # the knock lands on the cut; silence; the whisper; the card
    S.sfx_at(knock(1.0), cut - 0.06)
    S.silence(cut, cut + 0.98)
    S.sfx_at(boom(2.5, 40), cut + 1.0, 0.8)
    S.sfx_at(chime(1320, 0.8, 0.04), cut + 2.55)
