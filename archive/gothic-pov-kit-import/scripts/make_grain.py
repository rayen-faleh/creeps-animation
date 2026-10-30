#!/usr/bin/env python3
"""Regenerate public/tex/grain0-7.png (seeded 540x960 film-grain tiles) if they are ever lost."""
import numpy as np, os, struct, zlib
def png(path, arr):
    h, w = arr.shape[:2]; raw = b''.join(b'\x00' + arr[y].tobytes() for y in range(h))
    def chunk(t, d): c = struct.pack('>I', len(d)) + t + d; return c + struct.pack('>I', zlib.crc32(t + d) & 0xffffffff)
    open(path, 'wb').write(b'\x89PNG\r\n\x1a\n' + chunk(b'IHDR', struct.pack('>IIBBBBB', w, h, 8, 4, 0, 0, 0)) + chunk(b'IDAT', zlib.compress(raw, 6)) + chunk(b'IEND', b''))
os.makedirs('public/tex', exist_ok=True); rng = np.random.default_rng(13)
for i in range(8):
    v = np.clip(128 + rng.normal(0, 1, (960, 540)) * 60, 0, 255).astype(np.uint8)
    png(f'public/tex/grain{i}.png', np.stack([v, v, v, np.full_like(v, 255)], -1))
print('8 grain tiles -> public/tex/')
