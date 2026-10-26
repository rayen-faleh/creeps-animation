"""Gothic POV sound engine. Everything is synthesised (no samples, no licences).

A story's cues.py defines DUR (seconds) and cues(S) which places score and effects on a Score.
sound/build_audio.py runs it, mixes the narration under the house rules and masters the result.
All times are global seconds, the same clock as timing.json and the scene code.
"""
import numpy as np
from scipy.signal import butter, sosfilt, fftconvolve

SR = 48000
_rng = np.random.default_rng(1234)

# ---------------------------------------------------------------- filters & helpers
def bp(x, lo, hi, o=2): return sosfilt(butter(o, [lo, hi], 'band', fs=SR, output='sos'), x)
def lp(x, f, o=2): return sosfilt(butter(o, f, 'low', fs=SR, output='sos'), x)
def hp(x, f, o=2): return sosfilt(butter(o, f, 'high', fs=SR, output='sos'), x)
def secs(n): return np.arange(n) / SR

def reverb(x, sec=2.5, wet=0.35, damp=3500, seed=0):
    r = np.random.default_rng(seed); n = int(sec * SR)
    ir = r.standard_normal(n) * np.exp(-np.linspace(0, 7, n)); ir = lp(ir, damp); ir /= np.sqrt(np.sum(ir ** 2))
    return x * (1 - wet) + fftconvolve(x, ir)[: len(x)] * wet

def note(semitones_from_a4): return 440 * 2 ** (semitones_from_a4 / 12)

# ---------------------------------------------------------------- one-shot sounds
def pluck(freq, dur=2.2, bright=0.996):
    """Music-box tine: Karplus-Strong string plus a decaying octave sine."""
    n = int(dur * SR); p = int(SR / freq); buf = _rng.uniform(-1, 1, p); out = np.zeros(n)
    for i in range(n):
        out[i] = buf[i % p]; buf[i % p] = bright * 0.5 * (buf[i % p] + buf[(i + 1) % p])
    tine = np.sin(2 * np.pi * freq * 2 * secs(n)) * np.exp(-secs(n) * 3)
    return (out * 0.6 + tine * 0.5) * np.exp(-secs(n) * 1.2)

def click(gain=1.0, f=4500):
    """30 ms tick: a grain landing, a latch, a torch switch, a clock tick."""
    n = int(0.03 * SR); x = _rng.standard_normal(n) * np.exp(-secs(n) * 260)
    return bp(x, f * 0.6, min(f * 1.6, 20000)) * gain

def whoosh(dur, lo=200, hi=2500, gain=1.0):
    """Air movement: something passing the window, cloth pulled, a sweep."""
    n = int(dur * SR); e = np.sin(np.linspace(0, np.pi, n)) ** 2
    return bp(_rng.standard_normal(n), lo, hi) * e * gain

def boom(dur=2.5, f=42, gain=1.0):
    """Pitch-dropping sub hit: time jumps, reveals, the title card."""
    n = int(dur * SR); tt = secs(n); fr = f * (1 + 1.5 * np.exp(-tt * 9))
    x = np.sin(2 * np.pi * np.cumsum(fr) / SR) * np.exp(-tt * 2.2) + lp(_rng.standard_normal(n), 120) * np.exp(-tt * 6) * 0.5
    return x * gain

def heartbeat():
    n = int(0.35 * SR); tt = secs(n)
    a = np.sin(2 * np.pi * 55 * tt) * np.exp(-tt * 28)
    b = np.zeros(n); k = int(0.17 * SR); b[k:] = np.sin(2 * np.pi * 48 * tt[: n - k]) * np.exp(-tt[: n - k] * 30) * 0.7
    return lp(a + b, 150)

def knock(gain=1.0):
    """Knuckle on oak: a damped low body thump plus a short wood click."""
    n = int(0.25 * SR); tt = secs(n)
    body = np.sin(2 * np.pi * 110 * tt) * np.exp(-tt * 38) + np.sin(2 * np.pi * 180 * tt) * np.exp(-tt * 55) * 0.5
    return (lp(body, 900) + np.concatenate([click(0.5, 1400), np.zeros(n - int(0.03 * SR))])) * gain

