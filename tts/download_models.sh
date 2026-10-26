#!/usr/bin/env bash
# Fetch the Kokoro v1.0 model files (about 353 MB) into tts/models/. They are not committed.
set -e
cd "$(dirname "$0")/models"
base=https://github.com/thewh1teagle/kokoro-onnx/releases/download/model-files-v1.0
for f in kokoro-v1.0.onnx voices-v1.0.bin; do
  [ -f "$f" ] && echo "$f already present" || curl -L -o "$f" "$base/$f"
done
