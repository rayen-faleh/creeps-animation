"""My Type, Part 1: a cold council-room drone for the hook, then a warm, slightly cheeky score for the flashback
(a plucked bass line under the telly and the swipes, a club thump for the goth nights), a glass shatter, the score cut
dead at the bite, and the cold back for the envelope and the council. Stones click down for the vote; silence; whisper."""
import json, os
import numpy as np
from sound_lib import SR, boom, breath, chime, click, creak, whoosh, sting, pluck, note, reverb, lp, hp, bp, _rng

_B = json.load(open(os.path.join(os.path.dirname(os.path.abspath(__file__)), 'beats.json')))
B = _B['B']
DUR = _B['durationSec']

def thump(dur, bpm=124, gain=0.22):
    """Muffled club kick through a wall."""
    n = int(dur * SR); out = np.zeros(n); step = 60 / bpm
    k = int(0.18 * SR); tt = np.arange(k) / SR
    kick = np.sin(2 * np.pi * (55 + 90 * np.exp(-tt * 30)) * tt) * np.exp(-tt * 14)
    for b in np.arange(0, dur - 0.2, step):
        i = int(b * SR); out[i:i + k] += kick[:max(0, min(k, n - i))]
    return lp(out, 400) * gain

def crowd(dur, gain=0.03):
    n = int(dur * SR); t = np.arange(n) / SR
    return bp(_rng.standard_normal(n), 300, 2500) * (0.7 + 0.3 * np.sin(2 * np.pi * 0.25 * t)) * gain

def shatter(gain=0.5):
    n = int(0.9 * SR); t = np.arange(n) / SR
    tinkles = (_rng.random(n) < 0.004) * _rng.standard_normal(n) * 4 * np.exp(-t * 4)
    return (hp(_rng.standard_normal(n) * np.exp(-t * 18) + tinkles, 2500)) * gain

def swipe(gain=0.15):
    return whoosh(0.18, 2000, 7000, gain)

def stone(gain=0.7):
    a, b = click(gain, 1800), click(gain * 0.5, 900)
    off = int(0.04 * SR); out = np.zeros(max(len(a), off + len(b)))
    out[:len(a)] += a; out[off:off + len(b)] += b
    return out

def cues(S):
    cut = B['cut']
    # --- hook: the council room
    S.drone([(0, 0.55), (B['hollywood'] - 0.05, 0.6), (B['hollywood'], 0), (B['woke'], 0), (B['woke'] + 0.5, 0.35), (B['rules'], 0.5),
             (B['story'], 0.6), (B['watched'] + 1.5, 0.75), (B['far'], 0.6), (B['each'], 0.75), (cut - 0.02, 1.0), (cut, 0), (DUR, 0)])
    S.sfx_at(boom(2.6, 40), 0.05, 0.6)
    # --- flashback: a cheeky plucked walk under the telly, swipes, club, bar
    walk = [0, 3, 7, 10, 12, 10, 7, 3]
    t0, t1 = B['hollywood'] + 0.1, B['goth']
    for i, k in enumerate(np.arange(t0, t1, 0.36)):
        S.sfx_at(pluck(note(walk[i % len(walk)] - 24) , dur=0.6, bright=0.99), k, 0.12)
    S.sfx_at(click(0.6, 1200), B['hollywood'] + 0.05, 0.4)                    # the telly clicks on
    for k in (B['pale'], B['lace'], B['mornings'], B['goth']): S.sfx_at(swipe(), k - 0.2)
    S.sfx_at(thump(B['then'] - B['goth'], gain=0.24) * np.minimum(1, np.maximum(0, (B['nothing'] + 0.2 - (np.arange(int((B['then'] - B['goth']) * SR)) / SR + B['goth'])) / 0.2)), B['goth'])
    S.sfx_at(crowd(B['door'] - B['goth'], 0.03), B['goth'])
    S.sfx_at(thump(B['door'] - B['then'], gain=0.1), B['then'])
    S.sfx_at(chime(2400, 0.5, 0.03), B['drinking'] + 0.1)                      # light on the full glass
    S.sfx_at(boom(1.6, 60), B['flirting'] + 0.6, 0.15)                        # a beat for the joke
    S.room_tone(B['door'], B['sorry'])
    S.sfx_at(click(0.7, 3500), B['wine'] + 0.6, 0.6)                          # selfie shutter
    S.sfx_at(shatter(0.6), B['broke']); S.sfx_at(boom(1.8, 50), B['broke'], 0.35)
    S.tension([(0, 0), (B['sorry'], 0), (B['black'] - 0.05, 0.9), (B['black'], 0), (B['finds'], 0), (B['eldest'], 0.5), (B['story'], 0),
               (B['far'], 0), (B['hers'], 0.7), (cut - 0.05, 1.0), (cut, 0), (DUR, 0)])
    S.sfx_at(breath(0.9, 0.08), B['sorry'] + 0.2)
    # --- the cold present
    S.sfx_at(boom(3.0, 38), B['woke'], 0.6)
    for k in (B['pulse'] + 0.3, B['pulse'] + 0.55): S.sfx_at(click(0.5, 600), k, 0.5)   # watch buzz
    S.sfx_at(whoosh(0.9, 200, 1600, 0.3), B['envelope'] + 0.1, 0.4)              # envelope under the door
    S.sfx_at(whoosh(0.4, 600, 3000, 0.3), B['made'] - 0.3, 0.3)
    S.wind([(0, 0.15), (B['hollywood'], 0.15), (B['hollywood'] + 0.01, 0), (B['woke'], 0), (B['woke'] + 0.5, 0.2), (cut, 0.2), (cut + 0.01, 0), (DUR, 0)])
    S.sfx_at(whoosh(1.2, 120, 900, 0.5), B['eldest'] + 0.3, 0.5)                 # phone across the cloth
    S.sfx_at(boom(2.6, 40), B['nobody'], 0.7); S.sfx_at(sting(), B['nobody'])
    for i in range(12): S.sfx_at(click(0.25, 4200), B['watched'] + i * 0.11, 0.25)   # the count ticking up
    S.heartbeat_run(B['far'], B['hers'], period=0.9, shrink=0.92, fastest=0.55, gain=0.5)
    for i in range(6): S.sfx_at(stone(0.7), B['each'] + 0.15 + i * 0.22 + 0.18)
    S.sfx_at(boom(3.0, 36), B['hers'] + 0.5, 0.8)
    S.silence(cut, cut + 1.0)
    S.sfx_at(boom(2.5, 40), cut + 1.0, 0.8)                                   # the question
    S.sfx_at(chime(1320, 0.8, 0.04), cut + 2.25); S.sfx_at(chime(1480, 0.8, 0.04), cut + 2.75)
