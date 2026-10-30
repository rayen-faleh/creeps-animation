"""Measured Kokoro takes plus authored staging/reading pauses. No speech stretching."""
from pathlib import Path
import json
import numpy as np
import soundfile as sf
p=Path('src/episodes/rabenfels-01');w=Path('work/rabenfels-01');sr=24000;duration=62.5
base=w/'synthesis-timing.json'
if not base.exists():base.write_text((p/'timing.json').read_text())
t=json.loads(base.read_text());starts=[.35,1.9,4.4,7.6,10.25,12.85,15.1,18.6,22.2,25.55,28.6,31.15,34.1,36.1,39.1,42.1,45.7,49.2,52.5,54.5,56.7]
x=np.zeros(round(duration*sr))
for i,(l,start) in enumerate(zip(t['lines'],starts)):
 take,r=sf.read(w/f"line_{l['id']}.wav");assert r==sr
 end=start+len(take)/sr
 assert i==len(starts)-1 or end<starts[i+1],(l['id'],end)
 shift=start-l['start'];l.update(start=start,end=round(end,3))
 for ph in l['phrases']:ph.update(start=round(ph['start']+shift,3),end=round(ph['end']+shift,3))
 x[round(start*sr):round(start*sr)+len(take)]=take
sf.write(w/'narration.wav',x,sr,subtype='PCM_16')
t.update(total=duration,provenance='Kokoro ONNX 0.6.1 bm_lewis en-gb model v1.0; measured decoded takes and silence-derived phrase boundaries; authored silence; no speech stretching')
(p/'timing.json').write_text(json.dumps(t,indent=2))
E=dict(duration=duration,town=4.4,clerk=7.6,write=10.25,rent=12.85,marta=15.1,serve=16.25,mirror=18.6,friend=22.2,repair=25.55,blood=28.6,coin=29.8,cupLift=31.15,morning=34.1,body=36.1,deny=39.1,forge=42.1,witness=45.7,watch=49.2,choice=52.5,top=54.5,cast=56.7,cut=58.95,title=59.95)
(p/'events.json').write_text(json.dumps(E,indent=2))
def stamp(t):
 n=round(t*1000);return f'{n//3600000:02}:{n//60000%60:02}:{n//1000%60:02},{n%1000:03}'
ph=[p for l in t['lines'] for p in l['phrases']]
(p/'rabenfels-night-one.srt').write_text('\n\n'.join(f"{i+1}\n{stamp(v['start'])} --> {stamp(v['end'])}\n{v['text']}" for i,v in enumerate(ph))+'\n')
print('Runtime',duration,'s; speech ends',t['lines'][-1]['end'])
