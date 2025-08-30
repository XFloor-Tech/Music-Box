import { useScreenSize } from '@/utils/screen-size';
import { FC } from 'react';
import { TrackBarMobile } from './track-bar-mobile';
import { TrackBar } from './track-bar';

const PlayerBar: FC = () => {
  const size = useScreenSize();

  if (size === 'xs') {
    return <TrackBarMobile />;
  }

  return <TrackBar />;
};

export { PlayerBar };
