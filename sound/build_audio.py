#!/usr/bin/env python3
"""Build a story's soundtrack: cues -> mix -> master.

usage: python3 sound/build_audio.py <slug> [--target -15]
reads   src/episodes/<portrait|landscape>/<slug>/cues.py (DUR, cues(S)), src/episodes/<portrait|landscape>/<slug>/timing.json, work/<slug>/narration.wav
writes  work/<slug>/mix_raw.wav, assets/audio/<slug>/mix.wav  (48 kHz stereo, about -15 LUFS, <= -1.3 dBTP)
"""
import argparse, importlib.util, json, os, re, subprocess, sys
import soundfile as sf
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import sound_lib as SL

def loudness(path):
    out = subprocess.run(['ffmpeg', '-hide_banner', '-i', path, '-af', 'ebur128=peak=true', '-f', 'null', '-'], capture_output=True, text=True).stderr
    summ = out[out.rfind('Summary:'):]
    I = float(re.search(r'I:\s+(-?[\d.]+) LUFS', summ).group(1)); P = float(re.search(r'Peak:\s+(-?[\d.]+) dBFS', summ).group(1))
    return I, P

def main():
    ap = argparse.ArgumentParser(); ap.add_argument('slug'); ap.add_argument('--target', type=float, default=-15.0)
    a = ap.parse_args()
    found = [os.path.join('src', 'episodes', f, a.slug) for f in ('portrait', 'landscape') if os.path.isdir(os.path.join('src', 'episodes', f, a.slug))]
    if not found: sys.exit(f'no episode folder src/episodes/{{portrait,landscape}}/{a.slug}')
    story = found[0]; work = os.path.join('work', a.slug); pub = os.path.join('assets', 'audio', a.slug)
    os.makedirs(work, exist_ok=True); os.makedirs(pub, exist_ok=True)
    spec = importlib.util.spec_from_file_location('cues', os.path.join(story, 'cues.py')); cues = importlib.util.module_from_spec(spec); spec.loader.exec_module(cues)
    S = SL.Score(cues.DUR); cues.cues(S)
    nar, nsr = sf.read(os.path.join(work, 'narration.wav'))
    lines = json.load(open(os.path.join(story, 'timing.json')))['lines']
    raw = os.path.join(work, 'mix_raw.wav'); sf.write(raw, S.mix(nar, lines, nsr), SL.SR, subtype='PCM_24')
    I0, _ = loudness(raw); gain = a.target - I0
    final = os.path.join(pub, 'mix.wav')
    subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', raw, '-af', f'volume={gain:.2f}dB,alimiter=limit=0.82:attack=3:release=80:level=false',
                    '-ar', '48000', '-c:a', 'pcm_s16le', final], check=True)
    I, P = loudness(final)
    print(f'{final}: {cues.DUR:.1f} s, {I:.1f} LUFS integrated, true peak {P:.1f} dBFS (gain {gain:+.1f} dB)')

if __name__ == '__main__':
    main()
