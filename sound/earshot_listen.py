#!/usr/bin/env python3
"""Listen to the code-made horror kit with earshot's CLAP critic: does each sound read as what it should be?

usage: <earshot venv>/bin/python sound/earshot_listen.py [name ...]   (writes assets/sfx/LISTEN.md)
Each sound is matched against its intended description and the things it could be mistaken for; earshot answers
with a verdict (strong / plausible / weak / no match) and whether an alternative reading scores higher.
"""
import os, sys
from earshot.match import match

CHECKS = {
    'rain_umbrella': ('heavy rain', ['static noise', 'applause', 'frying food']),
    'rain_window': ('heavy rain', ['white noise', 'wind', 'applause']),
    'soil_on_lid': ('dirt and soil shovelled onto a wooden coffin', ['gravel', 'a door knock', 'applause']),
    'soil_on_lid_2': ('dirt and soil shovelled onto a wooden coffin', ['gravel', 'a door knock', 'applause']),
    'soil_on_lid_3': ('dirt and soil shovelled onto a wooden coffin', ['gravel', 'a door knock', 'applause']),
    'cloth_tear_slow': ('fabric being torn slowly', ['fire crackling', 'static', 'paper crumpling']),
    'cloth_tear_short': ('cloth ripping', ['fire crackling', 'static', 'paper crumpling']),
    'chewing_muffled': ('wet chewing sounds, eating', ['footsteps', 'a kick drum', 'water dripping']),
    'chewing_close': ('wet chewing sounds, eating', ['footsteps', 'a kick drum', 'water dripping']),
    'candle_snuff': ('blowing out a candle', ['a cough', 'wind', 'a door knock']),
    'candle_snuff_2': ('blowing out a candle', ['a cough', 'wind', 'a door knock']),
    'phone_buzz': ('a mobile phone vibrating on a table', ['an electric razor', 'a bee buzzing', 'a motor']),
    'phone_buzz_muffled': ('a phone vibrating under a pillow', ['an electric razor', 'a bee buzzing', 'a motor']),
    'rice_pour': ('rice grains pouring onto wood', ['rain', 'static', 'sand']),
    'rice_scatter': ('rice grains scattering on a wooden floor', ['rain', 'static', 'sand']),
    'music_box': ('a music box playing a lullaby', ['a xylophone', 'a piano', 'bells']),
    'music_box_wrong': ('a slow detuned music box', ['a xylophone', 'a piano', 'bells']),
}


def main(names):
    rows = ['# Code-made horror kit, heard by earshot', '',
            'CLAP match of each sound against its intended description and the readings it could be mistaken for.', '',
            '| sound | asked | verdict | summary |', '| --- | --- | --- | --- |']
    for n in names or CHECKS:
        q, alts = CHECKS[n]
        res = match(os.path.join('assets', 'sfx', n + '.wav'), q, alts=alts)
        summ = res.get('summary', '').replace('\n', ' ').replace('|', '/')
        print(f'{n}: {summ}\n')
        rows.append(f"| {n} | {q} | {res.get('verdict', '?')} | {summ} |")
    open(os.path.join('assets', 'sfx', 'LISTEN.md'), 'w').write('\n'.join(rows) + '\n')


if __name__ == '__main__':
    main(sys.argv[1:])
