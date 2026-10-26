"""The Watch, Part I: score and effects cues. Times = global seconds, shared with scenes (T in Memory.tsx, P in Present.tsx)."""
import json, os
import numpy as np
from sound_lib import SR, boom, breath, chime, click, creak, lp, bp, heartbeat, reverb, scratch, sting, whoosh, _rng

_B = json.load(open(os.path.join(os.path.dirname(os.path.abspath(__file__)), 'beats.json')))   # from beats.py
_T, _P = _B['T'], _B['P']
DUR = _B['durationSec']
NAILS, BANE, HOME, WINDOW, GLARE, LAMP, JUMP = _T['nails'], _T['bane'], _T['home'], _T['window'], _T['glare'], _T['lamp'], _P['card']
ROOM, BLACK, WAKE, MUD, PHONE, BUZZ, MSGS = _P['room'], _P['black'], _P['wake'], _P['mud'], _P['phone'], _P['buzz'], _P['msgs']
HANDS, PROOF, OUT, TURN, LAMP_OFF, TORCH_ON, CUT = _P['hands'], _P['proof'], _P['out'], _P['turn'], _P['lampOff'], _P['torchOn'], _P['cut']

def bell(f=196.0, dur=6.0, gain=0.09):
    """Distant church bell: inharmonic partials, slow decay, a little beating."""
    n = int(dur * SR); t = np.arange(n) / SR; x = np.zeros(n)
    for ratio, amp, dec in [(0.5, 0.6, 0.6), (1.0, 1.0, 0.9), (1.19, 0.5, 1.2), (1.5, 0.35, 1.4), (2.0, 0.4, 1.8), (2.74, 0.2, 2.6)]:
        x += amp * np.sin(2 * np.pi * f * ratio * t * (1 + 0.0015 * np.sin(t * 7))) * np.exp(-t * dec)
    return lp(x, 2500) * gain

def buzz(dur=0.42, gain=0.18):
    """Phone vibrating on a duvet: a pulsed 160 Hz motor."""
    n = int(dur * SR); t = np.arange(n) / SR
    x = np.sign(np.sin(2 * np.pi * 160 * t)) * (0.5 + 0.5 * np.sign(np.sin(2 * np.pi * 9 * t)))
    return lp(x, 900) * gain

def crack(gain=0.5):
    """Knuckle / bone pop: a short low click with a dry tail."""
    return (click(1.0, 700) + np.concatenate([np.zeros(int(0.004 * SR)), click(0.6, 1200)])[: int(0.03 * SR)]) * gain

