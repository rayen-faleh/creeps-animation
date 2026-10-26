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
C2 = at('C2_01') - LEAD  # Chapter I ends here

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
    chapters_two_to_five(S)
    # ---------------- cold open + title: the drip alone, then a boom with the title
    pass  # drone, wind and tension for the whole film are set once in film_bed(S) below
    drips(S, 0, at('C1_01') - LEAD, 0.6)
    S.sfx_at(boom(3.0, 38), TITLE + 0.9, 0.7)
    # ---------------- Chapter I: the house and the garden (dusk wind), then memories (music box)
    pass
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
    pass
    S.sfx_at(breath(0.6, 0.08), at('C1_22') - 0.5)
    S.sfx_at(boom(2.5, 44), at('C1_24'), 0.4)


# ---------------------------------------------------------------- chapters II-V
C3 = at('C3_01') - LEAD
C4 = at('C4_01') - LEAD
C5 = at('C5_01') - LEAD
CUT = at('C5_24') - 0.12
LAST_DROP = DRIP_T0 + np.ceil((at('C3_18') + 0.4 - DRIP_T0) / PERIOD) * PERIOD  # same as scenes (nextDrop)

def drips_p(S, t0, t1, period, gain=0.5):
    t = t0
    while t < t1: S.sfx_at(plink(gain, 1.0 + 0.03 * np.sin(t)), t); t += period

def thud(gain=0.6, f=55):
    n = int(0.35 * SR); t = np.arange(n) / SR
    return lp(np.sin(2 * np.pi * f * t) * np.exp(-t * 18) + bp(_rng.standard_normal(n), 100, 800) * np.exp(-t * 30) * 0.4, 600) * gain

def dig(gain=0.4):
    n = int(0.3 * SR); t = np.arange(n) / SR
    return (bp(_rng.standard_normal(n), 300, 2500) * np.exp(-t * 14) + thud(0.3, 70)[:n]) * gain

def hiss(S, t0, t1, gain=0.03):
    S.amb += bp(_rng.standard_normal(S.N), 2000, 6000) * S.env(t0, t1, 0.4, 0.6) * gain

def growl(gain=0.25, dur=1.8):
    n = int(dur * SR); t = np.arange(n) / SR
    f = 60 + 12 * np.sin(t * 9)
    x = np.sign(np.sin(2 * np.pi * np.cumsum(f) / SR)) * (0.6 + 0.4 * np.sin(2 * np.pi * 23 * t))
    return lp(x, 300) * np.sin(np.linspace(0, np.pi, n)) * gain

def film_bed(S):
    """Drone, wind and tension across the whole film."""
    S.drone([(0, 0.18), (TITLE, 0.25), (TITLE + 0.5, 0.0), (at('C1_19') + 0.5, 0.0), (at('C1_19') + 1.5, 0.35), (C2, 0.4),
             (at('C2_03'), 0.3), (at('C2_09'), 0.45), (at('C2_12'), 0.25), (at('C2_18'), 0.45), (C3, 0.3), (at('C3_07'), 0.4), (at('C3_10'), 0.55),
             (at('C3_18'), 0.6), (LAST_DROP + 0.4, 0.0), (at('C4_05'), 0.0), (at('C4_05') + 1.0, 0.45), (at('C4_17'), 0.8), (at('C4_18'), 0.5),
             (at('C4_24'), 0.8), (C5, 0.3), (at('C5_13'), 0.6), (at('C5_19'), 0.8), (CUT - 0.02, 1.0), (CUT, 0.0), (DUR, 0.0)])
    S.wind([(0, 0.0), (at('C1_01') - LEAD, 0.0), (at('C1_01') - LEAD + 1, 0.35), (at('C1_04'), 0.3), (at('C1_04') + 0.3, 0.0),
            (at('C1_24') - 0.2, 0.0), (at('C1_24'), 0.45), (C2, 0.3), (C2 + 1.5, 0.08), (at('C2_12'), 0.08), (at('C2_12') + 0.3, 0.4),
            (at('C2_18'), 0.4), (at('C2_18') + 0.3, 0.08), (C3, 0.08), (C3 + 0.3, 0.35), (at('C3_02'), 0.35), (at('C3_02') + 0.3, 0.06),
            (at('C3_07'), 0.06), (at('C3_07') + 0.3, 0.35), (at('C3_14'), 0.35), (at('C3_14') + 0.3, 0.05), (at('C3_18'), 0.05), (LAST_DROP + 0.4, 0.0),
            (at('C5_03'), 0.0), (at('C5_03') + 0.5, 0.7), (at('C5_06'), 0.5), (at('C5_06') + 0.3, 0.0), (DUR, 0.0)])
    S.tension([(0, 0), (at('C1_21'), 0), (at('C1_22'), 0.5), (end('C1_22'), 0.6), (end('C1_22') + 0.1, 0),
               (at('C2_07'), 0), (at('C2_08'), 0.5), (at('C2_09'), 0.2), (at('C2_11b') + 3, 0.6), (at('C2_12'), 0),
               (at('C3_05'), 0), (at('C3_10'), 0.7), (at('C3_10') + 0.05, 0.1), (at('C3_13'), 0.6), (at('C3_14'), 0),
               (at('C4_10'), 0.2), (at('C4_17'), 0.9), (at('C4_17') + 0.05, 0.2), (at('C4_24'), 0.8), (at('C4_24') + 0.05, 0),
               (at('C5_19'), 0.3), (CUT - 0.05, 1.0), (CUT, 0), (DUR, 0)])

