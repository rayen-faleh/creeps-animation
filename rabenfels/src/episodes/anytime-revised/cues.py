"""Narrative accents share events.json with picture. No externally sourced recordings."""
import json
from pathlib import Path
from sound_lib import boom,breath,click,creak,whoosh
E=json.loads(Path(__file__).with_name('events.json').read_text());DUR=E['duration']
def cues(S):
 m,c,w,v,g,r,a,q,p,cut,title=[E[k] for k in ['memory','coldEntry','wake','voice','glance','mirror','alone','tighten','pull','cut','title']]
 S.drone([(0,.24),(m-.03,.4),(m,0),(c-.03,0),(c,.4),(E['blackWake'],0),(w,0),(w+1,.22),(v,.45),(g,.6),(r,.7),(a-.04,.72),(a,0),(q,.5),(p,.8),(cut,0),(DUR,0)])
 S.wind([(0,.25),(m,.06),(c,.25),(E['blackWake'],0),(w,0),(w+1.3,.17),(g,.25),(a,.18),(q,.3),(p,.5),(cut,0),(DUR,0)],gain=.13)
 S.room_tone(m,c,gain=.026)
 S.music_box(m+.12,[(0,12),(.9,15),(1.8,19),(2.6,17),(3.7,15),(4.6,12),(5.65,19)],bass=[(0,-9),(3.7,-9)],stop=c,gain=.065)
 S.tension([(0,0),(v-.8,0),(v-.05,.32),(v,0),(g,0),(r,.55),(a-.05,.65),(a,0),(q,.12),(p,.65),(cut,0)],gain=.022)
 S.sfx_at(creak(1.7,.055),.08)
 S.sfx_at(creak(.7,.035),E['invitation']+.2)
 for t in [E['enter']+.2,E['enter']+.7]:S.sfx_at(boom(.23,100),t,.11)
 S.sfx_at(creak(.9,.055),c)
 S.silence(E['blackWake'],w+.35)
 S.sfx_at(breath(.6,.07),w+.42)
 S.heartbeat_run(w+1.8,a-.1,period=1.05,shrink=.96,fastest=.58,gain=.29)
 S.sfx_at(click(.8,2300),E['lampOn'],.45)
 S.sfx_at(whoosh(.55,180,1000),g,.08)
 S.silence(a-.08,q)
 S.sfx_at(creak(.65,.018),q+.15)
 S.sfx_at(whoosh(.42,180,700),p,.18)
 S.silence(cut,title-.02)
 S.sfx_at(boom(2,40),title,.55)
