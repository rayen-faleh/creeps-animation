"""Measure current takes and rebuild captions, picture/sound events, and the 65s edit."""
from pathlib import Path
import json
import numpy as np
import soundfile as sf
from narrate import phrases_for,SR
p=Path('src/episodes/rabenfels-02');w=Path('work/rabenfels-02');duration=65.0
script=json.loads((p/'script.json').read_text())
starts=[.2,2.6,5.55,6.8,10.5,14.55,17.8,22.15,24.2,27.35,30,31.4,33.3,35,37.7,41.1,42.9,45.25,47.8,49.8,51.6,54.9,58.75]
assert len(script)==len(starts)
out=np.zeros(round(duration*SR));lines=[]
for i,(l,start) in enumerate(zip(script,starts)):
 x,r=sf.read(w/f"line_{l['id']}.wav");assert r==SR
 end=start+len(x)/SR
 assert end<(starts[i+1] if i<len(starts)-1 else duration),(l['id'],end)
 rec={'id':l['id'],'text':l['text'],'start':start,'end':round(end,3),'whisper':False}
 if l.get('voiceStyle'):rec['voiceStyle']=l['voiceStyle']
 rec['phrases'],rec['phraseSource']=phrases_for(x,rec)
 for ph in rec['phrases']:ph['start']=max(start,ph['start']);ph['end']=min(rec['end'],ph['end'])
 lines.append(rec);j=round(start*SR);out[j:j+len(x)]=x
sf.write(w/'narration.wav',out,SR,subtype='PCM_16')
t={'unit':'seconds','total':duration,'provenance':'Current decoded Kokoro bm_lewis takes; detected internal silence or whole-line phrase captions; authored pauses. Stranger is regular speech with slight pitch/pace/EQ/compression and mostly dry short room reverb in mix. No whisper-noise layer.','lines':lines}
(p/'timing.json').write_text(json.dumps(t,indent=2)+'\n')
(w/'synthesis-timing.json').write_text(json.dumps(t,indent=2)+'\n')
E=dict(duration=duration,decision=.2,scent=2.6,cloves=5.55,memory=6.8,recruit=10.5,cover=14.55,evidence=17.8,door=22.15,street=24.2,coat=27.35,ask=30,glance=31.4,witness=33.3,stairs=35,mirror=37.7,target=41.1,demand=42.9,secret=45.25,turn=47.8,what=49.8,reach=51.6,question=54.9,top=58.75,cut=61.7,title=62.7)
(p/'events.json').write_text(json.dumps(E,indent=2)+'\n')
def stamp(v):
 n=round(v*1000);return f'{n//3600000:02}:{n//60000%60:02}:{n//1000%60:02},{n%1000:03}'
phrases=[v for l in lines for v in l['phrases']]
(p/'rabenfels-part-two.srt').write_text('\n\n'.join(f"{i+1}\n{stamp(v['start'])} --> {stamp(v['end'])}\n{v['text']}" for i,v in enumerate(phrases))+'\n')
for l in lines:print(l['id'],l['start'],l['end'],l.get('voiceStyle','narrator'),l['text'])
print('Duration',duration,'speech ends',lines[-1]['end'])
