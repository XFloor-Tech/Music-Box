import { FC } from 'react';
import { TrackBar } from './track-bar';
import { useScreenSize } from '@utils/screen-size';
import { TrackBarMini } from './track-bar-mini/track-bar';

const PlayerBar: FC = () => {
  const size = useScreenSize();

  if (!size) {
    return null;
  }

  if (size === 'xs') {
    return <TrackBarMini />;
  }

  return <TrackBar />;
};

export { PlayerBar };
