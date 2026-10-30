---
name: "remotion-video-studio"
description: "Create or revise customized narrated animation videos with Remotion, React, TypeScript, and supporting scripts. Use for animated explainers, educational videos, fact-checks, storytime cartoons, cinematic motion graphics, product demos, YouTube videos, and Shorts. Begin with a detailed audience and creative inquiry; then research, script, audition narration, storyboard, animate, render, inspect, and deliver the finished video plus editable source. Also use when an existing Remotion video needs better motion design, narration, pacing, or audience fit."
---

# Remotion Video Studio

Produce a video whose pictures explain the spoken message and whose style suits
its viewers. Treat simple illustration and sophisticated animation as independent
requirements: a stick-figure request is not permission to deliver rigid sprites.
Match a studio reference by its motion craft rather than copying its art direction. Use this file as the core workflow. For character animation, polished explainers,
or feedback that output looks crude or slideshow-like, also read
[advanced animation](#appendix-a-advanced-animation) before planning shots.
For storytime-comedy or TheOdd1sOut/SagaTheYoungin quality references, also read
[storytime cartoon production](#appendix-b-storytime-animation); use its
art-first, multi-setting route instead of defaulting to a procedural presenter.
The community packages listed at the end are optional references, not prerequisites. Do not silently
install them or inherit their unrelated defaults. Follow the user's requested
scope: a script request stops at scripting; a video request continues to a real
render after the inquiry. Preserve existing projects and user edits.

## 1. Start with inquiry, not generation

Default to an interview before drafting the full script, synthesizing speech,
generating assets, or writing scene code. This is a conversation, not a form dump.
Ask 4–6 focused questions per round, offer concrete choices, and allow free text.
Summarize supplied details first. Ask about the intended angle and boundaries even
when a topic was supplied; do not ask the user to repeat facts already specified.

Cover the following decisions before production. Probe ambiguous adjectives such
as “fancy,” “professional,” “realistic,” or “for everyone” with practical examples.

| Area | Questions to resolve |
| --- | --- |
| Topic and purpose | What exact question should the video answer? Which aspect, timeframe, examples, or misconceptions matter? What should be excluded? Should the piece explain, entertain, persuade, sell, or investigate? What should viewers remember or do? |
| Target audience | What age range or life stage: children, teenagers, adults, mixed ages? Which language, region, cultural context, interests, occupation or education level are relevant? What do viewers already know, misunderstand, or care about? Are they beginners, enthusiasts, professionals, or specialists? |
| Viewing and access | Where will people watch: YouTube, Shorts, class, conference, website, advertisement? Mainly phones, large screens, sound off, or headphones? Any hearing, vision, reading, language-learning, or sensory needs? What jargon, reading load, humor, profanity, or sensitive imagery is appropriate? |
| Duration and format | What runtime or range, and is it a strict limit? Landscape, portrait, square, or multiple versions? Desired resolution, frame rate, delivery deadline, and file format? Does the runtime include credits and the end card? |
| Voiceover | Narration, dialogue, multiple speakers, supplied recording, or no voice? Which spoken language and accent? What perceived age, vocal register or presentation, texture, warmth, authority, energy, pace, emotion, and expressiveness? Any pronunciation examples or reference clips? Which TTS service or local engine, budget, and available access? |
| Animation and visual style | Cartoon 2D, hand-drawn/whiteboard, flat vector, collage, realistic footage/compositing, realistic 3D, isometric, premium/fancy motion graphics, or a hybrid? Characters, mascot, presenter, or objects only? Playful, restrained, cinematic, dramatic, editorial, humorous, or documentary? Any visual references and specific liked/disliked features? Separately, what motion sophistication is expected: limited animatic, polished articulated animation, or complex effects/scene transformations? Which reference moments matter? |
| Story world and settings | Which real, imagined, remembered or metaphorical situations should viewers experience? Which environments establish the premise, illustrate the mechanism, show consequences, or deliver a visual joke? Any required setting changes or recurring locations? |
| Design and sound | Brand colors, fonts, logo, recurring mascot, backgrounds, materials, aspect-ratio-safe areas? Subtitles: none, optional file, burned in, word highlights, language, size, and placement? Music genre/energy, silence, sound-effect intensity, and a version without music? |
| Inputs and constraints | Existing script, sources, screenshots, recordings, footage, character designs, models, brand kit, or project? What can be newly illustrated/generated? Any required factual precision, source display, exclusions, reuse rights, compute limits, external-service restrictions, or production budget? |
| Collaboration | Would the user like to review the script, a voice sample, and one representative animated shot, review only the sample, or delegate production after the brief? Which deliverables besides the video matter: source, captions, clean version, thumbnail, alternate ratios? |

Ask for demographic information only when useful to the brief; an age band is
enough. Do not infer audience age from a cartoon style, expertise from age, or
language from location. Translate audience answers into actual production choices:
vocabulary, assumed knowledge, examples, humor, text density, caption readability,
spoken pace, visual complexity, cultural references, and explanation depth. Ask
what the audience struggles with, not just who they are. For a broad audience,
identify a primary viewer and layer optional detail rather than pleasing everyone.

A suitable first round for a short, vague request:

1. “You mentioned [topic]. Which angle matters most, what must it cover or avoid,
   and what should someone understand afterward?”
2. “Who is it for: age range, language/region, prior knowledge, and main interest
   or problem? Where and how will they watch?”
3. “How long should it run, how strict is that limit, and which platform/shape?”
4. “What voice would fit: language/accent, presentation/register, warmth, energy,
   pace, and emotion? Existing audio, synthetic narration, or no voice?”
5. “What should it look like: cartoon, realistic, hand-drawn, vector, isometric,
   cinematic/premium, or a mix? Any references or things to avoid?”
6. “Do you have assets or brand rules, a budget/service preference, and a preferred
   review process? I can ask about captions and sound in the next round.”

Wait for answers to material creative choices. Do not interpret silence as a
choice. If the user explicitly delegates choices or asks to skip questions,
record reasonable defaults and continue within that instruction; do not force an
interview. If their initial brief already covers everything, recap it and ask
only a useful refinement rather than repeating the questionnaire. Do not confuse
creating this reusable skill with commissioning a particular video.

## 2. Convert answers into a usable brief

Write `brief.md` in the video project. Record topic, takeaway, primary audience,
prior knowledge, objective, format, runtime tolerance, distribution, voice profile,
visual direction, references, assets, captions, sound, constraints, deliverables,
review mode, and unresolved decisions. Mark defaults and supplied requirements.
Include an audience adaptation row explaining what changes because of the audience.
Record the production route (storytime/cel hybrid, rigged cut-out, motion graphics,
footage/composite, or 3D) and a setting-and-story map. For multi-setting requests,
require scenery changes that advance the message, not decorative background swaps.
Record animation sophistication separately from drawing style. When quality is
compared to a reference, translate it into observable motion/staging criteria, not
a vague promise of “premium.” Reduce shot count before silently reducing the motion
standard. Do not equate free tools with low-quality animation.

Resolve conflicts early: a 30-second runtime cannot comfortably contain a lecture;
photorealistic character animation needs suitable assets or a capable generation/
3D pipeline; multiple aspect ratios need layout work. Explain feasible options,
then use the chosen tradeoff. Do not silently downgrade realism to a diagram or
narration to silence. Ask only when a material choice remains unresolved.

Respect the agreed review mode. Offer a short voice audition and a representative
animated shot before the full build; require a response only if the user selected
that checkpoint. Otherwise evaluate samples yourself and proceed. After the brief,
continue through the authorized production steps without routine permission loops.
Do not publish, upload to a public channel, or buy services unless requested.

## 3. Inspect production capabilities and research the topic

Before promising output, inspect the existing project, local instructions, tools,
Node/package manager, installed Remotion version, fonts, browser, FFmpeg/ffprobe,
TTS access, and image/video/3D capabilities. Read package manifests and lockfiles.
Use the project's package manager and keep related Remotion packages at matching
versions. Consult current official documentation for APIs and unfamiliar options;
do not upgrade an existing project or install a large stack just for novelty.
Keep credentials in environment/config outside generated sources and logs.

For facts, maintain `research.md`: claim ID, exact claim, primary source URL/date,
evidence, qualification, confidence, and permitted on-screen wording. Distinguish
reported specifications, demonstrations, independent measurements, estimates,
interpretation, and speculation. Check changing facts close to production. Let
evidence revise a requested premise; never manufacture certainty to match a title.
Label schematic reconstructions, hypothetical examples, generated reconstructions,
and non-scale diagrams when viewers might mistake them for real evidence. Preserve
units, baselines, denominators, versions, and conditions in comparisons.

Track assets in `assets.json`: local path, source, license/permission or generation
provenance, intended shot, credit requirement, and relevant limitations. Capture
actual product interfaces when demonstrating their behavior; use sanitized/demo
data. Do not fabricate testimonials, expert quotes, experiments, citations, or
personal experiences. If reusing upstream code/assets, check its license and
preserve required notices; an installable skill is not blanket asset permission.

If a required service is unavailable, finish independent work and explain the
specific gap. Offer a suitable available alternative. Never imply an audio track,
photoreal scene, browser preview, or MP4 exists when it was not produced.

## 4. Write the script for this audience and runtime

State one central promise early and deliver it. Choose a structure that fits the
purpose: question → explanation → evidence → implication; misconception → test →
correction; character goal → obstacle → resolution; or product problem → mechanism
→ payoff. Do not force every educational video into a sales funnel.

Write speech that is natural aloud: concrete nouns, clear referents, contractions
where appropriate, varied sentence lengths, and one main idea per sentence.
Introduce unfamiliar concepts just before using them. Make examples recognizable
to the specified viewers without stereotyping them. Distinguish comedy and opinion
from factual assertions. Preserve important qualifications when compressing.
Avoid greetings, generic hype, duplicated conclusions, and long closing appeals.

Estimate length before asset work: seconds ≈ words / words-per-minute × 60,
plus deliberate pauses and visual-only holds. Use roughly 130–160 WPM as a first
planning range for general English explanation, then adjust for audience, language,
technical difficulty, performance, and the actual voice. Treat this as a heuristic,
not a platform rule. Cut or restructure an overlong script before accelerating it.
Allow long-form sections and short-form beats to breathe when needed.

Write a parallel visual script: situation, setting, character intention, action,
reaction, camera and reason for each cut. Build visual jokes and consequences into
the story; do not leave the narrator on a blank stage while labels do all the work.
For scene-driven cartoons, plan both establishing context and close acting/detail
shots. Keep hypothetical cutaways identifiable and factual claims supportable.

Store narration separately from citations and performance metadata. Use spoken
forms of numbers, names, abbreviations, units, and currencies when useful to TTS.
Do not pass Markdown, stage directions, “pause here,” or unsupported emotion tags
as speech. Put delivery instructions in fields actually supported by the engine.
Retain on-screen numeric forms alongside spoken forms for captions and diagrams.

## 5. Produce and measure narration before locking the edit

Use supplied audio when requested. Otherwise discover a working TTS interface;
choose the voice from the brief rather than silently defaulting to a generic
narrator. Translate voice references into attributes; do not claim to reproduce
a real person's voice without appropriate authorization and supported capability.
Honor the user's provider/budget constraints; do not bypass TLS verification to
make an engine work. If needed, use the environment's trusted certificate bundle.

Synthesize a 10–20 second representative passage that includes difficult names,
numbers, emotional changes, and ordinary sentences. Listen when playback is
available; check pronunciation, rhythm, artifacts, tone, and breath spacing.
If you cannot listen, record that limit rather than claiming an audition passed.
Use the selected review mode before committing to the full voice. For dialogue,
keep a stable voice identity per speaker and make speaker changes unambiguous.

Generate consistent chunks at sentence/paragraph boundaries; keep a stable voice,
settings, gain, and sample rate. Cache by script + voice + settings so unchanged
sections are reused. Decode compressed chunks to PCM for accurate concatenation;
measure decoded durations rather than estimating MP3 length from byte counts.
Remove unintended gaps without deleting meaningful pauses or altering meaning.
Edit audio before alignment. Any later speech edit invalidates downstream timings.

Obtain real word timestamps from the engine or align the exact transcript against
the finished recording. Keep timestamps in seconds with explicit units and track
provenance. Check names, numbers, contractions, punctuation, language switches,
first/last words, and discontinuities. Never divide total duration evenly across
words and call it alignment. Keep estimated caption timings explicitly provisional.
Use phrase captions rather than conspicuous word highlighting when timing is weak.

Store final audio and `timing.json` as the timing authority. Include segment/word
IDs, text, local start/end, and each audio segment's global offset. Use the same
anchors for scene events, captions, cuts, and SFX; do not maintain drifting copies.
Measure final runtime including intro silence, pauses, transitions, and end cards.

## 6. Design a visual language and a shot plan

Translate “cartoon/realistic/fancy” into explicit art direction: palette, contrast,
type scale, line weight, shape vocabulary, materials, lighting, camera, depth,
character treatment, and motion energy. Put shared tokens in `theme.ts`.

| Direction | Production approach |
| --- | --- |
| Cartoon/character | Create original, cleaned character and setting artwork. Choose authored pose/cel replacement, rigged animation, or a hybrid based on the reference. Use rigs where useful; redraw key silhouettes, turns, hands and extremes the rig cannot express. Keep identity consistent. |
| Whiteboard/editorial diagram | Animate paths, labels, relationships, annotations and focus. Use drawing order to explain the mechanism; keep text readable while strokes build. |
| Flat/vector/isometric | Use clean geometry, masks, controlled depth and meaningful transformations; reuse camera and lighting conventions. |
| Realistic/documentary | Use suitable footage/photos or genuinely generated realistic assets, then composite and annotate. Do not present generated scenes as authentic recordings. |
| Realistic 3D | Use actual models, materials, light and a suitable render pipeline; verify camera, shadows and performance. Pre-render expensive shots when appropriate. Do not promise photorealism from ordinary SVG. |
| Premium/cinematic | Use composition, material, light, purposeful camera moves, measured timing and sound. Select depth, texture or blur sparingly; avoid decorating every object. |

Build a `shotbook.json` or table with: shot ID; duration; narration/word anchors;
visual purpose; setting and its story function; primary subject; asset paths; initial state; meaningful actions;
end state; camera; on-screen text; transition; audio cues; source labels; layout
risks; and QA sampling points. Show what changes, not only what text appears.
Do not choose an arbitrary scene count or one new object per sentence.

Maintain a single focal subject per beat. Sequence related evidence or mechanism
changes around it; remove or subordinate completed material. Give important results
reading time. Use reveal → relationship → consequence when explaining a system.
Avoid endless full-screen text cards, arbitrary zooms, and fixed-interval cuts.
Use stable shot IDs and local component files so revisions stay isolated.
For a scene-driven film, establish distinct, recognizable environments and preserve
spatial continuity within them. Use a location change, viewpoint change, or cutaway
for a narrative reason. Do not repeat the same header, floor line, front-facing
character and caption panel across the film with different floating props.

For example, explaining stored-gas hover can show the same vehicle, an upward
force arrow, gravity, and gas leaving a vessel. Link depletion to an explicit
illustrative model or label it conceptual. Do not imply measured pressure curves
or exact endurance from a decorative gauge animation.

Before the full build, prepare a styleframe and 4–6 action poses for a representative
acting/mechanism sequence. For polished character work, choose the asset/animation route first and plan
contacts, gaze, acting, weight and secondary motion. Use
[advanced animation](#appendix-a-advanced-animation) for motion mechanics and
[storytime production](#appendix-b-storytime-animation) for authored drawing,
setting design, pose replacement, comic editing and its stricter pilot gate.
Optional [motion math](#appendix-c-motion-math) and [pose timing](#appendix-d-pose-timeline)
are implementation aids; the skill supplies no ready-made production avatar.

Render a representative 6–12 second sequence containing the actual hard action,
interaction/reaction and a transition when relevant, with final-looking assets and
real narration when available. A still image, title reveal, or bobbing neutral
character does not satisfy this gate. Inspect the in-betweens as well as poses.
If it reads as stickers beside changing captions, revise before scaling. For storytime/multi-setting work, render an 8–15 second narrative
pilot with final-looking original art, at least two motivated settings/shots, and
a setup, action and reaction; an isolated rig test is insufficient. Pass drawing
and direction quality separately from motion and encoding. If the
user chose sample review, show that concrete preview and wait; otherwise perform
the gate internally and continue without another permission question.

## 7. Animate meaning, not just entrances

Choose techniques by the action being explained. Use staging, anticipation,
follow-through, timing, overlap, and secondary motion where they help the style.
Implement these as visible action-specific changes, not checklist words. Animate
limbs, head, face and body mechanics independently for acting; a whole-figure
translation or sine-wave bounce is not character animation. Maintain foot plants,
hand/prop contacts and readable silhouettes. Keep rigged limb lengths stable unless
controlled cartoon deformation is intended; do not forbid authored pose changes
or expressive drawing substitutions merely to preserve a default rig. Use varied shot
scales so the main action remains legible at the delivery size.
Use stagger to establish hierarchy, not to make a long list take forever.
Eased transitions suit attention shifts; springs suit deliberate physical or
interface-like responses. Use linear motion for genuinely constant velocity,
steady flow, time indicators, or other appropriate quantities. Use actual equations
for physical demonstrations. Do not replace truthful motion with decorative easing.

Use path drawing for connections, masks for reveals, match cuts for comparisons,
layered parallax for space, and state interpolation for before/after changes.
Avoid spring overshoot on factual values or count-ups that imply nonexistent data.
For charts, preserve axis/baseline meaning, units, and consistent color semantics.
For continuity, carry an object, direction, scale, or sound into the next shot.
Choose hard cuts, fades, or longer holds when they communicate better.

Keep motion purposeful. Allow intentional stillness for comprehension; flag long
accidental freezes but do not “fix” them with mandatory breathing, wobble, grain,
parallax or camera shake. Do not force movement into every second. Match camera
amplitude and text speed to audience needs, and avoid rapid flashing.
Stage labels so they do not collide with a moving subject. Check entries, peaks,
exits, overlap, occlusion, and the result at the actual viewing size.

## 8. Implement deterministic Remotion scenes

Keep project responsibilities separate, for example:

```
video-project/
  brief.md  research.md  assets.json  shotbook.json
  public/audio/  public/assets/  public/fonts/
  src/index.tsx  src/Root.tsx  src/theme.ts  src/timing.json
  src/scenes/  src/components/
  scripts/  out/
```

Derive all animation state from the requested frame. Use `useCurrentFrame()` near
the component that needs it, `useVideoConfig()` for FPS/dimensions, `Sequence` or
a documented timing abstraction for placement, and `interpolate()`/`spring()` for
appropriate movement. Convert seconds with a consistent rounding policy. Understand
that a component inside `Sequence` normally sees sequence-local frames; do not
subtract its global offset twice. Define timeline intervals as end-exclusive.

Do not depend on CSS keyframes/transitions, wall-clock animation, `setTimeout`,
`requestAnimationFrame`, `Date.now()`, unseeded randomness, or asynchronous effects
that render different pixels when seeking. For GSAP/anime/Three integrations,
explicitly seek a paused timeline or compute the state for that frame. Use seeded
randomness for stable noise/particles and unique SVG IDs for masks/gradients.

A local-frame reveal pattern, adapted to the installed API:

```tsx
const frame = useCurrentFrame();
const {fps} = useVideoConfig();
const start = Math.round(cue.startSec * fps);
const revealFrames = Math.max(1, Math.round(0.4 * fps));
const opacity = interpolate(frame, [start, start + revealFrames], [0, 1], {
  easing: Easing.bezier(0.22, 1, 0.36, 1),
  extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
});
// Apply this value to a readable label or meaningful visual state.
```

Load local assets with the documented Remotion media components and `staticFile`;
choose audio/video components supported by the installed version, checking current
trimming, timing and volume props. Wait for fonts/media with supported render
readiness mechanisms; handle failures and resolve render-blocking handles. Fetch
remote material before rendering where practical. Keep the final project renderable
without credentials when supplied local assets are sufficient.

Make Composition duration match the full timeline, including transition overlaps.
For dimension variants, recompute layout and text wrapping instead of center-cropping
important content. Test the opening, a dense frame, and a transition early. Expose
useful parameters and editing units in Studio when supported. Preserve package
locks, asset provenance, readable components, and a reproducible render command.
Avoid one giant component, unnecessary per-frame full-tree re-renders, and expensive
filters by default. Adjust render concurrency to memory, not just CPU count.

### Reflective surfaces: geometry, artwork and verification

Treat a reflection as another view of the same scene. Do not duplicate the direct
camera image, flip a front-facing character, or position a second puppet by eye
when the shot requires spatially coherent reflection. Preserve the established
illustration style; correct perspective does not require photorealistic artwork.

1. **Block the space first.** Define the camera, reflective surface position and
   orientation, subject positions, facing directions and relevant set geometry in
   one coordinate system. Check which side of each subject the reflected viewpoint
   sees. A person facing the camera with a mirror behind them usually exposes their
   back to that mirror; showing their front in both views needs a different layout.
   Do not infer reflection content from screen-left/screen-right alone.

2. **Choose an adequate representation.** For a fixed or constrained illustrated
   shot, use calibrated 2.5D geometry with authored front, rear and profile artwork
   as needed. For moving cameras, substantial body turns, intersecting objects or
   complex occlusion, use actual 3D geometry and a depth-buffered reflection pass,
   or pre-render that pass. Reserve simple flipped sprites for intentionally flat
   compositions where their assumptions hold. Treat curved mirrors, rough metal,
   glass transmission/refraction and disturbed water as different surface models;
   a planar mirror solution does not automatically solve them.

3. **Compute planar reflection from the plane.** Define a point `O` on the mirror
   and unit normal `n`. Reflect a world point with
   `P' = P - 2 * n * dot(P - O, n)` and a direction with
   `v' = v - 2 * n * dot(v, n)`. Either project reflected geometry through the real
   camera or render the original scene through a reflected camera with a consistent
   reflected basis and handedness/culling convention. Do not apply both approaches
   to the same pass or add an arbitrary horizontal flip afterward. Keep projection,
   camera motion and mirror orientation shared with the direct scene. Consult
   [Three.js Reflector documentation](https://threejs.org/docs/pages/Reflector.html)
   if choosing that implementation; verify its current API before integration.

4. **Select artwork for the reflected viewpoint.** Use the virtual camera's
   position relative to the character's facing direction to choose rear, profile
   or front art. Match proportions, costume, registration points and prop anchors
   across views. Drive both views from the same frame-derived pose, head turn,
   hands and prop state; do not create an independently timed reflection. For
   illustrated planar cards, derive a projective homography/CSS `matrix3d` from
   reflected card geometry rather than estimating skew and scale. State the limit:
   correct card projection cannot invent an unseen side of a body. During turns,
   check near/far eye size, pupil placement, ear overlap and face occlusion after
   all parent transforms; a mirrored rig can reverse apparent left and right.

5. **Reflect the set and respect visibility.** Build stairs, rails, walls, lights
   and props from shared geometry or consistent depth proxies. Reflect what the
   virtual camera can see, including the opposite wall when appropriate, rather
   than copying the main camera's background. Clip geometry against the mirror
   plane and glass boundary; respect depth order, foreground occlusion and the
   frame's silhouette. Use unique SVG clip/mask IDs. Check Chromium's actual
   render if combining SVG `foreignObject` with projective CSS transforms.

6. **Make intentional omissions explicit.** Apply story rules such as a vampire's
   missing reflection to the relevant actor, while retaining ordinary humans and
   the surrounding set. Define treatment of carried objects separately. For an
   absence used as evidence, project where that subject would appear if reflected
   and verify that location is inside visible, unobstructed glass. Being outside
   the mirror's field of view cannot establish supernatural absence.

7. **Verify geometry and motion before scaling.** Check that reflecting a point
   twice recovers it, points on the plane stay fixed, and any card homography agrees
   with direct point projection at several coordinates. Render a short sequence
   covering the turn/reveal plus start, middle and extreme poses. Inspect front/back
   consistency, near/far features, synchronized hands/props, clipping and occlusion
   at delivery size. Include neighboring beats and camera motion; one attractive
   still cannot validate the reflection. Add tint, scratches, fog, blur and glints
   only after the spatial view works, keeping plot evidence legible.

For an approved replacement, integrate the exact tested implementation, re-render
all affected shots and inspect the final encoded video around the change. Preserve
approved narration and timing when only visuals changed. Follow the existing review
mode; request preview approval only when the user selected that checkpoint. Record
camera/plane calibration, artwork assumptions and known limits in the project.

## 9. Captions, sound and mix

Honor caption choices and the audience's reading needs. Break by readable phrases,
usually one or two lines; keep punctuation and speaker meaning. Do not break names,
units, or closely related phrases unnecessarily. Fit captions to measured speech;
check lead/lag and avoid showing a joke or conclusion prematurely. Leave a margin
for platform controls, faces, diagrams and source labels; inspect on a phone-sized
preview rather than treating a fixed safe-area percentage as universal.

Use music and SFX only when they support the chosen tone and have usable rights.
For narration-led explanation, prioritize speech timing over music beats. For a
music-led promo, measure real beat positions before planning beat-synced cuts.
Place accents at actual semantic/motion events; avoid a whoosh on every entrance.
Lower or duck background sound under speech and soften audio cuts to prevent clicks.

Measure final loudness and peaks. Around −16 LUFS integrated and ≤−1.5 dBTP is a
useful starting delivery target for a narrated web video, not a platform guarantee;
adapt to the destination. Listen for distortion, sibilance, abrupt room-tone changes,
unnatural chunk joins, missing words, and SFX masking consonants. Do not trust
normalization as a substitute for listening. Use FFmpeg loudnorm/analysis when
available; preserve a clean narration asset and avoid repeated lossy re-encoding.

## 10. Render and verify the actual deliverable

Run TypeScript/build checks appropriate to the project, then a short render before
the full export. Choose a local supported Chromium/browser and install it through
normal documented tooling if needed; do not invent browser paths or “fix” TLS by
disabling verification. Use current CLI help or renderer API documentation.

Typical commands; substitute the real entry point and Composition ID:

```sh
npx remotion still src/index.tsx Main out/check.png --frame=90
npx remotion render src/index.tsx Main out/final.mp4 --codec=h264 --crf=18
ffprobe -v error -show_entries format=duration:stream=codec_name,width,height,r_frame_rate -of json out/final.mp4
ffmpeg -v error -ss 12.4 -i out/final.mp4 -frames:v 1 out/check-12s.png
```

Export H.264/AAC MP4 for ordinary web delivery unless another format is requested.
Confirm dimensions, frame rate, audio channels, runtime tolerance, decoding, and
any required transparency. Do not merely rename a different codec/container.
Use low-resolution previews for iteration, then inspect the final-resolution encode.
Cache unchanged assets/voice; optionally render independent segments for long work,
but account for transitions, global audio offsets, handles and exact frame totals.

Use five review passes:

- Technical: decode the final file; verify starts/ends, black gaps, missing media,
  clipping, fonts, aspect-ratio layout, invalid timing, audio presence, caption order,
  and delivery metadata. Require an audio stream only if narration/music was wanted.
- Visual/time: inspect a contact sheet spanning every shot, dense moments and the
  end card. Also watch motion previews around cuts, reveals and synchronization
  anchors; a still frame cannot prove animation or audio sync. Listen to the full
  narration when possible, with special attention to joins and pronunciations.
- Art/direction: judge cleaned line work, original character appeal, pose silhouettes,
  facial acting, environment design, setting changes and varied purposeful framing
  against accessible references. A default puppet with new colors fails a requested
  storytime-quality brief. One material failure cannot be averaged away by technical
  successes; require a concrete correction before scaling the production.
- Motion craft: check distinct key poses, articulation, contact locks, meaningful
  reactions, trajectories/spacing, secondary overlap and continuity against the
  chosen sophistication. Reject all-neutral actors, unmotivated bobbing and repeated
  title–icon–caption layouts when polished animation was requested. Do not claim
  quality from FPS, rendering success or a contact sheet alone.
- Editorial/audience: check factual labels, source fit, message clarity, appropriate
  language and humor, readability, sufficient holds, audience needs, style consistency,
  and whether the opening's promise is fulfilled. Ask whether motion explains the
  idea, not merely whether the frame looks attractive.

Fix material issues, re-render affected output, and check those moments again.
Use a fresh review pass when available, but never claim independent review without
it. Do not loop indefinitely over subjective refinements after required checks pass.
Record what was actually inspected and any unavailable listening/playback capability
in `qa.md`; do not present unperformed viewing or listening as completed verification.

## 11. Deliver and support revisions

Deliver the actual video with its runtime, resolution, and a short account of the
creative choices and material limitations. Include the agreed editable project,
locked dependencies, local assets, script, caption file, source/credit notes,
render command, and optional clean/no-music/alternate-ratio versions. Avoid bundling
node_modules, credentials, caches or unnecessary intermediate renders. Save through
the environment's normal persistent artifact workflow. Do not publish by default.

For a revision, identify the affected shot, script, style token, or voice segment.
Keep approved choices. Regenerate timings downstream of changed speech and rebuild
only what must change; review neighboring transitions and the final mix. Do not
redo the inquiry unless the goal, audience, style, or production constraints changed.

## 12. Reference lineage and current documentation

Use these as sources of techniques, not universal style mandates. This is an
original synthesis. No upstream recipe libraries, source code, or media are bundled;
the optional motion-math and pose-timing helpers included here are original.
Recheck current APIs against the installed version instead of copying old snippets.

- [Remotion agent skills](https://github.com/remotion-dev/skills) and
  [official documentation](https://www.remotion.dev/docs/ai/skills): technical guidance.
- [Animating properties](https://www.remotion.dev/docs/animating-properties),
  [spring](https://www.remotion.dev/docs/spring),
  [audio](https://www.remotion.dev/docs/using-audio), and
  [render CLI](https://www.remotion.dev/docs/cli/render): implementation references.
- [video-talkcraft](https://github.com/Vincentwei1021/video-talkcraft): speech-led
  shot planning, alignment, sample shots, and temporal review.
- [iart explainer skills](https://github.com/iart-ai/explainer-video-skills): explanatory
  structure, diagram direction, and guided reveals.
- [Claude Remotion skill](https://github.com/haidrrrry/claude-remotion-skill): motion
  patterns and render inspection; adapt its stylistic rules to the actual brief.
- [video-shotcraft](https://github.com/Vincentwei1021/video-shotcraft): reusable shot
  thinking, visual direction, product assets, and sound/camera coordination.

Check platform rules, TTS model availability/pricing, software licensing, and
export requirements only when relevant; never freeze changing claims into defaults.


---

## Appendix A: Advanced animation

# Sophisticated animation with simple drawings

Read before storyboarding any polished explainer or character animation. Also read
when a user says crude, basic, stiff, slideshow-like, or names a studio as a motion
reference. Use this alongside SKILL.md, not as a replacement for its inquiry,
research, narration, and rendering requirements.

Contents: [Scope](#separate-the-decisions) · [Diagnosis](#diagnose-before-prescribing) ·
[Design](#build-a-small-visual-development-pack) · [Acting](#specify-actual-performance) ·
[Choreography](#choreograph-the-scene-not-independent-stickers) ·
[Shot specification](#write-an-animatic-and-a-motion-specification) ·
[Rendered gate](#prove-the-standard-before-scaling-it) · [Sources](#sources-and-limits)

For storytime creator benchmarks or multi-setting narrative cartoons, read
[storytime animation](#appendix-b-storytime-animation) as the route-specific standard. Its
artwork, pose replacement and directing requirements take priority over treating
an articulated skeleton as the production method.

## Separate the decisions

Treat four dimensions independently: illustration style, animation sophistication,
information density, and production scope. A stick figure can have sophisticated
acting; an intricate illustration can remain a static slide. “Minimal” describes
the visual design unless the user explicitly asks for minimal animation.

Analyze references for timing, pose clarity, trajectories, layering, transformations,
shot scale, camera motivation and continuity. Translate “smooth like Kurzgesagt”
into those observable properties, not its birds, palette, assets or exact scenes.
Ask for timestamps when they would resolve a real ambiguity; do not repeat the
whole interview after the user has explained the intended quality level.

## Diagnose before prescribing

Inspect the actual supplied video. Resolve it in Library if that is the available
source; do not pretend to see all conversations or inspect a similarly named file.
Check metadata and a contact sheet spanning the whole film. Then examine several
1–3 second sequences at closely spaced frames, including acting, an action climax,
and a transition. View at normal speed and slow speed when a playback tool exists.
If only frames can be inspected, say so; do not equate a filmstrip with watching.

Record timestamped examples. Separate problems in design, posing, articulation,
spacing, continuity, composition, timing, and rendering. Low FPS is not the default
diagnosis: a 30 fps video can be sophisticated, and raising a stiff animation to
60 fps does not add acting. Do not use changed-pixel scores as aesthetic verdicts.

## Build a small visual-development pack

Before full implementation, prepare a styleframe, character/prop model sheet and
an action strip with 4–6 distinct key poses for one representative sequence.
For stick figures, design a readable silhouette, consistent stroke weight and line
caps, clear hands/feet, a small expression vocabulary, and one memorable detail.
Test faces, silhouettes and props at delivery size. Do not spend the budget on
ornament while leaving the hero character tiny and unreadable.

Design foreground, subject, interaction space and background intentionally.
Use close shots for reactions and mechanisms and wider shots for relationships;
vary framing to serve meaning. Keep text a supporting layer. Remove a permanent
headline or diagram frame if it forces the action into a small leftover region.
Do not turn every shot into the same header–icon–caption composition.

## Specify actual performance

For each action, write: intention, eye target, key poses, contacts, trajectory,
timing landmarks, follow-through and resting pose. Give the character an attitude
that changes because something happens. A visual gag needs setup, anticipation,
payoff, a readable reaction and recovery, not just an object label or speech bubble.

Block poses before polishing curves. Use line of action, torso/pelvis shifts and
readable asymmetry. Let eyes lead attention, then head and torso follow as needed.
Coordinate arms and hands with the intention rather than changing them at random.
Preserve planted feet and hand/object contacts; release them deliberately.
Show compression and weight transfer before effort and after impacts. For stylized
flight or falls, coordinate body orientation, limbs, expression and contact shadow.

Use motion in arcs where anatomically sensible. Distinguish the path through space
from the speed along it. Use matched tangents or a continuous trajectory through a
travel phase; use velocity changes deliberately for contacts and comedic accents.
Do not ease every intermediate key to zero or use one sine function for all limbs.
Offset secondary actions from the primary action so joints settle at different
times; keep the delay small and motivated. Animate the silhouette, not just pupils.

Set up an articulated rig: torso/pelvis, neck/head, eye/brow/mouth controls, upper
and lower arms, hands, thighs, shins and feet. Use a transform hierarchy or skeletal
landmarks plus two-bone IK. Keep anatomical lengths stable unless deliberate
cartoon deformation is part of the style. Lock bend directions so knees and elbows
do not flip when a target approaches a straight limb.

`assets/motion-math.ts` supplies optional original numeric tracks, cubic spatial
paths and bounded two-bone IK. `assets/pose-timeline.ts` supports intentional cel
exposure/replacement. Neither contains character art. Create project-specific
assets instead of importing a stock presenter. Smooth numeric tracks stop at keys;
use continuous trajectories or appropriate interpolation for through-movement.
For storytime, choose a hybrid of clean authored drawings and selective rig motion
rather than forcing every pose through a small skeleton vocabulary.

## Choreograph the scene, not independent stickers

Compose primary action, consequence and reaction in a clear order with purposeful
overlap. If a car jumps, wheels/suspension, body tilt, shadow, trails, nearby actors
and the landing should agree on the action. A shadow stays on the receiving plane,
changes with height, and reconnects on landing. A hand holding an object and that
object share an anchor until release. Do not move the whole world to disguise a
static actor. Add ambient movement only when it supports the setting.

Use transitions that carry visual meaning when appropriate: an object becomes the
next diagram, a camera move follows an existing subject, a match cut preserves a
shape/direction, or a mask reveals a new scale of the same mechanism. Keep simple
cuts when clearer. Do not add spectacle to every transition or distort factual
quantities to make a morph convenient. Use motion blur sparingly for fast travel,
with proper temporal sampling; blur and glow cannot repair poor trajectories.

## Write an animatic and a motion specification

Create a rough timed animatic before final assets for multi-shot work. Store the
action in the shotbook with these fields in addition to the main skill's schema:

| Field | Required decision |
| --- | --- |
| Framing | Subject scale, focal hierarchy and location of negative space |
| Acting | Intention, expression, gaze and 4–6 action poses when relevant |
| Body mechanics | Root/hip path, limb contacts, bend directions and weight |
| Spacing | Slow/fast sections, pauses, contact frames and interpolation |
| Secondary motion | What follows what, by how much, and why |
| Scene interaction | Shared anchors, physical effects and cause/reaction order |
| Transition | Incoming/outgoing subject, composition and timing continuity |
| Meaning | What the viewer understands from the motion without reading labels |

Do not impose a fixed number of simultaneous moving elements. Complexity must be
organized. A quiet explanatory hold can be correct; a neutral actor floating beside
changing text is not a substitute for the requested character animation.

## Prove the standard before scaling it

Render a representative 6–12 second sequence containing the hard parts: one acting
or mechanism action, object interaction, meaningful secondary motion, a readable
rest, and a transition if the film depends on transitions. Use final-looking assets,
real timing, and the chosen narration when available. Label a silent motion test
as silent. Do not extrapolate quality from a hero still or a title-card reveal.

If the user delegated production, evaluate this gate internally and continue;
do not add an unsolicited approval stop. If they requested sample sign-off, show
the rendered sample and wait. If the planned sophistication cannot be achieved in
scope, simplify shot count, scene duration or asset count before simplifying all
motion into translations. Explain any material compromise honestly.

First judge the actual drawings, settings and narrative framing; a coherent rig
with poor art direction does not pass. Then check key poses, in-betweens, foot/hand
contacts, eye lines, limb lengths where appropriate, path
continuity, overlap, cropping and transition boundaries. Inspect near endpoints
and turnarounds, not just evenly spaced samples. Use full-speed playback if
available. Automated tests can catch nonfinite coordinates or IK reach failures;
they do not measure appeal, smoothness or acting quality.

Reject the sample and revise when:

- The actor is a single rigid sprite or a neutral pose throughout an acting beat.
- A generic procedural avatar stands in for original production artwork.
- Requested multi-setting storytelling is reduced to one presenter stage with new props.
- Almost all change consists of fades, whole-object sliding/bobbing, or caption swaps.
- Contacts drift, limbs flip, mass changes without cause, or assets pop between states.
- Motion is visible but does not express the action or direct attention.
- Text and persistent chrome dominate while the actual illustration is incidental.
- The request's sophistication is replaced with stock easing, higher FPS, particles,
  gradients, constant camera motion, or extra visual clutter.

Use a review pass focused on these failure modes. A checklist containing the words
“anticipation” and “overlap” does not pass unless those effects are visible in the
render. Keep frame numbers and concrete corrections in qa.md.

## Sources and limits

- [Kurzgesagt's production process](https://kurzgesagt.org/what-we-do?visit=videos):
  illustration and voice-timed animation are distinct, deliberate production stages.
- [School of Motion: character takes](https://schoolofmotion.com/blog/how-to-animate-character-takes):
  acting and reactions as visual storytelling, from subtle to exaggerated.
- [Animation Mentor: overlap](https://www.animationmentor.com/blog/tutorial-overlap-pendulum-motion-animation/):
  coordinated primary and delayed secondary motion.
- [Remotion frame-driven animation](https://www.remotion.dev/docs/animating-properties)
  and [motion blur](https://www.remotion.dev/docs/motion-blur): implementation guidance.

Treat quality as observed output, not a promised studio equivalence. No studio
assets, rigs, code or proprietary shot recipes are included here.


---

## Appendix B: Storytime animation

# Storytime cartoon production

Load this file when the user requests storytime comedy, creator-style cartoon
professionalism, TheOdd1sOut/SagaTheYoungin as quality references, acting across
different settings, or a result that feels drawn and directed rather than an SVG
presenter template. Also load it after feedback that the articulated-rig revision
still looks crude. Keep the audience, narration and evidence rules in SKILL.md.

Contents: [Target](#define-the-target-correctly) · [Diagnosis](#diagnose-the-actual-failure) ·
[Story and settings](#design-the-story-and-its-settings) · [Artwork](#make-project-specific-production-art) ·
[Performance](#animate-drawings-with-intent) · [Timing](#connect-performance-to-narration) ·
[Implementation](#use-remotion-as-the-film-assembly-system) · [Gates](#validate-the-right-things) ·
[Sources](#reference-evidence-and-limits)

## Define the target correctly

Treat the goal as an illustrated performance edited into a story. Clean drawing,
strong silhouettes, expressive acting, chosen holds, comic contrasts, sound and
scene direction work together. More motion, more bones and more pixels are not
substitutes for these decisions. A technically correct rig can still look cheap.

Separate spatial design from temporal design. Storytime work can use pose changes,
held drawings and short bursts of animation while feeling polished and energetic.
Do not interpret “smooth” as “continuously tween everything.” Use stepped changes
for a deliberate punch, shaped in-betweens for an action, and a hold for a reaction.
Keep transitions and object travel fluid when the intended action calls for it.

Extract broad traits from references: staging, shape clarity, expression range,
pose silhouettes, shot/reverse-shot, cutaway logic, timing of exaggeration and
return to the story. Design an original cast and world. Do not import a creator's
actual avatar, assets, dialogue, palette or recognizable scenes as the default.

Build reference-notes.md from accessible examples: URL, time range or image,
what was actually inspected, observed technique, and the project's equivalent.
Distinguish verified observation from user-specified aspirations. A channel listing
or thumbnail cannot establish FPS, in-between timing, or a creator's whole process.
If clips are inaccessible, use primary production guidance and state the remaining
reference limitation; never claim to have watched them. Ask for a specific clip
only if its absence blocks a material choice; otherwise continue with the brief.

## Diagnose the actual failure

Use the user's current output as a regression case. For example, the reviewed
80-second flying-car-animated.mp4 had articulation, but many shots reused the same
front-facing figure, floor line, header/caption frame and isolated objects. At
roughly 9–11 seconds the figure reacts to the car; around 37–39 seconds it returns
to a standing presenter while question labels accumulate. These are different
levels of motion, but neither alone demonstrates the requested storytime finish.

Check at least three independent dimensions:

- Drawing and appeal: intentional contour, proportion, hands, expression and pose;
  compare selected stills at equal display size with the intended reference quality.
- Performance: intention, situation-specific action, reaction and timing; inspect
  transitions between poses rather than checking only that joints move.
- Direction: where the story takes place, camera position, blocking, screen space,
  cuts and the causal connection between scenes.

Do not prescribe a better easing curve for a poor drawing. Do not prescribe a
new background color for a missing story location. Do not call a longer animation
or an arm IK test a validation of the full reference-level production target.

## Design the story and its settings

Write a setting-and-story map before scene code. For a multi-beat storytime film,
use multiple settings that carry the argument, experience or joke. Treat a neutral
narration stage as one possible location, not the film's universal layout. Explain
a necessary single-location treatment rather than defaulting to it for convenience.

| Field | Decision to write before drawing |
| --- | --- |
| Beat and voice cue | The spoken idea and its exact narrative job |
| Situation | What is happening to a character, rather than what a heading says |
| Location and time | The recognizable environment; real, hypothetical, flashback or cutaway |
| Change | What the viewer learns, expects or feels differently by the end |
| Blocking | Where actors/objects are, their eyelines, contacts and movement |
| Shot | Establishing, medium acting, close reaction, reverse angle, insert or diagram |
| Visual joke/evidence | The action, reveal, contrast or source that earns this shot |
| Transition and continuity | Why the cut happens and what carries into the next setting |

Use a location change when it reveals stakes, moves to a consequence, changes
viewpoint, enters an analogy or exposes the mechanism. Establish the space with
enough geometry and props to understand it, then simplify or crop for performance.
Keep perspective, palette, light and scale consistent across angles of the same set.
Differentiate locations through layout and interaction, not merely wall color.
Avoid furniture clutter that contributes neither context nor action.

A useful argument can move between a public claim, an ordinary person's imagined
use, the actual mechanism, and the consequences for another person. Return to an
earlier setting after new knowledge so the callback changes meaning. Do not insert
unrelated locations simply to increase the count. In a 60–90 second film, several
purposeful settings may be appropriate; this is a planning choice, not a quota.

For a flying-car fact-check, a possible sequence is a launch stage selling the
dream → a driver's imagined flying commute → a workshop/cutaway exposing the gas
system → a trading desk examining what prices actually did → the driver's grounded
reality. Each must show an action or evidence, not recycle the same figure next
to a new floating label. Label imagined scenes as illustrations when necessary;
never present a joke as footage or an inference as a measured financial cause.

Create a rough animatic with these settings, poses, cuts and scratch/final speech.
Check whether the visual sequence conveys the message without the headline layer.
If all panels could be exchanged without changing the story, rewrite the sequence.

## Make project-specific production art

Create the art before polishing the rig. Define original character shape language,
relative proportions, line thickness/caps, filled shapes, hands, hair/clothes if
used, expression vocabulary and characteristic attitudes. Simple characters still
need clean silhouettes and well-placed facial features. Do not assume wire limbs,
huge identical pupils, one front view or a rectangular shirt fit every brief.

Prepare a compact, scope-appropriate production pack:

- Character model sheet with relevant front/three-quarter/profile views and a
  readable large expression test; draw back or seated views if the story needs them.
- Distinct action poses that change the torso silhouette, head angle, hands and
  attitude; include at least an anticipation, main action and reaction for the pilot.
- Face/hand variants for the actual performance. For a recurring speaking character,
  design the needed closed/open/rounded/wide mouth forms and intentional eye/brow
  states rather than scaling the same oval mouth throughout the film.
- At least two composed styleframes in different story settings, using final-looking
  characters, environment and typography at delivery size.
- Set layouts with actor space, foreground/background separation, usable props,
  perspective anchors and a palette that relates each location to the same world.

Use authored SVG drawings, cleaned layered illustrations, or appropriately sourced/
generated art within the allowed tools and budget. Prefer consistent layers or
pose assets for animation; a single attractive flattened image cannot supply every
gesture and viewpoint. Verify any generated set for consistency and unwanted text.
Do not send off-model character variants directly into the timeline without cleanup.

Make the selected production path concrete: who/what creates the drawings, how
poses and layers are exported, how assets share registration, and how revisions
are made. If only code-native drawing is available, author suitable Bézier paths
and discrete pose drawings; extra rectangles and circles are not an automatic
approximation of the requested illustration quality. Do not silently downgrade
after discovering an illustration capability is unavailable.

## Animate drawings with intent

Use a hybrid workflow: authored key drawings and facial/hand replacements for
performance, rigs for useful in-between motion, and dedicated transition drawings
for turns, foreshortening or comic extremes that the rig cannot express. Redraw
instead of mechanically distorting a neutral pose beyond its useful range.

Block the most expressive poses first. Test the action as a small strip of drawings:
is its intention readable without captions? Refine construction, pose silhouette,
negative space and eyeline before adding frames. Preserve the character's identity
while allowing controlled exaggeration. Replace a weak key pose rather than trying
to hide it with camera shake, blur, glows or particle effects.

Set key contacts and accents, then add necessary breakdowns. Give different parts
of an action different spacing; don't ease every body part and intermediate pose
to a full stop. Avoid accidental floating, sliding feet, rotating shoulder stickers,
and face controls disconnected from the intention. Use arcs, overlap and weight
where appropriate, but do not make every comic pose obey a rigid anatomical rig.

Use held drawings deliberately and resolve how a new pose arrives: a cut, brief
breakdown, smear, turn, anticipation or actual tween. Avoid cross-fading between
incompatible poses because it produces ghost drawings. A hard pose change can be
the correct choice on a spoken accent. Use time on ones/twos or other exposure
patterns intentionally; do not globally lower FPS to simulate hand-drawn craft.

## Connect performance to narration

Script visual humor, not just sarcastic wording. Give a joke a visual expectation,
reveal and character response. Hold the revealing image long enough to register;
reserve its punchline for the correct speech moment. Vary close reactions, inserts,
imagined cutaways and quieter explanatory shots according to the story.

When a visible character is speaking, choose an appropriate mouth/face plan:
phoneme alignment if supported, broad timed syllable/emphasis shapes, or deliberate
pose-based narration. Do not claim precise lip sync from rough timings. An offscreen
narrator does not require every character to flap its mouth. Let voice performance,
face/pose changes and edit timing agree on the attitude and joke.

Mix voice, silence, impacts, ambience and music according to the selected brief.
Distinct settings can have subtle sound perspectives; voice intelligibility wins.
Do not use a constant stock whoosh or frantic music to imply energy that the
performance and storyboards do not contain.

## Use Remotion as the film assembly system

Organize source into characters/poses, expressions, sets, props, shots, timing and
audio. Store asset IDs, registration points, layers and pose/exposure cues in data.
Render the selected drawings using frame-driven selection, documented media
components and deterministic transforms. Keep logical speech/acting time separate
from any stepped drawing exposure so captions and audio remain synchronized.

Use `assets/pose-timeline.ts` for optional validated pose/exposure selection and
`assets/motion-math.ts` for optional numeric/path/IK calculations. Neither contains
character artwork or determines art direction. Existing projects may retain copied
rigs; the skill no longer ships a generic presenter as ready production art.

Integrate suitable offline SVG/PNG layers, sprite/cel sequences, Lottie/Rive assets
or pre-rendered animation only when their rendering behavior has been verified.
For unseekable real-time engines, render an intermediary or provide a deterministic
seek bridge. Never rely on wall-clock animation during a frame-by-frame export.

## Validate the right things

Pass art and direction before animation polish. Inspect styleframes for two distinct
settings and a meaningful acting strip. Fail a generic skeleton with a new color,
an off-model cast, crude/unclean art, or a dashboard layout masquerading as a film.
Use equal-size reference comparisons when accessible; identify actual differences
rather than marking every dimension “good” because the picture renders.

Next render a representative 8–15 second pilot with actual narration when available,
at least two motivated shots/settings for this multi-setting route, a setup/payoff
or explanatory consequence, a reaction and final-looking artwork. This replaces
the isolated ball-catch or neutral-puppet test as the representative quality gate.
Keep single-action tests for technical debugging, not for claiming full readiness.

Review the pilot on separate dimensions: illustration appeal/cleanup, story and
setting clarity, performance, timing/editing, and technical integrity. A material
failure in any dimension fails the gate; correct joints and a clean encode cannot
offset weak drawings or direction. Evaluate timing in playback when available;
record frame-only limitations. Do not call a proxy or checklist studio equivalence.

Use a fresh visual reviewer when supported, giving the brief, reference evidence,
styleframes and rendered pilot rather than the producer's claim that it is polished.
Ask for concrete drawing/staging/performance defects and fixes. Use self-review if
no independent reviewer is available and label it accurately. Do not let numerical
rig checks or the presence of a setting map stand in for visible film quality.

If delegated, perform these reviews internally without stopping for approval. If
the user selected sample sign-off, show the real sample. Simplify scope or shot count
before reducing the visual standard. If a material capability gap remains, state it
honestly rather than declaring the requested professionality achieved.

## Reference evidence and limits

- [Toon Boom interview with the Oddballs animation team](https://www.toonboom.com/atomic-cartoons-on-bringing-oddballs-from-youtube-to-series):
  primary discussion of TheOdd1sOut's pose-based snappiness, expression-driven boards
  and the limitations of safe/default cut-out poses. It describes an adaptation,
  not an assertion that the YouTube series and Netflix series use identical methods.
- [TheOdd1sOut: The Truth About Making Cartoons](https://www.youtube.com/watch?v=R84W2hbmaKk)
  and [background artist Laura Walsh's episode portfolio](https://laurajeanwalsh.com/to1o-the-truth-about-making-cartoons):
  production and environment-design references; do not copy those assets.
- [Storyboard artist Fern Singleton](https://www.fernsingleton.com/storyboards):
  authored board-work reference and TheOdd1sOut reel listing.
- [SagaTheYoungin's channel](https://www.youtube.com/c/SagaTheYoungin):
  the user's creator benchmark. Only publicly accessible examples actually inspected
  may be claimed as evidence; channel metadata is not motion analysis.

The supplied production guidance is an original synthesis, not either creator's
private workflow, character pack or a guarantee of their output quality.


---

## Appendix C: Motion math

Original optional TypeScript helper. To use it, save the following code as `assets/motion-math.ts` in the skill folder.

```typescript
// Optional deterministic motion math. This module deliberately supplies no character artwork.
export type Point={x:number;y:number};
export type Key={t:number;v:number;ease?:'linear'|'smooth'|'hold'};
export const clamp01=(v:number)=>Math.max(0,Math.min(1,v));
export const mix=(a:number,b:number,t:number)=>a+(b-a)*t;
export const smooth=(v:number)=>{const t=clamp01(v);return t*t*(3-2*t);};
export function track(t:number,keys:readonly Key[]):number{
  if(!keys.length)throw new Error('A track needs at least one key.');
  if(t<=keys[0].t)return keys[0].v;
  for(let i=1;i<keys.length;i++)if(t<=keys[i].t){
    const a=keys[i-1],b=keys[i],span=b.t-a.t;
    if(span<=0)throw new Error('Track times must increase.');
    const p=clamp01((t-a.t)/span),ease=b.ease??'smooth';
    return mix(a.v,b.v,ease==='hold'?(p===1?1:0):ease==='linear'?p:smooth(p));
  }
  return keys[keys.length-1].v;
}
export function cubicPoint(a:Point,b:Point,c:Point,d:Point,t:number):Point{
  const p=clamp01(t),q=1-p;
  return {x:q*q*q*a.x+3*q*q*p*b.x+3*q*p*p*c.x+p*p*p*d.x,
    y:q*q*q*a.y+3*q*q*p*b.y+3*q*p*p*c.y+p*p*p*d.y};
}
/** Two fixed-length segments. Return the reachable tip as well as the elbow.
 * Keep bend sign stable for an action. Do not silently draw the original target. */
export function twoBoneIK(root:Point,target:Point,l1:number,l2:number,bend=1){
  if(l1<=0||l2<=0)throw new Error('Bone lengths must be positive.');
  const dx=target.x-root.x,dy=target.y-root.y,raw=Math.hypot(dx,dy);
  const angle=raw<1e-9?0:Math.atan2(dy,dx);
  const dist=Math.max(Math.abs(l1-l2)+1e-5,Math.min(l1+l2-1e-5,raw));
  const cosine=Math.max(-1,Math.min(1,(l1*l1+dist*dist-l2*l2)/(2*l1*dist)));
  const theta=angle+(bend<0?-1:1)*Math.acos(cosine);
  return {joint:{x:root.x+l1*Math.cos(theta),y:root.y+l1*Math.sin(theta)},
    tip:{x:root.x+dist*Math.cos(angle),y:root.y+dist*Math.sin(angle)},clamped:Math.abs(raw-dist)>1e-4};
}
```


---

## Appendix D: Pose timeline

Original optional TypeScript helper. To use it, save the following code as `assets/pose-timeline.ts` in the skill folder.

```typescript
/** Deterministic cel/pose timing; all intervals are start-inclusive/end-exclusive.
 * Drawings are external project assets. This helper intentionally supplies no avatar. */
export type PoseCue={
  startFrame:number;
  endFrame:number;
  poseId:string;
  exposureFrames?:number;
};
export type PoseSample={poseId:string;cueIndex:number;localFrame:number;drawingFrame:number};
export function validatePoseTrack(cues:readonly PoseCue[],knownPoseIds:readonly string[],durationInFrames:number):void{
  if(!Number.isInteger(durationInFrames)||durationInFrames<1)throw new Error('Invalid duration.');
  if(!cues.length)throw new Error('A pose track must contain cues.');
  const known=new Set(knownPoseIds);let cursor=0;
  for(const cue of cues){
    if(!Number.isInteger(cue.startFrame)||!Number.isInteger(cue.endFrame)||cue.startFrame!==cursor||cue.endFrame<=cue.startFrame)
      throw new Error('Pose cues must be ordered, contiguous, non-overlapping integer intervals.');
    if(!known.has(cue.poseId))throw new Error(`Unknown pose: ${cue.poseId}`);
    const exposure=cue.exposureFrames??1;
    if(!Number.isInteger(exposure)||exposure<1)throw new Error('Exposure must be a positive integer.');
    cursor=cue.endFrame;
  }
  if(cursor!==durationInFrames)throw new Error('Pose track does not cover the exact scene duration.');
}
/** Validate once during setup, then sample each requested local frame.
 * drawingFrame is relative to this cue, not the global video. Use localFrame for
 * continuous subject/camera motion and speech; quantize only intended cel changes. */
export function samplePose(frame:number,cues:readonly PoseCue[]):PoseSample{
  if(!Number.isInteger(frame)||frame<0)throw new Error('Expected a nonnegative integer frame.');
  const i=cues.findIndex(c=>frame>=c.startFrame&&frame<c.endFrame);
  if(i<0)throw new Error(`No pose cue covers frame ${frame}.`);
  const cue=cues[i],localFrame=frame-cue.startFrame,exposure=cue.exposureFrames??1;
  return {poseId:cue.poseId,cueIndex:i,localFrame,drawingFrame:Math.floor(localFrame/exposure)*exposure};
}
```