"""The Sickle: Gran's music box and candle room tone through the memory; it stops dead at the years-later dip.
The cold present gets a drone, a drawer, the jolt on "gone", a heartbeat up the stairs, and one metal click on the toe.
Silence from the cut; only the whisper survives, then the title boom. Times come from beats.json."""
import json, os
import numpy as np
from sound_lib import SR, boom, breath, chime, click, creak, whoosh, sting, scratch, pluck, note, reverb, lp, _rng

_B = json.load(open(os.path.join(os.path.dirname(os.path.abspath(__file__)), 'beats.json')))
B = _B['B']
DUR = _B['durationSec']

def slide(dur=0.8, gain=0.25):
    """A wooden drawer running on its rails: low filtered rumble with a little judder."""
    n = int(dur * SR); t = np.arange(n) / SR
    env = np.minimum(1, t / 0.08) * np.minimum(1, (dur - t) / 0.12)
    return lp(_rng.standard_normal(n) * (0.7 + 0.3 * np.sin(2 * np.pi * 23 * t)), 700) * env * gain

def lock_snap(gain=0.9):
    """The shackle seating: a bright click, a heavier clack, a faint ring."""
    a, b, c = click(gain, 5200), click(gain * 0.9, 1400), chime(2900, 0.5, 0.05)
    off = int(0.025 * SR); out = np.zeros(max(len(a), off + len(b), len(c)))
    out[:len(a)] += a; out[off:off + len(b)] += b; out[:len(c)] += c
    return out

def cues(S):
    thirty, cut = B['thirty'], B['cut']
    # --- memory: Gran's lullaby in the candlelight, stopped by the years
    tune = [12, 15, 19, 17, 15, 12, 10, 12, 7, 12, 15, 19, 20, 19, 15, 14, 15, 12]
    notes = [(i * 0.45, v) for i, v in enumerate(tune * 3) if i * 0.45 < thirty - 0.5]
    S.music_box(0.15, notes, bass=[(k, -9 if (k // 2.7) % 2 == 0 else -14) for k in np.arange(0, thirty - 1, 2.7)], stop=thirty)
    S.room_tone(0.0, thirty)
    S.sfx_at(chime(2700, 0.6, 0.04), 1.1)                                        # glint along the blade
    S.sfx_at(click(0.5, 2600), B['toe'] + 0.05, 0.5)                             # the little lock settles
    S.sfx_at(breath(0.9, 0.08), B['put'] - 0.4)                                  # "shh"
    S.dawn_chord(B['promise'], thirty - 0.1)
    S.sfx_at(boom(3.0, 38), thirty, 0.7)                                         # thirty years in one dip
    # --- present
    S.drone([(0, 0), (thirty, 0), (thirty + 0.4, 0.45), (B['lastnight'] - 0.05, 0.5), (B['lastnight'], 0), (B['lastnight'] + 0.2, 0.3),
             (B['gone'], 0.55), (B['stairs'], 0.7), (B['never'], 0.8), (B['ground'] + 1.9, 0.9), (B['cold'], 0.5), (cut - 0.02, 1.0), (cut, 0), (DUR, 0)])
    S.tension([(0, 0), (B['soil'], 0), (B['never'] - 0.1, 0.9), (B['never'], 0.1), (B['cold'], 0.3), (B['snap'], 1.0), (cut - 0.05, 0.6), (cut, 0), (DUR, 0)])
    S.wind([(0, 0), (B['lastnight'], 0), (B['lastnight'] + 0.2, 0.3), (B['never'], 0.3), (B['cold'], 0.15), (cut, 0.2), (cut + 0.01, 0), (DUR, 0)])
    S.sfx_at(creak(1.0, 0.06), B['buried'] - 0.2)                                # lid onto the coffin
    S.sfx_at(click(0.8, 900), B['undertaker'] - 0.15, 0.7)
    S.sfx_at(whoosh(0.5, 200, 1800, 0.4), B['undertaker'] + 0.3, 0.4)            # bundle handed over
    S.sfx_at(slide(0.9, 0.3), B['drawer'] + 0.5); S.sfx_at(click(0.9, 1100), B['drawer'] + 1.45, 0.7)
    S.sfx_at(slide(1.2, 0.12), B['lastnight'] + 0.4)                             # it stands open
    S.sfx_at(boom(2.6, 40), B['gone'] + 0.95, 0.75); S.sfx_at(sting(), B['gone'] + 0.95)
    for k in range(6): S.sfx_at(scratch(0.12, 0.08), B['soil'] + 0.3 + k * 0.17)  # grit under the light
    S.heartbeat_run(B['prints'], B['never'], period=0.85, shrink=0.9, fastest=0.5, gain=0.7)
    S.sfx_at(creak(1.4, 0.08), B['room'] + 0.2)                                  # the bedroom door
    S.sfx_at(boom(3.2, 36), B['ground'] + 1.6, 1.0)                              # "ground."
    S.sfx_at(reverb(np.concatenate([pluck(note(12) * 0.985), np.zeros(48000)]), 3, 0.6), B['cold'] + 0.4, 0.22)  # her tune, detuned
    S.sfx_at(breath(0.8, 0.1), B['cold'] + 1.2)
    S.sfx_at(lock_snap(1.0), B['snap']); S.sfx_at(boom(2.0, 46), B['snap'], 0.5)
    S.sfx_at(whoosh(0.6, 150, 1400, 0.5), B['snap'] + 0.35, 0.5)                 # the hand goes back under
    S.silence(cut, cut + 1.98)                                                    # only the whisper survives
    S.sfx_at(boom(2.5, 40), cut + 2.1, 0.8)                                      # title
