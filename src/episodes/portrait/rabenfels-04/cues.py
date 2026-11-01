"""Rabenfels Part IV: the house sound on the shared clock (events.json). A jolt as Elias leaves the glass; a cold
held note for the glare; keys jangling; boots on the stairs; the bolt and the lock; night wind through the open
window; a sting for Otto; the threshold as a muffled thud against nothing; Part II's music box for the memory;
a whisper of breath; silence and a heartbeat as Lida looks up. Silence at the cut; the title."""
import json, os
import numpy as np
from sound_lib import SR, boom, breath, chime, click, creak, whoosh, sting, knock, scratch, lp, hp, bp, _rng

E = json.load(open(os.path.join(os.path.dirname(os.path.abspath(__file__)), 'events.json')))
DUR = E['duration']

def jangle(dur=0.5, gain=0.2):
    n = int(dur * SR); t = np.arange(n) / SR; out = np.zeros(n)
    for f, d in ((3100, 0), (4300, 0.05), (2600, 0.11), (3700, 0.18)):
        i = int(d * SR); tt = t[:n - i]
        out[i:] += np.sin(2 * np.pi * f * tt) * np.exp(-tt * 18)
    return out * gain

def thud(gain=0.8):
    """A boot stopped dead against nothing: a soft low knock with the top cut off."""
    return lp(knock(1.0), 300) * gain

def cues(S):
    cut = E['cut']
    S.room_tone(0, cut)
    S.drone([(0, 0.6), (E['look'], 0.75), (E['closes'] + 0.6, 0.4), (E['climb'], 0.45), (E['swings'], 0.6), (E['gone'], 0.35),
             (E['otto'], 0.7), (E['cant'], 0.5), (E['foot'], 0.8), (E['only'], 0.0), (E['pulls'], 0.5), (E['looksup'], 0.8),
             (E['question'], 0.9), (cut - 0.02, 1.0), (cut, 0), (DUR, 0)])
    S.tension([(0, 0), (E['look'], 0.5), (E['closes'] + 0.5, 0), (E['floor'], 0), (E['otto'] - 0.05, 0.8), (E['otto'], 0),
               (E['foot'], 0.6), (E['eyes'], 0.3), (E['only'], 0), (E['pulls'], 0.3), (cut - 0.05, 1.0), (cut, 0), (DUR, 0)])
    S.sfx_at(whoosh(0.35, 300, 3000, 0.6), 0.15, 0.6); S.sfx_at(boom(2.2, 44), 0.2, 0.5)       # out of the glass
    S.sfx_at(boom(2.6, 40), E['look'] + 0.1, 0.5)                                              # the glare
    S.sfx_at(click(0.4, 1400), E['upstairs'] + 0.2, 0.3)                                       # Grete's lantern
    for i in range(4): S.sfx_at(jangle(0.4, 0.18), E['lida'] + 0.3 + i * 0.5)                 # Lida's keys as she runs
    for i in range(8): S.sfx_at(lp(knock(0.7), 500), E['climb'] + 0.3 + i * 0.6, 0.35)        # boots on the stairs
    for i in range(3): S.sfx_at(creak(0.4, 0.05), E['climb'] + 0.8 + i * 1.4)
    S.sfx_at(click(0.9, 900), E['bolt'] + 0.05, 0.6)
    S.sfx_at(jangle(0.3, 0.15), E['key'] - 0.1); S.sfx_at(click(0.8, 1600), E['key'] + 0.35, 0.6)
    S.sfx_at(creak(1.4, 0.09), E['swings'] + 0.1)
    S.wind([(0, 0), (E['gone'] - 0.2, 0), (E['gone'], 0.6), (E['otto'], 0.35), (E['only'], 0.3), (E['only'] + 0.01, 0), (E['pulls'], 0), (E['pulls'] + 0.1, 0.25), (cut, 0.2), (cut + 0.01, 0), (DUR, 0)])
    S.sfx_at(boom(3.0, 36), E['otto'] + 0.05, 0.9); S.sfx_at(sting(), E['otto'] + 0.05)
    S.sfx_at(breath(0.9, 0.08), E['barely'] + 0.2)                                              # Otto's breath
    S.sfx_at(thud(0.9), E['foot'] + 0.35); S.sfx_at(boom(1.6, 56), E['foot'] + 0.35, 0.4)
    S.sfx_at(chime(1800, 1.2, 0.03), E['foot'] + 0.4)                                           # the glass that isn't there
    S.sfx_at(boom(2.2, 46), E['sees'] + 0.1, 0.5)
    S.music_box(E['only'] + 0.05, [(0, 12), (1.1, 15), (2.1, 19), (3.1, 17)], stop=E['pulls'], gain=0.13)
    S.sfx_at(breath(1.2, 0.06), E['pulls'] + 1.0)                                               # the whisper, no words
    S.silence(E['looksup'] - 0.1, E['atyou'] - 0.05)
    S.sfx_at(boom(3.0, 36), E['atyou'], 0.8)
    S.heartbeat_run(E['atyou'] + 0.3, cut, period=0.95, shrink=0.92, fastest=0.55, gain=0.6)
    S.silence(cut, E['title'] - 0.02)
    S.sfx_at(boom(2.6, 40), E['title'], 0.8)
