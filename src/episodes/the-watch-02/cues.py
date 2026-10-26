"""The Watch, Part II: score and effects cues. Times come from beats.json (beats.py), the same clock as the scenes."""
import json, os
import numpy as np
from sound_lib import SR, boom, breath, chime, click, creak, knock, lp, bp, scratch, sting, whoosh, _rng

_B = json.load(open(os.path.join(os.path.dirname(os.path.abspath(__file__)), 'beats.json')))
B = _B['B']
DUR = _B['durationSec']

def footstep(gain=0.5):
    """Boot on wet cobbles: a low thud with a gritty scrape."""
    n = int(0.18 * SR); t = np.arange(n) / SR
    thud = np.sin(2 * np.pi * 70 * t) * np.exp(-t * 40)
    grit = bp(_rng.standard_normal(n), 1500, 5000) * np.exp(-t * 30) * 0.25
    return lp(thud, 400) * gain + grit * gain

def buzz(dur=0.42, gain=0.18):
    n = int(dur * SR); t = np.arange(n) / SR
    x = np.sign(np.sin(2 * np.pi * 160 * t)) * (0.5 + 0.5 * np.sign(np.sin(2 * np.pi * 9 * t)))
    return lp(x, 900) * gain

def page(gain=0.35):
    return whoosh(0.35, 1800, 7000, gain) + np.concatenate([np.zeros(int(0.25 * SR)), click(0.5, 3000)])[: int(0.35 * SR)] * gain

def cues(S):
    cut = B['cut']
    S.drone([(0, 0.25), (B['street'], 0.35), (B['door'], 0.45), (B['memory'], 0.2), (B['page'], 0.45), (B['oneHand'], 0.6), (B['danny'], 0.9),
             (B['told'], 0.55), (B['out'], 0.9), (B['turn'], 0.8), (cut - 0.02, 1.0), (cut, 0), (DUR, 0)])
    S.wind([(0, 0.15), (B['street'], 0.6), (B['door'], 0.6), (B['door'] + 1.2, 0.2), (B['turn'], 0.25), (cut - 0.2, 0.9), (cut, 0), (DUR, 0)])
    S.tension([(0, 0), (B['oneHand'], 0), (B['danny'] - 0.05, 0.9), (B['danny'], 0), (B['keep'], 0.1), (B['out'] - 0.05, 0.9), (B['out'], 0),
               (B['turn'], 0.3), (cut - 0.05, 1.0), (cut, 0), (DUR, 0)])
    # hook: pages turning, one every 1.4 s
    for k in np.arange(0.8, B['street'] - 0.6, 1.4): S.sfx_at(page(0.4), k)
    S.sfx_at(boom(2.5, 44), 0.05, 0.4)
    # the walk to the lamp
    for k in np.arange(B['street'] + 0.1, B['post'], 0.53): S.sfx_at(footstep(0.55), k)
    S.sfx_at(creak(0.8, 0.05), B['post'] + 0.4)                                      # twine creaks on iron
    for k in range(3): S.sfx_at(chime(3200 + k * 140, 0.3, 0.025), B['key'] + 0.2 + k * 0.33)   # the key turning on its string
    S.sfx_at(click(0.9, 1500), B['key'] + 1.15, 0.7)                                   # grab
    # the back door
    S.sfx_at(click(1.0, 1100), B['door'] + 0.65, 0.8); S.sfx_at(knock(0.6), B['door'] + 1.05, 0.6)   # key in, the lock turns
    S.sfx_at(creak(1.6, 0.1), B['door'] + 1.3)
    S.room_tone(B['shelf'], B['memory'])
    S.room_tone(B['page'], B['text'])
    # memory: Mick's lullaby, two bars
    S.music_box(B['memory'] + 0.05, [(0, 12), (0.5, 15), (1.0, 19), (1.5, 17), (2.0, 15), (2.5, 12)], bass=[(0, -9)], stop=B['page'], gain=0.2)
    S.sfx_at(click(0.8, 2200), B['memory'] + 0.1, 0.4)                                 # torch on the post
    for k in range(10): S.sfx_at(scratch(_rng.uniform(0.08, 0.14), 0.05), B['page'] + 0.3 + k * 0.15)   # pencil
    S.sfx_at(whoosh(0.4, 300, 2000, 0.5), B['y2006'] + 0.5, 0.6)                       # notebook out
    S.sfx_at(page(0.45), B['open2006'] + 0.2)
    S.heartbeat_run(B['oneHand'], B['told'], period=1.0, shrink=0.92, fastest=0.5, gain=0.8)
    S.sfx_at(boom(3.2, 34), B['danny'], 1.0); S.sfx_at(sting(), B['danny'])           # "It was Danny's."
    S.sfx_at(page(0.45), B['last'] + 0.25)
    S.sfx_at(boom(3.0, 36), B['out'], 0.9)                                             # "keeping Danny out."
    # the cliffhanger
    S.sfx_at(buzz(), B['text'], 1.0); S.sfx_at(buzz(), B['text'] + 0.6, 1.0)
    S.sfx_at(click(1.0, 3400) + click(0.6, 2400), B['text'], 0.45); S.sfx_at(click(1.0, 3400) + click(0.6, 2400), B['text'] + 0.55, 0.45)
    S.sfx_at(whoosh(0.4, 300, 4000), B['turn'], 0.7)
    for k in range(5): S.sfx_at(knock(0.35) + click(0.6, 900), B['turn'] + 0.35 + k * 0.1, 0.6)   # the handle rattles
    S.sfx_at(click(1.0, 700), B['turn'] + 0.88, 0.8)                                   # the lock gives
    S.sfx_at(creak(1.2, 0.12), B['turn'] + 0.9)
    S.sfx_at(breath(0.5, 0.15), B['turn'] + 0.95)
    S.sfx_at(boom(2.5, 40), cut + 1.0, 0.8)                                            # title
    S.silence(cut, cut + 0.98)
