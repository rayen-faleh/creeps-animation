#!/usr/bin/env bash
# Render every kit panel (one frame each) and tile them into docs/kit-catalog.png
set -e
n=$(grep -c "name: '" src/catalog/Catalog.tsx)
times=$(python3 -c "import sys; n=int(sys.argv[1]); print(' '.join(str(round(i/30+0.001,4)) for i in range(n)))" "$n")
rm -rf out/stills/Catalog
node scripts/stills.mjs Catalog $times --scale=0.3
mkdir -p docs
cols=4; rows=$(( (n + cols - 1) / cols ))
ffmpeg -v error -y -pattern_type glob -i 'out/stills/Catalog/f*.png' -vf "tile=${cols}x${rows}:padding=6:color=0x222222" -frames:v 1 docs/kit-catalog.png
echo "docs/kit-catalog.png ($n panels)"
