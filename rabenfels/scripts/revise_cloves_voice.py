"""Regenerate only the decision and stranger takes with clear, regular bm_lewis speech."""
from pathlib import Path
import argparse,json,subprocess
import numpy as np
import soundfile as sf
from kokoro_onnx import Kokoro
from narrate import trim,SR

def active_rms(x):
 hop=int(.02*SR)
 chunks=[x[i:i+hop] for i in range(0,len(x),hop)]
 active=[c for c in chunks if len(c) and np.sqrt(np.mean(c*c))>.035]
 a=np.concatenate(active) if active else x
 return float(np.sqrt(np.mean(a*a)))

def main():
 ap=argparse.ArgumentParser();ap.add_argument('--models',default='voice');a=ap.parse_args()
 p=Path('src/episodes/rabenfels-02');w=Path('work/rabenfels-02');w.mkdir(exist_ok=True,parents=True)
 lines=json.loads((p/'script.json').read_text())
 refs=[sf.read(w/f"line_{l['id']}.wav")[0] for l in lines if l['id'] not in {'L00','L16','L17'}]
 target=float(np.median([active_rms(x) for x in refs]))
 k=Kokoro(str(Path(a.models)/'kokoro-v1.0.onnx'),str(Path(a.models)/'voices-v1.0.bin'))
 info={'engine':'Kokoro ONNX 0.6.1','voice':'bm_lewis','language':'en-gb','model':'v1.0','stranger':{'speed':.94,'pitchSemitones':-.8,'presenceEqDb':1.5,'shortRoomWet':.14,'noiseWhisper':False,'compression':{'threshold':.2,'ratio':2,'attackMs':5,'releaseMs':65},'speechLevelTargetRelativeDb':0.83},'takes':[]}
 for l in lines:
  if l['id'] not in {'L00','L16','L17'}:continue
  character=l['id'] in {'L16','L17'}
  x,_=k.create(l['text'],voice='bm_lewis',speed=.94 if character else .97,lang='en-gb')
  x=trim(np.asarray(x,dtype=np.float64));x=x/np.max(np.abs(x))*.8
  dry=w/f"dry_{l['id']}.wav";sf.write(dry,x,SR,subtype='PCM_16')
  if character:
   ratio=2**(-.8/12)
   dst=w/f"pitched_{l['id']}.wav"
   fx=f'asetrate={SR*ratio:.5f},aresample={SR},atempo={1/ratio:.7f},highpass=f=65,equalizer=f=2500:t=q:w=0.8:g=1.5,acompressor=threshold=0.2:ratio=2:attack=5:release=65:makeup=1.1'
   subprocess.run(['ffmpeg','-nostdin','-v','error','-y','-i',str(dry),'-af',fx,'-c:a','pcm_s16le',str(dst)],check=True)
   x,r=sf.read(dst);assert r==SR
   gain=min(target*1.1/active_rms(x),.9/np.max(np.abs(x)));x=x*gain
  sf.write(w/f"line_{l['id']}.wav",x,SR,subtype='PCM_16')
  entry={'id':l['id'],'text':l['text'],'duration':len(x)/SR,'activeRms':active_rms(x),'peak':float(np.max(np.abs(x))),'character':character}
  info['takes'].append(entry);print(entry,flush=True)
 (p/'voice-settings.json').write_text(json.dumps(info,indent=2)+'\n')

if __name__=='__main__':main()
