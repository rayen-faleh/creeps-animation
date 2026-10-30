"""Rabenfels sound, authored against the same event landmarks as picture."""
import json
from pathlib import Path
from sound_lib import boom,breath,click,creak,whoosh,chime,scratch
E=json.loads(Path(__file__).with_name('events.json').read_text());DUR=E['duration']
def cues(S):
 S.drone([(0,.22),(E['town'],.20),(E['marta'],.12),(E['repair'],0),(E['blood'],.14),(E['morning']-.05,.20),(E['morning'],.02),(E['body'],.28),(E['deny']-.04,.50),(E['deny'],0),(E['forge'],.36),(E['witness'],.46),(E['choice'],.64),(E['cut'],0),(DUR,0)])
 S.wind([(0,.02),(E['town'],.45),(E['clerk'],.03),(E['marta'],.02),(E['friend'],.06),(E['repair'],.02),(E['blood'],.03),(E['morning'],.34),(E['forge'],.04),(E['witness'],.10),(E['watch'],.38),(E['choice'],.48),(E['cut'],0),(DUR,0)],gain=.12)
 S.room_tone(E['clerk'],E['morning'],gain=.019)
 S.music_box(E['repair'],[(0,12),(.65,15),(1.5,19),(2.2,15)],bass=[(0,-9)],stop=E['blood'],gain=.06)
 S.tension([(0,0),(E['body'],0),(E['deny']-.07,.48),(E['deny'],0),(E['forge'],0),(E['witness'],.2),(E['choice'],.35),(E['cut']-.1,.55),(E['cut'],0)],gain=.018)
 S.sfx_at(whoosh(.6,150,700),.25,.08)
 S.sfx_at(creak(.5,.025),.7)
 # A distant bell in the square, then quiet walking on cobbles.
 for f,g in [(220,.08),(440,.035),(587,.02)]:S.sfx_at(chime(f,2.1,g),E['town']+.15)
 for t in [4.7,5.4,6.15]:S.sfx_at(boom(.18,120),t,.07)
 S.sfx_at(scratch(1.8,.025),E['write']+.25)
 for k in [0,.12]:S.sfx_at(click(.7,2800),E['rent']+.8+k,.22)
 S.sfx_at(click(.6,1400),E['serve'],.23)
 S.sfx_at(whoosh(.6,160,700),E['mirror'],.06)
 S.sfx_at(creak(.4,.02),E['friend']+.8)
 S.sfx_at(click(.9,1400),E['repair']+.95,.24)
 for k in [0,.13]:S.sfx_at(click(.65,2600),E['coin']+k,.18)
 S.sfx_at(creak(.4,.02),E['cupLift']+.1)
 S.silence(E['morning']-.12,E['morning']+.3)
 S.silence(E['deny']-.05,E['deny']+2.4)
 S.heartbeat_run(E['body'],E['deny']-.1,period=1.1,shrink=.95,fastest=.65,gain=.20)
 S.sfx_at(scratch(2.1,.04),E['forge']+.45,.35)
 S.sfx_at(creak(.8,.045),E['witness']+.05)
 for t in [E['watch']+.2,E['watch']+1.2]:S.sfx_at(boom(.2,100),t,.08)
 S.heartbeat_run(E['choice'],E['cut'],period=1.1,shrink=.93,fastest=.65,gain=.21)
 S.silence(E['cut'],E['title']-.01)
 S.sfx_at(boom(2.5,44),E['title'],.6)
