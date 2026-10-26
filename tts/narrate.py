#!/usr/bin/env python3
"""Gothic POV narrator: per-line synthesis, measured timings and caption phrases.

Engines:
  kokoro      (default) Kokoro-82M via kokoro-onnx, voice bm_lewis, offline CPU. The style's pinned voice.
              A line may set "voice" (e.g. bf_emma, bm_george) and "speed" to cast characters.
  chatterbox  Resemble AI Chatterbox, cloning tts/voices/storyteller_ref.wav (itself synthetic bm_lewis).
              Runs tts/chatterbox_lines.py in its own Python (env CHATTERBOX_PYTHON, default
              /root/.venvs/chatterbox/bin/python). Needs huggingface.co for the first model download.

usage: python3 tts/narrate.py src/episodes/<slug> [--engine kokoro|chatterbox] [--models tts/models] [--work work/<slug>]
reads   <story>/script.json   [{"id","text","pauseAfter", "whisper"?}]
writes  <work>/line_<id>.wav, <work>/narration.wav (24 kHz), <story>/timing.json (seconds)
"""
import argparse, json, os, re, subprocess
import numpy as np, soundfile as sf
from scipy.signal import butter, sosfilt

VOICE, LANG = "bm_lewis", "en-gb"
SPEED_NORMAL, SPEED_WHISPER = 0.97, 0.86
LEAD_IN, PAUSE_SCALE = 0.35, 0.8
SR = 24000

def trim(x, thr=0.008):
    idx = np.where(np.abs(x) > thr)[0]
    a = max(0, idx[0] - int(0.03 * SR)); b = min(len(x), idx[-1] + int(0.08 * SR))
    y = x[a:b].copy(); f = int(0.01 * SR)
    y[:f] *= np.linspace(0, 1, f); y[-f:] *= np.linspace(1, 0, f)
    return y

def whisperize(x):
    """Dry breathy whisper: speech envelope drives band-passed noise, plus a thin copy of the voice."""
    rng = np.random.default_rng(7)
    env = sosfilt(butter(2, 40, 'low', fs=SR, output='sos'), np.abs(x)) * 3
    breath = sosfilt(butter(4, [1500, 7000], 'band', fs=SR, output='sos'), rng.standard_normal(len(x))) * env
    hp = sosfilt(butter(2, 300, 'high', fs=SR, output='sos'), x)
    y = 0.55 * hp + 1.6 * breath
    return y / np.abs(y).max() * 0.6

