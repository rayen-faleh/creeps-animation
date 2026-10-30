"""The Count, Part I: score and effects cues. Times = global seconds (see shots.json)."""
from sound_lib import whoosh, click, boom, chime, breath, scratch, creak, sting, pluck, note, reverb
import numpy as np

DUR = 64.0

def cues(S):
    # --- memory (0-13.5): lullaby, dawn lift, candle room tone
    S.dawn_chord(11.1, 13.5)
    S.music_box(0.15,
        [(0, 12), (0.45, 15), (0.9, 19), (1.35, 17), (1.8, 15), (2.7, 12), (3.15, 10), (3.6, 12), (4.5, 7),
         (5.4, 12), (5.85, 15), (6.3, 19), (6.75, 20), (7.2, 19), (8.1, 15), (8.55, 14), (9.0, 15), (9.9, 12)],
        bass=[(0, -9), (2.7, -14), (5.4, -9), (8.1, -11)], stop=13.5)
    S.room_tone(3.3, 11.08)
    # --- present: drone rises with dread; silent at 3 a.m.; tension swells into each reveal
    S.drone([(0, 0), (13.5, 0), (14, 0.5), (24.3, 0.6), (24.55, 0), (27.3, 0), (30, 0.35), (34.86, 0.55), (36.6, 0.9),
             (40.44, 0.9), (40.6, 0.15), (42.8, 0.6), (48, 0.8), (49.99, 0.5), (55, 0.55), (58.3, 0.7), (60.9, 1.0), (61.0, 0), (64, 0)])
    S.tension([(0, 0), (30, 0), (36.5, 0.6), (40.4, 1.0), (40.5, 0), (45, 0), (48.25, 1.0), (48.3, 0), (58.3, 0), (60.95, 1.0), (61.0, 0)])
    S.wind([(0, 0.5), (3.3, 0.5), (3.31, 0.12), (13.5, 0.35), (24.5, 0.35), (24.55, 0), (27.3, 0.3), (58.3, 0.3), (59.5, 1.6), (60.9, 2.0), (61.0, 0), (64, 0)])
    # --- effects
    S.sfx_at(whoosh(0.5, 300, 3000), 1.75, 0.5)                      # shape flits across the moon
    S.patter(3.65, 2.7)                                               # rice poured on the sill
    for i in range(17): S.sfx_at(chime(2600 + i * 37), 9.145 + i * 0.11)  # grains counted, one glint each
    S.sfx_at(boom(3.0, 38), 13.5, 0.7); S.sfx_at(click(1.0, 2000), 13.56, 0.6)   # 26 years later; torch on
    S.sfx_at(whoosh(0.6, 400, 5000), 22.35, 0.6); S.patter(22.45, 0.5, n=260, gain=0.4, tail=0.25)  # sweep
    S.ticks(24.6, 27.3, gain=0.55); S.ticks(27.6, 32.0, gain=0.25)  # 3 a.m. clock
    S.sfx_at(breath(), 24.8)
    S.heartbeat_run(34.86, 40.44)
    S.sfx_at(boom(2.5, 44), 36.55, 0.6)                               # floor comes into view
    for i in range(6):                                                # grains pushed onto the pile
        S.sfx_at(click(0.9, 3800), 36.62 + i * 0.6 + 0.54, 0.6); S.sfx_at(click(0.4, 5000), 36.62 + i * 0.6 + 0.24, 0.3)
    S.sfx_at(boom(3.0, 34), 41.36, 0.9)                               # "was mine"
    S.sfx_at(whoosh(0.9, 150, 2200), 43.8, 0.9); S.sfx_at(whoosh(0.4, 1500, 8000, 0.5), 44.0, 0.5)  # cloth off
    S.sfx_at(boom(3.5, 36), 48.25, 1.0); S.sfx_at(sting(), 48.25)      # "I wasn't."
    for k in range(9): S.sfx_at(scratch(np.random.uniform(0.12, 0.2)), 50.2 + k * 0.22)
    S.sfx_at(reverb(np.concatenate([pluck(note(12) * 0.985), np.zeros(48000)]), 3, 0.6), 52.75, 0.25)  # Gran's tune, detuned
    S.sfx_at(reverb(np.concatenate([pluck(note(15) * 0.98), np.zeros(48000)]), 3, 0.6), 53.3, 0.22)
    S.sfx_at(click(1.0, 3600), 55.83, 0.9)                            # last grain
    S.sfx_at(click(1.0, 900) + click(0.8, 600), 58.45, 0.9); S.sfx_at(creak(), 58.6); S.sfx_at(whoosh(1.6, 150, 1600), 59.0, 0.8)
    S.sfx_at(boom(2.5, 40), 62.0, 0.8)                                # title
    S.silence(61.0, 61.98)                                            # only the whisper survives the cut
