"""The Keyhole: score and effects. Times come from beats.json (global seconds).

Code-made earshot kit (assets/sfx via S.sample) over the house synths: breathing through the keyhole, Gran's music box,
the clock, heartbeats, wool pushed in and drawn out, bed springs, the draught through the open keyhole.
"""
import json, os
import numpy as np
from sound_lib import breath, boom, click, creak, sting, bp, SR

_HERE = os.path.dirname(os.path.abspath(__file__))
_BJ = json.load(open(os.path.join(_HERE, 'beats.json')))
B = _BJ['B']
DUR = _BJ['durationSec']


def keyhole_breath(dur=1.1, gain=0.16, lo=300, hi=1800):
    """A slow breath through a small opening: band-passed air with a soft whistle of the hole."""
    n = int(dur * SR); t = np.arange(n) / SR
    air = bp(np.random.default_rng(int(dur * 1000)).standard_normal(n), lo, hi)
    env = np.sin(np.linspace(0, np.pi, n)) ** 1.6
    whistle = np.sin(2 * np.pi * 1650 * t * (1 + 0.01 * np.sin(2 * np.pi * 3 * t))) * 0.06
    return (air + whistle) * env * gain


def cues(S):
    # ---------------------------------------------------------------- hook: something breathes through the keyhole
    t = 0.05
    while t < B['gran'] - 0.4:                                      # in, out, in ... in time with the wool
        S.sfx_at(keyhole_breath(1.0, 0.2), t, 0.9); t += 1.62
    S.drone([(0, 0.25), (B['gran'], 0.3), (B['gran'] + 0.3, 0.0), (B['weight'], 0.0), (B['weight'] + 0.3, 0.45),
             (B['block'], 0.45), (B['block'] + 0.2, 0.0), (B['sixYears'], 0.0), (B['sixYears'] + 0.3, 0.5),
             (B['stopped'], 0.55), (B['stopped'] + 0.3, 0.0), (B['asked'], 0.0), (B['asked'] + 0.4, 0.4),
             (B['three'], 0.5), (B['climb'], 0.75), (B['empty'], 0.8), (B['empty'] + 0.15, 0.2), (B['warm'], 0.6),
             (B['married'], 1.0), (B['whisper'] - 0.1, 0.8), (B['whisper'], 0), (DUR, 0)])
    S.tension([(0, 0), (B['weight'] + 1.0, 0), (B['block'] - 0.2, 0.6), (B['block'], 0), (B['cantMove'], 0),
               (B['reach'], 0.7), (B['empty'], 0.9), (B['empty'] + 0.1, 0), (B['warm'] + 0.3, 0.3), (B['married'] - 0.05, 1.0),
               (B['married'], 0), (B['hair'], 0.4), (B['whisper'], 0)])
    S.wind([(0, 0.15), (B['gran'], 0.15), (B['gran'] + 0.1, 0), (B['warm'], 0), (B['warm'] + 0.4, 0.9), (B['married'], 1.2),
            (B['hair'], 0.5), (B['whisper'], 0), (DUR, 0)])

    # ---------------------------------------------------------------- Gran, the mare, the wool
    S.sample('music_box', B['gran'] - 0.1, 0.5, dur=B['sixYears'] - B['gran'] + 0.2, fade_in=0.2, fade_out=0.5, buf='music')
    S.heartbeat_run(B['weight'] + 0.3, B['block'], period=0.95, shrink=0.95, fastest=0.6, gain=0.55)
    for k in range(3):
        S.sfx_at(breath(0.8, 0.12), B['weight'] + 0.6 + k * 1.1, 0.6)
    S.sample('swipe_cloth', B['block'] + 0.45, 0.45)                 # Gran pushes the wool in
    S.sample('click_thock', B['cantLeave'] + 0.15, 0.35, rate=0.7)
    S.ticks(B['sixYears'], B['stuffed'], gain=0.5)                    # three a.m., six years ago
    S.heartbeat_run(B['sixYears'] + 0.2, B['stopped'], period=0.8, shrink=0.97, fastest=0.55, gain=0.5)
    S.sample('swipe_cloth', B['stuffed'] + 0.55, 0.5, rate=0.85)     # I stuff it shut
    S.sfx_at(breath(0.6, 0.14), B['stuffed'] + 1.6, 0.7)
    S.sample('click_thock', B['stopped'] - 0.4, 0.35, rate=0.7)

    # ---------------------------------------------------------------- it stopped; my wife
    S.sample('music_box_wrong', B['stopped'] + 0.05, 0.42, dur=B['asked'] - B['stopped'], fade_in=0.4, fade_out=0.5, buf='music')
    S.sample('swipe_velvet', B['wife'] - 0.4, 0.3, rate=0.8)          # her hair falls across my hand
    S.sample('bell_small', B['wife'] + 0.38, 0.22, rate=2.0, dur=0.6)  # the ring catches the light
    S.sample('swipe_cloth', B['pulled'] + 0.35, 0.4, rate=0.9)        # I pull the wool out ...
    S.sample('cloth_tear_short', B['pulled'] + 0.45, 0.18, dur=0.5)   # ... fibres dragging
    S.sample('whoosh_windy', B['quiet'] - 0.1, 0.25)                  # a breath of cold air through the hole
    S.sample('sink', B['quiet'] + 0.3, 0.35)

    # ---------------------------------------------------------------- three a.m.
    S.ticks(B['three'], B['cantMove'] + 0.2, gain=0.5)
    S.heartbeat_run(B['cantMove'], B['empty'], period=0.9, shrink=0.94, fastest=0.45, gain=0.7)
    for dt in (0.3, 1.1):                                             # knees on the bed
        S.sfx_at(creak(0.6, 0.1), B['climb'] + dt, 0.7)
        S.sample('swipe_cloth', B['climb'] + dt, 0.35, rate=0.75)
        S.sample('hit_rumble', B['climb'] + dt, 0.25)
    S.sfx_at(keyhole_breath(1.4, 0.18, 400, 2600), B['climb'] + 1.6, 0.8)  # breath, close
    S.sample('sink', B['empty'] + 0.05, 0.5)
    S.silence(B['empty'] + 0.05, B['empty'] + 0.35)
    S.sample('whoosh_windy', B['warm'] - 0.05, 0.6)                   # the open keyhole: cold pours in
    S.sample('riser_tension', B['married'] - 2.8, 0.45)
    S.sample('impact_deep', B['married'] + 0.05, 0.85)                # "married"
    S.sfx_at(sting(), B['married'] + 0.05, 1.0)
    S.sample('bell_small', B['married'] + 0.55, 0.2, rate=1.6, dur=0.8)  # the ring on the table
    S.sample('swipe_velvet', B['hair'] + 0.15, 0.45, rate=0.55)       # her hair over my face
    S.sfx_at(keyhole_breath(1.2, 0.2, 500, 3000), B['hair'] + 1.1, 0.8)

    # ---------------------------------------------------------------- black: only the whisper; title
    S.silence(B['whisper'] - 0.05, B['whisperEnd'] + 0.3)
    S.sfx_at(boom(2.5, 40), B['title'] + 1.0, 0.8)
