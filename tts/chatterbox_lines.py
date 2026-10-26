#!/usr/bin/env python3
"""Chatterbox worker: synthesise each script line with a cloned reference voice. Runs inside the Chatterbox venv
(Python 3.11 + torch); tts/narrate.py calls it and does all trimming, whispering and timing itself.

usage: <chatterbox-python> tts/chatterbox_lines.py <script.json> <out_dir> --ref tts/voices/storyteller_ref.wav
writes <out_dir>/raw_<id>.wav (24 kHz mono) for every line.
Note: Chatterbox embeds an imperceptible Perth watermark in everything it generates.
"""
import argparse, json, os
import torch, torchaudio as ta
from chatterbox.tts import ChatterboxTTS

# storyteller delivery: more exaggeration = more dramatic; lower cfg_weight = slower, more deliberate pacing
NORMAL = dict(exaggeration=0.6, cfg_weight=0.35, temperature=0.75)
WHISPER = dict(exaggeration=0.3, cfg_weight=0.3, temperature=0.7)

def main():
    ap = argparse.ArgumentParser(); ap.add_argument('script'); ap.add_argument('out'); ap.add_argument('--ref', required=True)
    ap.add_argument('--seed', type=int, default=7)
    a = ap.parse_args(); os.makedirs(a.out, exist_ok=True)
    model = ChatterboxTTS.from_pretrained(device='cuda' if torch.cuda.is_available() else 'cpu')
    for L in json.load(open(a.script)):
        torch.manual_seed(a.seed)
        wav = model.generate(L['text'], audio_prompt_path=a.ref, **(WHISPER if L.get('whisper') else NORMAL))
        ta.save(os.path.join(a.out, f"raw_{L['id']}.wav"), wav, model.sr)
        print(L['id'], flush=True)

if __name__ == '__main__':
    main()
