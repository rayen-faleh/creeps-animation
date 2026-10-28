#!/usr/bin/env python3
"""Cut the image-generated vampire woman ("her") into animatable layers.

Inputs (assets/characters/her/raw/): full-b.png (the master figure), face-sheet.png (eyes, brows, mouths),
hands-sheet.png (eight hands with cuffs).
Outputs (assets/characters/her/parts/): full-canvas layers in master coordinates (body, head, arm_upper, arm_fore,
arm_hand), tightly cropped face features and hands, and rig.json with pivots and anchors.

usage: python3 scripts/rig_her.py
"""
import json, os
import numpy as np
from PIL import Image, ImageDraw
from scipy import ndimage

ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'assets', 'characters', 'her')
RAW, OUT = os.path.join(ROOT, 'raw'), os.path.join(ROOT, 'parts')

# master-space landmarks (full-b.png, 1024x1536), read off a grid overlay
HEAD_CUT_Y = 340          # everything above is head; the face oval continues to the chin
CHIN_Y = 362
HEAD_PIVOT = (520, 420)   # base of the neck, under the collar
NECK_BOTTOM_Y = 440       # the neck runs down under the collar
COLLAR = (395, 455, 425, 640)  # y0, y1, x0, x1: the dress neckline, drawn over the head layer
ARM_POLY = [(612, 425), (705, 415), (748, 560), (745, 790), (740, 895), (630, 895), (600, 640), (590, 520)]
DRESS_EDGE = ((578, 600), (677, 955))  # the dress's right edge behind the arm
HAIR_BOTTOM_Y = 612       # behind the arm, hair above this line, nothing below
SHOULDER, ELBOW, WRIST = (598, 455), (642, 630), (688, 776)
FORE_TOP_Y = 626          # below the hair the far sleeve stands clear of everything


def save(arr, name):
    Image.fromarray(arr.astype(np.uint8), 'RGBA').save(os.path.join(OUT, name))


def poly_mask(shape, poly):
    m = Image.new('L', (shape[1], shape[0]), 0)
    ImageDraw.Draw(m).polygon(poly, fill=255)
    return np.array(m) > 0


def components(arr, min_area=400):
    """Connected opaque blobs (dilated a little so a fang or highlight stays with its mouth or eye)."""
    a = arr[..., 3] > 100
    lab, n = ndimage.label(ndimage.binary_dilation(a, iterations=6))
    out = []
    for i in range(1, n + 1):
        ys, xs = np.where((lab == i) & a)
        if len(xs) < min_area:
            continue
        out.append((xs.min(), ys.min(), xs.max() + 1, ys.max() + 1))
    return out


def crop(arr, box, pad=4):
    x0, y0, x1, y1 = box
    x0, y0 = max(0, x0 - pad), max(0, y0 - pad)
    return arr[y0:y1 + pad, x0:x1 + pad].copy()


