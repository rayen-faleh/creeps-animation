"""Rabenfels Part II (revised): score and effects on the shared picture clock (events.json), in the house sound.
Cold square and street; Otto's warm counter with a music box, twice; a heartbeat when the fangs come; chain and
shutter at the locked shop; water at the basin; then the tavern: the mirror sting, a thinned bed under the
stranger's demand, and a quickening heartbeat into the reach. Silence at the cut; the title boom."""
import json, os
import numpy as np
from sound_lib import SR, boom, breath, chime, click, creak, whoosh, sting, scratch, knock, lp, bp, _rng

E = json.load(open(os.path.join(os.path.dirname(os.path.abspath(__file__)), 'events.json')))
DUR = E['duration']

def rattle(n=6, gain=0.5):
    """A padlock chain yanked against the door."""
    out = np.zeros(int(0.15 * n * SR) + SR // 2)
    for i in range(n):
        c = click(gain * (1 - i * 0.1), 1700 + (i % 3) * 400); o = int(i * 0.13 * SR)
        out[o:o + len(c)] += c[:len(out) - o]
    return out

def slosh(dur=0.8, gain=0.18):
    """Wet cloth worked in a basin."""
    n = int(dur * SR); t = np.arange(n) / SR
    return bp(_rng.standard_normal(n), 300, 2200) * np.sin(np.pi * t / dur) ** 2 * (0.6 + 0.4 * np.sin(2 * np.pi * 5 * t)) * gain

def steps(t0, count, gap, S, gain=0.35):
    for i in range(count): S.sfx_at(lp(knock(1.0), 400), t0 + i * gap, gain)

def cues(S):
    cut = E['cut']
    S.drone([(0, 0.45), (E['memory'] - 0.05, 0.5), (E['memory'], 0), (E['recruit'], 0), (E['recruit'] + 0.4, 0.4),
             (E['cover'], 0.6), (E['evidence'], 0.45), (E['door'], 0.5), (E['coat'], 0.25), (E['customer'], 0),
             (E['stairs'], 0), (E['stairs'] + 0.3, 0.6), (E['mirror'] + 0.9, 0.85), (E['target'], 0.4), (E['demand'], 0.2),
             (E['turn'], 0.5), (E['reach'], 0.75), (cut - 0.02, 1.0), (cut, 0), (DUR, 0)])
    S.wind([(0, 0.3), (E['memory'], 0.3), (E['memory'] + 0.01, 0), (E['recruit'], 0), (E['recruit'] + 0.3, 0.3),
            (E['coat'], 0.3), (E['coat'] + 0.01, 0), (DUR, 0)])
    S.tension([(0, 0), (E['light'], 0), (E['cover'], 0.7), (E['turnaway'] + 0.3, 0), (E['stairs'], 0), (E['mirror'] - 0.05, 0.8),
               (E['mirror'], 0), (E['reach'], 0.4), (cut - 0.05, 1.0), (cut, 0), (DUR, 0)])
    # the square: the decision, the collar, the scent
    S.sfx_at(boom(2.6, 40), 0.05, 0.55)
    S.sfx_at(scratch(0.22, 0.12), E['scent'] + 0.75)
    S.sfx_at(breath(0.9, 0.1), E['familiar'] - 0.3)
    S.sfx_at(boom(2.2, 46), E['cloves'] + 0.02, 0.6); S.sfx_at(chime(2600, 0.6, 0.05), E['cloves'] + 0.05)
    # memory: Otto's counter, warm
    S.room_tone(E['memory'], E['recruit'])
    S.music_box(E['memory'] + 0.1, [(0, 12), (0.45, 15), (0.9, 19), (1.35, 17), (1.8, 15), (2.7, 12), (3.15, 10)],
                bass=[(0, -9), (2.7, -14)], stop=E['recruit'], gain=0.14)
    S.sfx_at(click(0.8, 1100), E['memory'] + 1.15, 0.5)               # the covered cup set down
    for i in range(4): S.sfx_at(chime(3000 + i * 180, 0.25, 0.02), E['memory'] + 1.6 + i * 0.12)   # cloves on the lid
    # Safwan, the lantern, the fangs
    S.sfx_at(creak(0.6, 0.06), E['recruit'] + 0.4)                     # lantern handle
    S.sfx_at(whoosh(0.5, 300, 2400, 0.3), E['light'] + 0.1, 0.4)
    S.heartbeat_run(E['cover'] - 0.2, E['turnaway'] + 0.6, period=0.8, shrink=0.88, fastest=0.5, gain=0.7)
    S.sfx_at(boom(2.0, 50), E['cover'] + 0.05, 0.55); S.sfx_at(sting(), E['cover'] + 0.05)
    S.sfx_at(whoosh(0.4, 200, 3000, 0.6), E['turnaway'], 0.6)           # you turn away
    # the wool, the fight
    S.sfx_at(scratch(0.3, 0.1), E['evidence'] + 1.1)
    S.sfx_at(boom(1.8, 52), E['fought'] + 0.05, 0.45)
    # Otto's shop: the chain, the dark window, the shutter
    S.sfx_at(rattle(7, 0.55), E['door'] + 0.6)
    S.sfx_at(creak(1.2, 0.08), E['nootto'] + 0.05)
    steps(E['street'] + 0.2, 4, 0.55, S)
    # the Broken Bell: water, cloves on the water
    S.room_tone(E['coat'], E['customer'])
    for dt in (0.1, 0.9, 1.7): S.sfx_at(slosh(0.8, 0.2), E['coat'] + dt)
    for i in range(5): S.sfx_at(chime(2800 - i * 160, 0.35, 0.025), E['torn'] + 0.6 + i * 0.22)
    S.sfx_at(breath(0.7, 0.07), E['glance'] + 0.2)
    # memory: two cups
    S.room_tone(E['customer'], E['stairs'])
    S.music_box(E['customer'] + 0.05, [(0, 12), (0.45, 15), (0.9, 19), (1.35, 18)], bass=[(0, -10)], stop=E['stairs'], gain=0.14)
    S.sfx_at(boom(2.2, 44), E['customer'] + 1.0, 0.5)
    # the stairs, the mirror, the demand
    S.room_tone(E['stairs'], cut)
    for dt in (0.6, 1.5): S.sfx_at(creak(0.5, 0.07), E['stairs'] + dt)
    S.sfx_at(boom(3.0, 36), E['mirror'] + 0.85, 0.9); S.sfx_at(sting(), E['mirror'] + 0.85)
    S.silence(E['mirror'] + 2.0, E['target'] - 0.2)
    S.sfx_at(boom(1.6, 58), E['demand'] - 0.05, 0.35)
    S.sfx_at(creak(0.6, 0.06), E['reach'] + 0.25)
    S.heartbeat_run(E['reach'], cut, period=1.0, shrink=0.92, fastest=0.55, gain=0.7)
    S.silence(cut, E['title'] - 0.02)
    S.sfx_at(boom(2.6, 40), E['title'], 0.8)
