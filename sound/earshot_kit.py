#!/usr/bin/env python3
"""Horror sound kit, made in code with earshot (https://github.com/Leonxlnx/earshot): no recordings, no licences.

Two kinds of sound land in assets/sfx/<name>.wav (48 kHz mono), ready for Score.sample(name, t, gain) in a cues.py:
  * picks from earshot's shipped bank (impacts, sub drops, dark risers, swells, cloth swipes, knocks, clicks ...),
    rendered with `earshot.forge.bank.render` (the renderer behind `earshot sfx render`, which audits each take);
  * textures the bank doesn't have (rain on an umbrella, soil on a coffin lid, linen tearing, chewing, candle snuffs,
    a phone buzzing, a music box, rice grains), written here as physical recipes on earshot's DSP blocks
    (earshot.forge.dsp: modal bodies, contact excitation, noise; earshot.forge.fx: reverb, granular, filters).
Every sound is deterministic for its seed. Check them by ear with `sound/earshot_listen.py` (earshot's CLAP critic).

usage (earshot lives in its own venv): <venv>/bin/python sound/earshot_kit.py [name ...]
"""
import os, sys
import numpy as np
import soundfile as sf
from earshot.forge import dsp, fx
from earshot.forge import bank

SR = dsp.SR
OUT = os.path.join('assets', 'sfx')

BANK = {  # our name: earshot bank id
    'impact_deep': 'impact/deep', 'impact_rumble': 'pro_impact/rumble', 'hit_rumble': 'cut_hit/rumble',
    'sub_drop': 'sub_drop/long', 'riser_dark': 'riser/dark', 'riser_tension': 'riser/tension',
    'swell_dark': 'reverse_swell/dark', 'sink': 'downlifter/sub_sink', 'whoosh_deep': 'whoosh_big/thump_deep',
    'whoosh_windy': 'pro_whoosh_big/windy', 'swipe_cloth': 'swipe/cloth', 'swipe_velvet': 'swipe/velvet',
    'knock_wood': 'knock/wood', 'drip': 'drip/drop', 'tap_phone': 'fit/land.light/finger_phone',
    'switch_flip': 'fit/snap/switch_flip', 'click_thock': 'click/thock', 'mouth_plop': 'fit/pop/mouth_plop',
    'bell_small': 'fit/bell/small_bell',
}


def mono(x):
    x = np.asarray(x, float)
    if x.ndim == 2: x = x.mean(axis=1) if x.shape[1] <= 2 else x.mean(axis=0)
    return x


def save(name, x, peak_db=-1.0):
    x = dsp.fade(dsp.normalize(mono(x), peak_db), 0.002, 0.03)
    os.makedirs(OUT, exist_ok=True)
    sf.write(os.path.join(OUT, name + '.wav'), x.astype(np.float32), SR, subtype='PCM_16')
    print(f'{name:<20} {len(x) / SR:5.2f}s')


def events(seconds, rate, r, env=None):
    """Poisson onsets (s) at `rate` per second, thinned by an optional envelope function of t (0..1)."""
    t, out = 0.0, []
    while True:
        t += r.exponential(1 / rate)
        if t >= seconds: return np.array(out)
        if env is None or r.random() < env(t): out.append(t)


def lay(n, onsets, grains, amps):
    y = np.zeros(n)
    for t, g, a in zip(onsets, grains, amps): dsp.place(y, g, t, a)
    return y


# ------------------------------------------------------------------------------------------------ small things

def phone_buzz(seed=51, muffled=False, pulses=((0, 0.38), (0.55, 0.38))):
    """A phone vibrating: a 165 Hz motor in short pulses, rattling the surface (wood) or smothered (satin)."""
    r = dsp.rng(seed); s = max(a + b for a, b in pulses) + 0.3; n = dsp.n_of(s); t = dsp.t_of(n)
    f = 165 * (1 + 0.01 * dsp.wander(s, r, rate=8)[:n]); ph = 2 * np.pi * np.cumsum(f) / SR
    motor = sum(np.sin(k * ph) / k for k in (1, 2, 3, 5))
    gate = np.zeros(n)
    for a, b in pulses:
        gate += np.clip((t - a) / 0.012, 0, 1) * np.clip((a + b - t) / 0.02, 0, 1)
    y = motor * gate
    if muffled:
        return dsp.butter(y, 'low', 900)
    rattle = dsp.excite(np.maximum(y, 0) * (r.random(n) < 0.02), dsp.modal_cloud(300, 3200, 24, 0.02, 0.004, 0.05, r))
    return y + 0.6 * rattle / (np.max(np.abs(rattle)) + 1e-9)


