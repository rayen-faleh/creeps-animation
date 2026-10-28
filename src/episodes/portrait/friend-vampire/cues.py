"""Friend-vampire signs reel: a light pizzicato-ish music box under the early signs, a dry tick on each new sign,
the score thinning and the drone creeping in as the signs get darker; silence then the whisper."""
import json, os
import numpy as np
from sound_lib import SR, boom, breath, chime, click, creak, knock, lp, hp, bp, sting, whoosh, _rng

_B = json.load(open(os.path.join(os.path.dirname(os.path.abspath(__file__)), 'beats.json')))
B = _B['B']
DUR = _B['durationSec']

def tink(gain=0.1, f=3000):
    n = int(0.3 * SR); t = np.arange(n) / SR
    return (np.sin(2 * np.pi * f * t) + 0.5 * np.sin(2 * np.pi * f * 2.7 * t)) * np.exp(-t * 22) * gain

def pub(dur, gain=0.03):
    """Distant pub murmur: band-limited noise with slow swells."""
    n = int(dur * SR); t = np.arange(n) / SR
    return bp(_rng.standard_normal(n), 300, 2500) * (0.7 + 0.3 * np.sin(2 * np.pi * 0.3 * t)) * gain

def frost(dur=1.6, gain=0.06):
    n = int(dur * SR); t = np.arange(n) / SR
    crack = (_rng.random(n) < 0.003) * _rng.standard_normal(n) * 3
    return hp(crack + _rng.standard_normal(n) * 0.2, 5000) * np.minimum(1, t / dur * 2) * gain

def buzz(dur=0.3, gain=0.25):
    n = int(dur * SR); t = np.arange(n) / SR
    return lp(np.sign(np.sin(2 * np.pi * 170 * t)) * (0.6 + 0.4 * np.sin(2 * np.pi * 9 * t)), 900) * np.minimum(1, np.minimum(t, dur - t) * 40) * gain

def shutter(gain=0.4):
    a, b = click(gain, 3500), click(gain * 0.7, 2500)
    off = int(0.06 * SR); out = np.zeros(max(len(a), off + len(b)))
    out[:len(a)] += a; out[off:off + len(b)] += b
    return out

def cues(S):
    cut = B['cut']
    tune = [12, 15, 19, 15, 17, 14, 12, 10, 12, 15, 17, 19]
    notes = [(i * 0.45, v) for i, v in enumerate(tune * 6) if i * 0.45 < B['s5'] - 0.4]
    S.music_box(0.2, notes, bass=[(k, -9) for k in np.arange(0, B['s5'] - 1, 1.8)], stop=B['s5'], gain=0.12)
    S.sfx_at(pub(B['s2'] + 0.2, 0.03), 0.0); S.sfx_at(pub(B['s4'] - B['s3'] + 0.2, 0.03), B['s3'])
    for i in range(1, 8): S.sfx_at(tink(0.07, 2200 + i * 120), B[f's{i}'] + 0.05)        # a tick on every new sign
    S.sfx_at(shutter(0.4), 2.2)
    S.sfx_at(creak(0.7, 0.05), B['s2'] + 0.1)
    S.sfx_at(whoosh(0.3, 400, 3000, 0.3), B['loo'] - 0.1)
    for k in np.arange(B['s4b'], B['twice'], 0.2): S.sfx_at(tink(0.03, 3600), k)
    for k in np.arange(B['twice'], B['s5'] - 0.2, 0.1): S.sfx_at(tink(0.025, 3900), k)
    S.sfx_at(frost(2.4, 0.06), B['s5b'])
    S.drone([(0, 0), (B['s4'], 0), (B['s5'], 0.35), (B['s6'], 0.6), (B['s7'], 0.8), (cut - 0.02, 1.0), (cut, 0), (DUR, 0)])
    S.wind([(0, 0), (B['s6'] - 0.1, 0), (B['s6'] + 0.2, 0.5), (B['s7'], 0.2), (cut, 0.3), (cut + 0.01, 0), (DUR, 0)])
    S.tension([(0, 0), (B['s6'], 0), (B['once'] - 0.05, 0.8), (B['once'], 0), (B['s7'], 0.2), (B['s7b'] + 1.6, 1.0), (cut - 0.05, 1.0), (cut, 0), (DUR, 0)])
    S.sfx_at(boom(2.2, 44), B['once'] + 0.05, 0.5)
    S.sfx_at(buzz(0.3, 0.3), B['s7'] + 0.5)
    S.sfx_at(boom(2.6, 40), B['s7b'] + 1.0, 0.6); S.sfx_at(sting(), B['s7b'] + 1.0)
    S.heartbeat_run(B['s7'], cut, period=0.8, shrink=0.9, fastest=0.5, gain=0.7)
    S.silence(cut, cut + 0.98)
    S.sfx_at(boom(2.5, 40), cut + 1.0, 0.8)
    S.sfx_at(chime(1320, 0.8, 0.04), cut + 2.55)
