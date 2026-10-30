"""Author suspense pauses around measured Kokoro takes; one timeline for picture/sound/captions."""
from pathlib import Path
import json
import numpy as np
import soundfile as sf
slug='anytime-revised'; p=Path('src/episodes')/slug; w=Path('work')/slug
base=w/'synthesis-timing.json'
if not base.exists():base.write_text((p/'timing.json').read_text())
t=json.loads(base.read_text()); starts=[.18,2.05,3.55,5.45,7.85,10.25,11.65,14.85,17.85,20,22.4,25,28.1];sr=24000;duration=32.2
out=np.zeros(round(duration*sr))
for i,(l,start) in enumerate(zip(t['lines'],starts)):
 x,r=sf.read(w/f"line_{l['id']}.wav");assert r==sr
 end=start+len(x)/sr
 assert i==len(starts)-1 or end<starts[i+1],(l['id'],end)
 shift=start-l['start'];l.update(start=start,end=round(end,3))
 for ph in l['phrases']:ph['start']=round(ph['start']+shift,3);ph['end']=round(ph['end']+shift,3)
 out[round(start*sr):round(start*sr)+len(x)]=x
sf.write(w/'narration.wav',out,sr,subtype='PCM_16')
t.update(total=duration,provenance='Kokoro ONNX 0.6.1 bm_lewis en-gb, model v1.0; decoded take durations and detected internal silences; authored inter-line pauses; no speech time stretching')
(p/'timing.json').write_text(json.dumps(t,indent=2))
events=dict(duration=duration,memory=3.55,openDoor=5.45,beckon=7.85,invitation=7.85,enter=9.1,coldEntry=10.25,blackWake=11.35,wake=11.65,voice=17.85,lampReach=20,lampContact=20.95,lampOn=21.2,held=21.6,glance=21.85,mirror=22.4,alone=25,tighten=27.3,lastLine=28.1,pull=28.7,cut=29.03,title=30.03)
(p/'events.json').write_text(json.dumps(events,indent=2))
def stamp(s):
 m=round(s*1000);return f'{m//3600000:02}:{m//60000%60:02}:{m//1000%60:02},{m%1000:03}'
ph=[v for l in t['lines'] for v in l['phrases']]
(p/'anytime.srt').write_text('\n\n'.join(f"{i+1}\n{stamp(v['start'])} --> {stamp(v['end'])}\n{v['text']}" for i,v in enumerate(ph))+'\n')
(p/'post-caption.txt').write_text('Send this to the friend who lets themselves in.\n\nYou said anytime. They remembered.\n')
print('Timeline:',duration,'s; speech ends',t['lines'][-1]['end'])
for l in t['lines']:print(l['id'],l['start'],l['end'],l['phrases'])
