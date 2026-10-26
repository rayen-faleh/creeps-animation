import React from 'react';
import {LANDSCAPE} from '../../../kit/common/format';
import {C1} from './scenes/ChapterOne';
import {Episode as Full} from './Main';

/** Review cut: cold open + Chapter I only (same timeline and audio as the full film). */
export const META = {id: 'TheQuarterTurnCh1', durationSec: Math.ceil(C1.end + 0.5), format: LANDSCAPE};
export const Episode: React.FC = () => <Full />;
