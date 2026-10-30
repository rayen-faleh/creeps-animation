"""All event times shared with scenes through events.json; sounds entirely synthesised."""
import json
from pathlib import Path
from sound_lib import boom,breath,click,creak,whoosh,sting,heartbeat
E=json.loads(Path(__file__).with_name('events.json').read_text());DUR=E['duration']
def cues(S):
 S.drone([(0,.30),(3.2,.38),(3.25,0),(12.9,0),(13,.35),(14.95,0),(15.2,0),(16.5,.22),(19.2,.4),(24.1,.60),(26.3,.8),(30,.35),(31.5,.7),(33.14,.9),(33.15,0),(DUR,0)])
 S.wind([(0,.25),(3.25,.08),(12.9,.12),(14.94,.25),(14.95,0),(15.2,0),(16.3,.16),(25,.28),(30,.22),(33.14,.6),(33.15,0),(DUR,0)],gain=.15)
 S.room_tone(E['memory'],E['coldEntry'],gain=.028)
 S.music_box(3.35,[(0,12),(.7,15),(1.5,19),(2.4,17),(3.6,15),(4.7,12),(6,19),(7,17),(8.2,15)],bass=[(0,-9),(4.7,-9)],stop=E['coldEntry'],gain=.075)
 S.tension([(0,0),(17.5,0),(19.1,.3),(19.2,0),(23,0),(26.3,.65),(28,.3),(29.99,.7),(30,0),(31.5,.2),(33.14,.8),(33.15,0)],gain=.022)
 S.sfx_at(creak(1.5,.055),.1)
 S.sfx_at(creak(.8,.04),10.05)
 # Small soft steps after the first invitation, rather than continuous shoe sliding.
 for k in [10.85,11.5]:S.sfx_at(boom(.25,100),k,.12)
 S.sfx_at(creak(1.2,.07),13)
 S.silence(14.95,15.45)
 S.sfx_at(breath(.65,.08),15.5)
 S.heartbeat_run(17.2,29.8,period=1.05,shrink=.96,fastest=.55,gain=.32)
 S.sfx_at(click(.8,2300),E['lampOn'],.48)
 S.sfx_at(whoosh(.65,180,1300),E['glance'],.12)
 # Reveal is quiet: remove the bed under 'Alone', no loud jump-scare sting.
 S.silence(29.95,31.2)
 S.sfx_at(creak(.8,.025),31.55)
 S.sfx_at(breath(.6,.07),32.3)
 S.silence(E['cut'],E['title']-.02)
 S.sfx_at(boom(2.7,40),E['title'],.6)
