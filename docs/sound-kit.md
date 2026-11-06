# Horror sound kit (made in code with earshot)

Recorded libraries are out of reach from the cloud machine (Freesound refuses it), so the kit is computed:

- **`sound/earshot_kit.py`**: renders `assets/sfx/<name>.wav` (48 kHz mono).
  - Picks from earshot's shipped bank: impacts, sub drops, dark risers, reverse swells, cloth swipes, a wood knock,
    clicks, a fitted switch flip, a mouth plop.
  - Physical recipes on earshot's DSP blocks for textures the bank lacks: rain, soil on a coffin lid, linen tearing,
    chewing, a candle blown out, a phone buzzing, rice grains, a music box playing Gran's tune.
- **`sound/earshot_search.py`**: tunes the hard textures by ear.
  - It renders variants and scores each with earshot's CLAP critic against its description and the things it could
    be mistaken for.
  - It keeps the winner in `sound/earshot_params.json`.
- **`sound/earshot_listen.py`**: the listening report, written to `assets/sfx/LISTEN.md`.
- **In a story:** `S.sample('soil_on_lid', t, gain, offset=0, dur=None, rate=1.0)` in its `cues.py`
  (`sound/sound_lib.py`). It sits alongside the synthesised drones, music box and heartbeat.

The WAVs are committed, so `sound/build_audio.py` needs nothing extra. earshot is only needed to change or add sounds.

## Setting up earshot (only to re-render)

earshot (github.com/Leonxlnx/earshot, MIT) wants torch. download.pytorch.org is blocked here, so its venv borrows
the torch already installed for Chatterbox:

```bash
git clone --depth 1 https://github.com/Leonxlnx/earshot.git /tmp/earshot
/usr/bin/python3.11 -m venv ~/.venvs/earshot
echo /root/.venvs/chatterbox/lib/python3.11/site-packages > ~/.venvs/earshot/lib/python3.11/site-packages/chatterbox.pth
~/.venvs/earshot/bin/pip install --no-deps /tmp/earshot && ~/.venvs/earshot/bin/pip install matplotlib soxr pyloudnorm
~/.venvs/earshot/bin/earshot doctor --fetch       # CLAP + AST models from huggingface.co, ~1.1 GB
~/.venvs/earshot/bin/python sound/earshot_kit.py  # all sounds, or name a few
```

## How the kit reads (earshot, November 2026)

| Sound | Verdict |
| --- | --- |
| soil on lid (3 takes) | **strong**, ranked #1 of 322 descriptions |
| rain (as "heavy rain") | **strong** |
| music box | **strong** |
| phone buzz | **strong** |
| muffled phone buzz, rice pour, detuned music box | plausible |
| chewing | weak. Earshot's nearest description is "a squishy wet squelch", and it is picked over footsteps or a kick drum 97% of the time. |
| linen tear (short) | weak. It reads partly as static. |
| linen tear (slow), candle snuff | **no match**. The tear reads as a snare roll or spray hiss, and the snuff as a whoosh or hi-hat. Use these only under picture that explains them, or leave them out. |

These are a model's judgements, not a person's. Have someone listen to `out/earshot-kit-audition.mp3` before
trusting the weak ones.