def cues(S):
    # --- childhood (0 - JUMP): music-box lullaby, warm evening wind
    S.music_box(0.15,
        [(0, 12), (0.5, 15), (1.0, 19), (1.5, 17), (2.0, 15), (3.0, 12), (3.5, 10), (4.0, 12), (5.0, 7),
         (6.0, 12), (6.5, 15), (7.0, 19), (7.5, 20), (8.0, 19), (9.0, 15), (9.5, 14), (10.0, 15), (11.0, 12),
         (12.0, 12), (12.5, 15), (13.0, 19), (13.5, 17), (14.0, 15), (15.0, 12), (15.5, 10), (16.0, 12), (17.0, 7),
         (18.0, 12), (18.5, 15), (19.0, 19), (19.5, 20), (20.0, 19), (21.0, 15), (21.5, 14), (22.0, 15), (23.0, 12)],
        bass=[(0, -9), (3.0, -14), (6.0, -9), (9.0, -11), (12.0, -9), (15.0, -14), (18.0, -9), (21.0, -11)], stop=JUMP, gain=0.2)
    S.wind([(0, 0.18), (WINDOW, 0.18), (WINDOW + 0.1, 0.3), (JUMP, 0.45), (ROOM, 0.35), (BLACK, 0.35), (BLACK + 0.01, 0), (WAKE, 0), (WAKE + 0.4, 0.9),
            (MUD + 1, 0.7), (PHONE, 0.35), (PROOF, 0.4), (TURN, 0.9), (CUT - 0.3, 1.8), (CUT, 2.0), (CUT + 0.01, 0), (DUR, 0)])
    S.room_tone(NAILS, HOME)
    for i in range(8): S.sfx_at(chime(2500 + i * 60), NAILS + 0.3 + i * 0.19)          # fingertip over each silver nail
    S.sfx_at(whoosh(0.5, 1500, 6000, 0.25), BANE + 0.2, 0.4)                             # dry wolfsbane rustle
    for k in range(4): S.sfx_at(click(0.7, 1800), HOME + 0.5 + k * 0.07, 0.4)            # gas lamp catching
    S.sfx_at(boom(0.6, 70, 0.6), WINDOW - 0.68, 0.5)                                    # hop off the wall
    S.sfx_at(click(1.0, 2200), WINDOW + 0.35, 0.8)                                       # Mick's torch on
    S.sfx_at(whoosh(1.6, 300, 1800, 0.4), WINDOW + 0.5); S.sfx_at(whoosh(1.2, 300, 1800, 0.4), WINDOW + 2.4)
    S.tension([(0, 0), (WINDOW + 1, 0), (GLARE, 0.8), (GLARE + 0.05, 0), (LAMP, 0), (JUMP - 0.1, 0.5), (JUMP, 0), (MUD, 0), (PHONE, 0.3), (MSGS[2], 0.9),
               (MSGS[2] + 0.05, 0.1), (HANDS, 0.2), (OUT - 0.05, 1.0), (OUT, 0), (TURN, 0.2), (CUT - 0.05, 1.0), (CUT, 0), (DUR, 0)])
    S.sfx_at(boom(2.2, 46), GLARE, 0.6); S.sfx_at(sting(1.8, 0.03), GLARE)               # the beam lands on our window
    S.sfx_at(breath(0.5, 0.18), GLARE + 0.15)
    # --- twenty years later
    S.sfx_at(boom(3.0, 38), JUMP, 0.75)
    S.sfx_at(bell(), JUMP + 0.25); S.sfx_at(bell(), JUMP + 2.6, 0.8)                    # the funeral bell
    S.sfx_at(whoosh(0.3, 2500, 9000, 0.3), JUMP + 0.2, 0.5)                              # card in his hands
    S.drone([(0, 0), (JUMP, 0), (JUMP + 0.5, 0.45), (BLACK, 0.55), (BLACK + 0.01, 0), (WAKE + 1.5, 0), (MUD + 1.3, 0.4), (PHONE, 0.45), (MSGS[2], 0.7),
             (HANDS, 0.6), (PROOF, 0.85), (OUT, 1.0), (TURN, 0.7), (CUT - 0.02, 1.0), (CUT, 0), (DUR, 0)])
    S.ticks(ROOM, BLACK, gain=0.3)                                                       # the clock in the old room
    S.sfx_at(breath(0.8, 0.16), WAKE + 0.1)                                              # waking
    S.sfx_at(creak(1.6, 0.11), WAKE + 0.3); S.sfx_at(whoosh(1.4, 150, 1400, 0.6), WAKE + 0.5)   # casement swinging, curtains
    S.heartbeat_run(MUD + 1.3, PROOF, period=1.0, shrink=0.94, fastest=0.5, gain=0.8)
    S.sfx_at(buzz(), BUZZ, 1.0); S.sfx_at(buzz(), BUZZ + 0.6, 1.0)
    for m in MSGS: S.sfx_at(click(1.0, 3400) + click(0.6, 2400), m, 0.45)              # message lands
    S.sfx_at(click(1.0, 2600), HANDS + 0.05, 0.7)                                        # phone torch on
    for k, dt in enumerate([1.1, 1.9, 2.6, 3.2, 3.9, 4.5]): S.sfx_at(crack(0.55 + k * 0.05), HANDS + dt)   # knuckles popping as the nails come
    for k in range(5): S.sfx_at(scratch(_rng.uniform(0.1, 0.18), 0.08), HANDS + 2.0 + k * 0.5)
    S.sfx_at(boom(3.2, 34), OUT, 1.0); S.sfx_at(sting(), OUT)                            # "getting out."
    S.sfx_at(whoosh(0.4, 300, 4000), TURN, 0.7)                                          # whip turn
    S.sfx_at(click(0.8, 900), LAMP_OFF, 0.5); S.sfx_at(click(0.5, 700), LAMP_OFF + 0.06, 0.4)   # the lamp dies
    S.sfx_at(click(1.0, 2200), TORCH_ON, 1.0)                                            # a torch at the end of the road
    S.sfx_at(boom(2.5, 40), CUT + 1.0, 0.8)                                              # title
    S.silence(CUT, CUT + 0.98)                                                           # only the whisper survives the cut
