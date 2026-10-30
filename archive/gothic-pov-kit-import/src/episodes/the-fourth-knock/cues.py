"""Cue times are shared with the visual edit through events.json."""
import json
from pathlib import Path
from sound_lib import boom,breath,knock,sting,whoosh,creak
E=json.loads(Path(__file__).with_name('events.json').read_text())
DUR=E['duration']
def cues(S):
 S.music_box(.1,[(0,12),(.6,15),(1.2,19),(1.85,17)],bass=[(0,-9)],stop=E['memoryEnd'],gain=.10)
 S.room_tone(0,E['memoryEnd'],gain=.035)
 S.drone([(0,0),(3.05,0),(3.15,.26),(6.6,.45),(7.55,.7),(11.64,.9),(11.65,0),(15,0)])
 S.wind([(0,.1),(3.05,.18),(7.55,.35),(8.05,.6),(11.64,.7),(11.65,0),(15,0)],gain=.20)
 S.tension([(0,0),(6.3,0),(7.5,.65),(7.55,0),(9,.2),(11.64,.75),(11.65,0)])
 for t in E['knocks']: S.sfx_at(knock(),t,.75)
 S.heartbeat_run(4.8,7.5,period=1,shrink=.88,gain=.4)
 S.sfx_at(knock(1.2),E['fourthKnock'],.9)
 S.sfx_at(breath(.5,.12),7.72)
 S.sfx_at(whoosh(.4,300,4000),E['turn']-.03,.5)
 S.sfx_at(boom(2.5,40),8.2,.6); S.sfx_at(sting(),8.2,.8)
 S.sfx_at(creak(.55,.07),11.1)
 S.sfx_at(boom(2.35,40),E['title'],.65)
 S.silence(E['cut'],E['title']-.02)
