"""Rabenfels Part III: the house sound on the shared clock (events.json). A held breath at the mirror; a low boom on
"That was the problem"; silence for the empty stairs; the stranger over a thinned bed; the whistle shrieking through
the room; the key's three bounces; the door slam and bolt; a heartbeat from the grab; the sting on the empty grip;
the street door crashing in; then a held, rising tone as Safwan turns to the glass. Silence at the cut; the title."""
import json, os
import numpy as np
from sound_lib import SR, boom, breath, chime, click, creak, whoosh, sting, knock, scratch, lp, hp, bp, _rng

E = json.load(open(os.path.join(os.path.dirname(os.path.abspath(__file__)), 'events.json')))
DUR = E['duration']

def whistle(dur=1.4, gain=0.22):
    """A pea whistle: a shrill tone with a fast warble."""
    n = int(dur * SR); t = np.arange(n) / SR
    f = 2900 + 260 * np.sign(np.sin(2 * np.pi * 28 * t))
    ph = np.cumsum(2 * np.pi * f / SR)
    return np.sin(ph) * np.minimum(1, t / 0.03) * np.minimum(1, (dur - t) / 0.25) * gain

def slam(gain=0.9):
    a = lp(knock(1.0), 600) * gain; b = boom(0.9, 55) * gain * 0.6
    out = np.zeros(max(len(a), len(b))); out[:len(a)] += a; out[:len(b)] += b
    return out

def jingle(gain=0.25):
    n = int(0.35 * SR); t = np.arange(n) / SR
    return (np.sin(2 * np.pi * 3100 * t) + 0.6 * np.sin(2 * np.pi * 4700 * t)) * np.exp(-t * 14) * gain

def cues(S):
    cut = E['cut']
    S.room_tone(0, cut)
    S.drone([(0, 0.55), (E['problem'], 0.7), (E['looks'], 0.5), (E['nostranger'] - 0.05, 0.7), (E['nostranger'], 0.1),
             (E['whistle'], 0.4), (E['clever'], 0.25), (E['screams'], 0.6), (E['slam'], 0.5), (E['grab'], 0.6),
             (E['nothing'], 0.9), (E['burst'], 0.5), (E['mouth'], 0.6), (E['question'], 0.9), (cut - 0.02, 1.0), (cut, 0), (DUR, 0)])
    S.tension([(0, 0), (E['looks'], 0.3), (E['nostranger'], 0), (E['grab'], 0.3), (E['nothing'] - 0.05, 1.0), (E['nothing'], 0),
               (E['looksmirror'], 0.3), (cut - 0.05, 1.0), (cut, 0), (DUR, 0)])
    S.wind([(0, 0), (E['burst'], 0), (E['burst'] + 0.4, 0.6), (E['asks'], 0.25), (cut, 0.15), (cut + 0.01, 0), (DUR, 0)])
    S.sfx_at(breath(0.9, 0.09), 0.3)
    S.sfx_at(boom(2.6, 40), E['problem'] + 0.05, 0.7)
    S.sfx_at(whoosh(0.4, 300, 2200, 0.4), E['look'] + 0.1, 0.4)
    S.sfx_at(scratch(0.25, 0.1), E['outglass'] + 0.2)                # your boot on the boards, stepping back
    for k in ('stairs', 'railing', 'candle'): S.sfx_at(chime(2200, 0.3, 0.02), E[k] + 0.05)
    S.sfx_at(boom(2.2, 46), E['face'] + 0.1, 0.4)
    S.silence(E['nostranger'] + 0.05, E['whistle'] - 0.1)
    S.sfx_at(boom(3.0, 36), E['nostranger'] + 0.75, 0.8); S.sfx_at(sting(), E['nostranger'] + 0.75)
    S.sfx_at(click(0.5, 2500), E['whistle'] + 1.0, 0.4)             # the whistle's chain
    S.sfx_at(whistle(1.6, 0.24), E['screams'])
    for i in range(3): S.sfx_at(creak(0.5, 0.06), E['backs'] + 0.2 + i * 0.5)   # stairs, climbed backwards
    for i, d in enumerate((0.45, 0.85, 1.15)): S.sfx_at(jingle(0.28 - i * 0.06), E['falls'] + d)   # the key bouncing
    S.sfx_at(chime(3400, 0.5, 0.04), E['key'] + 0.3)
    S.sfx_at(slam(1.0), E['slam'] + 0.3); S.sfx_at(click(0.9, 900), E['slam'] + 1.0, 0.6)          # slam, bolt
    S.heartbeat_run(E['grab'], E['burst'], period=0.85, shrink=0.9, fastest=0.55, gain=0.75)
    S.sfx_at(boom(3.0, 36), E['nothing'] + 0.1, 0.9); S.sfx_at(sting(), E['nothing'] + 0.1)
    S.sfx_at(slam(1.0), E['burst'] + 0.4); S.sfx_at(whoosh(0.8, 150, 2400, 0.6), E['burst'] + 0.35, 0.6)
    for i in range(6): S.sfx_at(lp(knock(0.6), 500), E['burst'] + 0.8 + i * 0.28, 0.35)            # boots on the boards
    S.sfx_at(click(0.5, 1400), E['where'] - 0.3, 0.3)              # Grete's hand on her sword
    S.sfx_at(breath(0.6, 0.1), E['mouth'] + 0.3)
    S.heartbeat_run(E['looksmirror'], cut, period=0.9, shrink=0.9, fastest=0.5, gain=0.6)
    S.silence(cut, E['title'] - 0.02)
    S.sfx_at(boom(2.6, 40), E['title'], 0.8)