def rice_pour(seconds=2.5, seed=61, surface='wood'):
    """Rice streaming onto a wooden sill: hundreds of tiny hard grains, each a bright knock, bouncing."""
    r = dsp.rng(seed); n = dsp.n_of(seconds)
    env = lambda t: np.clip(t / 0.15, 0, 1) * np.clip((seconds - t) / 0.4, 0, 1)
    grains = [dsp.excite(dsp.modal(r.uniform(2200, 5200) * np.array([1, 1.5, 2.3]), [0.003, 0.002, 0.0015], [1, .5, .3], 0.012, r),
                         dsp.contact(0.0001, r)) for _ in range(30)]
    on = events(seconds, 900, r, env)
    y = lay(n, on, [grains[i] for i in r.integers(0, len(grains), len(on))], r.lognormal(-1.2, 0.6, len(on)))
    if surface == 'wood':
        y = y + 0.25 * dsp.excite(y, dsp.modal_cloud(200, 1800, 20, 0.03, 0.005, 0.2, r))
    return dsp.room(y, r, rt60=0.35, size=0.4, wet=0.1)


GRAN_TUNE = [(0, 12), (0.45, 15), (0.9, 19), (1.35, 17), (1.8, 15), (2.7, 12), (3.15, 10), (3.6, 12), (4.5, 7),
             (5.4, 12), (5.85, 15), (6.3, 19), (6.75, 20), (7.2, 19), (8.1, 15), (8.55, 14), (9.0, 15), (9.9, 12)]


def music_box(seed=71, tune=GRAN_TUNE, rate=1.0, detune=0.0):
    """A music box: steel comb tines (inharmonic bar partials) plucked by pins, the clockwork ticking under it,
    in a small room. rate < 1 slows the spring; detune (semitones) for a memory going wrong."""
    r = dsp.rng(seed); s = tune[-1][0] / rate + 3.0; n = dsp.n_of(s); y = np.zeros(n)
    for t0, semi in tune:
        f = 440 * 2 ** ((semi + 12 + detune * r.uniform(0.5, 1)) / 12)
        tine = dsp.bell(f, 2.4, r, 'bar', decay=1.1, bright=0.55)
        dsp.place(y, tine, t0 / rate, 0.5)
        dsp.place(y, dsp.butter(dsp.contact(0.0002, r), 'high', 3000) * 0.08, t0 / rate - 0.004)
    tick = dsp.excite(dsp.modal([3100, 5200], [0.003, 0.002], [1, .4], 0.02, r), dsp.contact(0.0001, r))
    for t0 in np.arange(0, s - 2.5, 0.075 / rate): dsp.place(y, tick, t0, 0.012)
    return fx.reverb(y, r, rt60=0.9, size=0.4, wet=0.18, damp=0.5)


# ------------------------------------------------------------------------------------------------ textures
# Written after earshot's listening pass (sound/earshot_listen.py): first drafts read as bubbles (rain), static
# (tear), a kick-drum pattern (chewing) and a kick (snuff). Parameters chosen by a small search scored by
# earshot's CLAP match (see sound/earshot_search.py).
def rain2(seconds=10.0, seed=3, rate=320, f_lo=140, f_hi=380, decay=0.008, splash=0.5, bed=0.35, lp=9000):
    """Rain on an umbrella: dense, damped fabric taps and tiny splashes over a broad hiss."""
    r = dsp.rng(seed); n = dsp.n_of(seconds)
    taps = []
    for _ in range(40):
        f0 = r.uniform(f_lo, f_hi)
        body = dsp.modal(f0 * r.uniform([1, 1.4, 2.0, 2.9], [1, 1.8, 2.6, 3.8]), decay * r.uniform(0.6, 1.4, 4),
                         [1, .7, .5, .35], 0.06, r, jitter=0.02)
        tap = dsp.excite(body, dsp.contact(r.uniform(0.0004, 0.0012), r, bright=1.0))
        sp = dsp.butter(dsp.noise(0.004, r), 'band', (2000, 9000)) * dsp.env_exp(0.004, 0.0012) * splash
        tap[:len(sp)] += sp; taps.append(tap)
    on = events(seconds, rate, r)
    y = lay(n, on, [taps[i] for i in r.integers(0, len(taps), len(on))], r.lognormal(-0.4, 0.7, len(on)))
    y = y / (np.sqrt(np.mean(y ** 2)) + 1e-9) * 0.1
    hiss = dsp.butter(dsp.noise(seconds, r, 'pink'), 'band', (400, lp)) * 0.1 * bed / 0.35
    hiss *= np.clip(0.85 + 0.15 * dsp.wander(seconds, r, rate=0.5)[:n], 0.4, 1.3)
    return dsp.butter(fx.reverb(y + hiss, r, rt60=0.6, size=0.6, wet=0.15, damp=0.6), 'low', lp)


