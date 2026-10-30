"""Graveyard Shift Part 2: a ticking countdown to sunrise under the whole call. A phone ring and the click of
connection; a drone that rises as the sun crawls in; sizzle where light touches skin; a van and its headlights;
Dave's fists on the glass; his heartbeat swelling in the dark; R.'s offer over a thinned bed; then silence, and
the voice behind you. Times come from beats.json."""
import json, os
import numpy as np
from sound_lib import SR, boom, breath, chime, click, creak, whoosh, sting, knock, lp, hp, bp, _rng

_B = json.load(open(os.path.join(os.path.dirname(os.path.abspath(__file__)), 'beats.json')))
B = _B['B']
DUR = _B['durationSec']

def ring(dur=0.9, gain=0.18):
    n = int(dur * SR); t = np.arange(n) / SR
    tone = (np.sin(2 * np.pi * 440 * t) + np.sin(2 * np.pi * 480 * t)) * 0.5
    return tone * (np.sin(2 * np.pi * 20 * t) > 0) * np.minimum(1, np.minimum(t, dur - t) * 30) * gain

def sizzle(dur=0.8, gain=0.12):
    n = int(dur * SR); t = np.arange(n) / SR
    crackle = (_rng.random(n) < 0.02) * _rng.standard_normal(n) * 2
    return hp(_rng.standard_normal(n) * 0.4 + crackle, 3000) * np.sin(np.pi * t / dur) * gain

def engine(dur=3.0, gain=0.2):
    n = int(dur * SR); t = np.arange(n) / SR
    rumble = lp(_rng.standard_normal(n), 140) * (0.7 + 0.3 * np.sin(2 * np.pi * 7 * t))
    return rumble * np.minimum(1, t / 0.8) * np.minimum(1, (dur - t) / 0.6) * gain * 6

def bang(gain=0.8):
    a, b = lp(knock(1.0), 900) * gain, boom(0.4, 70) * gain * 0.4
    out = np.zeros(max(len(a), len(b))); out[:len(a)] += a; out[:len(b)] += b
    return out

def cues(S):
    cut = B['cut']
    # the countdown: a clock tick under everything, getting closer to the front of the mix
    S.ticks(0.0, B['heart'], every=1.0, gain=0.22)
    S.ticks(B['heart'], cut, every=0.5, gain=0.3)
    S.drone([(0, 0.25), (B['recap'], 0.3), (B['crawl'], 0.5), (B['van'], 0.6), (B['bang'], 0.55), (B['heart'], 0.7),
             (B['offer'], 0.4), (B['invite'], 0.25), (B['twice'], 0.6), (B['behind'] - 0.05, 0.9), (B['behind'], 0.2),
             (cut - 0.02, 1.0), (cut, 0), (DUR, 0)])
    S.tension([(0, 0), (B['crawl'], 0), (B['aisle'], 0.5), (B['van'], 0.2), (B['heart'], 0.6), (B['offer'], 0.2),
               (B['twice'], 0.5), (B['behind'] - 0.05, 1.0), (B['behind'], 0), (B['expire'], 0.5), (cut - 0.05, 1.0), (cut, 0), (DUR, 0)])
    S.wind([(0, 0.12), (B['heart'], 0.12), (B['heart'] + 0.01, 0), (DUR, 0)])
    # the call
    S.sfx_at(ring(0.9, 0.2), 0.15)
    S.sfx_at(click(0.8, 2200), B['ring'] - 0.05, 0.6)            # he picks up
    S.sfx_at(boom(2.2, 44), B['ring'], 0.5)
    S.sfx_at(chime(1600, 0.7, 0.04), B['coins'] + 0.1)            # the old coins
    S.sfx_at(sizzle(1.2, 0.12), B['smoking'] - 0.1)
    S.sfx_at(boom(1.4, 60), B['badge'] + 0.05, 0.2)               # the laugh beat
    # the sun crawls in
    S.sfx_at(whoosh(2.5, 100, 900, 0.3), B['crawl'], 0.3)
    S.sfx_at(sizzle(0.9, 0.18), B['aisle'] + 0.1)
    S.sfx_at(breath(0.5, 0.12), B['aisle'] + 0.15)
    # Dave
    S.sfx_at(engine(3.2, 0.25), B['van'])
    S.sfx_at(click(0.6, 900), B['dave'] + 0.6, 0.5)              # the van door
    for d in (0.15, 0.55, 0.95, 1.6, 2.0): S.sfx_at(bang(0.8), B['bang'] + d)
    # his heartbeat, from the stockroom
    S.heartbeat_run(B['hear'], B['offer'] + 1.5, period=0.8, shrink=0.97, fastest=0.7, gain=0.85)
    # the offer, R.'s voice; then silence before the voice behind you
    S.sfx_at(boom(2.5, 40), B['price'] + 0.1, 0.6)
    S.silence(B['inviteEnd'] + 0.5, B['twice'] - 0.05)
    S.sfx_at(creak(0.8, 0.07), B['behind'] - 0.3)
    S.sfx_at(boom(3.0, 36), B['behind'] + 0.1, 0.9); S.sfx_at(sting(), B['behind'] + 0.1)
    S.sfx_at(chime(2400, 0.4, 0.03), B['expire'] + 0.6)            # the badge glint
    S.sfx_at(boom(2.0, 46), B['doesnt'], 0.5)
    S.silence(cut, cut + 1.0)
    S.sfx_at(boom(2.5, 40), cut + 1.0, 0.8)
    S.sfx_at(chime(1320, 0.8, 0.04), cut + 2.25); S.sfx_at(chime(1480, 0.8, 0.04), cut + 2.75)