def creak(dur=1.5, gain=0.12):
    """Hinge / casement creak: a pitch-swept square wave, band-passed."""
    n = int(dur * SR); tt = secs(n); fr = 420 + 160 * np.sin(tt * 3.1) + 60 * np.sin(tt * 17)
    cr = np.sign(np.sin(2 * np.pi * np.cumsum(fr) / SR)) * (0.5 + 0.5 * np.sin(2 * np.pi * 23 * tt))
    return bp(cr, 300, 3000) * np.sin(np.linspace(0, np.pi, n)) * gain

def scratch(dur=0.16, gain=0.12):
    """Claw on wood: noise gated at 38 Hz."""
    n = int(dur * SR); sc = bp(_rng.standard_normal(n), 1500, 6000) * np.sin(np.linspace(0, np.pi, n))
    return sc * (1 + 0.8 * np.sign(np.sin(secs(n) * 2 * np.pi * 38))) * gain

def breath(dur=0.7, gain=0.12):
    n = int(dur * SR); return bp(_rng.standard_normal(n), 500, 3000) * np.sin(np.linspace(0, np.pi, n)) ** 2 * gain

def chime(freq, dur=0.4, gain=0.05):
    n = int(dur * SR); return np.sin(2 * np.pi * freq * secs(n)) * np.exp(-secs(n) * 14) * gain

def sting(dur=2.2, gain=0.04):
    """High dissonant cluster that rings over a reveal (pair it with a boom)."""
    n = int(dur * SR); x = np.zeros(n); tt = secs(n)
    for f in [1244, 1318, 1396, 1864]: x += np.sin(2 * np.pi * f * tt * (1 + 0.01 * np.sin(tt * 30)))
    return x * np.exp(-tt * 1.8) * gain

