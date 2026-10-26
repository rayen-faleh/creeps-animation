import React from 'react';
import {Composition} from 'remotion';
import {FPS, W, H} from './kit/util';
import * as TheCount01 from './episodes/the-count-01/Main';
import * as Template from './episodes/_template/Main';
import * as Catalog from './catalog/Catalog';

/* Every story registers here: {META: {id, durationSec}, Episode}. Add one line per new story. */
const STORIES = [TheCount01, Template, Catalog];

export const RemotionRoot: React.FC = () => (
  <>
    {STORIES.map((s) => (
      <Composition key={s.META.id} id={s.META.id} component={s.Episode} durationInFrames={Math.round(s.META.durationSec * FPS)} fps={FPS} width={W} height={H} />
    ))}
  </>
);