def main():
    os.makedirs(OUT, exist_ok=True)
    M = np.array(Image.open(os.path.join(RAW, 'full-b.png')).convert('RGBA')).astype(np.int32)
    H, W = M.shape[:2]
    a = M[..., 3] > 100
    lum = M[..., :3].mean(axis=2)
    skin = M[200, 460, :3].copy()
    hair = M[300, 650, :3].copy()

    # face: flood the pale skin from the cheek, fill the holes (eyes, mouth), paint them over with skin
    pale = a & (lum > 190)
    lab, _ = ndimage.label(pale)
    face = ndimage.binary_fill_holes(lab == lab[200, 460])
    # the painted eyes and mouth: the holes in the skin, measured so the swappable features land on them
    holes, nh = ndimage.label(face & ~pale)
    spots = []
    for i in range(1, nh + 1):
        ys, xs = np.where(holes == i)
        if len(xs) > 60:
            spots.append((int(xs.min()), int(ys.min()), int(xs.max()), int(ys.max())))
    spots.sort(key=lambda b: (b[1] > 280, b[0]))
    (fe, ne, mo) = spots[:3]
    clean = M.copy()
    clean[face, :3] = skin
    clean[face, 3] = 255

    yy, xx = np.mgrid[0:H, 0:W]
    head = a & ((yy <= HEAD_CUT_Y) | (face & (yy <= NECK_BOTTOM_Y))) & (xx > 340)

    # the far arm (drawn behind the body): below the hair it stands clear, so cut it out; above, the hair hides it,
    # so the upper arm is a drawn sleeve capsule from the shoulder to the elbow
    (dx0, dy0), (dx1, dy1) = DRESS_EDGE
    right_of_dress = (xx - dx0) * (dy1 - dy0) - (yy - dy0) * (dx1 - dx0) > 0
    soft = M[..., 3] > 8
    arm = soft & poly_mask(M.shape, ARM_POLY) & right_of_dress & (yy >= FORE_TOP_Y)

    body = clean.copy()
    # under the turning head: plain hair, pulled in from the silhouette edge so the head's rim always covers it
    under = ndimage.binary_dilation(face, iterations=3) & (yy <= CHIN_Y - 4) & a
    body[under, :3] = hair
    top = yy <= HEAD_CUT_Y + 6
    body[top & a, :3] = hair
    inner = ndimage.binary_erosion(a, iterations=10)
    body[top & a & ~inner, 3] = 0
    gone = ndimage.binary_dilation(arm, iterations=2) & right_of_dress & (yy >= FORE_TOP_Y)
    body[gone, 3] = 0

    def layer(mask):
        L = np.zeros_like(M)
        L[mask] = clean[mask]
        return L

    save(body, 'body.png')
    save(layer(head), 'head.png')
    cy0, cy1, cx0, cx1 = COLLAR
    collar = a & (lum < 90) & (yy >= cy0) & (yy < cy1) & (xx >= cx0) & (xx < cx1)
    C = np.zeros_like(M)
    C[collar] = M[collar]
    save(C, 'collar.png')

    sleeve = M[700, 660, :3]
    k = 4  # supersample for smooth edges
    big = Image.new('L', (W * k, H * k), 0)
    d = ImageDraw.Draw(big)
    (sx, sy), (ex, ey) = SHOULDER, ELBOW
    d.line([(sx * k, sy * k), (ex * k, ey * k)], fill=255, width=60 * k)
    for (cx, cy) in (SHOULDER, ELBOW):
        d.ellipse([(cx - 30) * k, (cy - 30) * k, (cx + 30) * k, (cy + 30) * k], fill=255)
    cap = np.array(big.resize((W, H), Image.LANCZOS)).astype(np.int32)
    upper = np.zeros_like(M)
    upper[..., :3] = sleeve
    upper[..., 3] = cap
    save(upper, 'arm_upper.png')
    save(layer(arm & (yy < WRIST[1] + 6)), 'arm_fore.png')
    hand = arm & (yy >= WRIST[1])
    save(layer(hand), 'arm_hand.png')

    # face features: rows of the face sheet, left to right
    F = np.array(Image.open(os.path.join(RAW, 'face-sheet.png')).convert('RGBA')).astype(np.int32)
    boxes = sorted(components(F, 150), key=lambda b: (b[1] + b[3]) / 2)
    rows = []
    for b in boxes:
        cy = (b[1] + b[3]) / 2
        if rows and abs(rows[-1][0] - cy) < 45:
            rows[-1][1].append(b)
        else:
            rows.append([cy, [b]])
    names = ['eyes_open', 'eyes_half', 'eyes_closed', 'eyes_wide', 'eyes_red', 'brows_neutral', 'brows_raised', 'brows_angry']
    mouths = ['mouth_closed', 'mouth_smile', 'mouth_ah', 'mouth_oh', 'mouth_fangs', 'mouth_sad']
    feats = {}
    for (cy, bs), name in zip(rows, names + ['mouths']):
        bs = sorted(bs, key=lambda b: b[0])
        if name == 'mouths':
            for b, mname in zip(bs, mouths):
                img = crop(F, b)
                save(img, f'{mname}.png')
                feats[mname] = {'w': img.shape[1], 'h': img.shape[0]}
        else:
            for b, side in zip(bs, ['far', 'near']):
                img = crop(F, b)
                save(img, f'{name}_{side}.png')
                feats[f'{name}_{side}'] = {'w': img.shape[1], 'h': img.shape[0]}

    # hands: two rows of four; the last two of the bottom row came out un-mirrored, so flip them
    Hs = np.array(Image.open(os.path.join(RAW, 'hands-sheet.png')).convert('RGBA')).astype(np.int32)
    hb = sorted(components(Hs, 2000), key=lambda b: ((b[1] + b[3]) / 2 > Hs.shape[0] / 2, b[0]))
    hand_names = ['L_open', 'L_grip', 'L_point', 'L_reach', 'R_open', 'R_grip', 'R_point', 'R_reach']
    hands = {}
    for b, name in zip(hb, hand_names):
        img = crop(Hs, b)
        if name in ('R_point', 'R_reach'):
            img = img[:, ::-1].copy()
        al = img[..., 3] > 100
        l = img[..., :3].mean(axis=2)
        cuff = al & (l < 70)
        palm = al & (l > 170)
        cyx = np.array(ndimage.center_of_mass(cuff))
        pyx = np.array(ndimage.center_of_mass(palm))
        # the wrist: where the cuff meets the skin, approximated between the two centroids
        wrist = cyx + (pyx - cyx) * 0.35
        ang = float(np.degrees(np.arctan2(pyx[0] - cyx[0], pyx[1] - cyx[1])))
        save(img, f'hand_{name}.png')
        hands[name] = {'w': img.shape[1], 'h': img.shape[0], 'wrist': [float(wrist[1]), float(wrist[0])], 'angle': ang,
                       'cuffWidth': float(cuff.any(axis=0).sum())}

    # master hand, for scaling the sheet hands to match
    mh = hand & (lum > 170)
    master_hand_w = int(mh.any(axis=0).sum())
    c = lambda b: ((b[0] + b[2]) / 2, (b[1] + b[3]) / 2)
    eye_far, eye_near, mouth = c(fe), c(ne), c(mo)
    print('eyes', fe, ne, 'mouth', mo)
    rig = {
        'canvas': [W, H],
        'headPivot': HEAD_PIVOT,
        'shoulder': SHOULDER,
        'elbow': ELBOW,
        'wrist': WRIST,
        'eyes': {'far': eye_far, 'near': eye_near, 'farW': fe[2] - fe[0], 'nearW': ne[2] - ne[0]},
        'brows': {'far': (eye_far[0] - 2, fe[1] - 22), 'near': (eye_near[0] + 2, ne[1] - 24), 'farW': (fe[2] - fe[0]) * 1.15, 'nearW': (ne[2] - ne[0]) * 1.15},
        'mouth': {'at': mouth, 'w': mo[2] - mo[0]},
        'masterHandWidth': master_hand_w,
        'features': feats,
        'hands': hands,
    }
    json.dump(rig, open(os.path.join(OUT, 'rig.json'), 'w'), indent=1)
    print(f"{len(feats)} features, {len(hands)} hands, master hand width {master_hand_w}px -> {OUT}")


if __name__ == '__main__':
    main()