def rip(seconds=2.4, seed=21, period=0.0032, jit=0.4, f_body=950, noise_mix=0.35, surge=2.0, lo=350, hi=4200):
    """Linen tearing: fibres part in a fast, uneven train of snaps (a rasp with a pitch that follows the tear's
    speed), through the cloth's small body, with the weave's hiss under it."""
    r = dsp.rng(seed); n = dsp.n_of(seconds); tt = dsp.t_of(n)
    w = dsp.wander(seconds, r, rate=surge)[:n]; w = (w - w.min()) / (np.ptp(w) + 1e-9)
    edge = np.clip(tt / 0.04, 0, 1) * np.clip((seconds - tt) / 0.12, 0, 1)
    speed = (0.35 + 0.65 * w) * edge
    imp = np.zeros(n); t = 0.0
    while t < seconds:
        k = min(n - 1, int(t * SR)); sp = speed[k]
        if sp > 0.02: imp[k] += sp * r.lognormal(0, 0.5) * (4 if r.random() < 0.01 else 1)
        t += period / max(0.15, sp) * (1 + jit * r.standard_normal() * 0.5)
        t = max(t, k / SR + 1 / SR)
    body = dsp.modal(f_body * np.array([1, 1.63, 2.4, 3.3]), [0.004, 0.003, 0.002, 0.0015], [1, .7, .5, .3], 0.02, r)
    y = dsp.butter(dsp.excite(imp, body), 'band', (lo, hi))
    y = y / (np.max(np.abs(y)) + 1e-9)
    hiss = dsp.butter(dsp.noise(seconds, r, 'pink'), 'band', (lo * 2, hi * 1.5)) * speed
    return dsp.room(y + noise_mix * hiss / (np.max(np.abs(hiss)) + 1e-9), r, rt60=0.2, size=0.3, wet=0.06)


def chew2(seconds=6.0, seed=31, cycle=0.62, lo=450, hi=2600, bubbles=14, jaw=0.06, crunch=0.35, lp=0):
    """Slow wet chewing, close: squelches whose band opens and closes with the jaw, a spatter of saliva clicks,
    a little crunch of fibres at each bite; barely any thud."""
    r = dsp.rng(seed); n = dsp.n_of(seconds); y = np.zeros(n); t = 0.1
    while t < seconds - 0.45:
        d = cycle * r.uniform(0.5, 0.7); m = dsp.n_of(d); tt = dsp.t_of(m)
        env = np.sin(np.pi * np.clip(tt / d, 0, 1)) ** 1.2
        src = dsp.noise(d, r, 'pink'); band = np.zeros(m)
        for k in range(0, m, 240):
            seg = src[k:k + 240]; c = lo + (hi - lo) * env[k]
            band[k:k + len(seg)] = dsp.butter(seg, 'band', (c * 0.55, c * 1.5))
        wet = np.convolve((r.random(m) < 0.006).astype(float) * r.lognormal(0, 0.6, m), np.hanning(96), 'same')
        dsp.place(y, band * env * (0.4 + wet), t, r.uniform(0.7, 1.0))
        for _ in range(int(r.poisson(bubbles))):
            bd = r.uniform(0.004, 0.014); f = r.uniform(700, 3200)
            b = np.sin(2 * np.pi * np.cumsum(np.linspace(f, f * r.uniform(1.2, 1.6), dsp.n_of(bd))) / SR) * dsp.env_exp(bd, bd / 3)
            dsp.place(y, b, t + r.uniform(0, d + 0.1), r.uniform(0.04, 0.16))
        if crunch:
            dsp.place(y, mono(rip(r.uniform(0.06, 0.14), int(r.integers(1e6)), period=0.002, f_body=1400)), t + d * 0.7, crunch * 0.3)
        if jaw:
            dsp.place(y, dsp.excite(dsp.modal([90, 180], [0.02, 0.01], [1, .4], 0.06, r), dsp.contact(0.004, r, 0.3)), t + d, jaw)
        t += cycle * r.uniform(0.85, 1.15)
    return dsp.butter(y, 'low', lp) if lp else y


def blow_out(seed=41, dur=0.5, center=900, flutter=0.5, lo=300, hi=3000, sizzle=0.06, lips=0.5):
    """Blowing out a candle: lips part with a soft 'p', one short breath (turbulent air), the wick hissing as it dies."""
    r = dsp.rng(seed); s = dur + 0.5; n = dsp.n_of(s)
    a = dsp.air(dur, r, center=center, flutter=flutter)
    a = dsp.butter(mono(a), 'band', (lo, hi)) * dsp.env_curve([(0, 0), (0.06, 1), (dur * 0.6, 0.7), (dur, 0)], dur)
    y = np.zeros(n); y[:len(a)] += a / (np.max(np.abs(a)) + 1e-9)
    if lips:
        lp_, _ = bank.render('fit/pop/lip_pop', seed=seed); lp_ = mono(lp_)
        dsp.place(y, lp_ / (np.max(np.abs(lp_)) + 1e-9), 0.0, lips)
    hs = dsp.butter(dsp.noise(0.4, r), 'high', 4000) * dsp.env_exp(0.4, 0.08, attack=0.03) * sizzle
    dsp.place(y, hs, dur * 0.8)
    return dsp.room(y, r, rt60=0.4, size=0.4, wet=0.1)


