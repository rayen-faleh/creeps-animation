import React from 'react';
import {Composition} from 'remotion';
import {FPS, W, H} from './kit/common/util';
import * as TheCount01 from './episodes/portrait/the-count-01/Main';
import * as Template from './episodes/portrait/_template/Main';
import * as Catalog from './catalog/Catalog';
import * as CatalogLandscape from './catalog/CatalogLandscape';
import * as TheQuarterTurn from './episodes/landscape/the-quarter-turn/Main';
import * as TheQuarterTurnCh1 from './episodes/landscape/the-quarter-turn/ChapterOnePreview';
import * as TheWatch01 from './episodes/portrait/the-watch-01/Main';
import * as TheWatch02 from './episodes/portrait/the-watch-02/Main';
import * as TheWatch03 from './episodes/portrait/the-watch-03/Main';
import * as TheWatch04 from './episodes/portrait/the-watch-04/Main';
import * as TheWatch05 from './episodes/portrait/the-watch-05/Main';
import * as SurviveVampire from './episodes/portrait/survive-vampire/Main';
import * as SurviveWerewolf from './episodes/portrait/survive-werewolf/Main';
import * as WitchBottle01 from './episodes/portrait/witch-bottle-01/Main';
import * as DatingVampire from './episodes/portrait/dating-vampire/Main';
import * as GraveyardShift01 from './episodes/portrait/graveyard-shift-01/Main';
import * as FriendVampire from './episodes/portrait/friend-vampire/Main';
import * as TheSickle from './episodes/portrait/the-sickle/Main';
import * as MyType01 from './episodes/portrait/my-type/Main';
import * as HerRigTest from './episodes/portrait/her-rig-test/Main';

/* Every story registers here: {META: {id, durationSec, format?}, Episode}. Add one line per new story.
   format defaults to portrait (1080x1920); long-form stories pass LANDSCAPE (1920x1080). */
type Story = {META: {id: string; durationSec: number; format?: {W: number; H: number}}; Episode: React.FC};
const STORIES: Story[] = [TheCount01, Template, Catalog, TheWatch01, TheWatch02, TheWatch03, TheWatch04, TheWatch05, CatalogLandscape, TheQuarterTurn, TheQuarterTurnCh1, SurviveVampire, SurviveWerewolf, WitchBottle01, DatingVampire, GraveyardShift01, FriendVampire, TheSickle, MyType01, HerRigTest];

export const RemotionRoot: React.FC = () => (
  <>
    {STORIES.map((s) => (
      <Composition key={s.META.id} id={s.META.id} component={s.Episode} durationInFrames={Math.round(s.META.durationSec * FPS)} fps={FPS} width={s.META.format?.W ?? W} height={s.META.format?.H ?? H} />
    ))}
  </>
);