def phrases_for(x, line):
    """Split a line at , . … and place boundaries on the longest internal silences (>= 90 ms)."""
    parts = [p.strip() for p in re.split(r'(?<=[.,!?])\s+|(?<=\.\.\.)\s*', line['text']) if p.strip()]
    hop = int(0.01 * SR)
    e = np.array([np.sqrt((x[i:i + hop] ** 2).mean()) for i in range(0, len(x) - hop, hop)])
    quiet = e < 0.012; gaps = []; i = 0
    while i < len(quiet):
        if quiet[i]:
            j = i
            while j < len(quiet) and quiet[j]: j += 1
            if j - i >= 9 and i > 5 and j < len(quiet) - 5: gaps.append(((i + j) / 2 * 0.01, (j - i) * 0.01))
            i = j
        else:
            i += 1
    need = len(parts) - 1
    if need > 0 and len(gaps) >= need:
        chosen = sorted(sorted(gaps, key=lambda g: -g[1])[:need])
        cuts = [0] + [g[0] for g in chosen] + [len(x) / SR]
        return [{"text": p, "start": round(line['start'] + cuts[k], 3), "end": round(line['start'] + cuts[k + 1], 3)} for k, p in enumerate(parts)], 'measured-silence'
    if need > 0 and gaps:
        # fewer clear pauses than punctuation breaks: keep every measured pause, each attached to the nearest
        # punctuation boundary by position in the line; parts between chosen boundaries are merged.
        dur = len(x) / SR; total = sum(len(p) for p in parts); acc = 0; bounds = []
        for p in parts[:-1]:
            acc += len(p); bounds.append(acc / total * dur)
        picks = {}
        for g in sorted(gaps, key=lambda g: -g[1]):
            k = min(range(len(bounds)), key=lambda i: abs(bounds[i] - g[0]))
            if k not in picks: picks[k] = g[0]
        order = sorted(picks); cuts = [0] + [picks[k] for k in order] + [dur]; groups = []; prev = 0
        for k in order + [len(parts) - 1]:
            groups.append(' '.join(parts[prev:k + 1])); prev = k + 1
        return [{"text": g, "start": round(line['start'] + cuts[i], 3), "end": round(line['start'] + cuts[i + 1], 3)} for i, g in enumerate(groups)], 'measured-silence(partial)'
    return [{"text": line['text'], "start": line['start'], "end": line['end']}], 'whole-line' if need == 0 else 'whole-line(fallback)'

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('story'); ap.add_argument('--models', default=os.path.join('tts', 'models')); ap.add_argument('--work')
    ap.add_argument('--engine', choices=['kokoro', 'chatterbox'], default='kokoro')
    ap.add_argument('--ref', default=os.path.join('tts', 'voices', 'storyteller_ref.wav'))
    a = ap.parse_args()
    slug = os.path.basename(os.path.normpath(a.story))
    work = a.work or os.path.join('work', slug); os.makedirs(work, exist_ok=True)
    lines = json.load(open(os.path.join(a.story, 'script.json')))
    if a.engine == 'kokoro':
        from kokoro_onnx import Kokoro
        k = Kokoro(os.path.join(a.models, 'kokoro-v1.0.onnx'), os.path.join(a.models, 'voices-v1.0.bin'))
        # per-line overrides: "voice" (any Kokoro voice, e.g. bf_emma), "speed"; language follows the voice prefix
        def synth(L):
            v = L.get('voice', VOICE)
            sp = L.get('speed', SPEED_WHISPER if L.get('whisper') else SPEED_NORMAL)
            lang = 'en-gb' if v[:1] == 'b' else 'en-us'
            return np.asarray(k.create(L['text'], voice=v, speed=sp, lang=lang)[0], dtype=np.float64)
    else:
        raw = os.path.join(work, 'chatterbox_raw')
        py = os.environ.get('CHATTERBOX_PYTHON', '/root/.venvs/chatterbox/bin/python')
        subprocess.run([py, os.path.join(os.path.dirname(os.path.abspath(__file__)), 'chatterbox_lines.py'),
                        os.path.join(a.story, 'script.json'), raw, '--ref', a.ref], check=True)
        def synth(L):
            x, sr = sf.read(os.path.join(raw, f"raw_{L['id']}.wav"))
            assert sr == SR, f'expected {SR} Hz from Chatterbox, got {sr}'
            return np.asarray(x, dtype=np.float64)
    out = np.zeros(int(LEAD_IN * SR)); timing = []
    for L in lines:
        s = trim(synth(L))
        s = whisperize(s) if L.get('whisper') else s / np.abs(s).max() * 0.8
        sf.write(os.path.join(work, f"line_{L['id']}.wav"), s, SR)
        start = len(out) / SR; out = np.concatenate([out, s]); end = len(out) / SR
        rec = {"id": L['id'], "text": L['text'], "start": round(start, 3), "end": round(end, 3), "whisper": bool(L.get('whisper')), "voice": L.get('voice', VOICE if a.engine == 'kokoro' else 'chatterbox')}
        if L.get('chapter'): rec['chapter'] = L['chapter']
        rec['phrases'], rec['phraseSource'] = phrases_for(s, rec)
        timing.append(rec)
        out = np.concatenate([out, np.zeros(int(L.get('pauseAfter', 0.3) * PAUSE_SCALE * SR))])
    sf.write(os.path.join(work, 'narration.wav'), out, SR, subtype='PCM_16')
    json.dump({"unit": "seconds", "total": round(len(out) / SR, 3),
               "provenance": (f"kokoro {VOICE}" if a.engine == 'kokoro' else f"chatterbox cloning {a.ref}") + " per-line synthesis; times measured from decoded samples", "lines": timing},
              open(os.path.join(a.story, 'timing.json'), 'w'), indent=1)
    print(f"narration {len(out) / SR:.2f} s, {len(lines)} lines -> {work}/narration.wav, {a.story}/timing.json")
    for r in timing: print(f"  {r['id']} {r['start']:6.2f}-{r['end']:6.2f}  {r['text']}")

if __name__ == '__main__':
    main()
