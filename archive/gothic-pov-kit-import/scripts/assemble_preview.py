"""Place unaltered Kokoro takes on the suspense edit; retain measured phrase offsets."""
# When regenerating takes, delete synthesis-timing.json first so the new measured timings are loaded.
from pathlib import Path
import json
import numpy as np
import soundfile as sf
slug='the-fourth-knock'; p=Path('src/episodes')/slug; work=Path('work')/slug
base=work/'synthesis-timing.json'
if not base.exists(): base.write_text((p/'timing.json').read_text())
t=json.loads(base.read_text()); starts=[0.35,4.50,7.90,11.80]; sr=24000
out=np.zeros(15*sr)
for l,start in zip(t['lines'],starts):
 x,r=sf.read(work/f"line_{l['id']}.wav"); assert r==sr
 shift=start-l['start']; l['start']=start; l['end']=round(start+len(x)/sr,3)
 for phrase in l['phrases']:
  phrase['start']=round(phrase['start']+shift,3); phrase['end']=round(phrase['end']+shift,3)
 i=round(start*sr); out[i:i+len(x)]=x
sf.write(work/'narration.wav',out,sr,subtype='PCM_16')
t.update(total=15,provenance='Kokoro ONNX 0.6.1 bm_lewis en-gb, speed 0.97 / whisper 0.86; measured decoded take durations, authored silence between takes; punctuation phrases from detected internal silence')
(p/'timing.json').write_text(json.dumps(t,indent=2))
def stamp(s):
 ms=round(s*1000); return f'{ms//3600000:02}:{ms//60000%60:02}:{ms//1000%60:02},{ms%1000:03}'
phrases=[v for l in t['lines'] for v in l['phrases']]
(p/'the-fourth-knock.srt').write_text('\n\n'.join(f"{i+1}\n{stamp(v['start'])} --> {stamp(v['end'])}\n{v['text']}" for i,v in enumerate(phrases))+'\n')
print(json.dumps(t,indent=2))