def chapters_two_to_five(S):
    film_bed(S)
    # ---- II: moving in
    S.sfx_at(click(1.0, 1100), C2 + 1.6, 0.7); S.sfx_at(layer(knock(0.5), click(0.6, 800)), C2 + 2.3, 0.6); S.sfx_at(creak(1.6, 0.1), C2 + 2.8)
    S.room_tone(at('C2_02'), at('C2_12'))
    drips(S, at('C2_03'), at('C2_09'), 0.5)
    S.ticks(at('C2_05'), at('C2_06'), gain=0.25)
    drips_p(S, at('C2_09') + 0.4, at('C2_10'), 0.85, 0.5)        # dark nights: faster
    drips_p(S, at('C2_10') + 0.4, at('C2_11'), 3.4, 0.5)         # bright nights: slower
    drips(S, at('C2_11'), at('C2_12'), 0.4)
    hiss(S, at('C2_11'), at('C2_11b'), 0.02)
    S.sfx_at(thud(0.5, 70), end('C2_17') - 0.6)                  # Haworth shuts his door
    for k in range(8): S.sfx_at(layer(knock(0.3), click(0.5, 900)), at('C2_18') + 1.6 + k * 0.25, 0.5)
    S.room_tone(at('C2_18'), C3)
    drips(S, at('C2_18'), C3, 0.45)
    S.ticks(at('C2_20'), at('C2_21'), gain=0.2)
    S.sfx_at(layer(click(1.0, 3400), click(0.6, 2400)), at('C2_22') + 1.4, 0.45)
    # ---- III: the plumber
    S.sfx_at(thud(0.4, 90), C3 + 2.5)                            # van door
    for k in [0.8, 1.6, 2.4]: S.sfx_at(creak(0.3, 0.06), at('C3_02') + k)
    drips(S, at('C3_02'), at('C3_07'), 0.5)
    S.sfx_at(creak(0.8, 0.07), at('C3_03') + 0.2); S.sfx_at(click(0.9, 2200), at('C3_03') + 0.5, 0.6)
    hiss(S, at('C3_03'), at('C3_07'), 0.03)
    for k in np.arange(at('C3_07') + 0.5, at('C3_10'), 1.43): S.sfx_at(dig(0.5), k)
    hiss(S, at('C3_11'), at('C3_12'), 0.025)
    S.sfx_at(whoosh(1.4, 1200, 6000, 0.15), at('C3_12') + 0.6)
    S.room_tone(at('C3_14'), LAST_DROP + 0.5)
    drips(S, at('C3_14'), LAST_DROP + 0.1, 0.55)
    for k in np.arange(at('C3_17') + 0.6, at('C3_17') + 3.2, 0.13): S.sfx_at(click(0.6, 3000), k, 0.4)   # spanner ratchet
    S.sfx_at(reverb(np.concatenate([plink(0.8), np.zeros(SR * 2)]), 3.0, 0.6), LAST_DROP)               # the last drop, ringing out
    S.silence(LAST_DROP + 0.9, at('C4_02') - 0.3)                # nothing in the house moves
    # ---- IV: three a.m.
    S.sfx_at(breath(0.8, 0.12), at('C4_02') + 0.2)
    for k in [1.0, 1.7, 2.4, 3.3]: S.sfx_at(thud(0.7, 50), at('C4_05') + k)   # stamping downstairs
    S.sfx_at(click(1.0, 2600), at('C4_06') + 0.3, 0.7)
    S.sfx_at(chime(2800, 0.4, 0.02), at('C4_07') + 0.5)
    S.heartbeat_run(at('C4_08'), at('C4_17'), period=1.0, shrink=0.96, fastest=0.6, gain=0.7)
    for k in np.arange(at('C4_12') + 0.3, at('C4_13'), 0.92): S.sfx_at(creak(0.5, 0.06), k)
    S.sfx_at(whoosh(2.5, 100, 900, 0.3), at('C4_16'))
    S.sfx_at(creak(2.2, 0.12), at('C4_17') + 0.3)
    S.sfx_at(boom(2.8, 40), end('C4_20') - 1.2, 0.5)
    S.sfx_at(boom(3.2, 34), at('C4_24'), 0.9); S.sfx_at(sting(), at('C4_24'))
    # ---- V: the letter (music box under Gran's voice), the run, the dry tap
    notes = [(0, 12), (0.7, 15), (1.4, 19), (2.1, 17), (2.8, 15), (4.2, 12), (4.9, 10), (5.6, 12), (7.0, 7)]
    mb = []
    for bar in range(8): mb += [(bar * 7.6 + o, n - (bar % 2) * 2) for o, n in notes]
    S.music_box(C5 + 1.0, mb, bass=[(b * 7.6, -9 if b % 2 == 0 else -14) for b in range(8)], stop=at('C5_13'), gain=0.14)
    S.sfx_at(growl(0.18), at('C5_03') + 4.5)
    for k in np.arange(at('C5_04') + 0.4, at('C5_05'), 1.6): S.sfx_at(dig(0.35), k)
    hiss(S, at('C5_05'), at('C5_06'), 0.03)
    S.sfx_at(creak(0.6, 0.08), end('C5_06') - 1.0)
    for k in np.arange(at('C5_07'), at('C5_08'), 0.75): S.sfx_at(creak(0.3, 0.05), k + 0.35); S.sfx_at(plink(0.3), k + 0.6)
    for k in np.arange(at('C5_13') + 0.2, at('C5_14'), 0.2): S.sfx_at(thud(0.45, 80), k)     # running down the stairs
    S.sfx_at(whoosh(0.5, 300, 3000), at('C5_14') + 0.1, 0.6)
    S.sfx_at(creak(0.7, 0.12), end('C5_15') - 0.8); S.sfx_at(creak(0.6, 0.12), at('C5_17'))      # the dry squeak, twice
    S.sfx_at(reverb(np.concatenate([creak(1.4, 0.08), np.zeros(SR)]), 2.5, 0.6), at('C5_19') + 1.6)   # a door, upstairs
    for i, k in enumerate(np.arange(at('C5_20'), at('C5_22'), 1.0)): S.sfx_at(thud(0.35 + i * 0.06, 52), k)   # coming down
    S.heartbeat_run(at('C5_21'), CUT, period=0.8, shrink=0.93, fastest=0.45, gain=0.8)
    S.sfx_at(breath(0.9, 0.16), at('C5_22') + 1.0)               # right behind me
    S.silence(CUT, CUT + 2.3)                                     # only the whisper survives the cut
    S.sfx_at(boom(3.0, 38), CUT + 2.4, 0.8)                       # title
