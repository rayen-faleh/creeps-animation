"""Authored entirely synthesised soundtrack, sharing picture event anchors."""
import json
from pathlib import Path
from sound_lib import boom,click,creak,whoosh,breath,chime,sting
E=json.loads(Path(__file__).with_name('events.json').read_text());DUR=E['duration']
def cues(S):
 S.drone([(0,.18),(E['memory'],.03),(E['recruit'],.16),(E['coat'],.22),(E['stairs'],.36),(E['mirror']-.03,.5),(E['mirror'],.04),(E['target'],.18),(E['secret'],.05),(E['turn'],.15),(E['reach'],.37),(E['question'],.5),(E['cut'],0),(DUR,0)])
 S.wind([(0,.25),(E['memory'],0),(E['recruit'],.2),(E['door'],.3),(E['street'],.3),(E['coat'],.015),(E['stairs'],.06),(E['cut'],0),(DUR,0)],gain=.13)
 S.room_tone(E['memory'],E['recruit'],gain=.018)
 S.room_tone(E['coat'],E['cut'],gain=.015)
 S.music_box(E['memory'],[(0,12),(1.1,15),(2.1,19)],stop=E['recruit'],gain=.035)
 S.tension([(0,0),(E['stairs'],.15),(E['mirror']-.1,.3),(E['mirror'],0),(E['turn'],.1),(E['reach'],.25),(E['question'],.34),(E['cut'],0)],gain=.018)
 S.sfx_at(whoosh(.5,160,700),.75,.055)
 S.sfx_at(breath(.65,.025),1.75)
 S.sfx_at(click(.4,1200),E['memory']+1.1,.18)
 S.sfx_at(creak(.45,.02),E['recruit']+.4)
 S.sfx_at(whoosh(.35,200,900),E['cover']+.1,.045)
 S.sfx_at(whoosh(.3,200,700),E['evidence']+1.2,.03)
 S.sfx_at(creak(.4,.04),E['door']+.6)
 S.sfx_at(click(.5,1600),E['door']+.7,.14)
 for dt in [.3,1.1,2.0]:S.sfx_at(boom(.16,115),E['street']+dt,.055)
 for dt in [.2,1.1,1.9]:S.sfx_at(whoosh(.6,150,600),E['coat']+dt,.028)
 for dt in [.8,1.75]:S.sfx_at(creak(.35,.032),E['stairs']+dt)
 S.sfx_at(boom(1.8,48),E['mirror']+.9,.16)
 S.sfx_at(sting(1.3,.007),E['mirror']+.9)
 S.silence(E['mirror']+1.85,E['target']-.2)
 S.silence(E['demand']-.05,E['turn']-.05)
 S.sfx_at(creak(.45,.025),E['reach']+.25)
 S.heartbeat_run(E['reach'],E['cut'],period=1.1,shrink=.93,fastest=.62,gain=.20)
 S.silence(E['cut'],E['title']-.015)
 S.sfx_at(boom(2.5,44),E['title'],.54)
