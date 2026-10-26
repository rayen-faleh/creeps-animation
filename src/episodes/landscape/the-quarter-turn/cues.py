"""The Quarter Turn: score and effects. Times come from timing.json line ids (same clock as beats.ts / scenes).
The drip is the motif: a drop every 2 s, landing at DRIP_T0 + 2k, heard only while the tap is dripping in the story."""
import json, os
import numpy as np
from sound_lib import SR, boom, breath, chime, click, creak, knock, lp, bp, hp, reverb, sting, whoosh, _rng

HERE = os.path.dirname(os.path.abspath(__file__))
_T = json.load(open(os.path.join(HERE, 'timing.json')))
_L = {l['id']: l for l in _T['lines']}
at = lambda i: _L[i]['start']
end = lambda i: _L[i]['end']
DUR = float(int(np.ceil(_T['total'] + 9.0)))
LEAD = 2.2
DRIP_T0, PERIOD = 0.9, 2.0
TITLE = end('C0_03') + 0.7
C2 = at('C2_01') - LEAD  # Chapter I ends here (later chapters: cues to come)

def layer(*sigs):
    n = max(len(x) for x in sigs); out = np.zeros(n)
    for x in sigs: out[: len(x)] += x
    return out

def plink(gain=0.5, pitch=1.0):
    """A drop into a half-full sink: a quick falling sine 'plip' plus a small wet click, then a short ring."""
    n = int(0.5 * SR); t = np.arange(n) / SR
    f = (1500 + 900 * np.exp(-t * 60)) * pitch
    body = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * 26)
    ring = np.sin(2 * np.pi * 760 * pitch * t) * np.exp(-t * 9) * 0.18
    return layer(body + ring, click(0.4, 5200)) * gain

def drips(S, t0, t1, gain=0.5):
    k = int(np.ceil((t0 - DRIP_T0) / PERIOD))
    while DRIP_T0 + k * PERIOD < t1:
        S.sfx_at(plink(gain, 1.0 + 0.02 * np.sin(k * 1.7)), DRIP_T0 + k * PERIOD); k += 1

def beep(gain=0.06):
    n = int(0.12 * SR); t = np.arange(n) / SR
    return np.sin(2 * np.pi * 980 * t) * np.minimum(1, (0.12 - t) * 60) * gain

def rain(S, t0, t1, gain=0.12):
    n = S.N; x = hp(bp(_rng.standard_normal(n), 800, 7000), 600) * gain
    S.amb += x * S.env(t0, t1, 0.8, 0.8)

def cues(S):
    # ---------------- cold open + title: the drip alone, then a boom with the title
    S.drone([(0, 0.18), (TITLE, 0.25), (TITLE + 0.5, 0.0), (at('C1_01') - 1, 0.0), (at('C1_04'), 0.25), (at('C1_04') + 0.5, 0.0),
             (at('C1_19'), 0.0), (at('C1_19') + 1, 0.35), (C2, 0.45), (C2 + 1.5, 0.0), (DUR, 0.0)])
    drips(S, 0, at('C1_01') - LEAD, 0.6)
    S.sfx_at(boom(3.0, 38), TITLE + 0.9, 0.7)
    # ---------------- Chapter I: the house and the garden (dusk wind), then memories (music box)
    S.wind([(0, 0.0), (at('C1_01') - LEAD, 0.0), (at('C1_01') - LEAD + 1, 0.35), (at('C1_04'), 0.3), (at('C1_04') + 0.3, 0.0),
            (at('C1_24') - 0.2, 0.0), (at('C1_24'), 0.45), (C2, 0.3), (C2 + 1.5, 0.0), (DUR, 0.0)])
    notes = [(0, 12), (0.6, 15), (1.2, 19), (1.8, 17), (2.4, 15), (3.6, 12), (4.2, 10), (4.8, 12), (6.0, 7)]
    mb = []
    for bar in range(0, 9):  # about 65 s of lullaby under the memories
        mb += [(bar * 7.2 + o, n + (0 if bar % 2 == 0 else -2)) for o, n in notes]
    S.music_box(at('C1_04') - 0.3, mb, bass=[(b * 7.2, -9 if b % 2 == 0 else -14) for b in range(9)], stop=at('C1_19'), gain=0.16)
    S.room_tone(at('C1_04'), at('C1_19'))
    # the ritual: clock at eleven, the cross-head squeaks a quarter turn, then the drip begins
    S.ticks(at('C1_07'), at('C1_07') + 3.0, gain=0.4)
    S.sfx_at(chime(523, 1.6, 0.05), at('C1_07') + 0.4); S.sfx_at(chime(392, 1.8, 0.04), at('C1_07') + 1.4)   # two soft strikes
    S.sfx_at(creak(0.35, 0.06), at('C1_08') + 0.4); S.sfx_at(creak(0.35, 0.06), at('C1_08') + 1.2)
    S.sfx_at(creak(0.7, 0.1), end('C1_08') - 0.75)
    drips(S, at('C1_09') + 1.2, at('C1_10'), 0.55)
    drips(S, at('C1_14'), at('C1_15'), 0.5)
    S.sfx_at(whoosh(0.6, 300, 2000, 0.25), at('C1_10') + 0.3)                       # candle up the stairs
    for k in range(10): S.sfx_at(layer(knock(0.3), click(0.5, 900)), at('C1_15') + 3.8 + k * 0.24, 0.5)   # the locked door
    S.sfx_at(click(0.6, 1200), at('C1_17') + 1.6, 0.3); S.sfx_at(knock(0.4), at('C1_17') + 5.5, 0.5)       # frame lifted, laid down
    # present: rain on glass, then the hospital
    rain(S, at('C1_19'), at('C1_20'), 0.1)
    for k in np.arange(at('C1_20'), at('C1_24'), 1.05): S.sfx_at(beep(), k)
    S.tension([(0, 0), (at('C1_21'), 0), (at('C1_22'), 0.5), (end('C1_22'), 0.6), (end('C1_22') + 0.1, 0), (DUR, 0)])
    S.sfx_at(breath(0.6, 0.08), at('C1_22') - 0.5)
    S.sfx_at(boom(2.5, 44), at('C1_24'), 0.4)