# ---------------------------------------------------------------- the score
class Score:
    def __init__(self, dur):
        self.dur = dur; self.N = int(dur * SR); self.T = np.arange(self.N) / SR
        self.music = np.zeros(self.N); self.sfx = np.zeros(self.N); self.amb = np.zeros(self.N)
        self.silences = []  # (a, b): everything but the voice is cut
        self.music_reverb = (3.0, 0.4)

    # placement
    def place(self, buf, sig, t, gain=1.0):
        b = getattr(self, buf); i = int(t * SR); j = min(self.N, i + len(sig))
        if 0 <= i < self.N: b[i:j] += sig[: j - i] * gain
    def sfx_at(self, sig, t, gain=1.0): self.place('sfx', sig, t, gain)
    def curve(self, points):
        """Piecewise-linear gain over time: [(t, g), ...]."""
        ts, gs = zip(*points); return np.interp(self.T, ts, gs)
    def env(self, t0, t1, a=0.05, r=0.3):
        e = np.zeros(self.N); i0, i1 = int(t0 * SR), min(self.N, int(t1 * SR)); seg = np.ones(i1 - i0)
        na, nr = int(a * SR), int(r * SR)
        if na: seg[:na] = np.linspace(0, 1, na)
        if nr: seg[-nr:] *= np.linspace(1, 0, nr)
        e[i0:i1] = seg; return e
    def silence(self, a, b): self.silences.append((a, b))

    # memory: music-box lullaby (A minor). notes = [(t_offset, semitone), ...]
    def music_box(self, start, notes, bass=(), stop=None, gain=0.22):
        cache = {}
        for t0, s in notes:
            if s not in cache: cache[s] = pluck(note(s))
            self.place('music', cache[s], start + t0, gain); self.place('music', cache[s], start + t0 + 0.012, gain * 0.23)
        for t0, s in bass: self.place('music', pluck(note(s), 3.0, 0.998), start + t0, gain * 0.8)
        if stop is not None:  # music box stops dead (time jump)
            m = np.clip((stop - self.T) / 0.25, 0, 1); self.music *= np.where(self.T < stop, 1, 0) * m

    def dawn_chord(self, t0, t1, gain=0.035):
        for f in [note(3), note(7), note(10), note(15)]: self.music += np.sin(2 * np.pi * f * self.T) * self.env(t0, t1, 1.2, 0.5) * gain

    # present: cold drone + tension cluster + night wind
    def drone(self, points, gain=1.0):
        g = self.curve(points)
        for f0, w in [(41.2, 0.35), (55.0, 0.15)]:
            x = np.zeros(self.N)
            for d in [0, 0.13, -0.17, 0.31]:
                ph = 2 * np.pi * (f0 + d) * self.T; x += np.sign(np.sin(ph)) * 0.25 + np.sin(ph * 2) * 0.2
            self.music += lp(x, 220) * g * w * gain
    def tension(self, points, gain=0.03):
        x = np.zeros(self.N)
        for f in [622.3, 659.3, 698.5, 932.3, 987.8]: x += np.sin(2 * np.pi * f * self.T * (1 + 0.004 * np.sin(2 * np.pi * 5.1 * self.T + f)))
        self.music += bp(x, 300, 4000) * self.curve(points) * gain
    def wind(self, points, gain=0.25):
        w = bp(_rng.standard_normal(self.N), 180, 900) * (0.6 + 0.4 * np.sin(2 * np.pi * 0.11 * self.T))
        self.amb += w * self.curve(points) * gain
    def room_tone(self, t0, t1, gain=0.05):
        self.amb += lp(_rng.standard_normal(self.N), 400) * self.env(t0, t1, 0.05, 0.1) * gain

    # patterns
    def patter(self, t0, span, n=900, gain=0.35, tail=0.0):
        """Many grains falling: pouring, scattering, sweeping."""
        for _ in range(n): self.sfx_at(click(_rng.uniform(0.2, 0.6), _rng.uniform(2500, 7000)), t0 + _rng.uniform(0, span) + (_rng.exponential(tail) if tail else 0), gain)
    def heartbeat_run(self, t0, t1, period=1.0, shrink=0.9, fastest=0.48, gain=0.9):
        t = t0
        while t < t1: self.sfx_at(heartbeat(), t, gain); t += period; period = max(fastest, period * shrink)
    def ticks(self, t0, t1, every=1.0, gain=0.55):
        for s in np.arange(t0, t1, every):
            tk = click(1.0, 3200) + np.concatenate([np.zeros(int(0.008 * SR)), click(0.6, 1800)])[: int(0.03 * SR)]
            self.sfx_at(tk, s, gain)
    def knocks(self, t0, count=3, gap=0.42, gain=0.9):
        for i in range(count): self.sfx_at(knock(), t0 + i * gap, gain)

    # ------------------------------------------------------------ final mix
    def mix(self, narration, timing_lines, narration_sr):
        """House mix: dry voice, wet whispers, music/ambience ducked 55% under speech, SFX 30%."""
        from scipy.signal import resample_poly
        nar = resample_poly(narration, SR, narration_sr)
        voice = np.zeros(self.N); voice[: min(self.N, len(nar))] = nar[: self.N]
        wmask = np.zeros(self.N)
        for l in timing_lines:
            if l.get('whisper'): wmask[int(l['start'] * SR): int((l['end'] + 0.05) * SR)] = 1
        voice = reverb(voice * (1 - wmask), 1.2, 0.12, 5000) + reverb(voice * wmask, 3.2, 0.5, 2500) * 1.25
        venv = lp(np.abs(voice), 6); sp = np.clip(venv / (venv.max() * 0.25 + 1e-9), 0, 1)
        music = reverb(self.music, *self.music_reverb)
        bed = (music + self.amb) * (1 - 0.55 * sp) + self.sfx * (1 - 0.3 * sp)
        cut = np.ones(self.N)
        for a, b in self.silences: cut[int(a * SR): int(b * SR)] = 0
        bed *= cut * 0.7
        L = voice + bed; R = voice + np.roll(bed, int(0.0006 * SR))
        st = np.stack([L, R], 1); return st / np.abs(st).max() * 0.89
