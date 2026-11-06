"""The Shroud Eater: score and effects. Times come from beats.json (global seconds).

Recorded-sounding effects are the code-made earshot kit in assets/sfx (S.sample); drones, tension, heartbeat and the
whisper's room are the house synths in sound_lib.
"""
import json, os
import numpy as np
from sound_lib import whoosh, click, boom, breath, creak, sting, chime, heartbeat

_HERE = os.path.dirname(os.path.abspath(__file__))
_BJ = json.load(open(os.path.join(_HERE, 'beats.json')))
B = _BJ['B']
DUR = _BJ['durationSec']

FAMILY_OUT = [B['dies'] + 0.1, B['dies'] + 0.65, B['oneByOne'] + 0.0, B['oneByOne'] + 0.5, B['oneByOne'] + 1.0]
MANTEL_CUT = B['aunt'] + 0.55
MUM_AT = [B['uncle'] + 0.15, B['uncle'] + 1.05, B['aunt'] + 0.1]
LAST_AT = B['texted'] + 0.25


def cues(S):
    # ---------------------------------------------------------------- memory: candlelight, Gran's music box
    S.sample('music_box', 0.1, 0.55, dur=B['chair'] - 0.35, fade_out=0.6, buf='music')
    S.room_tone(0, B['chair'], gain=0.04)
    S.sample('mouth_plop', 2.55, 0.35)                                   # the stone settles in his mouth
    S.sfx_at(creak(1.6, 0.1), B['door'] + 0.15, 0.8)                      # the door I hid behind
    S.sfx_at(breath(), B['gran'] + 0.1, 0.7)                              # Gran's hush
    for k, p in enumerate([0.0, 0.42, 0.8, 1.15, 1.45]):                  # threads drawn out of the weave
        S.sample('cloth_tear_short', B['byThread'] + p - 0.1, 0.22, dur=0.45)
        S.sfx_at(chime(2400 + k * 140), B['byThread'] + p + 0.15)
    for t in FAMILY_OUT:                                                  # the family, one candle at a time
        S.sample('candle_snuff', t - 0.06, 0.6)
    S.sfx_at(boom(2.6, 40), FAMILY_OUT[-1] + 0.2, 0.55)

    # ---------------------------------------------------------------- present: cold drone, rain, the funeral
    S.drone([(0, 0), (B['chair'] - 0.2, 0), (B['chair'], 0.35), (B['phone'], 0.45), (B['chew'], 0.6), (B['torch'], 0.8),
             (B['satin'], 0.95), (B['twistEnd'], 1.0), (B['last'], 0.7), (B['whisper'], 0.0), (DUR, 0)])
    S.tension([(0, 0), (B['chew'], 0), (B['thread'], 0.5), (B['torchOn'] - 0.05, 1.0), (B['torchOn'], 0),
               (B['twist'] - 0.1, 0), (B['twist'] + 0.2, 0.6), (B['texted'], 0.2), (B['whisper'], 0)])
    S.sample('rain_window', B['chair'] - 0.2, 0.45, dur=B['umbrellas'] - B['chair'] + 0.4, fade_in=0.4, buf='amb')
    S.sample('rain_umbrella', B['umbrellas'] - 0.2, 0.7, dur=B['phone'] - B['umbrellas'] + 0.1, fade_in=0.3, fade_out=0.4, buf='amb')
    S.sample('bell_small', B['umbrellas'] + 0.25, 0.5, rate=0.42)        # a far funeral bell, slowed to a toll
    S.sample('bell_small', B['umbrellas'] + 2.6, 0.38, rate=0.42)
    S.sample('swipe_velvet', B['mum'] + 0.25, 0.4)                        # the lily falls
    S.sample('knock_wood', B['mum'] + 0.9, 0.35, rate=0.7)                # and lands on the lid
    for t, n in [(B['nostone'] + 0.05, 'soil_on_lid'), (B['nostone'] + 0.75, 'soil_on_lid_2'), (B['nostone'] + 1.4, 'soil_on_lid_3')]:
        S.sample(n, t, 0.9)
    S.sample('sub_drop', B['nostone'] + 0.55, 0.5)                        # "stone."

    # ---------------------------------------------------------------- Mum's texts, the dark, the chewing
    for t in MUM_AT:
        S.sample('phone_buzz', t - 0.05, 0.55)
    S.sample('candle_snuff_2', MANTEL_CUT + 0.1, 0.5)
    S.heartbeat_run(B['tired'] + 0.3, B['chew'], period=1.15, shrink=0.98, fastest=1.0, gain=0.45)
    S.sfx_at(breath(0.9, 0.1), B['jaw'] + 0.1, 0.8)
    S.sample('chewing_muffled', B['chew'] + 0.05, 0.75, dur=B['grave'] - B['chew'] + 0.2)
    S.sample('rain_window', B['grave'] - 0.1, 0.4, offset=3.0, dur=B['thread'] - B['grave'] + 0.1, fade_in=0.3, buf='amb')
    S.sample('chewing_muffled', B['grave'] + 0.4, 0.35, offset=1.0, dur=B['thread'] - B['grave'] - 0.4)
    S.sample('chewing_close', B['thread'] - 0.05, 0.6, dur=1.3)
    S.sample('cloth_tear_slow', B['thread'] + 0.2, 0.3, dur=1.9)          # the thread drawn out of my mouth
    S.sample('riser_tension', B['torchOn'] - 2.8, 0.5)

    # ---------------------------------------------------------------- the torch: white satin
    S.sample('switch_flip', B['torchOn'] - 0.04, 0.9)
    S.sample('impact_rumble', B['torchOn'], 0.75)
    S.sample('swell_dark', B['six'] - 0.75, 0.45)
    S.sample('whoosh_deep', B['six'] + 0.05, 0.4)                         # tilt down the body
    S.heartbeat_run(B['satin'] + 0.4, B['twist'] + 0.1, period=0.62, shrink=0.97, fastest=0.5, gain=0.7)
    S.sample('impact_deep', B['twist'] + 0.6, 0.85)                        # "funeral."
    S.sfx_at(sting(), B['twist'] + 0.6, 1.0)
    S.sample('phone_buzz_muffled', LAST_AT - 0.05, 0.7)
    S.wind([(0, 0), (B['last'], 0), (B['last'] + 0.5, 0.35), (B['whisper'] - 0.2, 0.5), (B['whisper'], 0), (DUR, 0)])

    # ---------------------------------------------------------------- the torch dies; the whisper; a last tear
    for dt, g in [(0.12, 0.5), (0.2, 0.4), (0.3, 0.45), (0.38, 0.5)]:
        S.sfx_at(click(g, 1600), B['whisper'] + dt, 0.6)
    S.sample('cloth_tear_short', B['whisperEnd'] + 0.1, 0.3, dur=0.5)
    S.sample('chewing_close', B['whisperEnd'] + 0.25, 0.25, offset=2.0, dur=0.6)
    S.sfx_at(boom(2.5, 40), B['title'] + 1.0, 0.8)                         # title
