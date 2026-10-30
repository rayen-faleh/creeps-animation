> **Source-only edition:** generated audio/video is omitted. Read [RABENFELS-SOURCE-ONLY.md](RABENFELS-SOURCE-ONLY.md) first for the current story map and audio regeneration steps. Statements below about included recordings describe the earlier full-media package.

# Rabenfels — Part II: Cloves

Rendered sequel to Night One.65 seconds; 1080x1920; 30fps; H.264/AAC; Kokoro bm_lewis.

Open the project with Node/npm, then:

~~~bash
npm ci
npx remotion browser ensure
npx remotion studio src/index.ts
~~~

Choose composition **Rabenfels02**. Prior episodes, the final weathered town plates and their original prompts remain included. The new episode is under src/episodes/rabenfels-02. Original resident/prop/landing components are under src/kit; docs/kit-catalog.png shows the updated kit.

Render from the project root:

~~~bash
npx remotion render src/index.ts Rabenfels02 out/rabenfels-part-two.mp4 --codec=h264 --crf=18 --x264-preset=veryfast --audio-codec=aac --audio-bitrate=192k --concurrency=2
~~~

The supplied public/episodes/rabenfels-02/mix.wav is the complete mastered soundtrack, so a normal rerender needs no TTS service, credentials or model download. The editable source includes measured line takes and clean narration.

To revise the narration, install requirements-preview.txt, place kokoro-v1.0.onnx and voices-v1.0.bin from the Kokoro ONNX v1.0 model-files release in voice/, and run:

~~~bash
OMP_NUM_THREADS=2 python3 scripts/narrate.py src/episodes/rabenfels-02 --models voice
# Edit scripts/assemble_cloves.py around the newly measured take durations.
python3 scripts/revise_cloves_voice.py --models voice
python3 scripts/assemble_cloves.py
python3 scripts/build_audio.py rabenfels-02
npx tsc -p .
~~~

Model source: https://github.com/thewh1teagle/kokoro-onnx/releases/tag/model-files-v1.0

script.json stores speech separately from directions. timing.json is the measured caption authority; events.json is the shared picture/sound clock. shots.json, assets.json, brief.md, series-ledger.json and qa.md record the creative decisions, provenance, world state and actual verification. The approved script and post caption are included. Do not change the next action until the following winner is selected.

The zip excludes node_modules, browser caches, model weights, intermediate renders, raw masters and host-only helper code. Install locked dependencies with npm ci. Retained fonts/art/source permissions and previous project documentation remain in place. No posting or public publishing was performed.

Revision after user review: the opening now speaks the winning decision. Stranger dialogue uses regular speech with restrained room reverb. Safwan's far eye and ear have separate geometry and corrected layer order. Character audio settings are editable in scripts/revise_cloves_voice.py and the short_room function in scripts/sound_lib.py.

Approved mirror integration: ClovesBackFigure.tsx supplies Safwan's rear artwork; PlanarReflection.ts and ProjectedMirror.tsx calculate the mirror viewpoint, project the scene geometry and omit vampire characters. Shared stair geometry is used for the real and reflected views. The improved eye perspective is applied to Safwan throughout the episode. See docs/planar-mirror-method.md for calibration and the 2.5D model's limits. The approved narration, subtitles and 65-second edit are unchanged.
