#!/usr/bin/env python3
"""Regenerate the seeded film-grain tiles: assets/textures/portrait/grain0-7.png (540x960) and
assets/textures/landscape/grain0-7.png (960x540).

usage: python3 scripts/make_grain.py [portrait|landscape|both]   (default both)
"""
import numpy as np, os, struct, sys, zlib

def png(path, arr):
    h, w = arr.shape[:2]; raw = b''.join(b'\x00' + arr[y].tobytes() for y in range(h))
    def chunk(t, d): c = struct.pack('>I', len(d)) + t + d; return c + struct.pack('>I', zlib.crc32(t + d) & 0xffffffff)
    open(path, 'wb').write(b'\x89PNG\r\n\x1a\n' + chunk(b'IHDR', struct.pack('>IIBBBBB', w, h, 8, 4, 0, 0, 0)) + chunk(b'IDAT', zlib.compress(raw, 6)) + chunk(b'IEND', b''))

FORMATS = {'portrait': ((960, 540), 13), 'landscape': ((540, 960), 31)}  # (rows, cols), seed
which = sys.argv[1] if len(sys.argv) > 1 else 'both'
for name, (shape, seed) in FORMATS.items():
    if which not in (name, 'both'): continue
    out = os.path.join('assets', 'textures', name); os.makedirs(out, exist_ok=True); rng = np.random.default_rng(seed)
    for i in range(8):
        v = np.clip(128 + rng.normal(0, 1, shape) * 60, 0, 255).astype(np.uint8)
        png(os.path.join(out, f'grain{i}.png'), np.stack([v, v, v, np.full_like(v, 255)], -1))
    print(f'8 grain tiles -> {out}/')
