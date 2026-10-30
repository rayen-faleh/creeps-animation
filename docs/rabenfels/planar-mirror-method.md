# Planar mirror implementation — approved integration

The user approved this mirror and eye-motion candidate for integration into the full 65-second episode. The implementation is now part of this project. The improved viewer-left/viewer-right eye progression from the prior trial is retained.

## What changes

The previous mirror duplicated a front view. This candidate defines a scene camera, a tilted mirror plane and world-space object positions. Points are reflected across that plane and projected through the scene lens. The virtual camera sees Safwan from behind, so the reflection uses matching rear artwork driven by his existing head-turn and wrist targets. The held lantern uses the same pose anchors. No front-facing face, badge or whistle appears on the back of his coat.

The actual and reflected stair treads/posts come from the same simple three-dimensional geometry. Reflected room geometry is clipped to the front of the mirror plane, sorted by depth, and clipped to the projected glass outline. The ornate frame is projected on that same plane. The mirror view looks toward the opposite room wall, rather than repeating the camera-facing wall.

Vampires remain absent by the story rule. A projection check confirms that the witness's head and hips would fall inside the mirror if he were human, so the empty-stair clue is meaningful.

## Geometry and style

This is a 2.5D illustration system: exact planar reflection and projective placement for the defined scene proxies, with front/back character artwork. It is not a full three-dimensional body model or a general ray tracer. New sets need their own camera/plane calibration, scene geometry and view-appropriate artwork. Intersecting complex geometry or unrestricted camera orbits would benefit from a depth-buffered 3D reflection render pass.

Pure vector/SVG artwork and CSS projective transforms preserve the existing drawing style. No image generation or new dependency is needed. PlanarReflection.ts contains the point/vector reflection, camera, clipping, projection and illustration homography. ProjectedMirror.tsx supplies this shot's reflected geometry and rear-view pass.

The standard reflected-camera approach is documented by Three.js:
https://threejs.org/docs/pages/Reflector.html

This implementation is original and does not vendor Three.js source.

## Preview and validation

The preview covers episode time 47.5–50.5 seconds: 3.000 seconds, 90 frames at30fps,1080x1920 H.264, intentionally silent for motion review. The main episode's audio is unchanged.

TypeScript passes. Numeric checks passed for reflection involution, fixed points on the plane, exact CSS projective mapping at multiple illustration coordinates, rear-facing body/head selection, mirror-plane polygon clipping and witness/human inclusion in the glass field. Rendered proof stills and sequential encoded motion frames are inspected before delivery. No real-time playback or independent review is claimed; the user's review is the next checkpoint.

## Rendering the integrated scene

The mirror and eye components are already part of this full editable project. The normal Rabenfels02 render command in RABENFELS-PART-II-README.md produces the complete episode.

To isolate the approved turn for debugging:

    npx remotion render src/index.ts Rabenfels02 out/mirror-turn.mp4 --frames=1425-1514 --codec=h264 --crf=18 --concurrency=2
