"""Part II (revised): synthesised soundtrack on the shared picture clock (events.json).
Cold square and street, warm memories of Otto's counter, a heartbeat for the fangs, chain and shutter at the
locked shop, water at the basin, then the tavern: the mirror sting, a thinned bed under the demand, and the reach."""
import json
from pathlib import Path
from sound_lib import boom, click, creak, whoosh, breath, chime, sting, scratch
E = json.loads(Path(__file__).with_name('events.json').read_text()); DUR = E['duration']

def cues(S):
    cut = E['cut']
    S.drone([(0, .2), (E['memory'], .03), (E['recruit'], .16), (E['cover'], .3), (E['turnaway'] + .5, .18), (E['door'], .22),
             (E['coat'], .14), (E['customer'], .05), (E['stairs'], .32), (E['mirror'] - .03, .5), (E['mirror'], .05),
             (E['target'], .2), (E['secret'], .08), (E['turn'], .16), (E['reach'], .38), (E['question'], .5), (cut, 0), (DUR, 0)])
    S.wind([(0, .28), (E['memory'], 0), (E['recruit'], .22), (E['street'], .3), (E['coat'], .015), (cut, 0), (DUR, 0)], gain=.13)
    S.room_tone(E['memory'], E['recruit'], gain=.018)
    S.room_tone(E['coat'], E['customer'], gain=.015)
    S.room_tone(E['customer'], E['stairs'], gain=.018)
    S.room_tone(E['stairs'], cut, gain=.015)
    # warm memories: a few notes of a music box under Otto's counter, both times
    S.music_box(E['memory'], [(0, 12), (1.1, 15), (2.1, 19), (3.2, 17)], stop=E['recruit'], gain=.035)
    S.music_box(E['customer'], [(0, 12), (0.9, 11), (1.8, 8)], stop=E['stairs'], gain=.04)
    S.tension([(0, 0), (E['cover'], .12), (E['turnaway'], .2), (E['evidence'], 0), (E['stairs'], .15), (E['mirror'] - .1, .3), (E['mirror'], 0),
               (E['turn'], .1), (E['reach'], .25), (E['question'], .34), (cut, 0)], gain=.018)
    # the square
    S.sfx_at(whoosh(.6, 160, 700), .2, .05)
    S.sfx_at(scratch(.2, .05), E['scent'] + .7)                      # cloth of the collar
    S.sfx_at(breath(.65, .03), E['familiar'] - .2)                   # you breathe in
    S.sfx_at(chime(2400, .5, .03), E['cloves'] + .05)
    S.sfx_at(click(.4, 1200), E['memory'] + 1.1, .18)                 # the cup set down
    S.sfx_at(creak(.45, .02), E['recruit'] + .4)
    S.sfx_at(chime(1800, .6, .02), E['light'] + .3)                   # lantern swings in
    S.heartbeat_run(E['cover'] - .2, E['turnaway'] + .4, period=.85, shrink=.9, fastest=.55, gain=.25)
    S.sfx_at(boom(1.4, 52), E['cover'] + .05, .14)
    S.sfx_at(whoosh(.35, 200, 1600), E['turnaway'], .08)              # you turn away
    S.sfx_at(whoosh(.3, 200, 700), E['evidence'] + 1.2, .03)          # the thread drawn out
    S.sfx_at(boom(1.2, 60), E['fought'] + .1, .08)
    # the locked shop: the chain, the shutter
    for i in range(6): S.sfx_at(click(.35, 1500 + i * 120), E['door'] + .65 + i * .13, .12)
    S.sfx_at(creak(.9, .05), E['nootto'] + .05)
    for dt in [.3, 1.1, 2.0]: S.sfx_at(boom(.16, 115), E['street'] + dt, .055)   # footsteps
    # the basin
    for dt in [.2, 1.0, 1.8]: S.sfx_at(whoosh(.6, 150, 600), E['coat'] + dt, .03)
    for i in range(4): S.sfx_at(chime(2900 - i * 150, .3, .012), E['torn'] + .6 + i * .28)   # cloves touch the water
    S.sfx_at(boom(1.6, 48), E['customer'] + .1, .12)
    # the stairs and the mirror
    for dt in [.8, 1.75]: S.sfx_at(creak(.35, .032), E['stairs'] + dt)
    S.sfx_at(boom(1.8, 48), E['mirror'] + .9, .16)
    S.sfx_at(sting(1.3, .007), E['mirror'] + .9)
    S.silence(E['mirror'] + 1.85, E['target'] - .2)
    S.silence(E['demand'] - .05, E['turn'] - .05)
    S.sfx_at(creak(.45, .025), E['reach'] + .25)
    S.heartbeat_run(E['reach'], cut, period=1.1, shrink=.93, fastest=.62, gain=.20)
    S.silence(cut, E['title'] - .015)
    S.sfx_at(boom(2.2, 40), E['title'], .12)