def soil2(seed=11, seconds=2.4, rate=1500, clods=6, hollow=0.3, grit=0.45, tail=0.5, lid_lo=150):
    """Soil shovelled onto a coffin lid: a rush of grit and small stones through the lid's wooden modes, a few
    clods, a light hollow knock, then pebbles trickling and settling."""
    r = dsp.rng(seed); n = dsp.n_of(seconds)
    lid = dsp.modal_cloud(lid_lo, 3500, 50, 0.06, 0.004, 0.3, r, tilt=-3.0)
    envf = lambda t: np.clip(t / 0.05, 0, 1) * (np.exp(-max(0, t - 0.05) / 0.22) + tail * np.exp(-max(0, t - 0.05) / 0.9) * 0.3)
    on = events(seconds, rate, r, lambda t: min(1, envf(t)))
    exc = np.zeros(n)
    for t in on: dsp.place(exc, dsp.contact(r.uniform(0.0001, 0.0005), r, 0.9), t, r.lognormal(-1.2, 0.7))
    for t in r.uniform(0.02, 0.25, clods): dsp.place(exc, dsp.butter(dsp.contact(r.uniform(0.002, 0.005), r, 0.5), 'low', 1500), t, r.uniform(1.0, 2.0))
    y = dsp.excite(exc, lid); y = y[:n] / (np.max(np.abs(y)) + 1e-9)
    box = dsp.excite(dsp.modal([95, 190, 285], [0.09, 0.05, 0.03], [1, .5, .3], seconds, r), dsp.contact(0.005, r, 0.3))
    env = np.array([min(1.0, envf(t)) for t in dsp.t_of(n)])
    g = dsp.butter(dsp.noise(seconds, r, 'pink'), 'band', (1500, 9000)) * env
    out = y + hollow * box / (np.max(np.abs(box)) + 1e-9) + grit * g / (np.max(np.abs(g)) + 1e-9)
    return dsp.mic(fx.reverb(out, r, rt60=0.5, size=0.5, wet=0.1, damp=0.7), r)


import json
_P = json.load(open(os.path.join(os.path.dirname(os.path.abspath(__file__)), 'earshot_params.json')))


def tuned(fn, name, **over):
    """the take earshot_search.py chose for `name`, optionally with overrides (another seed, a filter...)"""
    return lambda: fn(**{**_P[name], **over})


RECIPES = {
    'rain_umbrella': tuned(rain2, 'rain_umbrella', seconds=10.0),
    'rain_window': tuned(rain2, 'rain_umbrella', seconds=10.0, seed=7, lp=2600),            # the same rain, through glass
    'soil_on_lid': tuned(soil2, 'soil_on_lid'),
    'soil_on_lid_2': tuned(soil2, 'soil_on_lid', seed=12), 'soil_on_lid_3': tuned(soil2, 'soil_on_lid', seed=13),
    'cloth_tear_short': tuned(rip, 'cloth_tear_short'), 'cloth_tear_slow': tuned(rip, 'cloth_tear_slow'),
    'chewing_close': tuned(chew2, 'chewing_close'),
    'chewing_muffled': tuned(chew2, 'chewing_close', seed=33, lp=2400),                     # inside a closed coffin
    'candle_snuff': tuned(blow_out, 'candle_snuff'), 'candle_snuff_2': tuned(blow_out, 'candle_snuff', seed=43),
    'phone_buzz': lambda: phone_buzz(51), 'phone_buzz_muffled': lambda: phone_buzz(52, muffled=True),
    'rice_pour': lambda: rice_pour(2.5, 61), 'rice_scatter': lambda: rice_pour(0.6, 62),
    'music_box': lambda: music_box(71), 'music_box_wrong': lambda: music_box(72, rate=0.93, detune=-0.35),
}


def main(names):
    for name in names or list(BANK) + list(RECIPES):
        if name in BANK:
            x, meta = bank.render(BANK[name], seed=1)
            c = meta.get('checks') or {}
            if c and not c.get('ok'): print(f"  {name}: earshot audit: " + '; '.join(w['msg'] for w in c['warnings']))
            save(name, x)
        elif name in RECIPES:
            save(name, RECIPES[name]())
        else:
            sys.exit(f'unknown sound {name}')


if __name__ == '__main__':
    main(sys.argv[1:])
