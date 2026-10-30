#!/usr/bin/env bash
# Contact sheet of a rendered video: one frame every N seconds (default 2), 8 columns.
# usage: scripts/contact.sh out/<file>.mp4 [every_seconds]
set -e
f="$1"; every="${2:-2}"; o="${f%.mp4}-contact.png"
ffmpeg -v error -y -i "$f" -vf "fps=1/${every},scale=216:384,tile=8x8:padding=3:color=gray" -frames:v 1 "$o"
echo "$o"
