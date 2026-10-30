"""Preserve Kokoro takes; author silence for the approved 37-second horror edit."""
from pathlib import Path
import json
import numpy as np
import soundfile as sf
slug='friend-who-never-knocks';p=Path('src/episodes')/slug; w=Path('work')/slug
base=w/'synthesis-timing.json'
if not base.exists():base.write_text((p/'timing.json').read_text())
t=json.loads(base.read_text()); starts=[.35,3.25,5.35,8.85,10.0,12.9,15.2,19.2,22.1,24.1,26.3,30.0,32.2];sr=24000;duration=37
out=np.zeros(duration*sr)
for l,start in zip(t['lines'],starts):
 x,r=sf.read(w/f"line_{l['id']}.wav");assert r==sr
 shift=start-l['start'];l['start']=start;l['end']=round(start+len(x)/sr,3)
 for ph in l['phrases']:ph['start']=round(ph['start']+shift,3);ph['end']=round(ph['end']+shift,3)
 out[round(start*sr):round(start*sr)+len(x)]=x
sf.write(w/'narration.wav',out,sr,subtype='PCM_16')
t.update(total=duration,provenance='Fresh Kokoro ONNX 0.6.1 bm_lewis en-gb, v1.0 model; measured decoded take durations and detected internal silences; authored inter-line suspense pauses; no speech time stretching')
(p/'timing.json').write_text(json.dumps(t,indent=2))
events={'duration':duration,'memory':3.25,'openDoor':5.35,'beckon':8.85,'invitation':10.0,'enter':10.5,'coldEntry':12.9,'blackWake':14.95,'wake':15.2,'voice':19.2,'lampReach':22.1,'lampContact':23.1,'lampOn':23.4,'held':24.1,'glance':25.1,'mirror':26.3,'alone':30.0,'tighten':31.5,'lastLine':32.2,'cut':33.15,'title':34.15}
(p/'events.json').write_text(json.dumps(events,indent=2))
def stamp(s):
 m=round(s*1000);return f'{m//3600000:02}:{m//60000%60:02}:{m//1000%60:02},{m%1000:03}'
ph=[v for l in t['lines'] for v in l['phrases']]
(p/'friend-who-never-knocks.srt').write_text('\n\n'.join(f"{i+1}\n{stamp(v['start'])} --> {stamp(v['end'])}\n{v['text']}" for i,v in enumerate(ph))+'\n')
(p/'post-caption.txt').write_text('To the friend who never knocks: we need to talk.\n')
print('Timeline locked:',duration,'s; last speech ends',t['lines'][-1]['end'])
