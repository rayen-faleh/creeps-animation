"""The Knock (template): score and effects cues. Times = global seconds, shared with scenes/Story.tsx."""
from sound_lib import boom, breath, click, whoosh, knock, sting

DUR = 18.5
DOOR_KNOCKS = [2.4, 2.8, 3.2, 10.2, 10.55, 10.9]   # keep in sync with scenes/Story.tsx
BEHIND_KNOCK = 11.5
CUT = 14.25

def cues(S):
    S.drone([(0, 0.35), (4, 0.5), (6.4, 0.0), (9.38, 0.45), (11.5, 0.9), (CUT, 1.0), (CUT + 0.01, 0), (DUR, 0)])
    S.wind([(0, 0.3), (6.4, 0.1), (9.38, 0.3), (11.75, 0.8), (CUT, 1.2), (CUT + 0.01, 0), (DUR, 0)])
    S.music_box(6.5, [(0, 12), (0.45, 15), (0.9, 19), (1.35, 17), (1.8, 15)], bass=[(0, -9)], stop=9.38)   # memory
    S.room_tone(6.42, 9.38)
    S.tension([(0, 0), (9.38, 0), (11.45, 1.0), (11.5, 0), (12.0, 0.3), (CUT, 1.0), (CUT + 0.01, 0)])
    for k in DOOR_KNOCKS: S.sfx_at(knock(), k, 0.9)
    S.sfx_at(knock(1.2), BEHIND_KNOCK, 1.0)                     # the fourth: from behind
    S.sfx_at(breath(0.5, 0.15), BEHIND_KNOCK + 0.15)
    S.sfx_at(whoosh(0.4, 300, 4000), 11.72, 0.7)                 # whip-turn
    S.sfx_at(boom(2.5, 40), 11.85, 0.8); S.sfx_at(sting(), 11.85)
    S.sfx_at(boom(2.5, 40), CUT + 1.0, 0.8)                      # title
    S.silence(CUT, CUT + 0.98)                                   # only the whisper survives the cut
