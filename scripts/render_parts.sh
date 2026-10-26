#!/usr/bin/env bash
# Render a long-form composition in parts (one per chapter), then join them into the full film with the
# full soundtrack laid over in one pass (no audio seams at the joins).
# usage: scripts/render_parts.sh <CompositionId> <out_dir> <audio.wav> <t0> <t1> <t2> ... <tEnd>   (seconds)
# Each finished part prints "PART_DONE <n> <file>"; the joined film prints "FILM_DONE <file>".
set -e
id="$1"; out="$2"; audio="$3"; shift 3
mkdir -p "$out"
bounds=("$@"); n=$(( ${#bounds[@]} - 1 ))
: > "$out/parts.txt"
for ((i = 0; i < n; i++)); do
  a=$(python3 -c "print(round(${bounds[$i]} * 30))"); b=$(python3 -c "print(round(${bounds[$((i + 1))]} * 30) - 1)")
  f="$out/part$((i + 1)).mp4"
  npx remotion render src/index.ts "$id" "$f" --frames="$a-$b" --codec=h264 --crf=20 --x264-preset=veryfast \
    --audio-codec=aac --audio-bitrate=192k --concurrency=4 --log=error
  echo "file '$(basename "$f")'" >> "$out/parts.txt"
  echo "PART_DONE $((i + 1)) $f"
done
# join: decode the parts' pictures and encode once (a stream-copy concat drops frames at the joins because each
# part's AAC runs slightly longer than its video), then lay the full soundtrack over in one pass
film="$out/$(basename "$out").mp4"
inputs=(); chain=""
for ((i = 0; i < n; i++)); do inputs+=(-i "$out/part$((i + 1)).mp4"); chain+="[$i:v]"; done
ffmpeg -v error -y "${inputs[@]}" -i "$audio" -filter_complex "${chain}concat=n=$n:v=1:a=0[v]" -map "[v]" -map "$n:a" \
  -c:v libx264 -crf 18 -preset veryfast -pix_fmt yuv420p -r 30 -c:a aac -b:a 192k -movflags +faststart "$film"
echo "FILM_DONE $film"
