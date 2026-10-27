"""Dating a vampire: score and effects cues. Comedy beats get small dry sounds and silence; the last day turns to horror."""
import json, os
import numpy as np
from sound_lib import SR, boom, breath, chime, click, creak, knock, lp, hp, bp, sting, whoosh, _rng

_B = json.load(open(os.path.join(os.path.dirname(os.path.abspath(__file__)), 'beats.json')))
B = _B['B']
DUR = _B['durationSec']

def tink(gain=0.1, f=3200):
    n = int(0.3 * SR); t = np.arange(n) / SR
    return (np.sin(2 * np.pi * f * t) + 0.4 * np.sin(2 * np.pi * f * 2.7 * t)) * np.exp(-t * 25) * gain

def rice(dur=1.2, gain=0.25):
    """Grains pattering across boards."""
    n = int(dur * SR); t = np.arange(n) / SR
    hits = (_rng.random(n) < 0.02 * np.exp(-t * 2)) * _rng.standard_normal(n) * 3
    return bp(hits, 2500, 9000) * gain

def shutter(gain=0.4):
    a, b = click(gain, 3500), click(gain * 0.7, 2500)
    off = int(0.06 * SR)
    out = np.zeros(max(len(a), off + len(b)))
    out[:len(a)] += a; out[off:off + len(b)] += b
    return out

def fridge(dur, gain=0.03):
    n = int(dur * SR); t = np.arange(n) / SR
    return lp(np.sin(2 * np.pi * 50 * t) + 0.3 * np.sin(2 * np.pi * 100 * t), 300) * gain

def tape(gain=0.15):
    n = int(0.5 * SR); t = np.arange(n) / SR
    return bp(_rng.standard_normal(n), 1500, 6000) * (0.6 + 0.4 * np.sin(2 * np.pi * 40 * t)) * np.minimum(1, (0.5 - t) * 8) * gain

def cues(S):
    cut = B['cut']
    # a waltzing music box under the romance; it slows and stops on day seven
    waltz = [12, 15, 19, 17, 15, 12, 14, 15, 17, 15, 12, 10]
    notes = [(i * 0.55, v) for i, v in enumerate(waltz * 12) if i * 0.55 < B['day7'] - 0.5]
    S.music_box(0.3, notes, bass=[(k, -9 if (k // 4) % 2 == 0 else -14) for k in np.arange(0, B['day7'] - 1, 1.65)], stop=B['day7'], gain=0.12)
    S.room_tone(0, B['day7'], gain=0.03)
    # hook: a cartoon contrast: a soft chime for Hollywood, a low thud for folklore, a wet little wave
    S.sfx_at(chime(1760, 0.6, 0.05), B['hollywood'] + 0.1)
    S.sfx_at(whoosh(0.3, 300, 4000, 0.4), B['folklore']); S.sfx_at(boom(1.5, 60), B['folklore'] + 0.1, 0.3)
    S.sfx_at(tink(0.06, 900), B['tuesday'] + 0.2)
    # day one: the door; four a.m.: the fridge
    S.sfx_at(creak(0.8, 0.06), B['day1'] + 0.1)
    S.sfx_at(click(0.5, 1200), B['kitchen'] - 0.2); S.sfx_at(fridge(B['day2'] - B['kitchen']), B['kitchen'])
    S.ticks(B['expire'], B['day2'], every=1.0, gain=0.2)
    # day two: the phone camera
    S.sfx_at(shutter(0.4), B['day2'] + 0.55)
    # day three: cutlery, then silence on "your neck"
    S.sfx_at(tink(0.08, 2600), B['day3'] + 0.5); S.sfx_at(tink(0.06, 2900), B['day3'] + 1.4)
    S.silence(B['neck'], B['neck'] + 1.0)
    # day four: the bag hits the floor, rice everywhere; counting ticks; a sweep on "lost his place"
    S.sfx_at(knock(0.4), B['drop'] + 0.2); S.sfx_at(rice(1.4, 0.3), B['drop'] + 0.2)
    for k in np.arange(B['count'] + 0.2, B['lost'], 0.22): S.sfx_at(tink(0.03, 3800 + _rng.uniform(-300, 300)), k)
    S.sfx_at(whoosh(0.4, 800, 6000, 0.4), B['lost'] + 0.2); S.sfx_at(rice(0.6, 0.2), B['lost'] + 0.3)
    # day five: a thump of soil
    S.sfx_at(boom(1.0, 70), B['soil'] + 0.2, 0.25); S.sfx_at(bp(_rng.standard_normal(int(0.4 * SR)), 300, 2000) * 0.05, B['soil'] + 0.25)
    # day six: dawn chord, then tape ripping
    S.dawn_chord(B['day6'] - 0.3, B['film'] + 0.2, gain=0.03)
    S.sfx_at(tape(0.15), B['taped'] - 0.1); S.sfx_at(tape(0.12), B['taped'] + 0.5)
    # day seven: the music stops; drone and tension creep in; heartbeat slows (you're fading)
    S.drone([(0, 0), (B['day7'] - 0.2, 0), (B['day7'] + 0.5, 0.5), (B['marks'], 0.7), (B['mirror'], 0.85), (cut - 0.02, 1.0), (cut, 0), (DUR, 0)])
    S.tension([(0, 0), (B['marks'], 0), (B['marks'] + 0.4, 0.5), (B['shows'], 0.6), (B['floatrose'] + 0.4, 1.0), (cut - 0.05, 1.0), (cut, 0), (DUR, 0)])
    S.heartbeat_run(B['day7'] + 0.3, cut, period=0.8, shrink=1.06, fastest=0.8, gain=0.6)
    S.sfx_at(boom(2.6, 40), B['floatrose'] + 0.3, 0.7); S.sfx_at(sting(), B['floatrose'] + 0.3)
    S.silence(cut, cut + 0.98)
    S.sfx_at(boom(2.5, 40), cut + 1.0, 0.8)
    S.sfx_at(chime(1320, 0.8, 0.04), cut + 2.55)
